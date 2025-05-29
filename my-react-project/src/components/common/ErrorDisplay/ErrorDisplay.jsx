import React from 'react';
import styles from './ErrorDisplay.module.css';

const ErrorDisplay = ({ error, onClose, type = 'error' }) => {
  if (!error) return null;

  return (
    <div className={`${styles.container} ${styles[type]}`}>
      <div className={styles.content}>
        <span className={styles.message}>{error}</span>
        {onClose && (
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="סגור הודעת שגיאה"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;