import api from './Api';


export const getConsultorios = async () => {
  try {
    const response = await api.get('/consultorio');
    
    console.log('🔍 Respuesta del backend:', response);
    
    let consultoriosArray = [];
    
    if (response.data && Array.isArray(response.data)) {
      consultoriosArray = response.data;
    } else if (Array.isArray(response)) {
      consultoriosArray = response;
    }

    console.log('✅ Consultorios procesados:', consultoriosArray);
    
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Consultorios cargados',
      data: consultoriosArray || [],
    };
  } catch (error) {
    console.error('❌ Error al obtener consultorios:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al cargar los consultorios',
      error: error.message,
      data: [],
    };
  }
};


export const searchConsultorios = async (searchName = '', searchCity = '') => {
  try {
    const response = await api.get('/consultorio');
    
    let consultoriosArray = [];
    if (response.data && Array.isArray(response.data)) {
      consultoriosArray = response.data;
    } else if (Array.isArray(response)) {
      consultoriosArray = response;
    } else {
      return { ok: false, msg: 'Formato de datos inválido', data: [] };
    }

    if (!Array.isArray(consultoriosArray)) {
      console.warn('consultoriosArray no es un array:', consultoriosArray);
      return { ok: false, msg: 'Formato de datos inválido', data: [] };
    }

    let consultoriosFiltrados = consultoriosArray;

    if (searchName) {
      consultoriosFiltrados = consultoriosFiltrados.filter(consultorio => {
        if (!consultorio) return false;
        const nombre = (consultorio.nombre || '').toLowerCase();
        return nombre.includes(searchName.toLowerCase());
      });
    }

    if (searchCity) {
      consultoriosFiltrados = consultoriosFiltrados.filter(consultorio => {
        if (!consultorio) return false;
        const ciudad = (consultorio.ciudad || '').toLowerCase();
        return ciudad.includes(searchCity.toLowerCase());
      });
    }

    return {
      ok: true,
      data: consultoriosFiltrados,
    };
  } catch (error) {
    console.error('Error al buscar consultorios:', error);
    return {
      ok: false,
      msg: 'Error al buscar los consultorios',
      error: error.message,
      data: [],
    };
  }
};


export const getConsultorioById = async (id) => {
  try {
    const response = await api.get(`/consultorio/${id}`);
    
    if (response.data) {
      return { ok: true, data: response.data };
    }

    return { ok: false, msg: 'Consultorio no encontrado', data: null };
  } catch (error) {
    console.error('Error al obtener consultorio:', error);
    return { ok: false, msg: 'Error al cargar el consultorio', error: error.message, data: null };
  }
};


export const createConsultorio = async (consultorioData) => {
  try {
    console.log('📤 Enviando consultorio:', consultorioData);
    const response = await api.post('/consultorio', consultorioData);
    
    console.log('✅ Respuesta:', response);
    
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Consultorio creado exitosamente',
      data: response.data,
    };
  } catch (error) {
    console.error('Error al crear consultorio:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al crear el consultorio',
      error: error.message,
      data: null,
    };
  }
};

export const updateConsultorio = async (id, consultorioData) => {
  try {
    const response = await api.put(`/consultorio/${id}`, consultorioData);
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Consultorio actualizado exitosamente',
      data: response.data,
    };
  } catch (error) {
    console.error('Error al actualizar consultorio:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al actualizar el consultorio',
      error: error.message,
      data: null,
    };
  }
};

export const cambiarEstadoConsultorio = async (id) => {
  try {
    const response = await api.patch(`/consultorio/estado/${id}`);
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

export const deleteConsultorio = async (id) => {
  try {
    const response = await api.delete(`/consultorio/${id}`);
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Consultorio eliminado exitosamente',
    };
  } catch (error) {
    console.warn('DELETE no disponible, intentando cambiar estado...');
    return await cambiarEstadoConsultorio(id);
  }
};

export default {
  getConsultorios,
  searchConsultorios,
  getConsultorioById,
  createConsultorio,
  updateConsultorio,
  cambiarEstadoConsultorio,
  deleteConsultorio,
};