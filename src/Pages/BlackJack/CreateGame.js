import React from 'react';
import { useNavigate } from 'react-router';
import { database } from '../../firebase';
import { ref, push, set } from 'firebase/database';

const CreateGame = ({ onGameCreated }) => {
  const navigate = useNavigate();

  const createGame = async () => {
    const newGameRef = push(ref(database, 'games'));
    const gameCode = newGameRef.key;
    await set(newGameRef, { started: false, players: {} });
    onGameCreated(gameCode);
    navigate(`/blackjack/${gameCode}`); 
  };

  return (
    <button onClick={createGame}>Create New Game</button>
  );
};

export default CreateGame;