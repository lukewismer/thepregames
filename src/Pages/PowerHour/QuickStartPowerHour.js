import React, { useState, useEffect, useMemo } from 'react';
import ReactPlayer from "react-player";
import { useLocation } from 'react-router-dom';
import './PowerHour.css';
import { useNavigate } from 'react-router-dom';



const QuickStartPowerHour = () => {


  const location = useLocation();
  const songs = location.state.playlistSongs;
  const songInterval = 60000;

  
             
  const [currentSongIndex, setCurrentSongIndex] = useState(selectRandom(songs));
  const [time, setTime] = useState({ min: 0, sec: 0});
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  
  const navigate = useNavigate();


  useEffect(() => {
    let intervalId, intervalId2, tornadoIntervalId;
    
    if (isRunning) {

      // Finish
      setTimeout(() => {
        setIsFinished(true);
        setTime({ min: 0, sec: 0, ms: 0 });
        setCurrentSongIndex(0);
        setIsRunning(false);
      }, 3600001) 

      // Songs and images
      intervalId2 = setInterval(() => {
        setCurrentSongIndex(prevIndex => selectRandom(songs, prevIndex));

      }, songInterval);

      // Timer
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
    }
  
    return () => {
      clearInterval(intervalId);
      clearInterval(intervalId2);
    };
  }, [isRunning, songs.length]);
  


  const handleStart = () => {
    setIsRunning(true);
  };


  const handleReset = () => {
    setIsRunning(false);
    setTime({ min: 0, sec: 0, ms: 0 });
    setCurrentSongIndex(0);
    
    navigate("/powerhourform");
  };


  return (
    <div className="background">
      
      <div className="stopwatch-container">
        <h1>Power Hour</h1>
        <h3 className='ph-subheader'>Quickstart Edition</h3>
        <div className="time-container">
        <div className="time-display">
          {time.min.toString().padStart(2, "0")}:{time.sec.toString().padStart(2, "0")}
        </div>
        </div>
        
        <div>
          {isFinished ? (
            <>
            <div className="success-message">
              <p>All done PowerHour. Time to get behind a wheel now</p>
            </div>
            <ReactPlayer className="reactPlayer" url="https://www.youtube.com/watch?v=ym_jVTcBxSU" playing={true} />
            </>
            
            
            

          ) : (
            <>
            </>
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


export default QuickStartPowerHour;
         
