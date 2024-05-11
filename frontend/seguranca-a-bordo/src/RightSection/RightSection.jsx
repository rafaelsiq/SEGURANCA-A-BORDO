import React from 'react';
import './RightSection.css';

function RightSection({temperature, description, action}) {
  return (
    <div className="right-section">
      <h2>Segurança a Bordo</h2>
      <p>Deste lado exemplico as ações do herói da noite</p>
      <div className="trip-info">
        <h3>Clima da viagem</h3>
        <p>Aqui você pode inserir informações sobre o clima durante a viagem.</p>
      </div>
      <div className="trip-info">
        <h3>Detalhes/Resumo da Viagem</h3>
        <p>Aqui você pode inserir detalhes ou um resumo da viagem.</p>
      </div>
      <div className="trip-info">
        <h3>Ações a serem tomadas</h3>
        <p>Aqui você pode inserir informações sobre as ações que devem ser tomadas durante a viagem.</p>
      </div>
    </div>
  );
}

export default RightSection;
