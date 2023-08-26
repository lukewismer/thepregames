import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import './ProPursuit.css';

import db from '../../firebase';
import Navbar from '../../Components/Navbar/Navbar';

import ProPursuitForm from './ProPursuitForm';

const logo = require('../../Assets/Beer_logo.png');

const ProPursuit = () => {
    // Need to query the firebase database for the sports data
    const [data, setData] = useState(null);
    const [showForm, setShowForm] = useState(true);
    const [playersNames, setPlayersNames] = useState([]);
    const [ nflPlayers, setNflPlayers ] = useState([]);
    const [ nhlPlayers, setNhlPlayers ] = useState([]);
    const [ nbaPlayers, setNbaPlayers ] = useState([]);

    const [ selectedLeagues, setSelectedLeagues ] = useState([]);
    const [ selectedPool, setSelectedPool ] = useState([]);
    const [ selectedSelection, setSelectedSelection ] = useState([]);
    const [ selectedPlayer, setSelectedPlayer ] = useState("");
    const [ selectedPlayerData, setSelectedPlayerData ] = useState([]);

    const [ isWin, setIsWin ] = useState(false);

    const [ guess, setGuess ] = useState([]);

    const [ guessDataArr, setGuessDataArr ] = useState([]);

    const [ guessInput, setGuessInput ] = useState("");

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filteredPlayers, setFilteredPlayers] = useState([]);

    const inputRef = useRef(null);
    const playersInfoRef = useRef([]);

    const offense = ['Quarterback', 'Running Back', 'Wide Receiver', "Offensive Tackle", "Tight End", "Center", "Guard", "Fullback"];
    const defense = ['Cornerback', 'Defensive Tackle', 'Safety', "Defensive End", "Linebacker"];
    const specialTeams = ['Punter', 'Place kicker', "Long Snapper", ];


    const handleGuessInput = (e) => {
        const input = e.target.value.toLowerCase();
        setGuessInput(input);

        if (input.length === 0) {
            setDropdownOpen(false);
            setFilteredPlayers([]);
            return;
        }

        const filteredPlayers = playersInfoRef.current.filter(playerInfo => {
            if (!playerInfo.name.includes(input)) {
                return false;
            }
            console.log(playerInfo)

            const playerPool = [];
            if (selectedPool.length === 0 || selectedPool.includes("All")) {
                playerPool.push("All");
            } 
            if (selectedPool.includes("Fantasy Relevant")) {
                if (playerInfo.fantasy_relevant === true)
                {
                    playerPool.push("Fantasy Relevant");
                }
            }
            if (selectedPool.includes("Starter"))
            {
                if (playerInfo.starter === true)
                {
                    playerPool.push("Starter");
                }
            }

            
            if (
                (selectedLeagues.length === 0 || 
                selectedLeagues.includes(playerInfo.league) || 
                selectedLeagues.includes('All')) && 
                (playerPool.some(pool => selectedPool.includes(pool)))
              ) {
                return true;
              }

            return false;
        }).map(playerInfo => playerInfo.fullName);

        setFilteredPlayers(filteredPlayers);
        setDropdownOpen(true);
    };

    useEffect(() => {
        // Pre-compute player information
        const playersInfo = playersNames.map(player => {
            const [playerName, playerTeam] = player.split(' - ');
            const playerData = queryPlayer(playerName, playerTeam.replace('(', '').replace(')', ''));
            const playerLeague = findLeague(playerData);

            return {
                name: playerName.toLowerCase(),
                fullName: player,
                league: playerLeague,
                fantasy_relevant: playerData.fantasy_relevant,
                starter: playerData.starter
            };
        });

        playersInfoRef.current = playersInfo;
    }, [playersNames, selectedLeagues]);
    

    const handleSelectPlayer = (player) => {
        setGuessInput(player);
        setDropdownOpen(false);
        handleGuess(player);
        setGuessInput("");
    };

    useEffect(() => {
        const fetchData = async () => {
            const currentTime = new Date().getTime();
            const lastFetchTime = localStorage.getItem('lastFetchTime');
    
            if (lastFetchTime && (currentTime - lastFetchTime < 24 * 60 * 60 * 1000)) {
                // Load data from localStorage
                const playersData = JSON.parse(localStorage.getItem('playersData'));
                setData(playersData);
    
                const allPlayerNames = JSON.parse(localStorage.getItem('allPlayerNames'));
                setPlayersNames(allPlayerNames);
    
                const nbaPlayerNames = JSON.parse(localStorage.getItem('nbaPlayers'));
                setNbaPlayers(nbaPlayerNames);
    
                const nhlPlayerNames = JSON.parse(localStorage.getItem('nhlPlayers'));
                setNhlPlayers(nhlPlayerNames);
    
                const nflPlayerNames = JSON.parse(localStorage.getItem('nflPlayers'));
                setNflPlayers(nflPlayerNames);
            } else {
                // Fetch new data
                const nbaPlayersCollection = collection(db, 'nba_players');
                const nbaPlayersSnapshot = await getDocs(nbaPlayersCollection);
    
                const nhlPlayersCollection = collection(db, 'nhl_players');
                const nhlPlayersSnapshot = await getDocs(nhlPlayersCollection);
    
                const nflPlayersCollection = collection(db, 'nfl_players');
                const nflPlayersSnapshot = await getDocs(nflPlayersCollection);
    
                const nbaPlayersList = nbaPlayersSnapshot.docs.map(doc => doc.data());
                const nhlPlayersList = nhlPlayersSnapshot.docs.map(doc => doc.data());
                const nflPlayersList = nflPlayersSnapshot.docs.map(doc => doc.data());
    
                const playersData = {
                    nbaPlayers: nbaPlayersList,
                    nhlPlayers: nhlPlayersList,
                    nflPlayers: nflPlayersList
                };
    
                const allPlayerNames = [
                    ...nbaPlayersList.map(player => `${player.name} - (${player.team})`),
                    ...nhlPlayersList.map(player => `${player.name} - (${player.Team})`),
                    ...nflPlayersList.map(player => `${player.name} - (${player.team})`),
                ];
    
                const nbaPlayerNames = nbaPlayersList.map(player => `${player.name} - (${player.team})`);
                const nhlPlayerNames = nhlPlayersList.map(player => `${player.name} - (${player.Team})`);
                const nflPlayerNames = nflPlayersList.map(player => `${player.name} - (${player.team})`);
    
                setNbaPlayers(nbaPlayerNames);
                setNhlPlayers(nhlPlayerNames);
                setNflPlayers(nflPlayerNames);
                
                setPlayersNames(allPlayerNames);
                setData(playersData);
    
                // Save everything to localStorage
                localStorage.setItem('nbaPlayers', JSON.stringify(nbaPlayerNames));
                localStorage.setItem('nhlPlayers', JSON.stringify(nhlPlayerNames));
                localStorage.setItem('nflPlayers', JSON.stringify(nflPlayerNames));
                localStorage.setItem('allPlayerNames', JSON.stringify(allPlayerNames));
                localStorage.setItem('playersData', JSON.stringify(playersData));
    
                // Update the last fetch time
                localStorage.setItem('lastFetchTime', currentTime.toString());
            }
        };
    
        fetchData();
    }, []);
    

    const handleClose = (selectedLeagues, selectedPool, selectedSelection, selectedPlayer) => {
        

        setSelectedLeagues(selectedLeagues);
        setSelectedPool(selectedPool);
        setSelectedSelection(selectedSelection);
        setSelectedPlayer(selectedPlayer);

        setShowForm(false);

        console.log(selectedPlayer);
    };

    
    const queryPlayer = (playerName, playerTeam) => {
        const nbaPlayer = data.nbaPlayers.find(player => player.name === playerName && player.team === playerTeam);
        const nhlPlayer = data.nhlPlayers.find(player => player.name === playerName && player.Team === playerTeam);
        const nflPlayer = data.nflPlayers.find(player => player.name === playerName && player.team === playerTeam);

        const player = nbaPlayer ? nbaPlayer : nhlPlayer ? nhlPlayer : nflPlayer;
        return player;
    };

    const findLeague = (player) => {
        const playerName = player.team ? `${player.name} - (${player.team})` : `${player.name} - (${player.Team})`;

        if (nbaPlayers.includes(playerName)) {
            return 'NBA';
        } else if (nhlPlayers.includes(playerName)) {
            return 'NHL';
        }
        return 'NFL';
    };

    
    const handleGuess = (player) => {
        const finalPlayerName = selectedPlayer.split(' - ')[0];
        const finalPlayerTeam = selectedPlayer.split(' - ')[1].replace('(', '').replace(')', '');
        const finalPlayer = queryPlayer(finalPlayerName, finalPlayerTeam);
        const finalLeague = findLeague(finalPlayer); 

        const guess = player;

        const guessPlayerName = guess.split(' - ')[0];
        const guessPlayerTeam = guess.split(' - ')[1].replace('(', '').replace(')', '');
        const guessPlayer = queryPlayer(guessPlayerName, guessPlayerTeam);
        const guessLeague = findLeague(guessPlayer);
        const guessConference = "conference" in guessPlayer ? guessPlayer["conference"] : guessPlayer["Confernce"];
        const guessDivision = "division" in guessPlayer ? guessPlayer["division"] : guessPlayer["Division"];
        const guessTeam = "team" in guessPlayer ? guessPlayer["team"] : guessPlayer["Team"];
        const guessPosition = "position" in guessPlayer ? guessPlayer["position"] : guessPlayer["Position"];
        const guessHeight = "height" in guessPlayer ? guessPlayer["height"] : guessPlayer["Height"];
        const guessWeight = "weight" in guessPlayer ? guessPlayer["weight"] : guessPlayer["Weight"];
        const guessAge = "age" in guessPlayer ? guessPlayer["age"] : guessPlayer["Age"];
        const guessNumber = "number" in guessPlayer ? guessPlayer["number"] : guessPlayer["jersey"] ? guessPlayer["jersey"] : guessPlayer["jerseyNumber"];

        
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
        

        setGuess({
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
        });

        
    };

    const parseHeight = (height) => {
        const sanitizedHeight = height.replace(/\s|"/g, "");
        const [feet, inches] = sanitizedHeight.split("'").map(Number);
        return feet * 12 + inches;
    };
    
    const renderGuessData = () => {
        if (guessDataArr.length === 0 || selectedPlayer.length === 0) {
            return null;
        }

        const finalPlayerName = selectedPlayer.split(' - ')[0];
        const finalPlayerTeam = selectedPlayer.split(' - ')[1].replace('(', '').replace(')', '');
        const finalPlayer = queryPlayer(finalPlayerName, finalPlayerTeam);

        const finalLeague = findLeague(finalPlayer);
        const finalConference = "conference" in finalPlayer ? finalPlayer["conference"] : finalPlayer["Confernce"];
        const finalDivision = "division" in finalPlayer ? finalPlayer["division"] : finalPlayer["Division"];
        const finalTeam = "team" in finalPlayer? finalPlayer["team"] : finalPlayer["Team"];
        const finalPosition = "position" in finalPlayer ? finalPlayer["position"] : finalPlayer["Position"];
        const finalHeight = "height" in finalPlayer ?  finalPlayer["height"] : finalPlayer["Height"];
        const finalWeight = "weight" in finalPlayer ? finalPlayer["weight"] : finalPlayer["Weight"];
        const finalAge = "age" in finalPlayer ? finalPlayer["age"] : finalPlayer["Age"];
        const finalNumber = "number"in finalPlayer ? finalPlayer["number"] : finalPlayer["jersey"] ? finalPlayer["jersey"] : finalPlayer["jerseyNumber"];

        return guessDataArr.map((player, index) => (
            <>
                <div className={finalPlayerName.toLowerCase() === player.guessPlayerName.toLowerCase() && finalPlayerTeam.toLowerCase() === player.guessTeam.toLowerCase() ? 'grid-cell guess-right' : 'grid-cell guess-wrong'}>{player.guessPlayerName}</div>
                <div className={finalLeague.toLowerCase() === player.guessLeague.toLowerCase() ? 'grid-cell guess-right' : 'grid-cell guess-wrong'}>{player.guessLeague}</div>
                <div className={finalConference.toLowerCase() === player.guessConference.toLowerCase() ? 'grid-cell guess-right' : 'grid-cell guess-wrong'}>{player.guessConference}</div>
                <div className={finalDivision.toLowerCase() === player.guessDivision.toLowerCase() ? 'grid-cell guess-right' : 'grid-cell guess-wrong'}>{player.guessDivision}</div>
                <div className={finalTeam.toLowerCase() === player.guessTeam.toLowerCase() ? 'grid-cell guess-right' : 'grid-cell guess-wrong'}>{player.guessTeam}</div>
                <div className={
                    finalPosition.toLowerCase() === player.guessPosition.toLowerCase()
                    ? 'grid-cell guess-right'
                    : selectedLeagues.includes("NFL") || selectedLeagues.includes("All") && (
                        (offense.includes(finalPosition) && offense.includes(player.guessPosition)) ||
                        (defense.includes(finalPosition) && defense.includes(player.guessPosition)) ||
                        (specialTeams.includes(finalPosition) && specialTeams.includes(player.guessPosition))
                    )
                    ? 'grid-cell guess-close'
                    : 'grid-cell guess-wrong'
                    }
                >{player.guessPosition}</div>
                <div className={
                    Math.abs(parseHeight(finalHeight) === parseHeight(player.guessHeight)) ? 'grid-cell guess-right' :
                    Math.abs(parseHeight(finalHeight) - parseHeight(player.guessHeight)) <= 2
                    ? 'grid-cell guess-close'
                    : 'grid-cell guess-wrong'
                    }
                >{player.guessHeight} {parseHeight(finalHeight) > parseHeight(player.guessHeight) ? '↑' : parseHeight(finalHeight) < parseHeight(player.guessHeight) ? '↓' : ''}</div>

                <div className={
                    finalWeight === player.guessWeight
                    ? 'grid-cell guess-right'
                    : Math.abs(finalWeight - player.guessWeight) <= 15
                        ? 'grid-cell guess-close'
                        : 'grid-cell guess-wrong'
                    }
                >{player.guessWeight} {finalWeight > player.guessWeight ? '↑' : finalWeight < player.guessWeight ? '↓' : ''}</div>

                <div className={
                    finalAge === player.guessAge
                    ? 'grid-cell guess-right'
                    : Math.abs(finalAge - player.guessAge) <= 2
                        ? 'grid-cell guess-close'
                        : 'grid-cell guess-wrong'
                    }
                >{player.guessAge} {finalAge > player.guessAge ? '↑' : finalAge < player.guessAge ? '↓' : ''}</div>

                <div className={
                    finalNumber.toLowerCase() === player.guessNumber.toLowerCase()
                    ? 'grid-cell guess-right'
                    : Math.abs(finalNumber - player.guessNumber) <= 10
                        ? 'grid-cell guess-close'
                        : 'grid-cell guess-wrong'
                    }
                >{player.guessNumber} {finalNumber > player.guessNumber ? '↑' : finalNumber < player.guessNumber ? '↓' : ''}</div>

            </>
        ));
    };

    useEffect(() => {
        if (guessDataArr.length > 0 && selectedPlayer.length > 0) {
            const finalPlayerName = selectedPlayer.split(' - ')[0];
            const finalPlayerTeam = selectedPlayer.split(' - ')[1].replace('(', '').replace(')', '');
    
            if (finalPlayerName.toLowerCase() === guessDataArr[guessDataArr.length - 1].guessPlayerName.toLowerCase() && finalPlayerTeam.toLowerCase() === guessDataArr[guessDataArr.length - 1].guessTeam.toLowerCase()) {
                setIsWin(true);
            }
        }
    }, [guessDataArr, selectedPlayer]);

    useEffect(() => {
        if (selectedPlayer.length > 0) {
            const playerName = selectedPlayer.split(' - ')[0];
            const playerTeam = selectedPlayer.split(' - ')[1].replace('(', '').replace(')', '');
            
            const player = queryPlayer(playerName, playerTeam);
            setSelectedPlayerData(player);
        }
    }, [selectedPlayer]);

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

    console.log(data)
    return (
        <div className="pro-pursuit">
            <Navbar />
            { (guessDataArr.length === 8 || isWin === true) ? <GameToast isWinning={isWin} playerName={selectedPlayer} numGuesses={guessDataArr.length} /> : null }
            {showForm && <ProPursuitForm onClose={handleClose} playerData={data} playerNames={playersNames} nhlPlayerNames={nhlPlayers} nbaPlayerNames={nbaPlayers} nflPlayerNames={nflPlayers}/>}
            <div className="pp-container">
                <div className="pp-title">
                    <h1>ProPursuit</h1>
                </div>
                <div className="pp-description">
                    <p>ProPursuit is a game where you pick a player from each of the 3 major sports leagues (NBA, NHL, NFL) and get clues to guess.</p>
                </div>
                <div className="pp-game">
                    <div className="pp-guess">
                        <div className="pp-guess-counter">
                            <h5 className="guess-counter">Guesses: {guessDataArr.length} / 8</h5>
                        </div>
                        <div className="pp-guess-input" ref={inputRef}>
                            <input
                                type="text"
                                id="player-name"
                                placeholder="Enter Player"
                                className='pp-guess-input-tag'
                                value={guessInput}
                                onChange={handleGuessInput}
                                onClick={() => setDropdownOpen(true)}
                                autoComplete='off'
                            />
                            {dropdownOpen && (
                                <div className="custom-dropdown">
                                    {filteredPlayers.map((player, index) => (
                                        <div key={index} onClick={() => handleSelectPlayer(player)}>{player}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="pp-grid">

                        <div className='grid-header'>Name</div>
                        <div className='grid-header'>League</div>
                        <div className='grid-header'>Conference</div>
                        <div className='grid-header'>Division</div>
                        <div className='grid-header'>Team</div>
                        <div className='grid-header'>Position</div>
                        <div className='grid-header'>Height</div>
                        <div className='grid-header'>Weight</div>
                        <div className='grid-header'>Age</div>
                        <div className='grid-header'>Number</div>
                        
                        {renderGuessData()}
                    </div>
                </div>

            </div>
        </div>
    );
}

const GameToast = ({ isWinning, playerName, numGuesses }) => {
    const headerText = isWinning ? `Congratulations, you got it in ${numGuesses} guesses!` : 'Better Luck Next Time!';
    const bodyText = isWinning ? `The player was ${playerName}` : `The player was ${playerName}`;
    const iconImageSrc = isWinning ? logo : logo;
  
    return (
      <div className="toast-container">
        <div className="toast">
          <div className="toast-header">{headerText}</div>
          <img className="toast-icon" src={iconImageSrc} alt={isWinning ? 'Winning' : 'Losing'} />
          <div className="toast-body">{bodyText}</div>
          <div className="toast-buttons">
            <button onClick={() => window.location.reload()}>Restart</button>
          </div>
        </div>
      </div>
    );
  };

  
export default ProPursuit;