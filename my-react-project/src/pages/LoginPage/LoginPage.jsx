// src/pages/LoginPage/LoginPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { login } from '../../api/authApi'; // ✅ השתמש ב-API קיים

const LoginPage = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);
      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setError(result.message || 'שם משתמש או סיסמה שגויים');
      }
    } catch (err) {
      setError('שגיאה בתקשורת עם השרת');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>התחברות</h2>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>שם משתמש:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="הכנס שם משתמש"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>סיסמה:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="הכנס סיסמה (website)"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`${styles.button} ${loading ? styles.buttonDisabled : ''}`}
        >
          {loading ? 'מתחבר...' : 'התחבר'}
        </button>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.link}>
          <Link to="/register" className={styles.linkText}>
            אין לך חשבון? הירשם כאן
          </Link>
        </div>

        <div className={styles.demoSection}>
          <strong>משתמשים לדוגמה:</strong><br />
          • Bret / hildegard.org<br />
          • Antonette / anastasia.net<br />
          • Samantha / ramiro.info
        </div>
      </form>
    </div>
  );
};

export default LoginPage;