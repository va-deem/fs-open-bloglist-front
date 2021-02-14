import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogService';
import loginService from './services/loginService';
import './App.css';
import Notification from './components/Notification';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [currentBlog, setCurrentBlog] = useState({title: '', author: '', url: '' });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    );
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser');

    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, [])

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
          message: `Wrong credentials`
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
  }

  const handleAddBlog = async (event) => {
    event.preventDefault();

    const newBlog = await blogService.create(currentBlog);
    console.log(newBlog);
    if (newBlog) {
      setBlogs([...blogs, newBlog]);
      setNotification({
          type: 'success',
          message: `Post added`,
        }
      );
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } else {
      setNotification({
          type: 'error',
          message: `Error saving post`
        }
      );
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }

  }

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
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
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
      <p>{user.name} logged-in</p>
      <button onClick={handleLogout}>logout</button>

      <form onSubmit={handleAddBlog}>
        <div>
          title
          <input
            type="text"
            value={currentBlog.title}
            name="title"
            onChange={({ target }) => setCurrentBlog({ ...currentBlog, title: target.value })}
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={currentBlog.author}
            name="author"
            onChange={({ target }) => setCurrentBlog({ ...currentBlog, author: target.value })}
          />
        </div>
        <div>
          url
          <input
            type="text"
            value={currentBlog.url}
            name="url"
            onChange={({ target }) => setCurrentBlog({ ...currentBlog, url: target.value })}
          />
        </div>
        <button>Create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  );
};

export default App;
