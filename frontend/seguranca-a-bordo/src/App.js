import React, { useState } from 'react';
import './App.css';
import LeftSection from './LeftSection/LeftSection';
import RightSection from './RightSection/RightSection';

function App() {
  const [response, setResponse] = useState('')
  const [action, setAction] = useState('')
  const [description, setDescription] = useState('')
  const [temperature, setTemperature] = useState('')

  return (
    <div className="app">
      <LeftSection response={response} setResponse={setResponse}/>
      <RightSection action={action} description={description} temperature={temperature} />
    </div>
  );
}

export default App;
