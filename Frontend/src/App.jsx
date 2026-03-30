import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider, useTheme } from './Config/ThemeContext';
import Sidebar from './components/OptionsNav/Sidebar.jsx';
import Settings from './components/Settings.jsx';
import Login from './components/Auth/Login.jsx';
import MainDashboard from './components/Main/MainDashboard.jsx';
import RegisterLg from './components/Auth/Registerlg.jsx';
import Doctor_Dashboard from './components/Users/Doctor/DashboardDctr.jsx';

// 👈 Layout con Sidebar para rutas protegidas
const ProtectedLayout = () => {
  const { config, colors } = useTheme();
  const backgroundColor = config.theme.background || colors.primary[50];

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: backgroundColor,
      transition: 'background 0.3s ease'
    }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <Routes>
          {/* Ruta pública - Login sin Sidebar */}
          <Route path="/login" element={<Login />} />
          {/* Ruta pública de login para registrar nuevos usuarios */}
          <Route path="/Register_Signup" element={<RegisterLg />} />

          {/* Todas las rutas protegidas heredan el Layout con Sidebar */}
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Settings />} />
            <Route path="/Main" element={<MainDashboard />} />
            <Route path="/Doctor_Dashboard" element={<Doctor_Dashboard />} />
            {/* Aquí agregas más rutas protegidas cuando las necesites */}
          </Route>
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;