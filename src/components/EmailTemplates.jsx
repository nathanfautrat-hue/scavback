/**
 * Templates d'emails SCAVBACK — design premium, fond sombre, charte du site.
 * Structure en <table> pour compatibilité Gmail / Outlook / Apple Mail / mobile.
 *
 * ⚠️ Clone front : ces templates ne sont PAS envoyés (pas de backend mail).
 * Ils sont visualisables via la page /ApercuEmails.
 *
 * Palette (cohérente avec le site) :
 *   fond externe #0a0a0a · carte #111111 · accent rouge #cc0000 · texte #cccccc · titres #ffffff
 */

const BRAND = '#cc0000';

const header = `
  <div style="text-align:center;padding:44px 0 20px;">
    <div style="font-size:36px;font-weight:900;letter-spacing:4px;font-family:Arial,sans-serif;">
      <span style="color:#ffffff;">SCAVB</span><span style="color:${BRAND};">ACK</span>
    </div>
    <div style="font-size:10px;color:#999999;letter-spacing:4px;margin-top:8px;font-family:Arial,sans-serif;">COLLECTIF CRÉATIF — SON, IMAGE, VISION</div>
    <div style="height:2px;background:${BRAND};margin:22px auto 0;width:60px;"></div>
  </div>
`;

const footer = `
  <div style="margin-top:44px;">
    <div style="height:1px;background:#262626;margin-bottom:24px;"></div>
    <p style="text-align:center;color:#888888;font-size:12px;font-family:Arial,sans-serif;margin:0 0 8px;">
      Des questions ? <a href="mailto:SCAVBACK@gmail.com" style="color:${BRAND};text-decoration:none;">SCAVBACK@gmail.com</a>
    </p>
    <p style="text-align:center;color:#555555;font-size:10px;font-family:Arial,sans-serif;margin:0 0 6px;">
      © 2026 SCAVBACK Audio Lab — Tous droits réservés
    </p>
    <p style="text-align:center;color:#444444;font-size:10px;font-family:Arial,sans-serif;margin:0;">
      <a href="{{unsubscribe}}" style="color:#666666;text-decoration:underline;">Se désabonner</a>
    </p>
  </div>
`;

// Bouton d'action (CTA) — couleur contrastante, texte court
function ctaButton(href, label) {
  return `
    <div style="text-align:center;margin:32px 0;">
      <a href="${href}" style="display:inline-block;background:${BRAND};color:#ffffff;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:15px 36px;border-radius:3px;font-family:Arial,sans-serif;">
        ${label}
      </a>
    </div>
  `;
}

function wrapTemplate(content) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#0a0a0a;">
    <tr><td align="center" style="padding:24px 16px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background-color:#111111;border-radius:6px;overflow:hidden;border:1px solid #1f1f1f;">
        <tr><td style="padding:0 36px 36px;">
          ${header}
          ${content}
          ${footer}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function orderInfoBox(order) {
  const servicesList = (order.services || []).map(s =>
    `<tr><td style="padding:5px 0;color:#cccccc;font-size:13px;font-family:Arial,sans-serif;">📦 ${s} × ${order.quantity}</td></tr>`
  ).join('');
  const date = new Date(order.created_date || Date.now()).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return `
    <div style="border:1px solid ${BRAND};background:#0a0a0a;padding:20px 24px;margin:24px 0;border-radius:4px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr><td style="padding:4px 0;color:#999999;font-size:11px;letter-spacing:2px;font-family:Arial,sans-serif;">🔢 NUMÉRO DE COMMANDE</td></tr>
        <tr><td style="padding:0 0 14px;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:3px;font-family:Arial,sans-serif;">#${order.order_number}</td></tr>
        ${servicesList}
        <tr><td style="padding:5px 0;color:#cccccc;font-size:13px;font-family:Arial,sans-serif;">💰 Total : <strong style="color:#ffffff;">${order.total?.toFixed(2).replace('.', ',')}€</strong></td></tr>
        <tr><td style="padding:5px 0;color:#cccccc;font-size:13px;font-family:Arial,sans-serif;">📅 Date : ${date}</td></tr>
      </table>
    </div>
  `;
}

function statusBadge(bg, border, color, label) {
  return `
    <div style="text-align:center;margin:28px 0;">
      <div style="display:inline-block;background:${bg};border:1px solid ${border};color:${color};font-size:12px;font-weight:700;letter-spacing:3px;padding:14px 32px;border-radius:3px;font-family:Arial,sans-serif;">
        ${label}
      </div>
    </div>
  `;
}

function trackingBox(orderNumber) {
  return `
    <div style="border:1px solid #2a2a2a;background:#0d0d0d;padding:20px 24px;margin:24px 0;border-radius:4px;">
      <p style="color:#999999;font-size:11px;letter-spacing:2px;margin:0 0 12px;font-family:Arial,sans-serif;">SUIVI DE COMMANDE</p>
      <p style="color:#cccccc;font-size:13px;line-height:1.9;margin:0;font-family:Arial,sans-serif;">
        Pour suivre votre commande :<br>
        <span style="color:#ffffff;">1.</span> Rendez-vous sur <a href="https://scavback.base44.app" style="color:${BRAND};text-decoration:none;">scavback.base44.app</a><br>
        <span style="color:#ffffff;">2.</span> Allez dans <strong style="color:#ffffff;">Commander → Vos commandes</strong><br>
        <span style="color:#ffffff;">3.</span> Entrez votre numéro : <strong style="color:#ffffff;">#${orderNumber}</strong>
      </p>
    </div>
  `;
}

function h2(text) {
  return `<h2 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 16px;font-family:Arial,sans-serif;">${text}</h2>`;
}
function p(text) {
  return `<p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0 0 8px;font-family:Arial,sans-serif;">${text}</p>`;
}

// ─── EMAIL 1 — Confirmation de commande ───────────────────────────────────────
export function emailConfirmationCommande(order) {
  const prenom = order.prenom || order.user_name || 'Cher client';
  const body = `
    ${h2('Ta commande SCAVBACK est confirmée 🎚️')}
    ${p(`Bonjour <strong style="color:#ffffff;">${prenom}</strong>, merci pour ta confiance ! Ta commande a bien été enregistrée et sera traitée après vérification du paiement.`)}
    ${orderInfoBox(order)}
    ${statusBadge('#3a2600', '#cc6600', '#ffaa44', '⏳ EN ATTENTE DE VÉRIFICATION')}
    ${ctaButton('https://scavback.base44.app/Commander?tab=suivi', 'Suivre ma commande')}
    ${trackingBox(order.order_number)}
  `;
  return { subject: `Ta commande SCAVBACK est confirmée 🎚️ — #${order.order_number}`, html: wrapTemplate(body) };
}

// ─── EMAIL 2 — Livraison / Rendu prêt ─────────────────────────────────────────
export function emailLivraison(order, downloadLink = '#') {
  const prenom = order.prenom || order.user_name || 'Cher artiste';
  const body = `
    ${h2('Ton mix/master est prêt à télécharger ✅')}
    ${p(`Bonjour <strong style="color:#ffffff;">${prenom}</strong>, bonne nouvelle — ta commande est prête. Tu peux récupérer ton fichier dès maintenant.`)}
    ${orderInfoBox(order)}
    ${ctaButton(downloadLink, 'Télécharger mon fichier')}
    ${p('Le lien reste actif pendant 30 jours. Pense à sauvegarder ton fichier.')}
  `;
  return { subject: `Ton mix/master est prêt à télécharger ✅ — #${order.order_number}`, html: wrapTemplate(body) };
}

// ─── EMAIL 3 — Bienvenue (nouvel inscrit) ──────────────────────────────────────
export function emailBienvenue(userName = 'Cher artiste') {
  const body = `
    ${h2("Bienvenue dans l'univers SCAVBACK")}
    ${p(`Salut <strong style="color:#ffffff;">${userName}</strong>, content de t'avoir parmi nous.`)}
    ${p('SCAVBACK Audio Lab, c\'est du mixage et du mastering pensés pour la nouvelle scène : un son propre, puissant, prêt pour les plateformes.')}
    <div style="border:1px solid #2a2a2a;background:#0d0d0d;padding:20px 24px;margin:24px 0;border-radius:4px;">
      <p style="color:#999999;font-size:11px;letter-spacing:2px;margin:0 0 12px;font-family:Arial,sans-serif;">COMMENT ÇA MARCHE</p>
      <p style="color:#cccccc;font-size:13px;line-height:1.9;margin:0;font-family:Arial,sans-serif;">
        <span style="color:#ffffff;">1.</span> Choisis ton offre (Mix, Master, ou Mix + Master)<br>
        <span style="color:#ffffff;">2.</span> Envoie tes pistes<br>
        <span style="color:#ffffff;">3.</span> On te livre un rendu pro
      </p>
    </div>
    ${ctaButton('https://scavback.base44.app/Commander?tab=essai', 'Commencer mon essai gratuit')}
  `;
  return { subject: "Bienvenue dans l'univers SCAVBACK", html: wrapTemplate(body) };
}

// ─── EMAIL 4 — Relance / Panier abandonné ──────────────────────────────────────
export function emailPanierAbandonne(userName = 'Cher artiste', offerLabel = 'ton offre') {
  const body = `
    ${h2('Tu es à deux doigts...')}
    ${p(`Bonjour <strong style="color:#ffffff;">${userName}</strong>, tu as commencé une commande (<strong style="color:#ffffff;">${offerLabel}</strong>) mais tu ne l'as pas finalisée.`)}
    ${p('Ton son mérite un rendu pro. On garde ta sélection au chaud — il ne te reste qu\'à confirmer.')}
    ${ctaButton('https://scavback.base44.app/Commander?tab=commande', 'Reprendre ma commande')}
  `;
  return { subject: 'Tu es à deux doigts... — SCAVBACK Audio Lab', html: wrapTemplate(body) };
}

// ─── Emails internes (statuts commande) — conservés ────────────────────────────
export function emailCommandeAcceptee(order) {
  const prenom = order.prenom || order.user_name || 'Cher client';
  const body = `
    ${h2('Bonne nouvelle ! 🎉')}
    ${p(`Bonjour <strong style="color:#ffffff;">${prenom}</strong>, ton paiement a été vérifié avec succès. On traite ta musique et on te livre dans les meilleurs délais.`)}
    ${orderInfoBox(order)}
    ${statusBadge('#0f3d1f', '#2d8a42', '#4ade80', '✅ COMMANDE ACCEPTÉE')}
    ${trackingBox(order.order_number)}
  `;
  return { subject: `Ta commande #${order.order_number} a été acceptée — SCAVBACK Audio Lab`, html: wrapTemplate(body) };
}

export function emailCommandeRefusee(order) {
  const prenom = order.prenom || order.user_name || 'Cher client';
  const body = `
    ${h2('Information concernant ta commande')}
    ${p(`Bonjour <strong style="color:#ffffff;">${prenom}</strong>, ta commande n'a pas pu être validée car aucun paiement n'a été détecté. Si tu penses qu'il s'agit d'une erreur, contacte-nous.`)}
    ${orderInfoBox(order)}
    ${statusBadge('#3d0f0f', '#8a2d2d', '#f87171', '❌ COMMANDE REFUSÉE')}
    ${trackingBox(order.order_number)}
  `;
  return { subject: `Ta commande #${order.order_number} a été refusée — SCAVBACK Audio Lab`, html: wrapTemplate(body) };
}

export function emailConfirmationEssai({ userName, projectName }) {
  const body = `
    ${h2("Demande d'essai reçue ✅")}
    ${p(`Bonjour <strong style="color:#ffffff;">${userName || 'Cher artiste'}</strong>, merci pour ta confiance ! Ta demande d'essai gratuit pour le projet <strong style="color:#ffffff;">"${projectName}"</strong> a bien été reçue.`)}
    <div style="border:1px solid ${BRAND};background:#0a0a0a;padding:20px 24px;margin:0 0 24px;border-radius:4px;">
      <p style="color:#999999;font-size:11px;letter-spacing:2px;margin:0 0 12px;font-family:Arial,sans-serif;">CE QUI SE PASSE MAINTENANT</p>
      <p style="color:#cccccc;font-size:13px;line-height:1.8;margin:0;font-family:Arial,sans-serif;">
        🎧 On traite ton projet et on t'envoie un extrait de <strong style="color:#ffffff;">30 secondes</strong> de ton son mixé et masterisé dans les plus brefs délais.
      </p>
    </div>
    ${statusBadge('#3a2600', '#cc6600', '#ffaa44', '⏳ EN COURS DE TRAITEMENT')}
  `;
  return { subject: `Confirmation de ta demande d'essai — SCAVBACK Audio Lab`, html: wrapTemplate(body) };
}
