import React from 'react';

// Stub : page de retour après paiement Stripe.
// Sans backend on ne peut rien valider, on affiche juste un message neutre.
export default function Validation() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 bg-[#020202] text-white">
      <div className="max-w-md text-center font-mono">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-space tracking-widest uppercase mb-4">
          Validation
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          Cette page confirmait normalement un paiement Stripe.<br />
          Le backend n'est pas branché dans ce clone visuel.
        </p>
        <a
          href="/"
          className="inline-block mt-8 border border-white/30 px-6 py-3 text-xs uppercase tracking-widest hover:bg-white/5 transition-colors"
        >
          ← Retour
        </a>
      </div>
    </section>
  );
}
