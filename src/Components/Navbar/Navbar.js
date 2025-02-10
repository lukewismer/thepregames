import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { GiHamburgerMenu } from "react-icons/gi";
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (dropdownOpen) setDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.hamburger} onClick={toggleMenu}>
        <GiHamburgerMenu size={30} color="white" />
      </div>
      <ul className={`${styles.navList} ${isOpen ? styles.navOpen : ''}`}>
        <li className={styles.navItem}><a href="/" className={styles.navLink}>Home</a></li>
        <li className={styles.navItem}><a href="/powerhourform" className={styles.navLink}>PowerHour</a></li>
        <li className={styles.navItem}><a href="/ridethebus/4-card-classic" className={styles.navLink}>Ride The Bus</a></li>
        <li className={styles.navItem}><a href="/horserace" className={styles.navLink}>Horse Race</a></li>
        <li className={styles.navItem}><a href="/aroundtheworld" className={styles.navLink}>Around The World</a></li>
        <li className={styles.navItem}><a href="/propursuit" className={styles.navLink}>Pro Pursuit</a></li>
        <li className={styles.navItem}><a href="/blackjack" className={styles.navLink}>BlackJack</a></li>
        <li className={styles.navItem}><a href="/tournament" className={styles.navLink}>Tournament</a></li>
        {user ? (
          <div className={styles.dropdown}>
            <button 
              className={styles.navLink}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Account ▼
            </button>
            {dropdownOpen && (
              <div className={styles.dropdownContent}>
                <a href="/account" className={styles.dropdownContentLink}>Profile</a>
                <button 
                  className={styles.dropdownContentLink}
                  onClick={handleLogout}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <li className={styles.navItem}>
            <a href="/login" className={styles.navLink}>Login</a>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
