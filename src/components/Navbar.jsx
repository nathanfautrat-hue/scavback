import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ferme le menu mobile à chaque changement de route
  useEffect(() => { setIsMobileMenuOpen(false); }, [location.pathname, location.hash]);

  // type: 'route' (Link interne) | 'anchor' (section de la home) | 'external'
  const navLinks = [
    { name: 'Accueil', to: '/', type: 'route' },
    { name: 'Artistes', to: '/#artists', type: 'anchor' },
    { name: 'Réseaux', to: '/#socials', type: 'anchor' },
    { name: 'Services Studio', to: '/Commander', type: 'route', hasDropdown: true },
    { name: 'Contact', to: '/#contact', type: 'anchor' },
    { name: 'Presets', href: 'https://scavback.gumroad.com/', type: 'external' },
  ];

  const services = [
    { name: 'Audio Lab', active: true, to: '/Commander' },
    { name: 'Cover Design', active: false },
    { name: 'Montage Vidéo', active: false },
  ];

  const isActive = (link) => {
    if (link.type === 'route' && link.to === '/') return location.pathname === '/' && !location.hash;
    if (link.type === 'route') return location.pathname.startsWith(link.to);
    return false;
  };

  const linkClasses = (link) =>
    `text-xs font-mono tracking-widest transition-colors ${
      link.type === 'external'
        ? 'text-[#8B0000] hover:text-red-500'
        : isActive(link)
          ? 'text-white'
          : 'text-gray-500 hover:text-white'
    }`;

  // Rendu d'un lien selon son type (desktop)
  const renderLink = (link) => {
    const label = link.type === 'external' ? `[ ${link.name} ]` : link.name.toUpperCase();
    if (link.type === 'external') {
      return (
        <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClasses(link)}>
          {label}
        </a>
      );
    }
    return (
      <Link to={link.to} className={linkClasses(link)}>
        {label}
      </Link>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 border-b border-white/[0.05] ${
        isScrolled ? 'bg-[#020202]/95 backdrop-blur-md py-4' : 'bg-gradient-to-b from-[#020202]/90 to-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center relative">
        <div className="absolute left-6 top-0 w-2 h-2 border-t border-l border-white/30 -mt-2 -ml-2"></div>

        <Link to="/" className="text-xl font-space font-bold tracking-widest uppercase relative z-10">
          SCAV<span className="text-[#8B0000]">BACK</span>
          <span className="text-[9px] font-mono text-gray-600 ml-2 tracking-tighter hidden md:inline-block">[SYS.ONLINE]</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-12 items-center">
          {navLinks.map((link) => (
            <div
              key={link.name}
              onMouseEnter={() => link.hasDropdown && setHoveredDropdown(link.name)}
              onMouseLeave={() => setHoveredDropdown(null)}
              className="relative"
            >
              {renderLink(link)}

              {link.hasDropdown && (
                <AnimatePresence>
                  {hoveredDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 pt-4 w-48 z-50"
                    >
                      <div className="bg-[#0a0a0a] border border-white/10 rounded-sm shadow-2xl p-4 space-y-3">
                        {services.map((service) =>
                          service.active ? (
                            <Link
                              key={service.name}
                              to={service.to}
                              className="block text-xs font-mono tracking-widest text-white bg-white/5 hover:bg-white/10 transition-colors py-2 px-3 rounded-sm"
                            >
                              {service.name.toUpperCase()}
                            </Link>
                          ) : (
                            <span
                              key={service.name}
                              className="block text-xs font-mono tracking-widest text-gray-600 opacity-50 py-2 px-3 rounded-sm cursor-default"
                            >
                              {service.name.toUpperCase()}
                              <span className="ml-2 text-[10px] text-gray-700">(coming soon)</span>
                            </span>
                          )
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          aria-label="Menu"
          className="md:hidden text-gray-400 hover:text-white relative z-10"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-[#020202] border-b border-white/10 shadow-2xl"
          >
            <div className="flex flex-col px-6 py-6 gap-6 font-mono">
              {navLinks.map((link) =>
                link.type === 'external' ? (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold uppercase tracking-widest text-[#8B0000]"
                  >
                    [ {link.name} ]
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                      isActive(link) ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {'> '}{link.name}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
