// js/sound.js
const sounds = {
  click: new Audio("sounds/click.mp3"),
  explode: new Audio("sounds/explode.mp3"),
  win: new Audio("sounds/win.mp3")
};

// Set Volume
Object.values(sounds).forEach(s => s.volume = 0.5);

// New Mute State
let isMuted = false;

export function toggleMute() {
    isMuted = !isMuted;
    return isMuted; // Returns true if muted, false if sound is on
}

export function playSound(name) {
  if (isMuted) return; // Stop if muted
  
  const src = sounds[name];
  if (!src) return;
  
  const clone = src.cloneNode();
  clone.volume = src.volume;
  clone.play().catch(() => { /* Ignore auto-play errors */ });
}