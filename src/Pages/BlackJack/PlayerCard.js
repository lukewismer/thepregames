import React from 'react';
import './PlayerCard.css'; // We will create this CSS file next
import Card from '../../Components/Card';

const icon = require('./player.png'); // Import the player icon

const PlayerCard = ({ name, cards, amountBet }) => {


  return (
    <div className="player-card">
        <div className='player-header'>
            <img src={icon} alt="Player" className="player-icon"/>
            <h3>{name}</h3>
        </div>
        
        <div className="player-cards">
            {cards.map((card, index) => {
                if (card === "blank_card") {
                    return (
                        <Card key={index} className="card" value="blank_" suit="card" faceUp={true}>{card}</Card>
                    );
                } else {
                    return (
                        <Card key={index} className="card" value={card.value} suit={card.suit} faceUp={true}>{card}</Card>
                    );
                }
            })}
        </div>
        <p>Bet: ${amountBet}</p>
    </div>
  );
};

export default PlayerCard;
