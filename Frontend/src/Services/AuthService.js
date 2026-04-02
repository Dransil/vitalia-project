// Servicio de autenticación
const API_URL = 'http://localhost:3000/vitalia/auth';

// Guardar token en localStorage
const saveToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Obtener token
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Eliminar token
const removeToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// Guardar usuario
const saveUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Obtener usuario
const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Login
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        msg: data.msg || 'Error en el login',
      };
    }

    // Guardar token y usuario
    saveToken(data.token);
    saveUser(data.usuario);

    return {
      ok: true,
      msg: data.msg,
      usuario: data.usuario,
      token: data.token,
    };
  } catch (error) {
    console.error('Error en login:', error);
    return {
      ok: false,
      msg: 'Error de conexión con el servidor',
      error: error.message,
    };
  }
};

// Registro de nuevo usuario
export const register = async (formData) => {
  try {
    // Dividir nombre completo en nombre y apellido
    const nameParts = formData.fullName.trim().split(' ');
    const nombre = nameParts[0];
    const apellido = nameParts.slice(1).join(' ') || '';

    const userData = {
      nombre,
      apellido,
      email: formData.email,
      contraseña_hash: formData.password,
      // Estos campos son requeridos en el modelo pero pueden tener valores por defecto
      cedula: '', // Se debe obtener del usuario o backend
      id_especialidad: 1, // Por defecto
      id_consultorio: 1, // Por defecto
      rol: 'dentista', // Por defecto
    };

    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        msg: data.msg || 'Error en el registro',
      };
    }

    return {
      ok: true,
      msg: data.msg || 'Usuario registrado exitosamente',
      usuario: data.usuario,
    };
  } catch (error) {
    console.error('Error en registro:', error);
    return {
      ok: false,
      msg: 'Error de conexión con el servidor',
      error: error.message,
    };
  }
};

// Logout
export const logout = () => {
  removeToken();
};

// Verificar si está autenticado
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// Obtener headers con token
export const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export default {
  login,
  register,
  logout,
  isAuthenticated,
  getToken,
  getUser,
  getAuthHeaders,
};