// Servicio para gestión de horarios
import api from './Api.js';

/**
 * Obtener lista de todos los horarios
 * GET /vitalia/horarios
 * @returns {Promise} Lista de horarios
 */
export const getHorarios = async () => {
  try {
    const response = await api.get('/horarios');
    
    console.log('🔍 Respuesta del backend:', response);
    
    let horariosArray = [];
    
    if (response.data && Array.isArray(response.data)) {
      horariosArray = response.data;
    } else if (Array.isArray(response)) {
      horariosArray = response;
    }

    console.log('✅ Horarios procesados:', horariosArray);
    
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Horarios cargados',
      data: horariosArray || [],
    };
  } catch (error) {
    console.error('❌ Error al obtener horarios:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al cargar los horarios',
      error: error.message,
      data: [],
    };
  }
};

/**
 * Obtener horarios con información del usuario (doctor)
 * GET /vitalia/horarios/con-usuarios
 * @returns {Promise} Lista de horarios con datos del usuario
 */
export const getHorariosConUsuarios = async () => {
  try {
    const response = await api.get('/horarios');
    
    let horariosArray = [];
    if (response.data && Array.isArray(response.data)) {
      horariosArray = response.data;
    } else if (Array.isArray(response)) {
      horariosArray = response;
    }

    return {
      ok: response.ok !== false,
      msg: response.msg || 'Horarios cargados',
      data: horariosArray || [],
    };
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    return {
      ok: false,
      msg: 'Error al cargar los horarios',
      error: error.message,
      data: [],
    };
  }
};

/**
 * Obtener un horario específico
 * @param {number} id - ID del horario
 * @returns {Promise} Datos del horario
 */
export const getHorarioById = async (id) => {
  try {
    const response = await api.get(`/horarios/${id}`);
    
    if (response.data) {
      return { ok: true, data: response.data };
    }

    return { ok: false, msg: 'Horario no encontrado', data: null };
  } catch (error) {
    console.error('Error al obtener horario:', error);
    return { ok: false, msg: 'Error al cargar el horario', error: error.message, data: null };
  }
};

/**
 * Crear nuevo horario
 * POST /vitalia/horarios
 * @param {object} horarioData - Datos del horario
 * @returns {Promise} Horario creado
 */
export const createHorario = async (horarioData) => {
  try {
    console.log('📤 Enviando horario:', horarioData);
    const response = await api.post('/horarios', horarioData);
    
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Horario creado exitosamente',
      data: response.data,
    };
  } catch (error) {
    console.error('Error al crear horario:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al crear el horario',
      error: error.message,
      data: null,
    };
  }
};

/**
 * Actualizar horario
 * PUT /vitalia/horarios/:id
 * @param {number} id - ID del horario
 * @param {object} horarioData - Datos a actualizar
 * @returns {Promise} Horario actualizado
 */
export const updateHorario = async (id, horarioData) => {
  try {
    const response = await api.put(`/horarios/${id}`, horarioData);
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Horario actualizado exitosamente',
      data: response.data,
    };
  } catch (error) {
    console.error('Error al actualizar horario:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al actualizar el horario',
      error: error.message,
      data: null,
    };
  }
};

/**
 * Eliminar horario
 * DELETE /vitalia/horarios/:id
 * @param {number} id - ID del horario
 * @returns {Promise} Resultado de la eliminación
 */
export const deleteHorario = async (id) => {
  try {
    const response = await api.delete(`/horarios/${id}`);
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Horario eliminado exitosamente',
    };
  } catch (error) {
    console.error('Error al eliminar horario:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al eliminar el horario',
      error: error.message,
    };
  }
};

/**
 * Obtener doctores que trabajan un día específico
 * @param {string} dia - Día de la semana (Lun, Mar, Mié, etc)
 * @returns {Promise} Lista de doctores
 */
export const getDoctoresPorDia = async (dia) => {
  try {
    // Esto se procesa en el frontend filtrando usuarios
    return {
      ok: true,
      data: [],
    };
  } catch (error) {
    return {
      ok: false,
      msg: 'Error al obtener doctores del día',
      error: error.message,
    };
  }
};

export default {
  getHorarios,
  getHorariosConUsuarios,
  getHorarioById,
  createHorario,
  updateHorario,
  deleteHorario,
  getDoctoresPorDia,
};