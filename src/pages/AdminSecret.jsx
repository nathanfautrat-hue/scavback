import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Lock, RefreshCw, ExternalLink } from 'lucide-react';
import DiscussionModal from '@/components/DiscussionModal';
import { emailCommandeAcceptee, emailCommandeRefusee } from '@/components/EmailTemplates';

export default function AdminSecret() {
  const [code, setCode] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [filter, setFilter] = useState('active');
  const [tab, setTab] = useState('discussions');
  const [acting, setActing] = useState({});

  const SECRET_CODE = '5545';

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {
      setError('Non autorisé');
    });
  }, []);

  const handleUnlock = () => {
    if (code === SECRET_CODE) {
      setUnlocked(true);
      setError('');
      loadConversations();
    } else {
      setError('Code invalide');
      setCode('');
    }
  };

  const loadConversations = async () => {
    setLoading(true);
    const [convs, o, t] = await Promise.all([
      base44.entities.Conversation.list('-created_date', 500),
      base44.entities.Order.list('-created_date', 100),
      base44.entities.TrialRequest.list('-created_date', 100),
    ]);
    setConversations(convs);
    setOrders(o);
    setTrials(t);
    setLoading(false);
  };

  // Temps réel pour les commandes (repaiement client)
  useEffect(() => {
    if (!unlocked) return;
    const unsub = base44.entities.Order.subscribe((event) => {
      if (event.type === 'update') {
        setOrders(prev => prev.map(o => o.id === event.id ? event.data : o));
      } else if (event.type === 'create') {
        setOrders(prev => [event.data, ...prev]);
      }
    });
    return unsub;
  }, [unlocked]);

  const handleOrderAction = async (order, action) => {
    const newStatus = action === 'accept' ? 'accepted' : 'refused';
    setActing(prev => ({ ...prev, [order.id]: action }));
    await base44.entities.Order.update(order.id, { status: newStatus });
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));

    if (action === 'accept') {
      const email = emailCommandeAcceptee(order);
      await base44.integrations.Core.SendEmail({ to: order.user_email, subject: email.subject, body: email.html });
    } else {
      const email = emailCommandeRefusee(order);
      await base44.integrations.Core.SendEmail({ to: order.user_email, subject: email.subject, body: email.html });
    }
    setActing(prev => ({ ...prev, [order.id]: null }));
  };

  const handleTrialDone = async (id) => {
    setActing(prev => ({ ...prev, [id]: true }));
    await base44.entities.TrialRequest.update(id, { status: 'delivered' });
    setTrials(prev => prev.map(t => t.id === id ? { ...t, status: 'delivered' } : t));
    setActing(prev => ({ ...prev, [id]: false }));
  };

  // Écran de verrouillage
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="border border-white/[0.06] bg-[#040404] p-10 space-y-8">
            <div className="text-center">
              <Lock className="w-12 h-12 text-[#8B0000] mx-auto mb-4" />
              <p className="text-[#8B0000] font-mono text-[10px] mb-2 tracking-widest uppercase">/ / Zone Sécurisée</p>
              <h1 className="text-2xl font-space font-bold uppercase tracking-tighter text-white">
                Accès Admin<br /><span className="text-gray-600">Code Requis</span>
              </h1>
            </div>

            <div className="space-y-4">
              <input
                type="password"
                value={code}
                onChange={e => setCode(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleUnlock()}
                placeholder="Code d'accès"
                maxLength="4"
                className="w-full bg-[#020202] border border-white/[0.08] text-center text-gray-300 font-mono text-lg px-4 py-4 focus:outline-none focus:border-white/20 tracking-widest"
                autoFocus
              />

              {error && <p className="text-[11px] font-mono text-red-500 text-center">{error}</p>}

              <button
                onClick={handleUnlock}
                disabled={code.length !== 4}
                className="w-full bg-white text-black font-mono text-xs font-bold uppercase tracking-widest py-4 hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Déverrouiller
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Écran des discussions (admin)
  const filteredConversations = conversations.filter(conv => {
    if (filter === 'active') return conv.status !== 'closed';
    if (filter === 'closed') return conv.status === 'closed';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col pt-20 pb-8">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-[#020202] px-6 py-4 mb-8">
        <div>
          <p className="text-[#8B0000] font-mono text-[10px] mb-2 tracking-widest uppercase">/ / Admin</p>
          <h1 className="text-2xl font-space font-bold uppercase tracking-tighter text-white">
            Backoffice
          </h1>
          <p className="text-[11px] font-mono text-gray-600 mt-2">
            Gestion des discussions, commandes et essais gratuits
          </p>
        </div>

        {/* Main Tabs */}
        <div className="flex gap-3 mt-6 border-b border-white/[0.06] pb-4">
          <button
            onClick={() => { setTab('discussions'); setFilter('active'); }}
            className={`text-[10px] font-mono px-4 py-2 transition-colors ${
              tab === 'discussions'
                ? 'bg-white text-black font-bold'
                : 'border border-white/[0.06] text-gray-400 hover:text-white'
            }`}
          >
            Discussions
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`text-[10px] font-mono px-4 py-2 transition-colors ${
              tab === 'orders'
                ? 'bg-white text-black font-bold'
                : 'border border-white/[0.06] text-gray-400 hover:text-white'
            }`}
          >
            Commandes ({orders.filter(o => o.status !== 'accepted' && o.status !== 'refused').length})
          </button>
          <button
            onClick={() => setTab('verified')}
            className={`text-[10px] font-mono px-4 py-2 transition-colors ${
              tab === 'verified'
                ? 'bg-white text-black font-bold'
                : 'border border-white/[0.06] text-gray-400 hover:text-white'
            }`}
          >
            Vérifiées ({orders.filter(o => o.status === 'accepted' || o.status === 'refused').length})
          </button>
          <button
            onClick={() => setTab('trials')}
            className={`text-[10px] font-mono px-4 py-2 transition-colors ${
              tab === 'trials'
                ? 'bg-white text-black font-bold'
                : 'border border-white/[0.06] text-gray-400 hover:text-white'
            }`}
          >
            Essais ({trials.length})
          </button>
        </div>

        {/* Discussion Filters (only when on discussions tab) */}
        {tab === 'discussions' && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setFilter('active')}
              className={`text-[10px] font-mono px-4 py-2 transition-colors ${
                filter === 'active'
                  ? 'bg-white text-black font-bold'
                  : 'border border-white/[0.06] text-gray-400 hover:text-white'
              }`}
            >
              En cours
            </button>
            <button
              onClick={() => setFilter('closed')}
              className={`text-[10px] font-mono px-4 py-2 transition-colors ${
                filter === 'closed'
                  ? 'bg-white text-black font-bold'
                  : 'border border-white/[0.06] text-gray-400 hover:text-white'
              }`}
            >
              Commandes Finies
            </button>
          </div>
        )}
      </div>

      {/* Content based on tab */}
      <div className="px-6 max-w-6xl mx-auto w-full">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block w-6 h-6 border border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : tab === 'discussions' ? (
          <>
            {filteredConversations.length === 0 ? (
              <div className="text-center py-16 border border-white/[0.06] bg-[#040404] p-8">
                <p className="text-[11px] font-mono text-gray-600">
                  {filter === 'active' ? 'Aucune conversation en cours.' : 'Aucune commande finalisée.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredConversations.map((conv) => (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-white/[0.06] bg-[#040404] p-4 hover:border-white/20 transition-colors cursor-pointer"
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="text-[10px] font-mono text-white font-bold">#{conv.order_number}</span>
                          <span className="text-[10px] font-mono text-gray-600">
                            {conv.message_count || 0} message{(conv.message_count || 0) > 1 ? 's' : ''}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-gray-400 truncate">
                          {conv.client_name}
                        </p>
                        <p className="text-[10px] font-mono text-gray-700 mt-1">
                          {conv.client_email}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[9px] font-mono text-gray-700">
                          {conv.last_message_date
                            ? new Date(conv.last_message_date).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : tab === 'orders' ? (
          <OrdersTable orders={orders.filter(o => o.status !== 'accepted' && o.status !== 'refused')} onAction={handleOrderAction} acting={acting} />
        ) : tab === 'verified' ? (
          <VerifiedOrdersTable orders={orders.filter(o => o.status === 'accepted' || o.status === 'refused')} />
        ) : (
          <TrialsTable trials={trials} onDone={handleTrialDone} acting={acting} />
        )}
      </div>

      {/* Discussion Modal */}
      {selectedConversation && (
        <DiscussionModal
          conversation={selectedConversation}
          onClose={() => setSelectedConversation(null)}
        />
      )}
      </div>
      );
      }

      function StatusBadge({ status }) {
      const map = {
      pending:     { label: 'En attente', cls: 'text-yellow-500' },
      paid:        { label: 'Payée',      cls: 'text-blue-400' },
      accepted:    { label: 'Acceptée',   cls: 'text-green-500' },
      refused:     { label: 'Refusée',    cls: 'text-red-500' },
      in_progress: { label: 'En cours',   cls: 'text-blue-400' },
      delivered:   { label: 'Traité',     cls: 'text-green-400' },
      };
      const s = map[status] || { label: status, cls: 'text-gray-400' };
      return <span className={`text-[10px] font-mono ${s.cls}`}>● {s.label}</span>;
      }

      function OrdersTable({ orders, onAction, acting }) {
      if (orders.length === 0) return <p className="font-mono text-xs text-gray-600 py-10 text-center">Aucune commande.</p>;
      return (
      <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {['Commande', 'Client', 'Forfaits', 'Total', 'Date', 'Statut', 'Actions'].map(h => (
              <th key={h} className="text-[9px] font-mono text-[#4A5D66] uppercase tracking-widest pb-3 pr-4">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.03]">
          {orders.map(order => (
            <tr key={order.id} className="hover:bg-white/[0.01]">
              <td className="py-4 pr-4"><span className="text-xs font-mono font-bold text-white">#{order.order_number}</span></td>
              <td className="py-4 pr-4">
                <p className="text-[11px] font-mono text-gray-300">{order.prenom} {order.nom}</p>
                <p className="text-[10px] font-mono text-gray-600">{order.user_email}</p>
              </td>
              <td className="py-4 pr-4">
                <div className="flex flex-wrap gap-1">
                  {(order.services || []).map(s => (
                    <span key={s} className="text-[10px] font-mono text-[#4A5D66] border border-[#4A5D66]/30 px-2 py-0.5 whitespace-nowrap">{s} ×{order.quantity}</span>
                  ))}
                </div>
              </td>
              <td className="py-4 pr-4"><span className="text-sm font-space font-bold text-white">{order.total?.toFixed(2).replace('.', ',')}€</span></td>
              <td className="py-4 pr-4">
                <span className="text-[10px] font-mono text-gray-600 whitespace-nowrap">
                  {new Date(order.created_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
              </td>
              <td className="py-4 pr-4"><StatusBadge status={order.status} /></td>
              <td className="py-4">
                {order.status !== 'accepted' && order.status !== 'refused' ? (
                  <div className="flex gap-2">
                    <button onClick={() => onAction(order, 'accept')} disabled={!!acting[order.id]}
                      className="text-[10px] font-mono font-bold uppercase px-3 py-1.5 bg-green-800 hover:bg-green-700 text-white transition-colors disabled:opacity-50">
                      {acting[order.id] === 'accept' ? '...' : 'Accepter'}
                    </button>
                    <button onClick={() => onAction(order, 'refuse')} disabled={!!acting[order.id]}
                      className="text-[10px] font-mono font-bold uppercase px-3 py-1.5 bg-[#8B0000] hover:bg-red-800 text-white transition-colors disabled:opacity-50">
                      {acting[order.id] === 'refuse' ? '...' : 'Refuser'}
                    </button>
                  </div>
                ) : <span className="text-[10px] font-mono text-gray-700 italic">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      );
      }

      function VerifiedOrdersTable({ orders }) {
      const accepted = orders.filter(o => o.status === 'accepted');
      const refused = orders.filter(o => o.status === 'refused');

      const OrderRow = ({ order }) => (
      <tr key={order.id} className="hover:bg-white/[0.01]">
      <td className="py-4 pr-4"><span className="text-xs font-mono font-bold text-white">#{order.order_number}</span></td>
      <td className="py-4 pr-4">
        <p className="text-[11px] font-mono text-gray-300">{order.prenom} {order.nom}</p>
        <p className="text-[10px] font-mono text-gray-600">{order.user_email}</p>
      </td>
      <td className="py-4 pr-4">
        <div className="flex flex-wrap gap-1">
          {(order.services || []).map(s => (
            <span key={s} className="text-[10px] font-mono text-[#4A5D66] border border-[#4A5D66]/30 px-2 py-0.5 whitespace-nowrap">{s} ×{order.quantity}</span>
          ))}
        </div>
      </td>
      <td className="py-4 pr-4"><span className="text-sm font-space font-bold text-white">{order.total?.toFixed(2).replace('.', ',')}€</span></td>
      <td className="py-4 pr-4">
        <span className="text-[10px] font-mono text-gray-600 whitespace-nowrap">
          {new Date(order.created_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </span>
      </td>
      </tr>
      );

      const SectionTable = ({ items }) => (
      <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {['Commande', 'Client', 'Forfaits', 'Total', 'Date'].map(h => (
              <th key={h} className="text-[9px] font-mono text-[#4A5D66] uppercase tracking-widest pb-3 pr-4">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.03]">
          {items.map(order => <OrderRow key={order.id} order={order} />)}
        </tbody>
      </table>
      </div>
      );

      return (
      <div className="space-y-10">
      <div>
        <p className="text-[10px] font-mono text-green-500 uppercase tracking-widest mb-4">✅ Acceptées ({accepted.length})</p>
        {accepted.length === 0
          ? <p className="font-mono text-xs text-gray-600 py-4 text-center">Aucune commande acceptée.</p>
          : <SectionTable items={accepted} />}
      </div>
      <div>
        <p className="text-[10px] font-mono text-red-500 uppercase tracking-widest mb-4">❌ Refusées ({refused.length})</p>
        {refused.length === 0
          ? <p className="font-mono text-xs text-gray-600 py-4 text-center">Aucune commande refusée.</p>
          : <SectionTable items={refused} />}
      </div>
      </div>
      );
      }

      function TrialsTable({ trials, onDone, acting }) {
      if (trials.length === 0) return <p className="font-mono text-xs text-gray-600 py-10 text-center">Aucune demande d'essai.</p>;
      return (
      <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {['Projet', 'Client', 'Message', 'Lien', 'Date', 'Statut', 'Action'].map(h => (
              <th key={h} className="text-[9px] font-mono text-[#4A5D66] uppercase tracking-widest pb-3 pr-4">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.03]">
          {trials.map(trial => (
            <tr key={trial.id} className="hover:bg-white/[0.01]">
              <td className="py-4 pr-4"><span className="text-xs font-mono font-bold text-white">{trial.project_name}</span></td>
              <td className="py-4 pr-4">
                <p className="text-[11px] font-mono text-gray-300">{trial.user_name}</p>
                <p className="text-[10px] font-mono text-gray-600">{trial.user_email}</p>
              </td>
              <td className="py-4 pr-4 max-w-[180px]"><p className="text-[10px] font-mono text-gray-500 line-clamp-2">{trial.message || '—'}</p></td>
              <td className="py-4 pr-4">
                {trial.download_link
                  ? <a href={trial.download_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-mono text-[#4A5D66] hover:text-white transition-colors">Lien <ExternalLink size={10} /></a>
                  : '—'}
              </td>
              <td className="py-4 pr-4">
                <span className="text-[10px] font-mono text-gray-600 whitespace-nowrap">
                  {new Date(trial.created_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
              </td>
              <td className="py-4 pr-4">
                {trial.status === 'delivered'
                  ? <span className="text-[10px] font-mono text-green-500">● Traité</span>
                  : <span className="text-[10px] font-mono text-yellow-500">● En attente</span>}
              </td>
              <td className="py-4">
                {trial.status !== 'delivered'
                  ? <button onClick={() => onDone(trial.id)} disabled={acting[trial.id]}
                      className="text-[10px] font-mono font-bold uppercase px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gray-300 transition-colors disabled:opacity-50 whitespace-nowrap">
                      {acting[trial.id] ? '...' : 'Marquer traité'}
                    </button>
                  : <span className="text-[10px] font-mono text-gray-700 italic">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      );
      }