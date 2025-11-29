// js/fx.js

// 1. PARTICLE SYSTEM (Combined: Optimized for Mobile + Good Looks)
export function spawnParticles(x, y, color) {
  // CHECK: Is this a mobile screen? (< 800px)
  const isMobile = window.innerWidth < 800;
  
  // Mobile gets 5 particles (Performance), Desktop gets 12 (Visuals)
  const particleCount = isMobile ? 5 : 12; 
  
  for (let i = 0; i < particleCount; i++) {
    const spark = document.createElement('div');
    spark.className = 'spark'; // Use the correct CSS class
    spark.style.setProperty('--color', color);
    
    // Adjust size based on device
    spark.style.width = isMobile ? '4px' : '6px';
    spark.style.height = isMobile ? '4px' : '6px';
    
    // Ensure positioning is correct
    spark.style.left = x + 'px';
    spark.style.top = y + 'px';
    
    document.body.appendChild(spark);

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 50 + 30; 
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;

    const animation = spark.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
    ], {
      // Mobile: 800ms (Fast cleanup to stop lag)
      // Desktop: 1200ms (Slow drift for beauty)
      duration: isMobile ? 800 : 1200, 
      easing: 'ease-out', 
    });

    animation.onfinish = () => spark.remove();
  }
}

// 2. SCREEN SHAKE (Safety Check Added)
export function triggerShake() {
  const board = document.querySelector('.board');
  if (!board) return; // Safety check
  
  board.classList.remove('shake-active');
  void board.offsetWidth; 
  board.classList.add('shake-active');
}

// 3. FLASH TINT (Robust Creation)
export function triggerFlash(color) {
  let overlay = document.getElementById('flash-overlay');
  
  // Create overlay if it doesn't exist yet
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'flash-overlay';
    // Inline styles to ensure it works even if CSS is slow to load
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9000';
    overlay.style.transition = 'opacity 0.1s ease-out';
    overlay.style.mixBlendMode = 'screen';
    document.body.appendChild(overlay);
  }
  
  overlay.style.backgroundColor = color;
  overlay.style.opacity = '0.2'; // Subtle flash
  setTimeout(() => { overlay.style.opacity = '0'; }, 100);
}

// 4. BACKGROUND PULSE
export function setBackgroundPulse(color) {
  document.body.style.boxShadow = `inset 0 0 100px ${color}22`; 
}