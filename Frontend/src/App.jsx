import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './Config/ThemeContext';
import Sidebar from './components/OptionsNav/Sidebar.jsx';
import ConfigProject from './components/Configuration/ConfigurationPage.jsx';
import TestColors from './components/OptionsNav/Color.jsx';
import './index.css';
import Settings from './components/Settings.jsx';

function AppContent() {
  const { colors } = useTheme();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: `linear-gradient(to bottom right, ${colors.primary[50]}, ${colors.primary[100]}, ${colors.secondary[50]})` }}>     
      <Sidebar />
      
      <main style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
        <Routes>
          <Route path="/" element={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
             {/*<ConfigProject /> primera version */} 
              <Settings/>
              {/*<TestColors /> Para prueba de colores xd */} 
              
            </div>
          }/>
        </Routes>
      </main>
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