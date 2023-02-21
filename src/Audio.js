import React, { useState, useEffect } from 'react';
import ReactPlayer from "react-player";
import './Audio.css';

const MusicPlayer = ({players, songs}) => {
  

  const [currentSongIndex, setCurrentSongIndex] = useState(selectRandom(songs));
  const [time, setTime] = useState({ min: 0, sec: 0});
  const [isRunning, setIsRunning] = useState(false);
  const [tornadoImage, setTornadoImage] = useState(null);
  const [tornadoPerson, setTornadoPerson] = useState("Luke");
  const [tornadoTime, setTornadoTime] = useState(false);

  const img1 = require("./image/cat.jpeg");

  useEffect(() => {
    let intervalId, intervalId2, timeoutId;
  
    if (isRunning) {

      intervalId2 = setInterval(() => {
        
        setCurrentSongIndex(prevIndex => selectRandom(songs, prevIndex));
      }, 15000);

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
        setTornadoImage(img1);
        setTornadoTime(true);
        setTimeout(() => {
          setTornadoTime(false);
        }, 30000);
      }, 180000);
  
      
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


export default MusicPlayer;
         
