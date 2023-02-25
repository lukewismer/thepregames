import React, { useState, useEffect } from 'react';
import ReactPlayer from "react-player";
import { useLocation } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import './PowerHour.css';
import { useNavigate } from 'react-router-dom';



const PowerHour = () => {

  const location = useLocation();
  const songs = location.state.playlistSongs;
  const songInterval = location.state.songInterval;
  const tornadoInterval= 60000;
  const players = location.state.namesList;

  const images = ["https://giphy.com/embed/ebP9BKoQbsIRMKNNw8", "https://giphy.com/embed/7FgDOBGyFLgns6aiKb", "https://giphy.com/embed/1mNBTj3g4jRCg","https://giphy.com/embed/TLulTJKuyLgMU", "https://giphy.com/embed/FQ6pL4icGpKH6",
                "https://giphy.com/embed/xAFcpblRNMyfvt1oAf", "https://giphy.com/embed/c5paNX4a8hc6A", "https://giphy.com/embed/H9Mm0ULO8AtMc", "https://giphy.com/embed/10H4by255F2UsU", "https://giphy.com/embed/l0HU4QhliQGCcelYk",
                "https://giphy.com/embed/pLcVMwRRltmUg", "https://giphy.com/embed/3oz8xxpsXv8pzPgXPG", "https://giphy.com/embed/Y0OXD3S690kwGPDiga", "https://giphy.com/embed/rfZCdXOgS5aDK", "https://giphy.com/embed/BRElOZZ2eOn3q",
                "https://giphy.com/embed/TGWkzI2QdUmvdSz1oa", "https://giphy.com/embed/BCIoXfA95d1ba", "https://giphy.com/embed/wSlEV7ztEQ0zZ3b9Cm", "https://giphy.com/embed/3kzrzzQXUfI6bmUNf3", "https://giphy.com/embed/xUPGcB5L0TIfLrDH8c", "https://giphy.com/embed/IbchZ7B1ulecFMRNv0"]
  
  
  const [currentSongIndex, setCurrentSongIndex] = useState(selectRandom(songs));
  const [time, setTime] = useState({ min: 0, sec: 0});
  const [isRunning, setIsRunning] = useState(false);
  const [tornadoImage, setTornadoImage] = useState(images[selectRandom(images)]);
  const [tornadoPerson, setTornadoPerson] = useState(players[selectRandom(players)]);
  const [tornadoTime, setTornadoTime] = useState(false);

  const tornadoDisplayTime = 10000;
  
  const navigate = useNavigate();


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
      timeoutId = setInterval(() => {
        setTornadoTime(true);
            setTimeout(() => {
              setTornadoTime(false);
              const newImg = images[selectRandom(images, images.indexOf(tornadoImage))];
              const newPerson = players[selectRandom(players, images.indexOf(tornadoPerson))];
              setTornadoImage(newImg);
              setTornadoPerson(newPerson);

            }, tornadoDisplayTime);
      }, tornadoInterval);
  
      
    }
  
    return () => {
      clearInterval(intervalId);
      clearInterval(intervalId2);
      //clearInterval(timeoutId);
    };
  }, [isRunning, songs.length]);
  

  const handleStart = () => {
    setIsRunning(true);
  };


  const handleReset = () => {
    setTime({ min: 0, sec: 0, ms: 0 });
    setCurrentSongIndex(0);
    setIsRunning(false);
    
    navigate("/powerhourform");
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
            <iframe src={tornadoImage} width="478" height="480" class="giphy-embed" allowFullScreen></iframe>
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
         
