import api from './Api';

const usuarioService = {
  crearUsuario: async (usuarioData) => {
    try {
      const requiredFields = ['nombre', 'apellido', 'email', 'cedula', 'contraseña_hash'];
      const missingFields = requiredFields.filter(field => !usuarioData?.[field]);
      if (missingFields.length > 0) return { ok: false, msg: `Faltan campos requeridos: ${missingFields.join(', ')}` };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuarioData.email)) return { ok: false, msg: 'El formato del email no es válido' };

      const response = await api.post('/usuarios', usuarioData);
      let resultData = response?.data || response?.usuario || (response?.id_usuario || response?.id ? response : null);
      return { ok: response?.ok !== false, data: resultData, msg: response?.msg || 'Usuario creado exitosamente' };
    } catch (error) {
      return { ok: false, msg: error?.data?.msg || error?.message || 'Error al crear usuario', error: error?.message };
    }
  },

  crearDoctor: async (doctorData) => {
    try {
      const dataWithRole = { ...doctorData, rol: doctorData.rol || 'medico', estado: doctorData.estado || 'activo' };

      // Validación usa los nombres del payload final (horario_id según BD)
      const requiredDoctorFields = [
        'nombre', 'apellido', 'email', 'cedula', 'telefono',
        'contraseña_hash', 'id_especialidad', 'id_consultorio',
        'horario_id',       // ✅ nombre correcto según BD
        'dias_atencion'
      ];

      const missingFields = requiredDoctorFields.filter(field => !dataWithRole?.[field]);
      if (missingFields.length > 0) return { ok: false, msg: `Faltan campos requeridos: ${missingFields.join(', ')}` };

      const response = await api.post('/usuarios', dataWithRole);
      let resultData = response?.data || response?.usuario || (response?.id_usuario || response?.id ? response : null);
      return { ok: response?.ok !== false, data: resultData, msg: response?.msg || 'Doctor creado exitosamente' };
    } catch (error) {
      return { ok: false, msg: error?.data?.msg || error?.message || 'Error al crear doctor', error: error?.message };
    }
  },

  listarUsuarios: async () => {
    try {
      const response = await api.get('/usuarios');
      let usuarios = response?.data || response?.usuarios || (Array.isArray(response) ? response : []);
      return { ok: true, data: Array.isArray(usuarios) ? usuarios : [], msg: response?.msg || 'Usuarios obtenidos exitosamente' };
    } catch (error) {
      return { ok: false, msg: error?.data?.msg || error?.message || 'Error al obtener usuarios', data: [] };
    }
  },

  listarDoctores: async () => {
    try {
      const response = await api.get('/usuarios?rol=medico');
      let doctores = response?.data || response?.usuarios || (Array.isArray(response) ? response : []);
      return { ok: true, data: Array.isArray(doctores) ? doctores : [], msg: response?.msg || 'Doctores obtenidos exitosamente' };
    } catch (error) {
      return { ok: false, msg: error?.data?.msg || error?.message || 'Error al obtener doctores', data: [] };
    }
  },

  obtenerUsuario: async (id) => {
    try {
      if (!id) return { ok: false, msg: 'ID de usuario es requerido' };
      const response = await api.get(`/usuarios/${id}`);
      let usuario = response?.data || response?.usuario || (response?.id_usuario || response?.id ? response : null);
      if (!usuario) return { ok: false, msg: 'Usuario no encontrado' };
      return { ok: true, data: usuario, msg: response?.msg || 'Usuario obtenido exitosamente' };
    } catch (error) {
      return { ok: false, msg: error?.data?.msg || error?.message || 'Error al obtener usuario' };
    }
  },

  actualizarUsuario: async (id, usuarioData) => {
    try {
      if (!id) return { ok: false, msg: 'ID de usuario es requerido' };
      const response = await api.put(`/usuarios/${id}`, usuarioData);
      return { ok: response?.ok !== false, data: response?.data || response?.usuario || response, msg: response?.msg || 'Usuario actualizado exitosamente' };
    } catch (error) {
      return { ok: false, msg: error?.data?.msg || error?.message || 'Error al actualizar usuario' };
    }
  },

  cambiarEstadoUsuario: async (id, nuevoEstado = 'inactivo') => {
    try {
      if (!id) return { ok: false, msg: 'ID de usuario es requerido' };
      const response = await api.patch(`/usuarios/estado/${id}`, { estado: nuevoEstado }); // ✅ ruta correcta
      return {
        ok: response?.ok !== false,
        data: response?.data || response,
        msg: response?.msg || `Usuario ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'} exitosamente`
      };
    } catch (error) {
      return { ok: false, msg: error?.data?.msg || error?.message || 'Error al cambiar estado del usuario' };
    }
  },

  eliminarUsuario: async (id) => {
    try {
      if (!id) return { ok: false, msg: 'ID de usuario es requerido' };
      const response = await api.delete(`/usuarios/${id}`);
      return { ok: response?.ok !== false, data: response?.data || response, msg: response?.msg || 'Usuario eliminado exitosamente' };
    } catch (error) {
      return await usuarioService.cambiarEstadoUsuario(id, 'inactivo');
    }
  },

  obtenerHorarios: async () => {
    try {
      const response = await api.get('/horarios');
      let horarios = response?.data || response?.horarios || (Array.isArray(response) ? response : []);
      return { ok: true, data: Array.isArray(horarios) ? horarios : [], msg: response?.msg || 'Horarios obtenidos exitosamente' };
    } catch (error) {
      return { ok: false, msg: error?.data?.msg || error?.message || 'Error al obtener horarios', data: [] };
    }
  },

  obtenerEspecialidades: async () => {
    try {
      const response = await api.get('/especialidades');
      let especialidades = response?.data || response?.especialidades || (Array.isArray(response) ? response : []);
      return { ok: true, data: Array.isArray(especialidades) ? especialidades : [], msg: response?.msg || 'Especialidades obtenidas exitosamente' };
    } catch (error) {
      return { ok: false, msg: error?.data?.msg || error?.message || 'Error al obtener especialidades', data: [] };
    }
  },

  obtenerConsultorios: async () => {
    try {
      const response = await api.get('/consultorios');
      let consultorios = response?.data || response?.consultorios || (Array.isArray(response) ? response : []);
      return { ok: true, data: Array.isArray(consultorios) ? consultorios : [], msg: response?.msg || 'Consultorios obtenidos exitosamente' };
    } catch (error) {
      return { ok: false, msg: error?.data?.msg || error?.message || 'Error al obtener consultorios', data: [] };
    }
  }
};

export default usuarioService;