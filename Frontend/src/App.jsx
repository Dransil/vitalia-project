import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './Config/ThemeContext.jsx';
import Sidebar from './components/OptionsNav/Sidebar.jsx';
import './index.css';

function AppContent() {
  const { colors } = useTheme();
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith('/app');

  return (
    <div style={{ background: `linear-gradient(to bottom right, ${colors.primary[50]}, ${colors.primary[100]}, ${colors.secondary[50]})`, minHeight: '100vh' }}>     
      <Routes>
        <Route path="/" element={
          <>
            <Sidebar/>
          </>
        }/>
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Router>
  );
}

export default App;