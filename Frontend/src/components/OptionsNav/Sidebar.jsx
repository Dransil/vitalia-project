import React from 'react';
import { useTheme } from '../../Config/ThemeContext';
import { MdDashboard, MdAddCircle, MdCalendarToday, MdSettings, MdMedicalServices } from 'react-icons/md';

const Sidebar = ({ activeView, setActiveView, userRole }) => {
  const theme = useTheme();
  
  const menuItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: MdDashboard },
    { id: 'new-appointment', label: 'Nueva Cita', icon: MdAddCircle },
    { id: 'appointments', label: 'Mis Citas', icon: MdCalendarToday },
    { id: 'settings', label: 'Configuración', icon: MdSettings },
  ];

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

      {/* Información del usuario */}
      <div
        style={{
          padding: theme.spacing.lg,
          borderBottom: `1px solid ${theme.colors.neutral[200]}`,
          background: `linear-gradient(to right, ${theme.colors.primary[50]}, ${theme.colors.secondary[50]})`,
        }}
      >
        <p
          style={{
            fontSize: theme.typography.fontSize.xs.size,
            color: theme.colors.neutral[500],
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: theme.spacing.sm,
            margin: 0,
          }}
        >
          Bienvenido
        </p>
        <p
          style={{
            fontSize: theme.typography.fontSize.sm.size,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.neutral[900],
            marginBottom: theme.spacing.md,
            margin: 0,
          }}
        >
          {getRoleLabel(userRole)}
        </p>
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

      {/* Menu de navegación */}
      <nav style={{ flex: 1, padding: theme.spacing.md }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
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
          © 2024 MediCitas. Todos los derechos reservados.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;