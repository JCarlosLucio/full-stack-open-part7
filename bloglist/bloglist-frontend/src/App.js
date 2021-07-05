import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BlogForm from './components/BlogForm';
import BlogList from './components/BlogList';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import { initializeBlogs } from './reducers/blogReducer';
import { initializeUser, logout } from './reducers/userReducer';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(initializeUser());
    dispatch(initializeBlogs());
  }, []);

  if (!user) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in
        <button onClick={() => dispatch(logout())}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm toggleForm={() => blogFormRef.current.toggleVisibility()} />
      </Togglable>
      <BlogList user={user} />
    </div>
  );
};

export default App;
