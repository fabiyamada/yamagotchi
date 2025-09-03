import React, { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  platforms: string[];
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    console.log("Componente InstallButton montado");
    console.log("¿Soporte PWA?", 'serviceWorker' in navigator);
    console.log("¿beforeinstallprompt disponible?", 'onbeforeinstallprompt' in window);
    
    const handler = (e: Event) => {
      e.preventDefault();
      console.log("🎉 beforeinstallprompt disparado!", e); // Debug
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Debug: verificar si ya está instalado
    if ('getInstalledRelatedApps' in navigator) {
      (navigator as any).getInstalledRelatedApps().then((apps: any) => {
        console.log("Apps instaladas:", apps);
      });
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.log("No hay deferredPrompt disponible");
      return;
    }

    console.log("Iniciando instalación...");
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    console.log("Resultado instalación:", choice.outcome);
    setDeferredPrompt(null);
    setCanInstall(false);
  };

  return (
    <div className="text-center">
      <button
        onClick={handleInstall}
        disabled={!deferredPrompt}
        className={`px-4 py-2 rounded text-white ${
          deferredPrompt ? 'bg-blue-600' : 'bg-gray-400'
        }`}
      >
        Instalar App {canInstall ? '✅' : '❌'}
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Debug: {deferredPrompt ? 'Prompt disponible' : 'Esperando prompt...'}
      </p>
    </div>
  );
}