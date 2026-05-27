import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const beatmakers = [
  {
    name: "Milou",
    role: "Beatmaker",
    description: "Production sur mesure, sonorités sombres et percutantes.",
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/prodbymilou/' },
      { label: 'VVault', href: 'https://www.vvault.app/prodbymilou' }
    ],
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699ee2f7ff8ae9f68639cff6/337d54c9e_LOGO.jpg"
  },
  {
    name: "Plugz",
    role: "Beatmaker",
    description: "Plugz Beatz est un beatmaker français spécialisé dans les prods trap, drill et aux ambiances sombres. Il crée des instrumentales puissantes et modernes pour la nouvelle génération d'artistes.",
    links: [
      { label: 'BeatStars', href: 'https://www.beatstars.com/plugzbeatz' },
      { label: 'VVault', href: 'https://www.vvault.app/plugz_beatz' },
      { label: 'YouTube', href: 'https://www.youtube.com/@plugz_beatz' },
      { label: 'TikTok', href: 'https://www.tiktok.com/@plugz_beatz?_r=1&_t=ZG-94bD9K8Ylyi' }
    ],
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699ee2f7ff8ae9f68639cff6/5c802336b_logo.jpg"
  },
  {
    name: "Mael.wave",
    role: "Beatmaker",
    description: "Univers sonore profond, entre ambient et trap expérimentale.",
    links: [
      { label: 'VVault', href: 'https://www.vvault.app/mael-wave' },
      { label: 'TikTok', href: 'https://www.tiktok.com/@maelkz0?_r=1&_t=ZN-94bDGNXpVMk' }
    ],
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699ee2f7ff8ae9f68639cff6/b7c4f2272_1772960912859.jpg"
  }
];

const rappeurs = [
  {
    name: "Jumistx",
    role: "Rappeur",
    description: "Jumistx est un rappeur du collectif SCAVBACK, actif depuis plusieurs années. Il développe un univers rap moderne et expérimental avec plusieurs singles sortis récemment.",
    links: [
      { label: 'YouTube', href: 'https://www.youtube.com/@jumistx00' },
      { label: 'Twitter', href: 'https://x.com/jumistx' },
      { label: 'LinkTree', href: 'https://linktr.ee/Jumistx' }
    ],
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699ee2f7ff8ae9f68639cff6/71de55d63_IMG_0305-Enhanced-NR_light.jpg",
    pageLink: '/Jumistx'
  }
];

function ArtistCard({ artist, index }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-[#040404] border border-white/[0.05] overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative h-64 w-full overflow-hidden border-b border-white/[0.05]">
        <div className="absolute inset-0 bg-[#020202]/60 group-hover:bg-[#020202]/20 transition-colors duration-500 z-10 mix-blend-multiply"></div>
        {artist.pageLink ? (
          <Link to={artist.pageLink}>
            <img
              src={artist.image}
              alt={artist.name}
              className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-[0.2] group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            />
          </Link>
        ) : (
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-[0.2] group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          />
        )}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#4A5D66]"></span>
          <span className="text-[9px] font-mono text-white tracking-widest">{artist.role.toUpperCase()}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 relative z-20 flex flex-col h-[calc(100%-16rem)]">
        <h3 className="text-lg font-space font-bold mb-3 uppercase tracking-wider text-gray-300 group-hover:text-white transition-colors">
          {artist.name}
        </h3>
        <p className="text-[11px] font-mono text-gray-500 mb-6 leading-relaxed flex-1">
          {artist.description}
        </p>

        {/* Links */}
        <div className="flex flex-wrap gap-3 mt-auto pt-4 border-t border-white/[0.05]">
          {artist.pageLink && (
            <Link
              to={artist.pageLink}
              className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8B0000] hover:text-white transition-colors flex items-center gap-1"
            >
              Voir la page <span>{'>'}</span>
            </Link>
          )}
          {artist.links.length > 0 ? artist.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#4A5D66] hover:text-[#8B0000] transition-colors flex items-center gap-1"
            >
              {link.label} <span>{'>'}</span>
            </a>
          )) : (
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">— No Link</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Artists() {
  return (
    <section id="artists" className="py-32 bg-[#020202] relative border-t border-white/[0.05]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.05] pb-6">
          <div>
            <p className="text-[#8B0000] font-mono text-[10px] mb-2 tracking-widest uppercase">/ / Database _ Access</p>
            <h2 className="text-4xl md:text-5xl font-space font-bold uppercase tracking-tighter">
              Les <span className="text-gray-600">Artistes</span>
            </h2>
          </div>
          <div className="font-mono text-[10px] text-gray-500 tracking-widest">
            ENTITIES FOUND: 0{beatmakers.length + rappeurs.length}
          </div>
        </div>

        {/* Beatmakers */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <p className="text-[10px] font-mono text-[#4A5D66] tracking-widest uppercase">// CAT_01 — Beatmakers</p>
            <div className="flex-1 h-[1px] bg-white/[0.05]"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/[0.05]">
            {beatmakers.map((artist, index) => (
              <ArtistCard key={artist.name} artist={artist} index={index} />
            ))}
          </div>
        </div>

        {/* Rappeurs */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <p className="text-[10px] font-mono text-[#4A5D66] tracking-widest uppercase">// CAT_02 — Rappeurs</p>
            <div className="flex-1 h-[1px] bg-white/[0.05]"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/[0.05]">
            {rappeurs.map((artist, index) => (
              <ArtistCard key={artist.name} artist={artist} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}