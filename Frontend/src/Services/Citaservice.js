import api from './Api';

// ── Obtener todas las citas ──────────────────────────────────────────────────
export const getCitas = async () => {
  try {
    const response = await api.get('/citas');
    const arr = response?.data || (Array.isArray(response) ? response : []);
    return { ok: true, data: Array.isArray(arr) ? arr : [], msg: response?.msg || 'Citas obtenidas' };
  } catch (error) {
    return { ok: false, msg: error?.data?.msg || 'Error al obtener citas', data: [] };
  }
};

// ── Obtener cita por ID ──────────────────────────────────────────────────────
export const getCitaById = async (id) => {
  try {
    const response = await api.get(`/citas/${id}`);
    return { ok: true, data: response?.data || null, msg: response?.msg || 'Cita obtenida' };
  } catch (error) {
    return { ok: false, msg: error?.data?.msg || 'Error al obtener la cita', data: null };
  }
};
export const getCitasByDoctor = async (idDoctor) => {
  try {
    if (!idDoctor) return { ok: false, msg: 'ID de doctor requerido', data: [] };
    const response = await api.get(`/citas/doctor/${idDoctor}`);
    const arr = response?.data || (Array.isArray(response) ? response : []);
    return { ok: response?.ok !== false, data: Array.isArray(arr) ? arr : [], msg: response?.msg || 'Citas obtenidas' };
  } catch (error) {
    // Si el error es 404 significa simplemente que no hay citas, no es un error grave
    if (error?.status === 404) return { ok: true, data: [], msg: 'Sin citas registradas' };
    return { ok: false, msg: error?.data?.msg || 'Error al obtener citas del doctor', data: [] };
  }
};

// ── Obtener citas por paciente ───────────────────────────────────────────────
export const getCitasByPaciente = async (idPaciente) => {
  try {
    if (!idPaciente) return { ok: false, msg: 'ID de paciente requerido', data: [] };
    const response = await api.get(`/citas/paciente/${idPaciente}`);
    const arr = response?.data || (Array.isArray(response) ? response : []);
    return { ok: response?.ok !== false, data: Array.isArray(arr) ? arr : [], msg: response?.msg || 'Citas obtenidas' };
  } catch (error) {
    if (error?.status === 404) return { ok: true, data: [], msg: 'Sin citas registradas' };
    return { ok: false, msg: error?.data?.msg || 'Error al obtener citas del paciente', data: [] };
  }
};

export const createCita = async (citaData) => {
  try {
    const required = ['id_usuario', 'id_paciente', 'id_tipo_cita', 'fecha_hora'];
    const missing  = required.filter(f => !citaData?.[f]);
    if (missing.length > 0) return { ok: false, msg: `Faltan campos requeridos: ${missing.join(', ')}` };

    const payload = {
      id_usuario:       parseInt(citaData.id_usuario),
      id_paciente:      parseInt(citaData.id_paciente),
      id_tipo_cita:     parseInt(citaData.id_tipo_cita),
      fecha_hora:       citaData.fecha_hora,
      duracion_minutos: citaData.duracion_minutos   || null,
      notas_previa:     citaData.notas_previa        || null,
      estado:           citaData.estado              || 'programada',
    };

    const response = await api.post('/citas', payload);
    return {
      ok:   response?.ok !== false,
      data: response?.data || null,
      msg:  response?.msg  || 'Cita creada exitosamente',
    };
  } catch (error) {
    return { ok: false, msg: error?.data?.msg || error?.message || 'Error al crear la cita', data: null };
  }
};

// ── Crear múltiples citas (un bloque contiguo = una cita) ────────────────────
// Recibe un array de citaData y los crea en paralelo
export const createCitas = async (citasArray) => {
  try {
    const resultados = await Promise.all(citasArray.map(c => createCita(c)));
    const fallidos   = resultados.filter(r => !r.ok);
    if (fallidos.length > 0) {
      return { ok: false, msg: `${fallidos.length} cita(s) no se pudieron crear`, data: resultados };
    }
    return { ok: true, data: resultados.map(r => r.data), msg: 'Citas creadas exitosamente' };
  } catch (error) {
    return { ok: false, msg: error?.message || 'Error al crear las citas', data: [] };
  }
};

// ── Actualizar cita ──────────────────────────────────────────────────────────
export const updateCita = async (id, citaData) => {
  try {
    if (!id) return { ok: false, msg: 'ID de cita requerido' };
    const response = await api.put(`/citas/${id}`, citaData);
    return {
      ok:   response?.ok !== false,
      data: response?.data || null,
      msg:  response?.msg  || 'Cita actualizada exitosamente',
    };
  } catch (error) {
    return { ok: false, msg: error?.data?.msg || error?.message || 'Error al actualizar la cita' };
  }
};

// ── Cambiar estado de cita ───────────────────────────────────────────────────
// estados válidos: 'programada' | 'confirmada' | 'en_espera' | 'completada' | 'cancelada' | 'no_asistio'
export const cambiarEstadoCita = async (id, estado, razon_cancelacion = null) => {
  try {
    if (!id)     return { ok: false, msg: 'ID de cita requerido' };
    if (!estado) return { ok: false, msg: 'Estado requerido' };

    const payload = { estado };
    if (estado === 'cancelada' && razon_cancelacion) {
      payload.razon_cancelacion = razon_cancelacion;
    }

    const response = await api.patch(`/citas/estado/${id}`, payload);
    return {
      ok:  response?.ok !== false,
      msg: response?.msg || `Estado actualizado a '${estado}'`,
    };
  } catch (error) {
    return { ok: false, msg: error?.data?.msg || error?.message || 'Error al cambiar estado' };
  }
};

// ── Helper: obtener id del doctor logueado ───────────────────────────────────
export const getDoctorIdFromStorage = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.id_usuario || user?.id || null;
  } catch {
    return null;
  }
};

export default {
  getCitas,
  getCitaById,
  getCitasByDoctor,
  getCitasByPaciente,
  createCita,
  createCitas,
  updateCita,
  cambiarEstadoCita,
  getDoctorIdFromStorage,
};