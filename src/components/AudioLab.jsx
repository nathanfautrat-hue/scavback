import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

// ─── REMPLIS CES LIENS DEPUIS TON DASHBOARD STRIPE ───────────────────────────
const STRIPE_LINKS = {
  mix_instru:       'https://buy.stripe.com/REMPLACE_ICI',
  mix_voix:         'https://buy.stripe.com/REMPLACE_ICI',
  mix_voix_master:  'https://buy.stripe.com/REMPLACE_ICI',
  mix_full:         'https://buy.stripe.com/REMPLACE_ICI',
  option_edition:   'https://buy.stripe.com/REMPLACE_ICI',
  option_sfx:       'https://buy.stripe.com/REMPLACE_ICI',
};
// ─────────────────────────────────────────────────────────────────────────────

const services = [
  {
    id: 'mix_instru',
    name: 'Mix Instrumental',
    price: 10,
    description: 'Mixage complet de votre instrumental : balance, EQ, compression et spatialisation pour un rendu professionnel.',
    tags: ['MIX', 'INSTRU'],
  },
  {
    id: 'mix_voix',
    name: 'Mix Voix',
    price: 10,
    description: 'Traitement complet de vos pistes vocales : EQ, compression, réverbération, delay et effets créatifs.',
    tags: ['MIX', 'VOIX'],
  },
  {
    id: 'mix_voix_master',
    name: 'Mix Voix + Master',
    price: 20,
    description: "Mix vocal complet suivi d'un mastering professionnel pour un morceau prêt à être distribué sur les plateformes.",
    tags: ['MIX', 'VOIX', 'MASTER'],
    highlight: true,
  },
  {
    id: 'mix_full',
    name: 'Mix Voix + Master + Instru',
    price: 25,
    description: 'Forfait complet : mix voix, mix instrumental et mastering. La solution tout-en-un pour un rendu optimal.',
    tags: ['MIX', 'VOIX', 'INSTRU', 'MASTER'],
    highlight: true,
  },
];

const options = [
  {
    id: 'option_edition',
    name: 'Édition & Nettoyage des pistes',
    price: 5,
    description:
      "Nettoyage complet et édition des pistes : suppression des bruits parasites, respirations, coupures propres et transitions. Comprend aussi la modification ou l'ajout de pistes après le début de la commande (dans la limite de 2 lots).",
  },
  {
    id: 'option_sfx',
    name: 'SFX',
    price: 5,
    description:
      "Ajout d'effets pour dynamiser la musique : bruitages, coupures dans l'instrumentale, drops, risers, etc.",
  },
];

function ServiceCard({ service, index }) {
  const link = STRIPE_LINKS[service.id];
  const isReady = link && !link.includes('REMPLACE_ICI');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative bg-[#040404] border border-white/[0.05] flex flex-col overflow-hidden group hover:border-white/10 transition-colors duration-300"
    >
      {service.highlight && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#8B0000]"></div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {service.highlight && (
          <span className="self-start text-[8px] font-mono text-[#8B0000] border border-[#8B0000]/40 px-2 py-0.5 uppercase tracking-widest mb-4">
            Populaire
          </span>
        )}

        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-space font-bold uppercase tracking-wider text-gray-300 group-hover:text-white transition-colors pr-4">
            {service.name}
          </h3>
          <span className="text-2xl font-space font-bold text-white flex-shrink-0">{service.price}€</span>
        </div>

        <p className="text-[11px] font-mono text-gray-500 leading-relaxed mb-5 flex-1">
          {service.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-6">
          {service.tags.map((tag) => (
            <span key={tag} className="text-[8px] font-mono text-gray-600 border border-white/[0.05] px-2 py-0.5 uppercase tracking-widest">
              {tag}
            </span>
          ))}
        </div>

        <a
          href={isReady ? link : '#'}
          target={isReady ? '_blank' : undefined}
          rel="noopener noreferrer"
          onClick={!isReady ? (e) => e.preventDefault() : undefined}
          className={`flex items-center justify-center gap-2 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
            isReady
              ? 'bg-white text-black hover:bg-gray-200 cursor-pointer'
              : 'bg-white/5 text-gray-600 border border-white/[0.05] cursor-not-allowed'
          }`}
        >
          <span>Commander</span>
          {isReady && <ExternalLink size={12} />}
          {!isReady && <span className="text-[9px] normal-case opacity-60">(lien à configurer)</span>}
        </a>
      </div>
    </motion.div>
  );
}

export default function AudioLab() {
  const [expandedOption, setExpandedOption] = useState(null);

  return (
    <section id="audiolab" className="py-32 bg-[#020202] relative border-t border-white/[0.05]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_10%,transparent_100%)]"></div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="mb-20 border-b border-white/[0.05] pb-6">
          <p className="text-[#8B0000] font-mono text-[10px] mb-2 tracking-widest uppercase">/ / Studio _ Services</p>
          <h2 className="text-4xl md:text-5xl font-space font-bold uppercase tracking-tighter text-white">
            Audio <span className="text-gray-600">Lab</span>
          </h2>
          <p className="text-gray-500 font-mono text-[11px] mt-4 max-w-lg leading-relaxed tracking-wide">
            Services de mixage et mastering professionnels. Sélectionnez votre forfait et payez directement en ligne via Stripe.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <p className="text-[10px] font-mono text-[#4A5D66] tracking-widest uppercase">// CAT_01 — Forfaits</p>
            <div className="flex-1 h-[1px] bg-white/[0.05]"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-0 border border-white/[0.05]">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>

        {/* Options */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <p className="text-[10px] font-mono text-[#4A5D66] tracking-widest uppercase">// CAT_02 — Options supplémentaires</p>
            <div className="flex-1 h-[1px] bg-white/[0.05]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/[0.05]">
            {options.map((option, index) => {
              const link = STRIPE_LINKS[option.id];
              const isReady = link && !link.includes('REMPLACE_ICI');
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-[#040404] border-r border-white/[0.05] last:border-r-0 p-6 flex flex-col gap-4 group hover:border-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-space font-bold uppercase tracking-wider text-gray-300 group-hover:text-white transition-colors pr-4">
                      {option.name}
                    </h3>
                    <span className="text-xl font-space font-bold text-white flex-shrink-0">+{option.price}€</span>
                  </div>

                  <button
                    onClick={() => setExpandedOption(expandedOption === option.id ? null : option.id)}
                    className="text-[10px] font-mono text-[#4A5D66] hover:text-white transition-colors uppercase tracking-widest text-left"
                  >
                    {expandedOption === option.id ? '[ Masquer ]' : '[ Voir description ]'}
                  </button>
                  {expandedOption === option.id && (
                    <p className="text-[11px] font-mono text-gray-500 leading-relaxed">{option.description}</p>
                  )}

                  <a
                    href={isReady ? link : '#'}
                    target={isReady ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    onClick={!isReady ? (e) => e.preventDefault() : undefined}
                    className={`mt-auto flex items-center justify-center gap-2 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                      isReady
                        ? 'bg-white text-black hover:bg-gray-200 cursor-pointer'
                        : 'bg-white/5 text-gray-600 border border-white/[0.05] cursor-not-allowed'
                    }`}
                  >
                    <span>Ajouter cette option</span>
                    {isReady && <ExternalLink size={12} />}
                    {!isReady && <span className="text-[9px] normal-case opacity-60">(lien à configurer)</span>}
                  </a>
                </motion.div>
              );
            })}
          </div>

          {/* Info Box */}
          <div className="mt-8 border border-[#4A5D66]/20 bg-[#4A5D66]/5 p-6">
            <p className="text-[11px] font-mono text-[#4A5D66] leading-relaxed tracking-wide">
              <span className="text-white font-bold">Comment ça marche ?</span><br/>
              1. Commandez votre forfait ci-dessus via Stripe. &nbsp;
              2. Après paiement, envoyez vos pistes audio à <a href="mailto:scavback@gmail.com" className="text-white hover:text-[#8B0000] transition-colors">scavback@gmail.com</a>. &nbsp;
              3. Si vous souhaitez ajouter une option, commandez-la séparément. Mentionnez votre commande dans l'email.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}