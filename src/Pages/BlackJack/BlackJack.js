import React, { useState } from 'react';
import CreateGame from './CreateGame';
import JoinGame from './JoinGame';

const BlackJack = () => {
  const [gameCode, setGameCode] = useState('');

  const handleGameCreated = (code) => {
    setGameCode(code);
    // Here you can redirect the user to the game page or display the game code
    console.log(`Game created with code: ${code}`);
  };

  const handleGameJoined = (code) => {
    // Here you can redirect the user to the game page
    console.log(`Joined game with code: ${code}`);
  };

  return (
    <div>
      <h1>Blackjack Game Lobby</h1>
      <CreateGame onGameCreated={handleGameCreated} />
      <JoinGame onGameJoined={handleGameJoined} />
      {gameCode && <div>Game Code: {gameCode}</div>}
    </div>
  );
};

export default BlackJack;
