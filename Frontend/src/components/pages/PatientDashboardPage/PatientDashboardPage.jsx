// src/components/pages/PatientDashboardPage/PatientDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../templates/DashboardTemplate/DashboardTemplate';
import DoctorFilters from '../../organisms/DoctorFilters/DoctorFilters';
import PatientList from '../../organisms/PatientList/PatientList';
import * as pacientesService from '../../../Services/Pacienteservice';

const PatientDashboardPage = () => {
  const navigate = useNavigate();

  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    setIsLoading(true);
    setHasError(false);
    const result = await pacientesService.getPacientes();

    if (result.ok) {
      const datosValidos = Array.isArray(result.data) ? result.data : [];
      setPacientes(datosValidos);
      setHasError(false);
    } else {
      setPacientes([]);
      setHasError(true);
      setErrorMsg(result.msg || 'Error al cargar los pacientes');
    }
    setIsLoading(false);
  };

  const handleSearch = async () => {
    if (!searchName && !searchEmail && !searchPhone) {
      loadPacientes();
      return;
    }

    setIsLoading(true);
    setHasError(false);
    const result = await pacientesService.searchPacientes(searchName, searchEmail, searchPhone);

    if (result.ok) {
      const datosValidos = Array.isArray(result.data) ? result.data : [];
      setPacientes(datosValidos);
      setHasError(false);
    } else {
      setPacientes([]);
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

  const handleCreatePatient = () => {
    navigate('/Patient_Register');
  };

  const handleEditPatient = (id) => {
    navigate(`/Patient_Mod/${id}`);
  };

  const handleViewHistory = (id) => {
    navigate(`/History_client/${id}`);
  };

  return (
    <DashboardTemplate
      title="Registro de Pacientes"
      subtitle="Gestiona todos los pacientes del consultorio"
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
          onCreateUser={handleCreatePatient}
        />

        <div
          style={{
            flex: 1,
            overflow: 'auto',
          }}
        >
          <PatientList
            pacientes={pacientes}
            isLoading={isLoading}
            hasError={hasError}
            errorMsg={errorMsg}
            onRetry={loadPacientes}
            onEditPatient={handleEditPatient}
            onViewHistory={handleViewHistory}
          />
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default PatientDashboardPage;