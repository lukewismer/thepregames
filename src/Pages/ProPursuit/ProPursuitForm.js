import React, { useState, useEffect } from 'react';
import styles from './ProPursuitForm.module.css';
import Instructions from '../../Components/Instructions-Popup/Instructions';
import { FaQuestion } from 'react-icons/fa';

const icon = require('./pp-icon.png');

const ProPursuitForm = ({
  onClose,
  playerData,
  playerNames,
  nhlPlayerNames,
  nbaPlayerNames,
  nflPlayerNames,
  mlbPlayerNames
}) => {
  const [selectedLeagues, setSelectedLeagues] = useState(["All"]);
  const [selectedPool, setSelectedPool] = useState(["All"]);
  const [selectedSelection, setSelectedSelection] = useState("Auto");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleLeagueChange = league => {
    selectedLeagues.includes(league)
      ? setSelectedLeagues(selectedLeagues.filter(item => item !== league))
      : setSelectedLeagues([...selectedLeagues, league]);
  };

  const handlePoolChange = pool => {
    selectedPool.includes(pool)
      ? setSelectedPool(selectedPool.filter(item => item !== pool))
      : setSelectedPool([...selectedPool, pool]);
  };

  const findPlayerData = playerName => {
    const name = playerName.split(' - ')[0];
    const nhlPlayer = playerData.nhlPlayers.find(player => player.name === name);
    const nbaPlayer = playerData.nbaPlayers.find(player => player.name === name);
    const nflPlayer = playerData.nflPlayers.find(player => player.name === name);
    const mlbPlayer = playerData.mlbPlayers.find(player => player.name === name);
    return nhlPlayer || nbaPlayer || nflPlayer || mlbPlayer || null;
  };

  const handlePlayerChange = e => {
    setSelectedPlayer(e.target.value);
  };

  const conditionalPlayerNames = () => {
    if (selectedSelection !== 'User') return null;
    const leagueConfig = {
      all: { leagues: ['NHL', 'NBA', 'NFL', 'MLB'], dataPrefix: 'all' },
      NHL_NBA_NFL_MLB: { leagues: ['NHL', 'NBA', 'NFL', 'MLB'], dataPrefix: 'all2' },
      NHL_NBA: { leagues: ['NHL', 'NBA'], dataPrefix: 'nhlNba' },
      NHL_NFL: { leagues: ['NHL', 'NFL'], dataPrefix: 'nhlNfl' },
      NBA_NFL: { leagues: ['NBA', 'NFL'], dataPrefix: 'nbaNfl' },
      NHL: { leagues: ['NHL'], dataPrefix: 'nhl' },
      NBA: { leagues: ['NBA'], dataPrefix: 'nba' },
      NFL: { leagues: ['NFL'], dataPrefix: 'nfl' },
      MLB: { leagues: ['MLB'], dataPrefix: 'mlb' }
    };
    const activeLeagues = selectedLeagues.includes('All') ? ['NHL', 'NBA', 'NFL', 'MLB'] : selectedLeagues;
    const configKey = [...activeLeagues].sort().join('_');
    const config = leagueConfig[configKey] || leagueConfig.all;

    let poolSuffix = 'all';
    let poolCriteria = [];
    if (!selectedPool.includes('All')) {
      if (selectedPool.includes('Fantasy Relevant')) poolCriteria.push('fantasy_relevant');
      if (selectedPool.includes('Starter')) poolCriteria.push('starter');
      poolSuffix = poolCriteria.join('_');
    }
    const dataListId = `${config.dataPrefix}_${poolSuffix}_players`;

    const filteredPlayers = () => {
      if (selectedPool.includes('All')) {
        return config.leagues.flatMap(league =>
          playerData[`${league.toLowerCase()}Players`] || []
        );
      }
      return config.leagues.flatMap(league => {
        const players = playerData[`${league.toLowerCase()}Players`] || [];
        return players.filter(player => poolCriteria.every(key => player[key]));
      });
    };

    return (
      <div>
        <label htmlFor="player-name">Enter Player:</label>
        <input
          type="text"
          list={dataListId}
          id="player-name"
          placeholder="Enter Player"
          onChange={handlePlayerChange}
          className={styles.inputText}
        />
        <datalist id={dataListId}>
          {filteredPlayers().map((player, index) => (
            <option key={index} value={`${player.name} - (${player.team})`} />
          ))}
        </datalist>
      </div>
    );
  };

  const randomPlayer = () => {
    const leagueConfig = {
      all: { leagues: ['NHL', 'NBA', 'NFL', 'MLB'] },
      NHL_NBA_NFL_MLB: { leagues: ['NHL', 'NBA', 'NFL', 'MLB'] },
      NHL_NBA: { leagues: ['NHL', 'NBA'] },
      NHL_NFL: { leagues: ['NHL', 'NFL'] },
      NBA_NFL: { leagues: ['NBA', 'NFL'] },
      NHL: { leagues: ['NHL'] },
      NBA: { leagues: ['NBA'] },
      NFL: { leagues: ['NFL'] },
      MLB: { leagues: ['MLB'] }
    };
    const activeLeagues = selectedLeagues.includes('All')
      ? ['NHL', 'NBA', 'NFL', 'MLB']
      : selectedLeagues.filter(l => l !== 'All');
    const configKey = [...activeLeagues].sort().join('_');
    const config = leagueConfig[configKey] || leagueConfig.all;

    const filterCriteria = p => {
      if (selectedPool.includes('All')) return true;
      const keys = [];
      if (selectedPool.includes('Fantasy Relevant')) keys.push('fantasy_relevant');
      if (selectedPool.includes('Starter')) keys.push('starter');
      return keys.length ? keys.every(key => p[key]) : true;
    };

    const filteredPlayers = config.leagues.flatMap(league => {
      const leaguePlayers = playerData[`${league.toLowerCase()}Players`] || [];
      return leaguePlayers.filter(filterCriteria);
    });
    if (filteredPlayers.length === 0) return 'No players available';
    const randPlayer = filteredPlayers[Math.floor(Math.random() * filteredPlayers.length)];
    const teamKey = randPlayer.team ? 'team' : 'Team';
    return `${randPlayer.name} - (${randPlayer[teamKey]})`;
  };

  const handleSubmit = e => {
    e.preventDefault();
    let finalPlayer = selectedPlayer;
    if (selectedSelection === 'User' && finalPlayer) {
      const selectedPlayerData = findPlayerData(finalPlayer);
      const leagueConfig = {
        NHL: nhlPlayerNames,
        NBA: nbaPlayerNames,
        NFL: nflPlayerNames,
        MLB: mlbPlayerNames
      };
      const activeLeagues = selectedLeagues.includes('All')
        ? ['NHL', 'NBA', 'NFL', 'MLB']
        : selectedLeagues.filter(l => l !== 'All');
      const isInActiveLeagues = activeLeagues.some(league =>
        (leagueConfig[league] || []).includes(finalPlayer)
      );
      const validatePool = () => {
        if (selectedPool.includes('All')) return true;
        if (!selectedPlayerData) return false;
        const keys = [];
        if (selectedPool.includes('Fantasy Relevant')) keys.push('fantasy_relevant');
        if (selectedPool.includes('Starter')) keys.push('starter');
        return keys.length ? keys.every(key => selectedPlayerData[key]) : true;
      };
      if (!isInActiveLeagues) {
        const leagueNames = activeLeagues.join(' or ');
        alert(`Player is not in ${leagueNames}: A random player will be selected.`);
        finalPlayer = randomPlayer();
      } else if (!validatePool()) {
        const poolNames = selectedPool.join(' ');
        alert(`Player does not meet ${poolNames} criteria: A random player will be selected.`);
        finalPlayer = randomPlayer();
      }
    } else {
      finalPlayer = randomPlayer();
    }
    onClose(selectedLeagues, selectedPool, selectedSelection, finalPlayer);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formPopup}>
        <div className={styles.formContainer}>
          <FaQuestion className={styles.instructionsIcon} onClick={() => setIsInstructionsOpen(true)} />
          <div className={styles.ppfTitleRow}>
            <h1 className={styles.ppfTitle}>Pro Pursuit</h1>
          </div>
          {isInstructionsOpen && (
            <Instructions
              gameTitle="Pro Pursuit"
              subheader="Like Wordle, but for your favourite sports players!"
              icon={icon}
              instructionsText={`8 Guesses to guess the random player! \nRules - Starter: (NFL: #1 player on depth chart (3WR's, 2RB's), (NHL: any player who played over 12 avgTOI, (NBA: any player who started over 30 games), (MLB: 50gp). Fantasy Relevant will include: (NFL a starter who is only from fantasy positions QB, WR, TE, RB), (NHL: D >0.4ppg, F >0.5ppg, G >0.89 save%),
(NBA: >10 mpg)`}
              onClose={() => setIsInstructionsOpen(false)}
            />
          )}
          <form onSubmit={handleSubmit}>
            <div className={styles.playerLeagues}>
              <label>Player Leagues:</label>
              <div className={styles.radioButtons}>
                {['NHL', 'NBA', 'NFL', 'MLB', 'All'].map(league => (
                  <label key={league} className={`${styles.radioButton} ${selectedLeagues.includes(league) ? styles.active : ''}`}>
                    <input type="checkbox" name="league" value={league} checked={selectedLeagues.includes(league)} onChange={() => handleLeagueChange(league)} />
                    <span>{league}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.playerPool}>
              <label>Player Pool:</label>
              <div className={styles.radioButtons}>
                {['All', 'Fantasy Relevant', 'Starter'].map(pool => (
                  <label key={pool} className={`${styles.radioButton} ${selectedPool.includes(pool) ? styles.active : ''}`}>
                    <input type="checkbox" name="pool" value={pool} checked={selectedPool.includes(pool)} onChange={() => handlePoolChange(pool)} />
                    <span>{pool}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.playerSelection}>
              <label>Player Selection:</label>
              <div className={styles.radioButtons}>
                {['Auto', 'User'].map(selection => (
                  <label key={selection} className={`${styles.radioButton} ${selectedSelection === selection ? styles.active : ''}`}>
                    <input type="radio" name="selection" value={selection} required checked={selectedSelection === selection} onChange={() => setSelectedSelection(selection)} />
                    <span>{selection}</span>
                  </label>
                ))}
              </div>
            </div>
            {conditionalPlayerNames()}
            <div className={styles.formButtonGroup}>
              <button type="submit" className={styles.submitButton}>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProPursuitForm;
