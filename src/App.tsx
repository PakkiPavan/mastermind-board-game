import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header/Header';
import {
  Route,
  Routes,
} from "react-router-dom";
import Board from './components/Board/Board';
import Rules from './components/Rules/Rules';
import { PaletteMode } from '@mui/material';


function App() {
  const [currentTheme, setCurrentTheme] = React.useState<PaletteMode>('dark');

  const theme = createTheme({
    palette: {
      mode: currentTheme,
    },
  });

  const handleSetCurrentTheme = () => {
    setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header handleSetCurrentTheme={handleSetCurrentTheme} />
      <Routes>
        <Route path="/" element={<Board />} />
        <Route path="/play-game" element={<Board />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="*" element={<Board />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
