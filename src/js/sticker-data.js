const STICKERS = [
  { id: 'paimon-wave', label: 'Paimon Wave', emoji: '👋', tint: '#f6d27f' },
  { id: 'venti-sip', label: 'Venti Sip', emoji: '🍷', tint: '#98c8ff' },
  { id: 'xiao-shh', label: 'Xiao Shh', emoji: '🤫', tint: '#91d7c7' },
  { id: 'aether-yes', label: 'Aether Yes', emoji: '✨', tint: '#ffd7a6' },
  { id: 'lumine-heart', label: 'Lumine Heart', emoji: '💛', tint: '#ffdfb3' }
];

export function getStickerDefs() {
  return STICKERS.slice();
}

export function getStickerById(stickerId) {
  return STICKERS.find(sticker => sticker.id === stickerId) || STICKERS[0];
}

export function makeStickerSvgDataUrl(sticker) {
  const safeSticker = sticker || STICKERS[0];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${safeSticker.tint}"/>
          <stop offset="100%" stop-color="#fff6ea"/>
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="96" fill="url(#bg)"/>
      <circle cx="256" cy="232" r="136" fill="rgba(255,255,255,0.5)"/>
      <text x="256" y="270" font-size="128" text-anchor="middle" dominant-baseline="middle">${safeSticker.emoji}</text>
      <text x="256" y="394" font-size="38" text-anchor="middle" fill="#3d4655" font-family="Arial, sans-serif">${safeSticker.label}</text>
    </svg>
  `.trim();
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
