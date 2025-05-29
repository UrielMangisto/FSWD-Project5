// src/pages/HomePage/HomePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // הוסף Link כאן!
import Header from '../../components/layout/Header';
import styles from './HomePage.module.css';
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
            Error loading user data
          </div>
        </div>
      </div>
    );
  }

  const navigationItems = getNavigationItems(currentUser.id);

  return (
    <div className={styles.container}>
      <Header user={currentUser} onLogout={onLogout} title="Home Page" />

      <main className={styles.main}>
        <div className={styles.userInfo}>
          <h2 className={styles.userInfoTitle}>General Information</h2>
          <div className={styles.userDetails}>
            <p className={styles.userDetail}>
              <strong>Username:</strong> {currentUser.username}
            </p>
            <p className={styles.userDetail}>
              <strong>Email:</strong> {currentUser.email}
            </p>
            <p className={styles.userDetail}>
              <strong>Phone:</strong> {currentUser.phone}
            </p>
            <p className={styles.userDetail}>
              <strong>Website:</strong> {currentUser.website}
            </p>
            <p className={styles.userDetail}>
              <strong>City:</strong> {currentUser.address?.city}
            </p>
            <p className={styles.userDetail}>
              <strong>Company:</strong> {currentUser.company?.name}
            </p>
          </div>
        </div>

        <div className={styles.navigation}>
          <h2 className={styles.navigationTitle}>Where would you like to go?</h2>
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