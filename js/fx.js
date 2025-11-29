// js/fx.js

// 1. PARTICLE SYSTEM
export function spawnParticles(x, y, color) {
  const particleCount = 12; // Increased count slightly for better look
  const boardEl = document.querySelector('.board');
  
  for (let i = 0; i < particleCount; i++) {
    const spark = document.createElement('div');
    spark.className = 'spark';
    spark.style.setProperty('--color', color);
    
    spark.style.left = x + 'px';
    spark.style.top = y + 'px';
    
    document.body.appendChild(spark);

    const angle = Math.random() * Math.PI * 2;
    // Reduced velocity range slightly so they don't fly off screen too fast
    const velocity = Math.random() * 50 + 30; 
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;

    const animation = spark.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
    ], {
      // CHANGED: Increased from 600 to 1200 (Slower, smoother)
      duration: 1200, 
      // CHANGED: Easing 'ease-out' makes them start fast and slow down gently
      easing: 'ease-out', 
    });

    animation.onfinish = () => spark.remove();
  }
}

// 2. SCREEN SHAKE
export function triggerShake() {
  const board = document.querySelector('.board');
  board.classList.remove('shake-active');
  void board.offsetWidth; 
  board.classList.add('shake-active');
}

// 3. FLASH TINT
export function triggerFlash(color) {
  let overlay = document.getElementById('flash-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'flash-overlay';
    document.body.appendChild(overlay);
  }
  overlay.style.backgroundColor = color;
  overlay.style.opacity = '0.3'; 
  setTimeout(() => { overlay.style.opacity = '0'; }, 100);
}

// 4. BACKGROUND PULSE
export function setBackgroundPulse(color) {
  document.body.style.boxShadow = `inset 0 0 100px ${color}22`; 
}