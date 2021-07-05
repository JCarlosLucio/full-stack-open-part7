import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, likeBlog, removeBlog, user }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible(!visible);

  const showDetails = { display: visible ? '' : 'none' };

  const showWhenOwner = {
    display: user?.username === blog.user.username ? '' : 'none',
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button className="toggle-view-button" onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      <div className="blogDetails" style={showDetails}>
        <div>{blog.url}</div>
        <div>
          likes <span className="likes">{blog.likes}</span>
          <button className="like-button" onClick={likeBlog}>
            like
          </button>
        </div>
        <div>{blog.user.name}</div>
        <div style={showWhenOwner}>
          <button className="remove-button" onClick={removeBlog}>
            remove
          </button>
        </div>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
};

export default Blog;
