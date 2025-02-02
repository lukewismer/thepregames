import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import styles from './ProPursuit.module.css';

import db from '../../firebase';
import Navbar from '../../Components/Navbar/Navbar';
import ProPursuitForm from './ProPursuitForm';
import Instructions from '../../Components/Instructions-Popup/Instructions';
import { FaQuestion } from 'react-icons/fa';

const icon = require('./pp-icon.png');
const logo = require('../../Assets/Beer_logo.png');

const ProPursuit = () => {
    const [data, setData] = useState(null);
    const [showForm, setShowForm] = useState(true);
    const [playersNames, setPlayersNames] = useState([]);
    const [nflPlayers, setNflPlayers] = useState([]);
    const [nhlPlayers, setNhlPlayers] = useState([]);
    const [nbaPlayers, setNbaPlayers] = useState([]);
    const [mlbPlayers, setMlbPlayers] = useState([]);

    const [selectedLeagues, setSelectedLeagues] = useState([]);
    const [selectedPool, setSelectedPool] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState("");

    const [isWin, setIsWin] = useState(false);
    // NEW STATE: controlling whether the user clicked "Reveal Player"
    const [showToastEarly, setShowToastEarly] = useState(false);

    const [guessDataArr, setGuessDataArr] = useState([]);
    const [guessInput, setGuessInput] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

    const inputRef = useRef(null);
    const playersInfoRef = useRef([]);

    const nflPositionGroups = {
        offense: ['Quarterback', 'Running Back', 'Wide Receiver', 'Tight End', 'Center', 'Guard', 'Offensive Tackle', 'Fullback'],
        defense: ['Defensive Tackle', 'Defensive End', 'Linebacker', 'Cornerback', 'Safety'],
        special: ['Punter', 'Place Kicker', 'Long Snapper']
    };
      
    const mlbPositionGroups = {
        defense: ['P'],
        offense: ['C', '1B', '2B', 'SS', '3B', 'OF', 'LF', 'CF', 'RF', 'DH', 'TWP']
    };
      
    const nhlPositionGroups = {
        defense: ['G', 'D'],
        offense: ['C', 'LW', 'RW', 'F']
    };

    const nbaPositionGroups = {
        offense: ['PG', 'SG', 'SF', 'PF', 'C']
    };

    useEffect(() => {
        const fetchData = async () => {
            const currentTime = new Date().getTime();
            const lastFetchTime = localStorage.getItem('lastFetchTime');
    
            if (lastFetchTime && (currentTime - lastFetchTime < 24 * 60 * 60 * 1000)) {
                // Load from localStorage
                const playersData = JSON.parse(localStorage.getItem('playersData'));
                setData(playersData);
                
                setPlayersNames(JSON.parse(localStorage.getItem('allPlayerNames')));
                setMlbPlayers(JSON.parse(localStorage.getItem('mlbPlayers')));
                setNflPlayers(JSON.parse(localStorage.getItem('nflPlayers')));
                setNhlPlayers(JSON.parse(localStorage.getItem('nhlPlayers')));
                setNbaPlayers(JSON.parse(localStorage.getItem('nbaPlayers')));
                
            } else {
                // Fetch new data
                const [
                    nbaSnapshot,
                    nhlSnapshot,
                    nflSnapshot,
                    mlbSnapshot
                ] = await Promise.all([
                    getDocs(collection(db, 'nba_players')),
                    getDocs(collection(db, 'nhl_players')),
                    getDocs(collection(db, 'nfl_players')),
                    getDocs(collection(db, 'mlb_players'))
                ]);
    
                // Process data
                const nbaPlayersList = nbaSnapshot.docs.map(doc => doc.data());
                const nhlPlayersList = nhlSnapshot.docs.map(doc => doc.data());
                const nflPlayersList = nflSnapshot.docs.map(doc => doc.data());
                const mlbPlayersList = mlbSnapshot.docs.map(doc => doc.data());
    
                // Create player names arrays
                const nbaPlayerNames = nbaPlayersList.map(p => `${p.name} - (${p.team})`);
                const nhlPlayerNames = nhlPlayersList.map(p => `${p.name} - (${p.team})`);
                const nflPlayerNames = nflPlayersList.map(p => `${p.name} - (${p.team})`);
                const mlbPlayerNames = mlbPlayersList.map(p => `${p.name} - (${p.team})`);
                const allPlayerNames = [...nbaPlayerNames, ...nhlPlayerNames, ...nflPlayerNames, ...mlbPlayerNames];
    
                // Set state
                setData({
                    nbaPlayers: nbaPlayersList,
                    nhlPlayers: nhlPlayersList,
                    nflPlayers: nflPlayersList,
                    mlbPlayers: mlbPlayersList
                });
                setPlayersNames(allPlayerNames);

                setNbaPlayers(nbaPlayerNames);
                setNhlPlayers(nhlPlayerNames);
                setNflPlayers(nflPlayerNames);
                setMlbPlayers(mlbPlayerNames);
    
                localStorage.setItem('playersData', JSON.stringify({
                    nbaPlayers: nbaPlayersList,
                    nhlPlayers: nhlPlayersList,
                    nflPlayers: nflPlayersList,
                    mlbPlayers: mlbPlayersList
                }));
                localStorage.setItem('allPlayerNames', JSON.stringify(allPlayerNames));
                localStorage.setItem('nbaPlayers', JSON.stringify(nbaPlayerNames));
                localStorage.setItem('nhlPlayers', JSON.stringify(nhlPlayerNames));
                localStorage.setItem('nflPlayers', JSON.stringify(nflPlayerNames));
                localStorage.setItem('mlbPlayers', JSON.stringify(mlbPlayerNames));
                localStorage.setItem('lastFetchTime', currentTime.toString());
            }
        };
        fetchData();
    }, []);

    const handleClose = (selectedLeagues, selectedPool, selectedSelection, selectedPlayer) => {
        setSelectedLeagues(selectedLeagues);
        setSelectedPool(selectedPool);
        setSelectedPlayer(selectedPlayer);
        setShowForm(false);
    };

    // Pre-compute references
    useEffect(() => {
        const playersInfo = playersNames.map(player => {
            const [playerName, playerTeam] = player.split(' - ');
            const cleanedTeam = playerTeam.replace('(', '').replace(')', '');
            const playerData = queryPlayer(playerName, cleanedTeam);
            return {
                name: playerName?.toLowerCase(),
                fullName: player,
                league: playerData?.league,
                fantasy_relevant: playerData?.fantasy_relevant,
                starter: playerData?.starter
            };
        });
        playersInfoRef.current = playersInfo;
    }, [playersNames]);

    const handleGuessInput = (e) => {
        const input = e.target.value?.toLowerCase();
        setGuessInput(input);

        if (!input) {
            setDropdownOpen(false);
            setFilteredPlayers([]);
            return;
        }

        const filtered = playersInfoRef.current.filter(playerInfo => {
            if (!playerInfo.name.includes(input)) return false;

            const pools = [];
            if (selectedPool.length === 0 || selectedPool.includes("All")) {
                pools.push("All");
            }
            if (selectedPool.includes("Fantasy Relevant") && playerInfo?.fantasy_relevant) {
                pools.push("Fantasy Relevant");
            }
            if (selectedPool.includes("Starter") && playerInfo?.starter) {
                pools.push("Starter");
            }
            
            if (
                (selectedLeagues.length === 0 || 
                 selectedLeagues.includes(playerInfo.league) || 
                 selectedLeagues.includes('All')) && 
                (pools.some(pool => selectedPool.includes(pool)))
            ) {
                return true;
            }

            return false;
        }).map(playerInfo => playerInfo.fullName);

        setFilteredPlayers(filtered);
        setDropdownOpen(true);
    };

    const queryPlayer = (playerName, playerTeam) => {
        const nbaPlayer = data?.nbaPlayers?.find(p => p.name === playerName && p.team === playerTeam);
        const nhlPlayer = data?.nhlPlayers?.find(p => p.name === playerName && p.team === playerTeam);
        const nflPlayer = data?.nflPlayers?.find(p => p.name === playerName && p.team === playerTeam);
        const mlbPlayer = data?.mlbPlayers?.find(p => p.name === playerName && p.team === playerTeam);
        return nbaPlayer || nhlPlayer || nflPlayer || mlbPlayer;
    };

    const handleSelectPlayer = (player) => {
        setGuessInput(player);
        setDropdownOpen(false);
        handleGuess(player);
        setGuessInput("");
    };

    const handleGuess = (player) => {
        const guessPlayerName = player.split(' - ')[0];
        const guessPlayerTeam = player.split(' - ')[1].replace('(', '').replace(')', '');
        const guessPlayer = queryPlayer(guessPlayerName, guessPlayerTeam);

        const guessConference = guessPlayer?.conference ?? guessPlayer?.Conference;
        const guessDivision = guessPlayer?.division ?? guessPlayer?.Division;
        const guessTeam = guessPlayer?.team ?? guessPlayer?.Team;
        const guessPosition = guessPlayer?.position ?? guessPlayer?.Position;
        const guessHeight = guessPlayer?.height ?? guessPlayer?.Height;
        const guessWeight = guessPlayer?.weight ?? guessPlayer?.Weight;
        const guessAge = guessPlayer?.age ?? guessPlayer?.Age;
        const guessNumber = guessPlayer?.number ?? guessPlayer?.jersey ?? guessPlayer?.jerseyNumber;
        const guessLeague = guessPlayer?.league ?? guessPlayer?.League;

        setGuessDataArr(prevGuessDataArr => [
            ...prevGuessDataArr,
            {
                guessPlayerName,
                guessLeague,
                guessConference,
                guessDivision,
                guessTeam,
                guessPosition,
                guessHeight,
                guessWeight,
                guessAge,
                guessNumber
            }
        ]);
    };

    const parseHeight = (height) => {
        const sanitizedHeight = String(height).replace(/\s|"/g, "");
        const parts = sanitizedHeight.split("'");
        if (parts.length === 1) parts.push("0");
        const [feet, inches] = parts.map(Number);
        return feet * 12 + inches;
    };

    const formatHeight = (height) => {
        // Convert to total inches first
        if (typeof height === "string") {
            height = height.trim().replace(/\s|"/g, "");
        }

        let totalInches;
        if (typeof height === "number") {
            totalInches = height;
        } else if (typeof height === "string") {
            const parts = height.split("'");
            if (parts.length === 2) {
                const [ft, inch] = parts.map(Number);
                totalInches = ft * 12 + inch;
            } else {
                totalInches = Number(height);
            }
        }
        if (isNaN(totalInches) || totalInches < 0) {
            return null;
        }

        const ft = Math.floor(totalInches / 12);
        const inch = totalInches % 12;
        return `${ft}'${inch}"`;
    };

    const isPositionClose = (finalPos, guessPos, league) => {
        const normalize = pos => pos?.toLowerCase().trim();
        const final = normalize(finalPos);
        const guess = normalize(guessPos);

        if (final === guess) return true;

        const groups = {
            NFL: nflPositionGroups,
            MLB: mlbPositionGroups,
            NHL: nhlPositionGroups,
            NBA: nbaPositionGroups
        }[league];

        if (!groups) return false;

        // If both positions exist in the same group, call it "close"
        return Object.values(groups).some(group =>
            group.some(p => normalize(p) === final) &&
            group.some(p => normalize(p) === guess)
        );
    };

    const renderGuessData = () => {
        if (guessDataArr.length === 0 || !selectedPlayer) return null;

        const finalPlayerName = selectedPlayer.split(' - ')[0];
        const finalPlayerTeam = selectedPlayer.split(' - ')[1].replace('(', '').replace(')', '');
        const finalPlayer = queryPlayer(finalPlayerName, finalPlayerTeam);

        const finalLeague = finalPlayer?.league ?? finalPlayer?.League;
        const finalConference = finalPlayer?.conference ?? finalPlayer?.Conference;
        const finalDivision = finalPlayer?.division ?? finalPlayer?.Division;
        const finalTeam = finalPlayer?.team ?? finalPlayer?.Team;
        const finalPosition = finalPlayer?.position ?? finalPlayer?.Position;
        const finalHeight = finalPlayer?.height ?? finalPlayer?.Height;
        const finalWeight = finalPlayer?.weight ?? finalPlayer?.Weight;
        const finalAge = finalPlayer?.age ?? finalPlayer?.Age;
        const finalNumber = finalPlayer?.number ?? finalPlayer?.jersey ?? finalPlayer?.jerseyNumber;

        return guessDataArr.map((player, index) => (
            <React.Fragment key={`guess-${index}-${player.guessPlayerName}`}>
                {/* Name */}
                <div
                  className={
                    finalPlayerName?.toLowerCase() === player.guessPlayerName?.toLowerCase() &&
                    finalPlayerTeam?.toLowerCase() === player.guessTeam?.toLowerCase()
                      ? `${styles.gridCell} ${styles.guessRight}`
                      : `${styles.gridCell} ${styles.guessWrong}`
                  }
                >
                  {player.guessPlayerName}
                </div>

                {/* League */}
                <div
                  className={
                    finalLeague?.toLowerCase() === player.guessLeague?.toLowerCase()
                      ? `${styles.gridCell} ${styles.guessRight}`
                      : `${styles.gridCell} ${styles.guessWrong}`
                  }
                >
                  {player.guessLeague}
                </div>

                {/* Conference */}
                <div
                  className={
                    finalConference?.toLowerCase() === player.guessConference?.toLowerCase()
                      ? `${styles.gridCell} ${styles.guessRight}`
                      : `${styles.gridCell} ${styles.guessWrong}`
                  }
                >
                  {player.guessConference}
                </div>

                {/* Division */}
                <div
                  className={
                    finalDivision?.toLowerCase() === player.guessDivision?.toLowerCase()
                      ? `${styles.gridCell} ${styles.guessRight}`
                      : `${styles.gridCell} ${styles.guessWrong}`
                  }
                >
                  {player.guessDivision}
                </div>

                {/* Team */}
                <div
                  className={
                    finalTeam?.toLowerCase() === player.guessTeam?.toLowerCase()
                      ? `${styles.gridCell} ${styles.guessRight}`
                      : `${styles.gridCell} ${styles.guessWrong}`
                  }
                >
                  {player.guessTeam}
                </div>

                {/* Position */}
                <div
                  className={
                    finalPosition?.toLowerCase() === player.guessPosition?.toLowerCase()
                      ? `${styles.gridCell} ${styles.guessRight}`
                      : isPositionClose(finalPosition, player.guessPosition, finalLeague)
                      ? `${styles.gridCell} ${styles.guessClose}`
                      : `${styles.gridCell} ${styles.guessWrong}`
                  }
                >
                  {player.guessPosition}
                </div>

                {/* Height */}
                <div
                  className={
                    Math.abs(parseHeight(finalHeight) - parseHeight(player.guessHeight)) === 0
                      ? `${styles.gridCell} ${styles.guessRight}`
                      : Math.abs(parseHeight(finalHeight) - parseHeight(player.guessHeight)) <= 2
                      ? `${styles.gridCell} ${styles.guessClose}`
                      : `${styles.gridCell} ${styles.guessWrong}`
                  }
                >
                  {formatHeight(player.guessHeight)}{" "}
                  {parseHeight(finalHeight) > parseHeight(player.guessHeight)
                    ? "↑"
                    : parseHeight(finalHeight) < parseHeight(player.guessHeight)
                    ? "↓"
                    : ""}
                </div>

                {/* Weight */}
                <div
                  className={
                    finalWeight === player.guessWeight
                      ? `${styles.gridCell} ${styles.guessRight}`
                      : Math.abs(finalWeight - player.guessWeight) <= 15
                      ? `${styles.gridCell} ${styles.guessClose}`
                      : `${styles.gridCell} ${styles.guessWrong}`
                  }
                >
                  {player.guessWeight}{" "}
                  {finalWeight > player.guessWeight
                    ? "↑"
                    : finalWeight < player.guessWeight
                    ? "↓"
                    : ""}
                </div>

                {/* Age */}
                <div
                  className={
                    finalAge === player.guessAge
                      ? `${styles.gridCell} ${styles.guessRight}`
                      : Math.abs(finalAge - player.guessAge) <= 2
                      ? `${styles.gridCell} ${styles.guessClose}`
                      : `${styles.gridCell} ${styles.guessWrong}`
                  }
                >
                  {player.guessAge}{" "}
                  {finalAge > player.guessAge
                    ? "↑"
                    : finalAge < player.guessAge
                    ? "↓"
                    : ""}
                </div>

                {/* Number */}
                <div
                  className={
                    parseInt(finalNumber) === parseInt(player.guessNumber)
                      ? `${styles.gridCell} ${styles.guessRight}`
                      : Math.abs(parseInt(finalNumber) - parseInt(player.guessNumber)) <= 10
                      ? `${styles.gridCell} ${styles.guessClose}`
                      : `${styles.gridCell} ${styles.guessWrong}`
                  }
                >
                  {player.guessNumber}{" "}
                  {parseInt(finalNumber) > parseInt(player.guessNumber)
                    ? "↑"
                    : parseInt(finalNumber) < parseInt(player.guessNumber)
                    ? "↓"
                    : ""}
                </div>
            </React.Fragment>
        ));
    };

    // Check if the last guess is a correct guess
    useEffect(() => {
        if (guessDataArr.length > 0 && selectedPlayer) {
            const finalPlayerName = selectedPlayer.split(' - ')[0];
            const finalPlayerTeam = selectedPlayer.split(' - ')[1].replace('(', '').replace(')', '');
            const lastGuess = guessDataArr[guessDataArr.length - 1];

            if (
                finalPlayerName?.toLowerCase() === lastGuess.guessPlayerName?.toLowerCase() &&
                finalPlayerTeam?.toLowerCase() === lastGuess.guessTeam?.toLowerCase()
            ) {
                setIsWin(true);
            }
        }
    }, [guessDataArr, selectedPlayer]);

    // Close the dropdown if the user clicks outside
    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mouseup", handleClickOutside);
        return () => {
            document.removeEventListener("mouseup", handleClickOutside);
        };
    }, []);

    // NEW: Reveal Player early
    const handleRevealPlayer = () => {
      setShowToastEarly(true);
    };

    return (
        <div className={styles.proPursuit}>
            <Navbar />

            {isInstructionsOpen && (
                <Instructions
                    gameTitle="Pro Pursuit"
                    subheader="Like Wordle, but for your favourite sports players!"
                    icon={icon}
                    instructionsText="The dropdown will only list players that could be a possible answer. 
                    After guessing, each category cell color indicates correct (green), wrong (red), or close (yellow). 
                    Close means correct side of the ball for position or being within certain numerical ranges for height, weight, age, or number."
                    onClose={() => setIsInstructionsOpen(false)}
                />
            )}

            {(guessDataArr.length === 8 || isWin || showToastEarly) && (
                <div className={styles.toastBackdrop}>
                    <div className={styles.toastContainer}>
                    <GameToast
                        isWinning={!showToastEarly && isWin}
                        playerName={selectedPlayer}
                        numGuesses={guessDataArr.length}
                    />
                    </div>
                </div>
            )}

            {showForm && (
                <ProPursuitForm
                    onClose={handleClose}
                    playerData={data}
                    playerNames={playersNames}
                    nhlPlayerNames={nhlPlayers}
                    nbaPlayerNames={nbaPlayers}
                    nflPlayerNames={nflPlayers}
                    mlbPlayerNames={mlbPlayers}
                />
            )}

            <div className={styles.ppContainer}>
                <div className={styles.ppfTitleRow}>
                    <h1 className={styles.ppTitle}>Pro Pursuit</h1>
                    <FaQuestion
                        className={styles.instructionsBtnPp}
                        onClick={() => setIsInstructionsOpen(true)}
                    />
                </div>

                <div className={styles.ppDescription}>
                    <p>ProPursuit is a game where you pick a player and try to guess them within 8 tries.</p>
                </div>

                <div className={styles.hrIconRow}>
                    <img className={styles.hrIcon} src={icon} alt="HR Icon" />
                </div>

                <div className={styles.ppGame}>
                    <div className={styles.ppGuess}>
                        <div className={styles.ppGuessCounter}>
                            <h5 className={styles.guessCounter}>Guesses: {guessDataArr.length} / 8</h5>
                            <button className={styles.revealBtn} onClick={handleRevealPlayer}>
                                Reveal Player
                            </button>
                        </div>
                        <div className={styles.ppGuessInput} ref={inputRef}>
                            <input
                                type="text"
                                id="player-name"
                                placeholder="Enter Player"
                                className={styles.ppGuessInputTag}
                                value={guessInput}
                                onChange={handleGuessInput}
                                onClick={() => setDropdownOpen(true)}
                                autoComplete="off"
                            />
                            {dropdownOpen && (
                                <div className={styles.customDropdown}>
                                    {filteredPlayers.map((player, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleSelectPlayer(player)}
                                            className={styles.dropdownItem}
                                        >
                                            {player}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Grid with guesses */}
                    <div className={styles.ppGrid}>
                        <div className={styles.gridHeader}>Name</div>
                        <div className={styles.gridHeader}>League</div>
                        <div className={styles.gridHeader}>Conference</div>
                        <div className={styles.gridHeader}>Division</div>
                        <div className={styles.gridHeader}>Team</div>
                        <div className={styles.gridHeader}>Position</div>
                        <div className={styles.gridHeader}>Height</div>
                        <div className={styles.gridHeader}>Weight</div>
                        <div className={styles.gridHeader}>Age</div>
                        <div className={styles.gridHeader}>Number</div>
                        
                        {renderGuessData()}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Updated GameToast to handle winning/losing in the same component
const GameToast = ({ isWinning, playerName, numGuesses }) => {
    const headerText = isWinning
      ? `Congratulations, you got it in ${numGuesses} guesses!`
      : 'Better Luck Next Time!';

    const bodyText = `The player was ${playerName}`;
    const iconImageSrc = /* You can swap in a different icon for losing if desired */ 
      isWinning ? logo : logo;

    return (
        <div className={styles.toastContainer}>
            <div className={styles.toast}>
                <div className={styles.toastHeader}>{headerText}</div>
                <img className={styles.toastIcon} src={iconImageSrc} alt={isWinning ? 'Winning' : 'Losing'} />
                <div className={styles.toastBody}>{bodyText}</div>
                <div className={styles.toastButtons}>
                    <button onClick={() => window.location.reload()} className={styles.toastButton}>
                        Restart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProPursuit;
