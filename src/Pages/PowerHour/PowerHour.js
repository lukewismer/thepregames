import React, { useState, useEffect } from 'react';
import ReactPlayer from "react-player";
import { useLocation, useNavigate } from 'react-router-dom';
import { getCollectionData } from '../../firebase/firestore/getData';
import styles from './PowerHour.module.css';

const PowerHour = () => {
  const location = useLocation();
  const songs = location.state.playlistSongs;
  const songInterval = location.state.songInterval || 60000;
  const tornadoInterval = location.state.tornadoInterval || null; // If null, skip tornado functionality
  const players = location.state.namesList || []; // If null, skip tornado player functionality
  const length = location.state.length;
  const tornadoDisplayTime = 20000;

  const [currentSongIndex, setCurrentSongIndex] = useState(selectRandom(songs));
  const [time, setTime] = useState({ min: 0, sec: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [image, setImage] = useState(null);
  const [tornadoPerson, setTornadoPerson] = useState(players.length > 0 ? players[selectRandom(players)] : null);
  const [tornadoTime, setTornadoTime] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [imageTime, setImageTime] = useState(false);
  const [images, setImages] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();
  const circleRadius = 60;
  const circleCircumference = 2 * Math.PI * circleRadius;

  useEffect(() => {
    const fetchImages = async () => {
      const { result, error } = await getCollectionData('tornado_images');
      if (error) {
        console.error('Error fetching tornado images:', error);
      } else if (result && result.length > 0) {
        setImages(result[0].urls);
      }
    };
    
    fetchImages();
  }, []);

  useEffect(() => {
    let tornadoIntervalId, finishTimeout;
    let animationFrameId;
    let startTime = null; // Track the start time of the current interval
  
    const updateProgress = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
  
      // Calculate total elapsed time in seconds
      const totalSeconds = Math.floor(elapsedTime / 1000);
  
      // Update minutes and seconds=
      const sec = totalSeconds % 60;
      setTime((prevTime) => {
        let newMin = prevTime.min;
        if (sec === 0 && totalSeconds > 0) {
          newMin = prevTime.min + 1;
        }
        return {
          min: newMin,
          sec,
        };
      });
  
      // Calculate the progress as a percentage of the songInterval
      const progressPercentage = (elapsedTime % songInterval) / songInterval;
      setProgress(progressPercentage);
  
      // If the elapsed time has passed the song interval, change the song
      if (elapsedTime >= songInterval) {
        setCurrentSongIndex((prevIndex) => selectRandom(songs, prevIndex));
        startTime = currentTime; // Reset the start time for the next song interval
      }
  
      // Call the function on the next animation frame for continuous updates
      animationFrameId = requestAnimationFrame(updateProgress);
    };
  
    if (isRunning) {
      // End PowerHour after the defined `length`
      finishTimeout = setTimeout(() => {
        setIsFinished(true);
        setTime({ min: 0, sec: 0 });
        setCurrentSongIndex(0);
        setIsRunning(false);
        cancelAnimationFrame(animationFrameId); // Stop updating progress
      }, length);
  
      // Start the continuous progress updates
      animationFrameId = requestAnimationFrame(updateProgress);
  
      return () => {
        cancelAnimationFrame(animationFrameId); // Cleanup on component unmount
        clearTimeout(finishTimeout);
        if (tornadoIntervalId) clearInterval(tornadoIntervalId);
      };
    }
  }, [isRunning, songs.length, songInterval]);
  
  const handleStart = () => {
    setIsRunning(true);
    setPlaying(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime({ min: 0, sec: 0 });
    setCurrentSongIndex(0);
    navigate("/powerhourform");
  };

  const progressStrokeDashoffset = circleCircumference - (progress * circleCircumference);
  console.log(progressStrokeDashoffset);

  return (
    <div className={styles.background}>
      <div className={styles.stopwatchContainer}>
        <button className={`btn-close ${styles.closeButton}`} onClick={() => navigate("/powerhourform")}>X</button>
        {length === 3600000 ? <h2 className={styles.header}>Power Hour</h2> : <h2 className={styles.header}>Centurion</h2>}
        <h3 className={styles.phSubheader}>Tornado Edition</h3>

        <div className={styles.timeDisplay}>
          {time.min.toString().padStart(2, "0")}:{time.sec.toString().padStart(2, "0")}
        </div>

        <div className={styles.progressCircleContainer}>
        <svg className={styles.progressCircle} width="150" height="150" viewBox="0 0 150 150">
  {/* Define the gradient within the SVG */}
  <defs>
    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#ff883e" />
      <stop offset="100%" stopColor="#009e60" />
    </linearGradient>
  </defs>
  
  {/* Background circle */}
  <circle className={styles.progressCircleBackground} cx="75" cy="75" r={circleRadius} strokeWidth="10" />
  
  {/* Foreground progress circle */}
  <circle
    className={styles.progressCircleForeground}
    cx="75"
    cy="75"
    r={circleRadius}
    strokeWidth="10"
    strokeDasharray={circleCircumference}
    strokeDashoffset={progressStrokeDashoffset}
    stroke="url(#progressGradient)"  // Reference the gradient ID
  />
</svg>
        </div>

        {isFinished ? (
          <>
            <p>Congratulations on completing PowerHour!</p>
            <iframe src='https://gfycat.com/ifr/HarmfulHonestDuckbillcat' title="gifFinish" frameBorder="0" width="640" height="405" allowFullScreen></iframe>
            <ReactPlayer url="https://www.youtube.com/watch?v=ym_jVTcBxSU" playing />
          </>
        ) : (
          <>
            {tornadoTime && tornadoPerson ? <h2>Time to tornado: {tornadoPerson}</h2> : <p>Almost tornado time</p>}
            {imageTime && image && <iframe src={image} title="gif" className={styles.tornadoImage} frameBorder="0"></iframe>}
          </>
        )}

        <div className={styles.trackDisplay}>
          {isRunning ? (
            <ReactPlayer className={styles.reactPlayer} url={songs[currentSongIndex].url} playing={isRunning} config={{
              youtube: {
                playerVars: { playsinline: 1 }
              }
            }} />
          ) : (
            <p>Song Paused</p>
          )}
          <h1 className={styles.header}>{songs[currentSongIndex].name}</h1>
        </div>

        <div className={styles.controls}>
          {isRunning ? (
            <button className={styles.controlButton} onClick={handleReset}>Reset</button>
          ) : (
            <button className={styles.controlButton} onClick={handleStart}>Start</button>
          )}
        </div>
      </div>
    </div>
  );
};

function selectRandom(items, lastIndex = -1) {
  let index = Math.floor(Math.random() * items.length);
  while (index === lastIndex) {
    index = Math.floor(Math.random() * items.length);
  }
  return index;
}

export default PowerHour;
