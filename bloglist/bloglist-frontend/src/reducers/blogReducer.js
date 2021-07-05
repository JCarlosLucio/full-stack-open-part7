import blogService from '../services/blogs';
import { setNotification } from './notificationReducer';

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.blogs;
    case 'ADD_BLOG':
      return [...state, action.blog];
    default:
      return state;
  }
};

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch({ type: 'INIT_BLOGS', blogs });
  };
};

export const createBlog = (newBlog) => {
  return async (dispatch) => {
    try {
      const blog = await blogService.create(newBlog);
      dispatch({ type: 'ADD_BLOG', blog });
      dispatch(
        setNotification({
          alert: 'success',
          message: `a new blog ${blog.title} by ${blog.author} added`,
        })
      );
    } catch (error) {
      console.error(error);
      dispatch(setNotification({ alert: 'error', message: error.message }));
    }
  };
};

export default blogReducer;
