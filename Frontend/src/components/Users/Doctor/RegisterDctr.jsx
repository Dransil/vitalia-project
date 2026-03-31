import React, { useState } from 'react';
import { useTheme } from '../../../Config/ThemeContext';
import { MdUploadFile, MdDelete, MdSave, MdArrowBack, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const RegisterDct = ({ onBack }) => {
  const { config, colors, spacing, typography, borderRadius, shadows } = useTheme();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    cedula: '',
    telefono: '',
    especialidad: '',
    consultorio: '',
    usuario: '',
    contraseña: '',
    confirmarContraseña: '',
  });
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [permisos, setPermisos] = useState({
    crearCitas: false,
    editarCitas: false,
    cancelarCitas: false,
    verHistorial: false,
    editarHistorial: false,
    crearPacientes: false,
    editarPacientes: false,
    verReportes: false,
    gestionarUsuarios: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteFoto = () => {
    setFoto(null);
    setFotoPreview(null);
  };

  const handlePermissionChange = (permission) => {
    setPermisos(prev => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };
  const handleback=() => {
    navigate('/Doctor_Dashboard');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('Nuevo usuario creado:', { formData, foto, permisos });
      alert('Usuario creado exitosamente');
      onBack?.();
    }, 1500);
  };

  const permisosDisponibles = [
    { key: 'crearCitas', label: 'Crear Citas' },
    { key: 'editarCitas', label: 'Editar Citas' },
    { key: 'cancelarCitas', label: 'Cancelar Citas' },
    { key: 'verHistorial', label: 'Ver Historial' },
    { key: 'editarHistorial', label: 'Editar Historial' },
    { key: 'crearPacientes', label: 'Crear Pacientes' },
    { key: 'editarPacientes', label: 'Editar Pacientes' },
    { key: 'verReportes', label: 'Ver Reportes' },
    { key: 'gestionarUsuarios', label: 'Gestionar Usuarios' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: config.theme.background || colors.primary[50],
        overflow: 'auto',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-in-out',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: colors.neutral[0],
          borderBottom: `1px solid ${colors.neutral[200]}`,
          padding: spacing.lg,
          boxShadow: shadows.sm,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <button
            onClick={handleback}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: typography.fontSize.xl.size,
              color: colors.neutral[600],
              display: 'flex',
              alignItems: 'center',
              padding: spacing.sm,
            }}
          >
            <MdArrowBack size={24} />
          </button>
          <h1
            style={{
              fontSize: typography.fontSize['2xl'].size,
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900],
              margin: 0,
            }}
          >
            Crear Nuevo Usuario
          </h1>
        </div>
      </div>

      {/* Contenido Principal */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: spacing.xl,
        }}
      >
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '300px 1fr',
              gap: spacing.xl,
            }}
          >
            {/* Columna Izquierda - Foto y Permisos */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.lg,
              }}
            >
              {/* Sección Foto */}
              <div
                style={{
                  background: colors.neutral[0],
                  border: `1px solid ${colors.neutral[200]}`,
                  borderRadius: borderRadius.xl,
                  padding: spacing.lg,
                  boxShadow: shadows.md,
                }}
              >
                <h3
                  style={{
                    fontSize: typography.fontSize.lg.size,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.neutral[900],
                    margin: 0,
                    marginBottom: spacing.md,
                  }}
                >
                  Foto de Perfil
                </h3>

                {fotoPreview ? (
                  <div>
                    <img
                      src={fotoPreview}
                      alt="Preview"
                      style={{
                        width: '100%',
                        borderRadius: borderRadius.lg,
                        marginBottom: spacing.md,
                        maxHeight: '200px',
                        objectFit: 'cover',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleDeleteFoto}
                      style={{
                        width: '100%',
                        padding: spacing.md,
                        background: colors.error.light,
                        color: colors.error.main,
                        border: `2px solid ${colors.error.main}`,
                        borderRadius: borderRadius.md,
                        fontWeight: typography.fontWeight.semibold,
                        cursor: 'pointer',
                        transition: '0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: spacing.sm,
                      }}
                      onMouseEnter={e => e.target.style.background = colors.error.main + '20'}
                      onMouseLeave={e => e.target.style.background = colors.error.light}
                    >
                      <MdDelete size={18} />
                      Eliminar Foto
                    </button>
                  </div>
                ) : (
                  <label
                    style={{
                      display: 'block',
                      padding: spacing.lg,
                      border: `2px dashed ${colors.neutral[300]}`,
                      borderRadius: borderRadius.lg,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: '0.3s',
                      background: colors.neutral[50],
                    }}
                  >
                    <MdUploadFile
                      size={32}
                      style={{
                        color: colors.neutral[400],
                        marginBottom: spacing.sm,
                      }}
                    />
                    <p
                      style={{
                        margin: 0,
                        fontSize: typography.fontSize.sm.size,
                        color: colors.neutral[600],
                        fontWeight: typography.fontWeight.semibold,
                      }}
                    >
                      Haz clic para subir
                    </p>
                    <input
                      type="file"
                      onChange={handleFotoChange}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>

              {/* Sección Permisos */}
              <div
                style={{
                  background: colors.neutral[0],
                  border: `1px solid ${colors.neutral[200]}`,
                  borderRadius: borderRadius.xl,
                  padding: spacing.lg,
                  boxShadow: shadows.md,
                }}
              >
                <h3
                  style={{
                    fontSize: typography.fontSize.lg.size,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.neutral[900],
                    margin: 0,
                    marginBottom: spacing.md,
                  }}
                >
                  Permisos
                </h3>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.md,
                  }}
                >
                  {permisosDisponibles.map(permiso => (
                    <label
                      key={permiso.key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.md,
                        cursor: 'pointer',
                        fontSize: typography.fontSize.sm.size,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={permisos[permiso.key]}
                        onChange={() => handlePermissionChange(permiso.key)}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer',
                          accentColor: config.theme.colors.primary,
                        }}
                      />
                      <span style={{ color: colors.neutral[900] }}>
                        {permiso.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna Derecha - Formulario */}
            <div
              style={{
                background: colors.neutral[0],
                border: `1px solid ${colors.neutral[200]}`,
                borderRadius: borderRadius.xl,
                padding: spacing.lg,
                boxShadow: shadows.md,
              }}
            >
              <h3
                style={{
                  fontSize: typography.fontSize.lg.size,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.neutral[900],
                  margin: 0,
                  marginBottom: spacing.lg,
                }}
              >
                Información del Usuario
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: spacing.lg,
                  marginBottom: spacing.lg,
                }}
              >
                {/* Nombre */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: typography.fontSize.sm.size,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.neutral[900],
                      marginBottom: spacing.sm,
                    }}
                  >
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Juan"
                    required
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      border: `2px solid ${colors.neutral[200]}`,
                      borderRadius: borderRadius.md,
                      fontSize: typography.fontSize.sm.size,
                      outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                    onBlur={e => e.target.style.borderColor = colors.neutral[200]}
                  />
                </div>

                {/* Apellido */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: typography.fontSize.sm.size,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.neutral[900],
                      marginBottom: spacing.sm,
                    }}
                  >
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    placeholder="García"
                    required
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      border: `2px solid ${colors.neutral[200]}`,
                      borderRadius: borderRadius.md,
                      fontSize: typography.fontSize.sm.size,
                      outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                    onBlur={e => e.target.style.borderColor = colors.neutral[200]}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: typography.fontSize.sm.size,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.neutral[900],
                      marginBottom: spacing.sm,
                    }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="juan@ejemplo.com"
                    required
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      border: `2px solid ${colors.neutral[200]}`,
                      borderRadius: borderRadius.md,
                      fontSize: typography.fontSize.sm.size,
                      outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                    onBlur={e => e.target.style.borderColor = colors.neutral[200]}
                  />
                </div>

                {/* Cédula */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: typography.fontSize.sm.size,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.neutral[900],
                      marginBottom: spacing.sm,
                    }}
                  >
                    Cédula *
                  </label>
                  <input
                    type="text"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleInputChange}
                    placeholder="1234567"
                    required
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      border: `2px solid ${colors.neutral[200]}`,
                      borderRadius: borderRadius.md,
                      fontSize: typography.fontSize.sm.size,
                      outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                    onBlur={e => e.target.style.borderColor = colors.neutral[200]}
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: typography.fontSize.sm.size,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.neutral[900],
                      marginBottom: spacing.sm,
                    }}
                  >
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="+591 4 1234567"
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      border: `2px solid ${colors.neutral[200]}`,
                      borderRadius: borderRadius.md,
                      fontSize: typography.fontSize.sm.size,
                      outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                    onBlur={e => e.target.style.borderColor = colors.neutral[200]}
                  />
                </div>

                {/* Especialidad */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: typography.fontSize.sm.size,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.neutral[900],
                      marginBottom: spacing.sm,
                    }}
                  >
                    Especialidad *
                  </label>
                  <select
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      border: `2px solid ${colors.neutral[200]}`,
                      borderRadius: borderRadius.md,
                      fontSize: typography.fontSize.sm.size,
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                    onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                    onBlur={e => e.target.style.borderColor = colors.neutral[200]}
                  >
                    <option value="">Seleccionar especialidad</option>
                    <option value="medicina_general">Medicina General</option>
                    <option value="odontologia">Odontología</option>
                    <option value="pediatria">Pediatría</option>
                    <option value="cardiologia">Cardiología</option>
                  </select>
                </div>

                {/* Consultorio */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: typography.fontSize.sm.size,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.neutral[900],
                      marginBottom: spacing.sm,
                    }}
                  >
                    Consultorio *
                  </label>
                  <select
                    name="consultorio"
                    value={formData.consultorio}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      border: `2px solid ${colors.neutral[200]}`,
                      borderRadius: borderRadius.md,
                      fontSize: typography.fontSize.sm.size,
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                    onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                    onBlur={e => e.target.style.borderColor = colors.neutral[200]}
                  >
                    <option value="">Seleccionar consultorio</option>
                    <option value="consultorio_1">Consultorio Central</option>
                  </select>
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  borderTop: `1px solid ${colors.neutral[200]}`,
                  margin: `${spacing.lg} 0`,
                }}
              />

              <h3
                style={{
                  fontSize: typography.fontSize.lg.size,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.neutral[900],
                  margin: 0,
                  marginBottom: spacing.lg,
                }}
              >
                Credenciales de Acceso
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: spacing.lg,
                }}
              >
                {/* Usuario */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: typography.fontSize.sm.size,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.neutral[900],
                      marginBottom: spacing.sm,
                    }}
                  >
                    Usuario *
                  </label>
                  <input
                    type="text"
                    name="usuario"
                    value={formData.usuario}
                    onChange={handleInputChange}
                    placeholder="juangarcia"
                    required
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      border: `2px solid ${colors.neutral[200]}`,
                      borderRadius: borderRadius.md,
                      fontSize: typography.fontSize.sm.size,
                      outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                    onBlur={e => e.target.style.borderColor = colors.neutral[200]}
                  />
                </div>

                {/* Contraseña */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: typography.fontSize.sm.size,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.neutral[900],
                      marginBottom: spacing.sm,
                    }}
                  >
                    Contraseña *
                  </label>
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="contraseña"
                      value={formData.contraseña}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                      style={{
                        width: '100%',
                        padding: spacing.md,
                        border: `2px solid ${colors.neutral[200]}`,
                        borderRadius: borderRadius.md,
                        fontSize: typography.fontSize.sm.size,
                        outline: 'none',
                        paddingRight: spacing['2xl'],
                      }}
                      onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                      onBlur={e => e.target.style.borderColor = colors.neutral[200]}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: spacing.md,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: colors.neutral[400],
                      }}
                    >
                      {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirmar Contraseña */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: typography.fontSize.sm.size,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.neutral[900],
                      marginBottom: spacing.sm,
                    }}
                  >
                    Confirmar Contraseña *
                  </label>
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmarContraseña"
                      value={formData.confirmarContraseña}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                      style={{
                        width: '100%',
                        padding: spacing.md,
                        border: `2px solid ${colors.neutral[200]}`,
                        borderRadius: borderRadius.md,
                        fontSize: typography.fontSize.sm.size,
                        outline: 'none',
                        paddingRight: spacing['2xl'],
                      }}
                      onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                      onBlur={e => e.target.style.borderColor = colors.neutral[200]}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: spacing.md,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: colors.neutral[400],
                      }}
                    >
                      {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div
                style={{
                  display: 'flex',
                  gap: spacing.md,
                  marginTop: spacing.xl,
                  paddingTop: spacing.lg,
                  borderTop: `1px solid ${colors.neutral[200]}`,
                }}
              >
                <button
                  type="button"
                  onClick={onBack}
                  style={{
                    flex: 1,
                    padding: spacing.md,
                    background: colors.neutral[200],
                    color: colors.neutral[900],
                    border: 'none',
                    borderRadius: borderRadius.md,
                    fontWeight: typography.fontWeight.semibold,
                    cursor: 'pointer',
                    transition: '0.3s',
                  }}
                  onMouseEnter={e => e.target.style.background = colors.neutral[300]}
                  onMouseLeave={e => e.target.style.background = colors.neutral[200]}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: spacing.md,
                    background: `linear-gradient(to right, ${config.theme.colors.primary}, ${config.theme.colors.secondary})`,
                    color: colors.neutral[0],
                    border: 'none',
                    borderRadius: borderRadius.md,
                    fontWeight: typography.fontWeight.semibold,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: '0.3s',
                    opacity: loading ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: spacing.sm,
                  }}
                  onMouseEnter={e => !loading && (e.target.style.opacity = '0.9')}
                  onMouseLeave={e => !loading && (e.target.style.opacity = '1')}
                >
                  <MdSave size={20} />
                  {loading ? 'Guardando...' : 'Guardar Usuario'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterDct;