import React, {useState} from 'react';

const Card = ({ value, suit, faceUp, onClick }) => {
  const [isFaceUp, setIsFaceUp] = useState(faceUp);
  

  
  const handleOnClick= () =>{
    setIsFaceUp(!isFaceUp);
  }

  return (
    <img
      src={isFaceUp ? require(`../Images/cards/${value}${suit}.png`) : require('../Images/cards/back_of_card.png')}
      alt={`${value}${suit}`}
      onClick={handleOnClick}
      style={{
        width: '100px',
        height: '150px',
        margin: '5px',
        borderRadius: '5px',
        boxShadow: '0 0 5px 2px rgba(0,0,0,0.25)'
      }}
    />
  );
};

export default Card;
