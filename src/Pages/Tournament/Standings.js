import React, { useEffect, useState, useMemo } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase';
import { GetTeamLogo } from './Tournament'; 
import styles from './Tournament.module.css';

const Standings = ({ teams }) => {
  const [allTeamsData, setAllTeamsData] = useState([]); 
  const [sortField, setSortField] = useState('PTS');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'

  useEffect(() => {
    if (!teams || Object.keys(teams).length === 0) {
      setAllTeamsData([]);
      return;
    }
    // Listen to completed games
    const scheduleRef = ref(database, 'tournament/schedule');
    const unsubscribe = onValue(scheduleRef, (snapshot) => {
      const gamesData = snapshot.val();
      if (!gamesData) {
        setAllTeamsData([]);
        return;
      }
      const completedGames = Object.values(gamesData).filter(g => g.completed === true);
      const newStandings = computeStandings(completedGames, teams);
      setAllTeamsData(newStandings);
    });

    return () => unsubscribe();
  }, [teams]);

  // Handle column header click => update sort criteria
  const handleSort = (field) => {
    // If we click the same column, flip direction
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      // New field => default direction is desc for numeric fields, asc for name
      setSortField(field);
      setSortDirection(field === 'name' ? 'asc' : 'desc');
    }
  };

  // Sort the array each render according to {sortField, sortDirection}
  const sortedStandings = useMemo(() => {
    const dataCopy = [...allTeamsData];

    dataCopy.sort((a, b) => {
      // Handle string vs numeric differently
      if (sortField === 'name') {
        // String sort
        if (a.name < b.name) return sortDirection === 'asc' ? -1 : 1;
        if (a.name > b.name) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      } else if (sortField === 'powerRank') {
        // Lower rank means better
        if (a.powerRank < b.powerRank) return sortDirection === 'asc' ? -1 : 1;
        if (a.powerRank > b.powerRank) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      } else {
        // Numeric sort for GP, W, L, OTL, PTS, GF, GA
        const valA = a[sortField] ?? 0;
        const valB = b[sortField] ?? 0;
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      }
    });

    return dataCopy;
  }, [allTeamsData, sortField, sortDirection]);

  // Render the table
  return (
    <div className={styles.standingsContainer}>
      <h2>Standings</h2>
      <table className={styles.standingsTable}>
        <thead>
          <tr>
            <SortableTH
              label="Team"
              onClick={() => handleSort('name')}
              sortField={sortField}
              thisField="name"
              sortDirection={sortDirection}
            />
            <SortableTH
              label="GP"
              onClick={() => handleSort('GP')}
              sortField={sortField}
              thisField="GP"
              sortDirection={sortDirection}
            />
            <SortableTH
              label="W"
              onClick={() => handleSort('W')}
              sortField={sortField}
              thisField="W"
              sortDirection={sortDirection}
            />
            <SortableTH
              label="L"
              onClick={() => handleSort('L')}
              sortField={sortField}
              thisField="L"
              sortDirection={sortDirection}
            />
            <SortableTH
              label="OTL"
              onClick={() => handleSort('OTL')}
              sortField={sortField}
              thisField="OTL"
              sortDirection={sortDirection}
            />
            <SortableTH
              label="PTS"
              onClick={() => handleSort('PTS')}
              sortField={sortField}
              thisField="PTS"
              sortDirection={sortDirection}
            />
            <SortableTH
              label="GF"
              onClick={() => handleSort('GF')}
              sortField={sortField}
              thisField="GF"
              sortDirection={sortDirection}
            />
            <SortableTH
              label="GA"
              onClick={() => handleSort('GA')}
              sortField={sortField}
              thisField="GA"
              sortDirection={sortDirection}
            />
            <SortableTH
              label="Power Rank"
              onClick={() => handleSort('powerRank')}
              sortField={sortField}
              thisField="powerRank"
              sortDirection={sortDirection}
            />
          </tr>
        </thead>
        <tbody>
          {sortedStandings.map((teamStat) => (
            <tr key={teamStat.teamKey}>
              <td className={styles.teamCell}>
                <GetTeamLogo teamCode={teamStat.code} />
                <span>{teamStat.name}</span>
              </td>
              <td>{teamStat.GP}</td>
              <td>{teamStat.W}</td>
              <td>{teamStat.L}</td>
              <td>{teamStat.OTL}</td>
              <td>{teamStat.PTS}</td>
              <td>{teamStat.GF}</td>
              <td>{teamStat.GA}</td>
              <td>{teamStat.powerRank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


function SortableTH({ label, onClick, sortField, thisField, sortDirection }) {
  let arrow = '';
  if (sortField === thisField) {
    arrow = sortDirection === 'asc' ? ' ▲' : ' ▼';
  }
  return (
    <th onClick={onClick} style={{ cursor: 'pointer', userSelect: 'none' }}>
      {label}
      {arrow}
    </th>
  );
}

function computeStandings(games, teams) {
    const teamStats = {};
  
    // Initialize team stats with additional fields
    for (const [teamKey, teamObj] of Object.entries(teams)) {
      teamStats[teamKey] = {
        teamKey,
        name: teamObj.name,
        code: teamObj.code,
        GP: 0,
        W: 0,
        L: 0,
        OTL: 0,
        PTS: 0,
        GF: 0,
        GA: 0,
        homeW: 0,
        awayW: 0,
        homeL: 0,
        awayL: 0,
        homeOTL: 0,
        awayOTL: 0,
        opponents: [],
        Power: 0,
        powerRank: 0,
        SOS: 0,
      };
    }
  
    // Process each game to update stats and track opponents
    for (const game of games) {
      const { homeTeam, awayTeam, homeScore, awayScore, ot } = game;
      const home = teamStats[homeTeam];
      const away = teamStats[awayTeam];
      if (!home || !away) continue;
  
      // Update game played and goals
      home.GP++;
      away.GP++;
      home.GF += homeScore;
      home.GA += awayScore;
      away.GF += awayScore;
      away.GA += homeScore;
  
      // Track opponents
      home.opponents.push(awayTeam);
      away.opponents.push(homeTeam);
  
      // Determine outcome and update records
      if (homeScore > awayScore) {
        // Home team wins
        home.W++;
        home.homeW++;
        home.PTS += 2;
        if (ot) {
          away.OTL++;
          away.awayOTL++;
          away.PTS++;
          away.L++;
          away.awayL++;
        } else {
          away.L++;
          away.awayL++;
        }
      } else if (awayScore > homeScore) {
        // Away team wins
        away.W++;
        away.awayW++;
        away.PTS += 2;
        if (ot) {
          home.OTL++;
          home.homeOTL++;
          home.PTS++;
          home.L++;
          home.homeL++;
        } else {
          home.L++;
          home.homeL++;
        }
      } else {
        // Handle ties if applicable (adjust based on league rules)
        home.L++;
        home.homeL++;
        away.L++;
        away.awayL++;
      }
    }
  
    for (const tKey in teamStats) {
      const t = teamStats[tKey];
      const diff = t.GF - t.GA;
      t.Power = t.PTS + 0.05 * diff;
    }
  
    for (const tKey in teamStats) {
      const t = teamStats[tKey];
      let sosSum = 0;
      for (const opponentKey of t.opponents) {
        sosSum += teamStats[opponentKey].Power;
      }
      t.SOS = t.opponents.length ? sosSum / t.opponents.length : 0;
    }
  
    // Adjust Power with away boosts, loss penalties, and SOS
    for (const tKey in teamStats) {
      const t = teamStats[tKey];
      // Coefficients can be adjusted for balance
      const homeWinBoost = t.homeW * 0.1;      // +0.1 per home win
      const awayWinBoost = t.awayW * 0.2;      // +0.2 per away win
      const homeLossPenalty = t.homeL * 0.1;   // -0.1 per home loss
      const awayLossPenalty = t.awayL * 0.05;  // -0.05 per away loss
      const sosBonus = t.SOS * 0.1;            // 10% of SOS
  
      t.Power += awayWinBoost + homeWinBoost - homeLossPenalty - awayLossPenalty + sosBonus;
    }
  
    // Sort teams by adjusted Power
    const sortedByPower = Object.values(teamStats).sort((a, b) => b.Power - a.Power);
  
    // Assign power ranks
    sortedByPower.forEach((team, index) => {
      team.powerRank = index + 1;
    });
  
    return Object.values(teamStats);
  }

export { Standings, computeStandings };