import React from 'react';
import { Link } from 'react-router-dom';
import styles from './RegisterStep1.module.css';

const RegisterStep1 = ({ formData, error, loading, onChange, onSubmit }) => {
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={onSubmit}>
        <h2 className={styles.title}>רישום - שלב 1</h2>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>שם משתמש:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={onChange}
            required
            className={styles.input}
            placeholder="בחר שם משתמש ייחודי"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>סיסמה:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            required
            className={styles.input}
            placeholder="בחר סיסמה"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>אימות סיסמה:</label>
          <input
            type="password"
            name="verifyPassword"
            value={formData.verifyPassword}
            onChange={onChange}
            required
            className={styles.input}
            placeholder="הכנס את הסיסמה שוב"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`${styles.button} ${loading ? styles.buttonDisabled : ''}`}
        >
          {loading ? 'בודק...' : 'המשך'}
        </button>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.link}>
          <Link to="/login" className={styles.linkText}>
            יש לך כבר חשבון? התחבר כאן
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterStep1;