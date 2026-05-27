import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TerminalTooltip from '../components/TerminalTooltip';

const MatrixRain = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 opacity-5 text-[#00ff41] text-xs font-mono leading-none whitespace-pre">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            {Math.random().toString(36).substring(2, 15)}
          </div>
        ))}
      </div>
    </div>
  );
};

const GlitchText = ({ text }) => {
  return (
    <div>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
      <div style={{
        fontFamily: 'Courier New, monospace',
        fontWeight: 900,
        color: '#00ff41',
        textShadow: '0 0 10px #00ff41, 0 0 20px #00ff41',
        position: 'relative',
        display: 'inline-block'
      }}>
        <span style={{ fontSize: '1rem', letterSpacing: '0.4em' }}>C:\SCAVBACK\ARTISTS&gt; </span><span style={{ fontSize: '3.5rem', color: 'white', letterSpacing: '0.4em' }}>{text}</span><span style={{ fontSize: '3.5rem', animation: 'blink 1s infinite', color: '#00ff41' }}>█</span>
      </div>
    </div>
  );
};

export default function Jumistx() {
  const navigate = useNavigate();
  const [bioVisible, setBioVisible] = useState(false);

  const songs = [
    { title: '1,2,3 & 4.', duration: '2:02' },
    { title: 'SAND-TEST', duration: '2:30' },
    { title: 'JETPACK', duration: '2:04' },
    { title: 'LIBIDO!', duration: '2:41' },
    { title: 'HPP', duration: '1:58' },
    { title: 'BLEM!', duration: '2:19' },
    { title: 'MIKI.', duration: '2:00' },
    { title: 'Brume', duration: '2:49' },
    { title: 'WATCH', duration: '2:12' },
    { title: 'Run Away.', duration: '3:00' },
    { title: 'Task.', duration: '1:30' },
  ];

  const album = [
    { title: 'La Planque.', feat: 'Lapua338', duration: '2:42' },
    { title: 'JETPACK', feat: 'Lapua338', duration: '2:04' },
    { title: 'SAND-TEST', feat: 'Lapua338', duration: '2:30' },
    { title: 'MIKI.2', feat: 'Lapua338', duration: '2:06' },
    { title: 'LOLLIPOP', feat: 'Lapua338', duration: '2:22' },
    { title: 'HPP', feat: 'Lapua338', duration: '1:58' },
    { title: 'NYAN CAT', feat: 'Lapua338', duration: '2:47' },
    { title: 'FLAIR', feat: 'Lapua338', duration: '2:53' },
  ];

  const platforms = [
    { name: 'Spotify', url: 'https://open.spotify.com/intl-fr/artist/2CN7bJfF3enS70MviDKhxe' },
    { name: 'Deezer', url: 'https://www.deezer.com/fr/artist/207927537' },
    { name: 'Apple Music', url: 'https://music.apple.com/fr/artist/jumistx/1680236397' },
    { name: 'YouTube', url: 'https://www.youtube.com/@SCAVBACK' },
  ];

  const socials = [
    { name: 'Instagram', url: 'https://www.instagram.com/jumistx' },
    { name: 'Twitter/X', url: 'https://x.com/jumistx' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@jumistx' },
  ];

  return (
    <div className="relative min-h-screen bg-[#000000] text-white font-mono">
      <MatrixRain />
      <div className="scanlines fixed inset-0 pointer-events-none z-40"></div>
      
      <div className="relative z-10">
        {/* HEADER */}
        <section className="pt-24 pb-12 px-6 border-b border-[#00ff41]/20">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
            <style>{`
              @keyframes imgGlitch {
                0%, 100% { filter: none; }
                25% { filter: drop-shadow(-2px 0 0 #00ff41) drop-shadow(2px 0 0 #cc0000); }
                50% { filter: none; }
                75% { filter: drop-shadow(2px 0 0 #00ff41) drop-shadow(-2px 0 0 #cc0000); }
              }
              
              .glitch-img {
                animation: imgGlitch 3s infinite;
                border: 2px solid #00ff41;
              }

              .cmd-window {
                background: #0a0a0a;
                border: 1px solid #333;
                box-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
                max-width: 700px;
                margin: 0 auto;
              }

              .cmd-titlebar {
                background: #1a1a1a;
                border-bottom: 1px solid #333;
                padding: 6px 8px;
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: 'Segoe UI', sans-serif;
                font-size: 12px;
                color: #999;
              }

              .cmd-buttons {
                display: flex;
                gap: 6px;
              }

              .cmd-button {
                width: 12px;
                height: 12px;
                border-radius: 50%;
              }

              .cmd-body {
                padding: 16px;
                color: #00ff41;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.6;
              }

              .cmd-prompt {
                margin: 12px 0;
              }

              .cmd-line {
                margin: 4px 0;
              }
            `}</style>
            
            <TerminalTooltip text="> IDENTITÉ : CLASSIFIÉ" position="right">
              <img
                src="https://ugc.production.linktr.ee/cdb5e67d-33f4-414e-8fc9-90aa193f131e_Drippppp-3.19.1.jpeg"
                alt="Jumistx"
                className="glitch-img w-48 h-48 rounded-sm object-cover shadow-2xl cursor-help"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
              />
            </TerminalTooltip>

            <div className="cmd-window w-full">
              <div className="cmd-titlebar">
                <div className="cmd-buttons">
                  <div className="cmd-button" style={{ backgroundColor: '#cc0000' }}></div>
                  <div className="cmd-button" style={{ backgroundColor: '#ff9500' }}></div>
                  <div className="cmd-button" style={{ backgroundColor: '#00ff41' }}></div>
                </div>
                <span>C:\SCAVBACK\ARTISTS — cmd.exe</span>
              </div>
              <div className="cmd-body">
                <div className="cmd-prompt">
                  <TerminalTooltip text="> ENTITÉ DÉTECTÉE — MENACE NIVEAU : INCONNU" position="top">
                    <div className="cursor-help inline-block">
                      <GlitchText text="JUMISTX" />
                    </div>
                  </TerminalTooltip>
                </div>
                
                <div style={{ margin: '12px 0' }}></div>
                
                <div className="cmd-line"><span style={{ color: '#cc0000' }}>&gt;</span> ARTISTE_IDENTIFIÉ : JUMISTX</div>
                <TerminalTooltip text="> GENRE NON CLASSIFIABLE. SYSTÈME PERTURBÉ." position="right">
                  <div className="cmd-line cursor-help"><span style={{ color: '#cc0000' }}>&gt;</span> STYLE : JERK_HOODTRAP / TRAP</div>
                </TerminalTooltip>
                <TerminalTooltip text="> LOCALISATION INTROUVABLE. AUCUNE DONNÉE DISPONIBLE." position="right">
                  <div className="cmd-line cursor-help"><span style={{ color: '#cc0000' }}>&gt;</span> ORIGINE : [CRYPTÉ]</div>
                </TerminalTooltip>
                <div className="cmd-line"><span style={{ color: '#cc0000' }}>&gt;</span> STATUT : ACTIF</div>
              </div>
            </div>
          </div>
        </section>

        {/* BIO */}
        <section className="py-12 px-6 border-b border-[#00ff41]/20">
          <div className="max-w-4xl mx-auto">
            <TerminalTooltip text="> FICHIER PARTIELLEMENT CORROMPU. LECTURE EN COURS..." position="right">
              <div className="text-[#00ff41] font-mono text-sm mb-8 cursor-help inline-block">
                <span className="text-[#cc0000]">$</span> cat bio.txt
              </div>
            </TerminalTooltip>
            
            <div className="border-l-4 border-[#00ff41] bg-[#0a0a0a] p-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 font-mono text-xs text-[#00ff41] pointer-events-none overflow-hidden">
                <div>const bio = "enigmatic";</div>
                <div>let darkness = true;</div>
                <div>while(listening) &#123;</div>
                <div>&nbsp;&nbsp;soul.reveal();</div>
              </div>
              
              <p className="text-gray-300 leading-8 space-y-4 mb-6 relative z-10 text-sm">
                <span className="block">
                  Jumistx n'est pas un artiste comme les autres. Derrière ce nom se cache un personnage énigmatique, sans origine connue, sans visage défini. Sa musique — quelque part entre Jerk, Hood Trap et Trap — est le reflet d'un univers intérieur sombre et complexe, où chaque son cache quelque chose de plus profond.
                </span>
                <span className="block">
                  Chaque titre est une pièce. Chaque projet, un fragment d'une histoire bien plus grande — remplie de métaphores, de symboles et de doubles sens que seuls les plus attentifs sauront décrypter.
                </span>
                <span className="block">
                  Derrière Jumistx se cache une dualité. Une guerre intérieure. Deux forces qui s'affrontent en silence.
                </span>
                <TerminalTooltip text="> NIVEAU DE PROFONDEUR : INFINI. CONTINUEZ À CHERCHER." position="right">
                  <span className="block font-bold text-[#cc0000] cursor-help">
                    Ce que tu entends n'est que la surface.
                  </span>
                </TerminalTooltip>
                <span className="block">
                  Un univers entier attend d'être révélé.
                </span>
              </p>
            </div>

            <div className="text-[#cc0000] font-mono text-xs mt-6">— À suivre <span className="cursor-blink">█</span></div>
          </div>
        </section>

        {/* DISCOGRAPHIE */}
        <section className="py-12 px-6 border-b border-[#00ff41]/20">
          <div className="max-w-4xl mx-auto">
            <TerminalTooltip text="> 8 FICHIERS DÉTECTÉS. 1 DOSSIER CRYPTÉ." position="right">
              <div className="text-[#00ff41] font-mono text-sm mb-8 cursor-help inline-block">
                <span className="text-[#cc0000]">$</span> ls discographie/
              </div>
            </TerminalTooltip>

            {/* Album */}
            <div className="mb-10">
              <div className="text-[#ff00aa] text-xs font-mono mb-4">
                <span className="bg-white text-black font-bold px-2 py-0.5 mr-2">[ALBUM]</span>
                J.Horton_Conway/ — 2026 — 8 tracks
              </div>
              <div className="bg-[#0a0a0a] border border-[#ff00aa] p-4 space-y-2">
                {/* Cover placeholder */}
                <div className="flex gap-6 mb-4 items-start">
                  <img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699ee2f7ff8ae9f68639cff6/d5a8f43a5_covertest-3.jpg"
                    alt="J.Horton Conway Cover"
                    className="flex-shrink-0 object-cover border-2 border-[#ff00aa]"
                    style={{ width: 200, height: 200 }}
                  />
                  <div className="flex-1 space-y-2 pt-2">
                    {album.map((song, idx) => (
                      <TerminalTooltip key={idx} text="> LECTURE AUTORISÉE — CLIQUEZ POUR ACCÉDER" position="right">
                        <motion.div
                          whileHover={{ backgroundColor: 'rgba(255, 0, 170, 0.1)' }}
                          className="flex justify-between items-center cursor-pointer font-mono text-xs p-2 transition-colors group"
                        >
                          <span className="text-[#ff00aa] w-5 text-center">{idx + 1}.</span>
                          <span className="text-white flex-1 ml-4 truncate">
                            {song.title}
                          </span>
                          <span className="text-[#ff00aa] ml-4">{song.duration}</span>
                        </motion.div>
                      </TerminalTooltip>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Singles */}
            <div>
              <div className="text-[#00ff41] text-xs font-mono mb-4 mt-8">
                <span className="border border-[#00ff41] text-[#00ff41] font-bold px-2 py-0.5 mr-2">[SINGLES]</span>
                {songs.length} tracks
              </div>
              <div className="bg-[#0a0a0a] border border-dashed border-[#00ff41] p-4 space-y-2">
                {songs.map((song, idx) => (
                  <TerminalTooltip key={idx} text="> LECTURE AUTORISÉE — CLIQUEZ POUR ACCÉDER" position="right">
                    <motion.div
                      whileHover={{ backgroundColor: 'rgba(255, 0, 170, 0.1)' }}
                      className="flex justify-between items-center cursor-pointer font-mono text-xs p-2 transition-colors group"
                    >
                      <span className="text-[#00ff41] w-5 text-center">{idx + 1}.</span>
                      <span className="text-gray-400 flex-1 ml-4 truncate">{song.title}</span>
                      <span className="text-[#00ff41] ml-4">{song.duration}</span>
                    </motion.div>
                  </TerminalTooltip>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PLATEFORMES */}
        <section className="py-12 px-6 border-b border-[#00ff41]/20">
          <div className="max-w-4xl mx-auto">
            <TerminalTooltip text="> CONNEXION ÉTABLIE — CHOISISSEZ VOTRE PLATEFORME" position="right">
              <div className="text-[#00ff41] font-mono text-sm mb-8 cursor-help inline-block">
                <span className="text-[#cc0000]">$</span> connect --platforms
              </div>
            </TerminalTooltip>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {platforms.map((platform, idx) => (
                <motion.a
                  key={idx}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ backgroundColor: 'rgba(255, 0, 170, 0.1)' }}
                  className="border-2 border-[#00ff41] bg-[#0a0a0a] p-4 text-center transition-all group"
                >
                  <div className="text-[#00ff41] font-mono text-xs font-bold">{platform.name}</div>
                  <div className="text-gray-400 text-[10px] mt-2 group-hover:text-[#00ff41]">→ CONNECT</div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* RÉSEAUX */}
        <section className="py-12 px-6 border-b border-[#00ff41]/20">
          <div className="max-w-4xl mx-auto">
            <TerminalTooltip text="> RÉSEAUX IDENTIFIÉS — SURVEILLANCE ACTIVE" position="right">
              <div className="text-[#00ff41] font-mono text-sm mb-8 cursor-help inline-block">
                <span className="text-[#cc0000]">$</span> locate --social
              </div>
            </TerminalTooltip>

            <div className="flex flex-col sm:flex-row gap-4">
              {socials.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ borderColor: '#ffffff', color: '#ffffff' }}
                  className="flex-1 border-2 border-[#00ff41] bg-[#0a0a0a] px-6 py-4 text-center font-mono text-sm transition-all text-[#00ff41]"
                >
                  &gt; {social.name}
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-8 px-6 border-t border-[#00ff41]/20 text-center">
          <TerminalTooltip text="> VOUS N'AURIEZ PAS DÛ LIRE JUSQU'ICI." position="top">
            <div className="text-[#00ff41] font-mono text-xs cursor-help inline-block">
              &gt; SESSION_TERMINÉE — © 2026 SCAVBACK <span className="cursor-blink">█</span>
            </div>
          </TerminalTooltip>
        </footer>
      </div>
    </div>
  );
}