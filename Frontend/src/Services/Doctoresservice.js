import api from './Api';

export const getDoctores = async () => {
  try {
    const response = await api.get('/usuarios'); // Cambiado de '/usuario' a '/usuarios'

    let doctoresArray = [];

    if (response.data && Array.isArray(response.data)) {
      doctoresArray = response.data;
    }
    else if (response.usuario && Array.isArray(response.usuario)) {
      doctoresArray = response.usuario;
    }
    else if (Array.isArray(response)) {
      doctoresArray = response;
    }
    else if (response.data === null && response.msg) {
      return {
        ok: true,
        msg: response.msg || 'No hay doctores registrados',
        data: []
      };
    }

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

export const searchDoctores = async (nombre = '', email = '', telefono = '') => {
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

export const getDoctorById = async (id) => {
  try {
    const response = await api.get(`/usuarios/${id}`); // Cambiado de '/usuario' a '/usuarios'

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

export const createDoctor = async (doctorData) => {
  try {
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
      rol: doctorData.rol || 'doctor',
      estado: doctorData.estado || 'activo',
      id_horario: doctorData.id_horario || null,        // ← nombre correcto
      dias_atencion: doctorData.dias_atencion || 'Lun,Mar,Mie,Jue,Vie'
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

export const updateDoctor = async (id, doctorData) => {
  try {
    const response = await api.put(`/usuarios/${id}`, doctorData); // Cambiado de '/usuario' a '/usuarios'
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

// CORREGIDO: La ruta debe coincidir con el backend
export const cambiarEstadoDoctor = async (id) => {
  try {
    // El backend tiene la ruta PATCH /vitalia/usuarios/estado/:id
    // api.js ya tiene la base URL configurada, solo necesitamos la ruta relativa
    const response = await api.patch(`/usuarios/estado/${id}`);

    return {
      ok: response.ok !== false,
      msg: response.msg || 'Estado actualizado correctamente',
      estado: response.estado,
    };
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    return {
      ok: false,
      msg: error.data?.msg || error.message || 'Error al cambiar el estado',
      error: error.message,
    };
  }
};

export const deleteDoctor = async (id) => {
  try {
    const response = await api.delete(`/usuarios/${id}`); // Cambiado de '/usuario' a '/usuarios'
    return {
      ok: true,
      msg: response.msg || 'Doctor eliminado exitosamente',
    };
  } catch (error) {
    console.warn('DELETE no disponible, usando cambio de estado...');
    return await cambiarEstadoDoctor(id);
  }
};

export const asignarEspecialidadConsultorio = async (idUsuario, idConsultorio, idEspecialidad) => {
  try {
    const response = await api.post('/usuarios/asignaciones', { // Cambiado de '/usuario' a '/usuarios'
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

export const getDoctorAsignaciones = async (idUsuario) => {
  try {
    const response = await api.get(`/usuarios/${idUsuario}/asignaciones`); // Cambiado de '/usuario' a '/usuarios'

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