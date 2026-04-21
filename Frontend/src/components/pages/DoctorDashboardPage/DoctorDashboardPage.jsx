// src/components/pages/DoctorDashboardPage/DoctorDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../templates/DashboardTemplate/DashboardTemplate';
import DoctorFilters from '../../organisms/DoctorFilters/DoctorFilters';
import DoctorList from '../../organisms/DoctorList/DoctorList';
import * as doctoresService from '../../../Services/Doctoresservice';

const DoctorDashboardPage = () => {
  const navigate = useNavigate();

  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [doctores, setDoctores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadDoctores();
  }, []);

  const loadDoctores = async () => {
    setIsLoading(true);
    setHasError(false);
    const result = await doctoresService.getDoctores();

    if (result.ok) {
      const datosValidos = Array.isArray(result.data) ? result.data : [];
      setDoctores(datosValidos);
      setHasError(false);
    } else {
      setDoctores([]);
      setHasError(true);
      setErrorMsg(result.msg || 'Error al cargar los doctores');
    }
    setIsLoading(false);
  };

  const handleSearch = async () => {
    if (!searchName && !searchEmail && !searchPhone) {
      loadDoctores();
      return;
    }

    setIsLoading(true);
    setHasError(false);
    const result = await doctoresService.searchDoctores(searchName, searchEmail, searchPhone);

    if (result.ok) {
      const datosValidos = Array.isArray(result.data) ? result.data : [];
      setDoctores(datosValidos);
      setHasError(false);
    } else {
      setDoctores([]);
      setHasError(true);
      setErrorMsg(result.msg || 'Error en la busqueda');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchName, searchEmail, searchPhone]);

  const handleClearFilters = () => {
    setSearchName('');
    setSearchEmail('');
    setSearchPhone('');
  };

  const handleCreateUser = () => {
    navigate('/Doctor_Register');
  };

  const handleEditDoctor = (id) => {
    navigate(`/Doctor_Mod/${id}`);
  };

  const handleToggleEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    const mensaje = nuevoEstado === 'activo'
      ? '¿Estas seguro de que deseas activar?'
      : '¿Estas seguro de que deseas desactivar?';

    if (window.confirm(mensaje)) {
      const result = await doctoresService.cambiarEstadoDoctor(id);
      if (result.ok) {
        alert(result.msg || `Doctor ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'} correctamente`);
        loadDoctores();
      } else {
        alert(result.msg || 'Error al cambiar el estado del usuario');
      }
    }
  };

  return (
    <DashboardTemplate
      title="Registro General de Doctores"
      subtitle="Gestiona todos los profesionales medicos del sistema"
    >
      <div
        style={{
          background: 'transparent',
          borderRadius: '0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '600px',
        }}
      >
        <DoctorFilters
          searchName={searchName}
          onSearchNameChange={(e) => setSearchName(e.target.value)}
          searchEmail={searchEmail}
          onSearchEmailChange={(e) => setSearchEmail(e.target.value)}
          searchPhone={searchPhone}
          onSearchPhoneChange={(e) => setSearchPhone(e.target.value)}
          onClearFilters={handleClearFilters}
          onCreateUser={handleCreateUser}
        />

        <div
          style={{
            flex: 1,
            overflow: 'auto',
          }}
        >
          <DoctorList
            doctores={doctores}
            isLoading={isLoading}
            hasError={hasError}
            errorMsg={errorMsg}
            onRetry={loadDoctores}
            onEditDoctor={handleEditDoctor}
            onToggleEstado={handleToggleEstado}
          />
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default DoctorDashboardPage;