import api from './Api';

const usuarioService = {
  /**
   * Crear un nuevo usuario
   */
  crearUsuario: async (usuarioData) => {
    try {
      const response = await api.post('/usuarios', usuarioData);
      return {
        ok: true,
        data: response,
        msg: 'Usuario creado exitosamente'
      };
    } catch (error) {
      return {
        ok: false,
        msg: error.message
      };
    }
  },
  
  /**
   * Listar todos los usuarios
   */
  listarUsuarios: async () => {
    try {
      const response = await api.get('/usuarios');
      return {
        ok: true,
        data: response.usuarios || response,
        msg: 'Usuarios obtenidos exitosamente'
      };
    } catch (error) {
      return {
        ok: false,
        msg: error.message
      };
    }
  },
  
  /**
   * Obtener usuario por ID
   */
  obtenerUsuario: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return {
        ok: true,
        data: response.usuario || response,
        msg: 'Usuario obtenido exitosamente'
      };
    } catch (error) {
      return {
        ok: false,
        msg: error.message
      };
    }
  },
  
  /**
   * Actualizar usuario
   */
  actualizarUsuario: async (id, usuarioData) => {
    try {
      const response = await api.put(`/usuarios/${id}`, usuarioData);
      return {
        ok: true,
        data: response,
        msg: 'Usuario actualizado exitosamente'
      };
    } catch (error) {
      return {
        ok: false,
        msg: error.message
      };
    }
  },
  
  /**
   * Eliminar usuario (cambiar estado a inactivo)
   */
  eliminarUsuario: async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return {
        ok: true,
        data: response,
        msg: 'Usuario eliminado exitosamente'
      };
    } catch (error) {
      return {
        ok: false,
        msg: error.message
      };
    }
  }
};

export default usuarioService;