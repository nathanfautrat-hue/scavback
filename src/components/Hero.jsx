import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

export default function Hero() {
  const titleRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    const handleMouseOver = () => {
      let iteration = 0;
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        el.innerHTML = 'SCAVBACK'
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              const isBack = index >= 4;
              return `<span style="color:${isBack ? '#8B0000' : 'white'}">${'SCAVBACK'[index]}</span>`;
            }
            return `<span style="color:#cc0000">${LETTERS[Math.floor(Math.random() * LETTERS.length)]}</span>`;
          })
          .join('');
        if (iteration >= 8) clearInterval(intervalRef.current);
        iteration += 0.3;
      }, 30);
    };

    el.addEventListener('mouseover', handleMouseOver);
    return () => {
      el.removeEventListener('mouseover', handleMouseOver);
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020202]">
      {/* Background Image: Church / Building (Image 2) */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-luminosity scale-105"
          style={{ backgroundImage: `url("https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699ee2f7ff8ae9f68639cff6/eade6db06_P1041693.jpg")` }}
        ></div>
        {/* Gradient overlays to darken and blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020202]/40 via-[#020202]/60 to-[#020202] z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#020202]/80 via-transparent to-[#020202]/80 z-10"></div>
      </div>

      {/* Technical HUD Elements */}
      <div className="absolute top-32 left-10 text-[10px] font-mono text-gray-500 z-20 hidden md:block opacity-60">
        <p>REC. 01</p>
        <p>ISO_800</p>
        <p>SHUTTER_1/48</p>
      </div>
      <div className="absolute bottom-10 right-10 text-[10px] font-mono text-[#4A5D66] z-20 hidden md:block opacity-60 text-right">
        <p>COORD: 48°51'24.0"N</p>
        <p>SEC: 09_A</p>
        <p className="text-[#8B0000] animate-pulse">● LIVE</p>
      </div>
      
      {/* Center Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/[0.03] rounded-full z-10 pointer-events-none hidden md:block"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/[0.05] z-10 pointer-events-none">
        <div className="absolute top-1/2 -left-4 w-3 h-[1px] bg-white/20"></div>
        <div className="absolute top-1/2 -right-4 w-3 h-[1px] bg-white/20"></div>
        <div className="absolute -top-4 left-1/2 w-[1px] h-3 bg-white/20"></div>
        <div className="absolute -bottom-4 left-1/2 w-[1px] h-3 bg-white/20"></div>
      </div>

      <div className="container mx-auto px-6 relative z-30 flex flex-col items-center text-center mt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <h1 ref={titleRef} className="text-6xl md:text-8xl lg:text-[10rem] font-space font-bold tracking-tighter uppercase leading-none mix-blend-difference">
            <span style={{color:'white'}}>SCAV</span><span style={{color:'#8B0000'}}>BACK</span>
          </h1>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="mt-8 flex flex-col items-center"
        >
          <p className="text-xs md:text-sm font-mono text-gray-400 mb-10 tracking-[0.3em] uppercase bg-black/50 px-4 py-2 border border-white/5">
            Collectif créatif — Son, Image, Vision
          </p>
          
          <a 
            href="#artists"
            className="group relative inline-flex items-center justify-center px-8 py-4 font-mono text-xs font-bold text-white transition-all duration-300 border border-white/20 hover:border-white/60 bg-black/40 backdrop-blur-sm overflow-hidden"
          >
            <span className="absolute left-0 w-[2px] h-full bg-[#8B0000] scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300"></span>
            <span className="relative flex items-center gap-3 uppercase tracking-widest">
              Découvrir le collectif
              <span className="font-sans text-lg">↓</span>
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}