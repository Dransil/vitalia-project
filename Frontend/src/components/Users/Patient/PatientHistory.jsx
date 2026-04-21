import React from "react";
import { useParams } from "react-router-dom";

const History_client = () => {
  const { id } = useParams();

  return (
    <div>  
        <h1>Historial del paciente con ID: {id}</h1>
        <p> {id}</p>
    </div>
  );
}
export default History_client;