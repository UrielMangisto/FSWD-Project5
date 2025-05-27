import React from 'react';
const RegisterPage = ({ onRegisterSuccess }) => (
  <div>
    <h2>דף הרשמה</h2>
    {/* כאן תוכל להוסיף טופס הרשמה אמיתי */}
    <button onClick={() => onRegisterSuccess({ username: 'demo' })}>הרשם דמו</button>
  </div>
);
export default RegisterPage;