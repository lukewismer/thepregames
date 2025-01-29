import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { database } from '../../firebase';
import { ref, onValue, off, update } from 'firebase/database';

const GameLobby = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const gameRef = ref(database, `games/${gameCode}`);
    const onGameChange = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPlayers(Object.values(data.players || {}));
      }
    });

    return () => {
      off(gameRef, 'value', onGameChange);
    };
  }, [gameCode]);

  const startGame = () => {
    const gameRef = ref(database, `games/${gameCode}`);
    update(gameRef, { started: true });
    navigate(`/blackjack-dealer/${gameCode}`); // This would be your game playing route
  };

  return (
    <div>
      <h2>Game Lobby: {gameCode}</h2>
      <h3>Waiting for the game to start...</h3>
      <div>
        <h4>Players ({players.length}):</h4>
        <ul>
          {players.map((player, index) => (
            <li key={index}>{player.name || 'Anonymous'}</li>
          ))}
        </ul>
        <button onClick={startGame}>Start Game</button>
      </div>
    </div>
  );
};

export default GameLobby;
