// src/pages/HomePage/HomePage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import {
  navigateToUserRoute,
  handleUserLogout,
  getNavigationItems,
  getUserStats,
  formatUserAddress,
  formatUserCompany,
  validateUserInfo
} from '../../utils/navigationUtils';

const HomePage = ({ currentUser, onLogout }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  if (!validateUserInfo(currentUser)) {
    return (
      <div className={styles.homeContainer}>
        <div className={styles.main}>
          <div style={{ textAlign: 'center', color: 'white', fontSize: '1.5rem' }}>
            שגיאה בטעינת נתוני המשתמש
          </div>
        </div>
      </div>
    );
  }

  // חישובים ישירות ברנדר
  const navigationItems = getNavigationItems();
  const userStats = getUserStats(currentUser);
  const userAddress = formatUserAddress(currentUser.address);
  const userCompany = formatUserCompany(currentUser.company);

  // לוגיקה
  function handleNavigationClick(item) {
    if (item.action === 'modal') setShowInfoModal(true);
    else if (item.path) navigateToUserRoute(currentUser.id, item.path);
  }

  function handleLogout() {
    handleUserLogout(onLogout);
  }

  function closeInfoModal() {
    setShowInfoModal(false);
  }

  // רנדר
  return (
    <div className={styles.homeContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <span className={styles.avatar}>👤</span>
            <span className={styles.headerTitle}>ברוך הבא, {currentUser.name}!</span>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            יציאה
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <section className={styles.welcomeSection}>
          <div className={styles.card}>
            <h2 className={styles.welcomeTitle}>שלום {currentUser.name}!</h2>
            <p className={styles.welcomeText}>
              ברוך הבא למערכת הניהול האישי שלך. כאן תוכל לנהל את המשימות, הפוסטים והאלבומים שלך.
            </p>
            <div className={styles.userInfo}>
              <h3 className={styles.userInfoTitle}>הפרטים שלך:</h3>
              <div className={styles.userDetails}>
                <p><strong>שם משתמש:</strong> {currentUser.username}</p>
                <p><strong>אימייל:</strong> {currentUser.email}</p>
                <p><strong>טלפון:</strong> {currentUser.phone}</p>
                <p><strong>עיר:</strong> {currentUser.address?.city}</p>
                <p><strong>חברה:</strong> {currentUser.company?.name}</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.navigation}>
          <h2 className={styles.sectionTitle}>מה תרצה לעשות היום?</h2>
          <div className={styles.navGrid}>
            {navigationItems.map((item, idx) => (
              <Link key={idx} to={item.path} className={styles.navCard}>
                <div className={styles.navIcon}>{item.icon}</div>
                <h3 className={styles.navTitle}>{item.title}</h3>
                <p className={styles.navDescription}>{item.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* User Info Modal */}
      {showInfoModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>מידע אישי</h3>
              <button onClick={closeInfoModal} className={styles.closeButton}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.infoField}>
                <label className={styles.fieldLabel}>שם מלא</label>
                <div className={styles.fieldValue}>{currentUser.name}</div>
              </div>
              <div className={styles.infoField}>
                <label className={styles.fieldLabel}>שם משתמש</label>
                <div className={styles.fieldValue}>@{currentUser.username}</div>
              </div>
              <div className={styles.infoField}>
                <label className={styles.fieldLabel}>אימייל</label>
                <div className={styles.fieldValue}>{currentUser.email}</div>
              </div>
              {currentUser.phone && (
                <div className={styles.infoField}>
                  <label className={styles.fieldLabel}>טלפון</label>
                  <div className={styles.fieldValue}>{currentUser.phone}</div>
                </div>
              )}
              {currentUser.website && (
                <div className={styles.infoField}>
                  <label className={styles.fieldLabel}>אתר אינטרנט</label>
                  <div className={styles.fieldValue}>{currentUser.website}</div>
                </div>
              )}
              {userAddress.length > 0 && (
                <div className={styles.infoField}>
                  <label className={styles.fieldLabel}>כתובת</label>
                  <div className={styles.fieldValue}>
                    {userAddress.map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                </div>
              )}
              {userCompany && (
                <div className={styles.infoField}>
                  <label className={styles.fieldLabel}>חברה</label>
                  <div className={styles.fieldValue}>
                    <div className={styles.companyName}>{userCompany.name}</div>
                    {userCompany.catchPhrase && (
                      <div className={styles.companyCatchPhrase}>{userCompany.catchPhrase}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button onClick={closeInfoModal} className={styles.modalCloseButton}>סגור</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;