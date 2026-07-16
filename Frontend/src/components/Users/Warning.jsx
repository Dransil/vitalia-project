import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Config/ThemeContext';
import { getCitasByDoctor, cambiarEstadoCita, getDoctorIdFromStorage } from '../../Services/Citaservice';
import {
  MdWarning, MdAccessTime, MdPerson, MdCheck, MdClose,
  MdArrowForward, MdNotifications, MdCancel, MdDone, MdExpandLess
} from 'react-icons/md';

const DC   = { neutral:{0:'#fff',50:'#f9fafb',100:'#f3f4f6',200:'#e5e7eb',300:'#d1d5db',400:'#9ca3af',500:'#6b7280',600:'#4b5563',700:'#374151',800:'#1f2937',900:'#111827'}, error:{light:'#fee2e2',main:'#dc2626',dark:'#991b1b'} };
const DCFG = { theme:{ colors:{ primary:'#0ea5e9', secondary:'#14b8a6' } } };

const fs = (t,k) => { try { return t?.fontSize?.[k]?.size||({xs:'11px',sm:'13px',md:'15px',lg:'18px',xl:'20px'}[k]||'14px'); } catch { return '14px'; } };
const fw = (t,k) => { try { return t?.fontWeight?.[k]||({normal:400,medium:500,semibold:600,bold:700}[k]||400); } catch { return 400; } };

const INTERVALO_MS    = 60 * 1000;
const MINUTOS_AVISO   = 15;
const KEY_PROXIMAS    = 'adv_proximas';  
const KEY_PERDIDAS    = 'adv_perdidas';  

const getSet = key => { try { return new Set(JSON.parse(sessionStorage.getItem(key)||'[]')); } catch { return new Set(); } };
const saveSet = (key, set) => sessionStorage.setItem(key, JSON.stringify([...set]));

const Advertencias = () => {
  const navigate = useNavigate();
  let themeContext = {};
  try { themeContext = (useTheme&&useTheme())||{}; } catch {}

  const config   = themeContext.config       || DCFG;
  const colors   = themeContext.colors       || DC;
  const typo     = themeContext.typography   || {};
  const primary  = config?.theme?.colors?.primary  || DCFG.theme.colors.primary;
  const secondary= config?.theme?.colors?.secondary|| DCFG.theme.colors.secondary;

  const [cola, setCola] = useState([]);
  const [procesando, setProcesando] = useState(false);
  const [minimizada, setMinimizada] = useState(false);
  const timerRef = useRef(null);

  const buscarGrupo = useCallback((cita, todasCitas) => {
    const mismodia = todasCitas.filter(c =>
      c.id_paciente === cita.id_paciente &&
      c.id_cita     !== cita.id_cita &&
      ['programada','confirmada'].includes(c.estado) &&
      new Date(c.fecha_hora).toDateString() === new Date(cita.fecha_hora).toDateString()
    );
    const grupo = [cita, ...mismodia].sort((a,b)=>new Date(a.fecha_hora)-new Date(b.fecha_hora));
    return grupo;
  }, []);

  const limpiarSessionStorage = useCallback(async () => {
    const id = getDoctorIdFromStorage();
    if (!id) return;

    const result = await getCitasByDoctor(id);
    if (!result.ok) return;

    const citas = result.data || [];
    
    const idsPendientes = new Set(
      citas
        .filter(c => ['programada','confirmada'].includes(c.estado))
        .map(c => c.id_cita)
    );

    const proximasSet = getSet(KEY_PROXIMAS);
    const nuevasProximas = new Set();
    for (const key of proximasSet) {
      const idCita = parseInt(key.replace('prox_', ''));
      if (idsPendientes.has(idCita)) {
        nuevasProximas.add(key);
      }
    }
    saveSet(KEY_PROXIMAS, nuevasProximas);

    const perdidasSet = getSet(KEY_PERDIDAS);
    const nuevasPerdidas = new Set();
    for (const key of perdidasSet) {
      const idCita = parseInt(key.replace('perd_', ''));
      if (idsPendientes.has(idCita)) {
        nuevasPerdidas.add(key);
      }
    }
    saveSet(KEY_PERDIDAS, nuevasPerdidas);
  }, []);

  const revisar = useCallback(async () => {
    const id = getDoctorIdFromStorage();
    if (!id) return;

    await limpiarSessionStorage();

    const result = await getCitasByDoctor(id);
    if (!result.ok) return;

    const citas = result.data || [];
    const ahora = new Date();
    const yaProximas = getSet(KEY_PROXIMAS);
    const yaPerdidas = getSet(KEY_PERDIDAS);
    
    const advertenciasEnCola = new Set(
      cola.map(item => item.tipo === 'proxima' ? `prox_${item.cita.id_cita}` : `perd_${item.cita.id_cita}`)
    );
    
    const nuevas = [];

    citas.forEach(c => {
      if (!['programada','confirmada'].includes(c.estado)) return;
      
      const fechaCita = new Date(c.fecha_hora);
      const diffMin = (fechaCita - ahora) / 60000;
      const keyProx = `prox_${c.id_cita}`;
      const keyPerd = `perd_${c.id_cita}`;

      if (diffMin > 0 && diffMin <= MINUTOS_AVISO) {
        if (!yaProximas.has(keyProx) && !advertenciasEnCola.has(keyProx)) {
          nuevas.push({ tipo: 'proxima', cita: c, diffMin: Math.round(diffMin) });
        }
      }
      else if (diffMin < 0) {
        if (!yaPerdidas.has(keyPerd) && !advertenciasEnCola.has(keyPerd)) {
          const grupo = buscarGrupo(c, citas);
          nuevas.push({ tipo: 'perdida', cita: c, citasGrupo: grupo });
        }
      }
    });

    if (nuevas.length > 0) {
      setCola(prev => {
        const existingIds = new Set(prev.map(item => 
          item.tipo === 'proxima' ? `prox_${item.cita.id_cita}` : `perd_${item.cita.id_cita}`
        ));
        const uniqueNuevas = nuevas.filter(n => 
          !existingIds.has(n.tipo === 'proxima' ? `prox_${n.cita.id_cita}` : `perd_${n.cita.id_cita}`)
        );
        return [...prev, ...uniqueNuevas];
      });
    }
  }, [buscarGrupo, limpiarSessionStorage, cola]);

  useEffect(() => {
    revisar();
    timerRef.current = setInterval(revisar, INTERVALO_MS);
    return () => clearInterval(timerRef.current);
  }, [revisar]);

  const eliminarDeCola = useCallback((advertencia) => {
    setCola(prev => prev.filter(item => {
      if (advertencia.tipo === 'proxima') {
        return !(item.tipo === 'proxima' && item.cita.id_cita === advertencia.cita.id_cita);
      } else {
        return !(item.tipo === 'perdida' && item.cita.id_cita === advertencia.cita.id_cita);
      }
    }));
  }, []);

  const guardarEnStorage = useCallback((advertencia) => {
    if (advertencia.tipo === 'proxima') {
      const proximasSet = getSet(KEY_PROXIMAS);
      proximasSet.add(`prox_${advertencia.cita.id_cita}`);
      saveSet(KEY_PROXIMAS, proximasSet);
    } else {
      const perdidasSet = getSet(KEY_PERDIDAS);
      perdidasSet.add(`perd_${advertencia.cita.id_cita}`);
      saveSet(KEY_PERDIDAS, perdidasSet);
    }
  }, []);

  const handleCompletada = useCallback(async (advertencia) => {
    setProcesando(true);
    try {
      const citasGrupo = advertencia.citasGrupo || [advertencia.cita];
      for (const c of citasGrupo) {
        await cambiarEstadoCita(c.id_cita, 'completada');
      }
      guardarEnStorage(advertencia);
      eliminarDeCola(advertencia);
      navigate(`/Odonto_Visor/${advertencia.cita.Paciente?.id_paciente || advertencia.cita.id_paciente}`);
    } catch (error) { 
      console.error('Error al completar cita:', error);
    } finally { 
      setProcesando(false); 
    }
  }, [guardarEnStorage, eliminarDeCola, navigate]);

  const handleCancelada = useCallback(async (advertencia) => {
    setProcesando(true);
    try {
      const citasGrupo = advertencia.citasGrupo || [advertencia.cita];
      for (const c of citasGrupo) {
        await cambiarEstadoCita(c.id_cita, 'cancelada', 'Cancelada por el doctor');
      }
      eliminarDeCola(advertencia);
      setTimeout(() => revisar(), 500);
    } catch (error) { 
      console.error('Error al cancelar cita:', error);
    } finally { 
      setProcesando(false); 
    }
  }, [eliminarDeCola, revisar]);

  const handleVerPaciente = useCallback((advertencia) => {
    guardarEnStorage(advertencia);
    eliminarDeCola(advertencia);
    const pid = advertencia.cita.Paciente?.id_paciente || advertencia.cita.id_paciente;
    navigate(`/Odonto_Visor/${pid}`);
  }, [guardarEnStorage, eliminarDeCola, navigate]);

  const handleIrACita = useCallback((advertencia) => {
    guardarEnStorage(advertencia);
    eliminarDeCola(advertencia);
    navigate(`/ondate/${advertencia.cita.id_cita}`);
  }, [guardarEnStorage, eliminarDeCola, navigate]);

  const toggleMinimizar = () => {
    setMinimizada(!minimizada);
  };

  if (cola.length === 0) return null;

  const actual = cola[0];
  const totalAdvertencias = cola.length;

  if (minimizada) {
    return (
      <div style={{
        position:'fixed', 
        top: '20px',
        right: '20px', 
        zIndex: 9000,
        pointerEvents: 'auto',
      }}>
        <div 
          onClick={toggleMinimizar}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: primary,
            color: '#fff',
            borderRadius: '40px',
            padding: '10px 16px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s ease',
            fontWeight: fw(typo, 'semibold'),
            fontSize: fs(typo, 'sm'),
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MdNotifications size={20} />
          <span>{totalAdvertencias} advertencia{totalAdvertencias !== 1 ? 's' : ''} pendiente{totalAdvertencias !== 1 ? 's' : ''}</span>
          <MdExpandLess size={18} style={{ transform: 'rotate(180deg)' }} />
        </div>
      </div>
    );
  }

  const cita = actual.cita;
  const fecha = new Date(cita.fecha_hora);
  const esProxima = actual.tipo === 'proxima';
  const grupo = actual.citasGrupo || [cita];
  const tieneGrupo = grupo.length > 1;

  const horaInicio = new Date(grupo[0].fecha_hora).toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'});
  const horaFin = (() => {
    const ultima = grupo[grupo.length-1];
    const d = new Date(ultima.fecha_hora);
    d.setMinutes(d.getMinutes() + (ultima.duracion_minutos||30));
    return d.toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'});
  })();

  return (
    <>
      <div style={{
        position:'fixed', 
        top: '20px',
        right: '20px', 
        zIndex: 9000,
        display:'flex', 
        flexDirection:'column', 
        alignItems:'flex-end',
        gap:'10px', 
        pointerEvents:'none',
      }}>
        {totalAdvertencias > 0 && (
          <div 
            onClick={toggleMinimizar}
            style={{
              pointerEvents:'auto',
              display:'inline-flex', 
              alignItems:'center', 
              gap:'5px',
              background: primary, 
              color:'#fff',
              borderRadius:'20px', 
              padding:'6px 12px',
              fontSize:'12px', 
              fontWeight:fw(typo,'semibold'),
              boxShadow:'0 2px 8px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <MdNotifications size={14}/>
            <span>{totalAdvertencias} advertencia{totalAdvertencias !== 1 ? 's' : ''}</span>
            <MdExpandLess size={14} style={{ transform: 'rotate(180deg)' }} />
          </div>
        )}

        <div style={{
          pointerEvents:'auto',
          background:colors?.neutral?.[0]||'#fff',
          borderRadius:'16px',
          width:'360px',
          maxWidth: 'calc(100vw - 40px)',
          overflow:'hidden',
          boxShadow:'0 8px 32px rgba(0,0,0,0.18)',
          border:`1px solid ${esProxima?primary+'40':colors?.neutral?.[200]||'#e5e7eb'}`,
          animation:'slideInRight 0.3s ease',
        }}>
          <div style={{
            height:'4px',
            background: esProxima
              ? `linear-gradient(to right,${primary},${secondary})`
              : 'linear-gradient(to right,#f59e0b,#ef4444)',
          }}/>

          <div style={{
            padding:'12px 14px 10px',
            display:'flex', 
            alignItems:'flex-start', 
            justifyContent:'space-between', 
            gap:'8px',
            borderBottom:`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`,
          }}>
            <div style={{display:'flex', alignItems:'center', gap:'8px', flex: 1}}>
              <div style={{
                width:'32px', 
                height:'32px', 
                borderRadius:'8px', 
                flexShrink:0,
                background: esProxima ? `${primary}15` : '#fef3c7',
                display:'flex', 
                alignItems:'center', 
                justifyContent:'center',
              }}>
                {esProxima
                  ? <MdAccessTime size={18} style={{color:primary}}/>
                  : <MdWarning size={18} style={{color:'#f59e0b'}}/>
                }
              </div>
              <div>
                <div style={{fontSize:fs(typo,'sm'),fontWeight:fw(typo,'bold'),color:colors?.neutral?.[900]||'#111827',lineHeight:'1.2'}}>
                  {esProxima ? `Cita en ${actual.diffMin} min` : 'Cita sin registrar'}
                </div>
                <div style={{fontSize:'10px',color:colors?.neutral?.[400]||'#9ca3af',marginTop:'1px'}}>
                  {esProxima ? 'Está por iniciar' : 'Cita pasada sin resolver'}
                </div>
              </div>
            </div>
            <button onClick={toggleMinimizar} 
              style={{background:'none', border:'none', cursor:'pointer', color:colors?.neutral?.[400]||'#9ca3af', display:'flex', padding:'4px', borderRadius:'6px', flexShrink:0}}
              title="Minimizar">
              <MdExpandLess size={18} style={{ transform: 'rotate(180deg)' }} />
            </button>
          </div>

          <div style={{padding:'10px 14px', display:'flex', flexDirection:'column', gap:'6px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
              <div style={{width:'28px',height:'28px',borderRadius:'50%',background:`${primary}15`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <MdPerson size={15} style={{color:primary}}/>
              </div>
              <div>
                <div style={{fontSize:fs(typo,'sm'),fontWeight:fw(typo,'semibold'),color:colors?.neutral?.[800]||'#1f2937'}}>
                  {cita.Paciente?.nombre || cita.nombre_paciente || 'Paciente'} {cita.Paciente?.apellido || cita.apellido_paciente || ''}
                </div>
                {cita.TipoCita?.nombre && (
                  <div style={{fontSize:'10px',color:colors?.neutral?.[400]||'#9ca3af'}}>{cita.TipoCita.nombre}</div>
                )}
              </div>
            </div>

            <div style={{
              display:'flex', 
              alignItems:'center', 
              gap:'6px',
              padding:'6px 10px',
              background: esProxima ? `${primary}08` : '#fffbeb',
              borderRadius:'8px',
              border: `1px solid ${esProxima ? primary+'20' : '#fde68a'}`,
              fontSize:'11px',
              color: esProxima ? primary : '#92400e',
              fontWeight: fw(typo,'semibold'),
            }}>
              <MdAccessTime size={13}/>
              {tieneGrupo
                ? `${horaInicio} – ${horaFin} (${grupo.length} citas)`
                : fecha.toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'})
              }
            </div>

            {tieneGrupo && !esProxima && (
              <div style={{display:'flex', flexDirection:'column', gap:'2px', maxHeight:'72px', overflowY:'auto'}}>
                {grupo.map((c,i)=>(
                  <div key={c.id_cita} style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'10px', color:colors?.neutral?.[500]||'#6b7280', padding:'2px 4px'}}>
                    <div style={{width:'4px',height:'4px',borderRadius:'50%',background:primary,flexShrink:0}}/>
                    <MdAccessTime size={10}/>
                    {new Date(c.fecha_hora).toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'})} · {c.duracion_minutos||30} min
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{padding:'8px 14px 12px', display:'flex', flexDirection:'column', gap:'6px'}}>
            {esProxima ? (
              <>
                <div style={{display:'flex', gap:'6px'}}>
                  <button onClick={toggleMinimizar} disabled={procesando}
                    style={{flex:1, padding:'8px', background:colors?.neutral?.[100]||'#f3f4f6', border:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}`, borderRadius:'8px', fontSize:'11px', fontWeight:fw(typo,'semibold'), color:colors?.neutral?.[600]||'#4b5563', cursor:'pointer'}}>
                    Minimizar
                  </button>
                  <button onClick={()=>handleVerPaciente(actual)} disabled={procesando}
                    style={{flex:2, padding:'8px', background:`linear-gradient(to right,${primary},${secondary})`, border:'none', borderRadius:'8px', fontSize:'11px', fontWeight:fw(typo,'semibold'), color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px'}}>
                    <MdPerson size={13}/> Ver Paciente <MdArrowForward size={12}/>
                  </button>
                </div>
                <button onClick={()=>handleIrACita(actual)} disabled={procesando}
                  style={{width:'100%', padding:'7px', background:'transparent', border:`1px solid ${primary}40`, borderRadius:'8px', fontSize:'11px', fontWeight:fw(typo,'semibold'), color:primary, cursor:'pointer'}}>
                  Ir a la cita
                </button>
              </>
            ) : (
              <>
                <div style={{fontSize:'11px', color:colors?.neutral?.[500]||'#6b7280', textAlign:'center', marginBottom:'2px'}}>
                  ¿Se llevó a cabo {tieneGrupo ? 'estas citas' : 'esta cita'}?
                </div>
                <div style={{display:'flex', gap:'6px'}}>
                  <button onClick={()=>handleCancelada(actual)} disabled={procesando}
                    style={{flex:1, padding:'8px', background:colors?.error?.light||'#fee2e2', border:`1px solid ${colors?.error?.main||'#dc2626'}40`, borderRadius:'8px', fontSize:'11px', fontWeight:fw(typo,'semibold'), color:colors?.error?.dark||'#991b1b', cursor:procesando?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'4px'}}>
                    <MdCancel size={13}/> Fue cancelada
                  </button>
                  <button onClick={()=>handleCompletada(actual)} disabled={procesando}
                    style={{flex:1, padding:'8px', background:'#d1fae5', border:'1px solid #6ee7b740', borderRadius:'8px', fontSize:'11px', fontWeight:fw(typo,'semibold'), color:'#065f46', cursor:procesando?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'4px'}}>
                    <MdDone size={13}/> Se realizó
                  </button>
                </div>
                <button onClick={()=>handleCompletada(actual)} disabled={procesando}
                  style={{width:'100%', padding:'7px', background:`linear-gradient(to right,${primary},${secondary})`, border:'none', borderRadius:'8px', fontSize:'11px', fontWeight:fw(typo,'semibold'), color:'#fff', cursor:procesando?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px'}}>
                  <MdCheck size={13}/> Se realizó · Ir al odontograma <MdArrowForward size={12}/>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity:0; transform:translateX(24px); }
          to   { opacity:1; transform:translateX(0); }
        }
      `}</style>
    </>
  );
};

export default Advertencias;