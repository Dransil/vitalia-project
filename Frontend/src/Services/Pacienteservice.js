import api from './Api';


export const getPacientes = async () => {
  try {
    const response = await api.get('/pacientes');
    
    console.log('🔍 Respuesta del backend:', response);
    
    let pacientesArray = [];
    
    if (response.data && Array.isArray(response.data)) {
      pacientesArray = response.data;
    } else if (Array.isArray(response)) {
      pacientesArray = response;
    }

    console.log('✅ Pacientes procesados:', pacientesArray);
    
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Pacientes cargados',
      data: pacientesArray || [],
    };
  } catch (error) {
    console.error('❌ Error al obtener pacientes:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al cargar los pacientes',
      error: error.message,
      data: [],
    };
  }
};

export const searchPacientes = async (searchName = '', searchEmail = '', searchPhone = '') => {
  try {
    const response = await api.get('/pacientes');
    
    let pacientesArray = [];
    if (response.data && Array.isArray(response.data)) {
      pacientesArray = response.data;
    } else if (Array.isArray(response)) {
      pacientesArray = response;
    } else {
      return { ok: false, msg: 'Formato de datos inválido', data: [] };
    }

    if (!Array.isArray(pacientesArray)) {
      console.warn('pacientesArray no es un array:', pacientesArray);
      return { ok: false, msg: 'Formato de datos inválido', data: [] };
    }

    let pacientesFiltrados = pacientesArray;

    if (searchName) {
      pacientesFiltrados = pacientesFiltrados.filter(paciente => {
        if (!paciente) return false;
        const nombreCompleto = `${paciente.nombre || ''} ${paciente.apellido || ''}`.toLowerCase();
        return nombreCompleto.includes(searchName.toLowerCase());
      });
    }

    if (searchEmail) {
      pacientesFiltrados = pacientesFiltrados.filter(paciente =>
        paciente && paciente.email && paciente.email.toLowerCase().includes(searchEmail.toLowerCase())
      );
    }

    if (searchPhone) {
      pacientesFiltrados = pacientesFiltrados.filter(paciente =>
        paciente && paciente.telefono && paciente.telefono.includes(searchPhone)
      );
    }

    return {
      ok: true,
      data: pacientesFiltrados,
    };
  } catch (error) {
    console.error('Error al buscar pacientes:', error);
    return {
      ok: false,
      msg: 'Error al buscar los pacientes',
      error: error.message,
      data: [],
    };
  }
};

export const getPacienteById = async (id) => {
  try {
    const response = await api.get(`/pacientes/${id}`);
    
    if (response.data) {
      return { ok: true, data: response.data };
    }

    return { ok: false, msg: 'Paciente no encontrado', data: null };
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    return { ok: false, msg: 'Error al cargar el paciente', error: error.message, data: null };
  }
};


export const createPaciente = async (pacienteData) => {
  try {
    console.log('📤 Enviando datos al backend:', pacienteData);
    const response = await api.post('/pacientes', pacienteData);
    
    console.log('✅ Respuesta del backend:', response);
    
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Paciente creado exitosamente',
      data: response.data,
    };
  } catch (error) {
    console.error('❌ Error al crear paciente:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al crear el paciente',
      error: error.message,
      data: null,
    };
  }
};


export const updatePaciente = async (id, pacienteData) => {
  try {
    const response = await api.put(`/pacientes/${id}`, pacienteData);
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Paciente actualizado exitosamente',
      data: response.data,
    };
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    return {
      ok: false,
      msg: error.data?.msg || 'Error al actualizar el paciente',
      error: error.message,
      data: null,
    };
  }
};


export const cambiarEstadoPaciente = async (id) => {
  try {
    const response = await api.patch(`/pacientes/estado/${id}`);
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


export const deletePaciente = async (id) => {
  try {
    const response = await api.delete(`/pacientes/${id}`);
    return {
      ok: response.ok !== false,
      msg: response.msg || 'Paciente eliminado exitosamente',
    };
  } catch (error) {
    console.warn('DELETE no disponible, intentando cambiar estado...');
    return await cambiarEstadoPaciente(id);
  }
};

export default {
  getPacientes,
  searchPacientes,
  getPacienteById,
  createPaciente,
  updatePaciente,
  cambiarEstadoPaciente,
  deletePaciente,
};