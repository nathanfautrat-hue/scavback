import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube } from 'lucide-react';

const socials = [
  {
    name: 'Instagram',
    handle: '@scavback',
    label: 'Notre Instagram officiel',
    icon: Instagram,
    href: 'https://www.instagram.com/scavback'
  },
  {
    name: 'YouTube',
    handle: '@SCAVBACK',
    label: 'Notre chaîne YouTube',
    icon: Youtube,
    href: 'https://www.youtube.com/@SCAVBACK'
  },
];

export default function Socials() {
  return (
    <section id="socials" className="py-32 bg-[#020202] relative border-t border-white/[0.05] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-color-dodge scale-105"
          style={{ backgroundImage: `url("https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699ee2f7ff8ae9f68639cff6/12fe70f2c_IMG_0346-Edit.jpg")` }}
        ></div>
        <div className="absolute inset-0 bg-[#020202]/80 z-10 backdrop-blur-[2px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border border-white/[0.05] bg-[#020202]/60 backdrop-blur-md p-10 md:p-16"
          >
            <div className="mb-12 border-b border-white/[0.05] pb-6">
              <p className="text-[#8B0000] font-mono text-[10px] mb-2 tracking-widest uppercase">/ / Network _ Link</p>
              <h2 className="text-3xl md:text-5xl font-space font-bold uppercase tracking-tighter text-white">
                Connexion
              </h2>
              <p className="text-gray-500 font-mono text-[11px] mt-3 tracking-widest">
                Suivez les comptes officiels du collectif SCAVBACK.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socials.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group flex items-center gap-6 p-6 border border-white/[0.05] bg-black/40 hover:bg-[#8B0000]/10 hover:border-[#8B0000]/50 transition-all duration-300"
                  >
                    <Icon size={28} className="text-gray-500 group-hover:text-white transition-colors flex-shrink-0" strokeWidth={1.5} />
                    <div>
                      <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-1">{social.label}</p>
                      <p className="text-white font-space font-bold text-base tracking-wide">{social.handle}</p>
                    </div>
                    <span className="ml-auto text-gray-600 group-hover:text-[#8B0000] font-mono text-xs transition-colors">{'>'}</span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}