import React from 'react';
import PropTypes from 'prop-types';
import { useField } from '../hooks';
import { useDispatch } from 'react-redux';
import { createComment } from '../reducers/blogReducer';

const CommentForm = ({ blog }) => {
  const dispatch = useDispatch();
  const { reset, ...content } = useField('text');

  const addComment = (event) => {
    event.preventDefault();
    dispatch(createComment(blog, content.value));
    reset();
  };

  return (
    <form onSubmit={addComment}>
      <input id="content" name="content" {...content} />
      <button id="add-comment-button" type="submit">
        add comment
      </button>
    </form>
  );
};

CommentForm.propTypes = {
  blog: PropTypes.object.isRequired,
};

export default CommentForm;
