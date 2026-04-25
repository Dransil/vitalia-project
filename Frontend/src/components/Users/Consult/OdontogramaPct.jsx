import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdSave, MdHistory, MdPhone, MdEmail, MdClose } from 'react-icons/md';
import pacienteService from '../../../Services/pacienteService';

// ─── Tema ─────────────────────────────────────────────────────────────────────
let PRIMARY = '#0ea5e9', SECONDARY = '#14b8a6';
try {
  const { useTheme } = require('../../../Config/ThemeContext');
  // Se usa dentro del componente, aquí solo fallback
} catch {}

// ─── Estados ──────────────────────────────────────────────────────────────────
const STATES = {
  bien:     { label: 'Sano',             crown: '#f8fafc', root: '#e2e8f0', border: '#94a3b8', dot: '#94a3b8' },
  caries:   { label: 'Caries',           crown: '#6aaa56', root: '#4a8c3a', border: '#3d7a30', dot: '#3d7a30' },
  retirado: { label: 'Retirado',         crown: '#fca5a5', root: '#f87171', border: '#ef4444', dot: '#ef4444' },
  conducto: { label: 'Trat. Conducto',   crown: '#fde68a', root: '#fbbf24', border: '#d97706', dot: '#d97706' },
  protesis: { label: 'Prótesis/Implante',crown: '#cbd5e1', root: '#94a3b8', border: '#64748b', dot: '#64748b' },
};

const STATE_KEYS = Object.keys(STATES);

// ─── Dientes FDI sin terceros molares ─────────────────────────────────────────
const UPPER_TEETH = [17,16,15,14,13,12,11,21,22,23,24,25,26,27];
const LOWER_TEETH = [47,46,45,44,43,42,41,31,32,33,34,35,36,37];

const TOOTH_NAMES = {
  11:'Inc. central', 12:'Inc. lateral', 13:'Canino',
  14:'Premolar 1',   15:'Premolar 2',   16:'Molar 1',   17:'Molar 2',
  21:'Inc. central', 22:'Inc. lateral', 23:'Canino',
  24:'Premolar 1',   25:'Premolar 2',   26:'Molar 1',   27:'Molar 2',
  31:'Inc. central', 32:'Inc. lateral', 33:'Canino',
  34:'Premolar 1',   35:'Premolar 2',   36:'Molar 1',   37:'Molar 2',
  41:'Inc. central', 42:'Inc. lateral', 43:'Canino',
  44:'Premolar 1',   45:'Premolar 2',   46:'Molar 1',   47:'Molar 2',
};

const getType = n => {
  const u = n % 10;
  if (u <= 2) return 'incisor';
  if (u === 3) return 'canine';
  if (u <= 5) return 'premolar';
  return 'molar';
};

// ─── Posiciones en arco ───────────────────────────────────────────────────────
const toRad = d => d * Math.PI / 180;
const buildArc = (cx, cy, rx, ry, a0, a1, n) =>
  Array.from({ length: n }, (_, i) => {
    const a = a0 + (a1 - a0) * i / (n - 1);
    return { x: cx + rx * Math.cos(toRad(a)), y: cy + ry * Math.sin(toRad(a)), a };
  });

// SVG viewBox = 0 0 600 680
// Superior: herradura abierta abajo  → ángulos 210°→330°, centro (300,270)
// Inferior: herradura abierta arriba → ángulos  30°→150°, centro (300,410)
const UP = buildArc(300, 270, 210, 140, 210, 330, 14);
const LO = buildArc(300, 410, 210, 140,  30, 150, 14);

// ─── Tamaños por tipo ─────────────────────────────────────────────────────────
const SIZES = { incisor:{w:18,h:26}, canine:{w:17,h:28}, premolar:{w:20,h:24}, molar:{w:26,h:22} };

// ─── Paths de corona y raíz (centrados en 0,0) ───────────────────────────────
// Corona arriba (-y), raíz abajo (+y). Rotaremos el grupo para que la corona
// apunte hacia el centro del arco.
const crownPath = (type, w, h) => {
  const hw = w / 2, hh = h / 2;
  switch (type) {
    case 'incisor':
      return `M${-hw},${hh*0.1} L${-hw*0.9},${-hh} L${hw*0.9},${-hh} L${hw},${hh*0.1}
              Q0,${hh*0.35} ${-hw},${hh*0.1}Z`;
    case 'canine':
      return `M${-hw},${hh*0.1} L${-hw*0.7},${-hh*0.6} L0,${-hh}
              L${hw*0.7},${-hh*0.6} L${hw},${hh*0.1}
              Q0,${hh*0.35} ${-hw},${hh*0.1}Z`;
    case 'premolar':
      return `M${-hw},${hh*0.1} L${-hw*0.9},${-hh*0.5} Q${-hw*0.4},${-hh} 0,${-hh*0.9}
              Q${hw*0.4},${-hh} ${hw*0.9},${-hh*0.5} L${hw},${hh*0.1}
              Q0,${hh*0.4} ${-hw},${hh*0.1}Z`;
    case 'molar':
    default:
      return `M${-hw},${hh*0.1} L${-hw*0.95},${-hh*0.35} Q${-hw*0.6},${-hh} ${-hw*0.2},${-hh}
              L${hw*0.2},${-hh} Q${hw*0.6},${-hh} ${hw*0.95},${-hh*0.35}
              L${hw},${hh*0.1} Q0,${hh*0.45} ${-hw},${hh*0.1}Z`;
  }
};

const rootPath = (type, w, h) => {
  const hw = w / 2, hh = h / 2;
  if (type === 'molar')
    return `M${-hw*0.55},${hh*0.05} Q${-hw*0.6},${hh*0.9} ${-hw*0.3},${hh}
            Q0,${hh*1.1} ${hw*0.3},${hh}
            Q${hw*0.6},${hh*0.9} ${hw*0.55},${hh*0.05}Z`;
  return `M${-hw*0.38},${hh*0.05} Q${-hw*0.4},${hh*0.9} 0,${hh*1.05}
          Q${hw*0.4},${hh*0.9} ${hw*0.38},${hh*0.05}Z`;
};

// ─── Dibujo de un diente ──────────────────────────────────────────────────────
const Tooth = ({ x, y, a, num, isUpper, stateKey, selected, hovered, onClick, onHover }) => {
  const type  = getType(num);
  const st    = STATES[stateKey] || STATES.bien;
  const { w, h } = SIZES[type];

  // La corona debe mirar hacia el centro del arco:
  // Para superior: corona mira hacia +y (abajo = centro del arco que está abajo)
  // pero el centro está EN el arco, no fuera. La corona mira hacia adentro del arco.
  // Vector desde el punto hacia el centro del arco:
  const cx = 300, cy = isUpper ? 270 : 410;
  const dx = cx - x, dy = cy - y;
  const rotAngle = Math.atan2(dy, dx) * 180 / Math.PI - 90;
  // -90 porque nuestro path tiene corona en -y (arriba) y queremos que apunte hacia el centro

  const scale = selected ? 1.22 : hovered ? 1.1 : 1;

  return (
    <g
      transform={`translate(${x},${y})`}
      onClick={() => onClick(num)}
      onMouseEnter={() => onHover(num)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: 'pointer' }}
    >
      {/* Glow selección */}
      {selected && (
        <circle r={Math.max(w,h)*0.72} fill={PRIMARY + '30'} stroke={PRIMARY} strokeWidth="1.5"/>
      )}
      {hovered && !selected && (
        <circle r={Math.max(w,h)*0.65} fill="#f1f5f9" opacity="0.7"/>
      )}

      <g transform={`rotate(${rotAngle}) scale(${scale})`}>
        {/* Raíz */}
        {stateKey !== 'retirado' && (
          <path d={rootPath(type, w, h)} fill={st.root} stroke={st.border} strokeWidth="0.7" opacity="0.8"/>
        )}
        {/* Corona */}
        <path d={crownPath(type, w, h)} fill={st.crown} stroke={st.border} strokeWidth={selected ? 1.8 : 1.2}/>

        {/* Surcos oclusales en molares */}
        {type === 'molar' && stateKey !== 'retirado' && (
          <>
            <line x1={-w*0.18} y1={-h*0.25} x2={w*0.18} y2={-h*0.25}
              stroke={st.border} strokeWidth="0.7" opacity="0.5" strokeLinecap="round"/>
            <line x1={0} y1={-h*0.42} x2={0} y2={-h*0.1}
              stroke={st.border} strokeWidth="0.7" opacity="0.5" strokeLinecap="round"/>
          </>
        )}
        {/* Surco premolar */}
        {type === 'premolar' && stateKey !== 'retirado' && (
          <line x1={0} y1={-h*0.72} x2={0} y2={-h*0.15}
            stroke={st.border} strokeWidth="0.6" opacity="0.45" strokeLinecap="round"/>
        )}

        {/* X retirado */}
        {stateKey === 'retirado' && (
          <>
            <line x1={-w*0.38} y1={-h*0.38} x2={w*0.38} y2={h*0.12}
              stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1={w*0.38} y1={-h*0.38} x2={-w*0.38} y2={h*0.12}
              stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round"/>
          </>
        )}
      </g>
    </g>
  );
};

// ─── Número del diente ────────────────────────────────────────────────────────
const ToothNum = ({ x, y, num, isUpper, selected }) => {
  const cx = 300, cy = isUpper ? 270 : 410;
  const dx = x - cx, dy = y - cy;
  const dist = Math.sqrt(dx*dx + dy*dy) || 1;
  const offset = isUpper ? 30 : 30;
  const lx = x + (dx/dist)*offset;
  const ly = y + (dy/dist)*offset;
  return (
    <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
      fontSize="9.5" fill={selected ? PRIMARY : '#94a3b8'}
      fontFamily="'DM Mono',monospace" fontWeight={selected?'700':'600'}>
      {num}
    </text>
  );
};

// ─── Modal editor ─────────────────────────────────────────────────────────────
const ToothEditor = ({ num, stateKey, onChange, onClose, primary }) => {
  if (!num) return null;
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:3000,
      background:'rgba(15,23,42,0.55)', backdropFilter:'blur(4px)',
      display:'flex', alignItems:'center', justifyContent:'center',
    }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:'#fff', borderRadius:18, padding:'24px 26px', width:300,
        boxShadow:'0 28px 80px rgba(0,0,0,0.20)', border:'1px solid #e2e8f0',
        animation:'popIn .15s ease',
      }}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
          <div>
            <div style={{fontWeight:800,fontSize:15,color:'#0f172a'}}>Diente {num}</div>
            <div style={{fontSize:12,color:'#94a3b8',marginTop:2}}>{TOOTH_NAMES[num]}</div>
          </div>
          <button onClick={onClose} style={{background:'#f1f5f9',border:'none',borderRadius:8,padding:5,cursor:'pointer',display:'flex'}}>
            <MdClose size={16} color="#64748b"/>
          </button>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {STATE_KEYS.map(key => {
            const val = STATES[key];
            const active = stateKey === key;
            return (
              <button key={key} onClick={()=>{onChange(num,key);onClose();}} style={{
                display:'flex', alignItems:'center', gap:11,
                padding:'9px 12px', borderRadius:10, cursor:'pointer',
                background: active ? '#f0f9ff' : '#f8fafc',
                border: `2px solid ${active ? primary : '#e2e8f0'}`,
                transition:'border-color 0.12s',
              }}
                onMouseEnter={e=>{if(!active) e.currentTarget.style.borderColor='#cbd5e1';}}
                onMouseLeave={e=>{if(!active) e.currentTarget.style.borderColor='#e2e8f0';}}
              >
                <div style={{
                  width:24, height:24, borderRadius:6, flexShrink:0,
                  background:val.crown, border:`2px solid ${val.border}`,
                  position:'relative', overflow:'hidden',
                }}>
                  {key==='retirado' && (
                    <svg width="24" height="24" style={{position:'absolute',inset:0}}>
                      <line x1="4" y1="4" x2="20" y2="20" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"/>
                      <line x1="20" y1="4" x2="4" y2="20" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
                <span style={{fontSize:13,fontWeight:active?700:500,color:'#1e293b',flex:1,textAlign:'left'}}>
                  {val.label}
                </span>
                {active && <span style={{color:primary,fontWeight:800,fontSize:15}}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const OdontogramaPct = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  let primary = '#0ea5e9', secondary = '#14b8a6';
  try {
    const { useTheme } = require('../../../Config/ThemeContext');
    const tc = useTheme() || {};
    primary   = tc?.config?.theme?.colors?.primary   || primary;
    secondary = tc?.config?.theme?.colors?.secondary || secondary;
  } catch {}

  const [paciente,      setPaciente]      = useState(null);
  const [loadError,     setLoadError]     = useState('');
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [saveMsg,       setSaveMsg]       = useState('');
  const [toothStates,   setToothStates]   = useState({});
  const [selected,      setSelected]      = useState(null);
  const [hovered,       setHovered]       = useState(null);
  const [hasChanges,    setHasChanges]    = useState(false);
  const [showHistorial, setShowHistorial] = useState(false);

  useEffect(() => {
    if (!id) { setLoadError('ID no encontrado.'); setLoading(false); return; }
    (async () => {
      try {
        const res = await pacienteService.obtenerPaciente(id);
        if (res?.ok && res.data) {
          setPaciente(res.data);
          if (res.data.odontograma) {
            try { setToothStates(typeof res.data.odontograma === 'string' ? JSON.parse(res.data.odontograma) : res.data.odontograma); }
            catch {}
          }
        } else {
          setLoadError(res?.msg || 'No se pudo cargar el paciente.');
        }
      } catch { setLoadError('Error de conexión.'); }
      finally  { setLoading(false); }
    })();
  }, [id]);

  const handleChange = useCallback((num, key) => {
    setToothStates(prev => ({ ...prev, [num]: key }));
    setHasChanges(true);
  }, []);

  const handleSave = async () => {
    setSaving(true); setSaveMsg('');
    try {
      const res = await pacienteService.actualizarPaciente(id, { odontograma: JSON.stringify(toothStates) });
      if (res?.ok) { setSaveMsg('ok'); setHasChanges(false); setTimeout(()=>setSaveMsg(''),3000); }
      else setSaveMsg('err');
    } catch { setSaveMsg('err'); }
    finally { setSaving(false); }
  };

  const allTeeth = [...UPPER_TEETH, ...LOWER_TEETH];
  const counts   = STATE_KEYS.reduce((a,k)=>({...a,[k]:allTeeth.filter(n=>(toothStates[n]||'bien')===k).length}),{});

  if (loading) return (
    <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'#f1f5f9'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:38,height:38,borderRadius:'50%',border:'3px solid #e2e8f0',borderTopColor:primary,animation:'spin 0.8s linear infinite',margin:'0 auto'}}/>
        <p style={{marginTop:14,color:'#64748b',fontSize:13,fontWeight:500}}>Cargando...</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const sn = 'S/N';

  return (
    <div style={{
      position:'fixed', inset:0, overflow:'auto', zIndex:1000,
      background:'#f0f4f8', fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",
    }}>
      <style>{`
        @keyframes spin  {to{transform:rotate(360deg)}}
        @keyframes popIn {from{transform:scale(.88);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes up    {from{transform:translateY(8px);opacity:0}to{transform:translateY(0);opacity:1}}
        *{box-sizing:border-box}
      `}</style>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div style={{
        background:'#fff', borderBottom:'1px solid #e2e8f0',
        padding:'11px 20px', position:'sticky', top:0, zIndex:200,
        boxShadow:'0 1px 6px rgba(0,0,0,0.06)',
        display:'flex', alignItems:'center', justifyContent:'space-between', gap:10,
      }}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <button onClick={()=>navigate(-1)} style={{
            background:'#f1f5f9',border:'1px solid #e2e8f0',borderRadius:8,
            padding:'6px 8px',cursor:'pointer',display:'flex',color:'#64748b',
          }}>
            <MdArrowBack size={19}/>
          </button>
          <div>
            <div style={{fontWeight:800,fontSize:15,color:'#0f172a',lineHeight:1}}>Odontograma</div>
            <div style={{fontSize:11,color:'#94a3b8',marginTop:1}}>
              {paciente ? `${paciente.nombre} ${paciente.apellido} · CI ${paciente.cedula}` : loadError || sn}
            </div>
          </div>
        </div>

        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {saveMsg==='ok' && <span style={{fontSize:12,fontWeight:600,padding:'4px 12px',borderRadius:20,background:'#d1fae5',color:'#065f46',border:'1px solid #6ee7b7'}}>✓ Guardado</span>}
          {saveMsg==='err'&& <span style={{fontSize:12,fontWeight:600,padding:'4px 12px',borderRadius:20,background:'#fee2e2',color:'#991b1b',border:'1px solid #fca5a5'}}>✗ Error</span>}
          {hasChanges && !saveMsg && <span style={{fontSize:11,fontWeight:600,color:'#b45309',background:'#fffbeb',padding:'3px 10px',borderRadius:20,border:'1px solid #fde68a'}}>Sin guardar</span>}
          <button onClick={handleSave} disabled={saving||!hasChanges} style={{
            display:'flex',alignItems:'center',gap:6,
            padding:'8px 18px',borderRadius:9,fontSize:13,fontWeight:700,
            background: hasChanges ? `linear-gradient(135deg,${primary},${secondary})` : '#e2e8f0',
            color: hasChanges ? '#fff' : '#94a3b8',
            border:'none', cursor: hasChanges ? 'pointer' : 'not-allowed',
            boxShadow: hasChanges ? `0 3px 10px ${primary}44` : 'none',
            transition:'0.18s',
          }}>
            <MdSave size={15}/>{saving?'Guardando…':'Guardar'}
          </button>
        </div>
      </div>

      <div style={{maxWidth:900,margin:'0 auto',padding:'18px 16px 48px'}}>

        {/* ── INFO PACIENTE ─────────────────────────────────────────────── */}
        <div style={{
          background:'#fff', borderRadius:12, padding:'14px 18px',
          border:`1px solid ${loadError?'#fca5a5':'#e2e8f0'}`,
          marginBottom:14, display:'flex', alignItems:'center',
          justifyContent:'space-between', flexWrap:'wrap', gap:10,
          boxShadow:'0 1px 4px rgba(0,0,0,0.04)',
          animation:'up .3s ease',
        }}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{
              width:44,height:44,borderRadius:'50%',fontSize:20,flexShrink:0,
              background:`linear-gradient(135deg,${primary}18,${secondary}18)`,
              border:`2px solid ${primary}30`,
              display:'flex',alignItems:'center',justifyContent:'center',
            }}>🦷</div>
            <div>
              <div style={{fontWeight:800,fontSize:16,color:paciente?'#0f172a':'#94a3b8'}}>
                {paciente?`${paciente.nombre} ${paciente.apellido}`:sn}
              </div>
              <div style={{fontSize:11,color:'#94a3b8',marginTop:2}}>
                CI: {paciente?.cedula||sn}
                {paciente?.grupo_sanguineo&&` · ${paciente.grupo_sanguineo}`}
              </div>
              {loadError && <div style={{fontSize:11,color:'#ef4444',marginTop:2}}>{loadError}</div>}
            </div>
          </div>

          <div style={{display:'flex',gap:16,alignItems:'center',flexWrap:'wrap'}}>
            <span style={{display:'flex',alignItems:'center',gap:5,fontSize:12,color:paciente?.telefono?'#475569':'#cbd5e1'}}>
              <MdPhone size={13} style={{color:paciente?.telefono?primary:'#cbd5e1'}}/>
              {paciente?.telefono||sn}
            </span>
            <span style={{display:'flex',alignItems:'center',gap:5,fontSize:12,color:paciente?.email?'#475569':'#cbd5e1'}}>
              <MdEmail size={13} style={{color:paciente?.email?primary:'#cbd5e1'}}/>
              {paciente?.email||sn}
            </span>
            <button onClick={()=>setShowHistorial(v=>!v)} style={{
              display:'flex',alignItems:'center',gap:6,
              padding:'7px 14px',borderRadius:8,fontSize:12,fontWeight:600,
              background:showHistorial?primary:'#f1f5f9',
              color:showHistorial?'#fff':'#475569',
              border:`1px solid ${showHistorial?primary:'#e2e8f0'}`,
              cursor:'pointer',transition:'0.15s',
            }}>
              <MdHistory size={14}/>Historial
            </button>
          </div>
        </div>

        {/* ── HISTORIAL ────────────────────────────────────────────────── */}
        {showHistorial && (
          <div style={{
            background:'#fff',borderRadius:12,padding:'16px 18px',
            border:'1px solid #e2e8f0',marginBottom:14,
            boxShadow:'0 1px 4px rgba(0,0,0,0.04)',animation:'up .2s ease',
          }}>
            <div style={{fontWeight:700,fontSize:13,color:'#0f172a',marginBottom:8,display:'flex',alignItems:'center',gap:6}}>
              <MdHistory size={15} style={{color:primary}}/>Historial de Citas
            </div>
            <div style={{color:'#94a3b8',fontSize:13,textAlign:'center',padding:'18px 0'}}>
              Se integrará con el servicio de citas del paciente.
            </div>
          </div>
        )}

        {/* ── ODONTOGRAMA ──────────────────────────────────────────────── */}
        <div style={{
          background:'#fff', borderRadius:14,
          border:'1px solid #e2e8f0',
          boxShadow:'0 2px 14px rgba(0,0,0,0.07)',
          overflow:'hidden', animation:'up .4s ease',
        }}>
          {/* Título */}
          <div style={{
            padding:'12px 18px', borderBottom:'1px solid #f1f5f9',
            display:'flex',alignItems:'center',justifyContent:'space-between',
          }}>
            <span style={{fontWeight:800,fontSize:14,color:'#0f172a',display:'flex',alignItems:'center',gap:7}}>
              <span style={{fontSize:17}}>🦷</span>Odontograma · Dentición Permanente
            </span>
            <span style={{fontSize:11,color:'#94a3b8'}}>FDI · 28 piezas · sin muelas del juicio</span>
          </div>

          {/* Leyenda */}
          <div style={{
            padding:'10px 18px', borderBottom:'1px solid #f1f5f9',
            display:'flex',gap:14,flexWrap:'wrap',alignItems:'center',
            background:'#fafcff',
          }}>
            <span style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.08em'}}>Estados:</span>
            {STATE_KEYS.map(k=>(
              <span key={k} style={{display:'flex',alignItems:'center',gap:5,fontSize:12,fontWeight:600,color:'#475569'}}>
                <span style={{
                  display:'inline-block',width:13,height:13,borderRadius:3,
                  background:STATES[k].crown,border:`2px solid ${STATES[k].border}`,
                }}/>
                {STATES[k].label}
                <span style={{color:'#94a3b8',fontWeight:400}}>({counts[k]||0})</span>
              </span>
            ))}
            <span style={{marginLeft:'auto',fontSize:11,color:'#cbd5e1'}}>← clic en un diente para editar</span>
          </div>

          {/* SVG dental */}
          <div style={{display:'flex',justifyContent:'center',padding:'16px 8px 20px'}}>
            <svg viewBox="0 0 600 680" width="100%" style={{maxWidth:580,display:'block',userSelect:'none'}}>

              {/* ── Encía superior ── */}
              <ellipse cx="300" cy="240" rx="228" ry="154"
                fill="#fde8e8" stroke="#f5b5b5" strokeWidth="1.5" opacity="0.6"/>
              {/* Hueco interior encía superior */}
              <ellipse cx="300" cy="258" rx="155" ry="95"
                fill="#fafcff" opacity="0.95"/>

              {/* ── Encía inferior ── */}
              <ellipse cx="300" cy="440" rx="228" ry="154"
                fill="#fde8e8" stroke="#f5b5b5" strokeWidth="1.5" opacity="0.6"/>
              {/* Hueco interior encía inferior */}
              <ellipse cx="300" cy="422" rx="155" ry="95"
                fill="#fafcff" opacity="0.95"/>

              {/* ── Línea media ── */}
              <line x1="300" y1="82" x2="300" y2="594"
                stroke="#e2e8f0" strokeWidth="1" strokeDasharray="5,4"/>

              {/* ── Etiquetas arcadas ── */}
              <text x="300" y="178" textAnchor="middle" fontSize="10"
                fill="#b0bec5" fontWeight="700" letterSpacing="3" fontFamily="monospace">SUPERIOR</text>
              <text x="300" y="504" textAnchor="middle" fontSize="10"
                fill="#b0bec5" fontWeight="700" letterSpacing="3" fontFamily="monospace">INFERIOR</text>

              {/* ── D / I labels ── */}
              <text x="56"  y="270" textAnchor="middle" fontSize="10" fill="#d1d5db" fontWeight="700" fontFamily="monospace">D</text>
              <text x="544" y="270" textAnchor="middle" fontSize="10" fill="#d1d5db" fontWeight="700" fontFamily="monospace">I</text>
              <text x="56"  y="410" textAnchor="middle" fontSize="10" fill="#d1d5db" fontWeight="700" fontFamily="monospace">D</text>
              <text x="544" y="410" textAnchor="middle" fontSize="10" fill="#d1d5db" fontWeight="700" fontFamily="monospace">I</text>

              {/* ── Dientes superiores ── */}
              {UPPER_TEETH.map((num, i) => (
                <Tooth key={num} num={num}
                  x={UP[i].x} y={UP[i].y} a={UP[i].a}
                  isUpper={true}
                  stateKey={toothStates[num]||'bien'}
                  selected={selected===num}
                  hovered={hovered===num}
                  onClick={setSelected}
                  onHover={setHovered}
                />
              ))}
              {UPPER_TEETH.map((num,i)=>(
                <ToothNum key={`un${num}`} num={num} x={UP[i].x} y={UP[i].y} isUpper={true} selected={selected===num}/>
              ))}

              {/* ── Separador / texto central ── */}
              <text x="300" y="346" textAnchor="middle" fontSize="9"
                fill="#e2e8f0" fontWeight="700" fontFamily="monospace" letterSpacing="6">• • • • • • •</text>

              {/* ── Dientes inferiores ── */}
              {LOWER_TEETH.map((num, i) => (
                <Tooth key={num} num={num}
                  x={LO[i].x} y={LO[i].y} a={LO[i].a}
                  isUpper={false}
                  stateKey={toothStates[num]||'bien'}
                  selected={selected===num}
                  hovered={hovered===num}
                  onClick={setSelected}
                  onHover={setHovered}
                />
              ))}
              {LOWER_TEETH.map((num,i)=>(
                <ToothNum key={`ln${num}`} num={num} x={LO[i].x} y={LO[i].y} isUpper={false} selected={selected===num}/>
              ))}

            </svg>
          </div>

          {/* Resumen pie */}
          <div style={{
            borderTop:'1px solid #f1f5f9',padding:'10px 18px',
            display:'flex',gap:14,flexWrap:'wrap',alignItems:'center',
            background:'#f8fafc',
          }}>
            {STATE_KEYS.map(k=>counts[k]>0&&(
              <span key={k} style={{display:'flex',alignItems:'center',gap:5,fontSize:12,color:'#64748b'}}>
                <span style={{display:'inline-block',width:9,height:9,borderRadius:2,background:STATES[k].crown,border:`1.5px solid ${STATES[k].border}`}}/>
                {STATES[k].label}: <strong>{counts[k]}</strong>
              </span>
            ))}
            <span style={{marginLeft:'auto',fontSize:11,color:'#94a3b8'}}>Total: 28 dientes</span>
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {selected && (
        <ToothEditor
          num={selected}
          stateKey={toothStates[selected]||'bien'}
          onChange={handleChange}
          onClose={()=>setSelected(null)}
          primary={primary}
        />
      )}
    </div>
  );
};

export default OdontogramaPct;
