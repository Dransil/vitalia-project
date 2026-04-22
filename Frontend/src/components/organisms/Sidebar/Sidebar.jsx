// src/components/organisms/Sidebar/Sidebar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdAddCircle, MdCalendarToday, MdSettings, MdLocalHospital, 
  MdPeople, MdSchedule, MdEventNote, MdLocalPharmacy, MdRoom 
} from 'react-icons/md';
import { BiSolidClinic } from "react-icons/bi";
import SidebarTemplate from '../../templates/SidebarTemplate/SidebarTemplate';
import SidebarHeader from '../SidebarHeader/SidebarHeader';
import SidebarUserSection from '../SidebarUserSection/SidebarUserSection';
import SidebarNavSection from '../SidebarNavSection/SidebarNavSection';
import SidebarFooter from '../SidebarFooter/SidebarFooter';
import NavButton from '../../atoms/NavButton/NavButton';
import { useTheme } from '../../../Config/ThemeContext';

const Sidebar = ({ activeView, setActiveView, userRole }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isScheduleDropdownOpen, setIsScheduleDropdownOpen] = useState(false);
  const [isClinicalDropdownOpen, setIsClinicalDropdownOpen] = useState(false);

  const getSpacing = (space) => {
    if (theme.spacing?.[space]) return theme.spacing[space];
    const fallbacks = { md: '16px', sm: '8px' };
    return fallbacks[space] || '16px';
  };

  const menuItems = [
    { id: 'new-appointment', label: 'Nueva Cita', icon: MdAddCircle, path: '/NewAppointment' },
    { id: 'appointments', label: 'Mis Citas', icon: MdCalendarToday, path: '/Appointments' },
    { id: 'settings', label: 'Configuración', icon: MdSettings, path: '/Settings' },
  ];

  const userDropdownItems = [
    { id: 'doctors', label: 'Doctores', icon: MdLocalHospital, path: '/Doctor_Dashboard' },
    { id: 'patients', label: 'Pacientes', icon: MdPeople, path: '/Patient_Dashboard' },
  ];

  const scheduleDropdownItems = [
    { id: 'view-schedules', label: 'Ver horarios', icon: MdSchedule, path: '/Schedule' },
    { id: 'agenda', label: 'Agenda', icon: MdEventNote, path: '/Date_Dashboard' },
  ];

  const clinicalDropdownItems = [
    { id: 'specialty', label: 'Especialidad', icon: BiSolidClinic, path: '/specialty' },
    { id: 'consulting-rooms', label: 'Consultorios', icon: MdRoom, path: '/Office_Dashboard' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setActiveView(path);
    setIsUserDropdownOpen(false);
    setIsScheduleDropdownOpen(false);
    setIsClinicalDropdownOpen(false);
  };

  const getRoleLabel = (role) => {
    const labels = {
      doctor: 'Dr. Médico General',
      dentist: 'Dra. Odontología',
      psychologist: 'Psi. Psicología'
    };
    return labels[role] || role;
  };

  return (
    <SidebarTemplate>
      <SidebarHeader />
      
      <SidebarUserSection
        role={userRole}
        roleLabel={getRoleLabel(userRole)}
        dropdownItems={userDropdownItems}
        isOpen={isUserDropdownOpen}
        onToggle={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
        onNavigate={handleNavigation}
      />

      <SidebarNavSection
        icon={MdSchedule}
        title="Horarios"
        subtitle="Gestión de tiempos"
        items={scheduleDropdownItems}
        isOpen={isScheduleDropdownOpen}
        onToggle={() => setIsScheduleDropdownOpen(!isScheduleDropdownOpen)}
        onNavigate={handleNavigation}
        hoverColor="secondary"
        sectionStyle="default"
      />

      <SidebarNavSection
        icon={MdLocalPharmacy}
        title="Clínico"
        subtitle="Gestión clínica"
        items={clinicalDropdownItems}
        isOpen={isClinicalDropdownOpen}
        onToggle={() => setIsClinicalDropdownOpen(!isClinicalDropdownOpen)}
        onNavigate={handleNavigation}
        hoverColor="primary"
        sectionStyle="gradient"
      />

      {/* Menú principal de navegación */}
      <nav style={{ flex: 1, padding: getSpacing('md') }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: getSpacing('sm') }}>
          {menuItems.map((item) => (
            <li key={item.id}>
              <NavButton
                icon={item.icon}
                label={item.label}
                isActive={activeView === item.id}
                onClick={() => handleNavigation(item.path)}
              />
            </li>
          ))}
        </ul>
      </nav>

      <SidebarFooter />
    </SidebarTemplate>
  );
};

export default Sidebar;