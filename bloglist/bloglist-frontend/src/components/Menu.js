import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../reducers/loginReducer';

const Menu = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const style = {
    backgroundColor: 'lightgrey',
    padding: 5,
    margin: 5,
  };

  return (
    <nav style={style}>
      <Link to="/">blogs</Link>
      <Link to="/users">users</Link>
      <span>
        {user.name} logged in
        <button onClick={() => dispatch(logout())}>logout</button>
      </span>
    </nav>
  );
};

export default Menu;
