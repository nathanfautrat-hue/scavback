import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#020202] text-[#e0e0e0] font-sans selection:bg-[#4A5D66] selection:text-white flex flex-col relative">
      {/* Overlay global de bruit photographique */}
      <div className="fixed inset-0 bg-noise z-50 pointer-events-none"></div>
      
      {/* Lignes de repère techniques (HUD) */}
      <div className="fixed left-6 top-0 bottom-0 w-[1px] bg-white/[0.03] z-40 pointer-events-none hidden md:block"></div>
      <div className="fixed right-6 top-0 bottom-0 w-[1px] bg-white/[0.03] z-40 pointer-events-none hidden md:block"></div>

      <Navbar />
      <main className="flex-grow relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}