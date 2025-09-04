import { useState } from "react";

function ClipboardStorage() {
  const [mensaje, setMensaje] = useState("");

  // Detecta si un string es JSON válido
  const tryParse = (str: string | null) => {
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
      const allData: Record<string, any> = {};

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key !== "debug") {
          const value = localStorage.getItem(key);
          allData[key] = tryParse(value);
        }
      }

      const jsonData = JSON.stringify(allData, null, 2);
      await navigator.clipboard.writeText(jsonData);

      setMensaje("📋 Copiado localStorage (sin debug) al portapapeles.");
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al copiar localStorage.");
    }
  };

  // Pegar desde el portapapeles al localStorage (sin tocar debug)
  const handlePasteToLocalStorage = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const data = JSON.parse(text);

      if (typeof data === "object" && data !== null) {
        for (const key in data) {
          if (key === "debug") continue; // ignorar debug por si viene
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
      setMensaje("❌ Error al pegar
