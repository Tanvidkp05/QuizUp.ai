import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/navbar/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './components/home/home';
import QuizGenerator from './components/QuizGenerator';
import MultiplayerQuiz from './components/MultiplayerQuiz';
import gameModes from './components/gameModes2';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  const checkAuthStatus = () => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  };

  useEffect(() => {
    checkAuthStatus();
    
    // Force check when navigating to home after login
    if (location.pathname === '/' && location.state?.fromAuth) {
      checkAuthStatus();
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/" element={<Home />} />
          <Route path="/generateQuiz" element={<QuizGenerator />} />
          <Route path="/multiplayer" element={<MultiplayerQuiz />} />
          <Route path="/game-modes" element={<gameModes />} />
        </Routes>
      </main>
    </div>
  );
}

export default AppWrapper;