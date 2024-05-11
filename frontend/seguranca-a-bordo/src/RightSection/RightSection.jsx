import React from 'react';
import './RightSection.css';

function RightSection({humor, description, action, status, police }) {
  return (
    <div className="right-section">
      <h2>Segurança a Bordo</h2>
      <p>Deste lado exemplico as ações do herói da noite</p>
      <div className="trip-info">
        <h3>Status</h3>
        <p>{status}</p>
      </div>
      <div className="trip-info">
        <h3>Clima da viagem</h3>
        <p>{humor}</p>
      </div>
      <div className="trip-info">
        <h3>Detalhes/Resumo da Viagem</h3>
        <p>{description}</p>
      </div>
      <div className="trip-info">
        <h3>Ações a serem tomadas</h3>
        <p>{action}</p>
      </div>
      <div className="trip-info">
        <h3>Devo chamar a policia?</h3>
        <p>{police ? 'sim': 'nao'}</p>
      </div>
    </div>
  );
}

export default RightSection;
