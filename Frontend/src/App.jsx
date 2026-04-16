import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider, useTheme } from './Config/ThemeContext';
import Sidebar from './components/OptionsNav/Sidebar.jsx';
import Settings from './components/Settings.jsx';
import Login from './components/Auth/Login.jsx';
import MainDashboard from './components/Main/MainDashboard.jsx';
import RegisterLg from './components/Auth/Registerlg.jsx';
import Doctor_Dashboard from './components/Users/Doctor/DashboardDctr.jsx';
import RegisterDct from './components/Users/Doctor/RegisterDctr.jsx';
import DashboardPct from './components/Users/Patient/DashboardPct.jsx';
import PatientRegister from './components/Users/Patient/RegisterPct.jsx';
import Specialty_Dashboard from './components/Users/Doctor/Speciality/Especialidad.jsx';
import Schedule_Dashboard from './components/Schedule/Schedule_Dashboard.jsx';
import Consultorios_Dashboard from './components/Users/Doctor/Office/DashboardMed.jsx';

const ProtectedLayout = () => {
  const themeContext = useTheme();
  const colors = themeContext?.colors || { primary: { 50: '#f0f9ff' } };
  const backgroundColor = colors.primary?.[50] || '#f0f9ff';

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
            <Route path="/" element={<MainDashboard />} />
            <Route path="/Settings" element={<Settings />} />            
            <Route path="/Patient_Dashboard" element={<DashboardPct />} />
            <Route path="/Doctor_Dashboard" element={<Doctor_Dashboard />} />
            <Route path="/Doctor_Register" element={<RegisterDct />} />
            <Route path="/specialty" element={<Specialty_Dashboard/>} />         
            <Route path='/Patient_Register' element={<PatientRegister />} />
            <Route path='/Specialty_Dashboard' element={<Specialty_Dashboard/>} />
            <Route path='/Schedule' element={<Schedule_Dashboard/>}/>
            <Route path='/Office_Dashboard' element={<Consultorios_Dashboard/>}/>
          </Route>
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;