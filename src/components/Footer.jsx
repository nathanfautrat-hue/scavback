import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#020202] border-t border-white/[0.05] py-12 relative z-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xl font-space font-bold tracking-widest uppercase text-white">
            SCAV<span className="text-[#8B0000]">BACK</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-mono uppercase tracking-widest text-gray-500">
            <a href="#socials" className="hover:text-white transition-colors">/ / Réseaux</a>
            <a href="mailto:scavback@gmail.com" className="hover:text-white transition-colors">/ / Email</a>
            <a href="https://scavback.gumroad.com/" target="_blank" rel="noopener noreferrer" className="text-[#8B0000] hover:text-red-500 transition-colors">/ / PRESETS</a>
          </div>
          
          <div className="text-[9px] font-mono text-gray-600 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A5D66]"></span>
            <a href="/AdminSecret" className="hover:text-gray-400 transition-colors">SYS.SECURE © 2026</a>
          </div>
        </div>
      </div>
    </footer>
  );
}