import React, { useState } from 'react';
import { useTheme } from '../../../Config/ThemeContext';
import { 
  MdArrowBack, MdArrowForward, MdCheck, MdPerson, 
  MdHome, MdLocalHospital, MdEmergency, MdSecurity,
  MdAssignmentInd
} from 'react-icons/md';

const PatientRegister = () => {
  const { config, colors, spacing, typography, borderRadius, shadows } = useTheme();
  
  const [currentStep, setCurrentStep] = useState(0);
  
  // Estados para cada seccion del formulario
  const [formData, setFormData] = useState({
    // Informacion Basica
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    // Informacion Domiciliaria
    direccion: '',
    ciudad: '',
    // Informacion Medica
    alergias: '',
    condiciones_medicas: '',
    medicamentos_actuales: '',
    grupo_sanguineo: '',
    // Contacto de Emergencia
    contacto_emergencia_nombre: '',
    contacto_emergencia_telefono: '',
    contacto_emergencia_relacion: '',
    // Aseguramiento
    seguro_medico: '',
    numero_poliza: ''
  });

  const [errors, setErrors] = useState({});

  const pasos = [
    { titulo: 'Informacion Basica', icono: MdPerson },
    { titulo: 'Informacion Domiciliaria', icono: MdHome },
    { titulo: 'Informacion Medica', icono: MdLocalHospital },
    { titulo: 'Contacto de Emergencia', icono: MdEmergency },
    { titulo: 'Aseguramiento', icono: MdSecurity },
    { titulo: 'Revisar y Crear', icono: MdAssignmentInd }
  ];

  const gruposSanguineos = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  
  const relacionesEmergencia = [
    'Padre', 'Madre', 'Hermano', 'Hermana', 'Hijo', 'Hija',
    'Conyuge', 'Pareja', 'Abuelo', 'Abuela', 'Tio', 'Tia', 'Amigo'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarPasoActual = () => {
    const nuevosErrores = {};
    
    if (currentStep === 0) {
      if (!formData.nombre) nuevosErrores.nombre = 'Nombre requerido';
      if (!formData.apellido) nuevosErrores.apellido = 'Apellido requerido';
      if (!formData.cedula) nuevosErrores.cedula = 'Cedula requerida';
      if (!formData.email) nuevosErrores.email = 'Email requerido';
      if (!formData.telefono) nuevosErrores.telefono = 'Telefono requerido';
      if (!formData.fecha_nacimiento) nuevosErrores.fecha_nacimiento = 'Fecha requerida';
    }
    
    if (currentStep === 1) {
      if (!formData.direccion) nuevosErrores.direccion = 'Direccion requerida';
      if (!formData.ciudad) nuevosErrores.ciudad = 'Ciudad requerida';
    }
    
    if (currentStep === 3) {
      if (!formData.contacto_emergencia_nombre) nuevosErrores.contacto_emergencia_nombre = 'Nombre requerido';
      if (!formData.contacto_emergencia_telefono) nuevosErrores.contacto_emergencia_telefono = 'Telefono requerido';
      if (!formData.contacto_emergencia_relacion) nuevosErrores.contacto_emergencia_relacion = 'Relacion requerida';
    }
    
    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const siguientePaso = () => {
    if (validarPasoActual() && currentStep < pasos.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const pasoAnterior = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    alert('Paciente creado exitosamente (Demo)');
    console.log('Datos del paciente:', formData);
  };

  const progressPercentage = ((currentStep + 1) / pasos.length) * 100;
  const CurrentIcon = pasos[currentStep].icono;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      {/* Header */}
      <div style={{ marginBottom: spacing['2xl'] }}>
        <h1 style={{
          fontSize: typography.fontSize['3xl'].size,
          fontWeight: typography.fontWeight.bold,
          color: colors.neutral[900],
          margin: 0,
          marginBottom: spacing.md
        }}>
          Registrar Nuevo Paciente
        </h1>
        <p style={{ color: colors.neutral[600], margin: 0 }}>
          Complete la informacion del paciente en los siguientes pasos
        </p>
      </div>

      {/* Progress Section */}
      <div style={{
        background: colors.neutral[0],
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        boxShadow: shadows.sm
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.md
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            fontSize: typography.fontSize.sm.size,
            fontWeight: typography.fontWeight.semibold,
            color: colors.neutral[700]
          }}>
            <CurrentIcon size={20} style={{ color: config.theme.colors.primary }} />
            Paso {currentStep + 1} de {pasos.length}
          </div>
          <div style={{
            fontSize: typography.fontSize.sm.size,
            fontWeight: typography.fontWeight.medium,
            color: colors.neutral[600]
          }}>
            {pasos[currentStep].titulo}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div style={{
          height: '8px',
          background: colors.neutral[200],
          borderRadius: borderRadius.full,
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercentage}%`,
            height: '100%',
            background: `linear-gradient(to right, ${config.theme.colors.primary}, ${config.theme.colors.secondary})`,
            borderRadius: borderRadius.full,
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Form Container */}
      <div style={{
        background: colors.neutral[0],
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: borderRadius.xl,
        padding: spacing['2xl'],
        boxShadow: shadows.md
      }}>
        {/* Step 1: Informacion Basica */}
        {currentStep === 0 && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: spacing.lg,
              marginBottom: spacing.lg
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm.size,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[700],
                  marginBottom: spacing.xs
                }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    border: `2px solid ${errors.nombre ? colors.error.main : colors.neutral[200]}`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.fontSize.sm.size,
                    outline: 'none',
                    transition: '0.3s'
                  }}
                  onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                  onBlur={e => e.target.style.borderColor = errors.nombre ? colors.error.main : colors.neutral[200]}
                  placeholder="Nombre del paciente"
                />
                {errors.nombre && (
                  <span style={{ color: colors.error.main, fontSize: typography.fontSize.xs.size, marginTop: spacing.xs }}>
                    {errors.nombre}
                  </span>
                )}
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm.size,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[700],
                  marginBottom: spacing.xs
                }}>
                  Apellido *
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    border: `2px solid ${errors.apellido ? colors.error.main : colors.neutral[200]}`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.fontSize.sm.size,
                    outline: 'none',
                    transition: '0.3s'
                  }}
                  onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                  placeholder="Apellido del paciente"
                />
                {errors.apellido && (
                  <span style={{ color: colors.error.main, fontSize: typography.fontSize.xs.size }}>{errors.apellido}</span>
                )}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: spacing.lg,
              marginBottom: spacing.lg
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm.size,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[700],
                  marginBottom: spacing.xs
                }}>
                  Cedula *
                </label>
                <input
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    border: `2px solid ${errors.cedula ? colors.error.main : colors.neutral[200]}`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.fontSize.sm.size,
                    outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                  placeholder="12345678"
                />
                {errors.cedula && <span style={{ color: colors.error.main, fontSize: typography.fontSize.xs.size }}>{errors.cedula}</span>}
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm.size,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[700],
                  marginBottom: spacing.xs
                }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    border: `2px solid ${errors.email ? colors.error.main : colors.neutral[200]}`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.fontSize.sm.size,
                    outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                  placeholder="paciente@email.com"
                />
                {errors.email && <span style={{ color: colors.error.main, fontSize: typography.fontSize.xs.size }}>{errors.email}</span>}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: spacing.lg
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm.size,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[700],
                  marginBottom: spacing.xs
                }}>
                  Telefono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    border: `2px solid ${errors.telefono ? colors.error.main : colors.neutral[200]}`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.fontSize.sm.size,
                    outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                  placeholder="0999999999"
                />
                {errors.telefono && <span style={{ color: colors.error.main, fontSize: typography.fontSize.xs.size }}>{errors.telefono}</span>}
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm.size,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[700],
                  marginBottom: spacing.xs
                }}>
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    border: `2px solid ${errors.fecha_nacimiento ? colors.error.main : colors.neutral[200]}`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.fontSize.sm.size,
                    outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                />
                {errors.fecha_nacimiento && <span style={{ color: colors.error.main, fontSize: typography.fontSize.xs.size }}>{errors.fecha_nacimiento}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Informacion Domiciliaria */}
        {currentStep === 1 && (
          <div>
            <div style={{ marginBottom: spacing.lg }}>
              <label style={{
                display: 'block',
                fontSize: typography.fontSize.sm.size,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700],
                marginBottom: spacing.xs
              }}>
                Direccion *
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `2px solid ${errors.direccion ? colors.error.main : colors.neutral[200]}`,
                  borderRadius: borderRadius.md,
                  fontSize: typography.fontSize.sm.size,
                  outline: 'none'
                }}
                onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                placeholder="Calle principal #123"
              />
              {errors.direccion && <span style={{ color: colors.error.main, fontSize: typography.fontSize.xs.size }}>{errors.direccion}</span>}
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: typography.fontSize.sm.size,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700],
                marginBottom: spacing.xs
              }}>
                Ciudad *
              </label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `2px solid ${errors.ciudad ? colors.error.main : colors.neutral[200]}`,
                  borderRadius: borderRadius.md,
                  fontSize: typography.fontSize.sm.size,
                  outline: 'none'
                }}
                onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                placeholder="Ciudad"
              />
              {errors.ciudad && <span style={{ color: colors.error.main, fontSize: typography.fontSize.xs.size }}>{errors.ciudad}</span>}
            </div>
          </div>
        )}

        {/* Step 3: Informacion Medica */}
        {currentStep === 2 && (
          <div>
            <div style={{ marginBottom: spacing.lg }}>
              <label style={{
                display: 'block',
                fontSize: typography.fontSize.sm.size,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700],
                marginBottom: spacing.xs
              }}>
                Alergias
              </label>
              <textarea
                name="alergias"
                value={formData.alergias}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `2px solid ${colors.neutral[200]}`,
                  borderRadius: borderRadius.md,
                  fontSize: typography.fontSize.sm.size,
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'vertical'
                }}
                onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                rows="3"
                placeholder="Ej: Penicilina, Polen, Mariscos..."
              />
            </div>

            <div style={{ marginBottom: spacing.lg }}>
              <label style={{
                display: 'block',
                fontSize: typography.fontSize.sm.size,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700],
                marginBottom: spacing.xs
              }}>
                Condiciones Medicas
              </label>
              <textarea
                name="condiciones_medicas"
                value={formData.condiciones_medicas}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `2px solid ${colors.neutral[200]}`,
                  borderRadius: borderRadius.md,
                  fontSize: typography.fontSize.sm.size,
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'vertical'
                }}
                onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                rows="3"
                placeholder="Ej: Hipertension, Diabetes, Asma..."
              />
            </div>

            <div style={{ marginBottom: spacing.lg }}>
              <label style={{
                display: 'block',
                fontSize: typography.fontSize.sm.size,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700],
                marginBottom: spacing.xs
              }}>
                Medicamentos Actuales
              </label>
              <textarea
                name="medicamentos_actuales"
                value={formData.medicamentos_actuales}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `2px solid ${colors.neutral[200]}`,
                  borderRadius: borderRadius.md,
                  fontSize: typography.fontSize.sm.size,
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'vertical'
                }}
                onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                rows="3"
                placeholder="Ej: Losartan 50mg, Metformina 500mg..."
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: typography.fontSize.sm.size,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700],
                marginBottom: spacing.xs
              }}>
                Grupo Sanguineo
              </label>
              <select
                name="grupo_sanguineo"
                value={formData.grupo_sanguineo}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `2px solid ${colors.neutral[200]}`,
                  borderRadius: borderRadius.md,
                  fontSize: typography.fontSize.sm.size,
                  background: colors.neutral[0],
                  outline: 'none',
                  cursor: 'pointer'
                }}
                onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
              >
                <option value="">Seleccionar grupo sanguineo</option>
                {gruposSanguineos.map(grupo => (
                  <option key={grupo} value={grupo}>{grupo}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Contacto de Emergencia */}
        {currentStep === 3 && (
          <div>
            <div style={{ marginBottom: spacing.lg }}>
              <label style={{
                display: 'block',
                fontSize: typography.fontSize.sm.size,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700],
                marginBottom: spacing.xs
              }}>
                Nombre Contacto *
              </label>
              <input
                type="text"
                name="contacto_emergencia_nombre"
                value={formData.contacto_emergencia_nombre}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `2px solid ${errors.contacto_emergencia_nombre ? colors.error.main : colors.neutral[200]}`,
                  borderRadius: borderRadius.md,
                  fontSize: typography.fontSize.sm.size,
                  outline: 'none'
                }}
                onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                placeholder="Nombre completo del contacto"
              />
              {errors.contacto_emergencia_nombre && <span style={{ color: colors.error.main, fontSize: typography.fontSize.xs.size }}>{errors.contacto_emergencia_nombre}</span>}
            </div>

            <div style={{ marginBottom: spacing.lg }}>
              <label style={{
                display: 'block',
                fontSize: typography.fontSize.sm.size,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700],
                marginBottom: spacing.xs
              }}>
                Telefono Contacto *
              </label>
              <input
                type="tel"
                name="contacto_emergencia_telefono"
                value={formData.contacto_emergencia_telefono}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `2px solid ${errors.contacto_emergencia_telefono ? colors.error.main : colors.neutral[200]}`,
                  borderRadius: borderRadius.md,
                  fontSize: typography.fontSize.sm.size,
                  outline: 'none'
                }}
                onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                placeholder="0999999999"
              />
              {errors.contacto_emergencia_telefono && <span style={{ color: colors.error.main, fontSize: typography.fontSize.xs.size }}>{errors.contacto_emergencia_telefono}</span>}
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: typography.fontSize.sm.size,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700],
                marginBottom: spacing.xs
              }}>
                Relacion *
              </label>
              <select
                name="contacto_emergencia_relacion"
                value={formData.contacto_emergencia_relacion}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `2px solid ${errors.contacto_emergencia_relacion ? colors.error.main : colors.neutral[200]}`,
                  borderRadius: borderRadius.md,
                  fontSize: typography.fontSize.sm.size,
                  background: colors.neutral[0],
                  outline: 'none',
                  cursor: 'pointer'
                }}
                onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
              >
                <option value="">Seleccionar relacion</option>
                {relacionesEmergencia.map(relacion => (
                  <option key={relacion} value={relacion}>{relacion}</option>
                ))}
              </select>
              {errors.contacto_emergencia_relacion && <span style={{ color: colors.error.main, fontSize: typography.fontSize.xs.size }}>{errors.contacto_emergencia_relacion}</span>}
            </div>
          </div>
        )}

        {/* Step 5: Aseguramiento */}
        {currentStep === 4 && (
          <div>
            <div style={{ marginBottom: spacing.lg }}>
              <label style={{
                display: 'block',
                fontSize: typography.fontSize.sm.size,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700],
                marginBottom: spacing.xs
              }}>
                Aseguradora Medica
              </label>
              <input
                type="text"
                name="seguro_medico"
                value={formData.seguro_medico}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `2px solid ${colors.neutral[200]}`,
                  borderRadius: borderRadius.md,
                  fontSize: typography.fontSize.sm.size,
                  outline: 'none'
                }}
                onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                placeholder="Nombre de la aseguradora"
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: typography.fontSize.sm.size,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700],
                marginBottom: spacing.xs
              }}>
                Numero de Poliza
              </label>
              <input
                type="text"
                name="numero_poliza"
                value={formData.numero_poliza}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `2px solid ${colors.neutral[200]}`,
                  borderRadius: borderRadius.md,
                  fontSize: typography.fontSize.sm.size,
                  outline: 'none'
                }}
                onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                placeholder="Numero de poliza"
              />
            </div>
          </div>
        )}

        {/* Step 6: Revisar y Crear */}
        {currentStep === 5 && (
          <div>
            <div style={{
              background: colors.neutral[50],
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              marginBottom: spacing.lg
            }}>
              <h3 style={{
                fontSize: typography.fontSize.md.size,
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral[900],
                margin: 0,
                marginBottom: spacing.md,
                paddingBottom: spacing.sm,
                borderBottom: `2px solid ${colors.neutral[200]}`
              }}>
                Informacion Basica
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: spacing.md,
                fontSize: typography.fontSize.sm.size
              }}>
                <div><strong>Nombre:</strong> {formData.nombre} {formData.apellido}</div>
                <div><strong>Cedula:</strong> {formData.cedula}</div>
                <div><strong>Email:</strong> {formData.email}</div>
                <div><strong>Telefono:</strong> {formData.telefono}</div>
                <div><strong>Fecha Nacimiento:</strong> {formData.fecha_nacimiento}</div>
              </div>
            </div>

            {(formData.direccion || formData.ciudad) && (
              <div style={{
                background: colors.neutral[50],
                borderRadius: borderRadius.lg,
                padding: spacing.lg,
                marginBottom: spacing.lg
              }}>
                <h3 style={{
                  fontSize: typography.fontSize.md.size,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.neutral[900],
                  margin: 0,
                  marginBottom: spacing.md,
                  paddingBottom: spacing.sm,
                  borderBottom: `2px solid ${colors.neutral[200]}`
                }}>
                  Informacion Domiciliaria
                </h3>
                <div><strong>Direccion:</strong> {formData.direccion}</div>
                <div><strong>Ciudad:</strong> {formData.ciudad}</div>
              </div>
            )}

            {(formData.alergias || formData.condiciones_medicas || formData.medicamentos_actuales || formData.grupo_sanguineo) && (
              <div style={{
                background: colors.neutral[50],
                borderRadius: borderRadius.lg,
                padding: spacing.lg,
                marginBottom: spacing.lg
              }}>
                <h3 style={{
                  fontSize: typography.fontSize.md.size,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.neutral[900],
                  margin: 0,
                  marginBottom: spacing.md,
                  paddingBottom: spacing.sm,
                  borderBottom: `2px solid ${colors.neutral[200]}`
                }}>
                  Informacion Medica
                </h3>
                {formData.alergias && <div><strong>Alergias:</strong> {formData.alergias}</div>}
                {formData.condiciones_medicas && <div><strong>Condiciones:</strong> {formData.condiciones_medicas}</div>}
                {formData.medicamentos_actuales && <div><strong>Medicamentos:</strong> {formData.medicamentos_actuales}</div>}
                {formData.grupo_sanguineo && <div><strong>Grupo Sanguineo:</strong> {formData.grupo_sanguineo}</div>}
              </div>
            )}

            {(formData.contacto_emergencia_nombre || formData.contacto_emergencia_telefono || formData.contacto_emergencia_relacion) && (
              <div style={{
                background: colors.neutral[50],
                borderRadius: borderRadius.lg,
                padding: spacing.lg,
                marginBottom: spacing.lg
              }}>
                <h3 style={{
                  fontSize: typography.fontSize.md.size,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.neutral[900],
                  margin: 0,
                  marginBottom: spacing.md,
                  paddingBottom: spacing.sm,
                  borderBottom: `2px solid ${colors.neutral[200]}`
                }}>
                  Contacto de Emergencia
                </h3>
                <div><strong>Nombre:</strong> {formData.contacto_emergencia_nombre}</div>
                <div><strong>Telefono:</strong> {formData.contacto_emergencia_telefono}</div>
                <div><strong>Relacion:</strong> {formData.contacto_emergencia_relacion}</div>
              </div>
            )}

            {(formData.seguro_medico || formData.numero_poliza) && (
              <div style={{
                background: colors.neutral[50],
                borderRadius: borderRadius.lg,
                padding: spacing.lg,
                marginBottom: spacing.lg
              }}>
                <h3 style={{
                  fontSize: typography.fontSize.md.size,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.neutral[900],
                  margin: 0,
                  marginBottom: spacing.md,
                  paddingBottom: spacing.sm,
                  borderBottom: `2px solid ${colors.neutral[200]}`
                }}>
                  Aseguramiento
                </h3>
                {formData.seguro_medico && <div><strong>Aseguradora:</strong> {formData.seguro_medico}</div>}
                {formData.numero_poliza && <div><strong>Poliza:</strong> {formData.numero_poliza}</div>}
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: spacing.md,
          marginTop: spacing['2xl'],
          paddingTop: spacing.lg,
          borderTop: `1px solid ${colors.neutral[200]}`
        }}>
          {currentStep > 0 && (
            <button
              onClick={pasoAnterior}
              style={{
                padding: `${spacing.md} ${spacing.lg}`,
                background: colors.neutral[100],
                color: colors.neutral[700],
                border: `1px solid ${colors.neutral[200]}`,
                borderRadius: borderRadius.md,
                fontWeight: typography.fontWeight.semibold,
                fontSize: typography.fontSize.sm.size,
                cursor: 'pointer',
                transition: '0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm
              }}
              onMouseEnter={e => e.currentTarget.style.background = colors.neutral[200]}
              onMouseLeave={e => e.currentTarget.style.background = colors.neutral[100]}
            >
              <MdArrowBack size={18} />
              Atras
            </button>
          )}

          {currentStep < pasos.length - 1 ? (
            <button
              onClick={siguientePaso}
              style={{
                marginLeft: 'auto',
                padding: `${spacing.md} ${spacing.lg}`,
                background: `linear-gradient(to right, ${config.theme.colors.primary}, ${config.theme.colors.secondary})`,
                color: colors.neutral[0],
                border: 'none',
                borderRadius: borderRadius.md,
                fontWeight: typography.fontWeight.semibold,
                fontSize: typography.fontSize.sm.size,
                cursor: 'pointer',
                transition: '0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Siguiente
              <MdArrowForward size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{
                marginLeft: 'auto',
                padding: `${spacing.md} ${spacing.lg}`,
                background: `linear-gradient(to right, ${config.theme.colors.primary}, ${config.theme.colors.secondary})`,
                color: colors.neutral[0],
                border: 'none',
                borderRadius: borderRadius.md,
                fontWeight: typography.fontWeight.semibold,
                fontSize: typography.fontSize.sm.size,
                cursor: 'pointer',
                transition: '0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Crear Paciente
              <MdCheck size={18} />
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PatientRegister;