import userReducer from './userReducer';
import deepFreeze from 'deep-freeze';

describe('userReducer', () => {
  const initialState = {
    username: 'user',
    name: 'User',
    token: '1',
  };
  test('should set user state', () => {
    const action = {
      type: 'SET_USER',
      user: {
        username: 'yoshi',
        name: 'Yoshi',
        token: '2',
      },
    };
    const state = initialState;
    deepFreeze(state);
    const newState = userReducer(state, action);
    expect(newState).toEqual(action.user);
  });

  test('should clear user state', () => {
    const action = {
      type: 'CLEAR_USER',
    };
    const state = initialState;
    deepFreeze(state);
    const newState = userReducer(state, action);
    expect(newState).toBe(null);
  });
});
