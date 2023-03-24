import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './Pages/Home/Home';
import PowerHourForm from './Pages/PowerHourForm/PowerHourForm';
import PowerHour from './Pages/PowerHour/PowerHour';
import RideTheBus from './Pages/RideTheBus/RideTheBus';
import HorseRace from './Pages/HorseRace/HorseRace';
import AroundTheWorld from './Pages/AroundTheWorld/AroundTheWorld';






const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="powerhourform" element={<PowerHourForm/>} />
          <Route path="powerhour" element={<PowerHour />} />
          <Route path="ridethebus" element={<RideTheBus />} />
          <Route path="horserace" element={<HorseRace />} />
          <Route path="aroundtheworld" element={<AroundTheWorld />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
