import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './Pages/Home/Home';
import PowerHourForm from './Pages/PowerHourForm/PowerHourForm';
import PowerHour from './Pages/PowerHour/PowerHour';
import RideTheBus_5CardClassic from './Pages/RideTheBus/RideTheBus5CardClassic';
import RideTheBus_4CardClassic from './Pages/RideTheBus/RideTheBus4CardClassic';
import HorseRace from './Pages/HorseRace/HorseRace';
import AroundTheWorld from './Pages/AroundTheWorld/AroundTheWorld';
import ProPursuit from './Pages/ProPursuit/ProPursuit';
import BlackJack from './Pages/BlackJack/BlackJack';
import GameLobby from './Pages/BlackJack/GameLobby';
import LoadingPage from './Pages/BlackJack/LoadingPage';
import Player from './Pages/BlackJack/Player';
import Dealer from './Pages/BlackJack/Dealer';
import {Tournament} from './Pages/Tournament/Tournament';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="powerhourform" element={<PowerHourForm/>} />
          <Route path="powerhour" element={<PowerHour />} />
          <Route path="ridethebus/5-card-classic" element={<RideTheBus_5CardClassic />} />
          <Route path="ridethebus/4-card-classic" element={<RideTheBus_4CardClassic />} />
          <Route path="horserace" element={<HorseRace />} />
          <Route path="aroundtheworld" element={<AroundTheWorld />} />
          <Route path="propursuit" element={<ProPursuit />} />
          <Route path="blackjack" element={<BlackJack />} />
          <Route path="blackjack/:gameCode" element={<GameLobby />} />
          <Route path="blackjack-loading/:gameCode" element={<LoadingPage />} />
          <Route path="blackjack-play/:gameCode" element={<Player />} />
          <Route path="blackjack-dealer/:gameCode" element={<Dealer />} />
          <Route path="tournament" element={<Tournament />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
