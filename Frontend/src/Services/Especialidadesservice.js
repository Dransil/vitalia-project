import api from './Api';

export const getEspecialidades = async () => {
  try {
    const response = await api.get('/especialidades');
    
    console.log('Respuesta del backend:', response);
    
    let especialidadesArray = [];
    
    if (response.data && Array.isArray(response.data)) {
      especialidadesArray = response.data;
    } else if (Array.isArray(response)) {
      especialidadesArray = response;
    }

    console.log('Especialidades procesadas:', especialidadesArray);
    
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Especialidades cargadas',
      data: especialidadesArray || [],
    };
  } catch (error) {
    console.error('Error al obtener especialidades:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al cargar las especialidades',
      error: error.message,
      data: [],
    };
  }
};


export const searchEspecialidades = async (searchName = '') => {
  try {
    const response = await api.get('/especialidades');
    
    let especialidadesArray = [];
    if (response.data && Array.isArray(response.data)) {
      especialidadesArray = response.data;
    } else if (Array.isArray(response)) {
      especialidadesArray = response;
    } else {
      return { ok: false, msg: 'Formato de datos inválido', data: [] };
    }

    if (!Array.isArray(especialidadesArray)) {
      console.warn('especialidadesArray no es un array:', especialidadesArray);
      return { ok: false, msg: 'Formato de datos inválido', data: [] };
    }

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


export const getEspecialidadById = async (id) => {
  try {
    const response = await api.get(`/especialidades/${id}`);
    
    if (response.data) {
      return { ok: true, data: response.data };
    }

    return { ok: false, msg: 'Especialidad no encontrada', data: null };
  } catch (error) {
    console.error('Error al obtener especialidad:', error);
    return { ok: false, msg: 'Error al cargar la especialidad', error: error.message, data: null };
  }
};


export const createEspecialidad = async (especialidadData) => {
  try {
    console.log('📤 Enviando especialidad:', especialidadData);
    const response = await api.post('/especialidades', especialidadData);
    
    console.log('✅ Respuesta:', response);
    
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