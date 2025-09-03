import React from 'react';

interface ParticlesProps {
  show: boolean;
  type?: 'default' | 'cleaning';
}

const Particles: React.FC<ParticlesProps> = ({ show, type = 'default' }) => {
  if (!show) return null;

  if (type === 'cleaning') {
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          >
            <div className="w-4 h-4 bg-cyan-300/80 rounded-full shadow-lg border border-cyan-400/50">
              <div className="w-1 h-1 bg-white/60 rounded-full ml-0.5 mt-0.5"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random() * 2}s`,
          }}
        >
          {['✨', '💖', '🌟', '💕', '🎀'][Math.floor(Math.random() * 5)]}
        </div>
      ))}
    </div>
  );
};

export default Particles;