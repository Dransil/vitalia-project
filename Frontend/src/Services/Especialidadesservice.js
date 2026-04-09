// Servicio para gestión de especialidades
import api from './Api';

/**
 * Obtener lista de todas las especialidades
 * GET /vitalia/especialidades
 * @returns {Promise} Lista de especialidades
 */
export const getEspecialidades = async () => {
  try {
    const response = await api.get('/especialidades');
    
    console.log('🔍 Respuesta del backend:', response);
    
    // El backend retorna: { ok: true, msg: '...', data: [...] }
    let especialidadesArray = [];
    
    if (response.data && Array.isArray(response.data)) {
      especialidadesArray = response.data;
    } else if (Array.isArray(response)) {
      especialidadesArray = response;
    }

    console.log('✅ Especialidades procesadas:', especialidadesArray);
    
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Especialidades cargadas',
      data: especialidadesArray || [],
    };
  } catch (error) {
    console.error('❌ Error al obtener especialidades:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al cargar las especialidades',
      error: error.message,
      data: [],
    };
  }
};

/**
 * Buscar/filtrar especialidades localmente
 * @param {string} searchName - Buscar por nombre
 * @returns {Promise} Lista de especialidades filtradas
 */
export const searchEspecialidades = async (searchName = '') => {
  try {
    const response = await api.get('/especialidades');
    
    // Obtener el array de especialidades
    let especialidadesArray = [];
    if (response.data && Array.isArray(response.data)) {
      especialidadesArray = response.data;
    } else if (Array.isArray(response)) {
      especialidadesArray = response;
    } else {
      return { ok: false, msg: 'Formato de datos inválido', data: [] };
    }

    // Validar que especialidadesArray sea un array
    if (!Array.isArray(especialidadesArray)) {
      console.warn('especialidadesArray no es un array:', especialidadesArray);
      return { ok: false, msg: 'Formato de datos inválido', data: [] };
    }

    // Filtrar en el frontend
    let especialidadesFiltradas = especialidadesArray;

    if (searchName) {
      especialidadesFiltradas = especialidadesFiltradas.filter(especialidad => {
        if (!especialidad) return false;
        const nombre = (especialidad.nombre || '').toLowerCase();
        return nombre.includes(searchName.toLowerCase());
      });
    }

    return {
      ok: true,
      data: especialidadesFiltradas,
    };
  } catch (error) {
    console.error('Error al buscar especialidades:', error);
    return {
      ok: false,
      msg: 'Error al buscar las especialidades',
      error: error.message,
      data: [],
    };
  }
};

/**
 * Obtener una especialidad específica
 * @param {number} id - ID de la especialidad
 * @returns {Promise} Datos de la especialidad
 */
export const getEspecialidadById = async (id) => {
  try {
    const response = await api.get('/especialidades');
    
    let especialidadesArray = [];
    if (response.data && Array.isArray(response.data)) {
      especialidadesArray = response.data;
    } else if (Array.isArray(response)) {
      especialidadesArray = response;
    }

    const especialidad = especialidadesArray.find(e => e.id_especialidad === id || e.id === id);
    
    if (!especialidad) {
      return { ok: false, msg: 'Especialidad no encontrada', data: null };
    }

    return { ok: true, data: especialidad };
  } catch (error) {
    console.error('Error al obtener especialidad:', error);
    return { ok: false, msg: 'Error al cargar la especialidad', error: error.message, data: null };
  }
};

/**
 * Crear nueva especialidad
 * POST /vitalia/especialidades
 * @param {object} especialidadData - Datos de la especialidad
 * @returns {Promise} Especialidad creada
 */
export const createEspecialidad = async (especialidadData) => {
  try {
    const response = await api.post('/especialidades', especialidadData);
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Especialidad creada exitosamente',
      data: response.data,
    };
  } catch (error) {
    console.error('Error al crear especialidad:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al crear la especialidad',
      error: error.message,
      data: null,
    };
  }
};

/**
 * Actualizar especialidad
 * PUT /vitalia/especialidades/:id
 * @param {number} id - ID de la especialidad
 * @param {object} especialidadData - Datos a actualizar
 * @returns {Promise} Especialidad actualizada
 */
export const updateEspecialidad = async (id, especialidadData) => {
  try {
    const response = await api.put(`/especialidades/${id}`, especialidadData);
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Especialidad actualizada exitosamente',
      data: response.data,
    };
  } catch (error) {
    console.error('Error al actualizar especialidad:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al actualizar la especialidad',
      error: error.message,
      data: null,
    };
  }
};

/**
 * Cambiar estado de la especialidad (activa/inactiva)
 * PATCH /vitalia/especialidades/estado/:id
 * @param {number} id - ID de la especialidad
 * @returns {Promise} Resultado de cambio de estado
 */
export const cambiarEstadoEspecialidad = async (id) => {
  try {
    const response = await api.patch(`/especialidades/estado/${id}`);
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
 * Eliminar especialidad (usa cambiar estado - soft delete)
 * @param {number} id - ID de la especialidad
 * @returns {Promise} Resultado de la eliminación
 */
export const deleteEspecialidad = async (id) => {
  try {
    const response = await api.delete(`/especialidades/${id}`);
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Especialidad eliminada exitosamente',
    };
  } catch (error) {
    console.warn('DELETE no disponible, intentando cambiar estado...');
    return await cambiarEstadoEspecialidad(id);
  }
};

export default {
  getEspecialidades,
  searchEspecialidades,
  getEspecialidadById,
  createEspecialidad,
  updateEspecialidad,
  cambiarEstadoEspecialidad,
  deleteEspecialidad,
};