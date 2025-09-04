import { useState } from "react";

function ClipboardStorage() {
  const [mensaje, setMensaje] = useState("");

  // Pegar (leer portapapeles y guardar en localStorage)
  const handlePasteToLocalStorage = async () => {
    try {
      const text = await navigator.clipboard.readText();
      localStorage.setItem("miData", text);
      setMensaje(`Guardado en localStorage: "${text}"`);
    } catch (err) {
      console.error(err);
      setMensaje("❌ No se pudo leer el portapapeles.");
    }
  };

  // Copiar (leer localStorage y escribir en portapapeles)
  const handleCopyFromLocalStorage = async () => {
    try {
      const text = localStorage.getItem("miData") || "";
      if (!text) {
        setMensaje("⚠️ No hay nada guardado en localStorage.");
        return;
      }
      await navigator.clipboard.writeText(text);
      setMensaje(`Copiado al portapapeles: "${text}"`);
    } catch (err) {
      console.error(err);
      setMensaje("❌ No se pudo copiar al portapapeles.");
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