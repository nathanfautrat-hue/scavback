import React, { useState } from 'react';
import {
  emailConfirmationCommande,
  emailLivraison,
  emailBienvenue,
  emailPanierAbandonne,
  emailCommandeAcceptee,
  emailCommandeRefusee,
  emailConfirmationEssai,
} from '../components/EmailTemplates';

// Page d'aperçu des templates d'emails (clone front — les emails ne sont pas
// envoyés, cette page sert à VOIR le design demandé au cahier des charges #04).

const MOCK_ORDER = {
  order_number: 'SCB-2026-4821',
  prenom: 'Jordan',
  user_name: 'Jordan',
  services: ['Mix + Master'],
  quantity: 1,
  total: 20,
  created_date: '2026-06-09',
};

const EMAILS = [
  { key: 'confirmation', label: 'Confirmation de commande', build: () => emailConfirmationCommande(MOCK_ORDER) },
  { key: 'livraison', label: 'Livraison / Rendu prêt', build: () => emailLivraison(MOCK_ORDER, 'https://wetransfer.com/exemple') },
  { key: 'bienvenue', label: 'Bienvenue', build: () => emailBienvenue('Jordan') },
  { key: 'panier', label: 'Panier abandonné', build: () => emailPanierAbandonne('Jordan', 'Mix + Master') },
  { key: 'acceptee', label: 'Commande acceptée', build: () => emailCommandeAcceptee(MOCK_ORDER) },
  { key: 'refusee', label: 'Commande refusée', build: () => emailCommandeRefusee(MOCK_ORDER) },
  { key: 'essai', label: "Confirmation d'essai", build: () => emailConfirmationEssai({ userName: 'Jordan', projectName: 'NOCTURNE' }) },
];

export default function ApercuEmails() {
  const [active, setActive] = useState(EMAILS[0].key);
  const current = EMAILS.find(e => e.key === active);
  const { subject, html } = current.build();

  return (
    <div className="min-h-screen bg-[#020202] pt-28 pb-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <p className="text-[#8B0000] font-mono text-[10px] mb-2 tracking-widest uppercase">/ / Studio _ Emails</p>
        <h1 className="text-3xl md:text-4xl font-space font-bold uppercase tracking-tighter text-white mb-2">
          Aperçu <span className="text-gray-600">Emails</span>
        </h1>
        <p className="text-[11px] font-mono text-gray-500 mb-8 leading-relaxed">
          Design des emails automatiques (cahier des charges #04). Note : dans ce clone, les emails ne sont pas envoyés — cette page sert uniquement à valider le rendu visuel.
        </p>

        {/* Sélecteur */}
        <div className="flex flex-wrap gap-2 mb-6">
          {EMAILS.map(e => (
            <button
              key={e.key}
              onClick={() => setActive(e.key)}
              className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest border transition-colors ${
                active === e.key
                  ? 'border-white text-white bg-white/5'
                  : 'border-white/10 text-gray-500 hover:text-white hover:border-white/30'
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>

        {/* Objet */}
        <div className="border border-white/[0.08] bg-[#040404] px-4 py-3 mb-3">
          <span className="text-[10px] font-mono text-[#4A5D66] uppercase tracking-widest mr-2">Objet :</span>
          <span className="text-[12px] font-mono text-gray-300">{subject}</span>
        </div>

        {/* Rendu de l'email dans une iframe isolée */}
        <div className="border border-white/[0.08] overflow-hidden bg-[#0a0a0a]">
          <iframe
            title="Aperçu email"
            srcDoc={html}
            className="w-full"
            style={{ height: '760px', border: 'none', background: '#0a0a0a' }}
          />
        </div>
      </div>
    </div>
  );
}
