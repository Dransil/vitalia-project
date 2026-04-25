// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider, useTheme } from './Config/ThemeContext';
import Sidebar from './components/organisms/Sidebar/Sidebar.jsx';

import Settings from './components/Settings.jsx';
import Login from './components/Auth/Login.jsx';
import MainDashboard from './components/Main/MainDashboard.jsx';
import RegisterLg from './components/Auth/Registerlg.jsx';
import RegisterDct from './components/Users/Doctor/RegisterDctr.jsx';
import DashboardPct from './components/Users/Patient/DashboardPct.jsx';
import PatientRegister from './components/Users/Patient/RegisterPct.jsx';
import Specialty_Dashboard from './components/Users/Doctor/Speciality/Especialidad.jsx';
import Schedule_Dashboard from './components/Schedule/Schedule_Dashboard.jsx';
import Consultorios_Dashboard from './components/Users/Doctor/Office/DashboardMed.jsx';
import CreateConsultorio from './components/Users/Doctor/Office/RegisterOfc.jsx';
import Speciality_create from './components/Users/Doctor/Speciality/Speciality_Create.jsx';
import History_client from './components/Users/Patient/PatientHistory.jsx';
import DoctorMd from './components/Users/Doctor/DoctorMd.jsx';
import DoctorDashboardPage from './components/pages/DoctorDashboardPage/DoctorDashboardPage.jsx';
import PatientDashboardPage from './components/pages/PatientDashboardPage/PatientDashboardPage.jsx';
import PacienteMd from './components/Users/Patient/PatientMod.jsx';
import CitasDashboard from './components/Users/Doctor/Date/Date.jsx';
import DoctorEditPage from './components/pages/DoctorEditPage/DoctorEditPage.jsx';
import DoctorRegisterPage from './components/pages/DoctorRegisterPage/DoctorRegisterPage.jsx';
import SettingsPage from './components/pages/SettingsPage/SettingsPage.jsx';
import OdontogramaPct from './components/Users/Consult/OdontogramaPct.jsx';
import authService from './Services/AuthService';

const hexToRgba = (hex, opacity) => {
  if (!hex) return `rgba(240, 249, 255, ${opacity})`; 
  const hexClean = hex.replace('#', '');
  const r = parseInt(hexClean.substring(0, 2), 16);
  const g = parseInt(hexClean.substring(2, 4), 16);
  const b = parseInt(hexClean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const ProtectedLayout = () => {
  const themeContext = useTheme();
  
  // Obtener colores personalizados de la configuración
  const config = themeContext?.config || {};
  const primaryColor = config?.theme?.colors?.primary || '#0ea5e9';
  const backgroundColor = config?.theme?.background || '#f0f9ff';
  
  const finalBackgroundColor = backgroundColor !== '#f0f9ff' 
    ? backgroundColor 
    : hexToRgba(primaryColor, 0.05);

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: finalBackgroundColor,
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
   const user = authService.getUser();
  return (
    <Router>
      <ThemeProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/Register_Signup" element={<RegisterLg />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<MainDashboard />} />
            <Route path="/Settings" element={<SettingsPage />} />            
            <Route path="/Patient_Dashboard" element={<PatientDashboardPage />} />
            <Route path="/Doctor_Dashboard" element={<DoctorDashboardPage />} />
            <Route path="/Doctor_Register" element={<DoctorRegisterPage />} />
            <Route path="/specialty" element={<Specialty_Dashboard/>} />         
            <Route path='/Patient_Register' element={<PatientRegister />} />
            <Route path='/Patient_Mod/:id' element={<PacienteMd/>}/>
            <Route path='/Specialty_Dashboard' element={<Specialty_Dashboard/>} />
            <Route path='/Schedule' element={<Schedule_Dashboard/>}/>
            <Route path='/Office_Dashboard' element={<Consultorios_Dashboard/>}/>
            <Route path='/Create_Office' element={<CreateConsultorio/>}/>
            <Route path="/Speciality_create" element={<Speciality_create/>} />
            <Route path="/History_client/:id" element={<History_client />} />
            <Route path='/Doctor_Mod/:id' element={<DoctorEditPage/>}/>
            <Route path='/Date_Dashboard' element={<CitasDashboard doctorId={user?.id_usuario || user?.id} />}/> 
          </Route>
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;