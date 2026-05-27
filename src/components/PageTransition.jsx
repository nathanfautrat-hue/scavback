import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const LINES = [
  '> CHARGEMENT EN COURS...',
  '> CONNEXION AU SERVEUR SCAVBACK...',
  '> ACCÈS AUTORISÉ ✓',
  '> REDIRECTION...',
];

export default function PageTransition() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [visibleLines, setVisibleLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }

    setVisible(true);
    setFading(false);
    setVisibleLines([]);
    setProgress(0);

    let lineIndex = 0;
    const lineInterval = setInterval(() => {
      setVisibleLines(prev => [...prev, LINES[lineIndex]]);
      lineIndex++;
      if (lineIndex >= LINES.length) clearInterval(lineInterval);
    }, 200);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(progressInterval); return 100; }
        return prev + 8;
      });
    }, 80);

    const fadeTimer = setTimeout(() => {
      setFading(true);
      setTimeout(() => { setVisible(false); }, 300);
    }, 1200);

    return () => {
      clearInterval(lineInterval);
      clearInterval(progressInterval);
      clearTimeout(fadeTimer);
    };
  }, [location.pathname]);

  if (!visible) return null;

  const filled = Math.floor(progress / 8.5);
  const bar = '█'.repeat(filled) + '░'.repeat(12 - Math.min(filled, 12));

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: '#000000',
      zIndex: 99998, display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: fading ? 0 : 1, transition: 'opacity 0.3s ease',
    }}>
      <div style={{
        border: '1px solid #00ff41', boxShadow: '0 0 30px rgba(0,255,65,0.3)',
        padding: '2rem', maxWidth: '400px', width: '90%',
        fontFamily: 'Courier New, monospace', color: '#00ff41', fontSize: '1rem',
        backgroundColor: '#000',
      }}>
        {visibleLines.map((line, i) => (
          <div key={i} style={{ marginBottom: '0.4rem' }}>{line}</div>
        ))}
        {visibleLines.length === LINES.length && (
          <div style={{ marginTop: '0.4rem' }}>{bar} {progress}%</div>
        )}
      </div>
    </div>
  );
}