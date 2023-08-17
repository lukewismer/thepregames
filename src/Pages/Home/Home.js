import React from 'react';
import './Home.css';
import Navbar from '../../Components/Navbar/Navbar';

const logo = require('../../../src/Assets/Beer_logo.png');

const horse = require('../../../src/Pages/HorseRace/horse_icon.png');
const power = require('../../../src/Pages/PowerHour/lightning_icon.png');
const bus = require('../../../src/Pages/RideTheBus/bus_icon.png');
const world = require('../../../src/Pages/AroundTheWorld/Assets/globe_colored_spinning.png');

function HomePage() {
  return (
    <div className="HomePage">
      <Navbar />
      <div className="content">
        <div className="home-title-container">
          <img src={logo} className='beer-logo' alt="Beer Logo" />
          <h1 className="home-title">The Pregames</h1>
        </div>

        <div className="home-text-container">
          <p className="home-text">Welcome to The Pregames! This is a website for you and your friends to enjoy.
          Here you can find fun games, recipes, and more! Hope you enjoy!
          </p>
        </div>
        
        <div className="icons-container">
          <div className="icons-title">
            <h2>Quick Links</h2>
          </div>
          <div className="icons">
            <a href="/horserace">
              <img className="icon horse" src={horse} />
              <p>Horse Race</p>
            </a>

            <a href="/powerhourform">
              <img className="icon power" src={power} /> 
              <p>Power Hour</p>
            </a>
            
            <a href="/ridethebus/4-card-classic">

              <img className="icon bus" src={bus} />
              <p>Ride The Bus</p>
            </a>

            <a href="/aroundtheworld">
              <img className="icon world" src={world} />
              <p>Around The World</p>
            </a>


          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

