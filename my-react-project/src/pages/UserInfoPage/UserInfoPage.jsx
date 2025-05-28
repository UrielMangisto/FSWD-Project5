import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserInfoPage.module.css';
import Header from '../../components/Header/Header';
import {
  formatUserAddress,
  formatUserCompany,
  validateUserInfo
} from '../../utils/navigationUtils';

const UserInfoPage = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();

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

  const userAddress = formatUserAddress(currentUser.address);
  const userCompany = formatUserCompany(currentUser.company);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.container}>
      <Header user={currentUser} onLogout={onLogout} title="המידע האישי שלי" />

      <main className={styles.main}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>פרטי המשתמש</h2>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>פרטים כלליים</h3>
              <p className={styles.infoItem}>
                <span className={styles.label}>שם מלא:</span> {currentUser.name}
              </p>
              <p className={styles.infoItem}>
                <span className={styles.label}>שם משתמש:</span> {currentUser.username}
              </p>
              <p className={styles.infoItem}>
                <span className={styles.label}>אימייל:</span> {currentUser.email}
              </p>
              <p className={styles.infoItem}>
                <span className={styles.label}>טלפון:</span> {currentUser.phone}
              </p>
              <p className={styles.infoItem}>
                <span className={styles.label}>אתר:</span> {currentUser.website}
              </p>
            </div>

            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>כתובת</h3>
              <p className={styles.infoItem}>
                <span className={styles.label}>רחוב:</span> {currentUser.address?.street || 'לא צוין'}
              </p>
              <p className={styles.infoItem}>
                <span className={styles.label}>סוויטה:</span> {currentUser.address?.suite || 'לא צוין'}
              </p>
              <p className={styles.infoItem}>
                <span className={styles.label}>עיר:</span> {currentUser.address?.city || 'לא צוין'}
              </p>
              <p className={styles.infoItem}>
                <span className={styles.label}>מיקוד:</span> {currentUser.address?.zipcode || 'לא צוין'}
              </p>
              {currentUser.address?.geo && (
                <>
                  <p className={styles.infoItem}>
                    <span className={styles.label}>קואורדינטות:</span>
                  </p>
                  <p className={styles.infoItem}>• רוחב: {currentUser.address.geo.lat}</p>
                  <p className={styles.infoItem}>• אורך: {currentUser.address.geo.lng}</p>
                </>
              )}
            </div>

            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>פרטי החברה</h3>
              <p className={styles.infoItem}>
                <span className={styles.label}>שם החברה:</span> {userCompany?.name || 'לא צוין'}
              </p>
              <p className={styles.infoItem}>
                <span className={styles.label}>סלוגן:</span> {userCompany?.catchPhrase || 'לא צוין'}
              </p>
              <p className={styles.infoItem}>
                <span className={styles.label}>תחום עסקי:</span> {userCompany?.bs || 'לא צוין'}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>קישורים מהירים</h2>
          <div className={styles.buttonGroup}>
            <button 
              onClick={() => handleNavigate(`/users/${currentUser.id}/todos`)}
              className={`${styles.button} ${styles.buttonTodos}`}
            >
              ✅ המשימות שלי
            </button>
            
            <button 
              onClick={() => handleNavigate(`/users/${currentUser.id}/posts`)}
              className={`${styles.button} ${styles.buttonPosts}`}
            >
              📝 הפוסטים שלי
            </button>
            
            <button 
              onClick={() => handleNavigate(`/users/${currentUser.id}/albums`)}
              className={`${styles.button} ${styles.buttonAlbums}`}
            >
              📸 האלבומים שלי
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserInfoPage;