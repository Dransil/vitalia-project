// usuarioService.js - CORREGIDO
import api from './Api';

const usuarioService = {
  /**
   * Crear un nuevo usuario
   * POST /vitalia/usuarios
   */
  crearUsuario: async (usuarioData) => {
    try {
      // Validar campos requeridos según tu tabla `usuario`
      const requiredFields = ['nombre', 'apellido', 'email', 'cedula', 'contraseña_hash'];
      const missingFields = requiredFields.filter(field => !usuarioData[field]);
      
      if (missingFields.length > 0) {
        return {
          ok: false,
          msg: `Faltan campos requeridos: ${missingFields.join(', ')}`
        };
      }

      const response = await api.post('/usuarios', usuarioData);
      
      return {
        ok: true,
        data: response.data || response.usuario || response,
        msg: response.msg || 'Usuario creado exitosamente'
      };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return {
        ok: false,
        msg: error.data?.msg || error.message || 'Error al crear usuario'
      };
    }
  },
  
  /**
   * Listar todos los usuarios
   * GET /vitalia/usuarios
   */
  listarUsuarios: async () => {
    try {
      const response = await api.get('/usuarios');
      
      // Normalizar la respuesta
      let usuarios = [];
      if (response.data && Array.isArray(response.data)) {
        usuarios = response.data;
      } else if (response.usuarios && Array.isArray(response.usuarios)) {
        usuarios = response.usuarios;
      } else if (Array.isArray(response)) {
        usuarios = response;
      }
      
      return {
        ok: true,
        data: usuarios,
        msg: response.msg || 'Usuarios obtenidos exitosamente'
      };
    } catch (error) {
      console.error('Error al listar usuarios:', error);
      return {
        ok: false,
        msg: error.data?.msg || error.message || 'Error al obtener usuarios',
        data: []
      };
    }
  },
  
  /**
   * Obtener usuario por ID
   * GET /vitalia/usuarios/:id
   */
  obtenerUsuario: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      
      let usuario = null;
      if (response.data) {
        usuario = response.data;
      } else if (response.usuario) {
        usuario = response.usuario;
      } else if (response.id_usuario || response.id) {
        usuario = response;
      }
      
      if (!usuario) {
        return {
          ok: false,
          msg: 'Usuario no encontrado'
        };
      }
      
      return {
        ok: true,
        data: usuario,
        msg: response.msg || 'Usuario obtenido exitosamente'
      };
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return {
        ok: false,
        msg: error.data?.msg || error.message || 'Error al obtener usuario'
      };
    }
  },
  
  /**
   * Actualizar usuario
   * PUT /vitalia/usuarios/:id
   */
  actualizarUsuario: async (id, usuarioData) => {
    try {
      const response = await api.put(`/usuarios/${id}`, usuarioData);
      
      return {
        ok: true,
        data: response.data || response.usuario || response,
        msg: response.msg || 'Usuario actualizado exitosamente'
      };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return {
        ok: false,
        msg: error.data?.msg || error.message || 'Error al actualizar usuario'
      };
    }
  },
  
  /**
   * Cambiar estado de usuario (activar/desactivar)
   * PATCH /vitalia/usuarios/:id
   */
  cambiarEstadoUsuario: async (id, nuevoEstado) => {
    try {
      const response = await api.patch(`/usuarios/${id}`, { estado: nuevoEstado });
      
      return {
        ok: true,
        data: response,
        msg: response.msg || `Usuario ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'} exitosamente`
      };
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      return {
        ok: false,
        msg: error.data?.msg || error.message || 'Error al cambiar estado del usuario'
      };
    }
  },
  
  /**
   * Eliminar usuario (soft delete - cambiar estado a inactivo)
   * DELETE /vitalia/usuarios/:id
   */
  eliminarUsuario: async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      
      return {
        ok: true,
        data: response,
        msg: response.msg || 'Usuario eliminado exitosamente'
      };
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      
      // Si DELETE falla, intentar cambiar estado a inactivo
      console.warn('DELETE no disponible, intentando cambiar estado...');
      return await usuarioService.cambiarEstadoUsuario(id, 'inactivo');
    }
  },
  
  /**
   * Obtener horarios disponibles (de la tabla horario)
   * GET /vitalia/horarios
   */
  obtenerHorarios: async () => {
    try {
      const response = await api.get('/horarios');
      
      let horarios = [];
      if (response.data && Array.isArray(response.data)) {
        horarios = response.data;
      } else if (response.horarios && Array.isArray(response.horarios)) {
        horarios = response.horarios;
      } else if (Array.isArray(response)) {
        horarios = response;
      }
      
      return {
        ok: true,
        data: horarios,
        msg: response.msg || 'Horarios obtenidos exitosamente'
      };
    } catch (error) {
      console.error('Error al obtener horarios:', error);
      return {
        ok: false,
        msg: error.data?.msg || error.message || 'Error al obtener horarios',
        data: []
      };
    }
  },
  
  /**
   * Obtener especialidades disponibles
   * GET /vitalia/especialidades
   */
  obtenerEspecialidades: async () => {
    try {
      const response = await api.get('/especialidades');
      
      let especialidades = [];
      if (response.data && Array.isArray(response.data)) {
        especialidades = response.data;
      } else if (response.especialidades && Array.isArray(response.especialidades)) {
        especialidades = response.especialidades;
      } else if (Array.isArray(response)) {
        especialidades = response;
      }
      
      return {
        ok: true,
        data: especialidades,
        msg: response.msg || 'Especialidades obtenidas exitosamente'
      };
    } catch (error) {
      console.error('Error al obtener especialidades:', error);
      return {
        ok: false,
        msg: error.data?.msg || error.message || 'Error al obtener especialidades',
        data: []
      };
    }
  },
  
  /**
   * Obtener consultorios disponibles
   * GET /vitalia/consultorios
   */
  obtenerConsultorios: async () => {
    try {
      const response = await api.get('/consultorios');
      
      let consultorios = [];
      if (response.data && Array.isArray(response.data)) {
        consultorios = response.data;
      } else if (response.consultorios && Array.isArray(response.consultorios)) {
        consultorios = response.consultorios;
      } else if (Array.isArray(response)) {
        consultorios = response;
      }
      
      return {
        ok: true,
        data: consultorios,
        msg: response.msg || 'Consultorios obtenidos exitosamente'
      };
    } catch (error) {
      console.error('Error al obtener consultorios:', error);
      return {
        ok: false,
        msg: error.data?.msg || error.message || 'Error al obtener consultorios',
        data: []
      };
    }
  }
};

export default usuarioService;