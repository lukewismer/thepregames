import React, { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../../firebase';
import styles from './Tournament.module.css';
import { GetTeamLogo } from './Tournament'; 
import { secureUpdate } from './SecureDB';

const Schedule = ({ teams }) => {
  const [games, setGames] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(true);

  useEffect(() => {
    if (!teams || Object.keys(teams).length === 0) return;
  
    const scheduleRef = ref(database, 'tournament/schedule');
    onValue(scheduleRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Schedule data from Firebase:", data);
  
      if (data && Object.keys(data).length > 0) {
        setGames(Object.values(data).sort((a, b) => Number(a.completed) - Number(b.completed)));
        setLoadingSchedule(false);
      } else {
        generateSchedule(Object.entries(teams));
      }
    });
  }, [teams]);

  const generateSchedule = async (teamsArray) => {
    const games = [];
    
    for (let i = 0; i < teamsArray.length; i++) {
      for (let j = i + 1; j < teamsArray.length; j++) {
        let homeTeamId, awayTeamId;
        if ((i + j) % 2 === 0) {
          homeTeamId = teamsArray[i][0];
          awayTeamId = teamsArray[j][0];
        } else {
          homeTeamId = teamsArray[j][0];
          awayTeamId = teamsArray[i][0];
        }
  
        games.push({
          id: "",
          homeTeam: homeTeamId,
          awayTeam: awayTeamId,
          tv: "",
          timeslot: 0,
          completed: false,
          homeScore: 0,
          awayScore: 0,
          ot: false
        });
      }
    }
  
    for (let i = games.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [games[i], games[j]] = [games[j], games[i]];
    }
  
    const half = Math.floor(games.length / 2);
    for (let i = 0; i < games.length; i++) {
      games[i].tv = i < half ? "main" : "small";
    }
  
    for (let i = 0; i < games.length; i++) {
      games[i].id = `game_${i}`;
      games[i].timeslot = i;
    }
  
    const updates = games;
    await set(ref(database, 'tournament/schedule'), updates);
  };

  const handleEditScore = (gameId, homeScore, awayScore) => {
    const key = gameId.split('_')[1];
    const gameRef = ref(database, `tournament/schedule/${key}`);
    secureUpdate(gameRef, { homeScore, awayScore });
  };

  const handleGameOver = (gameId) => {
    const key = gameId.split('_')[1];
    const gameRef = ref(database, `tournament/schedule/${key}`);
    secureUpdate(gameRef, { completed: true, timeslot: 100 });
  };

  const onToggleOT = (gameId, newOTValue) => {
    const key = gameId.split('_')[1];
    const gameRef = ref(database, `tournament/schedule/${key}`);
    secureUpdate(gameRef, { ot: newOTValue });
  };

    const mainTvGames = games
    .filter(g => g.tv === 'main')
    .sort((a, b) => {
        if (a.timeslot === b.timeslot) {
        return Number(a.completed) - Number(b.completed);
        }
        return a.timeslot - b.timeslot;
    });

    // I want to sort by timeslot, then by completed status
    const smallTvGames = games
    .filter(g => g.tv === 'small')
    .sort((a, b) => {
        if (a.timeslot === b.timeslot) {
        return Number(a.completed) - Number(b.completed);
        }
        return a.timeslot - b.timeslot;
    });
  

  if (loadingSchedule) return <div>Loading schedule...</div>;

  return (
    <div className={styles.scheduleContainer}>
      <div className={styles.tvColumn}>
        <h2>Main TV</h2>
        <div className={styles.scrollColumn}>
          {mainTvGames.map(game => (
            <GameCard
              key={game.id}
              game={game}
              teams={teams}
              onEditScore={handleEditScore}
              onGameOver={handleGameOver}
              onToggleOT={onToggleOT}
            />
          ))}
        </div>
      </div>

      <div className={styles.tvColumn}>
        <h2>Small TV</h2>
        <div className={styles.scrollColumn}>
          {smallTvGames.map(game => (
            <GameCard
              key={game.id}
              game={game}
              teams={teams}
              onEditScore={handleEditScore}
              onGameOver={handleGameOver}
              onToggleOT={onToggleOT}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

function GameCard({ game, teams, onEditScore, onGameOver, onToggleOT }) {
    const homeTeam = teams?.[game.homeTeam];
    const awayTeam = teams?.[game.awayTeam];
  
    // Local state for editing
    const [editing, setEditing] = useState(false);
    const [tempHomeScore, setTempHomeScore] = useState(game.homeScore);
    const [tempAwayScore, setTempAwayScore] = useState(game.awayScore);
    const [tempOT, setTempOT] = useState(Boolean(game.ot));
  
    if (!homeTeam || !awayTeam) {
      return null;
    }
  
    // Enter edit mode
    const handleEdit = () => {
      setEditing(true);
    };
  
    // Save the updated score + OT
    const handleSubmitScore = () => {
      onEditScore(game.id, Number(tempHomeScore), Number(tempAwayScore));
      onToggleOT(game.id, tempOT);
      setEditing(false);
    };
  
    // Cancel editing and revert to old values
    const handleCancelEdit = () => {
      setTempHomeScore(game.homeScore);
      setTempAwayScore(game.awayScore);
      setTempOT(Boolean(game.ot));
      setEditing(false);
    };
  
    const handleOTChange = (e) => {
      setTempOT(e.target.checked);
    };
  
    // If not editing, we just display the current score
    // If editing, we show input fields
    return (
      <div className={`${styles.gameCard} ${game.completed ? styles.completedGame : ''}`}>
        <div className={styles.gameInfo}>
          {/* OT Checkbox (only meaningful if not completed or if you allow changing post-completion) */}
          <div className={styles.otRow}>
            <label>
              <input
                type="checkbox"
                checked={editing ? tempOT : Boolean(game.ot)}
                onChange={handleOTChange}
                disabled={!editing || game.completed}
              />
              OT?
            </label>
          </div>
  
          {/* Teams + Score */}
          <div className={styles.teamRow}>
            <GetTeamLogo teamCode={homeTeam.code} />
            <span>{homeTeam.name}</span>
            {editing ? (
              <input
                type="number"
                value={tempHomeScore}
                onChange={(e) => setTempHomeScore(e.target.value)}
                disabled={game.completed}
                className={styles.scoreInput}
              />
            ) : (
              <span className={styles.scoreDisplay}>{game.homeScore}</span>
            )}
          </div>
          <div className={styles.teamRow}>
            <GetTeamLogo teamCode={awayTeam.code} />
            <span>{awayTeam.name}</span>
            {editing ? (
              <input
                type="number"
                value={tempAwayScore}
                onChange={(e) => setTempAwayScore(e.target.value)}
                disabled={game.completed}
                className={styles.scoreInput}
              />
            ) : (
              <span className={styles.scoreDisplay}>{game.awayScore}</span>
            )}
          </div>
        </div>
  
        <div className={styles.gameActions}>
          {!game.completed && !editing && (
            <button onClick={handleEdit}>Edit Score</button>
          )}
          {!game.completed && editing && (
            <>
              <button onClick={handleSubmitScore}>Submit</button>
              <button onClick={handleCancelEdit}>Cancel</button>
            </>
          )}
          {!game.completed && (
            <button onClick={() => onGameOver(game.id)}>Game Over</button>
          )}
          {game.completed && <span>Finished</span>}
        </div>
      </div>
    );
  }

export default Schedule;
