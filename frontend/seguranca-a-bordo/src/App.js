import React, { useEffect, useState } from 'react';
import './App.css';
import LeftSection from './LeftSection/LeftSection';
import RightSection from './RightSection/RightSection';

function App() {
  const [response, setResponse] = useState('');

  const [action, setAction] = useState('');
  const [description, setDescription] = useState('');
  const [humor, setHumor] = useState('');
  const [status, setStatus] = useState('');
  const [police, setPolice] = useState(false);

  useEffect(() => {
    if (response.text) {
      try {
        const fields = response.text.match(/##\s*([^=\n]+)="([^"]*)"/g);
        fields.forEach(field => {
          const [, title, value] = field.match(/##\s*([^=]+)="([^"]+)"/);
          switch (title.trim().toLowerCase()) {
            case 'ações':
              setAction(value);
              break;
            case 'descrição':
              setDescription(value);
              break;
            case 'humor':
              setHumor(value);
              break;
            case 'status':
              setStatus(value);
              break;
            case 'polícia':
              setPolice(value.trim().toLowerCase() === 'true');
              break;
            default:
              break;
          }
        });
      } catch (error) {
        console.error('Error parsing response:', error);
      }
    }
  }, [response]);

  return (
    <div className="app">
      <LeftSection response={response} setResponse={setResponse} />
      <RightSection action={action} description={description} humor={humor} status={status} police={police} />
    </div>
  );
}

export default App;
