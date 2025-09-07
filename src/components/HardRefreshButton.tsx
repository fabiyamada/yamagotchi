import React from 'react';
import { RefreshCw } from 'lucide-react';

const HardRefreshButton = () => {
  const handleHardRefresh = () => {
    // Force a hard refresh by reloading the page and clearing cache
    window.location.reload();
  };
 
  return (
    <button
      onClick={handleHardRefresh}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-poppins rounded-full text-sm transition-colors border-2 border-blue-600 shadow-lg"
      title="Recarga completa de la página"
    >
      <RefreshCw size={16} />
      Hard Refresh
    </button>
  );
};

export default HardRefreshButton;