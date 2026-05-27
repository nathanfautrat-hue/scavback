import React from 'react';
import { motion } from 'framer-motion';
import { Music, Palette, Film, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ServicesStudio() {
  const services = [
    {
      icon: Music,
      title: 'Audio Lab',
      description: 'Mixage, mastering, édition... Confiez-nous votre musique.',
      active: true,
      href: '/Commander'
    },
    {
      icon: Palette,
      title: 'Cover',
      description: 'Création de covers pour vos singles et albums.',
      active: false
    },
    {
      icon: Film,
      title: 'Montage Vidéo',
      description: 'Clips musicaux et montages professionnels.',
      active: false
    }
  ];

  return (
    <section id="services" className="relative py-32 px-6 overflow-hidden">
      {/* Fond */}
      <div className="absolute inset-0 bg-[#060606]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#8B0000]/5 via-transparent to-transparent pointer-events-none" />

      {/* Lignes décoratives HUD */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/[0.04]" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/[0.04]" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-[#8B0000] font-mono text-[10px] mb-4 tracking-widest uppercase">/ / Services Studio</p>
            <h2 className="text-4xl md:text-6xl font-space font-bold uppercase tracking-tighter text-white mb-6 leading-tight">
              Nos Services
            </h2>
            <p className="text-sm font-mono text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Explorez notre gamme complète de services audio et vidéo conçus pour transformer votre musique et votre vision créative.
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {services.map((service, idx) => {
              const Icon = service.icon;
              const content = (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`border p-8 transition-all duration-300 group h-full flex flex-col ${
                    service.active
                      ? 'border-white/[0.1] bg-[#111111] hover:border-[#cc0000] hover:shadow-lg hover:shadow-[#cc0000]/20'
                      : 'border-white/[0.06] bg-[#111111] opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex-grow">
                    <div className="mb-6 flex justify-center">
                      <Icon size={32} className="text-[#4A5D66] group-hover:text-white transition-colors" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-space font-bold uppercase tracking-wider text-white mb-3 text-center">
                      {service.title}
                    </h3>
                    <p className="text-xs font-mono text-gray-400 text-center">
                      {service.description}
                    </p>
                  </div>
                  
                  {service.active ? (
                    <div className="mt-6 pt-6 border-t border-white/[0.08]">
                      <div className="flex items-center justify-center gap-2 text-[#cc0000] font-mono text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all">
                        Accéder
                        <ChevronRight size={12} />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 pt-6 border-t border-white/[0.08]">
                      <p className="text-xs font-mono text-gray-600 uppercase tracking-widest text-center">(service en cours...)</p>
                    </div>
                  )}
                </motion.div>
              );

              return service.active ? (
                <Link key={idx} to={service.href} className="block">
                  {content}
                </Link>
              ) : (
                <div key={idx}>
                  {content}
                </div>
              );
            })}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <p className="text-xs font-mono text-gray-500 mb-6 uppercase tracking-widest">Prêt à commencer ?</p>
            <Link
              to="/Commander"
              className="inline-block px-10 py-4 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
            >
              Accéder aux Services
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}