import React, {useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Dealer.css'; // Importing the CSS for styling
import PlayerCard from './PlayerCard';
import { database } from '../../firebase';
import { ref, onValue, update } from 'firebase/database';

const SUITS = ['H', 'C', 'D', 'S'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const generateDeck = () => {
  const deck = [];

  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ suit, value });
    }
  }
  return deck;
};

const shuffleDeck = (deck) => {
  const shuffledDeck = [...deck];

  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }

  return shuffledDeck;
};

const Dealer = () => {
    const [deck, setDeck] = useState(shuffleDeck(generateDeck()));
    const [players, setPlayers] = useState([]);
    const { gameCode } = useParams();
    const navigate = useNavigate();
  
    useEffect(() => {
      const gameRef = ref(database, `games/${gameCode}`);
      // Subscribe to the game's data
      const unsubscribe = onValue(gameRef, (snapshot) => {
        const data = snapshot.val();
        const allPlayers = data.players ? Object.keys(data.players).map(key => ({
          ...data.players[key],
          id: key,
        })) : [];
        setPlayers(allPlayers);
        console.log(allPlayers);
      });
  
      // Cleanup function
      return () => {
        unsubscribe();
      };
    }, [gameCode]);
  
    const handleDeal = () => {
      if (deck.length < players.length * 2) {
        console.error('Not enough cards to deal');
        return;
      }
      const updatedPlayers = {};
      const newDeck = [...deck];
      players.forEach(player => {
        const cards = [newDeck.pop(), newDeck.pop()]; // Deal two cards per player
        updatedPlayers[`players/${player.id}/cards`] = cards;
      });
      update(ref(database, `games/${gameCode}`), updatedPlayers);
      setDeck(newDeck);
    };
  
    const handleExit = () => {
      navigate('/');
    };
  
    return (
      <div className="dealer-container">
        <div className="dealer-area">
          <h2>Dealer's Room: {gameCode}</h2>
          <button onClick={handleDeal}>Deal</button>
          <button onClick={handleExit}>Exit</button>
        </div>
        <div className="players-area">
          {players.map((player, index) => (
            <PlayerCard
              key={index}
              name={player.name}
              cards={player.cards || ['blank_card', 'blank_card']}
              amountBet={player.amountBet || 'NA'}
            />
          ))}
        </div>
      </div>
    );
  };
  
  export default Dealer;
