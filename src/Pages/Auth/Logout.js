import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import styles from './Auth.module.css';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    auth.signOut().then(() => {
      navigate('/login');
    });
  }, [navigate]);

  return (
    <div className={styles.logoutContainer}>
      <div className={styles.logoutMessage}>
        <h2>Successfully Logged Out</h2>
        <p>Redirecting to login page...</p>
      </div>
    </div>
  );
}

export default Logout;