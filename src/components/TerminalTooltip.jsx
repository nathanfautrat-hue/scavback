import React, { useState } from 'react';

export default function TerminalTooltip({ children, text, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative group inline-block">
      <style>{`
        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: ${position === 'top' ? 'translateY(4px)' : 'translateX(-4px)'};
          }
          to {
            opacity: 1;
            transform: translate(0);
          }
        }

        .terminal-tooltip {
          animation: tooltipFadeIn 0.2s ease-out;
        }

        .cursor-blink-tooltip {
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>

      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="relative inline-block"
      >
        {children}

        {isVisible && (
          <div
            className={`terminal-tooltip absolute z-50 bg-black border border-[#00ff41] px-3 py-2 rounded-sm text-[#00ff41] font-mono text-xs whitespace-nowrap shadow-lg ${
              position === 'top'
                ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
                : 'left-full ml-2 top-1/2 -translate-y-1/2'
            }`}
            style={{
              boxShadow: '0 0 10px rgba(0, 255, 65, 0.3)',
              pointerEvents: 'none'
            }}
          >
            {text}<span className="cursor-blink-tooltip">█</span>
          </div>
        )}
      </div>
    </div>
  );
}