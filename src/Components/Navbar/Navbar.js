import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/powerhourform">PowerHour</a></li>
        <li><a href="/ridethebus">RideTheBus</a></li>
        <li><a href="/horserace">Horse Race</a></li>
        <li><a href="/aroundtheworld">Around The World</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
