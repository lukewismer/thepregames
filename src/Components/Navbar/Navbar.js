import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/powerhourform">PowerHour</a></li>
        <li className="dropdown">
          <a href="#" className="dropbtn">RideTheBus</a>
          <div className="dropdown-content">
            <a href="/ridethebus/4-card-classic">4 Card Classic</a>
            <a href="/ridethebus/5-card-classic">5 Card Classic</a>
          </div>
        </li>
        <li><a href="/horserace">Horse Race</a></li>
        <li><a href="/aroundtheworld">Around The World</a></li>
        <li><a href="/propursuit">Pro Pursuit</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
