// doctorService.js - CORREGIDO
import api from './Api';

/**
 * Obtener lista de todos los doctores (usuarios con rol médico/dentista)
 * GET /vitalia/usuarios
 */
export const getDoctores = async () => {
  try {
    const response = await api.get('/usuarios');
    
    // El backend puede devolver diferentes estructuras
    let doctoresArray = [];
    
    // Caso 1: { ok: true, data: [...] }
    if (response.data && Array.isArray(response.data)) {
      doctoresArray = response.data;
    }
    // Caso 2: { usuarios: [...] }
    else if (response.usuarios && Array.isArray(response.usuarios)) {
      doctoresArray = response.usuarios;
    }
    // Caso 3: directamente un array
    else if (Array.isArray(response)) {
      doctoresArray = response;
    }
    // Caso 4: { ok: true, msg: "...", data: null } pero con usuarios en otra parte
    else if (response.data === null && response.msg) {
      // Solo mensaje, sin datos
      return {
        ok: true,
        msg: response.msg || 'No hay doctores registrados',
        data: []
      };
    }

    // Filtrar solo usuarios con rol médico o dentista (si aplica)
    // Tu tabla usuario tiene roles: 'admin', 'dentista', 'medico'
    const doctoresFiltrados = doctoresArray.filter(usuario => 
      usuario && (usuario.rol === 'dentista' || usuario.rol === 'medico' || usuario.rol === 'admin')
    );

    console.log('Doctores cargados:', doctoresFiltrados.length);
    
    return {
      ok: true,
      msg: 'Doctores cargados exitosamente',
      data: doctoresFiltrados,
    };
  } catch (error) {
    console.error('Error al obtener doctores:', error);
    return {
      ok: false,
      msg: error.data?.msg || error.message || 'Error al cargar los doctores',
      data: [],
    };
  }
};

/**
 * Buscar doctores por nombre, email o teléfono
 */
export const searchDoctores = async (searchParams = {}) => {
  const { nombre = '', email = '', telefono = '' } = searchParams;
  
  try {
    const result = await getDoctores();
    
    if (!result.ok || !result.data.length) {
      return result;
    }

    let doctoresFiltrados = [...result.data];

    if (nombre) {
      const searchTerm = nombre.toLowerCase();
      doctoresFiltrados = doctoresFiltrados.filter(doctor => {
        const nombreCompleto = `${doctor.nombre || ''} ${doctor.apellido || ''}`.toLowerCase();
        return nombreCompleto.includes(searchTerm);
      });
    }

    if (email) {
      const searchEmail = email.toLowerCase();
      doctoresFiltrados = doctoresFiltrados.filter(doctor =>
        doctor.email && doctor.email.toLowerCase().includes(searchEmail)
      );
    }

    if (telefono) {
      doctoresFiltrados = doctoresFiltrados.filter(doctor =>
        doctor.telefono && doctor.telefono.includes(telefono)
      );
    }

    return {
      ok: true,
      msg: `${doctoresFiltrados.length} doctores encontrados`,
      data: doctoresFiltrados,
    };
  } catch (error) {
    console.error('Error al buscar doctores:', error);
    return {
      ok: false,
      msg: 'Error al buscar los doctores',
      data: [],
    };
  }
};

/**
 * Obtener un doctor específico por ID
 */
export const getDoctorById = async (id) => {
  try {
    // Intentar obtener directamente por ID si el backend lo soporta
    const response = await api.get(`/usuarios/${id}`);
    
    // El backend puede devolver diferentes estructuras
    let doctor = null;
    
    if (response.data) {
      doctor = response.data;
    } else if (response.usuario) {
      doctor = response.usuario;
    } else if (response.id_usuario || response.id) {
      doctor = response;
    }
    
    if (!doctor) {
      return { ok: false, msg: 'Doctor no encontrado', data: null };
    }

    return { ok: true, msg: 'Doctor encontrado', data: doctor };
  } catch (error) {
    // Si falla la búsqueda directa, buscar en la lista completa
    console.log(`Buscando doctor ${id} en lista completa...`);
    const result = await getDoctores();
    
    if (result.ok && result.data.length) {
      const doctor = result.data.find(d => d.id_usuario === id || d.id === id);
      if (doctor) {
        return { ok: true, msg: 'Doctor encontrado', data: doctor };
      }
    }
    
    return { 
      ok: false, 
      msg: error.data?.msg || 'Error al cargar el doctor', 
      data: null 
    };
  }
};

/**
 * Crear nuevo doctor
 * POST /vitalia/usuarios
 */
export const createDoctor = async (doctorData) => {
  try {
    // Validar datos requeridos según tu tabla `usuario`
    const requiredFields = ['nombre', 'apellido', 'email', 'cedula', 'contraseña_hash'];
    const missingFields = requiredFields.filter(field => !doctorData[field]);
    
    if (missingFields.length > 0) {
      return {
        ok: false,
        msg: `Faltan campos requeridos: ${missingFields.join(', ')}`,
        data: null,
      };
    }

    const response = await api.post('/usuarios', {
      ...doctorData,
      rol: doctorData.rol || 'dentista', // por defecto dentista
      estado: doctorData.estado || 'activo',
      horario_id: doctorData.horario_id || null,
      dias_atencion: doctorData.dias_atencion || 'Lun,Mar,Mié,Jue,Vie'
    });
    
    return {
      ok: true,
      msg: response.msg || 'Doctor creado exitosamente',
      data: response.data || response.usuario || response,
    };
  } catch (error) {
    console.error('Error al crear doctor:', error);
    return {
      ok: false,
      msg: error.data?.msg || error.message || 'Error al crear el doctor',
      data: null,
    };
  }
};

/**
 * Actualizar doctor
 * PUT /vitalia/usuarios/:id
 */
export const updateDoctor = async (id, doctorData) => {
  try {
    const response = await api.put(`/usuarios/${id}`, doctorData);
    return {
      ok: true,
      msg: response.msg || 'Doctor actualizado exitosamente',
      data: response.data || response.usuario || response,
    };
  } catch (error) {
    console.error('Error al actualizar doctor:', error);
    return {
      ok: false,
      msg: error.data?.msg || error.message || 'Error al actualizar el doctor',
      data: null,
    };
  }
};

/**
 * Cambiar estado del doctor (activo/inactivo)
 * Usa PATCH /vitalia/usuarios/:id (actualización parcial)
 */
// doctorService.js - Cambiar la función cambiarEstadoDoctor
export const cambiarEstadoDoctor = async (id, nuevoEstado = null) => {
  try {
    // Tu backend usa PATCH /estado/:id
    const response = await api.patch(`/estado/${id}`); // ← Cambiado: agregar /estado/
    
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
 * Eliminar doctor (soft delete - cambia estado a inactivo)
 */
export const deleteDoctor = async (id) => {
  try {
    // Intentar DELETE primero (si el backend lo soporta como soft delete)
    const response = await api.delete(`/usuarios/${id}`);
    return {
      ok: true,
      msg: response.msg || 'Doctor eliminado exitosamente',
    };
  } catch (error) {
    // Si DELETE no está implementado o falla, usar cambio de estado
    console.warn('DELETE no disponible, usando cambio de estado...');
    return await cambiarEstadoDoctor(id);
  }
};

/**
 * Asignar especialidad y consultorio a un doctor (usar tabla pivote)
 * POST /vitalia/usuarios/:id/asignaciones
 */
export const asignarEspecialidadConsultorio = async (idUsuario, idConsultorio, idEspecialidad) => {
  try {
    const response = await api.post('/usuarios/asignaciones', {
      id_usuario: idUsuario,
      id_consultorio: idConsultorio,
      id_especialidad: idEspecialidad
    });
    
    return {
      ok: true,
      msg: response.msg || 'Asignación realizada exitosamente',
      data: response.data,
    };
  } catch (error) {
    console.error('Error al asignar especialidad:', error);
    return {
      ok: false,
      msg: error.data?.msg || error.message || 'Error al asignar especialidad',
    };
  }
};

/**
 * Obtener especialidades y consultorios de un doctor
 * GET /vitalia/usuarios/:id/asignaciones
 */
export const getDoctorAsignaciones = async (idUsuario) => {
  try {
    const response = await api.get(`/usuarios/${idUsuario}/asignaciones`);
    
    return {
      ok: true,
      msg: response.msg || 'Asignaciones obtenidas',
      data: response.data || response.asignaciones || [],
    };
  } catch (error) {
    console.error('Error al obtener asignaciones:', error);
    return {
      ok: false,
      msg: error.data?.msg || error.message || 'Error al obtener asignaciones',
      data: [],
    };
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
  asignarEspecialidadConsultorio,
  getDoctorAsignaciones,
};