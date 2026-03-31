import api from './Api';

const authService = {
  /**
   * Iniciar sesión
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password }, false);
      
      if (response.ok) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.usuario));
      }
      
      return response;
    } catch (error) {
      return {
        ok: false,
        msg: error.message
      };
    }
  },
  
  /**
   * Cerrar sesión
   */
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  
  /**
   * Obtener usuario actual
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  /**
   * Verificar si está autenticado
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
  
  /**
   * Obtener token
   */
  getToken: () => {
    return localStorage.getItem('authToken');
  }
};

export default authService;