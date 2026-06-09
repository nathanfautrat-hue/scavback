import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Send, Paperclip, X, Lock } from 'lucide-react';
import { playKeyboardClick, playSendSound } from '@/components/SoundEffects';

export default function DiscussionModal({ conversation, onClose }) {
  const [order, setOrder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const [closing, setClosing] = useState(false);
  const bottomRef = useRef(null);

  // Charger l'admin
  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  // Charger la commande
  useEffect(() => {
    if (!conversation?.order_id) return;
    base44.entities.Order.list().then(all => {
      const found = all.find(o => o.id === conversation.order_id);
      if (found) setOrder(found);
    });
  }, [conversation]);

  // Charger les messages
  useEffect(() => {
    if (!conversation?.order_id) return;
    const loadMessages = async () => {
      const msgs = await base44.entities.Message.filter({ order_id: conversation.order_id }, 'created_date', 200);
      setMessages(msgs);
    };
    loadMessages();
  }, [conversation]);

  // Temps réel pour les messages
  useEffect(() => {
    if (!conversation?.order_id) return;
    const unsub = base44.entities.Message.subscribe((event) => {
      if (event.data?.order_id !== conversation.order_id) return;
      if (event.type === 'create') setMessages(prev => [...prev, event.data]);
      if (event.type === 'update') setMessages(prev => prev.map(m => m.id === event.id ? event.data : m));
      if (event.type === 'delete') setMessages(prev => prev.filter(m => m.id !== event.id));
    });
    return unsub;
  }, [conversation]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !conversation) return;
    setSending(true);
    playSendSound();
    await base44.entities.Message.create({
      order_id: conversation.order_id,
      order_number: conversation.order_number,
      sender_email: user.email,
      sender_name: user.full_name,
      role: 'team',
      content: text.trim()
    });
    setText('');
    setSending(false);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !conversation) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.entities.Message.create({
      order_id: conversation.order_id,
      order_number: conversation.order_number,
      sender_email: user.email,
      sender_name: user.full_name,
      role: 'team',
      content: `📎 Fichier envoyé : ${file.name}`,
      file_url,
      file_name: file.name
    });
    setUploading(false);
    e.target.value = '';
  };

  const closeConversation = async () => {
    if (!conversation) return;
    setClosing(true);
    
    // Envoyer message automatique
    await base44.entities.Message.create({
      order_id: conversation.order_id,
      order_number: conversation.order_number,
      sender_email: user.email,
      sender_name: 'SCAVBACK System',
      role: 'team',
      content: 'Cette discussion a été fermée. Votre projet a été livré avec succès. Merci d\'avoir fait confiance à SCAVBACK ! 🎵'
    });
    
    // Fermer la conversation
    await base44.entities.Conversation.update(conversation.id, { status: 'closed' });
    
    setClosing(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#020202] border border-white/[0.06] rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] font-mono text-white font-bold">
                #{conversation?.order_number}
              </span>
              <span className="text-[10px] font-mono text-gray-600">
                {messages.length} message{messages.length !== 1 ? 's' : ''}
              </span>
              {conversation?.status === 'closed' && (
                <span className="text-[10px] font-mono text-green-400 flex items-center gap-1">
                  <Lock size={10} /> Fermée
                </span>
              )}
            </div>
            <p className="text-[10px] font-mono text-gray-500">
              {conversation?.client_name} • {conversation?.client_email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {conversation?.status !== 'closed' && (
              <button
                onClick={closeConversation}
                disabled={closing}
                className="text-[10px] font-mono bg-green-600 hover:bg-green-700 text-white px-3 py-2 transition-colors disabled:opacity-40 flex-shrink-0"
              >
                {closing ? '...' : 'Fermer'}
              </button>
            )}
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-[10px] font-mono text-gray-600">
                Aucun message pour le moment
              </p>
            </div>
          )}

          {messages.map((msg) => {
            const isTeam = msg.role === 'team';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isTeam ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-[70%] space-y-1">
                  <p className={`text-[9px] font-mono uppercase tracking-widest ${isTeam ? 'text-right text-[#8B0000]' : 'text-left text-[#4A5D66]'}`}>
                    {isTeam ? '⚡ SCAVBACK Team' : msg.sender_name}
                  </p>
                  <div className={`px-4 py-3 border ${isTeam ? 'bg-white/[0.05] border-white/[0.08]' : 'bg-[#040404] border-[#8B0000]/30'} text-gray-300`}>
                    <p className="text-[12px] font-mono leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                    {msg.file_url && (
                      <a
                        href={msg.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-[10px] font-mono text-[#4A5D66] hover:text-white underline transition-colors"
                      >
                        ↓ {msg.file_name || 'Télécharger'}
                      </a>
                    )}
                  </div>
                  <p className={`text-[9px] font-mono text-gray-700 ${isTeam ? 'text-right' : 'text-left'}`}>
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
        <div className="border-t border-white/[0.06] px-6 py-4 flex-shrink-0">
          {conversation?.status === 'closed' && (
            <div className="text-center text-[11px] font-mono text-gray-600 py-2">
              Cette discussion est fermée. L'admin seul peut poster.
            </div>
          )}
          <form onSubmit={sendMessage} className="flex gap-3">
            <label className="flex items-center justify-center w-10 h-10 border border-white/[0.08] bg-[#040404] hover:border-white/20 transition-colors flex-shrink-0">
              <input type="file" className="hidden" onChange={handleFile} disabled={uploading} />
              {uploading ? (
                <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Paperclip size={14} className="text-gray-500" />
              )}
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                playKeyboardClick();
              }}
              placeholder="Répondre..."
              className="flex-1 bg-[#040404] border border-white/[0.08] text-gray-300 font-mono text-xs px-4 py-3 focus:outline-none focus:border-white/20 placeholder-gray-700"
            />
            <button
              type="submit"
              disabled={sending || !text.trim()}
              className="flex items-center justify-center w-10 h-10 bg-white hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={14} className="text-black" />
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}