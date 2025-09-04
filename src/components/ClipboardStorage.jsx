import { useState } from "react";

function ClipboardStorage() {
  const [mensaje, setMensaje] = useState("");

  // Detecta si un string es JSON válido
  const tryParse = (str) => {
    if (!str) return str;
    try {
      return JSON.parse(str);
    } catch {
      return str;
    }
  };

  // Copiar todo el localStorage al portapapeles (sin "debug")
  const handleCopyFromLocalStorage = async () => {
    try {
      const allData = {};

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key !== "debug") {
          const value = localStorage.getItem(key);
          allData[key] = tryParse(value);
        }
      }

      const jsonData = JSON.stringify(allData, null, 2);
      await navigator.clipboard.writeText(jsonData);

      setMensaje("📋 Copiado localStorage al portapapeles (sin debug).");
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al copiar localStorage.");
    }
  };

  // Pegar desde el portapapeles al localStorage (sin debug)
  const handlePasteToLocalStorage = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const data = JSON.parse(text);

      if (typeof data === "object" && data !== null) {
        for (const key in data) {
          if (key === "debug") continue; // ignorar debug
          const value = data[key];
          if (typeof value === "object") {
            localStorage.setItem(key, JSON.stringify(value));
          } else {
            localStorage.setItem(key, String(value));
          }
        }
        setMensaje("✅ Data pegada al localStorage (sin debug).");
      } else {
        setMensaje("⚠️ El portapapeles no contiene JSON válido.");
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
        className="px-3 py-2 rounded-xl bg-blue-500 text-white mr-6"
      >
        Copiar ADN del Yamagotchi
      </button>

      <button
        onClick={handlePasteToLocalStorage}
        className="px-3 py-2 rounded-xl bg-green-500 text-white"
      >
        Clonar Yamagotchi
      </button>

      {mensaje && <p className="text-sm text-gray-700">{mensaje}</p>}
    </div>
  );
}

export default ClipboardStorage;
