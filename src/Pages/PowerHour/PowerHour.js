import React, { useState, useEffect, useMemo } from 'react';
import ReactPlayer from "react-player";
import { useLocation } from 'react-router-dom';
//import Navbar from '../../Components/Navbar/Navbar';
import './PowerHour.css';
import { useNavigate } from 'react-router-dom';



const PowerHour = () => {


  const location = useLocation();
  const songs = location.state.playlistSongs;
  const songInterval = location.state.songInterval;
  const tornadoInterval= location.state.tornadoInterval;
  const players = location.state.namesList;
  const tornadoDisplayTime = 20000;

  
  const images = useMemo(() => ["https://giphy.com/embed/ebP9BKoQbsIRMKNNw8", "https://giphy.com/embed/7FgDOBGyFLgns6aiKb", "https://giphy.com/embed/1mNBTj3g4jRCg",
                "https://giphy.com/embed/TLulTJKuyLgMU", "https://giphy.com/embed/2A75RyXVzzSI2bx4Gj","https://giphy.com/embed/IIIg3ZHcOqYtW0wEIB",
                "https://giphy.com/embed/FQ6pL4icGpKH6", "https://giphy.com/embed/26tPo9rksWnfPo4HS", "https://giphy.com/embed/Y4WDXbagwPoepikUdJ", "https://giphy.com/embed/AwP3Ux6rtt5ZCTBo5e",
                "https://giphy.com/embed/xAFcpblRNMyfvt1oAf", "https://giphy.com/embed/c5paNX4a8hc6A", "https://giphy.com/embed/H9Mm0ULO8AtMc", "https://giphy.com/embed/3EfgWHj0YIDrW",
                "https://giphy.com/embed/10H4by255F2UsU", "https://giphy.com/embed/l0HU4QhliQGCcelYk", "https://giphy.com/embed/qyjexFwQwJp9yUvMxq", "https://giphy.com/embed/Q0MrhO9BUSxKR8RdZC",
                "https://giphy.com/embed/pLcVMwRRltmUg", "https://giphy.com/embed/3oz8xxpsXv8pzPgXPG", "https://giphy.com/embed/5hvWaviAuSAl5BJvR2", "https://giphy.com/embed/1VWudpXjhcOC2UYdE9",
                "https://giphy.com/embed/Y0OXD3S690kwGPDiga", "https://giphy.com/embed/rfZCdXOgS5aDK", "https://giphy.com/embed/BRElOZZ2eOn3q", "https://giphy.com/embed/Zx1ZEctOOvxK5VCwwE",
                "https://giphy.com/embed/TGWkzI2QdUmvdSz1oa", "https://giphy.com/embed/BCIoXfA95d1ba", "https://giphy.com/embed/wSlEV7ztEQ0zZ3b9Cm", "https://giphy.com/embed/1BXa2alBjrCXC",
                "https://giphy.com/embed/3kzrzzQXUfI6bmUNf3", "https://giphy.com/embed/xUPGcB5L0TIfLrDH8c", "https://giphy.com/embed/IbchZ7B1ulecFMRNv0", "https://giphy.com/embed/9yRq6zCFW0x6dxJs5V"], [])
                

  //const tornadoImages = ["https://giphy.com/embed/PUf0dbmg0trz6Tjr8X","https://giphy.com/embed/d3mlXPjoK1ROfr9u"]
             
  const [currentSongIndex, setCurrentSongIndex] = useState(selectRandom(songs));
  const [time, setTime] = useState({ min: 0, sec: 0});
  const [isRunning, setIsRunning] = useState(false);
  const [image, setImage] = useState(null);
  const [tornadoPerson, setTornadoPerson] = useState(players[selectRandom(players)]);
  const [tornadoTime, setTornadoTime] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [imageTime, setImageTime] = useState(false);
  
  
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

          const newImg = images[selectRandom(images, images.indexOf(image))];
          setImage(newImg);
          setImageTime(true);
          setTimeout(() => {
            setImageTime(false);
          }, tornadoDisplayTime);
      }, songInterval);

      // Tornado name
      tornadoIntervalId = setInterval(() => {
        console.log("tornado")
        
        setTornadoTime(true);
        setTimeout(() => {
          setTornadoTime(false);
          const newPerson = players[selectRandom(players, images.indexOf(tornadoPerson))];
          setTornadoPerson(newPerson);
        }, tornadoDisplayTime);
      }, tornadoInterval)

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
      clearInterval(tornadoIntervalId);
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
            <iframe src='https://gfycat.com/ifr/HarmfulHonestDuckbillcat' title="gifFinsihes" frameborder='0' scrolling='no' allowfullscreen width='640' height='405'></iframe>
            <ReactPlayer className="reactPlayer" url="https://www.youtube.com/watch?v=ym_jVTcBxSU" playing={true} />
            </>
            
            
            

          ) : (
            <>
            {tornadoTime ? (
              <>
                <h2>Time to tornado: {tornadoPerson}</h2>
              </>
            ) : (
              <p>Almost tornado time</p>
            )}
            {imageTime ? (
              <>
                
                <iframe src={image} title="gif" className="tornadoImage" frameborder="0"></iframe>
                </>
            ) : (<></>)}
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


export default PowerHour;
         
