import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './Pages/Home/Home';
import PowerHourForm from './Pages/PowerHourForm/PowerHourForm';
import PowerHour from './Pages/PowerHour/PowerHour';
import RideTheBus_5CardClassic from './Pages/RideTheBus/RideTheBus5CardClassic';
import RideTheBus_4CardClassic from './Pages/RideTheBus/RideTheBus4CardClassic';
import HorseRace from './Pages/HorseRace/HorseRace';
import AroundTheWorld from './Pages/AroundTheWorld/AroundTheWorld';
import QuickStartPowerHour from './Pages/PowerHour/QuickStartPowerHour';
import ProPursuit from './Pages/ProPursuit/ProPursuit';





const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="powerhourform" element={<PowerHourForm/>} />
          <Route path="powerhour" element={<PowerHour />} />
          <Route path="quickstart-powerhour" element={<QuickStartPowerHour />} />
          <Route path="ridethebus/5-card-classic" element={<RideTheBus_5CardClassic />} />
          <Route path="ridethebus/4-card-classic" element={<RideTheBus_4CardClassic />} />
          <Route path="horserace" element={<HorseRace />} />
          <Route path="aroundtheworld" element={<AroundTheWorld />} />
          <Route path="propursuit" element={<ProPursuit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
