import React, { useState, useEffect } from 'react';
import ReactPlayer from "react-player";
import Navbar from '../../Components/Navbar/Navbar';
import './PowerHour.css';



const PowerHour = ({songInterval, playlistSongs, tornadoInterval, namesList}) => {
  
  const songs = playlistSongs;

  const [currentSongIndex, setCurrentSongIndex] = useState(selectRandom(songs));
  const [time, setTime] = useState({ min: 0, sec: 0});
  const [isRunning, setIsRunning] = useState(false);
  const [tornadoImage, setTornadoImage] = useState(null);
  const [tornadoPerson, setTornadoPerson] = useState(null);
  const [tornadoTime, setTornadoTime] = useState(false);

  const tornadoDisplayTime = 5000;
  const images = [require("../../Images/cat.jpeg")]
  const players = namesList;
  


  useEffect(() => {
    let intervalId, intervalId2, timeoutId;
    
    if (isRunning) {

      intervalId2 = setInterval(() => {
        
        setCurrentSongIndex(prevIndex => selectRandom(songs, prevIndex));
      }, songInterval);

      intervalId = setInterval(() => {
        setTime(prevTime => {
          let newSec = prevTime.sec + 1;
          let newMin = prevTime.min;

          if (newSec >= 60) {
            newSec = 0;
            newMin++;
          }

          return { min: newMin, sec: newSec};
        });

      }, 1000);

      // Show image every 3 minutes
      timeoutId = setTimeout(() => {
        setTornadoImage(preImg => images[selectRandom(images, images.indexOf(preImg))]);
        setTornadoPerson(prevPerson => players[selectRandom(players, players.indexOf(prevPerson))]);
        setTornadoTime(true);
        setTimeout(() => {
          setTornadoTime(false);
        }, tornadoDisplayTime);
      }, tornadoInterval);
  
      
    }
  
    return () => {
      clearInterval(intervalId);
      clearInterval(intervalId2);
      clearInterval(timeoutId);
    };
  }, [isRunning, songs.length]);
  

  const handleStart = () => {
    setIsRunning(true);
  };


  const handleReset = () => {
    setTime({ min: 0, sec: 0, ms: 0 });
    setCurrentSongIndex(0);
    setIsRunning(false);
  };

  return (
    <>
      <Navbar />
      <div className="stopwatch-container">
        <div className="time-display">
          {time.min.toString().padStart(2, "0")}:{time.sec.toString().padStart(2, "0")}
        </div>
        <div>
          {tornadoTime ? (
            <>
              <img src={tornadoImage} alt="tornado Time"></img>
              <h2>Time to Tornado: {tornadoPerson}</h2>
            </>
          ) : (
            <p>Almost Tornado Time</p>
          )}
        </div>
        <div className="track-display">
          {isRunning ? (
            <ReactPlayer className="reactPlayer" url={songs[currentSongIndex].url} playing={isRunning} />
          ) : (
            <p>Song Paused</p>
          )}
          <h1 className="header">{songs[currentSongIndex].name}</h1>
        </div>
        <div className="controls">
          {isRunning ? (
            <button onClick={handleReset}>Reset</button>
          ) : (
            <button onClick={handleStart}>Start</button>
          )}
        </div>
      </div>
    </>
    
  );

};



function selectRandom(items, lastIndex = -1){
  // Selects random item from list, if second param is provided it checks to make sure it doesn't select same as last time
  var x = Math.floor(Math.random()*items.length);
  while (x === lastIndex)
  {
    x = Math.floor(Math.random()*items.length);
  }
  return x;

}


export default PowerHour;
         
