import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('SECURE_COMM: MSG_SENT');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-32 bg-[#020202] relative border-t border-white/[0.05] overflow-hidden">
      {/* Background Image: Branches (Image 1) */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity scale-105"
          style={{ backgroundImage: `url("https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699ee2f7ff8ae9f68639cff6/e8ab135fe_P1041691.jpg")` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/80 to-[#020202]/90 z-10"></div>
      </div>

      <div className="container mx-auto px-6 max-w-3xl relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-12">
            <p className="text-[#4A5D66] font-mono text-[10px] mb-2 tracking-widest uppercase">/ / Secure _ Comm</p>
            <h2 className="text-3xl md:text-5xl font-space font-bold uppercase tracking-tighter text-white">
              Transmission
            </h2>
            <p className="text-gray-500 font-mono text-xs mt-4 uppercase tracking-widest">Booking, Presse & Informations.</p>
          </div>

          <div className="bg-[#020202]/80 backdrop-blur-md border border-white/[0.05] p-8 md:p-12 relative">
            {/* Terminal decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4A5D66]/20 to-transparent"></div>
            <div className="absolute top-4 right-4 flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-900/50"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-900/50"></div>
              <div className="w-2 h-2 rounded-full bg-[#4A5D66]/50"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group">
                  <label className="block text-[10px] font-mono text-gray-500 mb-2 uppercase tracking-widest group-focus-within:text-white transition-colors">Nom_ID</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/50 border border-white/[0.05] px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-[#4A5D66] transition-colors"
                    placeholder="[ SAISIR_NOM ]"
                  />
                </div>
                <div className="relative group">
                  <label className="block text-[10px] font-mono text-gray-500 mb-2 uppercase tracking-widest group-focus-within:text-white transition-colors">Contact_Mail</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/50 border border-white/[0.05] px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-[#4A5D66] transition-colors"
                    placeholder="[ SAISIR_EMAIL ]"
                  />
                </div>
              </div>
              
              <div className="relative group">
                <label className="block text-[10px] font-mono text-gray-500 mb-2 uppercase tracking-widest group-focus-within:text-white transition-colors">Data_Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-black/50 border border-white/[0.05] px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-[#4A5D66] transition-colors resize-none"
                  placeholder="[ SAISIR_MESSAGE ]"
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-gray-300 transition-colors flex items-center gap-3"
                >
                  <span>Init_Transfert</span>
                  <span className="text-[10px]">{'>>'}</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}