import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ChevronRight, CheckCircle, Music, Palette, Film } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import CguModal from '../components/CguModal';
import { useNavigate } from 'react-router-dom';
import { emailConfirmationCommande } from '../components/emailTemplates';

// Grille tarifaire (cahier des charges #01) — 3 offres exclusives + essai gratuit (onglet séparé)
const OFFERS = [
  { id: 'mix_master', label: 'Mix + Master', price: 20, desc: 'Mixage complet de votre morceau + mastering prêt pour les plateformes de streaming.' },
  { id: 'mix', label: 'Mix seul', price: 10, desc: 'Mixage complet : balance, EQ, compression et spatialisation pour un rendu professionnel.' },
  { id: 'master', label: 'Master seul', price: 10, desc: 'Masterisation pour répondre aux standards des plateformes de streaming.' },
];

const PAYS = ['France', 'Belgique', 'Suisse', 'Canada', 'Luxembourg', 'Autre'];

function generateOrderNumber() {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SCB-${year}-${rand}`;
}

// ─── ONGLET ESSAI GRATUIT ────────────────────────────────────────────────────
function EssaiGratuitTab({ user }) {
  const [form, setForm] = useState({ project_name: '', message: '', download_link: '' });
  const [cguChecked, setCguChecked] = useState(false);
  const [cguOpen, setCguOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cguChecked) { setError("Veuillez accepter les CGU et CGV."); return; }
    if (!form.project_name || !form.download_link) { setError("Veuillez remplir tous les champs obligatoires."); return; }
    setError('');
    setLoading(true);

    await base44.entities.TrialRequest.create({
      user_email: user.email,
      user_name: user.full_name || user.email,
      project_name: form.project_name,
      message: form.message,
      download_link: form.download_link,
      status: 'pending'
    });

    try {
      await base44.integrations.Core.SendEmail({
        to: 'scavback@gmail.com',
        subject: `[ESSAI GRATUIT] Nouvelle demande — ${form.project_name}`,
        body: `Nouvelle demande d'essai gratuit reçue !\n\nUtilisateur : ${user.full_name || user.email}\nEmail : ${user.email}\nNom du projet : ${form.project_name}\n\nMessage :\n${form.message || '(aucun message)'}\n\nLien de téléchargement :\n${form.download_link}`
      });
    } catch (err) {
      console.error('[EssaiGratuit] Erreur envoi email:', err);
    }

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-lg border border-white/[0.05] p-12 bg-[#040404]">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-6" />
          <p className="text-[10px] font-mono text-[#4A5D66] uppercase tracking-widest mb-3">// Demande envoyée</p>
          <h2 className="text-2xl font-space font-bold uppercase text-white mb-4">Demande bien reçue !</h2>
          <p className="text-[12px] font-mono text-gray-500 leading-relaxed">
            Nous allons traiter votre projet et vous renverrons un extrait de 30 secondes de votre son mixé et masterisé dans les plus brefs délais.
            <br /><br />À très bientôt — L'équipe SCAVBACK Audio Lab
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <CguModal open={cguOpen} onClose={() => setCguOpen(false)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/[0.05]">
        {/* Left — Info */}
        <div className="bg-[#040404] p-8 border-b md:border-b-0 md:border-r border-white/[0.05]">
          <h2 className="text-sm font-space font-bold uppercase tracking-wider text-white mb-6">Essayez nos services gratuitement</h2>
          <p className="text-[11px] font-mono text-gray-500 leading-relaxed mb-8">
            Faites une demande pour essayer gratuitement nos services. Nous vous renverrons sous quelques jours un extrait de 30 secondes de votre son mixé et masterisé.
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
                placeholder="WeTransfer, Google Drive, ..."
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
    </>
  );
}

// ─── ONGLET PASSER COMMANDE ───────────────────────────────────────────────────
function PasserCommandeTab({ user }) {
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [info, setInfo] = useState({ prenom: '', nom: '', adresse: '', complement: '', pays: 'France', ville: '', code_postal: '' });
  const [cguChecked, setCguChecked] = useState(false);
  const [cguOpen, setCguOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const offer = OFFERS.find(o => o.id === selectedOffer) || null;
  const total = (offer ? offer.price : 0) * quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offer) { setError("Veuillez sélectionner une offre."); return; }
    if (!info.prenom || !info.nom || !info.ville || !info.code_postal) { setError("Veuillez remplir toutes les informations personnelles."); return; }
    if (!cguChecked) { setError("Veuillez accepter les CGV et CGU."); return; }

    setError('');
    setLoading(true);

    const orderNumber = generateOrderNumber();

    const order = await base44.entities.Order.create({
      order_number: orderNumber,
      user_email: user.email,
      user_name: user.full_name || user.email,
      ...info,
      services: [offer.label],
      quantity,
      total,
      status: 'pending'
    });

    // Envoi immédiat de l'email de confirmation au client (fire-and-forget)
    const confirmEmail = emailConfirmationCommande(order);
    base44.integrations.Core.SendEmail({
      to: user.email,
      subject: confirmEmail.subject,
      body: confirmEmail.html
    }).catch(err => console.error('[Commander] Erreur email confirmation:', err));

    setLoading(false);
    navigate(`/Validation?orderId=${order.id}`);
  };

  return (
    <>
      <CguModal open={cguOpen} onClose={() => setCguOpen(false)} />
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* FORFAITS */}
        <div className="border border-white/[0.05] bg-[#040404]">
          <div className="px-6 py-4 border-b border-white/[0.05]">
            <p className="text-[10px] font-mono text-[#4A5D66] uppercase tracking-widest">// CAT_01 — Choisissez votre offre</p>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {OFFERS.map(o => {
              const active = selectedOffer === o.id;
              return (
                <label
                  key={o.id}
                  className={`flex items-start gap-4 px-6 py-5 cursor-pointer group transition-colors ${active ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'}`}
                >
                  <input
                    type="radio"
                    name="offer"
                    checked={active}
                    onChange={() => setSelectedOffer(o.id)}
                    className="mt-1 accent-white flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-space font-bold uppercase tracking-wider text-gray-300 group-hover:text-white transition-colors">{o.label}</span>
                      <span className="text-base font-space font-bold text-white ml-4 flex-shrink-0">{o.price}€</span>
                    </div>
                    <p className="text-[11px] font-mono text-gray-600 mt-1 leading-relaxed">{o.desc}</p>
                  </div>
                </label>
              );
            })}
          </div>
          <div className="px-6 py-4 border-t border-white/[0.05]">
            <label className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-[#4A5D66] uppercase tracking-widest">Quantité</span>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 bg-[#020202] border border-white/[0.08] text-white font-mono text-xs text-center px-3 py-2 focus:outline-none focus:border-white/20"
              />
              <span className="text-[10px] font-mono text-gray-600">Nombre de sons à traiter</span>
            </label>
          </div>
        </div>

        {/* INFOS PERSONNELLES */}
        <div className="border border-white/[0.05] bg-[#040404]">
          <div className="px-6 py-4 border-b border-white/[0.05]">
            <p className="text-[10px] font-mono text-[#4A5D66] uppercase tracking-widest">// CAT_02 — Informations personnelles</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5">E-mail</label>
              <input value={user.email} disabled className="w-full bg-[#020202] border border-white/[0.05] text-gray-600 font-mono text-xs px-4 py-3 cursor-not-allowed opacity-50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5">Prénom *</label>
                <input value={info.prenom} onChange={e => setInfo({...info, prenom: e.target.value})} className="w-full bg-[#020202] border border-white/[0.08] text-gray-300 font-mono text-xs px-4 py-3 focus:outline-none focus:border-white/20" required />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5">Nom *</label>
                <input value={info.nom} onChange={e => setInfo({...info, nom: e.target.value})} className="w-full bg-[#020202] border border-white/[0.08] text-gray-300 font-mono text-xs px-4 py-3 focus:outline-none focus:border-white/20" required />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5">Adresse</label>
              <input value={info.adresse} onChange={e => setInfo({...info, adresse: e.target.value})} className="w-full bg-[#020202] border border-white/[0.08] text-gray-300 font-mono text-xs px-4 py-3 focus:outline-none focus:border-white/20" />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5">Complément d'adresse</label>
              <input value={info.complement} onChange={e => setInfo({...info, complement: e.target.value})} placeholder="Appartement, étage..." className="w-full bg-[#020202] border border-white/[0.08] text-gray-300 font-mono text-xs px-4 py-3 focus:outline-none focus:border-white/20 placeholder-gray-700" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5">Pays</label>
                <select value={info.pays} onChange={e => setInfo({...info, pays: e.target.value})} className="w-full bg-[#020202] border border-white/[0.08] text-gray-300 font-mono text-xs px-4 py-3 focus:outline-none focus:border-white/20">
                  {PAYS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5">Ville *</label>
                <input value={info.ville} onChange={e => setInfo({...info, ville: e.target.value})} className="w-full bg-[#020202] border border-white/[0.08] text-gray-300 font-mono text-xs px-4 py-3 focus:outline-none focus:border-white/20" required />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5">Code postal *</label>
                <input value={info.code_postal} onChange={e => setInfo({...info, code_postal: e.target.value})} className="w-full bg-[#020202] border border-white/[0.08] text-gray-300 font-mono text-xs px-4 py-3 focus:outline-none focus:border-white/20" required />
              </div>
            </div>
          </div>
        </div>

        {/* TOTAL + CGU + SUBMIT */}
        <div className="border border-white/[0.05] bg-[#040404] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-5">
            <div>
              <p className="text-[10px] font-mono text-[#4A5D66] uppercase tracking-widest mb-1">Total calculé</p>
              <p className="text-[11px] font-mono text-gray-500">
                {offer ? offer.label : '—'}
                {offer && quantity > 1 ? ` × ${quantity}` : ''}
              </p>
            </div>
            <span className="text-3xl font-space font-bold text-white">{total.toFixed(2).replace('.', ',')}€</span>
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
            disabled={loading || !offer}
            className="w-full bg-white text-black font-mono text-xs font-bold uppercase tracking-widest py-4 hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Traitement...' : <>Passer commande <ChevronRight size={14} /></>}
          </button>
        </div>
      </form>
    </>
  );
}

// ─── ONGLET VOS COMMANDES ─────────────────────────────────────────────────────
function SuivreCommandeTab() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null); // null | false | order
  const [loading, setLoading] = useState(false);
  const [paypalState, setPaypalState] = useState('idle'); // idle | waiting | confirm | sent
  const [sendingRepay, setSendingRepay] = useState(false);

  const handleRepayClick = () => {
    if (!result || paypalState !== 'idle') return;
    const popup = window.open(`https://www.paypal.com/paypalme/SCAVBACKK/${result.total?.toFixed(2)}`, 'paypal_popup', 'width=600,height=500,scrollbars=yes');
    setPaypalState('waiting');
    const interval = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(interval);
        setPaypalState('confirm');
      }
    }, 500);
  };

  const handleConfirmRepay = async () => {
    if (!result) return;
    setSendingRepay(true);
    await base44.entities.Order.update(result.id, { status: 'paid' });
    setSendingRepay(false);
    setPaypalState('sent');
  };

  const statusMap = {
    pending:     { label: 'En attente',  cls: 'text-yellow-500' },
    paid:        { label: 'En attente',  cls: 'text-yellow-500' },
    accepted:    { label: 'Acceptée',    cls: 'text-green-500' },
    refused:     { label: 'Refusée',     cls: 'text-red-500' },
    in_progress: { label: 'En cours',    cls: 'text-blue-400' },
    delivered:   { label: 'Livrée',      cls: 'text-green-400' },
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    const orders = await base44.entities.Order.filter({ order_number: input.trim().replace(/^#/, '').toUpperCase() });
    setResult(orders.length > 0 ? orders[0] : false);
    setLoading(false);
  };

  return (
    <div className="border border-white/[0.05] bg-[#040404]">
      <div className="p-8">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Entrez votre numéro de commande (ex: SCB-2026-XXXX)"
            className="flex-1 bg-[#020202] border border-white/[0.08] text-gray-300 font-mono text-xs px-4 py-3 focus:outline-none focus:border-white/20 placeholder-gray-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black font-mono text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-gray-200 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? '...' : 'Rechercher'}
          </button>
        </form>

        {result === false && (
          <p className="mt-8 text-center font-mono text-xs text-gray-600">Aucune commande trouvée avec ce numéro.</p>
        )}

        {result && (() => {
          const s = statusMap[result.status] || { label: result.status, cls: 'text-gray-400' };
          return (
            <div className="mt-8 border border-white/[0.07] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
                <div>
                  <p className="text-[10px] font-mono text-[#4A5D66] uppercase tracking-widest mb-1">Numéro de commande</p>
                  <p className="text-base font-space font-bold text-white">#{result.order_number}</p>
                </div>
                <span className={`text-xs font-mono font-bold ${s.cls}`}>● {s.label}</span>
              </div>
              <div>
                <p className="text-[10px] font-mono text-[#4A5D66] uppercase tracking-widest mb-2">Forfaits commandés</p>
                <div className="flex flex-wrap gap-2">
                  {(result.services || []).map(sv => (
                    <span key={sv} className="text-[10px] font-mono text-[#4A5D66] border border-[#4A5D66]/30 px-2 py-0.5">{sv} ×{result.quantity}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-[#4A5D66] uppercase tracking-widest mb-1">Date de commande</p>
                  <p className="text-xs font-mono text-gray-400">
                    {new Date(result.created_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-[#4A5D66] uppercase tracking-widest mb-1">Montant total</p>
                  <p className="text-2xl font-space font-bold text-white">{result.total?.toFixed(2).replace('.', ',')}€</p>
                </div>
              </div>
              {result.status === 'refused' && (
                <div className="space-y-3">
                  <p className="text-[11px] font-mono text-red-400 border border-red-900/30 bg-red-950/20 px-4 py-3">
                    Votre commande a été refusée. Vous pouvez tenter un nouveau paiement ci-dessous.
                  </p>
                  {paypalState === 'idle' && (
                    <button onClick={handleRepayClick} className="w-full flex items-center justify-center gap-3 bg-[#0070BA] hover:bg-[#005EA6] text-white font-mono text-xs font-bold uppercase tracking-widest py-4 transition-colors">
                      <span className="text-base font-bold font-sans">Pay</span>
                      <span className="text-base font-bold font-sans text-[#1ECAF7]">Pal</span>
                      <span>— Repayer {result.total?.toFixed(2).replace('.', ',')}€</span>
                    </button>
                  )}
                  {paypalState === 'waiting' && (
                    <div className="w-full flex items-center justify-center gap-3 bg-gray-700 text-gray-300 font-mono text-xs font-bold uppercase tracking-widest py-4 cursor-not-allowed">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                      <span>En attente du paiement...</span>
                    </div>
                  )}
                  {paypalState === 'confirm' && (
                    <button onClick={handleConfirmRepay} disabled={sendingRepay} className="w-full flex items-center justify-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-black font-mono text-xs font-bold uppercase tracking-widest py-4 transition-colors disabled:opacity-50">
                      {sendingRepay ? 'Envoi...' : '✓ Valider le paiement →'}
                    </button>
                  )}
                  {paypalState === 'sent' && (
                    <div className="w-full flex items-center justify-center gap-3 bg-green-800 text-green-200 font-mono text-xs font-bold uppercase tracking-widest py-4">
                      ✓ Demande envoyée — en attente de validation
                    </div>
                  )}
                </div>
              )}
              {(result.status === 'paid' || result.status === 'accepted' || result.status === 'in_progress') && (
                <div className="space-y-3">
                  <p className="text-[11px] font-mono text-green-400 border border-green-900/30 bg-green-950/20 px-4 py-3">
                    Votre commande est en cours de traitement !
                  </p>
                  <a
                    href={`/ClientDiscussion?orderId=${result.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-[#8B0000] hover:bg-red-800 text-white font-mono text-xs font-bold uppercase tracking-widest py-4 transition-colors"
                  >
                    💬 Accéder à mon espace de collaboration →
                  </a>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ─── CARTES DE SÉLECTION ──────────────────────────────────────────────────────
function ServiceCard({ title, description, icon: IconComponent, badge, isActive, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border p-8 transition-all duration-300 group ${
        isActive
          ? 'border-white/[0.1] bg-[#111111] hover:border-[#cc0000] hover:shadow-lg hover:shadow-[#cc0000]/20 cursor-pointer'
          : 'border-white/[0.06] bg-[#111111] opacity-50 cursor-not-allowed'
      }`}
      onClick={isActive ? onClick : undefined}
    >
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <IconComponent size={32} className="text-[#4A5D66] group-hover:text-white transition-colors" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-space font-bold uppercase tracking-wider text-white mb-3">{title}</h3>
        <p className="text-[11px] font-mono text-gray-500 mb-6 leading-relaxed">{description}</p>
        
        {badge && (
          <div className="mb-6 inline-block px-3 py-1 border border-white/[0.1] bg-white/[0.03] rounded">
            <span className="text-[10px] font-mono text-gray-500">{badge}</span>
          </div>
        )}

        {isActive ? (
          <button className="w-full bg-white text-black font-mono text-xs font-bold uppercase tracking-widest py-3 hover:bg-gray-200 transition-colors">
            Accéder
          </button>
        ) : (
          <button disabled className="w-full bg-white/[0.05] text-gray-600 font-mono text-xs font-bold uppercase tracking-widest py-3 cursor-not-allowed">
            Non disponible
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────
export default function Commander() {
  const [user, setUser] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const urlParams = new URLSearchParams(window.location.search);
  const defaultTab = urlParams.get('tab') === 'commande' ? 'commande' : urlParams.get('tab') === 'suivi' ? 'suivi' : 'essai';
  const [tab, setTab] = useState(defaultTab);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  // Affiche les cartes de sélection si aucun service n'est sélectionné
  if (!selectedService) {
    return (
      <div className="min-h-screen bg-[#020202] pt-28 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-[#8B0000] font-mono text-[10px] mb-2 tracking-widest uppercase">/ / Services Studio</p>
            <h1 className="text-4xl md:text-5xl font-space font-bold uppercase tracking-tighter text-white mb-4">
              Services <span className="text-gray-600">Studio</span>
            </h1>
            <p className="text-[11px] font-mono text-gray-500 mb-16">Sélectionnez un service pour commencer</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ServiceCard
                icon={Music}
                title="Audio Lab"
                description="Mixage, mastering, édition... Confiez-nous votre musique."
                isActive={true}
                onClick={() => setSelectedService('audiolab')}
              />
              <ServiceCard
                icon={Palette}
                title="Cover"
                description="Création de covers pour vos singles et albums."
                isActive={false}
              />
              <ServiceCard
                icon={Film}
                title="Montage Vidéo"
                description="Clips musicaux et montages professionnels."
                isActive={false}
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Affiche la page Audio Lab avec les onglets
  return (
    <div className="min-h-screen bg-[#020202] pt-28 pb-20 px-6">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button
            onClick={() => setSelectedService(null)}
            className="text-[11px] font-mono text-[#4A5D66] hover:text-white transition-colors mb-6 flex items-center gap-2"
          >
            ← Retour aux services
          </button>
          <p className="text-[#8B0000] font-mono text-[10px] mb-2 tracking-widest uppercase">/ / Services Studio</p>
          <h1 className="text-4xl md:text-5xl font-space font-bold uppercase tracking-tighter text-white mb-8">
            Audio <span className="text-gray-600">Lab</span>
          </h1>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06] mb-8">
            {[
              { key: 'essai', label: 'Essai Gratuit' },
              { key: 'commande', label: 'Passer commande' },
              { key: 'suivi', label: 'Vos commandes' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-6 py-3 text-[11px] font-mono uppercase tracking-widest transition-colors border-b-2 -mb-px ${tab === t.key ? 'border-white text-white' : 'border-transparent text-gray-600 hover:text-gray-400'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'suivi' ? (
            <SuivreCommandeTab />
          ) : tab === 'essai' ? (
            user ? <EssaiGratuitTab user={user} /> : (
              <div className="text-center py-16">
                <p className="text-[11px] font-mono text-gray-500 mb-4">Vous devez être connecté pour accéder à cet onglet.</p>
                <button onClick={() => base44.auth.redirectToLogin('/Commander')} className="bg-white text-black font-mono text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-gray-200 transition-colors">Se connecter</button>
              </div>
            )
          ) : (
            user ? <PasserCommandeTab user={user} /> : (
              <div className="text-center py-16">
                <p className="text-[11px] font-mono text-gray-500 mb-4">Vous devez être connecté pour accéder à cet onglet.</p>
                <button onClick={() => base44.auth.redirectToLogin('/Commander')} className="bg-white text-black font-mono text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-gray-200 transition-colors">Se connecter</button>
              </div>
            )
          )}
        </motion.div>
      </div>
    </div>
  );
}