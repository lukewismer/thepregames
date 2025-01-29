import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../../firebase';
import { ref, get, child, update } from 'firebase/database';

const JoinGame = () => {
  const [gameCode, setGameCode] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const joinGame = async () => {
    const gameRef = ref(database, `games/${gameCode}`);
    const snapshot = await get(gameRef);
    if (snapshot.exists()) {
        const gameData = snapshot.val();
        // Check if the game has already started
        if (gameData.started) {
          alert('Sorry, this game has already started.');
          // Optional: navigate to another page or handle as necessary
        } else {
          // Game has not started, proceed to join the game
          const newPlayerRef = ref(database, `games/${gameCode}/players`);
          const newPlayerKey = (await update(newPlayerRef, { [new Date().getTime()]: { name } })).key;
          // Redirect to the loading page after joining
          navigate(`/blackjack-loading/${gameCode}`);
        }
      } else {
        alert('Game not found');
      }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Game Code"
        value={gameCode}
        onChange={(e) => setGameCode(e.target.value)}
      />
      <button onClick={joinGame}>Join Game</button>
    </div>
  );
};

export default JoinGame;
