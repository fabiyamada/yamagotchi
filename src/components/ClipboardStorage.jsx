import { useState } from "react";

function ClipboardStorage() {
  const [mensaje, setMensaje] = useState("");

  const handleCopyFromLocalStorage = async () => {
    try {
      const allData = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          allData[key] = localStorage.getItem(key);
        }
      }
      const jsonData = JSON.stringify(allData, null, 2);
      await navigator.clipboard.writeText(jsonData);
      setMensaje("📋 Copiado todo el localStorage al portapapeles.");
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al copiar localStorage.");
    }
  };

  const handlePasteToLocalStorage = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const data = JSON.parse(text);
      if (typeof data === "object" && data !== null) {
        for (const key in data) {
          localStorage.setItem(key, data[key]);
        }
        setMensaje("✅ Data pegada al localStorage.");
      } else {
        setMensaje("⚠️ El contenido no es un JSON válido.");
      }
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al pegar data al localStorage.");
    }
  };

  return (
    <div className="space-y-2 p-4 border rounded">
      <button
        onClick={handleCopyFromLocalStorage}
        className="px-3 py-2 rounded bg-blue-500 text-white"
      >
        Copiar data del localStorage
      </button>

      <button
        onClick={handlePasteToLocalStorage}
        className="px-3 py-2 rounded bg-green-500 text-white"
      >
        Pegar data al localStorage
      </button>

      {mensaje && <p className="text-sm text-gray-700">{mensaje}</p>}
    </div>
  );
}

export default ClipboardStorage;

