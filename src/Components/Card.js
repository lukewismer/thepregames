import React, {useState} from 'react';

const Card = ({ value, suit, faceUp, onClick, className }) => {
  const [isFaceUp, setIsFaceUp] = useState(faceUp);
  

  
  const handleOnClick= () =>{
    setIsFaceUp(!isFaceUp);
  }

  return (
    <img
      src={isFaceUp ? require(`../Images/cards/${value}${suit}.png`) : require('../Images/cards/back_of_card.png')}
      alt={`${value}${suit}`}
      onClick={handleOnClick}
      className={className}
    />
  );
};

export default Card;
