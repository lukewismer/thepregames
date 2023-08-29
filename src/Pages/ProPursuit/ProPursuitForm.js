import React, { useState } from 'react';
import './ProPursuitForm.css';

import Instructions from '../../Components/Instructions-Popup/Instructions';

import { FaQuestion } from 'react-icons/fa';

const icon = require('./pp-icon.png');

const ProPursuitForm = ({ onClose, playerData, playerNames, nhlPlayerNames, nbaPlayerNames, nflPlayerNames}) => {
  const [selectedLeagues, setSelectedLeagues] = useState(["All"]);
  const [selectedPool, setSelectedPool] = useState(["All"]);
  const [selectedSelection, setSelectedSelection] = useState("Auto");
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

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

    if (nhlPlayer) {
        return nhlPlayer;
    } else if (nbaPlayer) {
        return nbaPlayer;
    } else if (nflPlayer) {
        return nflPlayer;
    } else {
        return null;
    }
    };


  const handlePlayerChange = (e) => {
    const player = e.target.value;
    if ((selectedLeagues.includes('NHL') && selectedLeagues.includes('NBA') && selectedLeagues.includes('NFL')) || selectedLeagues.includes('All')) {
        const selectedPlayerData = findPlayerData(player);

        if (selectedPool.includes('All') || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {
            if (playerNames.includes(player)) {
                setSelectedPlayer(player);
            } else {
                setSelectedPlayer(null);
            }
        } else if (selectedPool.includes('Fantasy Relevant')) {
            if (selectedPlayerData.fantasy_relevant === true && selectedPlayerData.fantasy_relevant === true) {

                if (playerNames.includes(player)) {
                    setSelectedPlayer(player);
                } else {
                    setSelectedPlayer(null);
                }
            } else {
                alert('Player is not fantasy relevant');
                setSelectedPlayer(null);
            }
        } else if (selectedPool.includes('Starter')) {
            if (selectedPlayerData.starter === true && selectedPlayerData.starter === true) {
                if (playerNames.includes(player)) {
                    setSelectedPlayer(player);
                } else {
                    setSelectedPlayer(null);
                }
            } else {
                alert('Player is not a starter');
                setSelectedPlayer(null);
            }
        }
        
    } else if (selectedLeagues.includes('NHL') && selectedLeagues.includes('NBA')) {
        const selectedPlayerData = findPlayerData(player);
        if (selectedPool === 'All' || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {

            if (nhlPlayerNames.includes(player) || nbaPlayerNames.includes(player)) {
                setSelectedPlayer(player);
            } else {
                alert('Player is not in the NHL or NBA: A random player will be selected if you submit');
                setSelectedPlayer(null);
            }
        } else if (selectedPool.includes('Fantasy Relevant')) {
            if (selectedPlayerData.fantasy_relevant === true) {
                if (nhlPlayerNames.includes(player) || nbaPlayerNames.includes(player)) {
                    setSelectedPlayer(player);
                } else {
                    alert('Player is not in the NHL or NBA: A random player will be selected if you submit');
                    setSelectedPlayer(null);
                }
            } else {
                alert('Player is not fantasy relevant');
                setSelectedPlayer(null);
            }
        } else if (selectedPool.includes('Starter')) {
            if (selectedPlayerData.starter === true) {
                if (nhlPlayerNames.includes(player) || nbaPlayerNames.includes(player)) {
                    setSelectedPlayer(player);
                } else {
                    alert('Player is not in the NHL or NBA: A random player will be selected if you submit');
                    setSelectedPlayer(null);
                }
            } else {
                alert('Player is not a starter');
                setSelectedPlayer(null);
            }
        }
    } else if (selectedLeagues.includes('NHL') && selectedLeagues.includes('NFL')) {
        const selectedPlayerData = findPlayerData(player);

        if (selectedPool === 'All' || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {
            if (nhlPlayerNames.includes(player) || nflPlayerNames.includes(player)) {
                setSelectedPlayer(player);
            } else {
                alert('Player is not in the NHL or NFL: A random player will be selected if you submit');
                setSelectedPlayer(null);
            }
        } else if (selectedPool.includes('Fantasy Relevant')) {
            if (selectedPlayerData.fantasy_relevant === true) {
                if (nhlPlayerNames.includes(player) || nflPlayerNames.includes(player)) {
                    setSelectedPlayer(player);
                } else {
                    alert('Player is not in the NHL or NFL: A random player will be selected if you submit');
                    setSelectedPlayer(null);
                }
            } else {
                alert('Player is not fantasy relevant');
                setSelectedPlayer(null);
            }
        } else if (selectedPool.includes('Starter')) {
            if (selectedPlayerData.starter === true) {
                if (nhlPlayerNames.includes(player) || nflPlayerNames.includes(player)) {
                    setSelectedPlayer(player);
                } else {
                    alert('Player is not in the NHL or NFL: A random player will be selected if you submit');
                    setSelectedPlayer(null);
                }
            } else {
                alert('Player is not a starter');
                setSelectedPlayer(null);
            }
        }
    } else if (selectedLeagues.includes('NBA') && selectedLeagues.includes('NFL')) {
        const selectedPlayerData = findPlayerData(player);

        if (selectedPool === 'All' || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {
            if (nbaPlayerNames.includes(player) || nflPlayerNames.includes(player)) {
                setSelectedPlayer(player);
            } else {
                alert('Player is not in the NBA or NFL: A random player will be selected if you submit');
                setSelectedPlayer(null);
            }
        } else if (selectedPool.includes('Fantasy Relevant')) {
            if (selectedPlayerData.fantasy_relevant === true) {
                if (nbaPlayerNames.includes(player) || nflPlayerNames.includes(player)) {
                    setSelectedPlayer(player);
                } else {
                    alert('Player is not in the NBA or NFL: A random player will be selected if you submit');
                    setSelectedPlayer(null);
                }
            } else {
                alert('Player is not fantasy relevant');
                setSelectedPlayer(null);
            }
        } else if (selectedPool.includes('Starter')) {
            if (selectedPlayerData.starter === true) {
                if (nbaPlayerNames.includes(player) || nflPlayerNames.includes(player)) {
                    setSelectedPlayer(player);
                } else {
                    alert('Player is not in the NBA or NFL: A random player will be selected if you submit');
                    setSelectedPlayer(null);
                }
            } else {
                alert('Player is not a starter');
                setSelectedPlayer(null);
            }
        }
    } else if (selectedLeagues.includes('NHL')) {
        const selectedPlayerData = findPlayerData(player);

        if (selectedPool === 'All' || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {
            if (nhlPlayerNames.includes(player)) {
                setSelectedPlayer(player);
            } else {
                alert('Player is not in the NHL: A random player will be selected if you submit');
                setSelectedPlayer(null);
            }
        } else if (selectedPool.includes('Fantasy Relevant')) {
            if (selectedPlayerData.fantasy_relevant === true) {
                if (nhlPlayerNames.includes(player)) {
                    setSelectedPlayer(player);
                } else {
                    alert('Player is not in the NHL: A random player will be selected if you submit');
                    setSelectedPlayer(null);
                }
            } else {
                alert('Player is not fantasy relevant');
                setSelectedPlayer(null);
            }
        } else if (selectedPool.includes('Starter')) {
            if (selectedPlayerData.starter === true) {
                if (nhlPlayerNames.includes(player)) {
                    setSelectedPlayer(player);
                } else {
                    alert('Player is not in the NHL: A random player will be selected if you submit');
                    setSelectedPlayer(null);
                }
            } else {
                alert('Player is not a starter');
                setSelectedPlayer(null);
            }
        }

    } else if (selectedLeagues.includes('NBA')) {
        const selectedPlayerData = findPlayerData(player);

        if (selectedPool === 'All' || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {
            if (nbaPlayerNames.includes(player)) {
                setSelectedPlayer(player);
            } else {
                alert('Player is not in the NBA: A random player will be selected if you submit');
                setSelectedPlayer(null);
            }
        } else if (selectedPool.includes('Fantasy Relevant')) {
            if (selectedPlayerData.fantasy_relevant === true) {
                if (nbaPlayerNames.includes(player)) {
                    setSelectedPlayer(player);
                } else {
                    alert('Player is not in the NBA: A random player will be selected if you submit');
                    setSelectedPlayer(null);
                }
            } else {
                alert('Player is not fantasy relevant');
                setSelectedPlayer(null);
            }
        } else if (selectedPool.includes('Starter')) {
            if (selectedPlayerData.starter === true) {
                if (nbaPlayerNames.includes(player)) {
                    setSelectedPlayer(player);
                } else {
                    alert('Player is not in the NBA: A random player will be selected if you submit');
                    setSelectedPlayer(null);
                }
            } else {
                alert('Player is not a starter');
                setSelectedPlayer(null);
            }
        }
    } else if (selectedLeagues.includes('NFL')) {
        const selectedPlayerData = findPlayerData(player);

        if (selectedPool === 'All' || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {
            if (nflPlayerNames.includes(player)) {
                setSelectedPlayer(player);
            }
            else {
                alert('Player is not in the NFL: A random player will be selected if you submit');
                setSelectedPlayer(null);
            }
        } else if (selectedPool.includes('Fantasy Relevant')) {
            if (selectedPlayerData.fantasy_relevant === true) {
                if (nflPlayerNames.includes(player)) {
                    setSelectedPlayer(player);
                } else {
                    alert('Player is not in the NFL: A random player will be selected if you submit');
                    setSelectedPlayer(null);
                }
            } else {
                alert('Player is not fantasy relevant');
                setSelectedPlayer(null);
            }
        } else if (selectedPool.includes('Starter')) {
            if (selectedPlayerData.starter === true) {
                if (nflPlayerNames.includes(player)) {
                    setSelectedPlayer(player);
                } else {
                    alert('Player is not in the NFL: A random player will be selected if you submit');
                    setSelectedPlayer(null);
                }
            } else {
                alert('Player is not a starter');
                setSelectedPlayer(null);
            }
        }
    }
    else {
        setSelectedPlayer(null);
    }
  };

  const findLeague = (player) => {
    const playerName = player.team ? `${player.name} - (${player.team})` : `${player.name} - (${player.Team})`;

    if (nbaPlayerNames.includes(playerName)) {
        return 'NBA';
    } else if (nhlPlayerNames.includes(playerName)) {
        return 'NHL';
    }
    return 'NFL';
    };
  

  const conditionalplayerNames = () => {
    if (selectedSelection === 'User') {
        if (selectedLeagues.includes('All')) {
            if (selectedPool.includes('All') || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {
                return <div>
                        <label htmlFor="player-name">Enter Player:</label>
                        <input
                            type="text"
                            list="all_all_players"
                            id="player-name"
                            placeholder="Enter Player"
                            onChange={handlePlayerChange}
                        />
                        <datalist id="all_all_players">
                            {playerNames.map((player, index) => (
                                <option key={index} value={player} />
                            ))}
                        </datalist>
                    </div>;
            } else if (selectedPool.includes('Fantasy Relevant')) {
                return <div>
                        <label htmlFor="player-name">Enter Player:</label>
                        <input
                            type="text"
                            list="all_fr_players"
                            id="player-name"
                            placeholder="Enter Player"
                            onChange={handlePlayerChange}
                        />
                        <datalist id="all_fr_players">
                            {playerData["nflPlayers"]
                                .filter((player) => player.fantasy_relevant === true)
                                .concat(
                                    playerData["nhlPlayers"].filter((player) => player.fantasy_relevant === true),
                                    playerData["nbaPlayers"].filter((player) => player.fantasy_relevant === true)
                                )
                                .map((player, index) => (
                                    <option key={index} value={'team' in player ? `${player.name} - (${player.team})` : `${player.name} - (${player.Team})`} />
                                ))}
                        </datalist>
                    </div>;
            } else if (selectedPool.includes('Starter')) {
                return <div>
                        <label htmlFor="player-name">Enter Player:</label>
                        <input
                            type="text"
                            list="all_s_players"
                            id="player-name"
                            placeholder="Enter Player"
                            onChange={handlePlayerChange}
                        />
                        <datalist id="all_s_players">
                            {playerData["nflPlayers"]
                                .filter((player) => player.starter === true)
                                .concat(
                                    playerData["nhlPlayers"].filter((player) => player.fantasy_relevant === true),
                                    playerData["nbaPlayers"].filter((player) => player.starter === true)
                                )
                                .map((player, index) => (
                                    <option key={index} value={'team' in player ? `${player.name} - (${player.team})` : `${player.name} - (${player.Team})`} />
                                ))}
                        </datalist>
                    </div>;
            }

        } else if (selectedLeagues.includes('NHL') && selectedLeagues.includes('NBA') && selectedLeagues.includes('NFL')) {
            if (selectedPool.includes('All') || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {
                return <div>
                        <label htmlFor="player-name">Enter Player:</label>
                        <input
                            type="text"
                            list="all2_all_players"
                            id="player-name"
                            placeholder="Enter Player"
                            onChange={handlePlayerChange}
                        />
                        <datalist id="all2_all_players">
                            {playerNames.map((player, index) => (
                                <option key={index} value={player} />
                            ))}
                        </datalist>
                    </div>;
            } else if (selectedPool.includes('Fantasy Relevant')) {
                return <div>
                        <label htmlFor="player-name">Enter Player:</label>
                        <input
                            type="text"
                            list="all2_fr_players"
                            id="player-name"
                            placeholder="Enter Player"
                            onChange={handlePlayerChange}
                        />
                        <datalist id="all2_fr_players">
                            {playerData["nflPlayers"]
                                .filter((player) => player.fantasy_relevant === true)
                                .concat(
                                    playerData["nhlPlayers"].filter((player) => player.fantasy_relevant === true),
                                    playerData["nbaPlayers"].filter((player) => player.fantasy_relevant === true)
                                )
                                .map((player, index) => (
                                    <option key={index} value={'team' in player ? `${player.name} - (${player.team})` : `${player.name} - (${player.Team})`} />
                                ))}
                        </datalist>
                    </div>;
            } else if (selectedPool.includes('Starter')) {
                return <div>
                        <label htmlFor="player-name">Enter Player:</label>
                        <input
                            type="text"
                            list="all2_s_players"
                            id="player-name"
                            placeholder="Enter Player"
                            onChange={handlePlayerChange}
                        />
                        <datalist id="all2_s_players">
                            {playerData["nflPlayers"]
                                .filter((player) => player.starter === true)
                                .concat(
                                    playerData["nhlPlayers"].filter((player) => player.fantasy_relevant === true),
                                    playerData["nbaPlayers"].filter((player) => player.starter === true)
                                )
                                .map((player, index) => (
                                    <option key={index} value={'team' in player ? `${player.name} - (${player.team})` : `${player.name} - (${player.Team})`} />
                                ))}
                        </datalist>
                    </div>;
            }

        } else if (selectedLeagues.includes('NHL') && selectedLeagues.includes('NBA')) {
            if (selectedPool.includes('All') || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {
                const nhlNbaPlayers = nhlPlayerNames.concat(nbaPlayerNames);
                return <div>
                            <label htmlFor="player-name">Enter Player:</label>
                            <input
                                type="text"
                                list="nhlNba_all_players"
                                id="player-name"
                                placeholder="Enter Player"
                                onChange={handlePlayerChange}
                            />
                            <datalist id="nhlNba_all_players">
                                {nhlNbaPlayers.map((player, index) => (
                                    <option key={index} value={player} />
                                ))}
                            </datalist>
                        </div>;
            } else if (selectedPool.includes('Fantasy Relevant')) {
                const fantasyRelevantPlayers = playerData["nbaPlayers"]
                    .filter((player) => player.fantasy_relevant === true)
                    .concat(
                        playerData["nhlPlayers"].filter((player) => player.fantasy_relevant === true)
                    );
                
                return <div>
                            <label htmlFor="player-name">Enter Player:</label>
                            <input
                                type="text"
                                list="nhlNba_fr_players"
                                id="player-name"
                                placeholder="Enter Player"
                                onChange={handlePlayerChange}
                            />
                            <datalist id="nhlNba_fr_players">
                                {fantasyRelevantPlayers.map((player, index) => (
                                    <option key={index} value={'team' in player ? `${player.name} - (${player.team})` : `${player.name} - (${player.Team})`} />
                                ))}
                            </datalist>
                        </div>;
            } else if (selectedPool.includes('Starter')) {
                const starterPlayers = playerData["nbaPlayers"]
                    .filter((player) => player.starter === true)
                    .concat(
                        playerData["nhlPlayers"].filter((player) => player.fantasy_relevant === true)
                    );
                
                return <div>
                            <label htmlFor="player-name">Enter Player:</label>
                            <input
                                type="text"
                                list="nhlNba_s_players"
                                id="player-name"
                                placeholder="Enter Player"
                                onChange={handlePlayerChange}
                            />
                            <datalist id="nhlNba_s_players">
                                {starterPlayers.map((player, index) => (
                                    <option key={index} value={'team' in player ? `${player.name} - (${player.team})` : `${player.name} - (${player.Team})`} />
                                ))}
                            </datalist>
                        </div>;
            }

        } else if (selectedLeagues.includes('NHL') && selectedLeagues.includes('NFL')) {
            if (selectedPool.includes('All') || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {
                const nhlNflPlayers = nhlPlayerNames.concat(nflPlayerNames);
                return <div>
                        <label htmlFor="player-name">Enter Player:</label>
                        <input
                            type="text"
                            list="nhlNfl_all_players"
                            id="player-name"
                            placeholder="Enter Player"
                            onChange={handlePlayerChange}
                        />
                        <datalist id="nhlNfl_all_players">
                            {nhlNflPlayers.map((player, index) => (
                                <option key={index} value={player} />
                            ))}
                        </datalist>
                    </div>;
            } else if (selectedPool.includes('Fantasy Relevant')) {
                const fantasyRelevantPlayers = playerData["nflPlayers"]
                    .filter((player) => player.fantasy_relevant === true)
                    .concat(
                        playerData["nhlPlayers"].filter((player) => player.fantasy_relevant === true)
                    );

                
                return <div>
                            <label htmlFor="player-name">Enter Player:</label>
                            <input
                                type="text"
                                list="nhlNfl_fr_players"
                                id="player-name"
                                placeholder="Enter Player"
                                onChange={handlePlayerChange}
                            />
                            <datalist id="nhlNfl_fr_players">
                                {fantasyRelevantPlayers.map((player, index) => (
                                    <option key={index} value={'team' in player ? `${player.name} - (${player.team})` : `${player.name} - (${player.Team})`} />
                                ))}
                            </datalist>
                        </div>;
            } else if (selectedPool.includes('Starter')) {
                const starterPlayers = playerData["nflPlayers"]
                    .filter((player) => player.starter === true)
                    .concat(
                        playerData["nhlPlayers"].filter((player) => player.fantasy_relevant === true)
                    );

                
                return <div>
                            <label htmlFor="player-name">Enter Player:</label>
                            <input
                                type="text"
                                list="nhlNfl_s_players"
                                id="player-name"
                                placeholder="Enter Player"
                                onChange={handlePlayerChange}
                            />
                            <datalist id="nhlNfl_s_players">
                                {starterPlayers.map((player, index) => (
                                    <option key={index} value={'team' in player ? `${player.name} - (${player.team})` : `${player.name} - (${player.Team})`} />
                                ))}
                            </datalist>
                        </div>;
            }

        } else if (selectedLeagues.includes('NBA') && selectedLeagues.includes('NFL')) {
            if (selectedPool.includes('All') || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {
                const nbaNflPlayers = nbaPlayerNames.concat(nflPlayerNames);
                return <div>
                    <label htmlFor="player-name">Enter Player:</label>
                    <input
                        type="text"
                        list="nbaNfl_all_players"
                        id="player-name"
                        placeholder="Enter Player"
                        onChange={handlePlayerChange}
                    />
                    <datalist id="nbaNfl_all_players">
                        {nbaNflPlayers.map((player, index) => (
                            <option key={index} value={player} />
                        ))}
                    </datalist>
                </div>;
            } else if (selectedPool.includes('Fantasy Relevant')) {
                const fantasyRelevantPlayers = playerData["nflPlayers"]
                    .filter((player) => player.fantasy_relevant === true)
                    .concat(
                        playerData["nbaPlayers"].filter((player) => player.fantasy_relevant === true)
                    );
                
                return <div>
                            <label htmlFor="player-name">Enter Player:</label>
                            <input
                                type="text"
                                list="nbaNfl_fr_players"
                                id="player-name"
                                placeholder="Enter Player"
                                onChange={handlePlayerChange}
                            />
                            <datalist id="nbaNfl_fr_players">
                                {fantasyRelevantPlayers.map((player, index) => (
                                    <option key={index} value={'team' in player ? `${player.name} - (${player.team})` : `${player.name} - (${player.Team})`} />
                                ))}
                            </datalist>
                        </div>;
            } else if (selectedPool.includes('Starter')) { 
                const starterPlayers = playerData["nflPlayers"]
                    .filter((player) => player.starter === true)
                    .concat(
                        playerData["nbaPlayers"].filter((player) => player.starter === true)
                    );

                
                return <div>
                            <label htmlFor="player-name">Enter Player:</label>
                            <input
                                type="text"
                                list="nbaNfl_s_players"
                                id="player-name"
                                placeholder="Enter Player"
                                onChange={handlePlayerChange}
                            />
                            <datalist id="nbaNfl_s_players">
                                {starterPlayers.map((player, index) => (
                                    <option key={index} value={'team' in player ? `${player.name} - (${player.team})` : `${player.name} - (${player.Team})`} />
                                ))}
                            </datalist>
                        </div>;
            }

        } else if (selectedLeagues.includes('NHL')) {
            if (selectedPool.includes('All') || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {
                return <div>
                    <label htmlFor="player-name">Enter Player:</label>
                    <input
                        type="text"
                        list="nhl_all_players"
                        id="player-name"
                        placeholder="Enter Player"
                        onChange={handlePlayerChange}
                    />
                    <datalist id="nhl_all_players">
                        {nhlPlayerNames.map((player, index) => (
                            <option key={index} value={player} />
                        ))}
                    </datalist>
                </div>;
            } else if (selectedPool.includes('Fantasy Relevant')) {
                const fantasyRelevantPlayers = playerData["nhlPlayers"]
                    .filter((player) => player.fantasy_relevant === true)
                return <div>
                            <label htmlFor="player-name">Enter Player:</label>
                            <input
                                type="text"
                                list="nhl_fr_players"
                                id="player-name"
                                placeholder="Enter Player"
                                onChange={handlePlayerChange}
                            />
                            <datalist id="nhl_fr_players">
                                {fantasyRelevantPlayers.map((player, index) => (
                                    <option key={index} value={'team' in player ? `${player.name} - (${player.team})` : `${player.name} - (${player.Team})`} />
                                ))}
                            </datalist>
                        </div>;
            } else if (selectedPool.includes('Starter')) {
                const starterPlayers = playerData["nhlPlayers"]
                    .filter((player) => player.fantasy_relevant === true)
                
                return <div>
                            <label htmlFor="player-name">Enter Player:</label>
                            <input
                                type="text"
                                list="nhl_s_players"
                                id="player-name"
                                placeholder="Enter Player"
                                onChange={handlePlayerChange}
                            />
                            <datalist id="nhl_s_players">
                                {starterPlayers.map((player, index) => (
                                    <option key={index} value={'team' in player ? `${player.name} - (${player.team})` : `${player.name} - (${player.Team})`} />
                                ))}
                            </datalist>
                        </div>;
            }

        } else if (selectedLeagues.includes('NBA')) {
            if (selectedPool.includes('All') || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {
                return <div>
                    <label htmlFor="player-name">Enter Player:</label>
                    <input
                        type="text"
                        list="nba_all_players"
                        id="player-name"
                        placeholder="Enter Player"
                        onChange={handlePlayerChange}
                    />
                    <datalist id="nba_all_players">
                        {nbaPlayerNames.map((player, index) => (
                            <option key={index} value={player} />
                        ))}
                    </datalist>
                </div>;
            } else if (selectedPool.includes('Fantasy Relevant')) {
                const fantasyRelevantPlayers = playerData["nbaPlayers"]
                    .filter((player) => player.fantasy_relevant === true)
                
                return <div>
                            <label htmlFor="player-name">Enter Player:</label>
                            <input
                                type="text"
                                list="nba_fr_players"
                                id="player-name"
                                placeholder="Enter Player"
                                onChange={handlePlayerChange}
                            />
                            <datalist id="nba_fr_players">
                                {fantasyRelevantPlayers.map((player, index) => (
                                    <option key={index} value={'team' in player ? `${player.name} - (${player.team})` : `${player.name} - (${player.Team})`} />
                                ))}
                            </datalist>
                        </div>;
            } else if (selectedPool.includes('Starter')) {
                const starterPlayers = playerData["nbaPlayers"]
                    .filter((player) => player.starter === true)
                
                return <div>
                            <label htmlFor="player-name">Enter Player:</label>
                            <input
                                type="text"
                                list="nba_s_players"
                                id="player-name"
                                placeholder="Enter Player"
                                onChange={handlePlayerChange}
                            />
                            <datalist id="nba_s_players">
                                {starterPlayers.map((player, index) => (
                                    <option key={index} value={'team' in player ? `${player.name} - (${player.team})` : `${player.name} - (${player.Team})`} />
                                ))}
                            </datalist>
                        </div>;
            }

        } else if (selectedLeagues.includes('NFL')) {
            if (selectedPool.includes('All') || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {
                return <div>
                    <label htmlFor="player-name">Enter Player:</label>
                    <input
                        type="text"
                        list="nfl_all_players"
                        id="player-name"
                        placeholder="Enter Player"
                        onChange={handlePlayerChange}
                    />
                    <datalist id="nfl_all_players">
                        {nflPlayerNames.map((player, index) => (
                            <option key={index} value={player} />
                        ))}
                    </datalist>
                </div>;
            } else if (selectedPool.includes('Fantasy Relevant')) {
                const fantasyRelevantPlayers = playerData["nflPlayers"]
                    .filter((player) => player.fantasy_relevant === true)
                
                return <div>
                            <label htmlFor="player-name">Enter Player:</label>
                            <input
                                type="text"
                                list="nfl_fr_players"
                                id="player-name"
                                placeholder="Enter Player"
                                onChange={handlePlayerChange}
                            />
                            <datalist id="nfl_fr_players">
                                {fantasyRelevantPlayers.map((player, index) => (
                                    <option key={index} value={'team' in player ? `${player.name} - (${player.team})` : `${player.name} - (${player.Team})`} />
                                ))}
                            </datalist>
                        </div>;
            } else if (selectedPool.includes('Starter')) {
                const starterPlayers = playerData["nflPlayers"]
                    .filter((player) => player.starter === true)
                
                return <div>
                            <label htmlFor="player-name">Enter Player:</label>
                            <input
                                type="text"
                                list="nfl_s_players"
                                id="player-name"
                                placeholder="Enter Player"
                                onChange={handlePlayerChange}
                            />
                            <datalist id="nfl_s_players">
                                {starterPlayers.map((player, index) => (
                                    <option key={index} value={'team' in player ? `${player.name} - (${player.team})` : `${player.name} - (${player.Team})`} />
                                ))}
                            </datalist>
                        </div>;
            }

        } else {
            return <></>;
        }
    } else {
        return <></>;
    }
    };

    const randomPlayer = () => {
        const getRandPlayer = (players) => {
            if (players.length === 0) return 'No players available';
            const randPlayer = players[Math.floor(Math.random() * players.length)];
            const playerName = randPlayer["name"];
            const teamName = "team" in randPlayer ? randPlayer["team"] : randPlayer["Team"];
            return `${playerName} - (${teamName})`;
        };

        if (selectedLeagues.includes('All')) {
            if (selectedPool.includes('All') || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {
                console.log("here after")
                return playerNames[Math.floor(Math.random() * playerNames.length)];
            } else if (selectedPool.includes('Fantasy Relevant')) {
                const fantasyRelevantPlayers = playerData["nflPlayers"]
                    .filter((player) => player.fantasy_relevant === true)
                    .concat(
                        playerData["nhlPlayers"].filter((player) => player.fantasy_relevant === true),
                        playerData["nbaPlayers"].filter((player) => player.fantasy_relevant === true)
                    );

                
                const randomPlayer =  fantasyRelevantPlayers[Math.floor(Math.random() * fantasyRelevantPlayers.length)];
                const playerName = randomPlayer["name"];
                const teamName = "team" in randomPlayer ? randomPlayer["team"] : randomPlayer["Team"];
                return `${playerName} - (${teamName})`
                
            } else if (selectedPool.includes('Starter')) {
                const starterPlayers = playerData["nflPlayers"]
                    .filter((player) => player.starter === true)
                    .concat(
                        playerData["nhlPlayers"].filter((player) => player.fantasy_relevant === true),
                        playerData["nbaPlayers"].filter((player) => player.starter === true)
                    );

                
                const randomPlayer =  starterPlayers[Math.floor(Math.random() * starterPlayers.length)];
                const playerName = randomPlayer["name"];
                const teamName = "team" in randomPlayer ? randomPlayer["team"] : randomPlayer["Team"];
                return `${playerName} - (${teamName})`
            }
        } else if (selectedLeagues.includes('NHL') && selectedLeagues.includes('NBA') && selectedLeagues.includes('NFL')) {
            if (selectedPool.includes('All') || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {
                return playerNames[Math.floor(Math.random() * playerNames.length)];
            } else if (selectedPool.includes('Fantasy Relevant')) {
                const fantasyRelevantPlayers = playerData["nflPlayers"]
                    .filter((player) => player.fantasy_relevant === true)
                    .concat(
                        playerData["nhlPlayers"].filter((player) => player.fantasy_relevant === true),
                        playerData["nbaPlayers"].filter((player) => player.fantasy_relevant === true)
                    );

                
                const randomPlayer =  fantasyRelevantPlayers[Math.floor(Math.random() * fantasyRelevantPlayers.length)];
                const playerName = randomPlayer["name"];
                const teamName = "team" in randomPlayer ? randomPlayer["team"] : randomPlayer["Team"];
                return `${playerName} - (${teamName})`
            }
            else if (selectedPool.includes('Starter')) {
                const starterPlayers = playerData["nflPlayers"]
                    .filter((player) => player.starter === true)
                    .concat(
                        playerData["nhlPlayers"].filter((player) => player.fantasy_relevant === true),
                        playerData["nbaPlayers"].filter((player) => player.starter === true)
                    );

                
                const randomPlayer =  starterPlayers[Math.floor(Math.random() * starterPlayers.length)];
                const playerName = randomPlayer["name"];
                const teamName = "team" in randomPlayer ? randomPlayer["team"] : randomPlayer["Team"];
                return `${playerName} - (${teamName})`
            }
        } else if (selectedLeagues.includes('NHL') && selectedLeagues.includes('NBA')) {
            if (selectedPool.includes('All') || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {
                const nhlNbaPlayers = nhlPlayerNames.concat(nbaPlayerNames);
                return nhlNbaPlayers[Math.floor(Math.random() * nhlNbaPlayers.length)];
            } else if (selectedPool.includes('Fantasy Relevant')) {
                const fantasyRelevantPlayers = playerData["nhl"]
                    .filter((player) => player.fantasy_relevant === true)
                    .concat(
                        playerData["nhlPlayers"].filter((player) => player.fantasy_relevant === true)
                    );

                
                const randomPlayer =  fantasyRelevantPlayers[Math.floor(Math.random() * fantasyRelevantPlayers.length)];
                const playerName = randomPlayer["name"];
                const teamName = "team" in randomPlayer ? randomPlayer["team"] : randomPlayer["Team"];
                return `${playerName} - (${teamName})`
            }
            else if (selectedPool.includes('Starter')) {
                const starterPlayers = playerData["nbaPlayers"]
                    .filter((player) => player.starter === true)
                    .concat(
                        playerData["nhlPlayers"].filter((player) => player.fantasy_relevant === true)
                    );
                
                const randomPlayer =  starterPlayers[Math.floor(Math.random() * starterPlayers.length)];
                const playerName = randomPlayer["name"];
                const teamName = "team" in randomPlayer ? randomPlayer["team"] : randomPlayer["Team"];
                return `${playerName} - (${teamName})`
            }
        } else if (selectedLeagues.includes('NHL') && selectedLeagues.includes('NFL')) {
            if (selectedPool.includes('All') || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {
                const nhlNflPlayers = nhlPlayerNames.concat(nflPlayerNames);
                return nhlNflPlayers[Math.floor(Math.random() * nhlNflPlayers.length)];
            } else if (selectedPool.includes('Fantasy Relevant')) {
                const fantasyRelevantPlayers = playerData["nflPlayers"]
                    .filter((player) => player.fantasy_relevant === true)
                    .concat(
                        playerData["nhlPlayers"].filter((player) => player.fantasy_relevant === true)
                    );

                
                const randomPlayer =  fantasyRelevantPlayers[Math.floor(Math.random() * fantasyRelevantPlayers.length)];
                const playerName = randomPlayer["name"];
                const teamName = "team" in randomPlayer ? randomPlayer["team"] : randomPlayer["Team"];
                return `${playerName} - (${teamName})`
            }
            else if (selectedPool.includes('Starter')) {
                const starterPlayers = playerData["nflPlayers"]
                    .filter((player) => player.starter === true)
                    .concat(
                        playerData["nhlPlayers"].filter((player) => player.fantasy_relevant === true)
                    );

                
                const randomPlayer =  starterPlayers[Math.floor(Math.random() * starterPlayers.length)];
                const playerName = randomPlayer["name"];
                const teamName = "team" in randomPlayer ? randomPlayer["team"] : randomPlayer["Team"];
                return `${playerName} - (${teamName})`
            }
        } else if (selectedLeagues.includes('NBA') && selectedLeagues.includes('NFL')) {
            if (selectedPool.includes('All') || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {

                const nbaNflPlayers = nbaPlayerNames.concat(nflPlayerNames);
                return nbaNflPlayers[Math.floor(Math.random() * nbaNflPlayers.length)];
            } else if (selectedPool.includes('Fantasy Relevant')) {
                const fantasyRelevantPlayers = playerData["nflPlayers"]
                    .filter((player) => player.fantasy_relevant === true)
                    .concat(
                        playerData["nbaPlayers"].filter((player) => player.fantasy_relevant === true)
                    );

                
                const randomPlayer =  fantasyRelevantPlayers[Math.floor(Math.random() * fantasyRelevantPlayers.length)];
                const playerName = randomPlayer["name"];
                const teamName = "team" in randomPlayer ? randomPlayer["team"] : randomPlayer["Team"];
                return `${playerName} - (${teamName})`
            }
            else if (selectedPool.includes('Starter')) {
                const starterPlayers = playerData["nflPlayers"]
                    .filter((player) => player.starter === true)
                    .concat(
                        playerData["nbaPlayers"].filter((player) => player.starter === true)
                    );

                
                const randomPlayer =  starterPlayers[Math.floor(Math.random() * starterPlayers.length)];
                const playerName = randomPlayer["name"];
                const teamName = "team" in randomPlayer ? randomPlayer["team"] : randomPlayer["Team"];
                return `${playerName} - (${teamName})`
            }
        } else if (selectedLeagues.includes('NHL')) {
            if (selectedPool.includes('All') || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {
                return getRandPlayer(playerData["nhlPlayers"]);
            } else if (selectedPool.includes('Fantasy Relevant')) {
                console.log("NHL Players: ");
                console.log(playerData["nhlPlayers"])
                const fantasyRelevantPlayers = playerData["nhlPlayers"].filter((player) => player.fantasy_relevant == true)

                console.log(fantasyRelevantPlayers);
                return getRandPlayer(fantasyRelevantPlayers);
            } else if (selectedPool.includes('Starter')) {
                const starterPlayers = playerData["nhlPlayers"]
                    .filter((player) => player.fantasy_relevant == true)
                
                return getRandPlayer(starterPlayers);
            }
        } else if (selectedLeagues.includes('NBA')) {
            if (selectedPool.includes('All') || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {
                return nbaPlayerNames[Math.floor(Math.random() * nbaPlayerNames.length)];
            } else if (selectedPool.includes('Fantasy Relevant')) {
                const fantasyRelevantPlayers = playerData["nbaPlayers"]
                    .filter((player) => player.fantasy_relevant === true)
                
                const randomPlayer =  fantasyRelevantPlayers[Math.floor(Math.random() * fantasyRelevantPlayers.length)];
                const playerName = randomPlayer["name"];
                const teamName = "team" in randomPlayer ? randomPlayer["team"] : randomPlayer["Team"];
                return `${playerName} - (${teamName})`
            }
            else if (selectedPool.includes('Starter')) {
                const starterPlayers = playerData["nbaPlayers"]
                    .filter((player) => player.starter === true)
                
                const randomPlayer =  starterPlayers[Math.floor(Math.random() * starterPlayers.length)];
                const playerName = randomPlayer["name"];
                const teamName = "team" in randomPlayer ? randomPlayer["team"] : randomPlayer["Team"];
                return `${playerName} - (${teamName})`
            }

        } else if (selectedLeagues.includes('NFL')) {
            if (selectedPool.includes('All') || (selectedPool.includes('Fantasy Relevant') && selectedPool.includes('Starter'))) {
                return nflPlayerNames[Math.floor(Math.random() * nflPlayerNames.length)];
            } else if (selectedPool.includes('Fantasy Relevant')) {
                const fantasyRelevantPlayers = playerData["nflPlayers"]
                    .filter((player) => player.fantasy_relevant === true)
                
                const randomPlayer =  fantasyRelevantPlayers[Math.floor(Math.random() * fantasyRelevantPlayers.length)];
                const playerName = randomPlayer["name"];
                const teamName = "team" in randomPlayer ? randomPlayer["team"] : randomPlayer["Team"];
                return `${playerName} - (${teamName})`
            }
            else if (selectedPool.includes('Starter')) {
                const starterPlayers = playerData["nflPlayers"]
                    .filter((player) => player.starter === true)
                
                const randomPlayer =  starterPlayers[Math.floor(Math.random() * starterPlayers.length)];
                const playerName = randomPlayer["name"];
                const teamName = "team" in randomPlayer ? randomPlayer["team"] : randomPlayer["Team"];
                return `${playerName} - (${teamName})`
            }
        } else {
            return null;
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedLeagues.includes('All') || (selectedLeagues.includes("NHL") && selectedLeagues.includes("NBA") && selectedLeagues.includes("NFL"))) {
            if (selectedPlayer === null) {
                onClose(selectedLeagues, selectedPool, selectedSelection, randomPlayer());;
            } else {
                onClose(selectedLeagues, selectedPool, selectedSelection, selectedPlayer);
            }
        } else if (selectedLeagues.includes("NBA") && selectedLeagues.includes("NFL")) {
            if (selectedPlayer !== null) {
                if (findLeague(selectedPlayer) === 'NBA' || findLeague(selectedPlayer) === 'NFL') {
                    onClose(selectedLeagues, selectedPool, selectedSelection, selectedPlayer);
                } else {
                    alert("Player is not from selected leagues");
                }
            } else {
                onClose(selectedLeagues, selectedPool, selectedSelection, randomPlayer());
            }
        } else if (selectedLeagues.includes("NHL") && selectedLeagues.includes("NFL")) {
            if (selectedPlayer !== null) {
                if (findLeague(selectedPlayer) === 'NHL' || findLeague(selectedPlayer) === 'NFL') {
                    onClose(selectedLeagues, selectedPool, selectedSelection, selectedPlayer);
                } else {
                    alert("Player is not from selected leagues");
                }
            } else {
                onClose(selectedLeagues, selectedPool, selectedSelection, randomPlayer());
            } 
        } else if (selectedLeagues.includes("NHL") && selectedLeagues.includes("NBA")) {
            if (selectedPlayer !== null) {
                if (findLeague(selectedPlayer) === 'NHL' || findLeague(selectedPlayer) === 'NBA') {
                    onClose(selectedLeagues, selectedPool, selectedSelection, selectedPlayer);
                } else {
                    alert("Player is not from selected leagues");
                }
            } else {
                onClose(selectedLeagues, selectedPool, selectedSelection, randomPlayer());
            } 
        } else if (selectedLeagues.includes("NHL")) {
            if (selectedPlayer !== null) {
                if (findLeague(selectedPlayer) === 'NHL') {
                    onClose(selectedLeagues, selectedPool, selectedSelection, selectedPlayer);
                } else {
                    alert("Player is not from selected league");
                }
            } else {
                onClose(selectedLeagues, selectedPool, selectedSelection, randomPlayer());
            } 
        } else if (selectedLeagues.includes("NBA")) {
            if (selectedPlayer !== null) {
                if (findLeague(selectedPlayer) === 'NBA') {
                    onClose(selectedLeagues, selectedPool, selectedSelection, selectedPlayer);
                } else {
                    alert("Player is not from selected league");
                }
            } else {
                onClose(selectedLeagues, selectedPool, selectedSelection, randomPlayer());
            } 
        } else if (selectedLeagues.includes("NFL")) {
            if (selectedPlayer !== null) {
                if (findLeague(selectedPlayer) === 'NFL') {
                    onClose(selectedLeagues, selectedPool, selectedSelection, selectedPlayer);
                } else {
                    alert("Player is not from selected league");
                }
            } else {
                onClose(selectedLeagues, selectedPool, selectedSelection, randomPlayer());
            } 
        } else {
            alert("Please select a league");
        }
    };

  return (
    <div className="form-popup">
        
      <div className="form-container">
      
        <div className="ppf-title-row">
            <h1 className="ppf-title">Pro Pursuit</h1>
            <FaQuestion className="instructions-btn-hr" onClick={() => setIsInstructionsOpen(true)} />
        </div>
        { isInstructionsOpen && <Instructions gameTitle="Pro Pursuit" subheader="Like Wordle, but for your favourite sports players!" icon={icon} instructionsText="Select your player leagues to include,
        from NFL, NHL, and or NBA. Then select which category of players you want in the player pool. All will include any rostered player in the selected leagues above. Starter will include:
        (NFL #1 player on depth chart for each position on each team, WR has top 3 and RB has top 2, so 12 Offense and 11 Defense), (NHL will include any player who played over 40 games and any goalie who   
        played over 20 games), (NBA will include any player who started over 30 games). Fantasy Relevant will include: (NFL a starter who is only from fantasy positions QB, WR, TE, RB), (NHL will include any player who played over 40 games and any goalie who   
        played over 20 games), (NBA will include any player who averaged over 10 minutes/game). If you want to manually set who the player is to play against your friends select User and enter the player,
        or you can leave it on Auto for the computer to randomly select" onClose={() => setIsInstructionsOpen(false)}/>}
        <form onSubmit={handleSubmit}>

          <div className="player-leagues">
            <label>Player Leagues:</label>
            <div className="radio-buttons">
            {['NHL', 'NBA', 'NFL', 'All'].map((league) => (
              <label key={league} className={`radio-button ${selectedLeagues.includes(league) ? 'active' : ''}`}>
                  <input type="checkbox" name="league" value={league} checked={selectedLeagues.includes(league)} onChange={() => handleLeagueChange(league)} />
                  <span>{league}</span>
              </label>
              ))}
            </div>
          </div>

          <div className="player-pool">
            <label>Player Pool:</label>
            <div className="radio-buttons">
            {['All', 'Fantasy Relevant', 'Starter'].map((pool) => (
              <label key={pool} className={`radio-button ${selectedPool.includes(pool) ? 'active' : ''}`}>
                  <input type="checkbox" name="pool" value={pool} checked={selectedPool.includes(pool)} onChange={() => handlePoolChange(pool)} />
                  <span>{pool}</span>
              </label>
              ))}
            </div>
          </div>

          <div className="player-selection">
            <label>Player Selection:</label>
            <div className="radio-buttons">
            {['Auto', 'User'].map((selection) => (
              <label key={selection} className={`radio-button ${selectedSelection === selection ? 'active' : ''}`}>
                  <input type="radio" name="selection" value={selection} required checked={selectedSelection === selection} onChange={() => setSelectedSelection(selection)} />
                  <span>{selection}</span>
              </label>
              ))}
            </div>
          </div>

            {conditionalplayerNames()}

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ProPursuitForm;
