import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase';
import { computeStandings } from './Standings';
import { GetTeamLogo } from './Tournament';
import styles from './Tournament.module.css';
import { secureSet } from './SecureDB';

const Bracket = ({ teams }) => {
  const [seededTeams, setSeededTeams] = useState([]); 
  const [bracketWinners, setBracketWinners] = useState({
    matchA: null,
    matchC: null,
    matchD: null, 

    matchB: null,
    matchE: null,

    final: null, 
  });

  useEffect(() => {
    if (!teams || Object.keys(teams).length === 0) return;

    const scheduleRef = ref(database, 'tournament/schedule');
    const unsubscribe = onValue(scheduleRef, (snapshot) => {
      const gamesData = snapshot.val();
      if (!gamesData) {
        setSeededTeams([]);
        return;
      }
      const completedGames = Object.values(gamesData).filter(g => g.completed === true);
      const fullStandings = computeStandings(completedGames, teams);
      fullStandings.sort((a, b) => {
        if (b.PTS !== a.PTS) return b.PTS - a.PTS;
        if (b.W !== a.W) return b.W - a.W;
        const diffA = a.GF - a.GA;
        const diffB = b.GF - b.GA;
        if (diffB !== diffA) return diffB - diffA;
        return a.name.localeCompare(b.name);
      });
      setSeededTeams(fullStandings.slice(0, 7));
    });

    return () => unsubscribe();
  }, [teams]);

  useEffect(() => {
    const bracketRef = ref(database, 'tournament/bracket');
    const unsubscribe = onValue(bracketRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBracketWinners(data);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleWinnerSelect = (matchKey, teamObj) => {
    setBracketWinners((prev) => {
      const newWinners = { ...prev, [matchKey]: teamObj };
      // Persist to Firebase
      const bracketRef = ref(database, 'tournament/bracket');
      secureSet(bracketRef, newWinners);
      return newWinners;
    });
  };

  if (seededTeams.length < 7) {
    return (
      <div className={styles.bracketContainer}>
        <h2>Playoff Bracket</h2>
        <p>Need at least 7 teams in the standings!</p>
      </div>
    );
  }

  const seed1 = seededTeams[0];
  const seed2 = seededTeams[1];
  const seed3 = seededTeams[2];
  const seed4 = seededTeams[3];
  const seed5 = seededTeams[4];
  const seed6 = seededTeams[5];
  const seed7 = seededTeams[6];

  const winnerA = bracketWinners.matchA;
  const winnerC = bracketWinners.matchC;
  const winnerD = bracketWinners.matchD;

  const winnerB = bracketWinners.matchB;
  const winnerE = bracketWinners.matchE; // winnerC vs winnerD

  // Final winner
  const finalWinner = bracketWinners.final;

  return (
    <div className={styles.bracketContainer}>
      <h2>Playoff Bracket</h2>
      <div className={styles.bracketGrid}>

        {/* ROUND 1: Quarterfinals */}
        <div className={styles.bracketColumn}>
          <BracketMatch
            label="QF: (4 vs 5)"
            team1={seed4}
            team2={seed5}
            winner={winnerA}
            matchKey="matchA"
            onWinnerSelect={handleWinnerSelect}
          />
          <BracketMatch
            label="QF: (2 vs 7)"
            team1={seed2}
            team2={seed7}
            winner={winnerC}
            matchKey="matchC"
            onWinnerSelect={handleWinnerSelect}
          />
          <BracketMatch
            label="QF: (3 vs 6)"
            team1={seed3}
            team2={seed6}
            winner={winnerD}
            matchKey="matchD"
            onWinnerSelect={handleWinnerSelect}
          />
        </div>

        {/* ROUND 2: Semifinals */}
        <div className={styles.bracketColumn}>
          <BracketMatch
            label="SF: (#1 vs A)"
            team1={seed1}
            team2={winnerA}
            winner={winnerB}
            matchKey="matchB"
            onWinnerSelect={handleWinnerSelect}
          />
          <BracketMatch
            label="SF: (C vs D)"
            team1={winnerC}
            team2={winnerD}
            winner={winnerE}
            matchKey="matchE"
            onWinnerSelect={handleWinnerSelect}
          />
        </div>

        {/* ROUND 3: Final */}
        <div className={styles.bracketColumn}>
          <BracketMatch
            label="Final"
            team1={winnerB}
            team2={winnerE}
            winner={finalWinner}
            matchKey="final"
            onWinnerSelect={handleWinnerSelect}
          />

          {finalWinner && (
            <div className={styles.championBox}>
              <h3>Champion:</h3>
              <TeamDisplay team={finalWinner} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Bracket;

/** Each bracket match: two teams, a winner, click to pick a winner. */
function BracketMatch({ label, team1, team2, winner, matchKey, onWinnerSelect }) {
  return (
    <div className={styles.matchContainer}>
      <h4>{label}</h4>
      <div className={styles.matchRow}>
        <TeamSlot
          team={team1}
          isWinner={winner?.teamKey === team1?.teamKey}
          onClick={() => team1 && onWinnerSelect(matchKey, team1)}
        />
        <span className={styles.vsText}>vs.</span>
        <TeamSlot
          team={team2}
          isWinner={winner?.teamKey === team2?.teamKey}
          onClick={() => team2 && onWinnerSelect(matchKey, team2)}
        />
      </div>
      {winner && (
        <div className={styles.winnerText}>Winner: {winner.name}</div>
      )}
    </div>
  );
}

function TeamSlot({ team, isWinner, onClick }) {
  if (!team) {
    return <div className={styles.placeholderSlot}>TBD</div>;
  }
  return (
    <div
      className={`${styles.teamSlot} ${isWinner ? styles.selectedTeam : ''}`}
      onClick={onClick}
    >
      <GetTeamLogo teamCode={team.code} />
      <span>{team.name}</span>
    </div>
  );
}

function TeamDisplay({ team }) {
  if (!team) return null;
  return (
    <div className={styles.teamDisplay}>
      <GetTeamLogo teamCode={team.code} />
      <span>{team.name}</span>
    </div>
  );
}
