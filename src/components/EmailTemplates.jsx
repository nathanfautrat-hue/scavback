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
        <span style="color:#ffffff;">1.</span> Rendez-vous sur <a href="https://scavback.fr" style="color:${BRAND};text-decoration:none;">scavback.fr</a><br>
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

// ─── Mails de statut premium (en attente / validée) ───────────────────────────
// Univers du site : HUD de caméra, terminal, barre de chargement façon PageTransition.
const SITE = 'https://scavback.fr';
const CONTACT = 'contact@scavback.fr';
const ESPACE = `${SITE}/Commander?tab=suivi`;
const MONO = "'Courier New',Courier,monospace";
const SANS = 'Arial,Helvetica,sans-serif';

function signatureHtml() {
  const a = (href, t, c = '#e0e0e0') => `<a href="${href}" style="color:${c};text-decoration:none;">${t}</a>`;
  return `
<table cellpadding="0" cellspacing="0" border="0" role="presentation" bgcolor="#020202" style="border-collapse:collapse;background:#020202;">
  <tr><td colspan="3" height="3" bgcolor="#cc0000" style="background:#cc0000;font-size:0;line-height:0;height:3px;">&nbsp;</td></tr>
  <tr>
    <td valign="middle" style="padding:16px 0 16px 16px;"><a href="${SITE}"><img src="${SITE}/email/logo-signature.png" width="72" height="75" alt="SCAVBACK" style="display:block;border:0;width:72px;height:75px;"></a></td>
    <td width="1" bgcolor="#262626" style="background:#262626;width:1px;font-size:0;">&nbsp;</td>
    <td valign="middle" style="padding:14px 20px 14px 16px;font-family:${SANS};">
      <div style="font-size:17px;font-weight:900;letter-spacing:3px;line-height:1;color:#ffffff;">SCAV<span style="color:#cc0000;">BACK</span></div>
      <div style="font-family:${MONO};font-size:11px;color:#7a7a7a;margin-top:9px;line-height:1.7;">
        <span style="color:#cc0000;">&gt;</span> ${a('mailto:' + CONTACT, CONTACT)}<br>
        <span style="color:#cc0000;">&gt;</span> ${a(SITE, 'scavback.fr')}
      </div>
      <div style="font-family:${MONO};font-size:10px;letter-spacing:2px;margin-top:8px;">
        ${a('https://www.instagram.com/scavback', 'INSTAGRAM')}<span style="color:#444;"> / </span>${a('https://www.youtube.com/@SCAVBACK', 'YOUTUBE')}
      </div>
    </td>
  </tr>
</table>`;
}

// Barre de progression en cellules (fiable dans Gmail / Outlook, contrairement aux caractères de bloc)
function progressBar(filled, total, color) {
  let cells = '';
  for (let i = 0; i < total; i++) {
    const on = i < filled;
    cells += `<td width="${Math.floor(100 / total)}%" height="10" bgcolor="${on ? color : '#1c1c1c'}" style="background:${on ? color : '#1c1c1c'};height:10px;font-size:0;line-height:0;">&nbsp;</td>`;
    if (i < total - 1) cells += `<td width="3" style="font-size:0;">&nbsp;</td>`;
  }
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>${cells}</tr></table>`;
}

// Frise des 3 étapes : 'done' | 'active' | 'todo'
function timeline(states, color) {
  const labels = ['COMMANDE<br>REÇUE', 'PAIEMENT<br>CONFIRMÉ', 'TRAVAIL SUR<br>TON SON'];
  const cell = (st, i) => {
    const c = st === 'done' ? '#ffffff' : st === 'active' ? color : '#444444';
    const mark = st === 'done' ? '&#10003;' : st === 'active' ? '&#9679;' : '&#9675;';
    return `<td width="33%" valign="top" align="center" style="padding:0 4px;">
      <div style="font-family:${MONO};font-size:16px;color:${st === 'done' ? color : c};">${mark}</div>
      <div style="font-family:${MONO};font-size:10px;letter-spacing:2px;color:${c};margin-top:6px;line-height:1.5;">0${i + 1}<br>${labels[i]}</div>
    </td>`;
  };
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>${states.map(cell).join('')}</tr></table>`;
}

function recapBox(order, color) {
  const row = (k, v) => `<tr><td style="padding:7px 0;font-family:${MONO};font-size:11px;letter-spacing:2px;color:#7a7a7a;">${k}</td><td align="right" style="padding:7px 0;font-family:${SANS};font-size:14px;font-weight:700;color:#ffffff;">${v}</td></tr>`;
  const total = order.total != null ? `${Number(order.total).toFixed(2).replace('.', ',')} €` : '';
  const offre = (order.services || []).join(', ');
  const qte = order.quantity > 1 ? ` × ${order.quantity}` : '';
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" bgcolor="#020202" style="border:1px solid ${color};background:#020202;">
    <tr><td style="padding:14px 20px 4px;font-family:${MONO};font-size:10px;letter-spacing:3px;color:${color === '#333333' ? '#7a7a7a' : color};">// RÉCAPITULATIF</td></tr>
    <tr><td style="padding:0 20px 12px;"><table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
      ${row('OFFRE', offre + qte)}${row('MONTANT', total)}
    </table></td></tr>
  </table>`;
}

// Bloc « numéro de commande » : c'est la clé d'accès à l'espace commande (discussion + fichiers).
function orderKeyBox(order, color) {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" bgcolor="#020202" style="background:#020202;border:1px solid ${color};">
    <tr><td align="center" style="padding:20px 20px 4px;font-family:${MONO};font-size:10px;letter-spacing:3px;color:${color};">// TON NUMÉRO DE COMMANDE</td></tr>
    <tr><td align="center" style="padding:6px 20px 0;font-family:${MONO};font-size:30px;font-weight:700;letter-spacing:4px;color:#ffffff;">${order.order_number}</td></tr>
    <tr><td align="center" style="padding:12px 28px 20px;font-family:${SANS};font-size:13px;line-height:1.7;color:#9a9a9a;">
      <strong style="color:#ffffff;">Garde-le précieusement.</strong> C'est ta clé pour ton espace commande sur scavback.fr
      (<span style="color:#ffffff;">Services Studio → Audio Lab → Vos commandes</span>) : c'est là qu'on discute et que tu déposes tes fichiers.
    </td></tr>
  </table>`;
}

function statusShell({ color, hud, terminal, title, accentWord, intro, filled, states, middle, cta }) {
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="color-scheme" content="dark"></head>
<body style="margin:0;padding:0;background:#020202;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" bgcolor="#020202" style="background:#020202;">
<tr><td align="center" style="padding:28px 12px;">
<table width="600" cellpadding="0" cellspacing="0" border="0" role="presentation" bgcolor="#0a0a0a" style="max-width:600px;width:100%;background:#0a0a0a;border:1px solid #1c1c1c;">
  <tr><td height="3" bgcolor="${color}" style="background:${color};font-size:0;line-height:0;">&nbsp;</td></tr>
  <tr><td style="padding:14px 28px 0;font-family:${MONO};font-size:10px;letter-spacing:2px;color:#4A5D66;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
      <td>${hud}</td><td align="right" style="color:${color};">&#9679; LIVE</td>
    </tr></table>
  </td></tr>
  <tr><td align="center" style="padding:26px 28px 0;">
    <a href="${SITE}"><img src="${SITE}/email/logo-mail.png" width="150" height="177" alt="SCAVBACK" style="display:block;border:0;width:150px;height:177px;"></a>
  </td></tr>
  <tr><td align="center" style="padding:20px 28px 0;font-family:${MONO};font-size:12px;letter-spacing:2px;color:${color};">${terminal}</td></tr>
  <tr><td align="center" style="padding:10px 28px 0;font-family:${SANS};font-size:40px;font-weight:900;letter-spacing:-1px;line-height:1.02;color:#ffffff;text-transform:uppercase;">
    ${title}<br><span style="color:${color};">${accentWord}</span>
  </td></tr>
  <tr><td align="center" style="padding:18px 44px 0;font-family:${SANS};font-size:15px;line-height:1.7;color:#bdbdbd;">${intro}</td></tr>
  <tr><td style="padding:30px 40px 0;">${progressBar(filled, 12, color)}</td></tr>
  <tr><td style="padding:18px 28px 0;">${timeline(states, color)}</td></tr>
  ${middle}
  ${cta}
  <tr><td style="padding:34px 28px 28px;">${signatureHtml()}</td></tr>
</table>
<div style="font-family:${MONO};font-size:10px;letter-spacing:2px;color:#444;padding-top:16px;">© SCAVBACK — scavback.fr</div>
</td></tr></table>
</body></html>`;
}

const whiteButton = (href, label) => `<tr><td align="center" style="padding:30px 28px 0;">
  <a href="${href}" style="display:inline-block;background:#ffffff;color:#000000;font-family:${MONO};font-size:12px;font-weight:700;letter-spacing:3px;text-decoration:none;padding:15px 30px;">${label} &rarr;</a>
</td></tr>`;

// ─── EMAIL 1 — Commande reçue, en attente de validation ───────────────────────
export function emailConfirmationCommande(order) {
  const AMBER = '#ffaa00';
  const prenom = order.prenom || order.user_name || 'Salut';
  const middle = `
  <tr><td style="padding:30px 28px 0;">${orderKeyBox(order, AMBER)}</td></tr>
  <tr><td style="padding:22px 28px 0;">${recapBox(order, '#333333')}</td></tr>`;
  const html = statusShell({
    color: AMBER,
    hud: 'REC. 01 &nbsp;/&nbsp; AUDIO_LAB &nbsp;/&nbsp; ' + order.order_number,
    terminal: '&gt; COMMANDE_EN_COURS_DE_VALIDATION...',
    title: 'Commande',
    accentWord: 'en attente',
    intro: `${prenom}, merci pour ton paiement, ta commande est bien enregistrée. Jumisto la valide et tu reçois un mail dès que c'est bon.`,
    filled: 6,
    states: ['done', 'active', 'todo'],
    middle,
    cta: whiteButton(ESPACE, 'OUVRIR MON ESPACE COMMANDE'),
  });
  return { subject: `Commande reçue, en attente de validation — ${order.order_number}`, html };
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
    ${ctaButton('https://scavback.fr/Commander?tab=essai', 'Commencer mon essai gratuit')}
  `;
  return { subject: "Bienvenue dans l'univers SCAVBACK", html: wrapTemplate(body) };
}

// ─── EMAIL 4 — Relance / Panier abandonné ──────────────────────────────────────
export function emailPanierAbandonne(userName = 'Cher artiste', offerLabel = 'ton offre') {
  const body = `
    ${h2('Tu es à deux doigts...')}
    ${p(`Bonjour <strong style="color:#ffffff;">${userName}</strong>, tu as commencé une commande (<strong style="color:#ffffff;">${offerLabel}</strong>) mais tu ne l'as pas finalisée.`)}
    ${p('Ton son mérite un rendu pro. On garde ta sélection au chaud — il ne te reste qu\'à confirmer.')}
    ${ctaButton('https://scavback.fr/Commander?tab=commande', 'Reprendre ma commande')}
  `;
  return { subject: 'Tu es à deux doigts... — SCAVBACK Audio Lab', html: wrapTemplate(body) };
}

// ─── Emails internes (statuts commande) — conservés ────────────────────────────
// ─── EMAIL 2 — Commande validée ────────────────────────────────────────────────
export function emailCommandeAcceptee(order) {
  const GREEN = '#00ff41';
  const prenom = order.prenom || order.user_name || 'Salut';
  const step = (n, t, d) => `<tr><td valign="top" width="38" style="padding:12px 0;font-family:${MONO};font-size:13px;color:${GREEN};">0${n}</td><td style="padding:12px 0;border-top:1px solid #1c1c1c;font-family:${SANS};"><div style="font-size:14px;font-weight:700;color:#ffffff;">${t}</div><div style="font-size:13px;line-height:1.6;color:#9a9a9a;margin-top:3px;">${d}</div></td></tr>`;
  const middle = `
  <tr><td style="padding:30px 28px 0;">${orderKeyBox(order, GREEN)}</td></tr>
  <tr><td style="padding:30px 28px 0;font-family:${MONO};font-size:10px;letter-spacing:3px;color:#7a7a7a;">// LA SUITE</td></tr>
  <tr><td style="padding:6px 28px 0;"><table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
    ${step(1, 'Ouvre ton espace commande', 'Sur scavback.fr, onglet « Vos commandes », entre ton numéro de commande.')}
    ${step(2, 'Dépose tes pistes', "Directement sur le site, pas besoin de WeTransfer. Format WAV 24 bits / 44,1 kHz, voix synchronisées avec l'instru.")}
    ${step(3, 'On avance ensemble', 'Tu échanges avec Jumisto dans la discussion et tu y récupères ton rendu final.')}
  </table></td></tr>
  <tr><td style="padding:22px 28px 0;">${recapBox(order, '#333333')}</td></tr>`;
  const html = statusShell({
    color: GREEN,
    hud: 'REC. 01 &nbsp;/&nbsp; AUDIO_LAB &nbsp;/&nbsp; ' + order.order_number,
    terminal: '&gt; ACCÈS_AUTORISÉ &#10003;',
    title: 'Commande',
    accentWord: 'validée',
    intro: `${prenom}, ton paiement est confirmé et ta commande est validée. Ton espace est ouvert : dépose tes pistes et c'est parti.`,
    filled: 12,
    states: ['done', 'done', 'active'],
    middle,
    cta: whiteButton(ESPACE, 'DÉPOSER MES PISTES'),
  });
  return { subject: `Commande validée ✓ — ${order.order_number}`, html };
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
