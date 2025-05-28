import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = ({ user, onLogout, title }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.title}>{title}</h1>
        
        <div className={styles.nav}>
          <Link to="/home" className={styles.navLink}>
            🏠 בית
          </Link>
          
          <Link to={`/users/${user.id}/info`} className={styles.navLink}>
            👤 המידע שלי
          </Link>
          
          <Link to={`/users/${user.id}/todos`} className={styles.navLink}>
            ✅ משימות
          </Link>
          
          <Link to={`/users/${user.id}/posts`} className={styles.navLink}>
            📝 פוסטים
          </Link>
          
          <Link to={`/users/${user.id}/albums`} className={styles.navLink}>
            📸 אלבומים
          </Link>
          
          <span className={styles.userInfo}>
            שלום, {user.name}!
          </span>
          
          <button className={styles.logoutBtn} onClick={handleLogout}>
            התנתק
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;