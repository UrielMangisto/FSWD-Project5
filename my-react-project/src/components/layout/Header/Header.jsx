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
            🏠 Home
          </Link>
          
          <Link to={`/users/${user.id}/info`} className={styles.navLink}>
            👤 Info
          </Link>
          
          <Link to={`/users/${user.id}/todos`} className={styles.navLink}>
            ✅ Todos
          </Link>
          
          <Link to={`/users/${user.id}/posts`} className={styles.navLink}>
            📝 Posts
          </Link>
          
          <Link to={`/users/${user.id}/albums`} className={styles.navLink}>
            📸 Albums
          </Link>
          
          <span className={styles.userInfo}>
            Hello, {user.name}!
          </span>
          
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;