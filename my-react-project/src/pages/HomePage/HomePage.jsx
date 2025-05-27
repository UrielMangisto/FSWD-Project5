import React from 'react';
const HomePage = ({ user, onLogout }) => (
  <div>
    <h2>ברוך הבא, {user?.username || 'משתמש'}</h2>
    <button onClick={onLogout}>התנתק</button>
  </div>
);
export default HomePage;