// Utilitaire pour générer des effets sonores synthétiques
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

export const playKeyboardClick = () => {
  const now = audioContext.currentTime;
  
  // Créer un son court et cliquant (clavier mécanique)
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  // Son court et grave
  osc.frequency.setValueAtTime(120, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);
  
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
  
  osc.start(now);
  osc.stop(now + 0.05);
};

export const playSendSound = () => {
  const now = audioContext.currentTime;
  
  // Son de confirmation (deux notes courtes)
  const playNote = (frequency, startTime, duration) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.setValueAtTime(frequency, startTime);
    gain.gain.setValueAtTime(0.15, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  };
  
  // Deux notes : la (440) puis do (523)
  playNote(440, now, 0.08);
  playNote(523, now + 0.1, 0.08);
};