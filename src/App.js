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
import Dealer from './Pages/BlackJack/Dealer';
import Player from './Pages/BlackJack/Player';
import { Tournament } from './Pages/Tournament/Tournament';
import NotFound from './Components/NotFound/NotFound';
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';

const App = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="powerhourform" element={<PowerHourForm />} />
          <Route path="powerhour" element={<PowerHour />} />
          <Route path="ridethebus/5-card-classic" element={<RideTheBus_5CardClassic />} />
          <Route path="ridethebus/4-card-classic" element={<RideTheBus_4CardClassic />} />
          <Route path="horserace" element={<HorseRace />} />
          <Route path="aroundtheworld" element={<AroundTheWorld />} />
          <Route path="propursuit" element={<ProPursuit />} />
          <Route path="blackjack" element={<BlackJack />} />
          <Route path="blackjack-dealer/:gameCode" element={<Dealer />} />
          <Route path="blackjack-player/:gameCode" element={<Player />} />
          <Route path="tournament" element={<Tournament />} />
          {/* Catch-all route for pages that do not exist */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
