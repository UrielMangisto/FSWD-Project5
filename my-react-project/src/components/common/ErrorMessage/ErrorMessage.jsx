import React from 'react';
import styles from './ErrorMessage.module.css';

const ErrorMessage = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className={styles.error}>
      {error}
      {onClose && (
        <button 
          onClick={onClose}
          className={styles.errorClose}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;