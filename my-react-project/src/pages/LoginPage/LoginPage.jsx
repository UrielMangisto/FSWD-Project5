// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general message
    if (message) {
      setMessage('');
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'שם המשתמש נדרש';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'הסיסמה נדרשת';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const result = await login(formData.username, formData.password);
      
      if (!result.success) {
        setMessage(result.message);
      }
      // If successful, user will be redirected by the router
    } catch (error) {
      setMessage('שגיאה בהתחברות לשרת');
    }
  };

  // Fill demo user data
  const fillDemoUser = (username, password) => {
    setFormData({ username, password });
    setErrors({});
    setMessage('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>התחברות</h1>
          <p>ברוכים הבאים חזרה למערכת</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username">שם משתמש</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              placeholder="הכנס שם משתמש"
              disabled={isLoading}
              autoComplete="username"
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">סיסמה</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="הכנס סיסמה"
              disabled={isLoading}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className={`auth-submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'מתחבר...' : 'התחבר'}
          </button>

          {/* Error/Success Message */}
          {message && (
            <div className="auth-message error">
              {message}
            </div>
          )}
        </form>

        {/* Register Link */}
        <div className="auth-footer">
          <p>
            אין לך חשבון? 
            <Link to="/register" className="auth-link">
              הירשם כאן
            </Link>
          </p>
        </div>

        {/* Demo Users Info */}
        <div className="demo-info">
          <h3>משתמשי דמו לבדיקה:</h3>
          <div className="demo-users">
            <div className="demo-user" onClick={() => fillDemoUser('Bret', 'hildegard.org')}>
              <strong>משתמש:</strong> Bret <br />
              <strong>סיסמה:</strong> hildegard.org
              <div className="demo-hint">לחץ כאן למילוי אוטומטי</div>
            </div>
            <div className="demo-user" onClick={() => fillDemoUser('Antonette', 'anastasia.net')}>
              <strong>משתמש:</strong> Antonette <br />
              <strong>סיסמה:</strong> anastasia.net
              <div className="demo-hint">לחץ כאן למילוי אוטומטי</div>
            </div>
            <div className="demo-user" onClick={() => fillDemoUser('Samantha', 'ramiro.info')}>
              <strong>משתמש:</strong> Samantha <br />
              <strong>סיסמה:</strong> ramiro.info
              <div className="demo-hint">לחץ כאן למילוי אוטומטי</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;