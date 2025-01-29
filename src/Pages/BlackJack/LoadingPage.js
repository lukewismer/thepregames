import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { database } from '../../firebase';
import { ref, onValue, off } from 'firebase/database';

const LoadingPage = () => {
  const { gameCode } = useParams(); // Assuming your route to this component includes the gameCode
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const gameRef = ref(database, `games/${gameCode}`);

    const onGameChange = onValue(gameRef, (snapshot) => {
      const game = snapshot.val();
      if (game && game.started) {
        // Redirect player to the play page if the game has started
        setIsLoading(false);
        navigate(`/blackjack-play/${gameCode}`);
      } else {
        // Keep the player on the loading page if the game hasn't started
        setIsLoading(true);
      }
    });

    return () => {
      // Clean up the listener when the component unmounts
      off(gameRef, 'value', onGameChange);
    };
  }, [gameCode, navigate]);

  return (
    <div>
      {isLoading ? (
        <h2>Waiting for the game to start...</h2>
      ) : (
        <h2>Redirecting to the game...</h2>
      )}
      {/* You can add more designs or animations here */}
    </div>
  );
};

export default LoadingPage;
