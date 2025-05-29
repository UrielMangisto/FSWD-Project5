import React from 'react';
import styles from './RegisterStep2.module.css';

const RegisterStep2 = ({ formData, error, loading, onChange, onSubmit, onBack }) => {
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={onSubmit}>
        <h2 className={styles.title}>רישום - השלמת פרטים</h2>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>פרטים אישיים</h3>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>שם מלא:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>אימייל:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
                className={styles.input}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>טלפון:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>כתובת</h3>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>רחוב:</label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={onChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>דירה/סוויטה:</label>
              <input
                type="text"
                name="address.suite"
                value={formData.address.suite}
                onChange={onChange}
                className={styles.input}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>עיר:</label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={onChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>מיקוד:</label>
              <input
                type="text"
                name="address.zipcode"
                value={formData.address.zipcode}
                onChange={onChange}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>חברה</h3>
          <div className={styles.inputGroup}>
            <label className={styles.label}>שם החברה:</label>
            <input
              type="text"
              name="company.name"
              value={formData.company.name}
              onChange={onChange}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>סלוגן:</label>
            <input
              type="text"
              name="company.catchPhrase"
              value={formData.company.catchPhrase}
              onChange={onChange}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button 
            type="button"
            onClick={onBack}
            className={`${styles.button} ${styles.buttonSecondary}`}
          >
            חזור
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className={`${styles.button} ${loading ? styles.buttonDisabled : ''}`}
          >
            {loading ? 'נרשם...' : 'השלם רישום'}
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}
      </form>
    </div>
  );
};

export default RegisterStep2;