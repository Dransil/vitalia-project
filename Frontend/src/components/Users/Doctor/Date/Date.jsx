import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../../../../Config/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
  MdChevronLeft, MdChevronRight, MdCalendarToday, MdAdd, MdClose,
  MdEventNote, MdPerson, MdMedicalServices, MdAccessTime, MdSearch,
  MdCheck, MdBlock, MdArrowForward, MdCancel, MdVisibility, MdSchedule
} from 'react-icons/md';
import api from '../../../../Services/Api';

const DC   = { neutral:{0:'#fff',50:'#f9fafb',100:'#f3f4f6',200:'#e5e7eb',300:'#d1d5db',400:'#9ca3af',500:'#6b7280',600:'#4b5563',700:'#374151',800:'#1f2937',900:'#111827'}, success:{light:'#d1fae5',main:'#10b981',dark:'#059669'}, error:{light:'#fee2e2',main:'#dc2626',dark:'#991b1b'} };
const DCFG = { theme:{ colors:{ primary:'#0ea5e9', secondary:'#14b8a6' } } };
const DSP  = { xs:'4px',sm:'8px',md:'16px',lg:'24px',xl:'32px' };
const DBR  = { sm:'4px',md:'6px',lg:'8px',xl:'12px',full:'9999px' };
const DSH  = { sm:'0 1px 2px rgba(0,0,0,0.05)', md:'0 4px 6px -1px rgba(0,0,0,0.08)' };

const fs = (t,k) => { try { return t?.fontSize?.[k]?.size||({xs:'11px',sm:'13px',md:'15px',lg:'18px',xl:'20px','2xl':'24px'}[k]||'14px'); } catch { return '14px'; } };
const fw = (t,k) => { try { return t?.fontWeight?.[k]||({normal:400,medium:500,semibold:600,bold:700}[k]||400); } catch { return 400; } };

const SLOTS  = Array.from({length:21},(_,i)=>8+i*0.5);
const DIAS_C = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
const DIAS_L = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const MESES  = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const SLOT_H = 30;
const HORA_H = SLOT_H * 2;

const ESTADO_COL = {
  programada: {bg:'#dbeafe',text:'#1d4ed8',border:'#93c5fd',label:'Programada'},
  confirmada: {bg:'#d1fae5',text:'#065f46',border:'#6ee7b7',label:'Confirmada'},
  en_espera:  {bg:'#fef3c7',text:'#92400e',border:'#fcd34d',label:'En espera'},
  completada: {bg:'#f3f4f6',text:'#374151',border:'#d1d5db',label:'Completada'},
  cancelada:  {bg:'#fee2e2',text:'#991b1b',border:'#fca5a5',label:'Cancelada'},
  no_asistio: {bg:'#fce7f3',text:'#9d174d',border:'#f9a8d4',label:'No asistió'},
};

const toDateStr   = d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const startOfWeek = d=>{ const r=new Date(d); const day=(r.getDay()+6)%7; r.setDate(r.getDate()-day); r.setHours(0,0,0,0); return r; };
const addDays     = (d,n)=>{ const r=new Date(d); r.setDate(r.getDate()+n); return r; };
const horaDecimal = d=>d.getHours()+d.getMinutes()/60;
const hoyStr      = ()=>toDateStr(new Date());
const esPasado    = dateStr=>dateStr<hoyStr();
const slotToHHMM  = slot=>{ const h=Math.floor(slot),m=slot%1===0.5?'30':'00'; return `${String(h).padStart(2,'0')}:${m}`; };
const esPasadoSlot= (dateStr,slot)=>{ const hoy=new Date(); if(dateStr<hoyStr()) return true; if(dateStr===hoyStr()){ const a=hoy.getHours()+hoy.getMinutes()/60; return slot<=a; } return false; };
const getUserId   = ()=>{ try{ const u=JSON.parse(localStorage.getItem('user')||'{}'); return u?.id_usuario||u?.id||null; }catch{ return null; } };
const diasDelMes  = (y,m)=>{ const first=new Date(y,m,1),last=new Date(y,m+1,0),off=(first.getDay()+6)%7,days=[]; for(let i=0;i<off;i++) days.push(null); for(let d=1;d<=last.getDate();d++) days.push(new Date(y,m,d)); return days; };

// ─── Modal Preview Cita ───────────────────────────────────────────────────────
const ModalPreviewCita = ({cita,onClose,onVerDetalles,onCancelar,primary,secondary,colors,sp,br,sh,typo})=>{
  if(!cita) return null;
  const col = ESTADO_COL[cita.estado]||ESTADO_COL.programada;
  const fecha = new Date(cita.fecha_hora);
  const puedeAccionar = !['cancelada','completada','no_asistio'].includes(cita.estado);

  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.52)',zIndex:3000,display:'flex',alignItems:'center',justifyContent:'center',animation:'fadeIn 0.15s ease'}}
      onClick={e=>e.target===e.currentTarget&&onClose()}
    >
      <div style={{background:colors?.neutral?.[0]||'#fff',borderRadius:'18px',width:'100%',maxWidth:'420px',overflow:'hidden',boxShadow:'0 32px 64px rgba(0,0,0,0.28)',animation:'slideUp 0.2s ease'}}>

        {/* Barra de color superior */}
        <div style={{height:'5px',background:`linear-gradient(to right,${primary},${secondary})`}}/>

        {/* Header */}
        <div style={{padding:'20px 22px 14px',borderBottom:`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`,display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'12px'}}>
          <div style={{flex:1,minWidth:0}}>
            <span style={{display:'inline-flex',alignItems:'center',gap:'4px',background:col.bg,color:col.text,border:`1px solid ${col.border}`,borderRadius:'20px',padding:'2px 10px',fontSize:'11px',fontWeight:fw(typo,'semibold'),marginBottom:'6px'}}>
              {col.label}
            </span>
            <h3 style={{margin:'0 0 2px',fontSize:fs(typo,'lg'),fontWeight:fw(typo,'bold'),color:colors?.neutral?.[900]||'#111827',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
              {cita.Paciente?.nombre||'Paciente'} {cita.Paciente?.apellido||''}
            </h3>
            {cita.Paciente?.cedula&&<p style={{margin:0,fontSize:fs(typo,'xs'),color:colors?.neutral?.[400]||'#9ca3af'}}>CI: {cita.Paciente.cedula}</p>}
          </div>
          <button onClick={onClose} style={{background:colors?.neutral?.[100]||'#f3f4f6',border:'none',borderRadius:'8px',padding:'6px',cursor:'pointer',display:'flex',color:colors?.neutral?.[500]||'#6b7280',flexShrink:0}}>
            <MdClose size={18}/>
          </button>
        </div>

        {/* Detalles */}
        <div style={{padding:'14px 22px',display:'flex',flexDirection:'column',gap:'8px'}}>
          {/* Fecha/hora */}
          <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',background:colors?.neutral?.[50]||'#f9fafb',borderRadius:'10px',border:`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`}}>
            <div style={{width:'32px',height:'32px',borderRadius:'8px',background:`linear-gradient(135deg,${primary},${secondary})`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <MdSchedule size={17} color="#fff"/>
            </div>
            <div>
              <div style={{fontSize:fs(typo,'sm'),fontWeight:fw(typo,'semibold'),color:colors?.neutral?.[800]||'#1f2937',textTransform:'capitalize'}}>
                {fecha.toLocaleDateString('es',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
              </div>
              <div style={{fontSize:fs(typo,'xs'),color:colors?.neutral?.[500]||'#6b7280'}}>
                {fecha.toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'})}
                {cita.duracion_minutos?` · ${cita.duracion_minutos} min`:''}
              </div>
            </div>
          </div>

          {/* Tipo cita */}
          {cita.TipoCita&&(
            <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',background:colors?.neutral?.[50]||'#f9fafb',borderRadius:'10px',border:`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`}}>
              <div style={{width:'32px',height:'32px',borderRadius:'8px',background:`${primary}15`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <MdMedicalServices size={17} style={{color:primary}}/>
              </div>
              <div>
                <div style={{fontSize:fs(typo,'sm'),fontWeight:fw(typo,'semibold'),color:colors?.neutral?.[800]||'#1f2937'}}>{cita.TipoCita.nombre}</div>
                {cita.TipoCita.costo_base&&<div style={{fontSize:fs(typo,'xs'),color:colors?.neutral?.[500]||'#6b7280'}}>$ {parseFloat(cita.TipoCita.costo_base).toFixed(2)}</div>}
              </div>
            </div>
          )}

          {/* Notas */}
          {cita.notas_previa&&(
            <div style={{padding:'10px 12px',background:`${primary}06`,borderRadius:'10px',border:`1px solid ${primary}18`}}>
              <div style={{fontSize:'10px',fontWeight:fw(typo,'semibold'),color:primary,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'3px'}}>Notas</div>
              <div style={{fontSize:fs(typo,'xs'),color:colors?.neutral?.[600]||'#4b5563',lineHeight:'1.5'}}>{cita.notas_previa}</div>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div style={{padding:'10px 22px 20px',display:'flex',flexDirection:'column',gap:'7px'}}>
          <button onClick={()=>onVerDetalles(cita)}
            style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',padding:'12px',background:`linear-gradient(to right,${primary},${secondary})`,color:'#fff',border:'none',borderRadius:'10px',fontSize:fs(typo,'sm'),fontWeight:fw(typo,'semibold'),cursor:'pointer',boxShadow:`0 4px 14px ${primary}35`,transition:'opacity 0.15s'}}
            onMouseEnter={e=>e.currentTarget.style.opacity='0.88'}
            onMouseLeave={e=>e.currentTarget.style.opacity='1'}
          >
            <MdVisibility size={17}/> Ver Detalles de Cita <MdArrowForward size={15}/>
          </button>

          {puedeAccionar&&(
            <button onClick={()=>onCancelar(cita)}
              style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:'7px',padding:'10px',background:'transparent',color:colors?.error?.main||'#dc2626',border:`1.5px solid ${colors?.error?.main||'#dc2626'}`,borderRadius:'10px',fontSize:fs(typo,'sm'),fontWeight:fw(typo,'semibold'),cursor:'pointer',transition:'background 0.15s'}}
              onMouseEnter={e=>e.currentTarget.style.background=colors?.error?.light||'#fee2e2'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}
            >
              <MdCancel size={15}/> Cancelar Cita
            </button>
          )}

          <button onClick={onClose} style={{width:'100%',padding:'8px',background:'transparent',color:colors?.neutral?.[400]||'#9ca3af',border:'none',borderRadius:'10px',fontSize:fs(typo,'sm'),cursor:'pointer'}}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Modal Confirmar Cancelación ──────────────────────────────────────────────
const ModalCancelar = ({cita,onClose,onConfirm,primary,colors,sp,br,typo})=>{
  const [razon,setRazon]=useState('');
  const [guardando,setGuardando]=useState(false);
  const handleConfirm=async()=>{ setGuardando(true); try{ await onConfirm(cita,razon); onClose(); }catch{ setGuardando(false); } };
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.52)',zIndex:4000,display:'flex',alignItems:'center',justifyContent:'center',animation:'fadeIn 0.15s ease'}}
      onClick={e=>e.target===e.currentTarget&&!guardando&&onClose()}
    >
      <div style={{background:colors?.neutral?.[0]||'#fff',borderRadius:'16px',width:'100%',maxWidth:'360px',padding:'24px',boxShadow:'0 32px 64px rgba(0,0,0,0.25)',animation:'slideUp 0.2s ease'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'16px'}}>
          <div style={{width:'42px',height:'42px',borderRadius:'10px',background:'#fee2e2',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <MdCancel size={22} style={{color:'#dc2626'}}/>
          </div>
          <div>
            <h3 style={{margin:0,fontSize:fs(typo,'md'),fontWeight:fw(typo,'bold'),color:colors?.neutral?.[900]||'#111827'}}>Cancelar Cita</h3>
            <p style={{margin:0,fontSize:fs(typo,'xs'),color:colors?.neutral?.[400]||'#9ca3af'}}>Esta acción no se puede deshacer</p>
          </div>
        </div>
        <textarea value={razon} onChange={e=>setRazon(e.target.value)} rows={3} placeholder="Motivo de cancelación (opcional)..."
          style={{width:'100%',padding:'10px 12px',border:`2px solid ${colors?.neutral?.[200]||'#e5e7eb'}`,borderRadius:'8px',fontSize:fs(typo,'sm'),outline:'none',resize:'none',boxSizing:'border-box',fontFamily:'inherit',color:colors?.neutral?.[800]||'#1f2937'}}
          onFocus={e=>e.target.style.borderColor='#dc2626'} onBlur={e=>e.target.style.borderColor=colors?.neutral?.[200]||'#e5e7eb'}
        />
        <div style={{display:'flex',gap:'8px',marginTop:'14px'}}>
          <button onClick={onClose} disabled={guardando} style={{flex:1,padding:'10px',background:colors?.neutral?.[100]||'#f3f4f6',border:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}`,borderRadius:'8px',fontSize:fs(typo,'sm'),fontWeight:fw(typo,'semibold'),color:colors?.neutral?.[700]||'#374151',cursor:'pointer'}}>Volver</button>
          <button onClick={handleConfirm} disabled={guardando} style={{flex:1,padding:'10px',background:guardando?colors?.neutral?.[300]||'#d1d5db':'#dc2626',border:'none',borderRadius:'8px',fontSize:fs(typo,'sm'),fontWeight:fw(typo,'semibold'),color:'#fff',cursor:guardando?'not-allowed':'pointer'}}>
            {guardando?'Cancelando...':'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Modal Agendar ────────────────────────────────────────────────────────────
const ModalAgendar = ({slots,onClose,onConfirm,primary,secondary,colors,sp,br,sh,typo})=>{
  const [pacientes,setPacientes]=useState([]);
  const [tiposCita,setTiposCita]=useState([]);
  const [loadingData,setLoadingData]=useState(true);
  const [busqueda,setBusqueda]=useState('');
  const [pacienteId,setPacienteId]=useState('');
  const [tipoCitaId,setTipoCitaId]=useState('');
  const [notas,setNotas]=useState('');
  const [error,setError]=useState('');
  const [guardando,setGuardando]=useState(false);
  const [exitoso,setExitoso]=useState(false);
  const searchRef=useRef(null);

  useEffect(()=>{
    (async()=>{
      setLoadingData(true);
      try{
        const [pRes,tRes]=await Promise.all([api.get('/pacientes'),api.get('/tipocita')]);
        setPacientes(Array.isArray(pRes?.data)?pRes.data:Array.isArray(pRes)?pRes:[]);
        setTiposCita(Array.isArray(tRes?.data)?tRes.data:Array.isArray(tRes)?tRes:[]);
      }catch{ setError('Error al cargar datos'); }
      finally{ setLoadingData(false); }
    })();
    setTimeout(()=>searchRef.current?.focus(),120);
  },[]);

  const filtrados=pacientes.filter(p=>{ if(!p) return false; const q=busqueda.toLowerCase(); return `${p.nombre||''} ${p.apellido||''}`.toLowerCase().includes(q)||(p.cedula||'').includes(q); });
  const tipoCitaSel=tiposCita.find(t=>String(t.id_tipo_cita)===String(tipoCitaId));
  const pacienteSel=pacientes.find(p=>String(p.id_paciente)===String(pacienteId));

  const handleConfirm=async()=>{
    if(!pacienteId){setError('Seleccione un paciente');return;}
    if(!tipoCitaId){setError('Seleccione un tipo de cita');return;}
    setError('');setGuardando(true);
    try{ await onConfirm({pacienteId,tipoCitaId,notas,slots}); setExitoso(true); setTimeout(()=>onClose(),1400); }
    catch(e){ setError(e?.message||'Error al agendar'); setGuardando(false); }
  };

  const inp={width:'100%',padding:`${sp?.sm||'8px'} ${sp?.md||'16px'}`,border:`2px solid ${colors?.neutral?.[200]||'#e5e7eb'}`,borderRadius:br?.md||'6px',fontSize:fs(typo,'sm'),outline:'none',boxSizing:'border-box',background:colors?.neutral?.[0]||'#fff',color:colors?.neutral?.[900]||'#111827',transition:'border-color 0.15s'};

  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.48)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center',animation:'fadeIn 0.15s ease'}}
      onClick={e=>e.target===e.currentTarget&&!guardando&&onClose()}
    >
      <div style={{background:colors?.neutral?.[0]||'#fff',borderRadius:br?.xl||'12px',width:'100%',maxWidth:'560px',maxHeight:'92vh',overflow:'hidden',display:'flex',flexDirection:'column',boxShadow:'0 24px 48px rgba(0,0,0,0.2)',animation:'slideUp 0.2s ease'}}>
        <div style={{padding:`${sp?.lg||'24px'} ${sp?.xl||'32px'}`,borderBottom:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}`,display:'flex',alignItems:'center',justifyContent:'space-between',background:`linear-gradient(135deg,${primary}08,${secondary}08)`,flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:sp?.sm||'8px'}}>
            <div style={{width:'36px',height:'36px',borderRadius:br?.lg||'8px',background:`linear-gradient(135deg,${primary},${secondary})`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><MdAdd size={20} color="#fff"/></div>
            <div>
              <h2 style={{margin:0,fontSize:fs(typo,'lg'),fontWeight:fw(typo,'bold'),color:colors?.neutral?.[900]||'#111827'}}>Agendar Cita</h2>
              <p style={{margin:0,fontSize:fs(typo,'xs'),color:colors?.neutral?.[500]||'#6b7280'}}>{slots.length} slot{slots.length!==1?'s':''} · {slots.length*30} min reservados</p>
            </div>
          </div>
          <button onClick={()=>!guardando&&onClose()} style={{background:'none',border:'none',cursor:'pointer',color:colors?.neutral?.[400]||'#9ca3af',display:'flex',padding:'4px',borderRadius:br?.full||'9999px'}}><MdClose size={22}/></button>
        </div>

        <div style={{padding:`${sp?.sm||'8px'} ${sp?.xl||'32px'}`,borderBottom:`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`,background:colors?.neutral?.[50]||'#f9fafb',display:'flex',flexWrap:'wrap',gap:sp?.xs||'4px',flexShrink:0}}>
          {slots.map((s,i)=>(<span key={i} style={{display:'inline-flex',alignItems:'center',gap:'4px',background:`${primary}15`,border:`1px solid ${primary}30`,borderRadius:br?.full||'9999px',padding:'3px 10px',fontSize:fs(typo,'xs'),color:primary,fontWeight:fw(typo,'semibold')}}><MdAccessTime size={11}/>{s.fecha} · {slotToHHMM(s.slot)}</span>))}
        </div>

        <div style={{overflowY:'auto',flex:1,padding:`${sp?.lg||'24px'} ${sp?.xl||'32px'}`}}>
          {exitoso?(
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:sp?.xl||'32px',gap:sp?.md||'16px',minHeight:'200px'}}>
              <div style={{width:'60px',height:'60px',borderRadius:br?.full||'9999px',background:colors?.success?.light||'#d1fae5',display:'flex',alignItems:'center',justifyContent:'center'}}><MdCheck size={34} style={{color:colors?.success?.main||'#10b981'}}/></div>
              <p style={{margin:0,fontSize:fs(typo,'md'),fontWeight:fw(typo,'semibold'),color:colors?.success?.dark||'#059669',textAlign:'center'}}>¡Cita{slots.length>1?'s':''} agendada{slots.length>1?'s':''} correctamente!</p>
            </div>
          ):loadingData?(
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:sp?.xl||'32px'}}><div style={{width:'28px',height:'28px',border:`3px solid ${colors?.neutral?.[200]||'#e5e7eb'}`,borderTop:`3px solid ${primary}`,borderRadius:'50%',animation:'spin 1s linear infinite'}}/></div>
          ):(
            <div style={{display:'flex',flexDirection:'column',gap:sp?.lg||'24px'}}>
              {error&&<div style={{padding:sp?.md||'16px',background:colors?.error?.light||'#fee2e2',border:`1px solid ${colors?.error?.main||'#dc2626'}`,color:colors?.error?.dark||'#991b1b',borderRadius:br?.md||'6px',fontSize:fs(typo,'sm'),fontWeight:fw(typo,'semibold')}}>{error}</div>}
              <div>
                <label style={{display:'flex',alignItems:'center',gap:'6px',fontSize:fs(typo,'sm'),fontWeight:fw(typo,'semibold'),color:colors?.neutral?.[700]||'#374151',marginBottom:sp?.sm||'8px'}}><MdPerson size={15} style={{color:primary}}/> Paciente *</label>
                <div style={{position:'relative',marginBottom:sp?.xs||'4px'}}>
                  <MdSearch size={15} style={{position:'absolute',left:'11px',top:'50%',transform:'translateY(-50%)',color:colors?.neutral?.[400]||'#9ca3af',pointerEvents:'none'}}/>
                  <input ref={searchRef} type="text" value={busqueda} onChange={e=>{setBusqueda(e.target.value);setPacienteId('');}} placeholder="Buscar por nombre o cédula..." style={{...inp,paddingLeft:'34px'}} onFocus={e=>e.target.style.borderColor=primary} onBlur={e=>e.target.style.borderColor=colors?.neutral?.[200]||'#e5e7eb'}/>
                </div>
                <div style={{border:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}`,borderRadius:br?.lg||'8px',height:'160px',overflowY:'auto',background:colors?.neutral?.[0]||'#fff'}}>
                  {filtrados.length===0?(<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',fontSize:fs(typo,'sm'),color:colors?.neutral?.[400]||'#9ca3af'}}>Sin resultados</div>):filtrados.map(p=>{ const sel=String(p.id_paciente)===String(pacienteId); return(<div key={p.id_paciente} onClick={()=>{setPacienteId(p.id_paciente);if(error)setError('');}} style={{padding:`${sp?.sm||'8px'} ${sp?.md||'16px'}`,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',background:sel?`${primary}10`:'transparent',borderBottom:`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`,transition:'background 0.1s'}} onMouseEnter={e=>!sel&&(e.currentTarget.style.background=colors?.neutral?.[50]||'#f9fafb')} onMouseLeave={e=>!sel&&(e.currentTarget.style.background='transparent')}><div><div style={{fontSize:fs(typo,'sm'),fontWeight:sel?fw(typo,'semibold'):fw(typo,'normal'),color:sel?primary:colors?.neutral?.[800]||'#1f2937'}}>{p.nombre} {p.apellido}</div><div style={{fontSize:fs(typo,'xs'),color:colors?.neutral?.[400]||'#9ca3af'}}>CI: {p.cedula}</div></div>{sel&&<MdCheck size={15} style={{color:primary,flexShrink:0}}/>}</div>); })}
                </div>
                {pacienteSel&&<div style={{marginTop:sp?.xs||'4px',display:'inline-flex',alignItems:'center',gap:'6px',background:`${primary}10`,border:`1px solid ${primary}30`,borderRadius:br?.full||'9999px',padding:'3px 10px',fontSize:fs(typo,'xs'),color:primary,fontWeight:fw(typo,'semibold')}}><MdCheck size={11}/> {pacienteSel.nombre} {pacienteSel.apellido}</div>}
              </div>
              <div>
                <label style={{display:'flex',alignItems:'center',gap:'6px',fontSize:fs(typo,'sm'),fontWeight:fw(typo,'semibold'),color:colors?.neutral?.[700]||'#374151',marginBottom:sp?.sm||'8px'}}><MdMedicalServices size={15} style={{color:primary}}/> Tipo de Cita *</label>
                <select value={tipoCitaId} onChange={e=>{setTipoCitaId(e.target.value);if(error)setError('');}} style={{...inp,cursor:'pointer',appearance:'auto'}} onFocus={e=>e.target.style.borderColor=primary} onBlur={e=>e.target.style.borderColor=colors?.neutral?.[200]||'#e5e7eb'}>
                  <option value="">— Seleccione un tipo de cita —</option>
                  {tiposCita.map(t=>(<option key={t.id_tipo_cita} value={t.id_tipo_cita}>{t.nombre} · {t.duracion_promedio} min{t.costo_base?` · $${parseFloat(t.costo_base).toFixed(2)}`:''}</option>))}
                </select>
                {tipoCitaSel&&<div style={{marginTop:sp?.sm||'8px',padding:sp?.md||'16px',background:`${primary}08`,border:`1px solid ${primary}20`,borderRadius:br?.md||'6px'}}>{tipoCitaSel.descripcion&&<p style={{margin:`0 0 6px`,fontSize:fs(typo,'xs'),color:colors?.neutral?.[600]||'#4b5563'}}>{tipoCitaSel.descripcion}</p>}<div style={{display:'flex',gap:'16px',flexWrap:'wrap',fontSize:fs(typo,'xs'),color:primary,fontWeight:fw(typo,'semibold')}}><span><MdAccessTime size={11} style={{verticalAlign:'middle'}}/> {tipoCitaSel.duracion_promedio} min</span><span>Slots: {slots.length} × 30 = {slots.length*30} min</span>{tipoCitaSel.costo_base&&<span>$ {parseFloat(tipoCitaSel.costo_base).toFixed(2)}</span>}</div></div>}
              </div>
              <div>
                <label style={{display:'block',fontSize:fs(typo,'sm'),fontWeight:fw(typo,'semibold'),color:colors?.neutral?.[700]||'#374151',marginBottom:sp?.sm||'8px'}}>Notas (opcional)</label>
                <textarea value={notas} onChange={e=>setNotas(e.target.value)} rows={3} placeholder="Motivo de consulta, observaciones..." style={{...inp,resize:'vertical',minHeight:'72px',fontFamily:'inherit'}} onFocus={e=>e.target.style.borderColor=primary} onBlur={e=>e.target.style.borderColor=colors?.neutral?.[200]||'#e5e7eb'}/>
              </div>
            </div>
          )}
        </div>
        {!exitoso&&<div style={{padding:`${sp?.md||'16px'} ${sp?.xl||'32px'}`,borderTop:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}`,display:'flex',justifyContent:'flex-end',gap:sp?.sm||'8px',background:colors?.neutral?.[50]||'#f9fafb',flexShrink:0}}>
          <button onClick={()=>!guardando&&onClose()} style={{padding:`${sp?.sm||'8px'} ${sp?.lg||'24px'}`,background:colors?.neutral?.[100]||'#f3f4f6',border:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}`,borderRadius:br?.md||'6px',fontSize:fs(typo,'sm'),fontWeight:fw(typo,'semibold'),color:colors?.neutral?.[700]||'#374151',cursor:guardando?'not-allowed':'pointer'}}>Cancelar</button>
          <button onClick={handleConfirm} disabled={guardando||loadingData} style={{padding:`${sp?.sm||'8px'} ${sp?.lg||'24px'}`,background:(guardando||loadingData)?colors?.neutral?.[300]||'#d1d5db':`linear-gradient(to right,${primary},${secondary})`,border:'none',borderRadius:br?.md||'6px',fontSize:fs(typo,'sm'),fontWeight:fw(typo,'semibold'),color:'#fff',cursor:(guardando||loadingData)?'not-allowed':'pointer',display:'flex',alignItems:'center',gap:'6px'}}>
            {guardando?'⏳ Guardando...':<><MdCheck size={16}/> Confirmar Cita</>}
          </button>
        </div>}
      </div>
    </div>
  );
};

// ─── Dashboard principal ──────────────────────────────────────────────────────
const CitasDashboard = ({doctorId})=>{
  const navigate=useNavigate();
  let themeContext={};
  try{themeContext=useTheme()||{};}catch{}

  const config=themeContext.config||DCFG, colors=themeContext.colors||DC, sp=themeContext.spacing||DSP;
  const typo=themeContext.typography||{}, br=themeContext.borderRadius||DBR, sh=themeContext.shadows||DSH;
  const primary=config?.theme?.colors?.primary||DCFG.theme.colors.primary;
  const secondary=config?.theme?.colors?.secondary||DCFG.theme.colors.secondary;

  const [vista,setVista]=useState('mes');
  const [fecha,setFecha]=useState(new Date());
  const [citas,setCitas]=useState([]);
  const [loading,setLoading]=useState(false);
  const [slotsSet,setSlotsSet]=useState(new Set());
  const [modalOpen,setModalOpen]=useState(false);
  const [errNav,setErrNav]=useState('');
  const [citaPreview,setCitaPreview]=useState(null);
  const [citaCancelar,setCitaCancelar]=useState(null);

  const getId=useCallback(()=>doctorId||getUserId(),[doctorId]);

  const cargarCitas=useCallback(async()=>{
    const id=getId(); if(!id) return;
    setLoading(true);
    try{ const res=await api.get(`/citas/doctor/${id}`); const arr=res?.data||res?.citas||(Array.isArray(res)?res:[]); setCitas(Array.isArray(arr)?arr:[]); }
    catch{ setCitas([]); }
    finally{ setLoading(false); }
  },[getId]);

  useEffect(()=>{cargarCitas();},[cargarCitas]);

  const citasPorFecha=React.useMemo(()=>{
    const map={};
    citas.forEach(c=>{ if(!c?.fecha_hora) return; const d=new Date(c.fecha_hora),key=toDateStr(d); if(!map[key]) map[key]=[]; map[key].push({...c,_date:d}); });
    return map;
  },[citas]);

  const navegar=dir=>{
    setErrNav('');
    setFecha(prev=>{
      const d=new Date(prev);
      if(vista==='dia') d.setDate(d.getDate()+dir);
      if(vista==='semana') d.setDate(d.getDate()+dir*7);
      if(vista==='mes') d.setMonth(d.getMonth()+dir);
      const hoy=new Date();hoy.setHours(0,0,0,0);
      if(vista==='dia'&&d<hoy){setErrNav('No puedes navegar a días anteriores');return prev;}
      if(vista==='semana'){const fin=addDays(startOfWeek(d),6);if(fin<hoy){setErrNav('No puedes navegar a semanas anteriores');return prev;}}
      if(vista==='mes'){const fin=new Date(d.getFullYear(),d.getMonth()+1,0);if(fin<hoy){setErrNav('No puedes navegar a meses anteriores');return prev;}}
      return d;
    });
    setSlotsSet(new Set());
  };

  useEffect(()=>{if(errNav){const t=setTimeout(()=>setErrNav(''),2500);return()=>clearTimeout(t);}},[errNav]);

  const irAHoy=()=>{setFecha(new Date());setSlotsSet(new Set());setErrNav('');};
  const cambiarVista=v=>{setVista(v);setSlotsSet(new Set());setErrNav('');};
  const irADia=d=>{const h=new Date();h.setHours(0,0,0,0);if(d<h)return;setFecha(d);setVista('dia');setSlotsSet(new Set());};
  const irASemana=d=>{const h=new Date();h.setHours(0,0,0,0);if(d<h)return;setFecha(d);setVista('semana');setSlotsSet(new Set());};

  const titulo=()=>{
    if(vista==='dia') return `${fecha.getDate()} de ${MESES[fecha.getMonth()]} ${fecha.getFullYear()}`;
    if(vista==='mes') return `${MESES[fecha.getMonth()]} ${fecha.getFullYear()}`;
    const ini=startOfWeek(fecha),fin=addDays(ini,6);
    if(ini.getMonth()===fin.getMonth()) return `${ini.getDate()} – ${fin.getDate()} de ${MESES[ini.getMonth()]} ${ini.getFullYear()}`;
    return `${ini.getDate()} ${MESES[ini.getMonth()]} – ${fin.getDate()} ${MESES[fin.getMonth()]} ${ini.getFullYear()}`;
  };

  const toggleSlot=(fecha,slot)=>{ if(esPasadoSlot(fecha,slot)) return; const key=JSON.stringify({fecha,slot}); setSlotsSet(prev=>{const n=new Set(prev);n.has(key)?n.delete(key):n.add(key);return n;}); };
  const limpiarSlots=()=>setSlotsSet(new Set());
  const slotsSeleccionados=Array.from(slotsSet).map(k=>JSON.parse(k)).sort((a,b)=>a.fecha===b.fecha?a.slot-b.slot:a.fecha.localeCompare(b.fecha));

  const handleClickCita=(e,cita)=>{e.stopPropagation();setCitaPreview(cita);};
  const handleVerDetalles=(cita)=>{setCitaPreview(null);navigate(`/Details_Date/${cita.id_cita}`);};
  const handleCancelarCita=async(cita,razon)=>{await api.patch(`/citas/estado/${cita.id_cita}`,{estado:'cancelada',razon_cancelacion:razon||null});cargarCitas();};
  const handleConfirmarCita=async({pacienteId,tipoCitaId,notas,slots})=>{
    const id=getId(); if(!id) throw new Error('No se encontró el ID del doctor');
    await Promise.all(slots.map(s=>{ const h=Math.floor(s.slot),m=s.slot%1===0.5?'30':'00'; return api.post('/citas',{id_usuario:parseInt(id),id_paciente:parseInt(pacienteId),id_tipo_cita:parseInt(tipoCitaId),fecha_hora:`${s.fecha} ${String(h).padStart(2,'0')}:${m}:00`,duracion_minutos:30,notas_previa:notas||null,estado:'programada'}); }));
    setModalOpen(false);limpiarSlots();cargarCitas();
  };

  const card={background:colors?.neutral?.[0]||'#fff',border:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}`,borderRadius:br?.xl||'12px',boxShadow:sh?.md,overflow:'hidden'};
  const navBtn={background:colors?.neutral?.[0]||'#fff',border:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}`,borderRadius:br?.lg||'8px',padding:'6px 8px',cursor:'pointer',display:'flex',alignItems:'center',color:colors?.neutral?.[600]||'#4b5563',boxShadow:sh?.sm};
  const btnV=v=>({padding:'6px 16px',border:'none',borderRadius:br?.full||'9999px',cursor:'pointer',fontSize:fs(typo,'sm'),fontWeight:fw(typo,'semibold'),background:vista===v?primary:'transparent',color:vista===v?'#fff':colors?.neutral?.[600]||'#4b5563',transition:'0.2s'});

  const VistaMes=()=>{
    const dias=diasDelMes(fecha.getFullYear(),fecha.getMonth());
    const hoy=hoyStr(),hoyD=new Date();hoyD.setHours(0,0,0,0);
    return(<div style={card}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',borderBottom:`2px solid ${colors?.neutral?.[200]||'#e5e7eb'}`}}>
        {DIAS_C.map(d=>(<div key={d} style={{padding:'10px 0',textAlign:'center',fontSize:fs(typo,'xs'),fontWeight:fw(typo,'semibold'),color:colors?.neutral?.[500]||'#6b7280',letterSpacing:'0.06em',textTransform:'uppercase',borderRight:`1px solid ${colors?.neutral?.[100]||'#f3f4f6'}`}}>{d}</div>))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)'}}>
        {dias.map((dia,idx)=>{
          if(!dia) return <div key={`e${idx}`} style={{minHeight:'90px',borderRight:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}`,borderBottom:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}`,background:colors?.neutral?.[50]||'#f9fafb'}}/>;
          const key=toDateStr(dia),citasD=citasPorFecha[key]||[],esHoy=key===hoy,finde=dia.getDay()===0||dia.getDay()===6,pasado=dia<hoyD;
          return(<div key={key} onClick={()=>{if(pasado)return;citasD.length>0?irADia(dia):irASemana(dia);}}
            style={{minHeight:'90px',padding:'8px',borderRight:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}`,borderBottom:`1px solid ${colors?.neutral?.[200]||'#e5e7eb'}`,background:pasado||finde?(colors?.neutral?.[50]||'#f9fafb'):(colors?.neutral?.[0]||'#fff'),cursor:pasado?'not-allowed':'pointer',opacity:pasado?0.4:1,transition:'background 0.15s'}}
            onMouseEnter={e=>{if(!pasado)e.currentTarget.style.background=`${primary}09`;}}
            onMouseLeave={e=>{e.currentTarget.style.background=pasado||finde?(colors?.neutral?.[50]||'#f9fafb'):(colors?.neutral?.[0]||'#fff');}}
          >
            <div style={{marginBottom:'6px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:'26px',height:'26px',borderRadius:br?.full||'9999px',fontSize:fs(typo,'sm'),fontWeight:esHoy?fw(typo,'bold'):fw(typo,'normal'),background:esHoy?primary:'transparent',color:esHoy?'#fff':pasado?(colors?.neutral?.[300]||'#d1d5db'):finde?(colors?.neutral?.[400]||'#9ca3af'):(colors?.neutral?.[700]||'#374151')}}>{dia.getDate()}</span>
              {pasado&&<MdBlock size={11} style={{color:colors?.neutral?.[300]||'#d1d5db'}}/>}
            </div>
            {!pasado&&citasD.length>0&&(
              <div style={{display:'flex',flexDirection:'column',gap:'3px'}}>
                {citasD.slice(0,2).map((c,i)=>{const col=ESTADO_COL[c.estado]||ESTADO_COL.programada;return(
                  <div key={i} onClick={e=>handleClickCita(e,c)}
                    style={{background:col.bg,color:col.text,border:`1px solid ${col.border}`,borderRadius:br?.sm||'4px',padding:'2px 6px',fontSize:fs(typo,'xs'),fontWeight:fw(typo,'medium'),overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',cursor:'pointer',transition:'opacity 0.1s,transform 0.1s'}}
                    onMouseEnter={e=>{e.currentTarget.style.opacity='0.8';e.currentTarget.style.transform='scale(1.01)';}}
                    onMouseLeave={e=>{e.currentTarget.style.opacity='1';e.currentTarget.style.transform='scale(1)';}}
                  >
                    {new Date(c.fecha_hora).toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'})} {c.Paciente?.nombre||''}
                  </div>
                );})}
                {citasD.length>2&&<div style={{fontSize:fs(typo,'xs'),color:primary,fontWeight:fw(typo,'semibold'),paddingLeft:'4px'}}>+{citasD.length-2} más</div>}
              </div>
            )}
          </div>);
        })}
      </div>
    </div>);
  };

  const VistaHoraria=({esSemana})=>{
    const diasVista=esSemana?Array.from({length:7},(_,i)=>addDays(startOfWeek(fecha),i)):[new Date(fecha)];
    const hoy=hoyStr();
    return(<div style={card}>
      <div style={{display:'flex',borderBottom:`3px solid ${colors?.neutral?.[200]||'#e5e7eb'}`,background:colors?.neutral?.[0]||'#fff',position:'sticky',top:0,zIndex:2}}>
        <div style={{width:'68px',flexShrink:0,borderRight:`3px solid ${colors?.neutral?.[200]||'#e5e7eb'}`}}/>
        {diasVista.map((d,i)=>{const key=toDateStr(d),esHoy=key===hoy,pasado=esPasado(key);return(
          <div key={i} style={{flex:1,textAlign:'center',padding:'10px 4px',borderRight:i<diasVista.length-1?`3px solid ${colors?.neutral?.[200]||'#e5e7eb'}`:'none',opacity:pasado?0.4:1}}>
            <div style={{fontSize:fs(typo,'xs'),color:colors?.neutral?.[500]||'#6b7280',textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:fw(typo,'semibold')}}>{esSemana?DIAS_C[i]:DIAS_L[(d.getDay()+6)%7]}</div>
            <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:'32px',height:'32px',borderRadius:br?.full||'9999px',marginTop:'3px',background:esHoy?primary:'transparent',color:esHoy?'#fff':pasado?(colors?.neutral?.[300]||'#d1d5db'):(colors?.neutral?.[800]||'#1f2937'),fontSize:fs(typo,'md'),fontWeight:esHoy?fw(typo,'bold'):fw(typo,'normal')}}>{d.getDate()}</div>
          </div>
        );})}
      </div>
      <div style={{overflowY:'auto',maxHeight:'calc(100vh - 300px)'}}>
        <div style={{display:'flex'}}>
          <div style={{width:'68px',flexShrink:0,borderRight:`3px solid ${colors?.neutral?.[200]||'#e5e7eb'}`}}>
            {SLOTS.map(slot=>{const ep=slot%1===0;return(
              <div key={slot} style={{height:`${SLOT_H}px`,display:'flex',alignItems:'flex-start',justifyContent:'flex-end',paddingRight:'8px',paddingTop:'3px',fontSize:'10px',color:ep?(colors?.neutral?.[500]||'#6b7280'):(colors?.neutral?.[300]||'#d1d5db'),fontWeight:ep?fw(typo,'semibold'):fw(typo,'normal'),borderBottom:ep?`2px solid ${colors?.neutral?.[200]||'#e5e7eb'}`:`1px dashed ${colors?.neutral?.[100]||'#f3f4f6'}`,userSelect:'none',boxSizing:'border-box'}}>
                {ep?slotToHHMM(slot):''}
              </div>
            );})}
          </div>
          {diasVista.map((d,di)=>{
            const dateKey=toDateStr(d),citasD=citasPorFecha[dateKey]||[],colPas=esPasado(dateKey);
            return(<div key={di} style={{flex:1,position:'relative',borderRight:di<diasVista.length-1?`3px solid ${colors?.neutral?.[200]||'#e5e7eb'}`:'none',background:colPas?(colors?.neutral?.[50]||'#f9fafb'):'transparent'}}>
              {SLOTS.map(slot=>{
                const slotKey=JSON.stringify({fecha:dateKey,slot}),activo=slotsSet.has(slotKey),bloqueado=esPasadoSlot(dateKey,slot),ep=slot%1===0;
                return(<div key={slot} onClick={()=>!bloqueado&&toggleSlot(dateKey,slot)}
                  style={{height:`${SLOT_H}px`,borderBottom:ep?`2px solid ${colors?.neutral?.[200]||'#e5e7eb'}`:`1px dashed ${colors?.neutral?.[100]||'#f3f4f6'}`,background:bloqueado?'transparent':activo?`${primary}20`:'transparent',cursor:bloqueado?'not-allowed':'pointer',transition:'background 0.1s',position:'relative',userSelect:'none',boxSizing:'border-box'}}
                  onMouseEnter={e=>{if(!bloqueado&&!activo)e.currentTarget.style.background=`${primary}08`;}}
                  onMouseLeave={e=>{if(!bloqueado&&!activo)e.currentTarget.style.background='transparent';}}
                >
                  {bloqueado&&<div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(45deg,transparent,transparent 4px,rgba(0,0,0,0.025) 4px,rgba(0,0,0,0.025) 8px)',pointerEvents:'none'}}/>}
                  {activo&&<div style={{position:'absolute',inset:'1px',background:`${primary}25`,border:`2px solid ${primary}`,borderRadius:'4px',pointerEvents:'none',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:'10px',color:primary,fontWeight:fw(typo,'semibold')}}>{slotToHHMM(slot)}</span></div>}
                </div>);
              })}
              {citasD.map((c,ci)=>{
                const cd=new Date(c.fecha_hora),hD=horaDecimal(cd);
                if(hD<8||hD>=19) return null;
                const top=(hD-8)*HORA_H,dur=c.duracion_minutos||c.TipoCita?.duracion_promedio||30,h=Math.max((dur/60)*HORA_H-3,SLOT_H-3),col=ESTADO_COL[c.estado]||ESTADO_COL.programada;
                return(<div key={ci} onClick={e=>handleClickCita(e,c)}
                  style={{position:'absolute',top:`${top+1}px`,left:'2px',right:'2px',height:`${h}px`,background:col.bg,border:`1.5px solid ${col.border}`,borderRadius:br?.md||'6px',padding:'3px 6px',overflow:'hidden',cursor:'pointer',zIndex:1,boxShadow:sh?.sm,transition:'transform 0.1s,box-shadow 0.1s'}}
                  onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.02)';e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)';e.currentTarget.style.zIndex='2';}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow=sh?.sm||'';e.currentTarget.style.zIndex='1';}}
                >
                  <div style={{fontSize:'10px',fontWeight:fw(typo,'semibold'),color:col.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{cd.toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'})} {c.Paciente?.nombre||''} {c.Paciente?.apellido||''}</div>
                  {h>28&&<div style={{fontSize:'10px',color:col.text,opacity:0.75,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.TipoCita?.nombre||''}</div>}
                </div>);
              })}
            </div>);
          })}
        </div>
      </div>
    </div>);
  };

  return(
    <div style={{minHeight:'100vh',background:colors?.neutral?.[50]||'#f9fafb',padding:sp?.xl||'32px'}}>
      <div style={{marginBottom:sp?.lg||'24px'}}>
        <div style={{display:'flex',alignItems:'center',gap:sp?.sm||'8px',marginBottom:'4px'}}>
          <div style={{width:'38px',height:'38px',borderRadius:br?.lg||'8px',background:`linear-gradient(135deg,${primary},${secondary})`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><MdEventNote size={22} color="#fff"/></div>
          <h1 style={{margin:0,fontSize:fs(typo,'2xl'),fontWeight:fw(typo,'bold'),color:colors?.neutral?.[900]||'#111827'}}>Mis Citas</h1>
        </div>
        <p style={{margin:0,fontSize:fs(typo,'sm'),color:colors?.neutral?.[500]||'#6b7280',paddingLeft:'46px'}}>Gestiona y visualiza tu agenda médica</p>
      </div>

      {errNav&&<div style={{marginBottom:sp?.md||'16px',padding:`${sp?.sm||'8px'} ${sp?.md||'16px'}`,background:colors?.error?.light||'#fee2e2',border:`1px solid ${colors?.error?.main||'#dc2626'}`,color:colors?.error?.dark||'#991b1b',borderRadius:br?.lg||'8px',fontSize:fs(typo,'sm'),fontWeight:fw(typo,'semibold'),display:'flex',alignItems:'center',gap:'8px',animation:'slideIn 0.2s ease'}}><MdBlock size={16}/> {errNav}</div>}

      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:sp?.md||'16px',flexWrap:'wrap',gap:sp?.sm||'8px'}}>
        <div style={{display:'flex',alignItems:'center',gap:sp?.sm||'8px'}}>
          <button onClick={()=>navegar(-1)} style={navBtn}><MdChevronLeft size={20}/></button>
          <button onClick={()=>navegar(1)}  style={navBtn}><MdChevronRight size={20}/></button>
          <span style={{fontSize:fs(typo,'md'),fontWeight:fw(typo,'bold'),color:colors?.neutral?.[900]||'#111827',minWidth:'200px'}}>{titulo()}</span>
          <button onClick={irAHoy} style={{...navBtn,padding:'6px 14px',gap:'5px'}}><MdCalendarToday size={14}/><span style={{fontSize:fs(typo,'sm'),fontWeight:fw(typo,'medium')}}>Hoy</span></button>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:sp?.sm||'8px'}}>
          {slotsSet.size>0&&vista!=='mes'&&(<>
            <button onClick={()=>setModalOpen(true)} style={{display:'flex',alignItems:'center',gap:'6px',padding:'8px 20px',background:`linear-gradient(to right,${primary},${secondary})`,color:'#fff',border:'none',borderRadius:br?.full||'9999px',fontSize:fs(typo,'sm'),fontWeight:fw(typo,'semibold'),cursor:'pointer',boxShadow:sh?.md,animation:'slideIn 0.2s ease'}}>
              <MdAdd size={18}/> Agendar {slotsSet.size} cita{slotsSet.size!==1?'s':''} · {slotsSet.size*30} min
            </button>
            <button onClick={limpiarSlots} style={{...navBtn,padding:'6px 10px'}} title="Limpiar selección"><MdClose size={16}/></button>
          </>)}
          <div style={{display:'flex',background:colors?.neutral?.[100]||'#f3f4f6',borderRadius:br?.full||'9999px',padding:'3px',gap:'2px'}}>
            {['dia','semana','mes'].map(v=>(<button key={v} onClick={()=>cambiarVista(v)} style={btnV(v)}>{v==='dia'?'Día':v==='semana'?'Semana':'Mes'}</button>))}
          </div>
        </div>
      </div>

      {slotsSet.size>0&&vista!=='mes'&&(
        <div style={{marginBottom:sp?.md||'16px',display:'flex',flexWrap:'wrap',gap:sp?.xs||'4px'}}>
          {slotsSeleccionados.map((s,i)=>(<span key={i} style={{display:'inline-flex',alignItems:'center',gap:'4px',background:`${primary}12`,border:`1px solid ${primary}30`,borderRadius:br?.full||'9999px',padding:'4px 12px',fontSize:fs(typo,'xs'),color:primary,fontWeight:fw(typo,'semibold')}}><MdAccessTime size={11}/> {s.fecha} · {slotToHHMM(s.slot)} (30 min)</span>))}
        </div>
      )}

      {vista==='mes'&&<div style={{marginBottom:sp?.sm||'8px',fontSize:fs(typo,'xs'),color:colors?.neutral?.[400]||'#9ca3af',display:'flex',alignItems:'center',gap:'6px'}}><MdCalendarToday size={11}/> Haz clic en un día para ver la agenda · Clic en una cita para ver detalles</div>}

      {loading&&<div style={{textAlign:'center',padding:sp?.xl||'32px',color:colors?.neutral?.[500]||'#6b7280',fontSize:fs(typo,'sm')}}><div style={{width:'32px',height:'32px',border:`3px solid ${colors?.neutral?.[200]||'#e5e7eb'}`,borderTop:`3px solid ${primary}`,borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 12px'}}/>Cargando citas...</div>}

      {!loading&&(<>{vista==='mes'&&<VistaMes/>}{vista==='dia'&&<VistaHoraria esSemana={false}/>}{vista==='semana'&&<VistaHoraria esSemana={true}/>}</>)}

      {modalOpen&&<ModalAgendar slots={slotsSeleccionados} onClose={()=>setModalOpen(false)} onConfirm={handleConfirmarCita} primary={primary} secondary={secondary} colors={colors} sp={sp} br={br} sh={sh} typo={typo}/>}
      {citaPreview&&<ModalPreviewCita cita={citaPreview} onClose={()=>setCitaPreview(null)} onVerDetalles={handleVerDetalles} onCancelar={c=>{setCitaPreview(null);setCitaCancelar(c);}} primary={primary} secondary={secondary} colors={colors} sp={sp} br={br} sh={sh} typo={typo}/>}
      {citaCancelar&&<ModalCancelar cita={citaCancelar} onClose={()=>setCitaCancelar(null)} onConfirm={handleCancelarCita} primary={primary} colors={colors} sp={sp} br={br} typo={typo}/>}

      <style>{`
        @keyframes spin    {to{transform:rotate(360deg);}}
        @keyframes slideIn {from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeIn  {from{opacity:0;}to{opacity:1;}}
        @keyframes slideUp {from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
    </div>
  );
};

export default CitasDashboard;