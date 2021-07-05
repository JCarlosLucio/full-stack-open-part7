import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBlog } from '../reducers/blogReducer';
import PropTypes from 'prop-types';

const BlogForm = ({ toggleForm }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const dispatch = useDispatch();

  const addBlog = (event) => {
    event.preventDefault();
    const newBlog = { title, author, url };
    dispatch(createBlog(newBlog));
    setTitle('');
    setAuthor('');
    setUrl('');
    toggleForm();
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        <label htmlFor="title">title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        <label htmlFor="author">author:</label>
        <input
          type="text"
          id="author"
          name="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        <label htmlFor="url">url:</label>
        <input
          type="text"
          id="url"
          name="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button id="create-blog-button" type="submit">
        create
      </button>
    </form>
  );
};

BlogForm.propTypes = {
  toggleForm: PropTypes.func.isRequired,
};

export default BlogForm;
