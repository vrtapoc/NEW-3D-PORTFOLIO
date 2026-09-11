import './App.scss'
import React, { useEffect } from "react";
import RoomToggleButton from './components/Buttons/RoomToggleButton/RoomToggleButton'
import Experience from './Experience/Experience';
import LoadingPage from "./pages/LoadingPage/LoadingPage";
import Router from './routes/Router';
import Menu from './components/Menu/Menu';
import Logo from './components/Logo/Logo';

import { useResponsiveStore } from './stores/useResponsiveStore';

function App() {

  const {updateDimensions} = useResponsiveStore();
  
  useEffect(() => {
      window.addEventListener('resize', updateDimensions);

      return () => {
        window.removeEventListener('resize', updateDimensions);
      }
    });

  return ( 
    <>
      <Menu />
      <Logo />
      <LoadingPage />
      <RoomToggleButton />
      <Experience />
      <Router />
    </>
  );
}

export default App;