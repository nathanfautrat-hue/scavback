import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Send, Paperclip, ArrowLeft } from 'lucide-react';
import { playKeyboardClick, playSendSound } from '@/components/SoundEffects';

export default function Discussion() {
  const params = new URLSearchParams(window.location.search);
  const orderIdFromUrl = params.get('orderId');

  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef(null);

  // Charger user (ADMIN ONLY)
  useEffect(() => {
    base44.auth.me().then(u => {
      if (u?.role !== 'admin') {
        window.location.href = '/Commander?tab=suivi';
      } else {
        setUser(u);
      }
    }).catch(() => {
      window.location.href = '/Commander?tab=suivi';
    });
  }, []);



  const loadMessages = async (ordId) => {
    const msgs = await base44.entities.Message.filter({ order_id: ordId }, 'created_date', 200);
    setMessages(msgs);
  };

  const createConversation = async (ord) => {
    // Vérifier si conversation existe déjà
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



  // Temps réel
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getSenderInfo = () => {
    return {
      email: user?.email,
      name: user?.full_name,
      role: 'team'
    };
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !order) return;
    setSending(true);
    const sender = getSenderInfo();
    playSendSound();
    await base44.entities.Message.create({
      order_id: order.id,
      order_number: order.order_number,
      sender_email: sender.email,
      sender_name: sender.name,
      role: sender.role,
      content: text.trim()
    });
    setText('');
    setSending(false);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !order) return;
    setUploading(true);
    const sender = getSenderInfo();
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.entities.Message.create({
      order_id: order.id,
      order_number: order.order_number,
      sender_email: sender.email,
      sender_name: sender.name,
      role: sender.role,
      content: `📎 Fichier envoyé : ${file.name}`,
      file_url,
      file_name: file.name
    });
    setUploading(false);
    e.target.value = '';
  };



  return (
     <div className="min-h-screen bg-[#020202] flex flex-col pt-20">
       {/* Header */}
       <div className="border-b border-white/[0.06] bg-[#020202] px-6 py-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-mono text-white font-bold">#{order.order_number}</span>
            <span className="text-[10px] font-mono text-green-400">● {statusMap[order.status] || order.status}</span>
          </div>
          <p className="text-[11px] font-mono text-gray-500 mt-0.5">
            {(order.services || []).join(', ')} × {order.quantity}
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[9px] font-mono text-[#8B0000] uppercase tracking-widest">SCAVBACK Audio Lab</p>
          <p className="text-[10px] font-mono text-gray-600">Admin - Discussion</p>
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
          const isMe = msg.sender_email === user?.email;
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
        <form onSubmit={sendMessage} className="flex gap-3 max-w-3xl mx-auto">
          <label className="flex items-center justify-center w-11 h-11 border border-white/[0.08] bg-[#040404] hover:border-white/20 transition-colors flex-shrink-0">
            <input type="file" className="hidden" onChange={handleFile} disabled={uploading} />
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
            placeholder="Votre message..."
            className="flex-1 bg-[#040404] border border-white/[0.08] text-gray-300 font-mono text-xs px-4 py-3 focus:outline-none focus:border-white/20 placeholder-gray-700"
          />
          <button
            type="submit"
            disabled={sending || !text.trim() || !order}
            className="flex items-center justify-center w-11 h-11 bg-white hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={14} className="text-black" />
          </button>
        </form>
      </div>
    </div>
  );
}