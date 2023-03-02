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
  const tornadoInterval= location.state.tornadoInterval;
  //const tornadoInterval = 60000;
  const players = location.state.namesList;
  const tornadoDisplayTime = 20000;

  
  const images = [{"site": "giphy", "link": "https://giphy.com/embed/ebP9BKoQbsIRMKNNw8"}, {"site": "giphy", "link": "https://giphy.com/embed/7FgDOBGyFLgns6aiKb"}, {"site": "giphy", "link": "https://giphy.com/embed/1mNBTj3g4jRCg"},
                {"site": "giphy", "link": "https://giphy.com/embed/TLulTJKuyLgMU"}, 
                {"site": "giphy", "link": "https://giphy.com/embed/FQ6pL4icGpKH6"},
                {"site": "giphy", "link": "https://giphy.com/embed/xAFcpblRNMyfvt1oAf"}, {"site": "giphy", "link": "https://giphy.com/embed/c5paNX4a8hc6A"}, {"site": "giphy", "link": "https://giphy.com/embed/H9Mm0ULO8AtMc"}, 
                {"site": "giphy", "link": "https://giphy.com/embed/10H4by255F2UsU"}, {"site": "giphy", "link": "https://giphy.com/embed/l0HU4QhliQGCcelYk"},
                {"site": "giphy", "link": "https://giphy.com/embed/pLcVMwRRltmUg"}, {"site": "giphy", "link": "https://giphy.com/embed/3oz8xxpsXv8pzPgXPG"}, 
                {"site": "giphy", "link": "https://giphy.com/embed/Y0OXD3S690kwGPDiga"}, {"site": "giphy", "link": "https://giphy.com/embed/rfZCdXOgS5aDK"}, {"site": "giphy", "link": "https://giphy.com/embed/BRElOZZ2eOn3q"},
                {"site": "giphy", "link": "https://giphy.com/embed/TGWkzI2QdUmvdSz1oa"}, {"site": "giphy", "link": "https://giphy.com/embed/BCIoXfA95d1ba"}, {"site": "giphy", "link": "https://giphy.com/embed/wSlEV7ztEQ0zZ3b9Cm"}, 
                {"site": "giphy", "link": "https://giphy.com/embed/3kzrzzQXUfI6bmUNf3"}, {"site": "giphy", "link": "https://giphy.com/embed/xUPGcB5L0TIfLrDH8c"}, {"site": "giphy", "link": "https://giphy.com/embed/IbchZ7B1ulecFMRNv0"}]
                //{"site": "tenor", "link": "https://tenor.com/view/edp-edp445-gif-21257228", "id": "21257228"}, {"site": "tenor", "link": "https://tenor.com/view/minneapolis-miracle-minnesota-vikings-stefon-gif-10809652", "id": "10809652"}, {"site": "tenor", "link": "https://tenor.com/view/edp445-template-meme-gif-26388412", "id": "26388412"}, 
                //{"site": "tenor", "link": "https://tenor.com/view/chug-chugging-drinking-oj-gif-20256641", "id": "20256641"}]
             
  const [currentSongIndex, setCurrentSongIndex] = useState(selectRandom(songs));
  const [time, setTime] = useState({ min: 0, sec: 0});
  const [isRunning, setIsRunning] = useState(false);
  const [tornadoImage, setTornadoImage] = useState(images[selectRandom(images)]);
  const [tornadoPerson, setTornadoPerson] = useState(players[selectRandom(players)]);
  const [tornadoTime, setTornadoTime] = useState(false);
  const [showBorder, setShowBorder] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  
  const navigate = useNavigate();


  useEffect(() => {
    let intervalId, intervalId2, timeoutId;
    
    if (isRunning) {

      
      setTimeout(() => {
        setIsFinished(true);
        setTime({ min: 0, sec: 0, ms: 0 });
        setCurrentSongIndex(0);
        setIsRunning(false);
      }, 10001) //3600000

      // Songs
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


      // Show images
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
    setIsRunning(false);
    setTime({ min: 0, sec: 0, ms: 0 });
    setCurrentSongIndex(0);
    
    
    navigate("/powerhourform");
  };


  return (
    <div>
      <Navbar />
      <div className="stopwatch-container">
        <div className="time-display">
          {time.min.toString().padStart(2, "0")}:{time.sec.toString().padStart(2, "0")}
        </div>
        <div>
          {isFinished ? (
            <>
            <div className="success-message">
              <p>All done PowerHour. Time to get behind a wheel now</p>
            </div>
            <iframe src='https://gfycat.com/ifr/HarmfulHonestDuckbillcat' frameborder='0' scrolling='no' allowfullscreen width='640' height='405'></iframe>
            <ReactPlayer className="reactPlayer" url="https://www.youtube.com/watch?v=ym_jVTcBxSU" playing={true} />
            </>
            
            
            

          ) : (
            <>
            {tornadoTime ? (
              <>
                {tornadoImage.site === "giphy" ? (
                  <iframe src={tornadoImage.link} className="tornadoImage" frameborder="0"></iframe>
                ) : ( <>
                        <div class="tenor-gif-embed" data-postid={tornadoImage.id} data-share-method="host" data-aspect-ratio="1.1985" data-width="100%"><a href={tornadoImage.link}>Edp Edp445 GIF</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
                      </>
                )}
                
                <h2>Time to Tornado: {tornadoPerson}</h2>
              </>
            ) : (
              <p>Almost Tornado Time</p>
            )}
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
         
