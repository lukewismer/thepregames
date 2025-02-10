import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

import styles from './PowerHourForm.module.css';

import { FaQuestion } from 'react-icons/fa';
import Instructions from '../../Components/Instructions-Popup/Instructions';
import { getCollectionData } from '../../firebase/firestore/getData';

const icon = require('../PowerHour/lightning_icon.png');

function PowerHourForm() {
  const [name, setName] = useState('');
  const [playlist, setPlaylist] = useState("prom"); 
  const [songs, setSongs] = useState([]);
  const [songInterval, setSongInterval] = useState(60000); 
  const [tornadoInterval, setTornadoInterval] = useState(180000); 
  const [namesList, setNamesList] = useState([]);
  const [length, setLength] = useState(3600000);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const [ instructionsOpen, setInstructionsOpen ] = useState(false);

  useEffect(() => {
    async function fetchSongs() {
      const { result, error } = await getCollectionData('songs');
      if (error) {
        console.error("Error fetching songs: ", error);
      } else {
        setSongs(result);
      }
    }

    fetchSongs();
  }, []);

  const handleAddName = () => {
    setNamesList([...namesList, name]);
    setName('');
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleRemoveName = (index) => {
    const newNamesList = [...namesList];
    newNamesList.splice(index, 1);
    setNamesList(newNamesList);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let playlistSongs = null;

    if (namesList.length === 0) {
      setErrorMessage('Please enter at least one name');
      return;
    }

    if (playlist === "prom") {
        playlistSongs = songs;
    }
    console.log(length)
    navigate("/powerhour", { state: {songInterval, playlistSongs, tornadoInterval, namesList, length}})
  }

  const handleQuickstartSubmit = (event) => {
    event.preventDefault();
    
    let playlistSongs = songs;

    navigate("/powerhour", { state: {songInterval, playlistSongs, tornadoInterval:null, namesList:null, length}})
  };
  
  return (
    <div className={styles.phScreenBg}>
        <Navbar />
        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <div className={styles.powerHourTitleRow}>
            <h2>Power Hour Set Up</h2>
            <button className={`btn-instructions ${styles.btnInstructions}`} onClick={(e) => { e.preventDefault(); setInstructionsOpen(!instructionsOpen); }}><FaQuestion /></button>
          </div>
            
            {errorMessage && <div className={styles.formError}>{errorMessage}</div>}
            {instructionsOpen && <Instructions 
                                    gameTitle="PowerHour Instructions" 
                                    subheader="Every minute, a new song will play. When a song ends, take a shot!" 
                                    icon={icon} 
                                    instructionsText="The game will last for 60 minutes. Quickstart version sets the most basic instructions of 60 second song interval, no tornados
                                                        and no gifs. Just you, your friends, and the music. For a more elaborate game, fill out the form below. A tornado is a random event that will 
                                                        occur every 3-5 minutes. When a tornado occurs, a random player will be selected to perform a tornado while a random GIF is shown. A tornado consists of taking 5 sips and then 
                                                        spinning around 5 times. Good Luck!"
                                    onClose={() => setInstructionsOpen(false)}
                                  />}

            <div className={styles.formRow}>
              <label htmlFor="name">Enter Names:</label>
              <input type="text" value={name} onChange={handleNameChange} className={styles.inputField} />
              <button type="button" className={`btn-secondary ${styles.addButton}`} onClick={handleAddName}>Add</button>
            </div>
            
          
            <ul className={styles.nameList}>
              {namesList.map((name, index) => (
                <li key={index} className={styles.nameListItem}>
                  <span>{name}</span>
                  <button type="button" className={`btn-close ${styles.removeButton}`} onClick={() => handleRemoveName(index)}>X</button>
                </li>
              ))}
            </ul>
              
            
            <div className={styles.formRow}>
              <label htmlFor="songInterval">Song Interval:</label>
              <div>
                <input type="radio" id="30" name="songInterval" value="30" checked={songInterval===30000} onChange={(e) => setSongInterval(30000)} />
                <label htmlFor="30">30 Seconds</label>
              </div>
              <div>
                <input type="radio" id="40" name="songInterval" value="40" checked={songInterval===40000} onChange={(e) => setSongInterval(40000)} />
                <label htmlFor="40">40 Seconds</label>
              </div>
              <div>
                <input type="radio" id="50" name="songInterval" value="50" checked={songInterval===50000} onChange={(e) => setSongInterval(50000)} />
                <label htmlFor="50">50 Seconds</label>
              </div>
              <div>
                <input type="radio" id="60" name="songInterval" value="60" checked={songInterval===60000} onChange={(e) => setSongInterval(60000)} />
                <label htmlFor="60">60 Seconds</label>
              </div>
            </div>

            <hr className={styles.formHr}/>

            
            <div className={styles.formRow}>
                <label htmlFor="tornadoInterval">Tornado Interval:</label>
                <div>
                <input type="radio" id="2m" name="tornadoInterval" value="2m" checked={tornadoInterval===120000} onChange={(e) => setTornadoInterval(120000)} />
                <label htmlFor="2m">2 Minutes</label>
                </div>
                <div>
                <input type="radio" id="3m" name="tornadoInterval" value="3m" checked={tornadoInterval===180000} onChange={(e) => setTornadoInterval(180000)} />
                <label htmlFor="3m">3 Minutes</label>
                </div>
                <div>
                <input type="radio" id="4m" name="tornadoInterval" value="4m" checked={tornadoInterval===240000} onChange={(e) => setTornadoInterval(240000)} />
                <label htmlFor="4m">4 Minutes</label>
                </div>
                <div>
                <input type="radio" id="5m" name="tornadoInterval" value="5m" checked={tornadoInterval===300000} onChange={(e) => setTornadoInterval(300000)} />
                <label htmlFor="5m">5 Minutes</label>
                </div>
                <div>
                <input type="radio" id="n/a" name="tornadoInterval" value="n/a" checked={tornadoInterval===100000*100000*100000} onChange={(e) => setTornadoInterval(100000*100000*100000)} />
                <label htmlFor="n/a">None</label>
                </div>
            </div>

            <hr className={styles.formHr}/>

            
            <div className={styles.formRow}>
                <label htmlFor="playlist">Playlist:</label>
                <div>
                <input type="radio" id="prom" name="playlist" value="prom" checked={playlist==="prom"} onChange={(e) => setPlaylist(e.target.value)} />
                <label htmlFor="prom">Prom</label>
                </div>
                <div>
                <input type="radio" id="n/a" name="playlist" value="n/a" checked={playlist==="n/a"} onChange={(e) => setPlaylist(e.target.value)} />
                <label htmlFor="n/a">N/A</label>
                </div>
            </div>

            <hr className={styles.formHr}/>

            <div className={styles.formRow}>
              <label htmlFor="length">Length:</label>
              <div>
                <input type="radio" id="60m" name="length" value="60m" checked={length===3600000} onChange={(e) => setLength(3600000)} />
                <label htmlFor="60m">Power Hour (60 Mins)</label>
              </div>
              
              <div>
                <input type="radio" id="60m" name="length" value="60m" checked={length===6000000} onChange={(e) => setLength(6000000)} />
                <label htmlFor="60m">Centurion (100 Mins)</label>
              </div>
            </div>

            <hr className={styles.formHr}/>
            <div className={styles.formRow}>
              <button className={`btn-secondary ${styles.formBtn}`} onClick={handleQuickstartSubmit}>Quickstart</button>
            </div>
            <div className={styles.formRow}>
              <button className={`btn-submit ${styles.formBtn}`} type="submit">Submit</button>
            </div>
            
            
        </form>
    </div>
  );
}



export default PowerHourForm;
