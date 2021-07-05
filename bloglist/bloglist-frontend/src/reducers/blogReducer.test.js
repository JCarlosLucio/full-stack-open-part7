import deepFreeze from 'deep-freeze';
import blogReducer from './blogReducer';

describe('blogReducer', () => {
  const initialState = [
    {
      likes: 0,
      title: 'Testing is good',
      author: 'Yoshi',
      url: 'http://testblog.dev',
      user: {
        username: 'yoshi',
        name: 'Yoshi Tester',
        id: '1',
      },
      id: '1',
    },
  ];

  test('should initialize all blogs to state', () => {
    const action = {
      type: 'INIT_BLOGS',
      blogs: initialState,
    };
    const state = initialState;
    deepFreeze(state);
    const newState = blogReducer(state, action);
    expect(newState).toEqual(action.blogs);
  });

  test('should add blog to state', () => {
    const action = {
      type: 'ADD_BLOG',
      blog: {
        likes: 0,
        title: 'blog to add',
        author: 'Yoshi',
        url: 'http://addblog.dev',
        user: {
          username: 'yoshi',
          name: 'Yoshi Tester',
          id: '1',
        },
        id: '2',
      },
    };
    const state = initialState;
    deepFreeze(state);
    const newState = blogReducer(state, action);
    expect(newState).toHaveLength(2);
    expect(newState).toContainEqual(action.blog);
  });
});
