import React, { useState } from 'react';
import './ProPursuitForm.css';

const ProPursuitForm = ({ onClose, playerData, nhlPlayerNames, nbaPlayerNames, nflPlayerNames }) => {
  const [selectedLeagues, setSelectedLeagues] = useState(["All"]);
  const [selectedPool, setSelectedPool] = useState("All");
  const [selectedSelection, setSelectedSelection] = useState("Auto");
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleLeagueChange = (league) => {
    if (selectedLeagues.includes(league)) {
      setSelectedLeagues(selectedLeagues.filter((item) => item !== league));
    } else {
      setSelectedLeagues([...selectedLeagues, league]);
    }
  };

  const handlePlayerChange = (e) => {
    const player = e.target.value;
    if ((selectedLeagues.includes('NHL') && selectedLeagues.includes('NBA') && selectedLeagues.includes('NFL')) || selectedLeagues.includes('All')) {
        if (playerData.includes(player)) {
            setSelectedPlayer(player);
        } else {
            setSelectedPlayer(null);
        }
    } else if (selectedLeagues.includes('NHL') && selectedLeagues.includes('NBA')) {
        if (nhlPlayerNames.includes(player) || nbaPlayerNames.includes(player)) {
            setSelectedPlayer(player);
        }
    } else if (selectedLeagues.includes('NHL') && selectedLeagues.includes('NFL')) {
        if (nhlPlayerNames.includes(player) || nflPlayerNames.includes(player)) {
            setSelectedPlayer(player);
        }
    } else if (selectedLeagues.includes('NBA') && selectedLeagues.includes('NFL')) {
        if (nbaPlayerNames.includes(player) || nflPlayerNames.includes(player)) {
            setSelectedPlayer(player);
        }
    } else if (selectedLeagues.includes('NHL')) {
        if (nhlPlayerNames.includes(player)) {
            setSelectedPlayer(player);
        }
    } else if (selectedLeagues.includes('NBA')) {
        if (nbaPlayerNames.includes(player)) {
            setSelectedPlayer(player);
        }
    } else if (selectedLeagues.includes('NFL')) {
        if (nflPlayerNames.includes(player)) {
            setSelectedPlayer(player);
        }
    }
    else {
        setSelectedPlayer(null);
    }
  };
  

  const conditionalPlayerData = () => {
    if (selectedSelection === 'User') {
        if (selectedLeagues.includes('All')) {
            return <div>
                        <label htmlFor="player-name">Enter Player:</label>
                        <input
                            type="text"
                            list="players"
                            id="player-name"
                            placeholder="Enter Player"
                            onChange={handlePlayerChange}
                        />
                        <datalist id="players">
                            {playerData.map((player, index) => (
                                <option key={index} value={player} />
                            ))}
                        </datalist>
                    </div>;
        } else if (selectedLeagues.includes('NHL') && selectedLeagues.includes('NBA') && selectedLeagues.includes('NFL')) {
            return <div>
                        <label htmlFor="player-name">Enter Player:</label>
                        <input
                            type="text"
                            list="players"
                            id="player-name"
                            placeholder="Enter Player"
                            onChange={handlePlayerChange}
                        />
                        <datalist id="players">
                            {playerData.map((player, index) => (
                                <option key={index} value={player} />
                            ))}
                        </datalist>
                    </div>;
        } else if (selectedLeagues.includes('NHL') && selectedLeagues.includes('NBA')) {
            const nhlNbaPlayers = nhlPlayerNames.concat(nbaPlayerNames);
            return <div>
                        <label htmlFor="player-name">Enter Player:</label>
                        <input
                            type="text"
                            list="players"
                            id="player-name"
                            placeholder="Enter Player"
                            onChange={handlePlayerChange}
                        />
                        <datalist id="players">
                            {nhlNbaPlayers.map((player, index) => (
                                <option key={index} value={player} />
                            ))}
                        </datalist>
                    </div>;
        } else if (selectedLeagues.includes('NHL') && selectedLeagues.includes('NFL')) {
            const nhlNflPlayers = nhlPlayerNames.concat(nflPlayerNames);
            return <div>
                        <label htmlFor="player-name">Enter Player:</label>
                        <input
                            type="text"
                            list="players"
                            id="player-name"
                            placeholder="Enter Player"
                            onChange={handlePlayerChange}
                        />
                        <datalist id="players">
                            {nhlNflPlayers.map((player, index) => (
                                <option key={index} value={player} />
                            ))}
                        </datalist>
                    </div>;

        } else if (selectedLeagues.includes('NBA') && selectedLeagues.includes('NFL')) {
            const nbaNflPlayers = nbaPlayerNames.concat(nflPlayerNames);
            return <div>
                <label htmlFor="player-name">Enter Player:</label>
                <input
                    type="text"
                    list="players"
                    id="player-name"
                    placeholder="Enter Player"
                    onChange={handlePlayerChange}
                />
                <datalist id="players">
                    {nbaNflPlayers.map((player, index) => (
                        <option key={index} value={player} />
                    ))}
                </datalist>
            </div>;

        } else if (selectedLeagues.includes('NHL')) {
            return <div>
                <label htmlFor="player-name">Enter Player:</label>
                <input
                    type="text"
                    list="players"
                    id="player-name"
                    placeholder="Enter Player"
                    onChange={handlePlayerChange}
                />
                <datalist id="players">
                    {nhlPlayerNames.map((player, index) => (
                        <option key={index} value={player} />
                    ))}
                </datalist>
            </div>;

        } else if (selectedLeagues.includes('NBA')) {
            return <div>
                <label htmlFor="player-name">Enter Player:</label>
                <input
                    type="text"
                    list="players"
                    id="player-name"
                    placeholder="Enter Player"
                    onChange={handlePlayerChange}
                />
                <datalist id="players">
                    {nbaPlayerNames.map((player, index) => (
                        <option key={index} value={player} />
                    ))}
                </datalist>
            </div>;

        } else if (selectedLeagues.includes('NFL')) {
            return <div>
                <label htmlFor="player-name">Enter Player:</label>
                <input
                    type="text"
                    list="players"
                    id="player-name"
                    placeholder="Enter Player"
                    onChange={handlePlayerChange}
                />
                <datalist id="players">
                    {nflPlayerNames.map((player, index) => (
                        <option key={index} value={player} />
                    ))}
                </datalist>
            </div>;

        } else {
            return <></>;
        }
    } else {
        return <></>;
    }
    };

    const randomPlayer = () => {
        if (selectedLeagues.includes('All')) {
            return playerData[Math.floor(Math.random() * playerData.length)];
        } else if (selectedLeagues.includes('NHL') && selectedLeagues.includes('NBA') && selectedLeagues.includes('NFL')) {
            return playerData[Math.floor(Math.random() * playerData.length)];
        } else if (selectedLeagues.includes('NHL') && selectedLeagues.includes('NBA')) {
            const nhlNbaPlayers = nhlPlayerNames.concat(nbaPlayerNames);
            return nhlNbaPlayers[Math.floor(Math.random() * nhlNbaPlayers.length)];
        } else if (selectedLeagues.includes('NHL') && selectedLeagues.includes('NFL')) {
            const nhlNflPlayers = nhlPlayerNames.concat(nflPlayerNames);
            return nhlNflPlayers[Math.floor(Math.random() * nhlNflPlayers.length)];
        } else if (selectedLeagues.includes('NBA') && selectedLeagues.includes('NFL')) {
            const nbaNflPlayers = nbaPlayerNames.concat(nflPlayerNames);
            return nbaNflPlayers[Math.floor(Math.random() * nbaNflPlayers.length)];
        } else if (selectedLeagues.includes('NHL')) {
            return nhlPlayerNames[Math.floor(Math.random() * nhlPlayerNames.length)];
        } else if (selectedLeagues.includes('NBA')) {
            return nbaPlayerNames[Math.floor(Math.random() * nbaPlayerNames.length)];
        } else if (selectedLeagues.includes('NFL')) {
            return nflPlayerNames[Math.floor(Math.random() * nflPlayerNames.length)];
        } else {
            return null;
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedPlayer === null) {
            onClose(selectedLeagues, selectedPool, selectedSelection, randomPlayer());;
        } else {
            onClose(selectedLeagues, selectedPool, selectedSelection, selectedPlayer);
        }

    };

  return (
    <div className="form-popup">
      <div className="form-container">
        <div className="form-title">
          <h1>Welcome to Pro Pursuit</h1>
        </div>
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
            {['All', 'Fantasy Relevant'].map((pool) => (
              <label key={pool} className={`radio-button ${selectedPool === pool ? 'active' : ''}`}>
                  <input type="radio" name="pool" value={pool} required checked={selectedPool === pool} onChange={() => setSelectedPool(pool)} />
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

            {conditionalPlayerData()}

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ProPursuitForm;
