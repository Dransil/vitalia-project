import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../../../../Config/ThemeContext';
import {
  MdChevronLeft, MdChevronRight, MdCalendarToday, MdAdd, MdClose,
  MdEventNote, MdPerson, MdMedicalServices, MdAccessTime, MdSearch,
  MdCheck, MdBlock
} from 'react-icons/md';
import api from '../../../../Services/Api';

// ─── Defaults ─────────────────────────────────────────────────────────────────
const DC   = { neutral:{0:'#fff',50:'#f9fafb',100:'#f3f4f6',200:'#e5e7eb',300:'#d1d5db',400:'#9ca3af',500:'#6b7280',600:'#4b5563',700:'#374151',800:'#1f2937',900:'#111827'}, success:{light:'#d1fae5',main:'#10b981',dark:'#059669'}, error:{light:'#fee2e2',main:'#dc2626',dark:'#991b1b'} };
const DCFG = { theme:{ colors:{ primary:'#0ea5e9', secondary:'#14b8a6' } } };
const DSP  = { xs:'4px',sm:'8px',md:'16px',lg:'24px',xl:'32px' };
const DBR  = { sm:'4px',md:'6px',lg:'8px',xl:'12px',full:'9999px' };
const DSH  = { sm:'0 1px 2px rgba(0,0,0,0.05)', md:'0 4px 6px -1px rgba(0,0,0,0.08)' };

const fs = (t,k) => { try { return t?.fontSize?.[k]?.size||({xs:'11px',sm:'13px',md:'15px',lg:'18px',xl:'20px','2xl':'24px'}[k]||'14px'); } catch { return '14px'; } };
const fw = (t,k) => { try { return t?.fontWeight?.[k]||({normal:400,medium:500,semibold:600,bold:700}[k]||400); } catch { return 400; } };

// ─── Constantes ───────────────────────────────────────────────────────────────
const HORAS    = Array.from({length:11},(_,i)=>i+8);
const DIAS_C   = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
const DIAS_L   = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const MESES    = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const HORA_H   = 54;

const ESTADO_COL = {
  programada: {bg:'#dbeafe',text:'#1d4ed8',border:'#93c5fd'},
  confirmada: {bg:'#d1fae5',text:'#065f46',border:'#6ee7b7'},
  en_espera:  {bg:'#fef3c7',text:'#92400e',border:'#fcd34d'},
  completada: {bg:'#f3f4f6',text:'#374151',border:'#d1d5db'},
  cancelada:  {bg:'#fee2e2',text:'#991b1b',border:'#fca5a5'},
  no_asistio: {bg:'#fce7f3',text:'#9d174d',border:'#f9a8d4'},
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toDateStr   = d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const startOfWeek = d=>{ const r=new Date(d); const day=(r.getDay()+6)%7; r.setDate(r.getDate()-day); r.setHours(0,0,0,0); return r; };
const addDays     = (d,n)=>{ const r=new Date(d); r.setDate(r.getDate()+n); return r; };
const horaDecimal = d=>d.getHours()+d.getMinutes()/60;
const hoyStr      = () => toDateStr(new Date());
const esPasado    = (dateStr) => dateStr < hoyStr();
const esPasadoH   = (dateStr, hora) => {
  const hoy = new Date();
  if (dateStr < hoyStr()) return true;
  if (dateStr === hoyStr() && hora <= hoy.getHours()) return true;
  return false;
};

const diasDelMes = (year,month) => {
  const first=new Date(year,month,1), last=new Date(year,month+1,0), offset=(first.getDay()+6)%7, days=[];
  for(let i=0;i<offset;i++) days.push(null);
  for(let d=1;d<=last.getDate();d++) days.push(new Date(year,month,d));
  return days;
};

const agruparHorasContiguas = (slots) => {
  if (!slots.size) return [];
  const lista = Array.from(slots).map(k=>JSON.parse(k)).sort((a,b)=>a.fecha===b.fecha?a.hora-b.hora:a.fecha.localeCompare(b.fecha));
  const grupos=[], actual=[];
  let ref=null;
  lista.forEach(s=>{
    if (!ref || ref.fecha!==s.fecha || s.hora!==ref.hora+1) {
      if (actual.length) grupos.push({ fecha:actual[0].fecha, horaInicio:actual[0].hora, horaFin:actual[actual.length-1].hora+1 });
      actual.length=0;
    }
    actual.push(s); ref=s;
  });
  if (actual.length) grupos.push({ fecha:actual[0].fecha, horaInicio:actual[0].hora, horaFin:actual[actual.length-1].hora+1 });
  return grupos;
};

// ─── Modal Agendar ────────────────────────────────────────────────────────────
const ModalAgendar = ({ bloques, onClose, onConfirm, primary, secondary, colors, sp, br, sh, typo }) => {
  const [pacientes,    setPacientes]   = useState([]);
  const [tiposCita,   setTiposCita]   = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [busqueda,    setBusqueda]    = useState('');
  const [pacienteId,  setPacienteId]  = useState('');
  const [tipoCitaId,  setTipoCitaId]  = useState('');
  const [notas,       setNotas]       = useState('');
  const [error,       setError]       = useState('');
  const [guardando,   setGuardando]   = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      setLoadingData(true);
      try {
        const [pRes, tRes] = await Promise.all([api.get('/pacientes'), api.get('/tipocita')]);
        setPacientes(Array.isArray(pRes?.data) ? pRes.data : Array.isArray(pRes) ? pRes : []);
        setTiposCita(Array.isArray(tRes?.data) ? tRes.data : Array.isArray(tRes) ? tRes : []);
      } catch { setError('Error al cargar datos'); }
      finally { setLoadingData(false); }
    };
    load();
    setTimeout(()=>searchRef.current?.focus(), 120);
  }, []);

  const pacientesFiltrados = pacientes.filter(p => {
    if (!p) return false;
    const q = busqueda.toLowerCase();
    return `${p.nombre||''} ${p.apellido||''}`.toLowerCase().includes(q) || (p.cedula||'').includes(q);
  });

  const tipoCitaSeleccionada = tiposCita.find(t=>String(t.id_tipo_cita)===String(tipoCitaId));
  const pacienteSeleccionado = pacientes.find(p=>String(p.id_paciente)===String(pacienteId));

  const handleConfirm = async () => {
    if (!pacienteId) { setError('Seleccione un paciente'); return; }
    if (!tipoCitaId) { setError('Seleccione un tipo de cita'); return; }
    setError(''); setGuardando(true);
    try { await onConfirm({ pacienteId, tipoCitaId, notas, bloques }); }
    catch (e) { setError(e?.message||'Error al agendar'); setGuardando(false); }
  };

  const inp = { width:'100%', padding:`${sp?.sm||'8px'} ${sp?.md||'16px'}`, border:`2px solid ${colors?.neutral?.[200]||'#e5e7eb'}`, borderRadius:br?.md||'6px', fontSize:fs(typo,'sm'), outline:'none', boxSizing:'border-box', background:colors?.neutral?.[0]||'#fff', color:colors?.neutral?.[900]||'#111827', transition:'border-color 0.15s' };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.48)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', animation:'fadeIn 0.15s ease' }}
      onClick={e=>e.target===e.currentTarget&&onClose()}
    >
      <div style={{ background:colors?.neutral?.[0]||'#fff', borderRadius:br?.xl||'12px', width:'100%', maxWidth:'560px', maxHeight:'92vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 24px 48px rgba(0,0,0,0.2)', animation:'slideUp 0.2s ease' }}>

        {/* Header */}
        <div style={{ padding:`${sp?.lg||'24px'} ${sp?.xl||'32px'}`, borderBottom:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:`linear-gradient(135deg,${primary}08,${secondary}08)`, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:sp?.sm||'8px' }}>
            <div style={{ width:'36px', height:'36px', borderRadius:br?.lg||'8px', background:`linear-gradient(135deg,${primary},${secondary})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <MdAdd size={20} color="#fff"/>
            </div>
            <div>
              <h2 style={{ margin:0, fontSize:fs(typo,'lg'), fontWeight:fw(typo,'bold'), color:colors?.neutral?.[900]||'#111827' }}>Agendar Cita</h2>
              <p style={{ margin:0, fontSize:fs(typo,'xs'), color:colors?.neutral?.[500]||'#6b7280' }}>
                {bloques.length} bloque{bloques.length!==1?'s':''} · {bloques.reduce((a,b)=>a+(b.horaFin-b.horaInicio),0)}h reservada{bloques.reduce((a,b)=>a+(b.horaFin-b.horaInicio),0)!==1?'s':''}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:colors?.neutral?.[400]||'#9ca3af', display:'flex', borderRadius:br?.full||'9999px', padding:'4px' }}>
            <MdClose size={22}/>
          </button>
        </div>

        {/* Bloques seleccionados */}
        <div style={{ padding:`${sp?.sm||'8px'} ${sp?.xl||'32px'}`, borderBottom:`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`, background:colors?.neutral?.[50]||'#f9fafb', display:'flex', flexWrap:'wrap', gap:sp?.xs||'4px', flexShrink:0 }}>
          {bloques.map((b,i)=>(
            <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:'4px', background:`${primary}15`, border:`1px solid ${primary}30`, borderRadius:br?.full||'9999px', padding:'3px 10px', fontSize:fs(typo,'xs'), color:primary, fontWeight:fw(typo,'semibold') }}>
              <MdAccessTime size={11}/> {b.fecha} · {String(b.horaInicio).padStart(2,'0')}:00 – {String(b.horaFin).padStart(2,'0')}:00
            </span>
          ))}
        </div>

        {/* Cuerpo */}
        <div style={{ overflowY:'auto', flex:1, padding:`${sp?.lg||'24px'} ${sp?.xl||'32px'}` }}>
          {loadingData ? (
            <div style={{ textAlign:'center', padding:sp?.xl||'32px' }}>
              <div style={{ width:'28px', height:'28px', border:`3px solid ${colors?.neutral?.[200]||'#e5e7eb'}`, borderTop:`3px solid ${primary}`, borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto' }}/>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:sp?.lg||'24px' }}>

              {error && (
                <div style={{ padding:sp?.md||'16px', background:colors?.error?.light||'#fee2e2', border:`1px solid ${colors?.error?.main||'#dc2626'}`, color:colors?.error?.dark||'#991b1b', borderRadius:br?.md||'6px', fontSize:fs(typo,'sm'), fontWeight:fw(typo,'semibold') }}>
                  {error}
                </div>
              )}

              {/* ── Paciente ── */}
              <div>
                <label style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:fs(typo,'sm'), fontWeight:fw(typo,'semibold'), color:colors?.neutral?.[700]||'#374151', marginBottom:sp?.sm||'8px' }}>
                  <MdPerson size={15} style={{ color:primary }}/> Paciente *
                </label>

                {/* Buscador */}
                <div style={{ position:'relative', marginBottom:sp?.xs||'4px' }}>
                  <MdSearch size={15} style={{ position:'absolute', left:'11px', top:'50%', transform:'translateY(-50%)', color:colors?.neutral?.[400]||'#9ca3af', pointerEvents:'none' }}/>
                  <input ref={searchRef} type="text" value={busqueda} onChange={e=>{setBusqueda(e.target.value); setPacienteId('');}} placeholder="Buscar por nombre o cédula..." style={{ ...inp, paddingLeft:'34px' }} onFocus={e=>e.target.style.borderColor=primary} onBlur={e=>e.target.style.borderColor=colors?.neutral?.[200]||'#e5e7eb'}/>
                </div>

                {/* Lista con scroll fijo */}
                <div style={{ border:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}`, borderRadius:br?.lg||'8px', height:'160px', overflowY:'auto', background:colors?.neutral?.[0]||'#fff' }}>
                  {pacientesFiltrados.length===0 ? (
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', fontSize:fs(typo,'sm'), color:colors?.neutral?.[400]||'#9ca3af' }}>Sin resultados</div>
                  ) : pacientesFiltrados.map(p=>{
                    const sel = String(p.id_paciente)===String(pacienteId);
                    return (
                      <div key={p.id_paciente} onClick={()=>{ setPacienteId(p.id_paciente); if(error)setError(''); }} style={{ padding:`${sp?.sm||'8px'} ${sp?.md||'16px'}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', background:sel?`${primary}10`:'transparent', borderBottom:`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`, transition:'background 0.1s' }}
                        onMouseEnter={e=>!sel&&(e.currentTarget.style.background=colors?.neutral?.[50]||'#f9fafb')}
                        onMouseLeave={e=>!sel&&(e.currentTarget.style.background='transparent')}
                      >
                        <div>
                          <div style={{ fontSize:fs(typo,'sm'), fontWeight:sel?fw(typo,'semibold'):fw(typo,'normal'), color:sel?primary:colors?.neutral?.[800]||'#1f2937' }}>
                            {p.nombre} {p.apellido}
                          </div>
                          <div style={{ fontSize:fs(typo,'xs'), color:colors?.neutral?.[400]||'#9ca3af' }}>CI: {p.cedula}</div>
                        </div>
                        {sel&&<MdCheck size={15} style={{ color:primary, flexShrink:0 }}/>}
                      </div>
                    );
                  })}
                </div>

                {/* Chip paciente seleccionado */}
                {pacienteSeleccionado && (
                  <div style={{ marginTop:sp?.xs||'4px', display:'inline-flex', alignItems:'center', gap:'6px', background:`${primary}10`, border:`1px solid ${primary}30`, borderRadius:br?.full||'9999px', padding:'3px 10px', fontSize:fs(typo,'xs'), color:primary, fontWeight:fw(typo,'semibold') }}>
                    <MdCheck size={11}/> {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido}
                  </div>
                )}
              </div>

              {/* ── Tipo de cita (combobox) ── */}
              <div>
                <label style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:fs(typo,'sm'), fontWeight:fw(typo,'semibold'), color:colors?.neutral?.[700]||'#374151', marginBottom:sp?.sm||'8px' }}>
                  <MdMedicalServices size={15} style={{ color:primary }}/> Tipo de Cita *
                </label>
                <select value={tipoCitaId} onChange={e=>{ setTipoCitaId(e.target.value); if(error)setError(''); }} style={{ ...inp, cursor:'pointer', appearance:'auto' }} onFocus={e=>e.target.style.borderColor=primary} onBlur={e=>e.target.style.borderColor=colors?.neutral?.[200]||'#e5e7eb'}>
                  <option value="">— Seleccione un tipo de cita —</option>
                  {tiposCita.map(t=>(
                    <option key={t.id_tipo_cita} value={t.id_tipo_cita}>
                      {t.nombre} · {t.duracion_promedio} min{t.costo_base?` · $${parseFloat(t.costo_base).toFixed(2)}`:''}
                    </option>
                  ))}
                </select>

                {/* Info del tipo seleccionado */}
                {tipoCitaSeleccionada && (
                  <div style={{ marginTop:sp?.sm||'8px', padding:sp?.md||'16px', background:`${primary}08`, border:`1px solid ${primary}20`, borderRadius:br?.md||'6px' }}>
                    {tipoCitaSeleccionada.descripcion && (
                      <p style={{ margin:`0 0 6px`, fontSize:fs(typo,'xs'), color:colors?.neutral?.[600]||'#4b5563' }}>{tipoCitaSeleccionada.descripcion}</p>
                    )}
                    <div style={{ display:'flex', gap:'16px', flexWrap:'wrap', fontSize:fs(typo,'xs'), color:primary, fontWeight:fw(typo,'semibold') }}>
                      <span><MdAccessTime size={11} style={{ verticalAlign:'middle' }}/> {tipoCitaSeleccionada.duracion_promedio} min</span>
                      {tipoCitaSeleccionada.costo_base&&<span>$ {parseFloat(tipoCitaSeleccionada.costo_base).toFixed(2)}</span>}
                      <span>Tiempo reservado: {bloques.reduce((a,b)=>a+(b.horaFin-b.horaInicio),0)*60} min</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Notas */}
              <div>
                <label style={{ display:'block', fontSize:fs(typo,'sm'), fontWeight:fw(typo,'semibold'), color:colors?.neutral?.[700]||'#374151', marginBottom:sp?.sm||'8px' }}>
                  Notas (opcional)
                </label>
                <textarea value={notas} onChange={e=>setNotas(e.target.value)} rows={3} placeholder="Motivo de consulta, observaciones..." style={{ ...inp, resize:'vertical', minHeight:'72px', fontFamily:'inherit' }} onFocus={e=>e.target.style.borderColor=primary} onBlur={e=>e.target.style.borderColor=colors?.neutral?.[200]||'#e5e7eb'}/>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:`${sp?.md||'16px'} ${sp?.xl||'32px'}`, borderTop:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}`, display:'flex', justifyContent:'flex-end', gap:sp?.sm||'8px', background:colors?.neutral?.[50]||'#f9fafb', flexShrink:0 }}>
          <button onClick={onClose} style={{ padding:`${sp?.sm||'8px'} ${sp?.lg||'24px'}`, background:colors?.neutral?.[100]||'#f3f4f6', border:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}`, borderRadius:br?.md||'6px', fontSize:fs(typo,'sm'), fontWeight:fw(typo,'semibold'), color:colors?.neutral?.[700]||'#374151', cursor:'pointer' }}>
            Cancelar
          </button>
          <button onClick={handleConfirm} disabled={guardando||loadingData} style={{ padding:`${sp?.sm||'8px'} ${sp?.lg||'24px'}`, background:(guardando||loadingData)?colors?.neutral?.[300]||'#d1d5db':`linear-gradient(to right,${primary},${secondary})`, border:'none', borderRadius:br?.md||'6px', fontSize:fs(typo,'sm'), fontWeight:fw(typo,'semibold'), color:'#fff', cursor:(guardando||loadingData)?'not-allowed':'pointer', display:'flex', alignItems:'center', gap:'6px' }}>
            {guardando?'⏳ Guardando...':<><MdCheck size={16}/> Confirmar Cita</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Dashboard principal ──────────────────────────────────────────────────────
const CitasDashboard = ({ doctorId }) => {
  let themeContext = {};
  try { themeContext = useTheme()||{}; } catch {}

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
  const [slotsSet,  setSlotsSet]  = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [errNav,    setErrNav]    = useState('');   // error al navegar al pasado

  const cargarCitas = useCallback(async () => {
    const id = doctorId || (()=>{ try{ return JSON.parse(localStorage.getItem('user')||'{}')?.id_usuario; }catch{return null;} })();
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.get(`/citas/doctor/${id}`);
      const arr = res?.data || res?.citas || (Array.isArray(res)?res:[]);
      setCitas(Array.isArray(arr)?arr:[]);
    } catch { setCitas([]); }
    finally { setLoading(false); }
  }, [doctorId]);

  useEffect(()=>{ cargarCitas(); },[cargarCitas]);

  const citasPorFecha = React.useMemo(()=>{
    const map={};
    citas.forEach(c=>{
      if(!c?.fecha_hora) return;
      const d=new Date(c.fecha_hora), key=toDateStr(d);
      if(!map[key]) map[key]=[];
      map[key].push({...c,_date:d});
    });
    return map;
  },[citas]);

  // ── Navegación con bloqueo al pasado ──
  const navegar = dir => {
    setErrNav('');
    setFecha(prev => {
      const d = new Date(prev);
      if (vista==='dia')    d.setDate(d.getDate()+dir);
      if (vista==='semana') d.setDate(d.getDate()+dir*7);
      if (vista==='mes')    d.setMonth(d.getMonth()+dir);

      // Bloquear si la nueva fecha es pasado
      const hoy = new Date(); hoy.setHours(0,0,0,0);
      if (vista==='dia' && d < hoy) {
        setErrNav('No puedes navegar a días anteriores'); return prev;
      }
      if (vista==='semana') {
        const finSem = addDays(startOfWeek(d), 6);
        if (finSem < hoy) { setErrNav('No puedes navegar a semanas anteriores'); return prev; }
      }
      if (vista==='mes') {
        const finMes = new Date(d.getFullYear(), d.getMonth()+1, 0);
        if (finMes < hoy) { setErrNav('No puedes navegar a meses anteriores'); return prev; }
      }
      return d;
    });
    setSlotsSet(new Set());
  };

  useEffect(()=>{ if(errNav){ const t=setTimeout(()=>setErrNav(''),2500); return ()=>clearTimeout(t); } },[errNav]);

  const irAHoy     = ()  => { setFecha(new Date()); setSlotsSet(new Set()); setErrNav(''); };
  const cambiarVista = v => { setVista(v); setSlotsSet(new Set()); setErrNav(''); };

  // Ir a vista día desde mes (solo si es hoy o futuro)
  const irADia = (d) => {
    const hoy = new Date(); hoy.setHours(0,0,0,0);
    if (d < hoy) return; // silencioso, el día ya se ve deshabilitado visualmente
    setFecha(d); setVista('dia'); setSlotsSet(new Set());
  };

  // Ir a vista semana desde mes
  const irASemana = (d) => {
    const hoy = new Date(); hoy.setHours(0,0,0,0);
    if (d < hoy) return;
    setFecha(d); setVista('semana'); setSlotsSet(new Set());
  };

  const titulo = () => {
    if (vista==='dia') return `${fecha.getDate()} de ${MESES[fecha.getMonth()]} ${fecha.getFullYear()}`;
    if (vista==='mes') return `${MESES[fecha.getMonth()]} ${fecha.getFullYear()}`;
    const ini=startOfWeek(fecha), fin=addDays(ini,6);
    if (ini.getMonth()===fin.getMonth()) return `${ini.getDate()} – ${fin.getDate()} de ${MESES[ini.getMonth()]} ${ini.getFullYear()}`;
    return `${ini.getDate()} ${MESES[ini.getMonth()]} – ${fin.getDate()} ${MESES[fin.getMonth()]} ${ini.getFullYear()}`;
  };

  const toggleSlot = (fecha, hora) => {
    if (esPasadoH(fecha, hora)) return; // no permitir slots pasados
    const key = JSON.stringify({fecha, hora});
    setSlotsSet(prev=>{ const n=new Set(prev); n.has(key)?n.delete(key):n.add(key); return n; });
  };

  const limpiarSlots = () => setSlotsSet(new Set());
  const bloques = agruparHorasContiguas(slotsSet);

  const handleConfirmarCita = async ({pacienteId,tipoCitaId,notas,bloques}) => {
    const id = doctorId||(()=>{ try{return JSON.parse(localStorage.getItem('user')||'{}')?.id_usuario;}catch{return null;} })();
    await Promise.all(bloques.map(b=>api.post('/citas',{
      id_usuario:id, id_paciente:pacienteId, id_tipo_cita:tipoCitaId,
      fecha_hora:`${b.fecha}T${String(b.horaInicio).padStart(2,'0')}:00:00`,
      notas, estado:'programada',
    })));
    setModalOpen(false); limpiarSlots(); cargarCitas();
  };

  // ── Estilos base ──
  const card    = { background:colors?.neutral?.[0]||'#fff', border:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}`, borderRadius:br?.xl||'12px', boxShadow:sh?.md, overflow:'hidden' };
  const navBtn  = { background:colors?.neutral?.[0]||'#fff', border:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}`, borderRadius:br?.lg||'8px', padding:'6px 8px', cursor:'pointer', display:'flex', alignItems:'center', color:colors?.neutral?.[600]||'#4b5563', boxShadow:sh?.sm };
  const btnV    = v => ({ padding:'6px 16px', border:'none', borderRadius:br?.full||'9999px', cursor:'pointer', fontSize:fs(typo,'sm'), fontWeight:fw(typo,'semibold'), background:vista===v?primary:'transparent', color:vista===v?'#fff':colors?.neutral?.[600]||'#4b5563', transition:'0.2s' });

  // ════════════════════════════════════════════════════════════════
  // VISTA MES
  // ════════════════════════════════════════════════════════════════
  const VistaMes = () => {
    const dias = diasDelMes(fecha.getFullYear(), fecha.getMonth());
    const hoy  = hoyStr();
    const hoyD = new Date(); hoyD.setHours(0,0,0,0);

    return (
      <div style={card}>
        {/* Cabecera días semana */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', borderBottom:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}` }}>
          {DIAS_C.map(d=>(
            <div key={d} style={{ padding:'10px 0', textAlign:'center', fontSize:fs(typo,'xs'), fontWeight:fw(typo,'semibold'), color:colors?.neutral?.[500]||'#6b7280', letterSpacing:'0.06em', textTransform:'uppercase' }}>{d}</div>
          ))}
        </div>

        {/* Grid días */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)' }}>
          {dias.map((dia,idx)=>{
            if (!dia) return <div key={`e${idx}`} style={{ minHeight:'90px', borderRight:`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`, borderBottom:`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`, background:colors?.neutral?.[50]||'#f9fafb' }}/>;

            const key    = toDateStr(dia);
            const citasD = citasPorFecha[key]||[];
            const esHoy  = key===hoy;
            const finde  = dia.getDay()===0||dia.getDay()===6;
            const pasado = dia < hoyD;

            return (
              <div key={key}
                onClick={()=>{ if(pasado) return; citasD.length>0 ? irADia(dia) : irASemana(dia); }}
                style={{ minHeight:'90px', padding:'8px', borderRight:`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`, borderBottom:`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`, background:pasado?(colors?.neutral?.[50]||'#f9fafb'):finde?(colors?.neutral?.[50]||'#f9fafb'):(colors?.neutral?.[0]||'#fff'), cursor:pasado?'not-allowed':'pointer', transition:'background 0.15s', opacity:pasado?0.45:1, position:'relative' }}
                onMouseEnter={e=>{ if(!pasado) e.currentTarget.style.background=`${primary}09`; }}
                onMouseLeave={e=>{ e.currentTarget.style.background=pasado?(colors?.neutral?.[50]||'#f9fafb'):finde?(colors?.neutral?.[50]||'#f9fafb'):(colors?.neutral?.[0]||'#fff'); }}
              >
                {/* Número */}
                <div style={{ marginBottom:'6px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:'26px', height:'26px', borderRadius:br?.full||'9999px', fontSize:fs(typo,'sm'), fontWeight:esHoy?fw(typo,'bold'):fw(typo,'normal'), background:esHoy?primary:'transparent', color:esHoy?'#fff':pasado?(colors?.neutral?.[300]||'#d1d5db'):finde?(colors?.neutral?.[400]||'#9ca3af'):(colors?.neutral?.[700]||'#374151') }}>
                    {dia.getDate()}
                  </span>
                  {pasado && <MdBlock size={11} style={{ color:colors?.neutral?.[300]||'#d1d5db' }}/>}
                </div>

                {/* Citas */}
                {!pasado && citasD.length>0 && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'3px' }}>
                    {citasD.slice(0,2).map((c,i)=>{ const col=ESTADO_COL[c.estado]||ESTADO_COL.programada; return (
                      <div key={i} style={{ background:col.bg, color:col.text, border:`1px solid ${col.border}`, borderRadius:br?.sm||'4px', padding:'2px 6px', fontSize:fs(typo,'xs'), fontWeight:fw(typo,'medium'), overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {new Date(c.fecha_hora).toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'})} {c.Paciente?.nombre||''}
                      </div>
                    );})}
                    {citasD.length>2&&<div style={{ fontSize:fs(typo,'xs'), color:primary, fontWeight:fw(typo,'semibold'), paddingLeft:'4px' }}>+{citasD.length-2} más</div>}
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
  // VISTA HORARIA (día / semana)
  // ════════════════════════════════════════════════════════════════
  const VistaHoraria = ({ esSemana }) => {
    const diasVista = esSemana
      ? Array.from({length:7},(_,i)=>addDays(startOfWeek(fecha),i))
      : [new Date(fecha)];
    const hoy = hoyStr();

    return (
      <div style={card}>
        {/* Cabecera */}
        <div style={{ display:'flex', borderBottom:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}`, background:colors?.neutral?.[0]||'#fff', position:'sticky', top:0, zIndex:2 }}>
          <div style={{ width:'64px', flexShrink:0, borderRight:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}` }}/>
          {diasVista.map((d,i)=>{
            const key=toDateStr(d), esHoy=key===hoy, pasado=esPasado(key);
            return (
              <div key={i} style={{ flex:1, textAlign:'center', padding:'10px 4px', borderRight:i<diasVista.length-1?`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`:'none', opacity:pasado?0.45:1 }}>
                <div style={{ fontSize:fs(typo,'xs'), color:colors?.neutral?.[500]||'#6b7280', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:fw(typo,'semibold') }}>
                  {esSemana?DIAS_C[i]:DIAS_L[(d.getDay()+6)%7]}
                </div>
                <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:'32px', height:'32px', borderRadius:br?.full||'9999px', marginTop:'3px', background:esHoy?primary:'transparent', color:esHoy?'#fff':pasado?(colors?.neutral?.[300]||'#d1d5db'):(colors?.neutral?.[800]||'#1f2937'), fontSize:fs(typo,'md'), fontWeight:esHoy?fw(typo,'bold'):fw(typo,'normal') }}>
                  {d.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Cuerpo */}
        <div style={{ overflowY:'auto', maxHeight:'calc(100vh - 300px)' }}>
          <div style={{ display:'flex' }}>
            {/* Horas */}
            <div style={{ width:'64px', flexShrink:0, borderRight:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}` }}>
              {HORAS.map(h=>(
                <div key={h} style={{ height:`${HORA_H}px`, display:'flex', alignItems:'flex-start', justifyContent:'flex-end', paddingRight:'10px', paddingTop:'5px', fontSize:fs(typo,'xs'), color:colors?.neutral?.[400]||'#9ca3af', fontWeight:fw(typo,'medium'), borderBottom:`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`, userSelect:'none' }}>
                  {`${String(h).padStart(2,'0')}:00`}
                </div>
              ))}
            </div>

            {/* Columnas días */}
            {diasVista.map((d,di)=>{
              const dateKey = toDateStr(d);
              const citasD  = citasPorFecha[dateKey]||[];
              const colPas  = esPasado(dateKey);

              return (
                <div key={di} style={{ flex:1, position:'relative', borderRight:di<diasVista.length-1?`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`:'none', background:colPas?`${colors?.neutral?.[50]||'#f9fafb'}`:'transparent' }}>
                  {HORAS.map(h=>{
                    const slotKey  = JSON.stringify({fecha:dateKey, hora:h});
                    const activo   = slotsSet.has(slotKey);
                    const bloqueado = esPasadoH(dateKey, h);

                    return (
                      <div key={h}
                        onClick={()=>!bloqueado&&toggleSlot(dateKey,h)}
                        style={{ height:`${HORA_H}px`, borderBottom:`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`, background:bloqueado?'transparent':activo?`${primary}18`:'transparent', cursor:bloqueado?'not-allowed':'pointer', transition:'background 0.1s', position:'relative', userSelect:'none' }}
                        onMouseEnter={e=>{ if(!bloqueado&&!activo) e.currentTarget.style.background=`${primary}07`; }}
                        onMouseLeave={e=>{ if(!bloqueado&&!activo) e.currentTarget.style.background='transparent'; }}
                      >
                        {/* Patrón pasado */}
                        {bloqueado && (
                          <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.03) 4px, rgba(0,0,0,0.03) 8px)', pointerEvents:'none' }}/>
                        )}
                        {/* Slot seleccionado */}
                        {activo && (
                          <div style={{ position:'absolute', inset:'1px', background:`${primary}20`, border:`2px solid ${primary}`, borderRadius:br?.md||'6px', pointerEvents:'none', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <span style={{ fontSize:fs(typo,'xs'), color:primary, fontWeight:fw(typo,'semibold') }}>{String(h).padStart(2,'0')}:00</span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Citas posicionadas */}
                  {citasD.map((c,ci)=>{
                    const cd=new Date(c.fecha_hora), hD=horaDecimal(cd);
                    if(hD<8||hD>=19) return null;
                    const top=( hD-8)*HORA_H, dur=c.TipoCita?.duracion_promedio||30, h=Math.max((dur/60)*HORA_H-3,24), col=ESTADO_COL[c.estado]||ESTADO_COL.programada;
                    return (
                      <div key={ci} style={{ position:'absolute', top:`${top+2}px`, left:'3px', right:'3px', height:`${h}px`, background:col.bg, border:`1.5px solid ${col.border}`, borderRadius:br?.md||'6px', padding:'3px 6px', overflow:'hidden', cursor:'pointer', zIndex:1, boxShadow:sh?.sm }}>
                        <div style={{ fontSize:fs(typo,'xs'), fontWeight:fw(typo,'semibold'), color:col.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {cd.toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'})} {c.Paciente?.nombre||''} {c.Paciente?.apellido||''}
                        </div>
                        {h>32&&<div style={{ fontSize:fs(typo,'xs'), color:col.text, opacity:0.75, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.TipoCita?.nombre||''}</div>}
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

      {/* Título */}
      <div style={{ marginBottom:sp?.lg||'24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:sp?.sm||'8px', marginBottom:'4px' }}>
          <div style={{ width:'38px', height:'38px', borderRadius:br?.lg||'8px', background:`linear-gradient(135deg,${primary},${secondary})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <MdEventNote size={22} color="#fff"/>
          </div>
          <h1 style={{ margin:0, fontSize:fs(typo,'2xl'), fontWeight:fw(typo,'bold'), color:colors?.neutral?.[900]||'#111827' }}>Mis Citas</h1>
        </div>
        <p style={{ margin:0, fontSize:fs(typo,'sm'), color:colors?.neutral?.[500]||'#6b7280', paddingLeft:'46px' }}>Gestiona y visualiza tu agenda médica</p>
      </div>

      {/* Error navegación */}
      {errNav && (
        <div style={{ marginBottom:sp?.md||'16px', padding:`${sp?.sm||'8px'} ${sp?.md||'16px'}`, background:colors?.error?.light||'#fee2e2', border:`1px solid ${colors?.error?.main||'#dc2626'}`, color:colors?.error?.dark||'#991b1b', borderRadius:br?.lg||'8px', fontSize:fs(typo,'sm'), fontWeight:fw(typo,'semibold'), display:'flex', alignItems:'center', gap:'8px', animation:'slideIn 0.2s ease' }}>
          <MdBlock size={16}/> {errNav}
        </div>
      )}

      {/* Barra controles */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:sp?.md||'16px', flexWrap:'wrap', gap:sp?.sm||'8px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:sp?.sm||'8px' }}>
          <button onClick={()=>navegar(-1)} style={navBtn}><MdChevronLeft size={20}/></button>
          <button onClick={()=>navegar(1)}  style={navBtn}><MdChevronRight size={20}/></button>
          <span style={{ fontSize:fs(typo,'md'), fontWeight:fw(typo,'bold'), color:colors?.neutral?.[900]||'#111827', minWidth:'200px' }}>{titulo()}</span>
          <button onClick={irAHoy} style={{ ...navBtn, padding:'6px 14px', gap:'5px' }}>
            <MdCalendarToday size={14}/><span style={{ fontSize:fs(typo,'sm'), fontWeight:fw(typo,'medium') }}>Hoy</span>
          </button>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:sp?.sm||'8px' }}>
          {slotsSet.size>0 && vista!=='mes' && (
            <>
              <button onClick={()=>setModalOpen(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 20px', background:`linear-gradient(to right,${primary},${secondary})`, color:'#fff', border:'none', borderRadius:br?.full||'9999px', fontSize:fs(typo,'sm'), fontWeight:fw(typo,'semibold'), cursor:'pointer', boxShadow:sh?.md, animation:'slideIn 0.2s ease' }}>
                <MdAdd size={18}/> Agendar Cita {slotsSet.size>1?`(${slotsSet.size}h)`:''}
              </button>
              <button onClick={limpiarSlots} style={{ ...navBtn, padding:'6px 10px' }} title="Limpiar selección"><MdClose size={16}/></button>
            </>
          )}

          <div style={{ display:'flex', background:colors?.neutral?.[100]||'#f3f4f6', borderRadius:br?.full||'9999px', padding:'3px', gap:'2px' }}>
            {['dia','semana','mes'].map(v=>(
              <button key={v} onClick={()=>cambiarVista(v)} style={btnV(v)}>
                {v==='dia'?'Día':v==='semana'?'Semana':'Mes'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chips bloques seleccionados */}
      {slotsSet.size>0 && vista!=='mes' && (
        <div style={{ marginBottom:sp?.md||'16px', display:'flex', flexWrap:'wrap', gap:sp?.xs||'4px' }}>
          {bloques.map((b,i)=>(
            <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:'4px', background:`${primary}12`, border:`1px solid ${primary}30`, borderRadius:br?.full||'9999px', padding:'4px 12px', fontSize:fs(typo,'xs'), color:primary, fontWeight:fw(typo,'semibold') }}>
              <MdAccessTime size={11}/> {b.fecha} · {String(b.horaInicio).padStart(2,'0')}:00 – {String(b.horaFin).padStart(2,'0')}:00
            </span>
          ))}
        </div>
      )}

      {/* Leyenda mes */}
      {vista==='mes' && (
        <div style={{ marginBottom:sp?.sm||'8px', fontSize:fs(typo,'xs'), color:colors?.neutral?.[400]||'#9ca3af', display:'flex', alignItems:'center', gap:'6px' }}>
          <MdCalendarToday size={11}/> Haz clic en un día para ver la agenda o agendar una cita
        </div>
      )}

      {loading && (
        <div style={{ textAlign:'center', padding:sp?.xl||'32px', color:colors?.neutral?.[500]||'#6b7280', fontSize:fs(typo,'sm') }}>
          <div style={{ width:'32px', height:'32px', border:`3px solid ${colors?.neutral?.[200]||'#e5e7eb'}`, borderTop:`3px solid ${primary}`, borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 12px' }}/>
          Cargando citas...
        </div>
      )}

      {!loading && (
        <>
          {vista==='mes'    && <VistaMes/>}
          {vista==='dia'    && <VistaHoraria esSemana={false}/>}
          {vista==='semana' && <VistaHoraria esSemana={true}/>}
        </>
      )}

      {modalOpen && (
        <ModalAgendar
          bloques={bloques}
          onClose={()=>setModalOpen(false)}
          onConfirm={handleConfirmarCita}
          primary={primary} secondary={secondary}
          colors={colors} sp={sp} br={br} sh={sh} typo={typo}
        />
      )}

      <style>{`
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes slideIn { from { opacity:0;transform:translateY(-6px); } to { opacity:1;transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUp { from { opacity:0;transform:translateY(16px); } to { opacity:1;transform:translateY(0); } }
      `}</style>
    </div>
  );
};

export default CitasDashboard;