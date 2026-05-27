import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '/', page: true },
    { name: 'Artistes', href: '/#artists' },
    { name: 'Réseaux', href: '/#socials' },
    { name: 'Services Studio', href: '/Commander', page: true, hasDropdown: true },
    { name: 'Contact', href: '/#contact' },
    { name: 'Presets', href: 'https://scavback.gumroad.com/', external: true },
  ];

  const services = [
    { name: 'Audio Lab', active: true },
    { name: 'Cover Design', active: false },
    { name: 'Montage Vidéo', active: false },
  ];

  const [hoveredDropdown, setHoveredDropdown] = useState(null);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/[0.05] ${
        isScrolled ? 'bg-[#020202]/95 backdrop-blur-md py-4' : 'bg-gradient-to-b from-[#020202]/90 to-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center relative">
        {/* HUD Elements */}
        <div className="absolute left-6 top-0 w-2 h-2 border-t border-l border-white/30 -mt-2 -ml-2"></div>
        
        <a href="/" className="text-xl font-space font-bold tracking-widest uppercase relative z-10">
          SCAV<span className="text-[#8B0000]">BACK</span>
          <span className="text-[9px] font-mono text-gray-600 ml-2 tracking-tighter hidden md:inline-block">[SYS.ONLINE]</span>
        </a>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-12 items-center">
          {navLinks.map((link) => (
            <div
              key={link.name}
              onMouseEnter={() => link.hasDropdown && setHoveredDropdown(link.name)}
              onMouseLeave={() => setHoveredDropdown(null)}
              className="relative"
            >
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={`text-xs font-mono tracking-widest transition-colors ${
                  link.external 
                    ? 'text-[#8B0000] hover:text-red-500' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {link.external ? `[ ${link.name} ]` : link.name.toUpperCase()}
              </a>

              {link.hasDropdown && hoveredDropdown === link.name && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-sm shadow-2xl z-50 pointer-events-auto"
                >
                  <div className="p-4 space-y-3">
                    {services.map((service) => (
                      <a
                        key={service.name}
                        href={service.active ? "/Commander" : "#"}
                        className={`block text-xs font-mono tracking-widest transition-colors py-2 px-3 rounded-sm ${
                          service.active
                            ? 'text-white bg-white/5 hover:bg-white/10 cursor-pointer'
                            : 'text-gray-600 cursor-default opacity-50'
                        }`}
                        onClick={(e) => !service.active && e.preventDefault()}
                      >
                        {service.name.toUpperCase()}
                        {!service.active && <span className="ml-2 text-[10px] text-gray-700">(coming soon)</span>}
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  onClick={() => !link.external && setIsMobileMenuOpen(false)}
                  className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                    link.external ? 'text-[#8B0000]' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.external ? `[ ${link.name} ]` : `> ${link.name}`}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}