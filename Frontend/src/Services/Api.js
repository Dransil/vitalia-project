// Api.js - Se mantiene igual
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/vitalia';

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error(data.msg || 'Error en la petición');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};

const api = {
  get: async (endpoint, requiresAuth = true) => {
    const headers = { 'Content-Type': 'application/json' };
    
    if (requiresAuth) {
      const token = getAuthToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers
    });
    
    return handleResponse(response);
  },
  
  post: async (endpoint, data, requiresAuth = true) => {
    const headers = { 'Content-Type': 'application/json' };
    
    if (requiresAuth) {
      const token = getAuthToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    
    return handleResponse(response);
  },
  
  put: async (endpoint, data, requiresAuth = true) => {
    const headers = { 'Content-Type': 'application/json' };
    
    if (requiresAuth) {
      const token = getAuthToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    
    return handleResponse(response);
  },
  
  patch: async (endpoint, data = {}, requiresAuth = true) => {
    const headers = { 'Content-Type': 'application/json' };
    
    if (requiresAuth) {
      const token = getAuthToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data)
    });
    
    return handleResponse(response);
  },
  
  delete: async (endpoint, requiresAuth = true) => {
    const headers = { 'Content-Type': 'application/json' };
    
    if (requiresAuth) {
      const token = getAuthToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers
    });
    
    return handleResponse(response);
  }
};

export default api;