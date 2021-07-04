import React from 'react';

const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }

  return (
    <div className={`notification ${notification.alert}`}>
      {notification.message}
    </div>
  );
};

export default Notification;
