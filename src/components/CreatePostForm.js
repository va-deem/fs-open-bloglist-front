import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CreatePostForm = ({ handleAddBlog }) => {
  CreatePostForm.propTypes = {
    handleAddBlog: PropTypes.func.isRequired,
  };

  const initialBlogState = {
    title: '',
    author: '',
    url: ''
  }
  const [currentBlog, setCurrentBlog] = useState(initialBlogState);

  const handleTitleChange = ({ target }) =>
    setCurrentBlog({ ...currentBlog, title: target.value });

  const handleAuthorChange = ({ target }) =>
    setCurrentBlog({ ...currentBlog, author: target.value });

  const handleUrlChange = ({ target }) =>
    setCurrentBlog({ ...currentBlog, url: target.value });

  const addBlog = (event) => {
    event.preventDefault();

    handleAddBlog(currentBlog);
    setCurrentBlog(initialBlogState);
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        title
        <input
          type="text"
          value={currentBlog.title}
          name="title"
          onChange={handleTitleChange}
        />
      </div>
      <div>
        author
        <input
          type="text"
          value={currentBlog.author}
          name="author"
          onChange={handleAuthorChange}
        />
      </div>
      <div>
        url
        <input
          type="text"
          value={currentBlog.url}
          name="url"
          onChange={handleUrlChange}
        />
      </div>
      <button>create</button>
    </form>
  );
}


export default CreatePostForm;
