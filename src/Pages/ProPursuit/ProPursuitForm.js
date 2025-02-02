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
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleLeagueChange = (league) => {
    if (selectedLeagues.includes(league)) {
      setSelectedLeagues(selectedLeagues.filter((item) => item !== league));
    } else {
      setSelectedLeagues([...selectedLeagues, league]);
    }
  };

  const handlePoolChange = (pool) => {
    if (selectedPool.includes(pool)) {
      setSelectedPool(selectedPool.filter((item) => item !== pool));
    } else {
      setSelectedPool([...selectedPool, pool]);
    }
  };

  const findPlayerData = (playerName) => {
    const name = playerName.split(' - ')[0];
    const nhlPlayer = playerData["nhlPlayers"].find((player) => player.name === name);
    const nbaPlayer = playerData["nbaPlayers"].find((player) => player.name === name);
    const nflPlayer = playerData["nflPlayers"].find((player) => player.name === name);
    const mlbPlayer = playerData["mlbPlayers"].find((player) => player.name === name);
    if (nhlPlayer) return nhlPlayer;
    if (nbaPlayer) return nbaPlayer;
    if (nflPlayer) return nflPlayer;
    if (mlbPlayer) return mlbPlayer;
    return null;
  };

  const handlePlayerChange = (e) => {
    const player = e.target.value;
    const selectedPlayerData = findPlayerData(player);
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
      leagueConfig[league].includes(player)
    );
    const validatePool = () => {
      if (selectedPool.includes('All')) return true;
      if (selectedPool.includes('Fantasy Relevant') && !selectedPlayerData?.fantasy_relevant) return false;
      if (selectedPool.includes('Starter') && !selectedPlayerData?.starter) return false;
      return true;
    };
    if (!isInActiveLeagues) {
      const leagueNames = activeLeagues.join(' or ');
      alert(`Player is not in ${leagueNames}: A random player will be selected if you submit`);
      setSelectedPlayer(null);
      return;
    }
    if (!validatePool()) {
      const poolNames = selectedPool.join(' ');
      alert(`Player does not meet ${poolNames} criteria`);
      setSelectedPlayer(null);
      return;
    }
    setSelectedPlayer(player);
  };

  const conditionalPlayerNames = () => {
    if (selectedSelection !== 'User') return null;
    const leagueConfig = {
      all: {
        leagues: ['NHL', 'NBA', 'NFL', 'MLB'],
        playerLists: [nhlPlayerNames, nbaPlayerNames, nflPlayerNames, mlbPlayerNames],
        dataPrefix: 'all'
      },
      NHL_NBA_NFL_MLB: {
        leagues: ['NHL', 'NBA', 'NFL', 'MLB'],
        playerLists: [nhlPlayerNames, nbaPlayerNames, nflPlayerNames, mlbPlayerNames],
        dataPrefix: 'all2'
      },
      NHL_NBA: {
        leagues: ['NHL', 'NBA'],
        playerLists: [nhlPlayerNames, nbaPlayerNames],
        dataPrefix: 'nhlNba'
      },
      NHL_NFL: {
        leagues: ['NHL', 'NFL'],
        playerLists: [nhlPlayerNames, nflPlayerNames],
        dataPrefix: 'nhlNfl'
      },
      NBA_NFL: {
        leagues: ['NBA', 'NFL'],
        playerLists: [nbaPlayerNames, nflPlayerNames],
        dataPrefix: 'nbaNfl'
      },
      NHL: {
        leagues: ['NHL'],
        playerLists: [nhlPlayerNames],
        dataPrefix: 'nhl'
      },
      NBA: {
        leagues: ['NBA'],
        playerLists: [nbaPlayerNames],
        dataPrefix: 'nba'
      },
      NFL: {
        leagues: ['NFL'],
        playerLists: [nflPlayerNames],
        dataPrefix: 'nfl'
      },
      MLB: {
        leagues: ['MLB'],
        playerLists: [mlbPlayerNames],
        dataPrefix: 'mlb'
      }
    };
    const activeLeagues = selectedLeagues.includes('All') 
      ? ['NHL', 'NBA', 'NFL', 'MLB']
      : selectedLeagues;
    const configKey = activeLeagues.sort().join('_');
    const config = leagueConfig[configKey] || leagueConfig.all;
    const poolType = selectedPool.includes('All') ? 'all' :
      selectedPool.includes('Fantasy Relevant') ? 'fr' :
      selectedPool.includes('Starter') ? 's' : 'all';
    const dataListId = `${config.dataPrefix}_${poolType}_players`;
    const filteredPlayers = () => {
      if (poolType === 'all') {
        return config.leagues.flatMap(league => 
          playerData[`${league.toLowerCase()}Players`]
        );
      }
      return config.leagues.flatMap(league => {
        const players = playerData[`${league.toLowerCase()}Players`];
        const filterKey = poolType === 'fr' ? 'fantasy_relevant' : 'starter';
        return players.filter(player => player[filterKey]);
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
      all: {
        leagues: ['NHL', 'NBA', 'NFL', 'MLB'],
        playerLists: {
          NHL: nhlPlayerNames,
          NBA: nbaPlayerNames,
          NFL: nflPlayerNames,
          MLB: mlbPlayerNames
        }
      },
      NHL_NBA_NFL_MLB: {
        leagues: ['NHL', 'NBA', 'NFL', 'MLB'],
        playerLists: {
          NHL: nhlPlayerNames,
          NBA: nbaPlayerNames,
          NFL: nflPlayerNames,
          MLB: mlbPlayerNames
        }
      },
      NHL_NBA: {
        leagues: ['NHL', 'NBA'],
        playerLists: { NHL: nhlPlayerNames, NBA: nbaPlayerNames }
      },
      NHL_NFL: {
        leagues: ['NHL', 'NFL'],
        playerLists: { NHL: nhlPlayerNames, NFL: nflPlayerNames }
      },
      NBA_NFL: {
        leagues: ['NBA', 'NFL'],
        playerLists: { NBA: nbaPlayerNames, NFL: nflPlayerNames }
      },
      NHL: { leagues: ['NHL'], playerLists: { NHL: nhlPlayerNames } },
      NBA: { leagues: ['NBA'], playerLists: { NBA: nbaPlayerNames } },
      NFL: { leagues: ['NFL'], playerLists: { NFL: nflPlayerNames } },
      MLB: { leagues: ['MLB'], playerLists: { MLB: mlbPlayerNames } }
    };
    const activeLeagues = selectedLeagues.includes('All')
      ? ['NHL', 'NBA', 'NFL', 'MLB']
      : selectedLeagues.filter(l => l !== 'All');
    const configKey = activeLeagues.sort().join('_');
    const config = leagueConfig[configKey] || leagueConfig.all;
    const filterCriteria = () => {
      if (selectedPool.includes('All')) return () => true;
      if (selectedPool.includes('Fantasy Relevant')) return p => p?.fantasy_relevant;
      if (selectedPool.includes('Starter')) return p => p?.starter;
      return () => true;
    };
    const filteredPlayers = config.leagues.flatMap(league => {
      const leaguePlayers = playerData[`${league.toLowerCase()}Players`];
      return leaguePlayers.filter(filterCriteria());
    });
    if (filteredPlayers.length === 0) return 'No players available';
    const randPlayer = filteredPlayers[Math.floor(Math.random() * filteredPlayers.length)];
    const teamKey = randPlayer.team ? 'team' : 'Team';
    return `${randPlayer.name} - (${randPlayer[teamKey]})`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalPlayer = selectedPlayer || randomPlayer();
    onClose(selectedLeagues, selectedPool, selectedSelection, finalPlayer);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formPopup}>
        <div className={styles.formContainer}>
          <FaQuestion 
            className={styles.instructionsIcon} 
            onClick={() => setIsInstructionsOpen(true)} 
          />
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
                {['NHL', 'NBA', 'NFL', 'MLB', 'All'].map((league) => (
                  <label 
                    key={league} 
                    className={`${styles.radioButton} ${selectedLeagues.includes(league) ? styles.active : ''}`}
                  >
                    <input 
                      type="checkbox" 
                      name="league" 
                      value={league} 
                      checked={selectedLeagues.includes(league)} 
                      onChange={() => handleLeagueChange(league)} 
                    />
                    <span>{league}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.playerPool}>
              <label>Player Pool:</label>
              <div className={styles.radioButtons}>
                {['All', 'Fantasy Relevant', 'Starter'].map((pool) => (
                  <label 
                    key={pool} 
                    className={`${styles.radioButton} ${selectedPool.includes(pool) ? styles.active : ''}`}
                  >
                    <input 
                      type="checkbox" 
                      name="pool" 
                      value={pool} 
                      checked={selectedPool.includes(pool)} 
                      onChange={() => handlePoolChange(pool)} 
                    />
                    <span>{pool}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.playerSelection}>
              <label>Player Selection:</label>
              <div className={styles.radioButtons}>
                {['Auto', 'User'].map((selection) => (
                  <label 
                    key={selection} 
                    className={`${styles.radioButton} ${selectedSelection === selection ? styles.active : ''}`}
                  >
                    <input 
                      type="radio" 
                      name="selection" 
                      value={selection} 
                      required 
                      checked={selectedSelection === selection} 
                      onChange={() => setSelectedSelection(selection)} 
                    />
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
