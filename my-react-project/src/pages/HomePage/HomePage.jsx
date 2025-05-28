// src/pages/HomePage/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import Header from '../../components/Header/Header';
import {
  getNavigationItems,
  validateUserInfo
} from '../../utils/navigationUtils';

const HomePage = ({ currentUser, onLogout }) => {
  if (!validateUserInfo(currentUser)) {
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <div style={{ textAlign: 'center', color: 'white', fontSize: '1.5rem' }}>
            שגיאה בטעינת נתוני המשתמש
          </div>
        </div>
      </div>
    );
  }

  const navigationItems = getNavigationItems(currentUser.id);

  return (
    <div className={styles.container}>
      <Header user={currentUser} onLogout={onLogout} title="דף הבית" />

      <main className={styles.main}>
        <div className={styles.userInfo}>
          <h2 className={styles.userInfoTitle}>פרטים כלליים</h2>
          <div className={styles.userDetails}>
            <p className={styles.userDetail}>
              <strong>שם משתמש:</strong> {currentUser.username}
            </p>
            <p className={styles.userDetail}>
              <strong>אימייל:</strong> {currentUser.email}
            </p>
            <p className={styles.userDetail}>
              <strong>טלפון:</strong> {currentUser.phone}
            </p>
            <p className={styles.userDetail}>
              <strong>אתר:</strong> {currentUser.website}
            </p>
            <p className={styles.userDetail}>
              <strong>עיר:</strong> {currentUser.address?.city}
            </p>
            <p className={styles.userDetail}>
              <strong>חברה:</strong> {currentUser.company?.name}
            </p>
          </div>
        </div>

        <div className={styles.navigation}>
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={styles.navCard}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <h3 className={styles.navTitle}>{item.title}</h3>
              <p className={styles.navDescription}>{item.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;