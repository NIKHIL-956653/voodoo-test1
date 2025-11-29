// js/sound.js
const sounds = {
  click: new Audio("sounds/click.mp3"),
  explode: new Audio("sounds/explode.mp3"),
  win: new Audio("sounds/win.mp3")
};
Object.values(sounds).forEach(s => s.volume = 0.5);

export function playSound(name) {
  const src = sounds[name];
  if (!src) return;
  const clone = src.cloneNode();
  clone.volume = src.volume;
  clone.play().catch(() => { /* Ignore auto-play errors */ });
}