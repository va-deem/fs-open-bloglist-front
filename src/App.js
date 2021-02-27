import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogService';
import loginService from './services/loginService';
import './App.css';
import Notification from './components/Notification';
import CreatePostForm from './components/CreatePostForm';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    );
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    console.log('logging in with', username, password);

    try {
      const user = await loginService.login({
        username, password,
      });

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      );

      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setNotification({
        type: 'error',
        message: 'Wrong credentials'
      }
      );
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser');
    setUser(null);
  };

  const handleAddBlog = async (newBlogPost) => {
    const createdBlog = await blogService.create(newBlogPost);
    if (createdBlog) {
      setBlogs([...blogs, createdBlog]);
      setNotification({
        type: 'success',
        message: 'Post added',
      }
      );
      blogFormRef.current.toggleVisibility();
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } else {
      setNotification({
        type: 'error',
        message: 'Error saving post'
      }
      );
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  const handleAddLike = async (id) => {
    const blog = blogs.find(blog => blog.id === id);
    const newBlog = { ...blog, likes: blog.likes + 1 };
    const updatedBlog = await blogService.updatePost(id, newBlog);
    const newBlogs = blogs.map(blog => blog.id === id ? { ...newBlog } : blog);

    if (updatedBlog) {
      setBlogs(newBlogs);
    } else {
      setNotification({
        type: 'error',
        message: 'Error updating post'
      }
      );
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  const handleDelete = async (id) => {
    const blog = blogs.find(blog => blog.id === id);
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.deletePost(id);
        const newBlogs = blogs.filter(blog => blog.id !== id);
        setBlogs(newBlogs);
      } catch (e) {
        const errorMessage = e.response.data.error ? e.response.data.error : e.message;
        setNotification({
          type: 'error',
          message: errorMessage,
        }
        );
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      }
    }
  };


  if (!user) {
    return (
      <div>
        <Notification notification={notification} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              id="username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              id="password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <Notification notification={notification} />
      <h2>blogs</h2>
      <p>{user.name} logged-in {user.id}</p>
      <button onClick={handleLogout}>logout</button>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <CreatePostForm handleAddBlog={handleAddBlog} />
      </Togglable>
      {blogs.sort((a, b) => {
        return b.likes - a.likes;
      }).map(blog =>
        <Blog key={blog.id} blog={blog} handleAddLike={handleAddLike}
          handleDelete={handleDelete} user={user} />
      )}
    </div>
  );
};

export default App;
