// js/fx.js

// 1. SETUP FX LAYER
const fxLayer = document.createElement("div");
fxLayer.id = "fxLayer";
Object.assign(fxLayer.style, {
    position: "fixed", top: "0", left: "0",
    width: "100%", height: "100%",
    pointerEvents: "none", zIndex: "9999", overflow: "hidden"
});
document.body.appendChild(fxLayer);

// 2. SETUP FLASH OVERLAY
const flashOverlay = document.createElement("div");
flashOverlay.id = "flash-overlay";
Object.assign(flashOverlay.style, {
    position: "fixed", top: "0", left: "0",
    width: "100vw", height: "100vh",
    pointerEvents: "none", zIndex: "9000",
    backgroundColor: "white", opacity: "0",
    transition: "opacity 0.1s ease-out",
    mixBlendMode: "overlay"
});
document.body.appendChild(flashOverlay);

// -------------------------------------------------------------
// PARTICLE POOL
// -------------------------------------------------------------
const MAX_PARTICLES = 80;
const particlePool = [];

function getParticle() {
    if (particlePool.length > 0) return particlePool.pop();
    const p = document.createElement("div");
    // Self-contained styles so they work even if CSS is missing
    Object.assign(p.style, {
        position: "absolute",
        width: "8px", height: "8px",
        borderRadius: "50%",
        pointerEvents: "none"
    });
    return p;
}

function releaseParticle(p) {
    p.remove();
    if (particlePool.length < MAX_PARTICLES) {
        particlePool.push(p);
    }
}

// -------------------------------------------------------------
// EXPORTED FUNCTIONS
// -------------------------------------------------------------

export function spawnParticles(x, y, color) {
    const count = 12; 
    for (let i = 0; i < count; i++) {
        const p = getParticle();
        fxLayer.appendChild(p);
        
        p.style.backgroundColor = color;
        p.style.boxShadow = `0 0 10px ${color}`;
        p.style.left = x + "px";
        p.style.top = y + "px";
        p.style.transform = "scale(1)";
        p.style.opacity = "1";
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 30 + Math.random() * 50; 
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        const duration = 400 + Math.random() * 200;

        const anim = p.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        });

        anim.onfinish = () => releaseParticle(p);
    }
}

export function triggerShake() {
    const board = document.querySelector('.board');
    if (!board) return;
    board.classList.remove('shake-active');
    void board.offsetWidth; 
    board.classList.add('shake-active');
    setTimeout(() => board.classList.remove('shake-active'), 400);
}

export function triggerFlash(color = "white") {
    flashOverlay.style.backgroundColor = color;
    flashOverlay.style.opacity = "0.4";
    setTimeout(() => flashOverlay.style.opacity = "0", 100);
}

export function setBackgroundPulse(color) {
    document.documentElement.style.setProperty('--glow', color);
}

// --- THIS IS THE MISSING FUNCTION CAUSING THE CRASH ---
export function triggerChainFever() {
    const text = document.getElementById('feverText');
    const body = document.body;

    if (text) {
        text.classList.remove('active');
        void text.offsetWidth; 
        text.classList.add('active');
    }

    body.classList.add('fever-mode');
    triggerShake(); 

    setTimeout(() => {
        body.classList.remove('fever-mode');
    }, 2000);
}