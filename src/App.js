import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './Pages/Home/Home';
import PowerHourForm from './Pages/PowerHourForm/PowerHourForm';
import PowerHour from './Pages/PowerHour/PowerHour';
import Deck from './Components/Deck';






const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="powerhourform" element={<PowerHourForm/>} />
          <Route path="powerhour" element={<PowerHour />} />
          <Route path="ridethebus" element={<Deck />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
