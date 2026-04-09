import React, { useState } from 'react';
import { useTheme } from '../../Config/ThemeContext';
import { MdDashboard, MdAddCircle, MdCalendarToday, MdSettings, MdMedicalServices, MdPerson, MdPeople, MdLocalHospital, MdSchedule, MdEventNote, MdLocalPharmacy, MdRoom } from 'react-icons/md';
import { BiSolidClinic } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeView, setActiveView, userRole }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScheduleDropdownOpen, setIsScheduleDropdownOpen] = useState(false);
  const [isClinicalDropdownOpen, setIsClinicalDropdownOpen] = useState(false);

  const menuItems = [
    { id: 'new-appointment', label: 'Nueva Cita', icon: MdAddCircle },
    { id: 'appointments', label: 'Mis Citas', icon: MdCalendarToday },
    { id: 'settings', label: 'Configuración', icon: MdSettings, path: '/Settings' },
  ];

  const dropdownItems = [
    { id: 'doctors', label: 'Doctores', icon: MdLocalHospital, path: '/Doctor_Dashboard' },
    { id: 'patients', label: 'Pacientes', icon: MdPeople, path: '/Patient_Dashboard' },
  ];

  const scheduleDropdownItems = [
    { id: 'view-schedules', label: 'Ver horarios', icon: MdSchedule, path: '/ViewSchedules' },
    { id: 'agenda', label: 'Agenda', icon: MdEventNote, path: '/Agenda' },
  ];

  const clinicalDropdownItems = [
    { id: 'specialty', label: 'Especialidad', icon: BiSolidClinic, path: '/Specialty' },
    { id: 'consulting-rooms', label: 'Consultorios', icon: MdRoom, path: '/ConsultingRooms' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setActiveView(path);
    setIsDropdownOpen(false);
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
    <aside
      style={{
        width: '256px',
        background: theme.colors.neutral[0],
        boxShadow: theme.shadows.lg,
        borderRight: `1px solid ${theme.colors.neutral[200]}`,
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeIn 0.5s ease-in-out',
      }}
    >
      {/* Logo y branding */}
      <a href='/'>
        <div
          style={{
            padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
            borderBottom: `1px solid ${theme.colors.neutral[200]}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.md }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: `linear-gradient(135deg, ${theme.colors.primary[600]}, ${theme.colors.secondary[500]})`,
                borderRadius: theme.borderRadius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.colors.neutral[0],
                fontSize: '24px',
                fontWeight: theme.typography.fontWeight.bold,
                boxShadow: theme.shadows.medical,
              }}
            >
              <MdMedicalServices size={24} />
            </div>
            <div>
              <h1
                style={{
                  fontSize: theme.typography.fontSize.lg.size,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.neutral[900],
                  margin: 0,
                }}
              >
                Vitalia
              </h1>
              <p
                style={{
                  fontSize: theme.typography.fontSize.xs.size,
                  color: theme.colors.neutral[500],
                  margin: 0,
                }}
              >
                v1.0
              </p>
            </div>
          </div>
        </div>
      </a>

      {/* Información del usuario con persona e icono y dropdown integrado */}
      <div
        style={{
          padding: theme.spacing.lg,
          borderBottom: `1px solid ${theme.colors.neutral[200]}`,
          background: `linear-gradient(to right, ${theme.colors.primary[50]}, ${theme.colors.secondary[50]})`,
        }}
      >
        {/* Header clickeable */}
        <div
          style={{
            cursor: 'pointer',
          }}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.sm }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: `linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.secondary[500]})`,
                borderRadius: theme.borderRadius.full,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.colors.neutral[0],
              }}
            >
              <MdPerson size={28} />
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: theme.typography.fontSize.xs.size,
                  color: theme.colors.neutral[500],
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: theme.spacing.xs,
                  margin: 0,
                }}
              >
                Persona
              </p>
              
              <p
                style={{
                  fontSize: theme.typography.fontSize.sm.size,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.neutral[900],
                  margin: 0,
                }}
              >
                {getRoleLabel(userRole)}
              </p>
            </div>
            <MdDashboard
              size={20}
              style={{
                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
                color: theme.colors.neutral[600]
              }}
            />
          </div>
  
          <div
            style={{
              display: 'inline-block',
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              background: theme.colors.primary[100],
              color: theme.colors.primary[700],
              borderRadius: theme.borderRadius.full,
              fontSize: theme.typography.fontSize.xs.size,
              fontWeight: theme.typography.fontWeight.semibold,
            }}
          >
            {userRole === 'doctor' && 'Medicina'}
            {userRole === 'dentist' && 'Odontología'}
            {userRole === 'psychologist' && 'Psicología'}
          </div>
        </div>

        {/* Dropdown menu - Ahora dentro del mismo contenedor */}
        {isDropdownOpen && (
          <div
            style={{
              marginTop: theme.spacing.md,
              background: theme.colors.neutral[0],
              borderRadius: theme.borderRadius.lg,
              overflow: 'hidden',
              animation: 'slideDown 0.3s ease-out',
              border: `1px solid ${theme.colors.neutral[200]}`,
              boxShadow: theme.shadows.sm,
            }}
          >
            {dropdownItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.md,
                    color: theme.colors.neutral[700],
                    transition: theme.transitions.base,
                    fontSize: theme.typography.fontSize.sm.size,
                    fontWeight: theme.typography.fontWeight.medium,
                    borderBottom: `1px solid ${theme.colors.neutral[100]}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = theme.colors.primary[50];
                    e.currentTarget.style.color = theme.colors.primary[700];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = theme.colors.neutral[700];
                  }}
                >
                  <IconComponent size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Sección de Horarios */}
      <div
        style={{
          padding: theme.spacing.lg,
          borderBottom: `1px solid ${theme.colors.neutral[200]}`,
          background: theme.colors.neutral[50],
        }}
      >
        {/* Header clickeable para horarios */}
        <div
          style={{
            cursor: 'pointer',
          }}
          onClick={() => setIsScheduleDropdownOpen(!isScheduleDropdownOpen)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.sm }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: `linear-gradient(135deg, ${theme.colors.secondary[500]}, ${theme.colors.primary[500]})`,
                borderRadius: theme.borderRadius.full,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.colors.neutral[0],
              }}
            >
              <MdSchedule size={28} />
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: theme.typography.fontSize.xs.size,
                  color: theme.colors.neutral[500],
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: theme.spacing.xs,
                  margin: 0,
                }}
              >
                Horarios
              </p>
              
              <p
                style={{
                  fontSize: theme.typography.fontSize.sm.size,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.neutral[900],
                  margin: 0,
                }}
              >
                Gestión de tiempos
              </p>
            </div>
            <MdSchedule
              size={20}
              style={{
                transform: isScheduleDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
                color: theme.colors.neutral[600]
              }}
            />
          </div>
        </div>

        {/* Dropdown menu para horarios */}
        {isScheduleDropdownOpen && (
          <div
            style={{
              marginTop: theme.spacing.md,
              background: theme.colors.neutral[0],
              borderRadius: theme.borderRadius.lg,
              overflow: 'hidden',
              animation: 'slideDown 0.3s ease-out',
              border: `1px solid ${theme.colors.neutral[200]}`,
              boxShadow: theme.shadows.sm,
            }}
          >
            {scheduleDropdownItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.md,
                    color: theme.colors.neutral[700],
                    transition: theme.transitions.base,
                    fontSize: theme.typography.fontSize.sm.size,
                    fontWeight: theme.typography.fontWeight.medium,
                    borderBottom: `1px solid ${theme.colors.neutral[100]}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = theme.colors.secondary[50];
                    e.currentTarget.style.color = theme.colors.secondary[700];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = theme.colors.neutral[700];
                  }}
                >
                  <IconComponent size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Nueva sección Clínico */}
      <div
        style={{
          padding: theme.spacing.lg,
          borderBottom: `1px solid ${theme.colors.neutral[200]}`,
          background: `linear-gradient(to right, ${theme.colors.primary[50]}, ${theme.colors.secondary[50]})`,
        }}
      >
        {/* Header clickeable para clínico */}
        <div
          style={{
            cursor: 'pointer',
          }}
          onClick={() => setIsClinicalDropdownOpen(!isClinicalDropdownOpen)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.sm }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: `linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.secondary[500]})`,
                borderRadius: theme.borderRadius.full,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.colors.neutral[0],
              }}
            >
              <MdLocalPharmacy size={28} />
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: theme.typography.fontSize.xs.size,
                  color: theme.colors.neutral[500],
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: theme.spacing.xs,
                  margin: 0,
                }}
              >
                Clínico
              </p>
              
              <p
                style={{
                  fontSize: theme.typography.fontSize.sm.size,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.neutral[900],
                  margin: 0,
                }}
              >
                Gestión clínica
              </p>
            </div>
            <BiSolidClinic
              size={20}
              style={{
                transform: isClinicalDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
                color: theme.colors.neutral[600]
              }}
            />
          </div>
        </div>

        {/* Dropdown menu para clínico */}
        {isClinicalDropdownOpen && (
          <div
            style={{
              marginTop: theme.spacing.md,
              background: theme.colors.neutral[0],
              borderRadius: theme.borderRadius.lg,
              overflow: 'hidden',
              animation: 'slideDown 0.3s ease-out',
              border: `1px solid ${theme.colors.neutral[200]}`,
              boxShadow: theme.shadows.sm,
            }}
          >
            {clinicalDropdownItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.md,
                    color: theme.colors.neutral[700],
                    transition: theme.transitions.base,
                    fontSize: theme.typography.fontSize.sm.size,
                    fontWeight: theme.typography.fontWeight.medium,
                    borderBottom: `1px solid ${theme.colors.neutral[100]}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = theme.colors.primary[50];
                    e.currentTarget.style.color = theme.colors.primary[700];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = theme.colors.neutral[700];
                  }}
                >
                  <IconComponent size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Menu de navegación */}
      <nav style={{ flex: 1, padding: theme.spacing.md }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: `${theme.spacing.md} ${theme.spacing.md}`,
                    borderRadius: theme.borderRadius.lg,
                    fontWeight: theme.typography.fontWeight.semibold,
                    transition: theme.transitions.base,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.md,
                    background: activeView === item.id
                      ? `linear-gradient(to right, ${theme.colors.primary[600]}, ${theme.colors.primary[500]})`
                      : 'transparent',
                    color: activeView === item.id ? theme.colors.neutral[0] : theme.colors.neutral[600],
                    boxShadow: activeView === item.id ? theme.shadows.medical : 'none',
                  }}
                >
                  <IconComponent size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: theme.spacing.md,
          borderTop: `1px solid ${theme.colors.neutral[200]}`,
          background: theme.colors.neutral[50],
        }}
      >
        <p
          style={{
            fontSize: theme.typography.fontSize.xs.size,
            color: theme.colors.neutral[500],
            textAlign: 'center',
            margin: 0,
          }}
        >
          © 2024 Vitalia. Todos los derechos reservados.
        </p>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;