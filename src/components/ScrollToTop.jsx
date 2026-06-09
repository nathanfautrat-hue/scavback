import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Remet le scroll en haut à chaque changement de route.
 * Corrige le bug : en cliquant "Voir la page" depuis la section Artistes
 * (scrollée en bas), React Router conservait la position de scroll et la
 * page Jumistx s'ouvrait tout en bas.
 *
 * Le scroll est déclenché après le rendu (requestAnimationFrame) et en
 * 'auto' pour ne pas hériter du scroll-behavior: smooth global.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      // Si l'URL contient une ancre (#artists, #socials, #contact...) on scrolle
      // vers la section au lieu de remonter en haut.
      if (hash) {
        const el = document.getElementById(hash.slice(1));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, hash]);

  return null;
}
