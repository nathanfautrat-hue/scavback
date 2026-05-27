import React from 'react';
import { motion } from 'framer-motion';
import { Music, Headphones, Sliders } from 'lucide-react';

export default function AudioLabSection() {
  return (
    <section id="audiolab" className="relative py-28 px-6 overflow-hidden">
      {/* Fond légèrement différent */}
      <div className="absolute inset-0 bg-[#060606]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#8B0000]/5 via-transparent to-transparent pointer-events-none" />

      {/* Lignes décoratives HUD */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/[0.04]" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/[0.04]" />

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Tag */}
          <p className="text-[#8B0000] font-mono text-[10px] mb-4 tracking-widest uppercase">/ / Studio _ Audio Lab</p>

          {/* Titre */}
          <h2 className="text-4xl md:text-6xl font-space font-bold uppercase tracking-tighter text-white mb-6 leading-tight">
            Votre son,<br /><span className="text-gray-600">notre expertise</span>
          </h2>

          {/* Description */}
          <p className="text-sm font-mono text-gray-500 leading-relaxed max-w-xl mx-auto mb-12">
            Mixage, mastering, édition... Confiez-nous votre musique et on s'occupe de tout.
            <br />Résultat professionnel garanti.
          </p>

          {/* Icônes */}
          <div className="flex justify-center gap-10 mb-14">
            {[
              { icon: Sliders, label: 'Mixage' },
              { icon: Headphones, label: 'Mastering' },
              { icon: Music, label: 'Édition' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 border border-white/[0.08] bg-white/[0.02] flex items-center justify-center group-hover:border-white/20 transition-colors">
                  <Icon size={18} className="text-gray-500 group-hover:text-gray-300 transition-colors" />
                </div>
                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/Commander?tab=essai"
              className="px-8 py-4 border border-white/20 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/[0.05] transition-colors"
            >
              Essai Gratuit
            </a>
            <a
              href="/Commander?tab=commande"
              className="px-8 py-4 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
            >
              Passer commande
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}