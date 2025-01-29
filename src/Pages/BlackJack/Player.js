import React from 'react';
import { useParams } from 'react-router-dom';

const Player = () => {
  const { gameCode } = useParams(); // Access the game code from the URL

  // Player-specific state and functions go here

  return (
    <div>
      <h2>Player's Room: {gameCode}</h2>
      {/* Player-specific components and logic will go here */}
    </div>
  );
};

export default Player;
