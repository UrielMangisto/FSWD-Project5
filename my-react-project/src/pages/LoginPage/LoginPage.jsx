// src/pages/LoginPage/LoginPage.jsx

import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import { login } from '../../api';

const LoginPage = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);
      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setError(result.message || 'שם משתמש או סיסמה שגויים');
      }
    } catch (err) {
      setError('שגיאה בהתחברות לשרת. נסה שוב מאוחר יותר.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>כניסה למערכת</h1>
          <p className={styles.subtitle}>הכנס את פרטי הכניסה שלך</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              שם משתמש
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="הכנס שם משתמש"
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              סיסמה
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="הכנס סיסמה"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'מתחבר...' : 'כניסה'}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            אין לך חשבון?{' '}
            <a href="/register" className={styles.registerLink}>
              הירשם כעת
            </a>
          </p>
        </div>

        {/* Demo Instructions */}
        <div className={styles.demoSection}>
          <h3 className={styles.demoTitle}>פרטי כניסה לדמו:</h3>
          <div className={styles.demoList}>
            <div className={styles.demoItem}>
              <span>שם משתמש: <code className={styles.demoCode}>Bret</code></span>
              <span>| סיסמה: <code className={styles.demoCode}>hildegard.org</code></span>
            </div>
            <div className={styles.demoItem}>
              <span>שם משתמש: <code className={styles.demoCode}>Antonette</code></span>
              <span>| סיסמה: <code className={styles.demoCode}>anastasia.net</code></span>
            </div>
            <div className={styles.demoItem}>
              <span>שם משתמש: <code className={styles.demoCode}>Samantha</code></span>
              <span>| סיסמה: <code className={styles.demoCode}>ramiro.info</code></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;