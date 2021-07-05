import React from 'react';
import { useDispatch } from 'react-redux';
import { useField } from '../hooks';
import { createBlog } from '../reducers/blogReducer';
import PropTypes from 'prop-types';

const BlogForm = ({ toggleForm }) => {
  const { reset: resetTitle, ...title } = useField('text');
  const { reset: resetAuthor, ...author } = useField('text');
  const { reset: resetUrl, ...url } = useField('text');

  const dispatch = useDispatch();

  const addBlog = (event) => {
    event.preventDefault();
    const newBlog = {
      title: title.value,
      author: author.value,
      url: url.value,
    };
    dispatch(createBlog(newBlog));
    resetTitle();
    resetAuthor();
    resetUrl();
    toggleForm();
  };

  return (
    <React.Fragment>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="title">title:</label>
          <input id="title" name="title" {...title} />
        </div>
        <div>
          <label htmlFor="author">author:</label>
          <input id="author" name="author" {...author} />
        </div>
        <div>
          <label htmlFor="url">url:</label>
          <input id="url" name="url" {...url} />
        </div>
        <button id="create-blog-button" type="submit">
          create
        </button>
      </form>
    </React.Fragment>
  );
};

BlogForm.propTypes = {
  toggleForm: PropTypes.func.isRequired,
};

export default BlogForm;
