import React, { useState } from 'react';
import styles from './Navbar.module.css'; // Import CSS module
import { GiHamburgerMenu } from "react-icons/gi";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (dropdownOpen) setDropdownOpen(false);
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
      </ul>
    </nav>
  );
}

export default Navbar;
