import { useEffect, useRef } from 'react';

/**
 * Curseur personnalisé épuré (cahier des charges #05).
 * Petit cercle vide (outline) collé à la souris, sans aucun retard.
 * Au survol d'un élément cliquable (a, button, [role=button], label, .cursor-pointer)
 * le cercle s'agrandit et se remplit partiellement.
 * Masqué au-dessus des champs texte (input, textarea) où le curseur natif reprend.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);

  useEffect(() => {
    // Pas de curseur custom sur appareil tactile
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    cursor.style.cssText = `
      position: fixed; top: 0; left: 0;
      width: 14px; height: 14px;
      border: 1.5px solid rgba(238,238,238,0.85);
      border-radius: 50%;
      background: transparent;
      pointer-events: none;
      z-index: 999999;
      transform: translate3d(-100px, -100px, 0);
      transition: width .18s ease, height .18s ease, background .18s ease, border-color .18s ease;
      will-change: transform;
      mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);
    dotRef.current = cursor;

    // Position appliquée directement dans l'événement : aucun lissage, aucun retard.
    // Le translate(-50%, -50%) garde le cercle centré même quand il change de taille.
    const onMove = (e) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };

    const CLICKABLE = 'a, button, [role="button"], label, .cursor-pointer, input[type="submit"], input[type="button"]';
    const TEXTFIELD = 'input:not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]';

    const reset = () => {
      cursor.style.opacity = '1';
      cursor.style.width = '14px';
      cursor.style.height = '14px';
      cursor.style.background = 'transparent';
      cursor.style.borderColor = 'rgba(238,238,238,0.85)';
    };
    const grow = () => {
      cursor.style.opacity = '1';
      cursor.style.width = '26px';
      cursor.style.height = '26px';
      cursor.style.background = 'rgba(238,238,238,0.15)';
      cursor.style.borderColor = 'rgba(238,238,238,0.95)';
    };

    const onOver = (e) => {
      if (!e.target.closest) return;
      if (e.target.closest(TEXTFIELD)) { cursor.style.opacity = '0'; return; } // champ texte → curseur natif
      if (e.target.closest(CLICKABLE)) grow();
    };
    const onOut = (e) => {
      if (!e.target.closest) return;
      if (e.target.closest(TEXTFIELD) || e.target.closest(CLICKABLE)) reset();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, true);
    document.addEventListener('mouseout', onOut, true);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseover', onOver, true);
      document.removeEventListener('mouseout', onOut, true);
      if (cursor.parentElement) cursor.parentElement.removeChild(cursor);
    };
  }, []);

  return null;
}
