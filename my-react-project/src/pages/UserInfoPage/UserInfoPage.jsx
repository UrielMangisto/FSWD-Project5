import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/layout/Header'; // שינוי!
import styles from './UserInfoPage.module.css';

const UserInfoPage = ({ currentUser, onLogout }) => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    // Implement logout functionality
    console.log('User logged out');
    onLogout();
  };

  return (
    <div className={styles.container}>
      <Header user={currentUser} onLogout={handleLogout} title="User Info" />
      <div className={styles.userInfo}>
        <h1>{userData.name}</h1>
        <p>Email: {userData.email}</p>
        <p>Phone: {userData.phone}</p>
        <p>Website: {userData.website}</p>
        <h2>Address</h2>
        <p>{userData.address.street}, {userData.address.city}</p>
        <p>{userData.address.zipcode}</p>
        <h2>Company</h2>
        <p>{userData.company.name}</p>
        <p>{userData.company.catchPhrase}</p>
      </div>
    </div>
  );
};

export default UserInfoPage;