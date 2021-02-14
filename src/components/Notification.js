import React from 'react';

const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }

  return (
    <div className={notification.type === 'error' ? 'error' : 'success'}>
      {notification.message}
    </div>
  );
};

export default Notification;
