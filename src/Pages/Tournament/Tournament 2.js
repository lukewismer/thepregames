import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import styles from './Tournament.module.css';
import { ref, onValue } from 'firebase/database';
import { securePush, secureUpdate } from './SecureDB';
import { database } from '../../firebase';
import Schedule from './Schedule';
import {Standings} from './Standings';
import Bracket from './Bracket';

const NHL_TEAM_LOGOS = {
    "CAR": "https://assets.nhle.com/logos/nhl/svg/CAR_dark.svg",
    "CBJ": "https://assets.nhle.com/logos/nhl/svg/CBJ_dark.svg",
    "NJD": "https://assets.nhle.com/logos/nhl/svg/NJD_dark.svg",
    "NYI": "https://assets.nhle.com/logos/nhl/svg/NYI_dark.svg",
    "NYR": "https://assets.nhle.com/logos/nhl/svg/NYR_dark.svg",
    "PHI": "https://assets.nhle.com/logos/nhl/svg/PHI_dark.svg",
    "PIT": "https://assets.nhle.com/logos/nhl/svg/PIT_dark.svg",
    "WSH": "https://assets.nhle.com/logos/nhl/svg/WSH_dark.svg",

    "BOS": "https://assets.nhle.com/logos/nhl/svg/BOS_dark.svg",
    "BUF": "https://assets.nhle.com/logos/nhl/svg/BUF_dark.svg",
    "DET": "https://assets.nhle.com/logos/nhl/svg/DET_dark.svg",
    "FLA": "https://assets.nhle.com/logos/nhl/svg/FLA_dark.svg",
    "MTL": "https://assets.nhle.com/logos/nhl/svg/MTL_dark.svg",
    "OTT": "https://assets.nhle.com/logos/nhl/svg/OTT_dark.svg",
    "TBL": "https://assets.nhle.com/logos/nhl/svg/TBL_dark.svg",
    "TOR": "https://assets.nhle.com/logos/nhl/svg/TOR_dark.svg",
    
    "CHI": "https://assets.nhle.com/logos/nhl/svg/CHI_dark.svg",
    "COL": "https://assets.nhle.com/logos/nhl/svg/COL_dark.svg",
    "DAL": "https://assets.nhle.com/logos/nhl/svg/DAL_dark.svg",
    "MIN": "https://assets.nhle.com/logos/nhl/svg/MIN_dark.svg",
    "NSH": "https://assets.nhle.com/logos/nhl/svg/NSH_dark.svg",
    "STL": "https://assets.nhle.com/logos/nhl/svg/STL_dark.svg",
    "UTA": "https://assets.nhle.com/logos/nhl/svg/UTA_dark.svg",
    "WPG": "https://assets.nhle.com/logos/nhl/svg/WPG_dark.svg",

    "ANA": "https://assets.nhle.com/logos/nhl/svg/ANA_dark.svg",
    "ARI": "https://assets.nhle.com/logos/nhl/svg/ARI_dark.svg",
    "CGY": "https://assets.nhle.com/logos/nhl/svg/CGY_dark.svg",
    "EDM": "https://assets.nhle.com/logos/nhl/svg/EDM_dark.svg",
    "LAK": "https://assets.nhle.com/logos/nhl/svg/LAK_dark.svg",
    "SJS": "https://assets.nhle.com/logos/nhl/svg/SJS_dark.svg",
    "SEA": "https://assets.nhle.com/logos/nhl/svg/SEA_dark.svg",
    "VAN": "https://assets.nhle.com/logos/nhl/svg/VAN_dark.svg",
    "VGK": "https://assets.nhle.com/logos/nhl/svg/VGK_dark.svg"
}

const GetTeamLogo = ({ teamCode }) => {
    return <img src={NHL_TEAM_LOGOS[teamCode]} alt={teamCode} className={styles.teamLogo} />;
};

const TournamentNav = ({ selectedView, setSelectedView }) => {
    const navItems = [
      { id: 'schedule', label: 'Schedule' },
      { id: 'bracket', label: 'Bracket' },
      { id: 'standings', label: 'Standings' },
      { id: 'teams', label: 'Teams' },
    ];
  
    return (
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${selectedView === item.id ? styles.active : ''}`}
            onClick={() => setSelectedView(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    );
};

const Teams = ({ teams }) => {
    const [newTeam, setNewTeam] = useState({
      name: '',
      players: [''],
      logoCode: ''
    });
  
    const handleAddTeam = async () => {
      const filteredPlayers = newTeam.players.filter(p => p.trim() !== '');
      
      if (newTeam.name.trim() && filteredPlayers.length > 0 && newTeam.logoCode) {
        const teamData = {
          name: newTeam.name.trim(),
          players: filteredPlayers,
          code: newTeam.logoCode,
          logo: NHL_TEAM_LOGOS[newTeam.logoCode],
          timestamp: Date.now()
        };
        
        const teamsRef = ref(database, 'tournament/teams');
        await securePush(teamsRef, teamData);
        setNewTeam({ name: '', players: [''], logoCode: '' });
      }
    };
  
    const handlePlayerChange = (index, value) => {
      const updatedPlayers = [...newTeam.players];
      updatedPlayers[index] = value;
      setNewTeam({ ...newTeam, players: updatedPlayers });
    };
  
    const addPlayerField = () => {
      if (newTeam.players.length < 5) {
        setNewTeam({ ...newTeam, players: [...newTeam.players, ''] });
      }
    };
  
    // Get unique selected team codes
    const selectedNhlTeams = teams ? [...new Set(Object.values(teams).map(t => t.code))] : [];
  
    return (
      <div className={styles.teamsContainer}>
        <div className={styles.teamStats}>
          <div className={styles.counter}>Total Teams: {teams ? Object.keys(teams).length : 0}</div>
          <div className={styles.selectedLogos}>
            {selectedNhlTeams.map(code => (
              <GetTeamLogo key={code} teamCode={code} />
            ))}
          </div>
        </div>
  
        <h2>Add New Team</h2>
        <div className={styles.addTeam}>
          <input
            type="text"
            value={newTeam.name}
            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
            placeholder="Team name"
            className={styles.teamInput}
          />
  
          <div className={styles.playerInputs}>
            {newTeam.players.map((player, index) => (
              <input
                key={index}
                type="text"
                value={player}
                onChange={(e) => handlePlayerChange(index, e.target.value)}
                placeholder={`Player ${index + 1}`}
                className={styles.playerInput}
              />
            ))}
            {newTeam.players.length < 5 && (
              <button 
                type="button" 
                onClick={addPlayerField}
                className={styles.addPlayerButton}
              >
                + Add Player
              </button>
            )}
          </div>
  
          <select
            value={newTeam.logoCode}
            onChange={(e) => setNewTeam({ ...newTeam, logoCode: e.target.value })}
            className={styles.logoSelect}
          >
            <option value="">Select Team Logo</option>
            {Object.keys(NHL_TEAM_LOGOS).map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
  
          <button 
            onClick={handleAddTeam}
            className={styles.addTeamButton}
          >
            Add Team
          </button>
        </div>
  
        <h3>Registered Teams</h3>
        <ul className={styles.teamList}>
          {teams && Object.values(teams).map((team, index) => (
            <li key={index} className={styles.teamItem}>
              <div className={styles.teamHeader}>
                <GetTeamLogo teamCode={team.code} />
                <div className={styles.teamInfo}>
                  <span className={styles.teamName}>{team.name}</span>
                  <span className={styles.teamCode}>({team.code})</span>
                </div>
              </div>
              <ul className={styles.playerList}>
                {team.players.map((player, pIndex) => (
                  <li key={pIndex} className={styles.playerItem}>{player}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );
};

const Tournament = () => {
  const [selectedView, setSelectedView] = useState('schedule');
  const [tournamentData, setTournamentData] = useState(null);
  
  useEffect(() => {
    const tournamentRef = ref(database, 'tournament');
    onValue(tournamentRef, (snapshot) => {
      const data = snapshot.val();
      setTournamentData(data);
    });
  }, []);
  
  const startTournament = async () => {
    const tournamentRef = ref(database, 'tournament');
    await secureUpdate(tournamentRef, { started: true });
  };

  const renderView = () => {
    switch(selectedView) {
      case 'schedule':
            return <Schedule teams={tournamentData?.teams} />;
      case 'teams':
        return <Teams teams={tournamentData?.teams} />;
      case 'bracket':
        return <Bracket teams={tournamentData?.teams} />;
      case 'standings':
        return <Standings teams={tournamentData?.teams} />;
      default:
        return <div>Select a view</div>;
    }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.tournamentContainer}>
        <h1>Tournament Manager</h1>
        <TournamentNav 
          selectedView={selectedView} 
          setSelectedView={setSelectedView} 
        />
        <div className={styles.content}>
          {renderView()}
        </div>
        {!tournamentData?.started && (
          <button className={styles.startButton} onClick={startTournament}>
            Start Tournament
          </button>
        )}
      </div>
    </div>
  );
};

export {Tournament, GetTeamLogo};