import React, {useState} from 'react';

const Card = ({ value, suit, faceUp, onClick, className, nonFlippable }) => {
  const [isFaceUp, setIsFaceUp] = useState(faceUp);
  
  const handleOnClick= () =>{
    setIsFaceUp(!isFaceUp);
  }

  if (!onClick){
    onClick = handleOnClick;
  }

  if (nonFlippable){
    return (
      <img
        src={faceUp ? require(`../Images/cards/${value}${suit}.png`) : require('../Images/cards/back_of_card.png')}
        alt={`${value}${suit}`}
        className={className}
      />
    );

  } else {
    return (
      <img
        src={isFaceUp ? require(`../Images/cards/${value}${suit}.png`) : require('../Images/cards/back_of_card.png')}
        alt={`${value}${suit}`}
        onClick={onClick}
        className={className}
      />
    );
  }
  
};

export default Card;
