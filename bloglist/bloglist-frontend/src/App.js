import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser');
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      setUser(loggedUser);
      blogService.setToken(loggedUser.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user));
      blogService.setToken(user.token);

      setUser(user);
      setUsername('');
      setPassword('');
      setNotification({
        type: 'success',
        message: `Welcome back, ${user.name}!`,
      });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (error) {
      console.error(error.response.data.error);
      setNotification({ type: 'error', message: error.response.data.error });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const addBlog = async (blogObject) => {
    try {
      const savedBlog = await blogService.create(blogObject);
      setBlogs([...blogs, savedBlog]);
      blogFormRef.current.toggleVisibility();
      setNotification({
        type: 'success',
        message: `a new blog ${blogObject.title} by ${blogObject.author} added`,
      });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (error) {
      console.error(error);
      setNotification({ type: 'error', message: error.response.data.error });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const likeBlog = async (id) => {
    const blogToLike = blogs.find((blog) => blog.id === id);
    const likedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1,
      user: blogToLike.user.id,
    };

    try {
      await blogService.update(id, likedBlog);
      setBlogs(
        blogs.map((blog) =>
          blog.id !== id ? blog : { ...blogToLike, likes: blogToLike.likes + 1 }
        )
      );
    } catch (error) {
      console.error(error);
      setNotification({ type: 'error', message: error.response.data.error });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser');
    blogService.setToken(null);
    setUser(null);
    setNotification({
      type: 'success',
      message: 'You have been logged out successfully',
    });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const removeBlog = async (id) => {
    const blogToRemove = blogs.find((blog) => blog.id === id);
    const result = window.confirm(
      `Remove blog ${blogToRemove.title} by ${blogToRemove.author}?`
    );
    if (result) {
      try {
        await blogService.remove(id);
        setBlogs(blogs.filter((blog) => blog.id !== id));
        setNotification({
          type: 'success',
          message: `Removed ${blogToRemove.title} successfully`,
        });
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      } catch (error) {
        console.error(error);
        setNotification({ type: 'error', message: error.response.data.error });
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      }
    }
  };

  if (!user) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification notification={notification} />
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <h2>create new</h2>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={() => likeBlog(blog.id)}
            removeBlog={() => removeBlog(blog.id)}
            user={user}
          />
        ))}
    </div>
  );
};

export default App;
