import React from 'react';
import styles from './Button.module.css';

const Button = ({ 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  loading = false,
  children,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    loading && styles.loading,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? '⏳' : children}
    </button>
  );
};

export default Button;