import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Send, Paperclip, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { playKeyboardClick, playSendSound } from '@/components/soundEffects';

export default function ClientDiscussion() {
  const params = new URLSearchParams(window.location.search);
  const orderIdFromUrl = params.get('orderId');

  const [step, setStep] = useState(orderIdFromUrl ? 'loading' : 'search');
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);

  const [order, setOrder] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const bottomRef = useRef(null);

  // Si orderId dans l'URL, charger directement
  useEffect(() => {
    if (!orderIdFromUrl) return;
    base44.entities.Order.list().then(all => {
      const found = all.find(o => o.id === orderIdFromUrl);
      if (found) {
        setOrder(found);
        createConversation(found);
        loadMessages(found.id);
        loadConversation(found.id);
        setStep('chat');
      } else {
        setStep('search');
      }
    });
  }, []);

  const loadConversation = async (ordId) => {
    const conv = await base44.entities.Conversation.filter({ order_id: ordId });
    if (conv.length > 0) {
      setConversation(conv[0]);
      if (conv[0].status === 'closed' && !conv[0].feedback) {
        setShowFeedback(true);
      }
    }
  };

  const loadMessages = async (ordId) => {
    const msgs = await base44.entities.Message.filter({ order_id: ordId }, 'created_date', 200);
    setMessages(msgs);
  };

  const createConversation = async (ord) => {
    const existing = await base44.entities.Conversation.filter({ order_id: ord.id });
    if (existing.length === 0) {
      await base44.entities.Conversation.create({
        order_id: ord.id,
        order_number: ord.order_number,
        client_email: ord.user_email,
        client_name: ord.user_name || ord.prenom ? `${ord.prenom || ''} ${ord.nom || ''}`.trim() : ord.user_email,
        last_message_date: new Date().toISOString()
      });
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const num = searchInput.trim().replace(/^#/, '').toUpperCase();
    if (!num) return;
    setSearching(true);
    setSearchError('');
    const results = await base44.entities.Order.filter({ order_number: num });
    if (results.length === 0) {
      setSearchError('Aucune commande trouvée avec ce numéro.');
      setSearching(false);
      return;
    }
    const found = results[0];
    const allowed = ['paid', 'accepted', 'in_progress', 'delivered'];
    if (!allowed.includes(found.status)) {
      setSearchError('Cet espace n\'est accessible qu\'aux commandes acceptées.');
      setSearching(false);
      return;
    }
    setOrder(found);
    await createConversation(found);
    await loadMessages(found.id);
    await loadConversation(found.id);
    setStep('chat');
    setSearching(false);
  };

  // Temps réel messages
  useEffect(() => {
    if (!order) return;
    const unsub = base44.entities.Message.subscribe((event) => {
      if (event.data?.order_id !== order.id) return;
      if (event.type === 'create') setMessages(prev => [...prev, event.data]);
      if (event.type === 'update') setMessages(prev => prev.map(m => m.id === event.id ? event.data : m));
      if (event.type === 'delete') setMessages(prev => prev.filter(m => m.id !== event.id));
    });
    return unsub;
  }, [order]);

  // Temps réel conversation (pour détcter fermeture)
  useEffect(() => {
    if (!conversation) return;
    const unsub = base44.entities.Conversation.subscribe((event) => {
      if (event.id !== conversation.id) return;
      if (event.type === 'update') {
        setConversation(event.data);
        if (event.data.status === 'closed' && !event.data.feedback) {
          setShowFeedback(true);
        }
      }
    });
    return unsub;
  }, [conversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !order || conversation?.status === 'closed') return;
    setSending(true);
    playSendSound();
    await base44.entities.Message.create({
      order_id: order.id,
      order_number: order.order_number,
      sender_email: order.user_email,
      sender_name: order.user_name || `${order.prenom || ''} ${order.nom || ''}`.trim(),
      role: 'client',
      content: text.trim()
    });
    setText('');
    setSending(false);
  };

  const submitFeedback = async () => {
    if (!rating || !conversation) return;
    setSubmittingFeedback(true);
    await base44.entities.Conversation.update(conversation.id, {
      feedback: {
        rating,
        submitted_date: new Date().toISOString()
      }
    });
    setSubmittingFeedback(false);
    setShowFeedback(false);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !order) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.entities.Message.create({
      order_id: order.id,
      order_number: order.order_number,
      sender_email: order.user_email,
      sender_name: order.user_name || `${order.prenom || ''} ${order.nom || ''}`.trim(),
      role: 'client',
      content: `📎 Fichier envoyé : ${file.name}`,
      file_url,
      file_name: file.name
    });
    setUploading(false);
    e.target.value = '';
  };

  const statusMap = {
    pending: 'En attente',
    paid: 'En attente de validation',
    accepted: 'Acceptée',
    in_progress: 'En cours',
    delivered: 'Livré'
  };

  // Écran de recherche
  if (step === 'search' || step === 'loading') {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="border border-white/[0.06] bg-[#040404] p-10 space-y-8">
            <div>
              <p className="text-[#8B0000] font-mono text-[10px] mb-2 tracking-widest uppercase">/ / Espace Client</p>
              <h1 className="text-2xl font-space font-bold uppercase tracking-tighter text-white">
                Espace de<br /><span className="text-gray-600">collaboration</span>
              </h1>
              <p className="text-[11px] font-mono text-gray-600 mt-3 leading-relaxed">
                Entrez votre numéro de commande pour accéder à votre espace privé avec l'équipe SCAVBACK.
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-[#4A5D66] uppercase tracking-widest mb-2">
                  Numéro de commande
                </label>
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="SCB-2026-XXXX"
                  className="w-full bg-[#020202] border border-white/[0.08] text-gray-300 font-mono text-xs px-4 py-3 focus:outline-none focus:border-white/20 placeholder-gray-700"
                  autoFocus
                />
              </div>

              {searchError && (
                <p className="text-[11px] font-mono text-red-500">{searchError}</p>
              )}

              <button
                type="submit"
                disabled={searching || !searchInput.trim()}
                className="w-full bg-white text-black font-mono text-xs font-bold uppercase tracking-widest py-4 hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {searching ? 'Recherche...' : 'Accéder →'}
              </button>
            </form>

            <div className="pt-2 border-t border-white/[0.04]">
              <Link to="/Commander?tab=suivi" className="text-[10px] font-mono text-gray-700 hover:text-gray-400 transition-colors flex items-center gap-2">
                <ArrowLeft size={12} /> Retour à mes commandes
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Feedback modal
  if (showFeedback && conversation?.status === 'closed') {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center px-6 pt-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="border border-white/[0.06] bg-[#040404] p-10 space-y-8">
            <div>
              <p className="text-[#8B0000] font-mono text-[10px] mb-2 tracking-widest uppercase">/ / Avis Client</p>
              <h1 className="text-2xl font-space font-bold uppercase tracking-tighter text-white">
                Donnez votre<br /><span className="text-gray-600">avis</span>
              </h1>
              <p className="text-[11px] font-mono text-gray-600 mt-3 leading-relaxed">
                Quelle est votre avis sur la qualité du mix et du service reçu ?
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    disabled={submittingFeedback}
                    className={`text-3xl transition-all ${rating >= star ? 'text-yellow-400' : 'text-gray-700'}`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <button
                onClick={submitFeedback}
                disabled={!rating || submittingFeedback}
                className="w-full bg-white text-black font-mono text-xs font-bold uppercase tracking-widest py-4 hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submittingFeedback ? 'Envoi...' : 'Valider mon avis'}
              </button>

              <p className="text-[10px] font-mono text-gray-700 text-center mt-4">
                Vous ne pourrez pas modifier votre avis après validation.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Chat
  return (
    <div className="min-h-screen bg-[#020202] flex flex-col pt-20">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-[#020202] px-6 py-4 flex items-center gap-4">
        <button onClick={() => setStep('search')} className="text-gray-600 hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-mono text-white font-bold">#{order.order_number}</span>
            <span className="text-[10px] font-mono text-green-400">● {statusMap[order.status] || order.status}</span>
            {conversation?.status === 'closed' && (
              <span className="text-[10px] font-mono text-blue-400">🔒 Fermée</span>
            )}
          </div>
          <p className="text-[11px] font-mono text-gray-500 mt-0.5">
            {(order.services || []).join(', ')} × {order.quantity}
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[9px] font-mono text-[#8B0000] uppercase tracking-widest">SCAVBACK Audio Lab</p>
          <p className="text-[10px] font-mono text-gray-600">Espace client privé</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4 max-w-3xl mx-auto w-full">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[10px] font-mono text-[#4A5D66] uppercase tracking-widest mb-2">// Espace de collaboration</p>
            <p className="text-[11px] font-mono text-gray-600 leading-relaxed">
              Bienvenue dans votre espace privé.<br />
              Envoyez vos pistes audio, posez vos questions à l'équipe SCAVBACK.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.role === 'client';
          const isTeam = msg.role === 'team';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-[75%] space-y-1">
                <p className={`text-[9px] font-mono uppercase tracking-widest ${isMe ? 'text-right' : 'text-left'} ${isTeam ? 'text-[#8B0000]' : 'text-[#4A5D66]'}`}>
                  {isTeam ? '⚡ SCAVBACK Team' : msg.sender_name}
                </p>
                <div className={`px-4 py-3 border ${isMe ? 'bg-white/[0.05] border-white/[0.08] text-gray-200' : 'bg-[#040404] border-[#8B0000]/30 text-gray-300'}`}>
                  <p className="text-[12px] font-mono leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  {msg.file_url && (
                    <a href={msg.file_url} target="_blank" rel="noopener noreferrer"
                      className="inline-block mt-2 text-[10px] font-mono text-[#4A5D66] hover:text-white underline transition-colors">
                      ↓ {msg.file_name || 'Télécharger le fichier'}
                    </a>
                  )}
                </div>
                <p className={`text-[9px] font-mono text-gray-700 ${isMe ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.created_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  {' · '}
                  {new Date(msg.created_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                </p>
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/[0.06] bg-[#020202] px-4 md:px-8 py-4">
        {conversation?.status === 'closed' && (
          <div className="text-center text-[11px] font-mono text-gray-600 py-3 mb-2 border border-blue-900/30 bg-blue-950/20">
            Cette discussion est fermée. Vous pouvez consulter l'historique mais ne pouvez plus envoyer de messages.
          </div>
        )}
        <form onSubmit={sendMessage} className="flex gap-3 max-w-3xl mx-auto">
          <label className="flex items-center justify-center w-11 h-11 border border-white/[0.08] bg-[#040404] hover:border-white/20 transition-colors flex-shrink-0">
            <input type="file" className="hidden" onChange={handleFile} disabled={uploading || conversation?.status === 'closed'} />
            {uploading
              ? <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
              : <Paperclip size={14} className="text-gray-500" />
            }
          </label>
          <input
            type="text"
            value={text}
            onChange={e => {
              setText(e.target.value);
              playKeyboardClick();
            }}
            placeholder={conversation?.status === 'closed' ? 'Discussion fermée' : 'Votre message...'}
            disabled={conversation?.status === 'closed'}
            className="flex-1 bg-[#040404] border border-white/[0.08] text-gray-300 font-mono text-xs px-4 py-3 focus:outline-none focus:border-white/20 placeholder-gray-700 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={sending || !text.trim() || !order || conversation?.status === 'closed'}
            className="flex items-center justify-center w-11 h-11 bg-white hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={14} className="text-black" />
          </button>
        </form>
      </div>
    </div>
  );
}