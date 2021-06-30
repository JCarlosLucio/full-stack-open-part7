import React from 'react';

const Notification = ({ notification }) => {
  return notification ? <p>{notification}</p> : null;
};

export default Notification;
