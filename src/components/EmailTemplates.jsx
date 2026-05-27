const header = `
  <div style="text-align:center;padding:40px 0 20px;">
    <div style="font-size:36px;font-weight:900;letter-spacing:4px;font-family:Arial,sans-serif;">
      <span style="color:#ffffff;">SCAVB</span><span style="color:#cc0000;">ACK</span>
    </div>
    <div style="font-size:10px;color:#999999;letter-spacing:4px;margin-top:8px;font-family:Arial,sans-serif;">COLLECTIF CRÉATIF — SON, IMAGE, VISION</div>
    <div style="height:2px;background:#cc0000;margin:20px auto 0;width:60px;"></div>
  </div>
`;

const footer = `
  <div style="margin-top:40px;">
    <div style="height:1px;background:#cc0000;margin-bottom:24px;"></div>
    <p style="text-align:center;color:#888888;font-size:12px;font-family:Arial,sans-serif;margin:0 0 8px;">
      Des questions ? Contactez-nous : <a href="mailto:SCAVBACK@gmail.com" style="color:#cc0000;text-decoration:none;">SCAVBACK@gmail.com</a>
    </p>
    <p style="text-align:center;color:#555555;font-size:10px;font-family:Arial,sans-serif;margin:0;">
      © 2026 SCAVBACK Audio Lab — Tous droits réservés
    </p>
  </div>
`;

function wrapTemplate(content) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;min-height:100vh;">
    <tr><td align="center" style="padding:20px 16px;">
      <table width="100%" style="max-width:600px;background-color:#111111;border-radius:4px;overflow:hidden;">
        <tr><td style="padding:0 32px 32px;">
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
    <div style="border:1px solid #cc0000;background:#0a0a0a;padding:20px 24px;margin:24px 0;border-radius:2px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:4px 0;color:#999999;font-size:11px;letter-spacing:2px;font-family:Arial,sans-serif;">🔢 NUMÉRO DE COMMANDE</td></tr>
        <tr><td style="padding:0 0 14px;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:3px;font-family:Arial,sans-serif;">#${order.order_number}</td></tr>
        ${servicesList}
        <tr><td style="padding:5px 0;color:#cccccc;font-size:13px;font-family:Arial,sans-serif;">💰 Total : <strong style="color:#ffffff;">${order.total?.toFixed(2).replace('.', ',')}€</strong></td></tr>
        <tr><td style="padding:5px 0;color:#cccccc;font-size:13px;font-family:Arial,sans-serif;">📅 Date : ${date}</td></tr>
      </table>
    </div>
  `;
}

function trackingBox(orderNumber) {
  return `
    <div style="border:1px solid #333333;background:#0d0d0d;padding:20px 24px;margin:24px 0;border-radius:2px;">
      <p style="color:#999999;font-size:11px;letter-spacing:2px;margin:0 0 12px;font-family:Arial,sans-serif;">SUIVI DE COMMANDE</p>
      <p style="color:#cccccc;font-size:13px;line-height:1.9;margin:0;font-family:Arial,sans-serif;">
        Pour suivre votre commande :<br>
        <span style="color:#ffffff;">1.</span> Rendez-vous sur <a href="https://scavback.base44.app" style="color:#cc0000;text-decoration:none;">scavback.base44.app</a><br>
        <span style="color:#ffffff;">2.</span> Allez dans <strong style="color:#ffffff;">Commander → Vos commandes</strong><br>
        <span style="color:#ffffff;">3.</span> Entrez votre numéro : <strong style="color:#ffffff;">#${orderNumber}</strong>
      </p>
    </div>
  `;
}

export function emailConfirmationCommande(order) {
  const prenom = order.prenom || order.user_name || 'Cher client';
  const body = `
    <h2 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 16px;font-family:Arial,sans-serif;">Votre commande a été reçue ✅</h2>
    <p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0 0 8px;font-family:Arial,sans-serif;">
      Bonjour <strong style="color:#ffffff;">${prenom}</strong>, merci pour votre confiance !
      Votre commande a bien été enregistrée et sera traitée après vérification de votre paiement.
    </p>
    ${orderInfoBox(order)}
    <div style="text-align:center;margin:28px 0;">
      <div style="display:inline-block;background:#7a4400;border:1px solid #cc6600;color:#ffaa44;font-size:12px;font-weight:700;letter-spacing:3px;padding:14px 32px;border-radius:2px;font-family:Arial,sans-serif;">
        ⏳ EN ATTENTE DE VÉRIFICATION
      </div>
    </div>
    <p style="text-align:center;color:#888888;font-size:12px;margin:0 0 24px;font-family:Arial,sans-serif;">
      Vous recevrez un email dès que votre commande est acceptée.
    </p>
    ${trackingBox(order.order_number)}
  `;
  return {
    subject: `Confirmation de ta commande #${order.order_number} — SCAVBACK Audio Lab`,
    html: wrapTemplate(body)
  };
}

export function emailCommandeAcceptee(order) {
  const prenom = order.prenom || order.user_name || 'Cher client';
  const body = `
    <h2 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 16px;font-family:Arial,sans-serif;">Bonne nouvelle ! 🎉</h2>
    <p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0 0 8px;font-family:Arial,sans-serif;">
      Bonjour <strong style="color:#ffffff;">${prenom}</strong>, votre paiement a été vérifié avec succès.
      Nous allons maintenant traiter votre musique et vous livrer dans les meilleurs délais.
    </p>
    ${orderInfoBox(order)}
    <div style="text-align:center;margin:28px 0;">
      <div style="display:inline-block;background:#0f3d1f;border:1px solid #2d8a42;color:#4ade80;font-size:12px;font-weight:700;letter-spacing:3px;padding:14px 32px;border-radius:2px;font-family:Arial,sans-serif;">
        ✅ COMMANDE ACCEPTÉE
      </div>
    </div>
    <p style="text-align:center;color:#888888;font-size:12px;margin:0 0 24px;font-family:Arial,sans-serif;">
      Votre commande est en cours de traitement !
    </p>
    ${trackingBox(order.order_number)}
  `;
  return {
    subject: `Votre commande #${order.order_number} a été acceptée — SCAVBACK Audio Lab`,
    html: wrapTemplate(body)
  };
}

export function emailCommandeRefusee(order) {
  const prenom = order.prenom || order.user_name || 'Cher client';
  const body = `
    <h2 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 16px;font-family:Arial,sans-serif;">Information concernant votre commande</h2>
    <p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0 0 8px;font-family:Arial,sans-serif;">
      Bonjour <strong style="color:#ffffff;">${prenom}</strong>,
      votre commande n'a pas pu être validée car aucun paiement n'a été détecté.
      Si vous pensez qu'il s'agit d'une erreur, contactez-nous.
    </p>
    ${orderInfoBox(order)}
    <div style="text-align:center;margin:28px 0;">
      <div style="display:inline-block;background:#3d0f0f;border:1px solid #8a2d2d;color:#f87171;font-size:12px;font-weight:700;letter-spacing:3px;padding:14px 32px;border-radius:2px;font-family:Arial,sans-serif;">
        ❌ COMMANDE REFUSÉE
      </div>
    </div>
    <p style="text-align:center;color:#888888;font-size:12px;margin:0 0 24px;font-family:Arial,sans-serif;">
      Pour toute question : <a href="mailto:SCAVBACK@gmail.com" style="color:#cc0000;text-decoration:none;">SCAVBACK@gmail.com</a>
    </p>
    ${trackingBox(order.order_number)}
  `;
  return {
    subject: `Votre commande #${order.order_number} a été refusée — SCAVBACK Audio Lab`,
    html: wrapTemplate(body)
  };
}

export function emailConfirmationEssai({ userName, projectName }) {
  const body = `
    <h2 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 16px;font-family:Arial,sans-serif;">Demande d'essai reçue ✅</h2>
    <p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0 0 24px;font-family:Arial,sans-serif;">
      Bonjour <strong style="color:#ffffff;">${userName || 'Cher artiste'}</strong>, merci pour votre confiance !<br>
      Votre demande d'essai gratuit pour le projet <strong style="color:#ffffff;">"${projectName}"</strong> a bien été reçue.
    </p>
    <div style="border:1px solid #cc0000;background:#0a0a0a;padding:20px 24px;margin:0 0 24px;border-radius:2px;">
      <p style="color:#999999;font-size:11px;letter-spacing:2px;margin:0 0 12px;font-family:Arial,sans-serif;">CE QUI SE PASSE MAINTENANT</p>
      <p style="color:#cccccc;font-size:13px;line-height:1.8;margin:0;font-family:Arial,sans-serif;">
        🎧 Nous allons traiter votre projet et vous envoyer un extrait de <strong style="color:#ffffff;">30 secondes</strong> de votre son mixé et masterisé dans les plus brefs délais.
      </p>
    </div>
    <div style="text-align:center;margin:28px 0;">
      <div style="display:inline-block;background:#7a4400;border:1px solid #cc6600;color:#ffaa44;font-size:12px;font-weight:700;letter-spacing:3px;padding:14px 32px;border-radius:2px;font-family:Arial,sans-serif;">
        ⏳ EN COURS DE TRAITEMENT
      </div>
    </div>
    <p style="text-align:center;color:#888888;font-size:12px;margin:0;font-family:Arial,sans-serif;">
      Vous serez contacté à cette adresse email dès que votre extrait est prêt.
    </p>
  `;
  return {
    subject: `Confirmation de votre demande d'essai — SCAVBACK Audio Lab`,
    html: wrapTemplate(body)
  };
}