import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header/Header';
import {
  Route,
  Routes,
} from "react-router-dom";
import Board from './components/Board/Board';
import Rules from './components/Rules/Rules';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Header />
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
