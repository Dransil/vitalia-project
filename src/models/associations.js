const Usuario = require('./Usuario');
const Paciente = require('./Paciente');
const Cita = require('./Cita');
const Historial = require('./Historial');
const Cotizacion = require('./Cotizacion');
const Especialidad = require('./Especialidad');
const Consultorio = require('./Consultorio');
const TipoCita = require('./TipoCita');
const HistorialDental = require('./HistorialDental');
const Notificacion = require('./Notificacion');

// 1. Un Usuario pertenece a una Especialidad y a un Consultorio
Usuario.belongsTo(Especialidad, { foreignKey: 'id_especialidad' });
Usuario.belongsTo(Consultorio, { foreignKey: 'id_consultorio' });

// 2. Relaciones de Cita (El eje central)
Cita.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'Doctor' });
Cita.belongsTo(Paciente, { foreignKey: 'id_paciente' });
Cita.belongsTo(TipoCita, { foreignKey: 'id_tipo_cita' });

// 3. Relaciones 1:1 (Cita tiene un Historial y una Cotización)
Cita.hasOne(Historial, { foreignKey: 'id_cita' });
Historial.belongsTo(Cita, { foreignKey: 'id_cita' });

Cita.hasOne(Cotizacion, { foreignKey: 'id_cita' });
Cotizacion.belongsTo(Cita, { foreignKey: 'id_cita' });

// 4. Relaciones de Historial (Especialmente para Dentistas)
Historial.hasMany(HistorialDental, { foreignKey: 'id_historial' });
HistorialDental.belongsTo(Historial, { foreignKey: 'id_historial' });

// 5. Notificaciones
Usuario.hasMany(Notificacion, { foreignKey: 'id_usuario' });
Cita.hasMany(Notificacion, { foreignKey: 'id_cita' });

module.exports = {
  Usuario,
  Paciente,
  Cita,
  Historial,
  Cotizacion,
  Especialidad,
  Consultorio,
  TipoCita,
  HistorialDental,
  Notificacion
};