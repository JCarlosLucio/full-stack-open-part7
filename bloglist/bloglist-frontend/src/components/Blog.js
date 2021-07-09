import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likeBlog, removeBlog } from '../reducers/blogReducer';
import { useHistory, useParams } from 'react-router-dom';

const Blog = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === id)
  );
  console.log('blog', blog);
  const user = useSelector((state) => state.user);

  if (!blog || !user) {
    return null;
  }

  const like = () => dispatch(likeBlog(blog));

  const remove = () => {
    const result = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    );
    if (result) {
      dispatch(removeBlog(blog));
      history.push('/');
    }
  };

  const showWhenOwner = {
    display: user?.username === blog.user.username ? '' : 'none',
  };

  return (
    <div className="blog">
      <div className="blog-title">
        <h2>
          {blog.title} {blog.author}
        </h2>
      </div>
      <div className="blogDetails">
        <div>
          <a href={blog.url}>{blog.url}</a>
        </div>
        <div>
          <span className="likes">{blog.likes}</span> likes
          <button className="like-button" onClick={like}>
            like
          </button>
        </div>
        <div>added by {blog.user.name}</div>
        <div style={showWhenOwner}>
          <button className="remove-button" onClick={remove}>
            remove
          </button>
        </div>
        <div>
          <h3>comments</h3>
          <ul>
            {blog.comments.map((comment) => (
              <li key={comment.id}>{comment.content}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Blog;
