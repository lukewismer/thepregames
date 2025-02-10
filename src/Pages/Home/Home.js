import React from 'react';
import styles from './Home.module.css'; // Import CSS module
import Navbar from '../../Components/Navbar/Navbar';

const logo = require('../../../src/Assets/Beer_logo.png');
const horse = require('../../../src/Pages/HorseRace/horse_icon.png');
const power = require('../../../src/Pages/PowerHour/lightning_icon.png');
const bus = require('../../../src/Pages/RideTheBus/bus_icon.png');
const world = require('../../../src/Pages/AroundTheWorld/Assets/globe_colored_spinning.png');

function HomePage() {
  return (
    <div className={styles.HomePage}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.homeTitleContainer}>
          <img src={logo} className={styles.beerLogo} alt="Beer Logo" />
          <h1>The Pregames</h1>
        </div>

        <div className={styles.homeTextContainer}>
          <p className={styles.homeText}>
            Welcome to The Pregames! This is a website for you and your friends to enjoy. Here you can find fun games, recipes, and more! Hope you enjoy!
          </p>
        </div>
        
        <div className={styles.iconsContainer}>
          <div className={styles.iconsTitle}>
            <h2>Quick Links</h2>
          </div>
          <div className={styles.icons}>
            <a href="/horserace">
              <img className={styles.horse} src={horse} alt="Horse Race" />
              <p>Horse Race</p>
            </a>

            <a href="/powerhourform">
              <img className={styles.power} src={power} alt="Power Hour" />
              <p>Power Hour</p>
            </a>
            
            <a href="/ridethebus/4-card-classic">
              <img className={styles.bus} src={bus} alt="Ride The Bus" />
              <p>Ride The Bus</p>
            </a>

            <a href="/aroundtheworld">
              <img className={styles.world} src={world} alt="Around The World" />
              <p>Around The World</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
