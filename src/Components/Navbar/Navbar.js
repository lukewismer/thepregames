import React, { useState } from 'react';
import styles from './Navbar.module.css'; // Import CSS module
import { GiHamburgerMenu } from "react-icons/gi";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.hamburger} onClick={toggleMenu}>
        <GiHamburgerMenu size={30} color="white" />
      </div>
      <ul className={isOpen ? `${styles.navList} ${styles.navOpen}` : styles.navList}>
        <li className={styles.navItem}><a href="/" className={styles.navLink}>Home</a></li>
        <li className={styles.navItem}><a href="/powerhourform" className={styles.navLink}>PowerHour</a></li>
        <li className={`${styles.navItem} ${styles.dropdown}`}>
          <a href="#" className={styles.navLink}>RideTheBus</a>
          <div className={styles.dropdownContent}>
            <a href="/ridethebus/4-card-classic" className={styles.dropdownContentLink}>4 Card Classic</a>
            <a href="/ridethebus/5-card-classic" className={styles.dropdownContentLink}>5 Card Classic</a>
          </div>
        </li>
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
