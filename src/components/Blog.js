import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, handleAddLike, handleDelete, user }) => {
  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    handleAddLike: PropTypes.func,
    handleDelete: PropTypes.func,
    user: PropTypes.object,
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  };
  const [blogVisible, setBlogVisible] = useState(false);

  const showWhenVisible = { display: blogVisible ? '' : 'none' };

  const toggleVisibility = () => {
    setBlogVisible(!blogVisible);
  };

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author}
      <button onClick={toggleVisibility}>
        {blogVisible ? 'hide' : 'view'}
      </button>
      <div style={showWhenVisible} className='drop-section'>
        <p>{blog.url}</p>
        <p>{blog.likes}
          <button onClick={() => handleAddLike(blog.id)}>like</button>
        </p>
        <p>{blog.author}</p>
        {blog.user === user.id ? (<p>
          <button onClick={() => handleDelete(blog.id)}>remove</button>
        </p>) : ''}
      </div>
    </div>
  );
};

export default Blog;
