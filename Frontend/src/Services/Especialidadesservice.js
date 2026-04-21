import api from './Api';

// Obtener todas las especialidades
export const getEspecialidades = async () => {
  try {
    const response = await api.get('/especialidad');
    
    console.log('Respuesta completa:', response);
    
    // Tu backend devuelve: { ok: true, msg: "...", data: [...] }
    if (response && response.ok === true && Array.isArray(response.data)) {
      return {
        ok: true,
        msg: response.msg || 'Especialidades cargadas',
        data: response.data,
      };
    }
    
    // Si la respuesta no tiene la estructura esperada
    return {
      ok: false,
      msg: response?.msg || 'Formato de datos inválido',
      data: [],
    };
  } catch (error) {
    console.error('Error en getEspecialidades:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al cargar las especialidades',
      error: error.message,
      data: [],
    };
  }
};

// Buscar especialidades por nombre
export const searchEspecialidades = async (searchName = '') => {
  try {
    const response = await api.get('/especialidad');
    
    if (!response || response.ok !== true || !Array.isArray(response.data)) {
      return { ok: false, msg: 'Formato de datos inválido', data: [] };
    }
    
    let especialidadesFiltradas = response.data;
    
    if (searchName) {
      especialidadesFiltradas = response.data.filter(especialidad => {
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

// Obtener especialidad por ID
export const getEspecialidadById = async (id) => {
  try {
    const response = await api.get(`/especialidad/${id}`);
    
    if (response && response.ok === true) {
      return { ok: true, data: response.data };
    }
    
    return { ok: false, msg: response?.msg || 'Especialidad no encontrada', data: null };
  } catch (error) {
    console.error('Error al obtener especialidad:', error);
    return { 
      ok: false, 
      msg: error.data?.msg || 'Error al cargar la especialidad', 
      error: error.message, 
      data: null 
    };
  }
};

// Crear especialidad
export const createEspecialidad = async (especialidadData) => {
  try {
    console.log('📤 Enviando especialidad:', especialidadData);
    const response = await api.post('/especialidad', especialidadData);
    console.log('✅ Respuesta:', response);
    
    return {
      ok: response?.ok !== false,
      msg: response?.msg || 'Especialidad creada exitosamente',
      data: response?.data,
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

// Actualizar especialidad
export const updateEspecialidad = async (id, especialidadData) => {
  try {
    const response = await api.put(`/especialidad/${id}`, especialidadData);
    return {
      ok: response?.ok !== false,
      msg: response?.msg || 'Especialidad actualizada exitosamente',
      data: response?.data,
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

// Cambiar estado de especialidad
export const cambiarEstadoEspecialidad = async (id) => {
  try {
    // Obtener la especialidad actual
    const getResponse = await api.get(`/especialidad/${id}`);
    
    if (!getResponse || getResponse.ok !== true || !getResponse.data) {
      return { ok: false, msg: 'Especialidad no encontrada' };
    }
    
    const especialidadActual = getResponse.data;
    const nuevoEstado = especialidadActual.estado === 'activa' ? 'inactiva' : 'activa';
    
    // Actualizar el estado
    const updateResponse = await api.put(`/especialidad/${id}`, {
      nombre: especialidadActual.nombre,
      descripcion: especialidadActual.descripcion,
      estado: nuevoEstado
    });
    
    return {
      ok: updateResponse?.ok !== false,
      msg: updateResponse?.msg || `Especialidad ${nuevoEstado === 'activa' ? 'activada' : 'desactivada'} exitosamente`,
      estado: nuevoEstado,
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

// Eliminar especialidad
export const deleteEspecialidad = async (id) => {
  try {
    const response = await api.delete(`/especialidad/${id}`);
    return {
      ok: response?.ok !== false,
      msg: response?.msg || 'Especialidad eliminada exitosamente',
    };
  } catch (error) {
    console.warn('DELETE no disponible, cambiando estado...');
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