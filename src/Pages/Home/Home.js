import React from 'react';
import './Home.css';
import Navbar from '../../Components/Navbar/Navbar';



function HomePage() {
  return (
    <div className="HomePage">
      <Navbar />
      <div className="content">
        <h1>Welcome to My Homepage</h1>
        <p>This is some sample content for my homepage.</p>
      </div>
    </div>
  );
}

export default HomePage;

