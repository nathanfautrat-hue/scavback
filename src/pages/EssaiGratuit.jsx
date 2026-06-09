import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import CguModal from '../components/CGUModal';
import { emailConfirmationEssai } from '../components/EmailTemplates';

export default function EssaiGratuit() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ project_name: '', message: '', download_link: '' });
  const [cguChecked, setCguChecked] = useState(false);
  const [cguOpen, setCguOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => base44.auth.redirectToLogin('/EssaiGratuit'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cguChecked) { setError("Veuillez accepter les CGU et CGV."); return; }
    if (!form.project_name || !form.download_link) { setError("Veuillez remplir tous les champs obligatoires."); return; }
    setError('');
    setLoading(true);

    // Toujours stocker en base de données en premier
    await base44.entities.TrialRequest.create({
      user_email: user.email,
      user_name: user.full_name || user.email,
      project_name: form.project_name,
      message: form.message,
      download_link: form.download_link,
      status: 'pending'
    });

    // Envoi emails
    try {
      await base44.integrations.Core.SendEmail({
        to: 'scavback@gmail.com',
        subject: `[ESSAI GRATUIT] Nouvelle demande — ${form.project_name}`,
        body: `Nouvelle demande d'essai gratuit !\n\nUtilisateur : ${user.full_name || user.email}\nEmail : ${user.email}\nProjet : ${form.project_name}\nMessage : ${form.message || '(aucun)'}\nLien : ${form.download_link}`
      });
      const clientEmail = emailConfirmationEssai({ userName: user.full_name || user.email, projectName: form.project_name });
      await base44.integrations.Core.SendEmail({ to: user.email, subject: clientEmail.subject, body: clientEmail.html });
    } catch (emailErr) {
      console.error('[EssaiGratuit] Erreur envoi email:', emailErr);
    }

    setLoading(false);
    setSubmitted(true);
  };

  if (!user) return null;

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg border border-white/[0.05] p-12 bg-[#040404]">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-6" />
          <p className="text-[10px] font-mono text-[#4A5D66] uppercase tracking-widest mb-3">// Demande envoyée</p>
          <h2 className="text-2xl font-space font-bold uppercase text-white mb-4">Votre demande a bien été envoyée !</h2>
          <p className="text-[12px] font-mono text-gray-500 leading-relaxed">
            Nous allons traiter votre projet et vous renverrons un extrait de 30 secondes de votre son mixé et masterisé dans les plus brefs délais.
            <br/><br/>À très bientôt — L'équipe SCAVBACK Audio Lab
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] pt-28 pb-20 px-6">
      <CguModal open={cguOpen} onClose={() => setCguOpen(false)} />
      <div className="container mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-[#8B0000] font-mono text-[10px] mb-2 tracking-widest uppercase">/ / Studio _ Free Trial</p>
          <h1 className="text-4xl md:text-5xl font-space font-bold uppercase tracking-tighter text-white mb-12">
            Essai <span className="text-gray-600">Gratuit</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/[0.05]">
            {/* Left — Info */}
            <div className="bg-[#040404] p-8 border-b md:border-b-0 md:border-r border-white/[0.05]">
              <h2 className="text-sm font-space font-bold uppercase tracking-wider text-white mb-6">Essayez nos services gratuitement</h2>
              <p className="text-[11px] font-mono text-gray-500 leading-relaxed mb-8">
                Vous pouvez dès aujourd'hui faire une demande afin d'essayer gratuitement nos services ! Pour cela, complétez le formulaire. Nous vous renverrons sous quelques jours un extrait de votre son mixé et masterisé (30 secondes).
              </p>
              <div className="border-t border-white/[0.05] pt-6 space-y-3">
                <p className="text-[10px] font-mono text-[#4A5D66] uppercase tracking-widest mb-4">// Critères du projet</p>
                {[
                  'Maximum 4 pistes (instrumentale, voix principale, backs, adlibs)',
                  'Format des pistes : WAV (24 bits / 44.1 kHz)',
                  'Les pistes de voix doivent être synchronisées avec l\'instrumentale',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-[11px] font-mono text-gray-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <div className="bg-[#040404] p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-mono text-[#4A5D66] uppercase tracking-widest mb-2">Nom du projet *</label>
                  <input
                    type="text"
                    value={form.project_name}
                    onChange={e => setForm({ ...form, project_name: e.target.value })}
                    placeholder="Entrez le nom du projet"
                    className="w-full bg-[#020202] border border-white/[0.08] text-gray-300 font-mono text-xs px-4 py-3 focus:outline-none focus:border-white/20 placeholder-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#4A5D66] uppercase tracking-widest mb-2">Message</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value.slice(0, 5000) })}
                    placeholder="Votre message..."
                    rows={4}
                    className="w-full bg-[#020202] border border-white/[0.08] text-gray-300 font-mono text-xs px-4 py-3 focus:outline-none focus:border-white/20 placeholder-gray-600 resize-none"
                  />
                  <p className="text-[10px] font-mono text-gray-600 text-right mt-1">{form.message.length}/5000</p>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#4A5D66] uppercase tracking-widest mb-2">Lien de téléchargement *</label>
                  <input
                    type="text"
                    value={form.download_link}
                    onChange={e => setForm({ ...form, download_link: e.target.value })}
                    placeholder="Entrez le lien de votre projet (WeTransfer, Google Drive, ...)"
                    className="w-full bg-[#020202] border border-white/[0.08] text-gray-300 font-mono text-xs px-4 py-3 focus:outline-none focus:border-white/20 placeholder-gray-600"
                    required
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={cguChecked} onChange={e => setCguChecked(e.target.checked)} className="mt-1 accent-white flex-shrink-0" />
                  <span className="text-[11px] font-mono text-gray-500">
                    J'accepte les{' '}
                    <button type="button" onClick={() => setCguOpen(true)} className="text-[#4A5D66] hover:text-white underline transition-colors">
                      Conditions Générales de Vente et d'Utilisation
                    </button>
                  </span>
                </label>

                {error && (
                  <div className="flex items-center gap-2 text-[#8B0000]">
                    <AlertCircle size={14} />
                    <span className="text-[11px] font-mono">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black font-mono text-xs font-bold uppercase tracking-widest py-4 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer ma demande'}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}