import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../../../Config/ThemeContext';
import { MdChevronLeft, MdChevronRight, MdCalendarToday, MdAdd, MdClose, MdEventNote } from 'react-icons/md';
import api from '../../../../Services/Api';

// ─── Defaults ─────────────────────────────────────────────────────────────────
const DC = {
  neutral: { 0:'#fff',50:'#f9fafb',100:'#f3f4f6',200:'#e5e7eb',300:'#d1d5db',400:'#9ca3af',500:'#6b7280',600:'#4b5563',700:'#374151',800:'#1f2937',900:'#111827' },
  success: { light:'#d1fae5', main:'#10b981', dark:'#059669' },
  error:   { light:'#fee2e2', main:'#dc2626', dark:'#991b1b' },
};
const DCFG = { theme: { colors: { primary:'#0ea5e9', secondary:'#14b8a6' } } };
const DSP  = { xs:'4px', sm:'8px', md:'16px', lg:'24px', xl:'32px' };
const DBR  = { sm:'4px', md:'6px', lg:'8px', xl:'12px', full:'9999px' };
const DSH  = { sm:'0 1px 2px rgba(0,0,0,0.05)', md:'0 4px 6px -1px rgba(0,0,0,0.08)' };

// Tamaños de fuente con fallback seguro
const fs = (typo, key) => {
  try { return typo?.fontSize?.[key]?.size || ({ xs:'11px', sm:'13px', md:'15px', lg:'18px', xl:'20px', '2xl':'24px' }[key] || '14px'); }
  catch { return '14px'; }
};
const fw = (typo, key) => {
  try { return typo?.fontWeight?.[key] || ({ normal:400, medium:500, semibold:600, bold:700 }[key] || 400); }
  catch { return 400; }
};

// ─── Constantes ───────────────────────────────────────────────────────────────
const HORAS        = Array.from({ length: 11 }, (_, i) => i + 8); // 8..18
const DIAS_CORTO   = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
const DIAS_LARGO   = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const MESES        = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const HORA_H       = 54; // px por hora

const ESTADO_COL = {
  programada: { bg:'#dbeafe', text:'#1d4ed8', border:'#93c5fd' },
  confirmada: { bg:'#d1fae5', text:'#065f46', border:'#6ee7b7' },
  en_espera:  { bg:'#fef3c7', text:'#92400e', border:'#fcd34d' },
  completada: { bg:'#f3f4f6', text:'#374151', border:'#d1d5db' },
  cancelada:  { bg:'#fee2e2', text:'#991b1b', border:'#fca5a5' },
  no_asistio: { bg:'#fce7f3', text:'#9d174d', border:'#f9a8d4' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toDateStr   = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const startOfWeek = d => { const r = new Date(d); const day = (r.getDay()+6)%7; r.setDate(r.getDate()-day); r.setHours(0,0,0,0); return r; };
const addDays     = (d, n) => { const r = new Date(d); r.setDate(r.getDate()+n); return r; };
const horaDecimal = d => d.getHours() + d.getMinutes()/60;

const diasDelMes = (year, month) => {
  const first  = new Date(year, month, 1);
  const last   = new Date(year, month+1, 0);
  const offset = (first.getDay()+6)%7;
  const days   = [];
  for (let i = 0; i < offset; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  return days;
};

// ─── Componente principal ─────────────────────────────────────────────────────
const CitasDashboard = ({ doctorId }) => {
  let themeContext = {};
  try { themeContext = useTheme() || {}; } catch {}

  const config = themeContext.config       || DCFG;
  const colors = themeContext.colors       || DC;
  const sp     = themeContext.spacing      || DSP;
  const typo   = themeContext.typography   || {};
  const br     = themeContext.borderRadius || DBR;
  const sh     = themeContext.shadows      || DSH;

  const primary   = config?.theme?.colors?.primary   || DCFG.theme.colors.primary;
  const secondary = config?.theme?.colors?.secondary || DCFG.theme.colors.secondary;

  const [vista,     setVista]     = useState('mes');
  const [fecha,     setFecha]     = useState(new Date());
  const [citas,     setCitas]     = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [seleccion, setSeleccion] = useState(null);

  // ── Cargar citas ──
  const cargarCitas = useCallback(async () => {
    const id = doctorId || (() => { try { return JSON.parse(localStorage.getItem('user') || '{}')?.id_usuario; } catch { return null; } })();
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.get(`/citas/doctor/${id}`);
      const arr = res?.data || res?.citas || (Array.isArray(res) ? res : []);
      setCitas(Array.isArray(arr) ? arr : []);
    } catch {
      setCitas([]);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => { cargarCitas(); }, [cargarCitas]);

  // ── Índice por fecha ──
  const citasPorFecha = React.useMemo(() => {
    const map = {};
    citas.forEach(c => {
      if (!c?.fecha_hora) return;
      const d   = new Date(c.fecha_hora);
      const key = toDateStr(d);
      if (!map[key]) map[key] = [];
      map[key].push({ ...c, _date: d });
    });
    return map;
  }, [citas]);

  // ── Navegación ──
  const navegar = dir => {
    setFecha(prev => {
      const d = new Date(prev);
      if (vista === 'dia')    d.setDate(d.getDate() + dir);
      if (vista === 'semana') d.setDate(d.getDate() + dir * 7);
      if (vista === 'mes')    d.setMonth(d.getMonth() + dir);
      return d;
    });
    setSeleccion(null);
  };

  const irAHoy  = ()  => { setFecha(new Date()); setSeleccion(null); };
  const cambiarVista = v => { setVista(v); setSeleccion(null); };
  const irADia  = d   => { setFecha(d); setVista('dia'); setSeleccion(null); };

  const titulo = () => {
    if (vista === 'dia')    return `${fecha.getDate()} de ${MESES[fecha.getMonth()]} ${fecha.getFullYear()}`;
    if (vista === 'mes')    return `${MESES[fecha.getMonth()]} ${fecha.getFullYear()}`;
    const ini = startOfWeek(fecha);
    const fin = addDays(ini, 6);
    if (ini.getMonth() === fin.getMonth())
      return `${ini.getDate()} – ${fin.getDate()} de ${MESES[ini.getMonth()]} ${ini.getFullYear()}`;
    return `${ini.getDate()} ${MESES[ini.getMonth()]} – ${fin.getDate()} ${MESES[fin.getMonth()]} ${ini.getFullYear()}`;
  };

  const toggleSlot = key => setSeleccion(prev => prev?.key === key ? null : { key, ...JSON.parse(key) });

  // ── Estilos reutilizables ──
  const card = {
    background: colors?.neutral?.[0] || '#fff',
    border: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
    borderRadius: br?.xl || '12px',
    boxShadow: sh?.md || '0 4px 6px -1px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  };

  const btnVista = v => ({
    padding: '6px 16px', border: 'none', borderRadius: br?.full || '9999px', cursor: 'pointer',
    fontSize: fs(typo,'sm'), fontWeight: fw(typo,'semibold'),
    background: vista === v ? primary : 'transparent',
    color: vista === v ? '#fff' : colors?.neutral?.[600] || '#4b5563',
    transition: '0.2s',
  });

  const navBtn = {
    background: colors?.neutral?.[0] || '#fff',
    border: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
    borderRadius: br?.lg || '8px',
    padding: '6px 8px', cursor: 'pointer',
    display: 'flex', alignItems: 'center',
    color: colors?.neutral?.[600] || '#4b5563',
    boxShadow: sh?.sm,
  };

  // ════════════════════════════════════════════════════════════════
  // VISTA MES
  // ════════════════════════════════════════════════════════════════
  const VistaMes = () => {
    const dias = diasDelMes(fecha.getFullYear(), fecha.getMonth());
    const hoy  = toDateStr(new Date());

    return (
      <div style={card}>
        {/* Cabecera días */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', borderBottom:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}` }}>
          {DIAS_CORTO.map(d => (
            <div key={d} style={{ padding:'10px 0', textAlign:'center', fontSize:fs(typo,'xs'), fontWeight:fw(typo,'semibold'), color:colors?.neutral?.[500]||'#6b7280', letterSpacing:'0.06em', textTransform:'uppercase' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Grid días */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)' }}>
          {dias.map((dia, idx) => {
            if (!dia) return (
              <div key={`e-${idx}`} style={{ minHeight:'90px', borderRight:`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`, borderBottom:`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`, background:colors?.neutral?.[50]||'#f9fafb' }} />
            );

            const key    = toDateStr(dia);
            const citasD = citasPorFecha[key] || [];
            const esHoy  = key === hoy;
            const finde  = dia.getDay() === 0 || dia.getDay() === 6;

            return (
              <div key={key}
                onClick={() => citasD.length > 0 && irADia(dia)}
                style={{ minHeight:'90px', padding:'8px', borderRight:`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`, borderBottom:`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`, background: finde ? colors?.neutral?.[50]||'#f9fafb' : colors?.neutral?.[0]||'#fff', cursor: citasD.length > 0 ? 'pointer' : 'default', transition:'background 0.15s' }}
                onMouseEnter={e => citasD.length > 0 && (e.currentTarget.style.background = `${primary}09`)}
                onMouseLeave={e => e.currentTarget.style.background = finde ? (colors?.neutral?.[50]||'#f9fafb') : (colors?.neutral?.[0]||'#fff')}
              >
                <div style={{ marginBottom:'6px' }}>
                  <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:'26px', height:'26px', borderRadius:br?.full||'9999px', fontSize:fs(typo,'sm'), fontWeight: esHoy ? fw(typo,'bold') : fw(typo,'normal'), background: esHoy ? primary : 'transparent', color: esHoy ? '#fff' : finde ? colors?.neutral?.[400]||'#9ca3af' : colors?.neutral?.[700]||'#374151' }}>
                    {dia.getDate()}
                  </span>
                </div>

                {citasD.length > 0 && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'3px' }}>
                    {citasD.slice(0,2).map((c,i) => {
                      const col = ESTADO_COL[c.estado] || ESTADO_COL.programada;
                      return (
                        <div key={i} style={{ background:col.bg, color:col.text, border:`1px solid ${col.border}`, borderRadius:br?.sm||'4px', padding:'2px 6px', fontSize:fs(typo,'xs'), fontWeight:fw(typo,'medium'), overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {new Date(c.fecha_hora).toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'})} {c.Paciente?.nombre||''}
                        </div>
                      );
                    })}
                    {citasD.length > 2 && (
                      <div style={{ fontSize:fs(typo,'xs'), color:primary, fontWeight:fw(typo,'semibold'), paddingLeft:'4px' }}>
                        +{citasD.length - 2} más
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════
  // VISTA DÍA / SEMANA
  // ════════════════════════════════════════════════════════════════
  const VistaHoraria = ({ esSemana }) => {
    const diasVista = esSemana
      ? Array.from({ length:7 }, (_, i) => addDays(startOfWeek(fecha), i))
      : [new Date(fecha)];

    const hoy = toDateStr(new Date());

    return (
      <div style={card}>
        {/* Cabecera días */}
        <div style={{ display:'flex', borderBottom:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}`, background:colors?.neutral?.[0]||'#fff', position:'sticky', top:0, zIndex:2 }}>
          <div style={{ width:'64px', flexShrink:0, borderRight:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}` }} />
          {diasVista.map((d, i) => {
            const key   = toDateStr(d);
            const esHoy = key === hoy;
            return (
              <div key={i} style={{ flex:1, textAlign:'center', padding:'10px 4px', borderRight: i < diasVista.length-1 ? `1px solid ${colors?.neutral?.[100]||'#f3f4f6'}` : 'none' }}>
                <div style={{ fontSize:fs(typo,'xs'), color:colors?.neutral?.[500]||'#6b7280', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:fw(typo,'semibold') }}>
                  {esSemana ? DIAS_CORTO[i] : DIAS_LARGO[(d.getDay()+6)%7]}
                </div>
                <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:'32px', height:'32px', borderRadius:br?.full||'9999px', marginTop:'3px', background: esHoy ? primary : 'transparent', color: esHoy ? '#fff' : colors?.neutral?.[800]||'#1f2937', fontSize:fs(typo,'md'), fontWeight: esHoy ? fw(typo,'bold') : fw(typo,'normal') }}>
                  {d.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Cuerpo */}
        <div style={{ overflowY:'auto', maxHeight:'calc(100vh - 300px)' }}>
          <div style={{ display:'flex' }}>
            {/* Columna horas */}
            <div style={{ width:'64px', flexShrink:0, borderRight:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}` }}>
              {HORAS.map(h => (
                <div key={h} style={{ height:`${HORA_H}px`, display:'flex', alignItems:'flex-start', justifyContent:'flex-end', paddingRight:'10px', paddingTop:'5px', fontSize:fs(typo,'xs'), color:colors?.neutral?.[400]||'#9ca3af', fontWeight:fw(typo,'medium'), borderBottom:`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`, userSelect:'none' }}>
                  {`${String(h).padStart(2,'0')}:00`}
                </div>
              ))}
            </div>

            {/* Columnas días */}
            {diasVista.map((d, di) => {
              const key    = toDateStr(d);
              const citasD = citasPorFecha[key] || [];

              return (
                <div key={di} style={{ flex:1, position:'relative', borderRight: di < diasVista.length-1 ? `1px solid ${colors?.neutral?.[100]||'#f3f4f6'}` : 'none' }}>
                  {/* Slots clickeables */}
                  {HORAS.map(h => {
                    const slotKey = JSON.stringify({ fecha: key, hora: h });
                    const activo  = seleccion?.key === slotKey;
                    return (
                      <div key={h}
                        onClick={() => toggleSlot(slotKey)}
                        style={{ height:`${HORA_H}px`, borderBottom:`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`, background: activo ? `${primary}18` : 'transparent', cursor:'pointer', transition:'background 0.12s', position:'relative' }}
                        onMouseEnter={e => !activo && (e.currentTarget.style.background = `${primary}07`)}
                        onMouseLeave={e => !activo && (e.currentTarget.style.background = 'transparent')}
                      >
                        {activo && (
                          <div style={{ position:'absolute', inset:'2px', border:`2px dashed ${primary}`, borderRadius:br?.md||'6px', pointerEvents:'none', opacity:0.6 }} />
                        )}
                      </div>
                    );
                  })}

                  {/* Citas posicionadas absolutamente */}
                  {citasD.map((c, ci) => {
                    const citaDate = new Date(c.fecha_hora);
                    const hD       = horaDecimal(citaDate);
                    if (hD < 8 || hD >= 19) return null;
                    const top    = (hD - 8) * HORA_H;
                    const durMin = c.TipoCita?.duracion_promedio || 30;
                    const height = Math.max((durMin / 60) * HORA_H - 3, 24);
                    const col    = ESTADO_COL[c.estado] || ESTADO_COL.programada;

                    return (
                      <div key={ci} style={{ position:'absolute', top:`${top + 2}px`, left:'3px', right:'3px', height:`${height}px`, background:col.bg, border:`1.5px solid ${col.border}`, borderRadius:br?.md||'6px', padding:'3px 6px', overflow:'hidden', cursor:'pointer', zIndex:1, boxShadow:sh?.sm }}>
                        <div style={{ fontSize:fs(typo,'xs'), fontWeight:fw(typo,'semibold'), color:col.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {citaDate.toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'})} {c.Paciente?.nombre||''} {c.Paciente?.apellido||''}
                        </div>
                        {height > 32 && (
                          <div style={{ fontSize:fs(typo,'xs'), color:col.text, opacity:0.75, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {c.TipoCita?.nombre||''}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight:'100vh', background:colors?.neutral?.[50]||'#f9fafb', padding:sp?.xl||'32px' }}>

      {/* ── Título de página ── */}
      <div style={{ marginBottom: sp?.lg||'24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap: sp?.sm||'8px', marginBottom:'4px' }}>
          <div style={{ width:'38px', height:'38px', borderRadius:br?.lg||'8px', background:`linear-gradient(135deg, ${primary}, ${secondary})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <MdEventNote size={22} color="#fff" />
          </div>
          <h1 style={{ margin:0, fontSize:fs(typo,'2xl'), fontWeight:fw(typo,'bold'), color:colors?.neutral?.[900]||'#111827' }}>
            Mis Citas
          </h1>
        </div>
        <p style={{ margin:0, fontSize:fs(typo,'sm'), color:colors?.neutral?.[500]||'#6b7280', paddingLeft:'46px' }}>
          Gestiona y visualiza tu agenda médica
        </p>
      </div>

      {/* ── Barra de controles ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: sp?.md||'16px', flexWrap:'wrap', gap: sp?.sm||'8px' }}>

        {/* Navegación + fecha */}
        <div style={{ display:'flex', alignItems:'center', gap: sp?.sm||'8px' }}>
          <button onClick={() => navegar(-1)} style={navBtn}><MdChevronLeft size={20} /></button>
          <button onClick={() => navegar(1)}  style={navBtn}><MdChevronRight size={20} /></button>

          <span style={{ fontSize:fs(typo,'md'), fontWeight:fw(typo,'bold'), color:colors?.neutral?.[900]||'#111827', minWidth:'200px' }}>
            {titulo()}
          </span>

          <button onClick={irAHoy} style={{ ...navBtn, padding:'6px 14px', gap:'5px' }}>
            <MdCalendarToday size={14} />
            <span style={{ fontSize:fs(typo,'sm'), fontWeight:fw(typo,'medium') }}>Hoy</span>
          </button>
        </div>

        {/* Derecha: agendar + selector vista */}
        <div style={{ display:'flex', alignItems:'center', gap: sp?.sm||'8px' }}>

          {/* Botón agendar — solo visible cuando hay slot seleccionado */}
          {seleccion && vista !== 'mes' && (
            <button
              onClick={() => alert(`Agendar: ${seleccion.fecha} a las ${String(seleccion.hora).padStart(2,'0')}:00`)}
              style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 20px', background:`linear-gradient(to right, ${primary}, ${secondary})`, color:'#fff', border:'none', borderRadius:br?.full||'9999px', fontSize:fs(typo,'sm'), fontWeight:fw(typo,'semibold'), cursor:'pointer', boxShadow:sh?.md, animation:'slideIn 0.2s ease-out' }}
            >
              <MdAdd size={18} /> Agendar Cita
            </button>
          )}

          {/* Selector de vista */}
          <div style={{ display:'flex', background:colors?.neutral?.[100]||'#f3f4f6', borderRadius:br?.full||'9999px', padding:'3px', gap:'2px' }}>
            {['dia','semana','mes'].map(v => (
              <button key={v} onClick={() => cambiarVista(v)} style={btnVista(v)}>
                {v === 'dia' ? 'Día' : v === 'semana' ? 'Semana' : 'Mes'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chip de slot seleccionado */}
      {seleccion && vista !== 'mes' && (
        <div style={{ marginBottom: sp?.md||'16px' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:`${primary}12`, border:`1px solid ${primary}35`, borderRadius:br?.full||'9999px', padding:'5px 14px', fontSize:fs(typo,'sm'), color:primary, fontWeight:fw(typo,'semibold') }}>
            <MdCalendarToday size={13} />
            {seleccion.fecha} · {String(seleccion.hora).padStart(2,'0')}:00
            <button onClick={() => setSeleccion(null)} style={{ background:'none', border:'none', cursor:'pointer', color:primary, display:'flex', padding:'0 0 0 4px', lineHeight:1 }}>
              <MdClose size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign:'center', padding:sp?.xl||'32px', color:colors?.neutral?.[500]||'#6b7280', fontSize:fs(typo,'sm') }}>
          <div style={{ width:'32px', height:'32px', border:`3px solid ${colors?.neutral?.[200]||'#e5e7eb'}`, borderTop:`3px solid ${primary}`, borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 12px' }} />
          Cargando citas...
        </div>
      )}

      {/* Vistas */}
      {!loading && (
        <>
          {vista === 'mes'    && <VistaMes />}
          {vista === 'dia'    && <VistaHoraria esSemana={false} />}
          {vista === 'semana' && <VistaHoraria esSemana={true}  />}
        </>
      )}

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
};

export default CitasDashboard;