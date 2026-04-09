// Servicio para gestión de pacientes - VERSIÓN COMPLETA
// Con todos los campos de la tabla paciente
import api from './Api';

/**
 * Obtener lista de todos los pacientes
 * GET /vitalia/pacientes
 * @returns {Promise} Lista de pacientes
 */
export const getPacientes = async () => {
  try {
    const response = await api.get('/pacientes');
    
    console.log('🔍 Respuesta del backend:', response);
    
    let pacientesArray = [];
    
    if (response.data && Array.isArray(response.data)) {
      pacientesArray = response.data;
    } else if (Array.isArray(response)) {
      pacientesArray = response;
    }

    console.log('✅ Pacientes procesados:', pacientesArray);
    
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Pacientes cargados',
      data: pacientesArray || [],
    };
  } catch (error) {
    console.error('❌ Error al obtener pacientes:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al cargar los pacientes',
      error: error.message,
      data: [],
    };
  }
};

/**
 * Buscar/filtrar pacientes localmente
 * @param {string} searchName - Buscar por nombre o apellido
 * @param {string} searchEmail - Buscar por email
 * @param {string} searchPhone - Buscar por teléfono
 * @returns {Promise} Lista de pacientes filtrados
 */
export const searchPacientes = async (searchName = '', searchEmail = '', searchPhone = '') => {
  try {
    const response = await api.get('/pacientes');
    
    let pacientesArray = [];
    if (response.data && Array.isArray(response.data)) {
      pacientesArray = response.data;
    } else if (Array.isArray(response)) {
      pacientesArray = response;
    } else {
      return { ok: false, msg: 'Formato de datos inválido', data: [] };
    }

    if (!Array.isArray(pacientesArray)) {
      console.warn('pacientesArray no es un array:', pacientesArray);
      return { ok: false, msg: 'Formato de datos inválido', data: [] };
    }

    let pacientesFiltrados = pacientesArray;

    if (searchName) {
      pacientesFiltrados = pacientesFiltrados.filter(paciente => {
        if (!paciente) return false;
        const nombreCompleto = `${paciente.nombre || ''} ${paciente.apellido || ''}`.toLowerCase();
        return nombreCompleto.includes(searchName.toLowerCase());
      });
    }

    if (searchEmail) {
      pacientesFiltrados = pacientesFiltrados.filter(paciente =>
        paciente && paciente.email && paciente.email.toLowerCase().includes(searchEmail.toLowerCase())
      );
    }

    if (searchPhone) {
      pacientesFiltrados = pacientesFiltrados.filter(paciente =>
        paciente && paciente.telefono && paciente.telefono.includes(searchPhone)
      );
    }

    return {
      ok: true,
      data: pacientesFiltrados,
    };
  } catch (error) {
    console.error('Error al buscar pacientes:', error);
    return {
      ok: false,
      msg: 'Error al buscar los pacientes',
      error: error.message,
      data: [],
    };
  }
};

/**
 * Obtener un paciente específico
 * @param {number} id - ID del paciente
 * @returns {Promise} Datos del paciente
 */
export const getPacienteById = async (id) => {
  try {
    const response = await api.get(`/pacientes/${id}`);
    
    if (response.data) {
      return { ok: true, data: response.data };
    }

    return { ok: false, msg: 'Paciente no encontrado', data: null };
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    return { ok: false, msg: 'Error al cargar el paciente', error: error.message, data: null };
  }
};

/**
 * Crear nuevo paciente
 * POST /vitalia/pacientes
 * @param {object} pacienteData - Datos del paciente con TODOS los campos
 * @returns {Promise} Paciente creado
 */
export const createPaciente = async (pacienteData) => {
  try {
    const response = await api.post('/pacientes', pacienteData);
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Paciente creado exitosamente',
      data: response.data,
    };
  } catch (error) {
    console.error('Error al crear paciente:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al crear el paciente',
      error: error.message,
      data: null,
    };
  }
};

/**
 * Actualizar paciente
 * PUT /vitalia/pacientes/:id
 * @param {number} id - ID del paciente
 * @param {object} pacienteData - Datos a actualizar
 * @returns {Promise} Paciente actualizado
 */
export const updatePaciente = async (id, pacienteData) => {
  try {
    const response = await api.put(`/pacientes/${id}`, pacienteData);
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Paciente actualizado exitosamente',
      data: response.data,
    };
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al actualizar el paciente',
      error: error.message,
      data: null,
    };
  }
};

/**
 * Cambiar estado del paciente (activo/inactivo)
 * PATCH /vitalia/pacientes/estado/:id
 * @param {number} id - ID del paciente
 * @returns {Promise} Resultado de cambio de estado
 */
export const cambiarEstadoPaciente = async (id) => {
  try {
    const response = await api.patch(`/pacientes/estado/${id}`);
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Estado actualizado',
      estado: response.estado,
    };
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al cambiar el estado',
      error: error.message,
    };
  }
};

/**
 * Eliminar paciente (usa cambiar estado - soft delete)
 * @param {number} id - ID del paciente
 * @returns {Promise} Resultado de la eliminación
 */
export const deletePaciente = async (id) => {
  try {
    const response = await api.delete(`/pacientes/${id}`);
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Paciente eliminado exitosamente',
    };
  } catch (error) {
    console.warn('DELETE no disponible, intentando cambiar estado...');
    return await cambiarEstadoPaciente(id);
  }
};

export default {
  getPacientes,
  searchPacientes,
  getPacienteById,
  createPaciente,
  updatePaciente,
  cambiarEstadoPaciente,
  deletePaciente,
};