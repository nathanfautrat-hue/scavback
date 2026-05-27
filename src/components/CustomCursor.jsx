import { useEffect } from 'react';

export default function CustomCursor() {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(style);

    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    cursor.innerHTML = `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <!-- Cercle extérieur fin -->
        <circle cx="20" cy="20" r="18" stroke="white" stroke-width="0.8" fill="none" opacity="0.4"/>
        <!-- Cercle principal rouge -->
        <circle cx="20" cy="20" r="12" stroke="#cc0000" stroke-width="1.5" fill="none"/>
        <!-- Croix haut -->
        <line x1="20" y1="0" x2="20" y2="7" stroke="white" stroke-width="1"/>
        <!-- Croix bas -->
        <line x1="20" y1="33" x2="20" y2="40" stroke="white" stroke-width="1"/>
        <!-- Croix gauche -->
        <line x1="0" y1="20" x2="7" y2="20" stroke="white" stroke-width="1"/>
        <!-- Croix droite -->
        <line x1="33" y1="20" x2="40" y2="20" stroke="white" stroke-width="1"/>
        <!-- Petit point central rouge -->
        <circle cx="20" cy="20" r="1.5" fill="#cc0000"/>
      </svg>
    `;
    cursor.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 999999;
      transform: translate(-50%, -50%);
      top: -100px;
      left: -100px;
    `;
    document.body.appendChild(cursor);

    const moveCursor = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    document.querySelectorAll('*').forEach(el => {
      el.style.cursor = 'none';
    });

    const observer = new MutationObserver(() => {
      document.querySelectorAll('*').forEach(el => {
        el.style.cursor = 'none';
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('mousemove', moveCursor, false);

    return () => {
      window.removeEventListener('mousemove', moveCursor, false);
      observer.disconnect();
      if (cursor.parentElement) cursor.parentElement.removeChild(cursor);
      if (style.parentElement) style.parentElement.removeChild(style);
    };
  }, []);

  return null;
}