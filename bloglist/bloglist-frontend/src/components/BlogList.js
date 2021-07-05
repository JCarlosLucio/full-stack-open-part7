import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likeBlog, removeBlog } from '../reducers/blogReducer';
import Blog from './Blog';

const BlogList = ({ user }) => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);

  const like = (blog) => dispatch(likeBlog(blog));

  const remove = (blog) => {
    const result = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    );
    if (result) {
      dispatch(removeBlog(blog));
    }
  };

  return (
    <React.Fragment>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={() => like(blog)}
          removeBlog={() => remove(blog)}
          user={user}
        />
      ))}
    </React.Fragment>
  );
};

export default BlogList;
