import React, { useState, useRef } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import './LeftSection.css';

function LeftSection({resp, setResponse}) {
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const mediaRecorderRef = useRef(null);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start();
        setRecording(true);
      })
      .catch((error) => {
        console.error('Erro ao acessar o dispositivo de áudio:', error);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    sendAudioChunks();
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setAudioChunks((chunks) => [...chunks, event.data]);
    }
  };

  const sendAudioChunks = () => {
    if (audioChunks.length === 0) {
      console.warn('Nenhum chunk de áudio para enviar.');
      return;
    }
  
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
  
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
  
    fetch('http://127.0.0.1:5000/process_audio', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao enviar áudio para a API.');
      }
      setResponse(response.json())
      return resp;

    })
    .then(data => {
      console.log('Texto gerado:', data.text);
    })
    .catch(error => {
      console.error('Erro ao enviar áudio:', error);
    });
  };
  

  const handleClick = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="left-section">
      <h2>Motorista</h2>
      <p>Deste lado exemplifico o app do motorista</p>
      <button className={`record-button ${recording ? 'recording' : ''}`} onClick={handleClick}>
        {recording ? 'Parar gravação' : 'Iniciar gravação'}
      </button>
      <div className="microphone-icon">
        <div className="pulse-ring"></div>
        <FaMicrophone className="microphone" color={recording ? 'red' : 'black'} />
      </div>
    </div>
  );
}

export default LeftSection;
