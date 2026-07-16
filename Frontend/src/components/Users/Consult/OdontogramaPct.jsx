import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MdArrowBack, MdSave, MdHistory, MdPhone, MdEmail, MdClose,
  MdDelete, MdCheckCircle, MdWarning, MdPerson, MdCalendarToday,
  MdBloodtype, MdLocalHospital, MdErrorOutline,
} from 'react-icons/md';

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICIOS  — reemplaza con tus imports reales
// ═══════════════════════════════════════════════════════════════════════════════
// import pacienteService    from '../../../Services/pacienteService';
// import citaService        from '../../../Services/citaService';
// import historialService   from '../../../Services/historialService';
// import odontogramaService from '../../../Services/odontogramaService';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTES — alineadas con ENUMs de la BD
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * odontograma.estado  →  bien | con_caries | retirado | en_tratamiento | tratamiento_endodoncia
 */
const ESTADOS_DIENTE = {
  bien:                   { label: 'Sano',           color: '#22c55e' },
  con_caries:             { label: 'Caries',         color: '#ef4444' },
  en_tratamiento:         { label: 'En tratamiento', color: '#3b82f6' },
  tratamiento_endodoncia: { label: 'Endodoncia',     color: '#a855f7' },
  retirado:               { label: 'Retirado',       color: '#1e293b' },
};

/** Condiciones de superficie → se guardan en historial_dental.tratamiento_aplicado */
const CONDICIONES_SUPERFICIE = {
  caries:       { label: 'Caries',       color: '#ef4444' },
  restauracion: { label: 'Restauración', color: '#3b82f6' },
  pulpitis:     { label: 'Pulpitis',     color: '#a855f7' },
  fractura:     { label: 'Fractura',     color: '#f97316' },
  provisional:  { label: 'Provisional',  color: '#eab308' },
  corona:       { label: 'Corona',       color: '#ec4899' },
  protesis:     { label: 'Prótesis',     color: '#8b5cf6' },
};

const ALL_CONDITIONS = { ...ESTADOS_DIENTE, ...CONDICIONES_SUPERFICIE };

const SURFACES     = ['V', 'O', 'L', 'M', 'D'];
const SURFACE_LBLS = { V: 'Vestibular', O: 'Oclusal/Incisal', L: 'Lingual/Palatino', M: 'Mesial', D: 'Distal' };

// Numeración FDI completa (32 piezas)
const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
const UPPER_LEFT  = [21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_LEFT  = [31, 32, 33, 34, 35, 36, 37, 38];
const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];

const getToothType = n => {
  const u = n % 10;
  if (u === 8) return 'molar3';
  if (u >= 6)  return 'molar';
  if (u >= 4)  return 'premolar';
  if (u === 3) return 'canine';
  return 'incisor';
};

// ─── SVG helpers ──────────────────────────────────────────────────────────────
const dims  = type => ({ W: (type === 'incisor' || type === 'canine') ? 34 : 42, H: 56, crownH: 30 });
const zones = (W, crownH) => {
  const cx = W / 2;
  return {
    V: `M4,2 L${W-4},2 L${W-6},10 L6,10 Z`,
    L: `M6,${crownH-8} L${W-6},${crownH-8} L${W-4},${crownH} L4,${crownH} Z`,
    M: `M2,4 L8,10 L8,${crownH-6} L2,${crownH} Z`,
    D: `M${W-2},4 L${W-8},10 L${W-8},${crownH-6} L${W-2},${crownH} Z`,
    O: `M${cx},8 L${W-9},${crownH/2} L${cx},${crownH-6} L9,${crownH/2} Z`,
  };
};
const crownPath = (W, crownH) => `M3,3 Q${W/2},1 ${W-3},3 L${W-2},${crownH} L2,${crownH} Z`;
const rootPath  = (type, W, H, crownH) => {
  const cx = W / 2;
  return (type === 'molar' || type === 'molar3')
    ? `M6,${crownH} Q4,${crownH+8} 5,${H-4} Q${cx-2},${H+2} ${cx},${H-1} Q${cx+2},${H+2} ${W-5},${H-4} Q${W-4},${crownH+8} ${W-6},${crownH} Z`
    : `M7,${crownH} Q6,${crownH+10} 7,${H-3} Q${cx},${H+3} ${W-7},${H-3} Q${W-6},${crownH+10} ${W-7},${crownH} Z`;
};

// ═══════════════════════════════════════════════════════════════════════════════
// TOOTH CELL (grilla)
// ═══════════════════════════════════════════════════════════════════════════════
const ToothCell = ({ num, toothData, isUpper, isSelected, onClick }) => {
  const type   = getToothType(num);
  const { W, H, crownH } = dims(type);
  const zn     = zones(W, crownH);
  const crown  = crownPath(W, crownH);
  const root   = rootPath(type, W, H, crownH);
  const surfs  = toothData?.surfaces || {};
  const status = toothData?.status   || 'bien';
  const gone   = status === 'retirado';
  const statusColor = ESTADOS_DIENTE[status]?.color;

  const numEl = (
    <div style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, lineHeight: 1,
      padding: '2px 0', color: isSelected ? '#0ea5e9' : '#64748b', fontFamily: 'monospace' }}>
      {num}
    </div>
  );
  return (
    <div onClick={() => onClick(num)} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '2px 2px', borderRadius: 6, cursor: 'pointer', flexShrink: 0,
      background: isSelected ? '#f0f9ff' : 'transparent',
      border: `1.5px solid ${isSelected ? '#0ea5e9' : 'transparent'}`,
      transition: '0.1s',
    }}>
      {isUpper && numEl}
      <svg width={W} height={H+4} viewBox={`0 0 ${W} ${H+4}`}
        style={{ display: 'block', transform: isUpper ? 'none' : 'scaleY(-1)' }}>
        {!gone && <path d={root} fill="#f8e8e0" stroke="#d4a090" strokeWidth="0.8"/>}
        {!gone && <path d={crown} fill={statusColor ? statusColor + '18' : '#f8fafc'}
          stroke={isSelected ? '#0ea5e9' : '#94a3b8'} strokeWidth={isSelected ? 2 : 1.2}/>}
        {!gone && SURFACES.map(s => {
          const col = surfs[s] ? ALL_CONDITIONS[surfs[s]]?.color : null;
          return col ? <path key={s} d={zn[s]} fill={col} stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" opacity="0.85"/> : null;
        })}
        {!gone && status !== 'bien' && (
          <path d={crown} fill="none" stroke={statusColor} strokeWidth="2" opacity="0.55"/>
        )}
        {gone && (
          <>
            <line x1="5" y1="8" x2={W-5} y2={H-8} stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1={W-5} y1="8" x2="5" y2={H-8} stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round"/>
          </>
        )}
        {!gone && <path d={crown} fill="none" stroke={isSelected ? '#0ea5e9' : '#475569'} strokeWidth={isSelected ? 2.2 : 1}/>}
        {isSelected && !gone && <path d={crown} fill="#0ea5e920" stroke="none"/>}
      </svg>
      {!isUpper && numEl}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CUADRANTE
// ═══════════════════════════════════════════════════════════════════════════════
const Quadrant = ({ teeth, isUpper, reverse, label, toothData, selected, onSelect }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: reverse ? 'flex-end' : 'flex-start' }}>
    {isUpper && (
      <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', letterSpacing: '.1em',
        marginBottom: 4, textAlign: reverse ? 'right' : 'left', padding: reverse ? '0 4px 0 0' : '0 0 0 4px' }}>
        {label}
      </div>
    )}
    <div style={{ display: 'flex', flexDirection: reverse ? 'row-reverse' : 'row', gap: 2 }}>
      {teeth.map(n => (
        <ToothCell key={n} num={n} toothData={toothData[n]} isUpper={isUpper}
          isSelected={selected === n} onClick={onSelect}/>
      ))}
    </div>
    {!isUpper && (
      <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', letterSpacing: '.1em',
        marginTop: 4, textAlign: reverse ? 'right' : 'left', padding: reverse ? '0 4px 0 0' : '0 0 0 4px' }}>
        {label}
      </div>
    )}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MODAL EDITOR DE DIENTE
// ═══════════════════════════════════════════════════════════════════════════════
const ToothEditor = ({ num, toothData, onUpdate, onClose, primary }) => {
  const type  = getToothType(num);
  const { W, H, crownH } = dims(type);
  const zn    = zones(W, crownH);
  const crown = crownPath(W, crownH);
  const root  = rootPath(type, W, H, crownH);

  const [surfs,       setSurfs]       = useState(toothData?.surfaces || {});
  const [status,      setStatus]      = useState(toothData?.status   || 'bien');
  const [notes,       setNotes]       = useState(toothData?.notes    || '');
  const [activeCond,  setActiveCond]  = useState('caries');

  const isGone = status === 'retirado';

  const toggleSurf = (s) => {
    if (isGone) return;
    setSurfs(prev => { const n = { ...prev }; n[s] === activeCond ? delete n[s] : (n[s] = activeCond); return n; });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 3000,
      background: 'rgba(15,23,42,0.62)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 20, padding: '22px 24px', width: 450, maxWidth: '95vw',
        boxShadow: '0 32px 80px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0', animation: 'popIn .15s ease',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a' }}>Diente {num}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>
              {type.charAt(0).toUpperCase() + type.slice(1).replace('3', ' del juicio')} · FDI · click en zona para marcar
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex' }}>
            <MdClose size={18} color="#64748b"/>
          </button>
        </div>

        {/* Estado global → odontograma.estado */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 7 }}>
            Estado del diente <span style={{ color: '#cbd5e1', fontWeight: 400 }}>(odontograma.estado)</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {Object.entries(ESTADOS_DIENTE).map(([k, v]) => (
              <button key={k} onClick={() => setStatus(k)} style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                background: status === k ? v.color : '#f1f5f9',
                color: status === k ? '#fff' : '#475569',
                border: `2px solid ${status === k ? v.color : '#e2e8f0'}`,
                transition: '0.12s',
              }}>{v.label}</button>
            ))}
          </div>
        </div>

        {/* Condición de superficie → historial_dental.tratamiento_aplicado */}
        {!isGone && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 7 }}>
              Condición de superficie <span style={{ color: '#cbd5e1', fontWeight: 400 }}>(historial_dental)</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {Object.entries(CONDICIONES_SUPERFICIE).map(([k, v]) => (
                <button key={k} onClick={() => setActiveCond(k)} style={{
                  padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  background: activeCond === k ? v.color : '#f8fafc',
                  color: activeCond === k ? '#fff' : '#475569',
                  border: `2px solid ${activeCond === k ? v.color : '#e2e8f0'}`, transition: '0.12s',
                }}>{v.label}</button>
              ))}
            </div>
          </div>
        )}

        {/* Preview interactivo */}
        {!isGone && (
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#64748b' }}>Haz clic en zona</div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
                <svg width={W} height={H+4} viewBox={`0 0 ${W} ${H+4}`}>
                  <path d={root} fill="#f8e8e0" stroke="#d4a090" strokeWidth="0.8"/>
                  <path d={crown} fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5"/>
                  {SURFACES.map(s => {
                    const col = surfs[s] ? ALL_CONDITIONS[surfs[s]]?.color : null;
                    return (
                      <path key={s} d={zn[s]} fill={col || '#f1f5f9'} stroke={col ? 'rgba(0,0,0,0.2)' : '#d1d5db'}
                        strokeWidth="0.8" onClick={() => toggleSurf(s)} style={{ cursor: 'pointer' }}/>
                    );
                  })}
                  <path d={crown} fill="none" stroke="#475569" strokeWidth="1.5"/>
                </svg>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {SURFACES.map(s => {
                const cond = surfs[s];
                return (
                  <div key={s} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '5px 10px', borderRadius: 8,
                    background: cond ? ALL_CONDITIONS[cond].color + '15' : '#f8fafc',
                    border: `1px solid ${cond ? ALL_CONDITIONS[cond].color + '40' : '#e2e8f0'}`,
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>
                      <strong style={{ color: '#0f172a', marginRight: 5 }}>{s}</strong>{SURFACE_LBLS[s]}
                    </span>
                    {cond ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: ALL_CONDITIONS[cond].color }}>
                          {ALL_CONDITIONS[cond].label}
                        </span>
                        <button onClick={() => setSurfs(p => { const n={...p}; delete n[s]; return n; })}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#94a3b8' }}>
                          <MdClose size={12}/>
                        </button>
                      </div>
                    ) : <span style={{ fontSize: 11, color: '#cbd5e1' }}>—</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Notas del diente */}
        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Observaciones del diente (guardado en historial_dental)…"
          rows={2} style={{
            width: '100%', padding: '8px 12px', borderRadius: 8,
            border: '1px solid #e2e8f0', fontSize: 12, color: '#1e293b',
            background: '#f8fafc', outline: 'none', resize: 'vertical', fontFamily: 'inherit', marginBottom: 14,
          }}/>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => { setSurfs({}); setStatus('bien'); setNotes(''); }} style={{
            padding: '9px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600,
            background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 5,
          }}><MdDelete size={14}/> Limpiar</button>
          <button onClick={() => { onUpdate(num, { surfaces: surfs, status, notes }); onClose(); }} style={{
            flex: 1, padding: '9px', borderRadius: 10, fontSize: 13, fontWeight: 700,
            background: `linear-gradient(135deg,${primary},#14b8a6)`, color: '#fff', border: 'none', cursor: 'pointer',
          }}>Aplicar ✓</button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * Props:
 *   paciente  → objeto paciente (id_paciente, nombre, apellido, cedula, telefono, email, alergias, grupo_sanguineo…)
 *   cita      → objeto cita    (id_cita, id_tipo_cita, fecha_hora, notas_previa, estado…)
 *
 * Si no se pasan props, intenta cargar por useParams id.
 */
const OdontogramaPct = ({ paciente: pacienteProp, cita: citaProp }) => {
  const { id }   = useParams?.() || {};
  const navigate = useNavigate?.() || (() => {});

  // Tema
  let primary = '#0ea5e9', secondary = '#14b8a6';
  try {
    const { useTheme } = require('../../../Config/ThemeContext');
    const tc = useTheme() || {};
    primary   = tc?.config?.theme?.colors?.primary   || primary;
    secondary = tc?.config?.theme?.colors?.secondary || secondary;
  } catch {}

  // Estado
  const [paciente,   setPaciente]   = useState(pacienteProp || null);
  const [cita,       setCita]       = useState(citaProp     || null);
  const [loading,    setLoading]    = useState(!pacienteProp);
  const [loadError,  setLoadError]  = useState('');
  const [saving,     setSaving]     = useState(false);
  const [saveMsg,    setSaveMsg]    = useState('');   // '' | 'ok' | 'err'
  const [hasChanges, setHasChanges] = useState(false);

  // toothData: { [numFDI]: { status, surfaces: {V,O,L,M,D: condKey}, notes } }
  const [toothData,  setToothData]  = useState({});
  const [selected,   setSelected]   = useState(null);

  // Formulario historial
  const [diagnostico,         setDiagnostico]         = useState('');
  const [procedimientos,      setProcedimientos]       = useState('');
  const [observaciones,       setObservaciones]        = useState('');
  const [recomendaciones,     setRecomendaciones]      = useState('');
  const [requiereSeguimiento, setRequiereSeguimiento]  = useState(false);
  const [fechaControl,        setFechaControl]         = useState('');

  // Carga inicial
  useEffect(() => {
    if (pacienteProp) { setLoading(false); return; }
    if (!id) { setLoadError('ID no encontrado.'); setLoading(false); return; }
    (async () => {
      try {
        // const res = await pacienteService.obtenerPaciente(id);
        // if (res?.ok && res.data) {
        //   setPaciente(res.data);
        //   // Cargar odontograma guardado del paciente
        //   const odoRes = await odontogramaService.obtenerPorPaciente(id);
        //   if (odoRes?.ok && odoRes.data) {
        //     const map = {};
        //     odoRes.data.forEach(d => { map[d.numero_fdi] = { status: d.estado, surfaces: {}, notes: d.observaciones || '' }; });
        //     setToothData(map);
        //   }
        // } else setLoadError(res?.msg || 'Error al cargar paciente.');
      } catch { setLoadError('Error de conexión.'); }
      finally  { setLoading(false); }
    })();
  }, [id, pacienteProp]);

  const handleToothUpdate = useCallback((num, data) => {
    setToothData(prev => ({ ...prev, [num]: data }));
    setHasChanges(true);
  }, []);

  // ── GUARDAR ──────────────────────────────────────────────────────────────────
  /**
   * Flujo BD:
   * 1. PUT  cita.estado = 'completada'
   * 2. POST historial    { id_cita, diagnostico, procedimientos_realizados(JSON),
   *                        observaciones_clinicas, recomendaciones, requiere_seguimiento,
   *                        fecha_proximo_control, registrado_por }
   * 3. POST historial_dental[] por cada diente tocado
   *        { id_historial, numero_diente, estado_final, tratamiento_aplicado }
   * 4. UPSERT odontograma[] por cada diente
   *        { id_paciente, id_diente(por numero_fdi), estado, observaciones }
   */
  const handleSave = async () => {
    const pidStr = paciente?.id_paciente || id;
    if (!cita?.id_cita && !pidStr) {
      alert(`Sin cita activa.\nID paciente: ${pidStr || 'desconocido'}`);
      return;
    }

    setSaving(true); setSaveMsg('');
    try {
      const dientesModificados = Object.entries(toothData)
        .filter(([, d]) => d.status !== 'bien' || Object.keys(d.surfaces || {}).length > 0)
        .map(([num, d]) => ({
          numero_diente:       parseInt(num),
          estado_final:        d.status || 'bien',
          tratamiento_aplicado: Object.entries(d.surfaces || {})
            .map(([s, c]) => `${s}:${ALL_CONDITIONS[c]?.label || c}`)
            .join(', ') || null,
          observaciones: d.notes || null,
        }));

      const historialPayload = {
        id_cita:                   cita?.id_cita,
        diagnostico,
        procedimientos_realizados: JSON.stringify({ texto: procedimientos, dientes: dientesModificados }),
        observaciones_clinicas:    observaciones,
        recomendaciones,
        requiere_seguimiento:      requiereSeguimiento ? 1 : 0,
        fecha_proximo_control:     fechaControl || null,
        // registrado_por: /* id del usuario logueado */
      };

      const odontogramaPayload = Object.entries(toothData).map(([num, d]) => ({
        id_paciente:  parseInt(pidStr),
        numero_fdi:   parseInt(num),
        estado:       d.status || 'bien',
        observaciones: d.notes || null,
      }));

      console.log('📦 historial →', historialPayload);
      console.log('🦷 historial_dental →', dientesModificados);
      console.log('📋 odontograma →', odontogramaPayload);

      // ── Llamadas reales ──────────────────────────────────────────────────
      // await citaService.actualizarEstado(cita.id_cita, 'completada');
      // const hRes = await historialService.crear(historialPayload);
      // const id_historial = hRes.data.id_historial;
      // for (const d of dientesModificados) {
      //   await historialService.agregarDiente({ ...d, id_historial });
      // }
      // for (const o of odontogramaPayload) {
      //   await odontogramaService.upsert(o);
      // }

      await new Promise(r => setTimeout(r, 700)); // simulación

      setSaveMsg('ok');
      setHasChanges(false);
      setTimeout(() => setSaveMsg(''), 4500);
    } catch (e) {
      console.error(e);
      setSaveMsg('err');
    } finally {
      setSaving(false);
    }
  };

  // Contadores
  const allTeeth = [...UPPER_RIGHT, ...UPPER_LEFT, ...LOWER_LEFT, ...LOWER_RIGHT];
  const statsByEstado = Object.keys(ESTADOS_DIENTE).reduce((acc, k) => {
    acc[k] = allTeeth.filter(n => (toothData[n]?.status || 'bien') === k).length;
    return acc;
  }, {});

  // ── LOADING ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', border: `3px solid #e2e8f0`,
          borderTopColor: primary, animation: 'spin .8s linear infinite', margin: '0 auto' }}/>
        <p style={{ marginTop: 14, color: '#64748b', fontSize: 13 }}>Cargando odontograma…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  const sn      = 'S/N';
  const pNombre = paciente ? `${paciente.nombre} ${paciente.apellido}` : sn;

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif" }}>
      <style>{`
        @keyframes spin  { to { transform: rotate(360deg) } }
        @keyframes popIn { from { transform: scale(.88); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes up    { from { transform: translateY(8px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        * { box-sizing: border-box }
        textarea, input { font-family: inherit; }
        textarea { resize: vertical; }
      `}</style>

      {/* ══════════ HEADER ══════════════════════════════════════════════════ */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #e2e8f0',
        padding: '10px 20px', position: 'sticky', top: 0, zIndex: 200,
        boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate(-1)} style={{
            background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8,
            padding: '6px 8px', cursor: 'pointer', display: 'flex', color: '#64748b',
          }}><MdArrowBack size={19}/></button>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', lineHeight: 1 }}>Odontograma</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
              {pNombre}{paciente?.cedula ? ` · CI ${paciente.cedula}` : ''}
              {cita?.id_cita ? ` · Cita #${cita.id_cita}` : ''}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {saveMsg === 'ok' && (
            <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20,
              background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7',
              display: 'flex', alignItems: 'center', gap: 5 }}>
              <MdCheckCircle size={13}/>Guardado correctamente
            </span>
          )}
          {saveMsg === 'err' && (
            <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20,
              background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5',
              display: 'flex', alignItems: 'center', gap: 5 }}>
              <MdErrorOutline size={13}/>Error al guardar
            </span>
          )}
          {hasChanges && !saveMsg && (
            <span style={{ fontSize: 11, fontWeight: 600, color: '#b45309', background: '#fffbeb',
              padding: '3px 10px', borderRadius: 20, border: '1px solid #fde68a' }}>Sin guardar</span>
          )}

          {/* Botón ver historial */}
          <button
            onClick={() => alert(`Ver historial del paciente\nID: ${paciente?.id_paciente || id || sn}`)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 9, fontSize: 13, fontWeight: 600,
              background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', cursor: 'pointer',
            }}>
            <MdHistory size={15}/>Ver historial
          </button>

          {/* Guardar */}
          <button onClick={handleSave} disabled={saving} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 18px', borderRadius: 9, fontSize: 13, fontWeight: 700,
            background: `linear-gradient(135deg,${primary},${secondary})`,
            color: '#fff', border: 'none', cursor: saving ? 'wait' : 'pointer',
            boxShadow: `0 3px 10px ${primary}44`, opacity: saving ? 0.75 : 1, transition: '0.18s',
          }}>
            <MdSave size={15}/>{saving ? 'Guardando…' : 'Finalizar cita'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1020, margin: '0 auto', padding: '16px 14px 64px' }}>

        {/* ══════════ DATOS DEL PACIENTE ═══════════════════════════════════ */}
        <div style={{
          background: '#fff', borderRadius: 14, padding: '16px 20px',
          border: loadError ? '1px solid #fca5a5' : '1px solid #e2e8f0',
          marginBottom: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', animation: 'up .3s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>

            {/* Avatar + datos principales */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%', flexShrink: 0, fontSize: 22,
                background: `linear-gradient(135deg,${primary}18,${secondary}18)`,
                border: `2px solid ${primary}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>🦷</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, color: paciente ? '#0f172a' : '#94a3b8' }}>
                  {pNombre}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 3, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {paciente?.cedula && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MdPerson size={12} style={{ color: primary }}/> CI: {paciente.cedula}
                    </span>
                  )}
                  {paciente?.grupo_sanguineo && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MdBloodtype size={12} style={{ color: '#ef4444' }}/> {paciente.grupo_sanguineo}
                    </span>
                  )}
                  {paciente?.fecha_nacimiento && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MdCalendarToday size={12} style={{ color: '#64748b' }}/> {paciente.fecha_nacimiento}
                    </span>
                  )}
                </div>
                {loadError && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{loadError}</div>}
              </div>
            </div>

            {/* Contacto + info cita */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
              {paciente?.telefono && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#475569' }}>
                  <MdPhone size={14} style={{ color: primary }}/>{paciente.telefono}
                </span>
              )}
              {paciente?.email && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#475569' }}>
                  <MdEmail size={14} style={{ color: primary }}/>{paciente.email}
                </span>
              )}
              {cita && (
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600,
                  color: '#0369a1', background: '#e0f2fe', padding: '4px 10px', borderRadius: 20, border: '1px solid #bae6fd',
                }}>
                  <MdLocalHospital size={13}/>
                  {cita.tipo_cita || 'Consulta'}
                  {cita.fecha_hora ? ` — ${new Date(cita.fecha_hora).toLocaleString('es-BO', { dateStyle: 'short', timeStyle: 'short' })}` : ''}
                </span>
              )}
            </div>
          </div>

          {/* Motivo de la cita */}
          {(cita?.notas_previa || cita?.motivo) && (
            <div style={{
              marginTop: 12, padding: '10px 14px', borderRadius: 10,
              background: '#fffbeb', border: '1px solid #fde68a', fontSize: 13, color: '#78350f',
            }}>
              <span style={{ fontWeight: 700 }}>Motivo de la cita: </span>
              {cita.notas_previa || cita.motivo}
            </div>
          )}

          {/* Alergias */}
          {paciente?.alergias && (
            <div style={{
              marginTop: 10, padding: '8px 14px', borderRadius: 10,
              background: '#fff1f2', border: '1px solid #fecdd3',
              fontSize: 12, color: '#be123c', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <MdWarning size={14}/><strong>Alergias:</strong> {paciente.alergias}
            </div>
          )}
        </div>

        {/* ══════════ ODONTOGRAMA ══════════════════════════════════════════ */}
        <div style={{
          background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0',
          boxShadow: '0 2px 14px rgba(0,0,0,0.07)', overflow: 'hidden', marginBottom: 14, animation: 'up .4s ease',
        }}>
          {/* Título */}
          <div style={{ padding: '12px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>🦷 Odontograma · Dentición Permanente</span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>FDI · 32 piezas · click en diente para editar</span>
          </div>

          {/* Leyenda */}
          <div style={{ padding: '8px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', background: '#fafcff' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em' }}>Estado:</span>
            {Object.entries(ESTADOS_DIENTE).map(([k, v]) => (
              <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#475569' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: v.color, display: 'inline-block' }}/>
                {v.label} <span style={{ color: '#94a3b8', fontWeight: 400 }}>({statsByEstado[k] || 0})</span>
              </span>
            ))}
          </div>

          {/* Grilla */}
          <div style={{ padding: '14px 8px 18px', overflowX: 'auto' }}>
            {/* Superior */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 0, marginBottom: 2 }}>
              <Quadrant teeth={UPPER_RIGHT} isUpper={true}  reverse={true}  label="CUAD. I"   toothData={toothData} selected={selected} onSelect={setSelected}/>
              <div style={{ width: 2, height: 88, background: '#e2e8f0', margin: '0 8px', borderRadius: 1, alignSelf: 'center' }}/>
              <Quadrant teeth={UPPER_LEFT}  isUpper={true}  reverse={false} label="CUAD. II"  toothData={toothData} selected={selected} onSelect={setSelected}/>
            </div>

            {/* D / E */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '4px 0' }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#cbd5e1', fontFamily: 'monospace' }}>D</span>
              <div style={{ flex: 1, maxWidth: 500, height: 1, background: '#e2e8f0' }}/>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#cbd5e1', fontFamily: 'monospace' }}>E</span>
            </div>

            {/* Inferior */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 0, marginTop: 2 }}>
              <Quadrant teeth={LOWER_RIGHT} isUpper={false} reverse={true}  label="CUAD. IV"  toothData={toothData} selected={selected} onSelect={setSelected}/>
              <div style={{ width: 2, height: 88, background: '#e2e8f0', margin: '0 8px', borderRadius: 1, alignSelf: 'center' }}/>
              <Quadrant teeth={LOWER_LEFT}  isUpper={false} reverse={false} label="CUAD. III" toothData={toothData} selected={selected} onSelect={setSelected}/>
            </div>
          </div>

          {/* Resumen pie */}
          <div style={{ borderTop: '1px solid #f1f5f9', padding: '8px 18px', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', background: '#f8fafc' }}>
            {Object.entries(ESTADOS_DIENTE).filter(([k]) => (statsByEstado[k] || 0) > 0).map(([k, v]) => (
              <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b' }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: v.color }}/>
                {v.label}: <strong>{statsByEstado[k]}</strong>
              </span>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: 11, color: '#94a3b8' }}>Total: 32 piezas (FDI)</span>
          </div>
        </div>

        {/* ══════════ REGISTRO CLÍNICO → historial ════════════════════════ */}
        <div style={{
          background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0',
          boxShadow: '0 1px 6px rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: 14, animation: 'up .5s ease',
        }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>📋 Registro Clínico</span>
            <code style={{ fontSize: 10, background: '#f1f5f9', borderRadius: 5, padding: '2px 7px', color: '#64748b' }}>→ historial</code>
          </div>
          <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Diagnóstico (Dx)', val: diagnostico, set: setDiagnostico, ph: 'Diagnóstico clínico…' },
              { label: 'Tratamiento realizado (Tx)', val: procedimientos, set: setProcedimientos, ph: 'Describe los procedimientos realizados…' },
              { label: 'Observaciones clínicas', val: observaciones, set: setObservaciones, ph: 'Observaciones…' },
              { label: 'Recomendaciones al paciente', val: recomendaciones, set: setRecomendaciones, ph: 'Indicaciones post-consulta…' },
            ].map(({ label, val, set, ph }) => (
              <div key={label}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 5 }}>{label}</div>
                <textarea value={val} onChange={e => { set(e.target.value); setHasChanges(true); }}
                  placeholder={ph} rows={2} style={{
                    width: '100%', padding: '8px 12px', borderRadius: 8,
                    border: '1px solid #e2e8f0', fontSize: 13, color: '#1e293b', background: '#f8fafc', outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = primary}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}/>
              </div>
            ))}

            {/* Seguimiento */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                <input type="checkbox" checked={requiereSeguimiento}
                  onChange={e => { setRequiereSeguimiento(e.target.checked); setHasChanges(true); }}
                  style={{ width: 16, height: 16, accentColor: primary }}/>
                Requiere seguimiento
              </label>
              {requiereSeguimiento && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Próximo control:</label>
                  <input type="date" value={fechaControl}
                    onChange={e => { setFechaControl(e.target.value); setHasChanges(true); }}
                    style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, color: '#1e293b', background: '#f8fafc', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = primary}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}/>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══════════ FINALIZAR CITA ════════════════════════════════════════ */}
        <div style={{
          background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0',
          boxShadow: '0 1px 6px rgba(0,0,0,0.05)', padding: '18px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          animation: 'up .6s ease',
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>¿Listo para finalizar la cita?</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
              Guardará en <code style={{ background: '#f1f5f9', borderRadius: 4, padding: '0 4px', fontSize: 11 }}>historial</code>,{' '}
              <code style={{ background: '#f1f5f9', borderRadius: 4, padding: '0 4px', fontSize: 11 }}>historial_dental</code> y{' '}
              <code style={{ background: '#f1f5f9', borderRadius: 4, padding: '0 4px', fontSize: 11 }}>odontograma</code>.
              La cita pasará a estado <strong>completada</strong>.
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 28px', borderRadius: 11, fontSize: 14, fontWeight: 800,
            background: saving ? '#e2e8f0' : `linear-gradient(135deg,${primary},${secondary})`,
            color: saving ? '#94a3b8' : '#fff', border: 'none',
            cursor: saving ? 'wait' : 'pointer',
            boxShadow: saving ? 'none' : `0 4px 16px ${primary}50`, transition: '0.2s',
          }}>
            <MdCheckCircle size={18}/>
            {saving ? 'Guardando…' : 'Guardar y finalizar cita'}
          </button>
        </div>

      </div>

      {/* ══════════ MODAL EDITOR DIENTE ══════════════════════════════════════ */}
      {selected && (
        <ToothEditor
          num={selected}
          toothData={toothData[selected]}
          onUpdate={handleToothUpdate}
          onClose={() => setSelected(null)}
          primary={primary}
        />
      )}
    </div>
  );
};

export default OdontogramaPct;