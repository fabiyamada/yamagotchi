import React, { useState, useEffect } from 'react';

const ExportImport = () => {
  const [exportData, setExportData] = useState('');
  const [importData, setImportData] = useState('');
  const [exportStatus, setExportStatus] = useState({ message: '', type: '' });
  const [importStatus, setImportStatus] = useState({ message: '', type: '' });
  const [currentData, setCurrentData] = useState('');
  const [petName, setPetName] = useState('');
  const [petLevel, setPetLevel] = useState('');

  // Función para mostrar status temporalmente
  const showStatus = (setStatus, message, type) => {
    setStatus({ message, type });
    setTimeout(() => setStatus({ message: '', type: '' }), 3000);
  };

  // Función para exportar todos los datos de localStorage
  const handleExportData = () => {
    try {
      const allData = {};
      
      // Obtener todos los elementos de localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        allData[key] = value;
      }

      // Convertir a JSON
      const jsonData = JSON.stringify(allData, null, 2);
      setExportData(jsonData);

      // Copiar al portapapeles
      navigator.clipboard.writeText(jsonData).then(() => {
        showStatus(setExportStatus, '✅ Datos copiados al portapapeles', 'success');
      }).catch(() => {
        showStatus(setExportStatus, '📋 Datos listos para copiar manualmente', 'success');
      });

    } catch (error) {
      showStatus(setExportStatus, '❌ Error al exportar: ' + error.message, 'error');
    }
  };

  // Función para importar datos a localStorage
  const handleImportData = () => {
    if (!importData.trim()) {
      showStatus(setImportStatus, '⚠️ Por favor, pega los datos a importar', 'error');
      return;
    }

    try {
      // Parsear el JSON
      const importedDataObj = JSON.parse(importData);
      
      // Confirmar antes de sobrescribir
      const confirmed = window.confirm('¿Estás seguro de que quieres importar estos datos? Esto sobrescribirá los datos actuales.');
      
      if (!confirmed) {
        showStatus(setImportStatus, '❌ Importación cancelada', 'error');
        return;
      }

      // Limpiar localStorage actual
      localStorage.clear();

      // Importar los nuevos datos
      for (const [key, value] of Object.entries(importedDataObj)) {
        localStorage.setItem(key, value);
      }

      showStatus(setImportStatus, '✅ Datos importados correctamente', 'success');
      updateDisplay();
      setImportData('');

    } catch (error) {
      showStatus(setImportStatus, '❌ Error: Los datos no tienen el formato correcto', 'error');
    }
  };

  // Funciones de demostración
  const addSampleData = () => {
    localStorage.setItem('petName', 'Fluffy');
    localStorage.setItem('petLevel', '15');
    localStorage.setItem('petHealth', '100');
    localStorage.setItem('petHappiness', '85');
    localStorage.setItem('coins', '1250');
    localStorage.setItem('items', JSON.stringify(['collar', 'juguete', 'comida_premium']));
    localStorage.setItem('lastPlayed', new Date().toISOString());
    
    updateDisplay();
    showStatus(setExportStatus, '✅ Datos de ejemplo agregados', 'success');
  };

  const clearAllData = () => {
    if (window.confirm('¿Seguro que quieres borrar todos los datos?')) {
      localStorage.clear();
      updateDisplay();
      setExportData('');
      showStatus(setExportStatus, '🗑️ Todos los datos eliminados', 'success');
    }
  };

  const savePetData = () => {
    if (petName && petLevel) {
      localStorage.setItem('petName', petName);
      localStorage.setItem('petLevel', petLevel);
      localStorage.setItem('lastSaved', new Date().toLocaleString());
      
      setPetName('');
      setPetLevel('');
      updateDisplay();
      showStatus(setExportStatus, `✅ ${petName} guardado correctamente`, 'success');
    } else {
      alert('Por favor, completa el nombre y nivel de tu mascota');
    }
  };

  const updateDisplay = () => {
    if (localStorage.length === 0) {
      setCurrentData('No hay datos guardados');
      return;
    }

    let displayText = 'Datos actuales en localStorage:\n\n';
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      displayText += `${key}: ${value}\n`;
    }
    
    setCurrentData(displayText);
  };

  // Inicializar al montar el componente
  useEffect(() => {
    updateDisplay();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center p-5">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-10 max-w-2xl w-full shadow-2xl border border-white/20">
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-8">
          🎮 Exportar/Importar Datos del Juego
        </h1>

        {/* Sección de Exportar */}
        <div className="mb-8 p-6 bg-white/50 rounded-2xl border border-white/30 hover:transform hover:-translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-3">
            <span>📤</span>Exportar Datos
          </h2>
          <button 
            onClick={handleExportData}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 mb-4"
          >
            Copiar Todos los Datos
          </button>
          <textarea
            value={exportData}
            readOnly
            placeholder="Los datos exportados aparecerán aquí..."
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl font-mono text-sm resize-none focus:border-purple-500 focus:outline-none bg-white/80 transition-colors duration-300"
          />
          {exportStatus.message && (
            <div className={`mt-3 p-3 rounded-lg font-medium transition-all duration-300 ${
              exportStatus.type === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {exportStatus.message}
            </div>
          )}
        </div>

        {/* Sección de Importar */}
        <div className="mb-8 p-6 bg-white/50 rounded-2xl border border-white/30 hover:transform hover:-translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-3">
            <span>📥</span>Importar Datos
          </h2>
          <textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder="Pega aquí los datos que quieres importar..."
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl font-mono text-sm resize-none focus:border-purple-500 focus:outline-none bg-white/80 transition-colors duration-300 mb-4"
          />
          <button 
            onClick={handleImportData}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            Importar Datos
          </button>
          {importStatus.message && (
            <div className={`mt-3 p-3 rounded-lg font-medium transition-all duration-300 ${
              importStatus.type === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {importStatus.message}
            </div>
          )}
        </div>

        {/* Sección de Demostración */}
         {/*
        <div className="p-5 bg-white/30 rounded-2xl border border-white/40">
          <h3 className="text-xl font-semibold text-gray-600 mb-4">🧪 Prueba el Sistema</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              onClick={addSampleData}
              className="flex-1 min-w-32 bg-gradient-to-r from-green-400 to-blue-400 text-white font-medium py-2 px-4 rounded-full text-sm hover:shadow-md transition-all duration-300"
            >
              Datos de Prueba
            </button>
            <button 
              onClick={clearAllData}
              className="flex-1 min-w-32 bg-gradient-to-r from-red-400 to-pink-400 text-white font-medium py-2 px-4 rounded-full text-sm hover:shadow-md transition-all duration-300"
            >
              Limpiar Todo
            </button>
            <button 
              onClick={updateDisplay}
              className="flex-1 min-w-32 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-medium py-2 px-4 rounded-full text-sm hover:shadow-md transition-all duration-300"
            >
              Actualizar
            </button>
          </div>
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="Nombre de tu mascota"
            className="w-full p-3 border-2 border-gray-200 rounded-lg mb-3 focus:border-purple-500 focus:outline-none bg-white/80 transition-colors duration-300"
          />
          <input
            type="number"
            value={petLevel}
            onChange={(e) => setPetLevel(e.target.value)}
            placeholder="Nivel de tu mascota"
            min="1"
            max="100"
            className="w-full p-3 border-2 border-gray-200 rounded-lg mb-3 focus:border-purple-500 focus:outline-none bg-white/80 transition-colors duration-300"
          />
          <button 
            onClick={savePetData}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold py-2 px-4 rounded-full mb-4 hover:shadow-md transition-all duration-300"
          >
            Guardar Mascota
          </button>
          <div className="bg-white/60 p-4 rounded-lg font-mono text-xs text-gray-600 max-h-40 overflow-y-auto whitespace-pre-line">
            {currentData}
          </div>
        </div>*/}
      </div>
    </div>
  );
};

export default ExportImport;