import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CguModal({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border border-white/10 text-gray-300 max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle className="font-space font-bold uppercase tracking-widest text-white text-sm">
            Conditions Générales d'Utilisation & de Vente
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="font-mono text-[11px] leading-relaxed space-y-4 text-gray-400">
            <p className="text-white font-bold">SCAVBACK Audio Lab — CGU & CGV</p>

            <p>Merci d'utiliser les services web de SCAVBACK Audio Lab. Les présentes conditions d'utilisation (les « Conditions ») couvrent votre utilisation des services, du logiciel client et des sites Web (les « Services ») fournis par SCAVBACK Audio Lab, ainsi que votre accès à ceux-ci.</p>

            <p><span className="text-white">1. ACCEPTATION DES CONDITIONS</span><br/>
            En accédant aux Services, vous confirmez avoir lu, compris et accepté les présentes Conditions. Si vous représentez une entreprise ou une autre entité juridique, vous déclarez avoir l'autorité nécessaire pour engager cette entité.</p>

            <p><span className="text-white">2. UTILISATION DES SERVICES</span><br/>
            Vous vous engagez à utiliser les Services de manière légale et dans le respect des présentes Conditions. Vous ne devez pas utiliser les Services à des fins illégales ou non autorisées. SCAVBACK Audio Lab se réserve le droit de refuser ou de suspendre l'accès aux Services à tout moment.</p>

            <p><span className="text-white">3. PROPRIÉTÉ INTELLECTUELLE</span><br/>
            Sauf indication contraire, SCAVBACK Audio Lab détient tous les droits de propriété intellectuelle sur les Services et leur contenu. Vous ne pouvez pas reproduire, distribuer ou créer des œuvres dérivées sans autorisation écrite préalable.</p>

            <p><span className="text-white">4. TARIFS ET PAIEMENTS</span><br/>
            Les tarifs des Services sont indiqués en euros (€) TTC. Le paiement est dû immédiatement lors de la commande. SCAVBACK Audio Lab utilise Stripe pour les paiements en ligne. Toute commande est ferme et définitive une fois le paiement confirmé.</p>

            <p><span className="text-white">5. DÉLAIS DE LIVRAISON</span><br/>
            Les délais indiqués sur le site sont à titre indicatif et peuvent varier selon le volume de commandes en cours. SCAVBACK Audio Lab s'engage à traiter les commandes dans les meilleurs délais. En cas de retard significatif, le client sera informé par email.</p>

            <p><span className="text-white">6. DROIT DE RÉTRACTATION</span><br/>
            Conformément à la législation en vigueur, vous disposez d'un délai de 14 jours pour exercer votre droit de rétractation à compter de la date de commande, à condition que la prestation n'ait pas encore débuté. Passé ce délai ou si la prestation a débuté avec votre accord exprès, aucun remboursement ne sera possible.</p>

            <p><span className="text-white">7. RESPONSABILITÉ</span><br/>
            SCAVBACK Audio Lab s'engage à fournir des Services de qualité professionnelle. En cas de litige, SCAVBACK Audio Lab s'engage à trouver une solution amiable. La responsabilité de SCAVBACK Audio Lab est limitée au montant payé pour la commande concernée.</p>

            <p><span className="text-white">8. DONNÉES PERSONNELLES</span><br/>
            SCAVBACK Audio Lab collecte et traite vos données personnelles conformément à la réglementation RGPD. Vos données sont utilisées uniquement pour le traitement de vos commandes et ne sont pas transmises à des tiers sans votre consentement. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.</p>

            <p><span className="text-white">9. CONTACT</span><br/>
            Pour toute question relative aux présentes Conditions ou aux Services, vous pouvez nous contacter à l'adresse suivante : SCAVBACK@gmail.com</p>

            <p><span className="text-white">10. LOI APPLICABLE</span><br/>
            Les présentes Conditions sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français seront seuls compétents.</p>

            <p className="text-gray-600 italic">Dernière mise à jour : Mars 2026</p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}