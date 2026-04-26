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
const Horario = require('./Horario');
const UsuarioConsultorioEspecialidad = require('./UsuarioConsultorioEspecialidad');
const Diente = require('./Diente');
const Odontograma = require('./Odontograma');
// 1. Horario
Usuario.belongsTo(Horario, { foreignKey: 'horario_id' });
Horario.hasMany(Usuario, { foreignKey: 'horario_id' });

// 2. Relación N:M via tabla pivote
Usuario.belongsToMany(Consultorio, { through: UsuarioConsultorioEspecialidad, foreignKey: 'id_usuario' });
Usuario.belongsToMany(Especialidad, { through: UsuarioConsultorioEspecialidad, foreignKey: 'id_usuario' });
Consultorio.belongsToMany(Usuario, { through: UsuarioConsultorioEspecialidad, foreignKey: 'id_consultorio' });
Especialidad.belongsToMany(Usuario, { through: UsuarioConsultorioEspecialidad, foreignKey: 'id_especialidad' });

// Para poder hacer include anidado desde 'asignaciones'
Usuario.hasMany(UsuarioConsultorioEspecialidad, { foreignKey: 'id_usuario', as: 'asignaciones' });
UsuarioConsultorioEspecialidad.belongsTo(Consultorio, { foreignKey: 'id_consultorio' });  // <--
UsuarioConsultorioEspecialidad.belongsTo(Especialidad, { foreignKey: 'id_especialidad' }); // <--

// 3. Cita
Cita.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'Doctor' });
Cita.belongsTo(Paciente, { foreignKey: 'id_paciente' });
Cita.belongsTo(TipoCita, { foreignKey: 'id_tipo_cita' });

// 4. Relaciones 1:1
Cita.hasOne(Historial, { foreignKey: 'id_cita' });
Historial.belongsTo(Cita, { foreignKey: 'id_cita' });
Cita.hasOne(Cotizacion, { foreignKey: 'id_cita' });
Cotizacion.belongsTo(Cita, { foreignKey: 'id_cita' });

// 5. Historial dental
Historial.hasMany(HistorialDental, { foreignKey: 'id_historial' });
HistorialDental.belongsTo(Historial, { foreignKey: 'id_historial' });

// 6. Notificaciones
Usuario.hasMany(Notificacion, { foreignKey: 'id_usuario' });
Cita.hasMany(Notificacion, { foreignKey: 'id_cita' });

// 7. Odontograma
Paciente.hasMany(Odontograma, { foreignKey: 'id_paciente', as: 'odontograma' });
Odontograma.belongsTo(Paciente, { foreignKey: 'id_paciente' });
Diente.hasMany(Odontograma, { foreignKey: 'id_diente' });
Odontograma.belongsTo(Diente, { foreignKey: 'id_diente' });

module.exports = {
    Usuario, Paciente, Cita, Historial, Cotizacion,
    Especialidad, Consultorio, TipoCita, HistorialDental,
    Notificacion, Horario, UsuarioConsultorioEspecialidad,
    Diente, Odontograma
};