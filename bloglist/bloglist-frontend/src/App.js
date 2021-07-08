import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import BlogList from './components/BlogList';
import LoginForm from './components/LoginForm';
import Menu from './components/Menu';
import Notification from './components/Notification';
import User from './components/User';
import UserList from './components/UserList';
import Togglable from './components/Togglable';
import { initializeBlogs } from './reducers/blogReducer';
import { initializeUser } from './reducers/loginReducer';

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
      <Menu />
      <h2>blog app</h2>
      <Notification />

      <Switch>
        <Route path="/users/:id">
          <User />
        </Route>

        <Route path="/blogs/:id">
          <Blog />
        </Route>

        <Route path="/users">
          <UserList />
        </Route>

        <Route path="/">
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm
              toggleForm={() => blogFormRef.current.toggleVisibility()}
            />
          </Togglable>
          <BlogList />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
