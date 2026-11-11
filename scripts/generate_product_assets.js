const fs = require('fs');
const path = require('path');

// Map of product-specific SVG artwork generator
function getProductSvg(id, name, category, price) {
  // Safe color palettes based on category
  let bgGradient = ['#f8f9fa', '#e9ecef'];
  let primaryColor = '#1f2937';
  let accentColor = '#3b82f6';

  const n = name.toLowerCase();

  // Draw custom realistic vector product representation for each item
  let productVisual = '';

  if (n.includes('stove protector') || n.includes('gas burner')) {
    productVisual = `
      <!-- Aluminum stove protector ring -->
      <circle cx="200" cy="200" r="130" fill="url(#metalSilver)" stroke="#9ca3af" stroke-width="3" filter="url(#dropShadow)" />
      <circle cx="200" cy="200" r="60" fill="#f3f4f6" stroke="#6b7280" stroke-width="2" />
      <circle cx="200" cy="200" r="110" fill="none" stroke="#d1d5db" stroke-width="2" stroke-dasharray="6 4" />
      <path d="M 170 200 L 230 200 M 200 170 L 200 230" stroke="#9ca3af" stroke-width="2" />
      <text x="200" y="360" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="600" fill="#4b5563">100% HEAT RESISTANT FOIL</text>
    `;
  } else if (n.includes('food cover')) {
    productVisual = `
      <!-- Bowl with clear elastic cover -->
      <ellipse cx="200" cy="240" rx="120" ry="40" fill="#cbd5e1" opacity="0.4" filter="url(#dropShadow)" />
      <path d="M 80 200 Q 200 270 320 200 L 290 260 Q 200 300 110 260 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2" />
      <!-- Translucent cover stretched over bowl -->
      <path d="M 80 200 Q 200 120 320 200 Q 200 230 80 200 Z" fill="url(#glassGrad)" stroke="#38bdf8" stroke-width="2.5" opacity="0.85" />
      <path d="M 120 180 Q 200 140 280 180" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.7" />
      <text x="200" y="360" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="600" fill="#0284c7">ELASTIC FRESH SEAL</text>
    `;
  } else if (n.includes('vegetable cutter') || n.includes('slicer') || n.includes('peeler')) {
    productVisual = `
      <!-- Mandoline / Dicer Box -->
      <rect x="100" y="160" width="200" height="120" rx="16" fill="#ffffff" stroke="#e5e7eb" stroke-width="3" filter="url(#dropShadow)" />
      <rect x="115" y="140" width="170" height="40" rx="8" fill="#10b981" stroke="#059669" stroke-width="2" />
      <!-- Stainless steel blade grid -->
      <rect x="150" y="145" width="100" height="30" fill="url(#steelGrad)" stroke="#6b7280" stroke-width="1.5" />
      <line x1="170" y1="145" x2="170" y2="175" stroke="#9ca3af" stroke-width="1.5" />
      <line x1="190" y1="145" x2="190" y2="175" stroke="#9ca3af" stroke-width="1.5" />
      <line x1="210" y1="145" x2="210" y2="175" stroke="#9ca3af" stroke-width="1.5" />
      <line x1="230" y1="145" x2="230" y2="175" stroke="#9ca3af" stroke-width="1.5" />
      <!-- Transparent catchment base -->
      <rect x="110" y="180" width="180" height="90" rx="8" fill="url(#glassGrad)" stroke="#cbd5e1" stroke-width="1.5" />
      <!-- Diced cubes inside -->
      <rect x="130" y="230" width="16" height="16" fill="#f87171" rx="2" />
      <rect x="155" y="240" width="16" height="16" fill="#34d399" rx="2" />
      <rect x="180" y="235" width="16" height="16" fill="#fbbf24" rx="2" />
      <rect x="210" y="242" width="16" height="16" fill="#34d399" rx="2" />
      <rect x="235" y="232" width="16" height="16" fill="#f87171" rx="2" />
    `;
  } else if (n.includes('cleaning brush') || n.includes('wiper') || n.includes('mop')) {
    productVisual = `
      <!-- V-shaped cleaning brush with wiper squeegee -->
      <line x1="260" y1="90" x2="170" y2="230" stroke="#94a3b8" stroke-width="12" stroke-linecap="round" />
      <path d="M 120 250 L 220 200 L 230 220 L 130 270 Z" fill="#0284c7" filter="url(#dropShadow)" />
      <!-- Bristles -->
      <path d="M 125 270 L 115 300 M 145 260 L 135 290 M 165 250 L 155 280 M 185 240 L 175 270 M 205 230 L 195 260 M 225 220 L 215 250" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" />
      <!-- Rubber squeegee wiper blade -->
      <path d="M 130 245 L 215 200" stroke="#f59e0b" stroke-width="5" stroke-linecap="round" />
    `;
  } else if (n.includes('coffee beater') || n.includes('frother')) {
    productVisual = `
      <!-- Handheld coffee beater -->
      <rect x="180" y="90" width="40" height="130" rx="10" fill="#1e293b" stroke="#334155" stroke-width="2" filter="url(#dropShadow)" />
      <circle cx="200" cy="130" r="8" fill="#38bdf8" />
      <!-- Stainless shaft -->
      <line x1="200" y1="220" x2="200" y2="300" stroke="url(#steelGrad)" stroke-width="4" />
      <!-- Spring whisk head -->
      <ellipse cx="200" cy="305" rx="18" ry="10" fill="none" stroke="#94a3b8" stroke-width="4" />
      <ellipse cx="200" cy="305" rx="22" ry="6" fill="none" stroke="#cbd5e1" stroke-width="2" />
    `;
  } else if (n.includes('oil spray') || n.includes('dispenser bottle')) {
    productVisual = `
      <!-- Sleek Oil Dispenser Bottle -->
      <rect x="145" y="150" width="110" height="170" rx="20" fill="url(#glassGrad)" stroke="#cbd5e1" stroke-width="2.5" filter="url(#dropShadow)" />
      <!-- Golden olive oil inside -->
      <rect x="150" y="210" width="100" height="100" rx="12" fill="url(#oilGrad)" opacity="0.9" />
      <!-- Dispenser cap with trigger and spray nozzle -->
      <path d="M 165 150 L 165 110 Q 200 90 235 110 L 235 150 Z" fill="#18181b" />
      <path d="M 170 125 L 130 115 L 130 135 Z" fill="#27272a" />
      <!-- Trigger handle -->
      <path d="M 235 125 Q 265 140 260 170 Q 245 170 235 145" fill="#3f3f46" />
    `;
  } else if (n.includes('screw driver') || n.includes('tools')) {
    productVisual = `
      <!-- Aluminum screwdriver case with precision bits -->
      <rect x="130" y="100" width="140" height="220" rx="12" fill="#27272a" stroke="#52525b" stroke-width="2" filter="url(#dropShadow)" />
      <rect x="145" y="115" width="110" height="40" rx="6" fill="url(#steelGrad)" />
      <!-- Magnetic bits rows -->
      <g fill="#94a3b8">
        <rect x="148" y="170" width="18" height="26" rx="2" />
        <rect x="174" y="170" width="18" height="26" rx="2" />
        <rect x="200" y="170" width="18" height="26" rx="2" />
        <rect x="226" y="170" width="18" height="26" rx="2" />
        
        <rect x="148" y="206" width="18" height="26" rx="2" />
        <rect x="174" y="206" width="18" height="26" rx="2" />
        <rect x="200" y="206" width="18" height="26" rx="2" />
        <rect x="226" y="206" width="18" height="26" rx="2" />

        <rect x="148" y="242" width="18" height="26" rx="2" />
        <rect x="174" y="242" width="18" height="26" rx="2" />
        <rect x="200" y="242" width="18" height="26" rx="2" />
        <rect x="226" y="242" width="18" height="26" rx="2" />
      </g>
    `;
  } else if (n.includes('water cooler') || n.includes('beverage dispenser')) {
    productVisual = `
      <!-- Fridge 3.5L beverage dispenser container with spigot -->
      <rect x="110" y="130" width="180" height="150" rx="14" fill="url(#glassGrad)" stroke="#38bdf8" stroke-width="2.5" filter="url(#dropShadow)" />
      <!-- Water liquid with citrus slices -->
      <rect x="115" y="160" width="170" height="115" rx="10" fill="#e0f2fe" opacity="0.8" />
      <circle cx="150" cy="200" r="18" fill="#facc15" stroke="#eab308" stroke-width="2" />
      <circle cx="230" cy="220" r="22" fill="#facc15" stroke="#eab308" stroke-width="2" />
      <!-- Faucet spigot -->
      <path d="M 290 220 L 320 220 L 320 240 L 305 240 L 305 230 L 290 230 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="2" />
      <!-- White top lid -->
      <rect x="105" y="118" width="190" height="18" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />
    `;
  } else if (n.includes('bottle set') || n.includes('vacuum flask') || n.includes('water bottle')) {
    productVisual = `
      <!-- Motivational or thermal bottles -->
      <rect x="120" y="120" width="70" height="190" rx="20" fill="url(#bottlePinkGrad)" stroke="#f472b6" stroke-width="2" filter="url(#dropShadow)" />
      <rect x="200" y="150" width="55" height="160" rx="16" fill="url(#bottleBlueGrad)" stroke="#38bdf8" stroke-width="2" filter="url(#dropShadow)" />
      <rect x="265" y="190" width="40" height="120" rx="12" fill="url(#bottlePurpleGrad)" stroke="#c084fc" stroke-width="2" filter="url(#dropShadow)" />
      <!-- Lids -->
      <rect x="135" y="100" width="40" height="22" rx="4" fill="#18181b" />
      <rect x="210" y="132" width="35" height="20" rx="4" fill="#18181b" />
      <rect x="272" y="175" width="26" height="16" rx="4" fill="#18181b" />
    `;
  } else if (n.includes('fan') || n.includes('cooler') || n.includes('humidifier')) {
    productVisual = `
      <!-- Desktop mist fan / air cooler -->
      <rect x="120" y="120" width="160" height="180" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="3" filter="url(#dropShadow)" />
      <circle cx="200" cy="190" r="55" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />
      <!-- Fan blades -->
      <path d="M 200 190 Q 220 160 200 140 Q 190 165 200 190 Z" fill="#94a3b8" />
      <path d="M 200 190 Q 230 210 250 200 Q 225 190 200 190 Z" fill="#94a3b8" />
      <path d="M 200 190 Q 180 220 200 240 Q 210 215 200 190 Z" fill="#94a3b8" />
      <path d="M 200 190 Q 170 170 150 180 Q 175 190 200 190 Z" fill="#94a3b8" />
      <circle cx="200" cy="190" r="14" fill="#38bdf8" />
      <!-- 5 mist holes top -->
      <circle cx="160" cy="135" r="3" fill="#38bdf8" />
      <circle cx="180" cy="135" r="3" fill="#38bdf8" />
      <circle cx="200" cy="135" r="3" fill="#38bdf8" />
      <circle cx="220" cy="135" r="3" fill="#38bdf8" />
      <circle cx="240" cy="135" r="3" fill="#38bdf8" />
    `;
  } else if (n.includes('shaver') || n.includes('trimmer')) {
    productVisual = `
      <!-- Sleek electric shaver -->
      <path d="M 170 120 Q 200 100 230 120 L 225 280 Q 200 300 175 280 Z" fill="#18181b" stroke="#3f3f46" stroke-width="2" filter="url(#dropShadow)" />
      <!-- Chrome rotary head -->
      <ellipse cx="200" cy="120" rx="30" ry="18" fill="url(#steelGrad)" stroke="#9ca3af" stroke-width="2" />
      <circle cx="188" cy="120" r="8" fill="#e5e7eb" stroke="#6b7280" />
      <circle cx="212" cy="120" r="8" fill="#e5e7eb" stroke="#6b7280" />
      <!-- LED power switch -->
      <circle cx="200" cy="200" r="7" fill="#38bdf8" />
      <line x1="190" y1="240" x2="210" y2="240" stroke="#3f3f46" stroke-width="2" />
    `;
  } else if (n.includes('earbuds') || n.includes('buds')) {
    productVisual = `
      <!-- Wireless Earbuds Case & Pods -->
      <rect x="140" y="160" width="120" height="90" rx="30" fill="#ffffff" stroke="#e2e8f0" stroke-width="3" filter="url(#dropShadow)" />
      <line x1="140" y1="195" x2="260" y2="195" stroke="#cbd5e1" stroke-width="1.5" />
      <circle cx="200" cy="215" r="4" fill="#10b981" />
      <!-- Left & Right Earbuds standing -->
      <path d="M 120 170 Q 130 140 140 160 L 135 200" stroke="#18181b" stroke-width="8" stroke-linecap="round" fill="none" />
      <path d="M 280 170 Q 270 140 260 160 L 265 200" stroke="#18181b" stroke-width="8" stroke-linecap="round" fill="none" />
    `;
  } else if (n.includes('camera') || n.includes('gps') || n.includes('tracker')) {
    productVisual = `
      <!-- Compact A9 micro camera or GPS tracker -->
      <circle cx="200" cy="200" r="70" fill="#18181b" stroke="#3f3f46" stroke-width="3" filter="url(#dropShadow)" />
      <circle cx="200" cy="200" r="45" fill="#09090b" stroke="#27272a" stroke-width="2" />
      <circle cx="200" cy="200" r="25" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2" />
      <circle cx="192" cy="192" r="6" fill="#ffffff" opacity="0.6" />
      <!-- Infrared LEDs surrounding -->
      <circle cx="160" cy="180" r="3" fill="#ef4444" opacity="0.8" />
      <circle cx="240" cy="180" r="3" fill="#ef4444" opacity="0.8" />
      <circle cx="175" cy="235" r="3" fill="#ef4444" opacity="0.8" />
      <circle cx="225" cy="235" r="3" fill="#ef4444" opacity="0.8" />
    `;
  } else if (n.includes('massager') || n.includes('massage') || n.includes('gripper')) {
    productVisual = `
      <!-- 9 Ball Roller Massager / Hand Gripper -->
      <path d="M 140 160 Q 200 130 260 160 Q 270 240 200 270 Q 130 240 140 160 Z" fill="#0284c7" stroke="#0369a1" stroke-width="3" filter="url(#dropShadow)" />
      <!-- Chrome rotating rolling balls -->
      <circle cx="170" cy="175" r="14" fill="url(#steelGrad)" stroke="#475569" stroke-width="1.5" />
      <circle cx="200" cy="170" r="14" fill="url(#steelGrad)" stroke="#475569" stroke-width="1.5" />
      <circle cx="230" cy="175" r="14" fill="url(#steelGrad)" stroke="#475569" stroke-width="1.5" />
      <circle cx="165" cy="210" r="14" fill="url(#steelGrad)" stroke="#475569" stroke-width="1.5" />
      <circle cx="200" cy="205" r="14" fill="url(#steelGrad)" stroke="#475569" stroke-width="1.5" />
      <circle cx="235" cy="210" r="14" fill="url(#steelGrad)" stroke="#475569" stroke-width="1.5" />
      <circle cx="180" cy="245" r="14" fill="url(#steelGrad)" stroke="#475569" stroke-width="1.5" />
      <circle cx="220" cy="245" r="14" fill="url(#steelGrad)" stroke="#475569" stroke-width="1.5" />
    `;
  } else if (n.includes('lamp') || n.includes('light')) {
    productVisual = `
      <!-- Glowing crystal diamond lamp -->
      <path d="M 170 120 L 230 120 L 255 180 L 200 260 L 145 180 Z" fill="url(#crystalGrad)" stroke="#a855f7" stroke-width="2" opacity="0.9" filter="url(#glow)" />
      <line x1="170" y1="120" x2="200" y2="260" stroke="#e9d5ff" stroke-width="1.5" />
      <line x1="230" y1="120" x2="200" y2="260" stroke="#e9d5ff" stroke-width="1.5" />
      <line x1="145" y1="180" x2="255" y2="180" stroke="#e9d5ff" stroke-width="1.5" />
      <rect x="175" y="260" width="50" height="20" rx="4" fill="#d97706" />
    `;
  } else if (n.includes('scale')) {
    productVisual = `
      <!-- High precision kitchen or body scale -->
      <rect x="110" y="120" width="180" height="180" rx="20" fill="#ffffff" stroke="#cbd5e1" stroke-width="3" filter="url(#dropShadow)" />
      <rect x="140" y="145" width="120" height="45" rx="6" fill="#0f172a" stroke="#334155" stroke-width="2" />
      <text x="200" y="175" text-anchor="middle" font-family="monospace" font-size="20" font-weight="700" fill="#38bdf8">0.00 kg</text>
      <circle cx="200" cy="240" r="30" fill="url(#steelGrad)" stroke="#94a3b8" stroke-width="2" />
      <text x="200" y="245" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#475569">TARE</text>
    `;
  } else if (n.includes('dumpling') || n.includes('frying') || n.includes('pot') || n.includes('basket')) {
    productVisual = `
      <!-- Double Dumpling Mold or Frying Pot -->
      <ellipse cx="200" cy="240" rx="90" ry="40" fill="#cbd5e1" opacity="0.5" filter="url(#dropShadow)" />
      <path d="M 120 180 Q 200 240 280 180 L 260 250 Q 200 280 140 250 Z" fill="url(#steelGrad)" stroke="#64748b" stroke-width="2" />
      <ellipse cx="200" cy="180" rx="80" ry="25" fill="#f8fafc" stroke="#94a3b8" stroke-width="2" />
      <path d="M 280 180 L 330 170" stroke="#18181b" stroke-width="10" stroke-linecap="round" />
    `;
  } else if (n.includes('washing machine')) {
    productVisual = `
      <!-- Folding collapsible washing machine -->
      <rect x="130" y="120" width="140" height="170" rx="18" fill="#fdf4ff" stroke="#d946ef" stroke-width="2.5" filter="url(#dropShadow)" />
      <ellipse cx="200" cy="140" rx="55" ry="15" fill="#e879f9" />
      <rect x="140" y="155" width="120" height="90" rx="10" fill="#fae8ff" stroke="#f0abfc" stroke-width="2" />
      <circle cx="200" cy="200" r="30" fill="#ffffff" stroke="#c084fc" stroke-width="2" />
      <!-- Water swirling vortex -->
      <path d="M 185 200 A 15 15 0 0 1 215 200" stroke="#3b82f6" stroke-width="3" fill="none" stroke-linecap="round" />
    `;
  } else if (n.includes('bag') || n.includes('crossbody')) {
    productVisual = `
      <!-- Crossbody Sling Anti-Theft Bag -->
      <path d="M 150 130 Q 200 100 250 130 L 240 280 Q 200 295 160 280 Z" fill="#18181b" stroke="#27272a" stroke-width="3" filter="url(#dropShadow)" />
      <line x1="200" y1="130" x2="200" y2="280" stroke="#3f3f46" stroke-width="2" stroke-dasharray="4 4" />
      <rect x="180" y="180" width="40" height="20" rx="4" fill="#3f3f46" />
      <path d="M 170 120 Q 200 80 230 120" stroke="#52525b" stroke-width="6" fill="none" />
    `;
  } else {
    // Default sleek lifestyle appliance render
    productVisual = `
      <rect x="130" y="130" width="140" height="150" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="3" filter="url(#dropShadow)" />
      <circle cx="200" cy="200" r="45" fill="url(#steelGrad)" stroke="#94a3b8" stroke-width="2" />
      <path d="M 180 200 L 220 200 M 200 180 L 200 220" stroke="#475569" stroke-width="3" stroke-linecap="round" />
      <rect x="160" y="295" width="80" height="8" rx="4" fill="#cbd5e1" />
    `;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fafafa" />
      <stop offset="100%" stop-color="#f1f3f5" />
    </linearGradient>
    <linearGradient id="steelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="50%" stop-color="#d1d5db" />
      <stop offset="100%" stop-color="#9ca3af" />
    </linearGradient>
    <linearGradient id="metalSilver" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="40%" stop-color="#cbd5e1" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>
    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#e0f2fe" stop-opacity="0.5" />
    </linearGradient>
    <linearGradient id="oilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#facc15" />
      <stop offset="100%" stop-color="#eab308" />
    </linearGradient>
    <linearGradient id="bottlePinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f472b6" />
      <stop offset="100%" stop-color="#db2777" />
    </linearGradient>
    <linearGradient id="bottleBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="bottlePurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c084fc" />
      <stop offset="100%" stop-color="#9333ea" />
    </linearGradient>
    <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f3e8ff" />
      <stop offset="50%" stop-color="#d8b4fe" />
      <stop offset="100%" stop-color="#c084fc" />
    </linearGradient>
    <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.1" />
    </filter>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Clean Studio Canvas Background -->
  <rect width="400" height="400" fill="url(#bgGrad)" />

  <!-- Subtle Studio Pedestal Platform -->
  <ellipse cx="200" cy="330" rx="140" ry="24" fill="#000000" opacity="0.06" filter="url(#dropShadow)" />
  <ellipse cx="200" cy="328" rx="125" ry="18" fill="#ffffff" stroke="#e5e7eb" stroke-width="1.5" />

  <!-- Product Visual Representation -->
  <g transform="translate(0, 0)">
    ${productVisual}
  </g>

  <!-- Subtle Brand / SKU Badge -->
  <rect x="20" y="20" width="80" height="22" rx="4" fill="#ffffff" stroke="#e5e7eb" opacity="0.9" />
  <text x="60" y="35" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#6b7280">#${id}</text>
</svg>`;
}

// Generate all products from src/data/products.ts
const productsFilePath = path.join(__dirname, '../src/data/products.ts');
const content = fs.readFileSync(productsFilePath, 'utf8');

const regex = /id:\s*"(\d+)",\s*name:\s*"([^"]+)",\s*price:\s*(\d+),\s*category:\s*"([^"]+)"/g;
let match;
let count = 0;

while ((match = regex.exec(content)) !== null) {
  const [, id, name, price, category] = match;
  const productDir = path.join(__dirname, `../public/products/${id}`);
  if (!fs.existsSync(productDir)) {
    fs.mkdirSync(productDir, { recursive: true });
  }

  const svgContent = getProductSvg(id, name, category, parseInt(price, 10));
  fs.writeFileSync(path.join(productDir, 'image-1.svg'), svgContent, 'utf8');
  count++;
}

console.log(`Successfully generated ${count} product SVG assets in /public/products!`);
