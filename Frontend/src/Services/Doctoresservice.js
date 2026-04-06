// Servicio para gestión de doctores
// CORREGIDO - Coincide exactamente con las rutas del backend
import api from './Api';

/**
 * Obtener lista de todos los doctores
 * GET /vitalia/usuarios
 * @returns {Promise} Lista de doctores
 */
export const getDoctores = async () => {
  try {
    const response = await api.get('/usuarios');
    
    console.log('🔍 Respuesta del backend:', response);
    
    // El backend retorna: { ok: true, msg: '...', data: [...] }
    let doctoresArray = [];
    
    if (response.data && Array.isArray(response.data)) {
      doctoresArray = response.data;
    } else if (Array.isArray(response)) {
      doctoresArray = response;
    }

    console.log('✅ Doctores procesados:', doctoresArray);
    
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Doctores cargados',
      data: doctoresArray || [],
    };
  } catch (error) {
    console.error('❌ Error al obtener doctores:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al cargar los doctores',
      error: error.message,
      data: [],
    };
  }
};

/**
 * Buscar/filtrar doctores localmente
 * @param {string} searchName - Buscar por nombre o apellido
 * @param {string} searchEmail - Buscar por email
 * @param {string} searchPhone - Buscar por teléfono
 * @returns {Promise} Lista de doctores filtrados
 */
export const searchDoctores = async (searchName = '', searchEmail = '', searchPhone = '') => {
  try {
    const response = await api.get('/usuarios');
    
    // Obtener el array de doctores
    let doctoresArray = [];
    if (response.data && Array.isArray(response.data)) {
      doctoresArray = response.data;
    } else if (Array.isArray(response)) {
      doctoresArray = response;
    } else {
      return { ok: false, msg: 'Formato de datos inválido', data: [] };
    }

    // Validar que doctoresArray sea un array
    if (!Array.isArray(doctoresArray)) {
      console.warn('doctoresArray no es un array:', doctoresArray);
      return { ok: false, msg: 'Formato de datos inválido', data: [] };
    }

    // Filtrar en el frontend
    let doctoresFiltrados = doctoresArray;

    if (searchName) {
      doctoresFiltrados = doctoresFiltrados.filter(doctor => {
        if (!doctor) return false;
        const nombreCompleto = `${doctor.nombre || ''} ${doctor.apellido || ''}`.toLowerCase();
        return nombreCompleto.includes(searchName.toLowerCase());
      });
    }

    if (searchEmail) {
      doctoresFiltrados = doctoresFiltrados.filter(doctor =>
        doctor && doctor.email && doctor.email.toLowerCase().includes(searchEmail.toLowerCase())
      );
    }

    if (searchPhone) {
      doctoresFiltrados = doctoresFiltrados.filter(doctor =>
        doctor && doctor.telefono && doctor.telefono.includes(searchPhone)
      );
    }

    return {
      ok: true,
      data: doctoresFiltrados,
    };
  } catch (error) {
    console.error('Error al buscar doctores:', error);
    return {
      ok: false,
      msg: 'Error al buscar los doctores',
      error: error.message,
      data: [],
    };
  }
};

/**
 * Obtener un doctor específico
 * @param {number} id - ID del doctor
 * @returns {Promise} Datos del doctor
 */
export const getDoctorById = async (id) => {
  try {
    const response = await api.get('/usuarios');
    
    let doctoresArray = [];
    if (response.data && Array.isArray(response.data)) {
      doctoresArray = response.data;
    } else if (Array.isArray(response)) {
      doctoresArray = response;
    }

    const doctor = doctoresArray.find(d => d.id_usuario === id || d.id === id);
    
    if (!doctor) {
      return { ok: false, msg: 'Doctor no encontrado', data: null };
    }

    return { ok: true, data: doctor };
  } catch (error) {
    console.error('Error al obtener doctor:', error);
    return { ok: false, msg: 'Error al cargar el doctor', error: error.message, data: null };
  }
};

/**
 * Crear nuevo doctor
 * POST /vitalia/usuarios
 * @param {object} doctorData - Datos del doctor
 * @returns {Promise} Doctor creado
 */
export const createDoctor = async (doctorData) => {
  try {
    const response = await api.post('/usuarios', doctorData);
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Doctor creado exitosamente',
      data: response.data,
    };
  } catch (error) {
    console.error('Error al crear doctor:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al crear el doctor',
      error: error.message,
      data: null,
    };
  }
};

/**
 * Actualizar doctor
 * PUT /vitalia/usuarios/:id
 * @param {number} id - ID del doctor
 * @param {object} doctorData - Datos a actualizar
 * @returns {Promise} Doctor actualizado
 */
export const updateDoctor = async (id, doctorData) => {
  try {
    const response = await api.put(`/usuarios/${id}`, doctorData);
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Doctor actualizado exitosamente',
      data: response.data,
    };
  } catch (error) {
    console.error('Error al actualizar doctor:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al actualizar el doctor',
      error: error.message,
      data: null,
    };
  }
};

/**
 * Cambiar estado del doctor (activo/inactivo)
 * PATCH /vitalia/usuarios/estado/:id
 * ⚠️ OJO: En tu backend es PATCH, no PUT
 * ⚠️ OJO: La ruta es /estado/:id, no /:id/estado
 * @param {number} id - ID del doctor
 * @returns {Promise} Resultado de cambio de estado
 */
export const cambiarEstadoDoctor = async (id) => {
  try {
    // Tu backend usa PATCH /estado/:id
    const response = await api.patch(`/estado/${id}`);
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
 * Eliminar doctor (usa cambiar estado - soft delete)
 * @param {number} id - ID del doctor
 * @returns {Promise} Resultado de la eliminación
 */
export const deleteDoctor = async (id) => {
  try {
    const response = await api.delete(`/usuarios/${id}`);
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Doctor eliminado exitosamente',
    };
  } catch (error) {
    console.warn('DELETE no disponible, intentando cambiar estado...');
    return await cambiarEstadoDoctor(id);
  }
};

export default {
  getDoctores,
  searchDoctores,
  getDoctorById,
  createDoctor,
  updateDoctor,
  cambiarEstadoDoctor,
  deleteDoctor,
};