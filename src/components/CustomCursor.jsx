import { useEffect, useRef } from 'react';

/**
 * Curseur personnalisé épuré (cahier des charges #05).
 * Petit cercle vide (outline) qui suit la souris avec un léger lag naturel.
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
      transform: translate(-100px, -100px);
      transition: width .18s ease, height .18s ease, background .18s ease, border-color .18s ease;
      will-change: transform;
      mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);
    dotRef.current = cursor;

    // Position cible (souris) et position courante (lerp pour le lag)
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let curX = targetX;
    let curY = targetY;
    let raf;

    const onMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const tick = () => {
      // lerp ~0.2 => léger retard naturel
      curX += (targetX - curX) * 0.2;
      curY += (targetY - curY) * 0.2;
      cursor.style.transform = `translate(${curX - cursor.offsetWidth / 2}px, ${curY - cursor.offsetHeight / 2}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

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

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, true);
    document.addEventListener('mouseout', onOut, true);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver, true);
      document.removeEventListener('mouseout', onOut, true);
      if (cursor.parentElement) cursor.parentElement.removeChild(cursor);
    };
  }, []);

  return null;
}
