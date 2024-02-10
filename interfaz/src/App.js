import React, { useState, useEffect } from 'react';
import './App.css';
import headerImage from './automundo.jpg';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = (event) => {
  // Verifica si se ha seleccionado algún archivo
    if (event.target.files.length === 0) {
      console.log('No se ha seleccionado ningún archivo o se canceló la selección.');
      return; // Sal del manejador si no se selecciona ningún archivo
    }

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      try {
        const jsonData = JSON.parse(text);
        const csv = jsonToCSV(jsonData);
        downloadCSV(csv, 'data.csv');
      } catch (error) {
        console.error('Error al convertir el archivo:', error);
      }
    };
    reader.readAsText(file);
  };

  const jsonToCSV = (jsonData) => {
    if (!jsonData.length) return '';
    
    const keys = Object.keys(jsonData[0]);
    const csvRows = jsonData.map(row =>
      keys.map(key => JSON.stringify(row[key], replacer)).join(',')
    );
    csvRows.unshift(keys.join(','));
    return csvRows.join('\n');
  };

  const replacer = (key, value) => value === null ? '' : value;

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="App">
      {loading ? (
        <div className="loading-screen">
          <p className="custom-font">Cargando...</p>
        </div>
      ) : (
        <>
          <div className="header">
            <br/>
            <img src={headerImage} alt="Encabezado" className="custom-font" />
            <h1 className="custom-font">Automatizador de Pólizas de Grupo Automundo</h1>
            <br/>
          </div>
          <div>
          <br/>
            {/* Puedes ocultar este input y usar un label estilizado si quieres personalizar completamente el botón */}
            <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} id="file-upload" />
            <br/>
            <label htmlFor="file-upload" className="file-upload-btn">Selecciona un archivo</label>

          </div>
        </>
      )}
    </div>
  );  
}



export default App;

