// Original vector illustrations for the AL PASHA perfume catalog (drawn for this project).
// Rendered as trusted inline SVG markup inside a fixed-size frame.

const svg = (inner) => `<svg viewBox="0 0 160 130" class="w-full h-full" role="img" aria-hidden="true" focusable="false">${inner}</svg>`;

const defs = (id, from, to) => `
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>`;

const label = (x, y, text = 'AL PASHA', color = '#3d0d22', size = 6) =>
  `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="900" font-family="Cairo" letter-spacing="0.6">${text}</text>`;

export const ART = {
  royalOud: svg(`
    ${defs('apRoyal', '#7a2144', '#3d0d22')}
    <ellipse cx="80" cy="116" rx="42" ry="5" fill="#3d0d22" opacity="0.15"/>
    <rect x="64" y="16" width="32" height="14" rx="4" fill="#e3ac2d"/>
    <rect x="70" y="28" width="20" height="9" fill="#b76d16"/>
    <path d="M56 40 H104 L110 106 Q110 114 102 114 H58 Q50 114 50 106 Z" fill="url(#apRoyal)" stroke="#e3ac2d" stroke-width="2"/>
    <rect x="62" y="54" width="36" height="38" rx="4" fill="#f9efc9" opacity="0.92"/>
    ${label(66, 70, 'AL PASHA', '#3d0d22', 5.5)}
    ${label(68, 80, 'ROYAL OUD', '#93244e', 5)}
    <path d="M50 96 C62 90, 98 90, 110 96" stroke="#e3ac2d" stroke-width="1.5" fill="none" opacity="0.6"/>
    <path d="M34 112 L44 96 L52 110 Z" fill="#6b3a1e"/>
    <path d="M116 112 L124 98 L134 112 Z" fill="#8a4b24"/>
    <circle cx="126" cy="104" r="2" fill="#e3ac2d" opacity="0.6"/>
  `),

  rose: svg(`
    ${defs('apRose', '#f6cfdb', '#cd4a78')}
    <ellipse cx="80" cy="116" rx="40" ry="5" fill="#3d0d22" opacity="0.12"/>
    <rect x="66" y="16" width="28" height="13" rx="4" fill="#e3ac2d"/>
    <rect x="71" y="27" width="18" height="8" fill="#b76d16"/>
    <path d="M58 38 H102 L108 106 Q108 114 100 114 H60 Q52 114 52 106 Z" fill="url(#apRose)" stroke="#93244e" stroke-width="1.8"/>
    <rect x="64" y="52" width="32" height="34" rx="4" fill="#ffffff" opacity="0.85"/>
    ${label(67, 67, 'AL PASHA', '#3d0d22', 5.5)}
    ${label(71, 77, 'TAIF ROSE', '#93244e', 5)}
    <g transform="translate(118 84)">
      <circle cx="0" cy="0" r="10" fill="#cd4a78"/>
      <circle cx="0" cy="0" r="6" fill="#e0749a"/>
      <circle cx="0" cy="0" r="2.5" fill="#f6cfdb"/>
      <path d="M0 10 L0 24" stroke="#4d7c3a" stroke-width="2.4"/>
      <path d="M0 17 C-8 15, -10 9, -10 9 C-3 9, 0 13, 0 17 Z" fill="#5f8f45"/>
    </g>
  `),

  musk: svg(`
    ${defs('apMusk', '#ffffff', '#eadfd6')}
    <ellipse cx="80" cy="116" rx="38" ry="5" fill="#3d0d22" opacity="0.1"/>
    <rect x="68" y="18" width="24" height="12" rx="4" fill="#d8c8b8"/>
    <rect x="73" y="28" width="14" height="8" fill="#c3b09e"/>
    <path d="M60 38 H100 L106 106 Q106 114 98 114 H62 Q54 114 54 106 Z" fill="url(#apMusk)" stroke="#c3b09e" stroke-width="1.6"/>
    <rect x="66" y="54" width="28" height="30" rx="4" fill="#faf7f2" stroke="#e3ac2d" stroke-width="1"/>
    ${label(68, 68, 'AL PASHA', '#3d0d22', 5)}
    ${label(69, 78, 'WHITE MUSK', '#93244e', 4.4)}
    <g opacity="0.6" fill="#e3ac2d">
      <circle cx="124" cy="46" r="2"/>
      <circle cx="132" cy="60" r="1.4"/>
      <circle cx="120" cy="72" r="1.2"/>
      <circle cx="30" cy="54" r="1.4"/>
      <circle cx="38" cy="70" r="2"/>
    </g>
  `),

  amber: svg(`
    ${defs('apAmber', '#f2dd8f', '#b76d16')}
    <ellipse cx="80" cy="116" rx="40" ry="5" fill="#3d0d22" opacity="0.12"/>
    <rect x="64" y="15" width="32" height="14" rx="5" fill="#3d0d22"/>
    <rect x="70" y="27" width="20" height="8" fill="#681f3c"/>
    <path d="M56 38 H104 L110 106 Q110 114 102 114 H58 Q50 114 50 106 Z" fill="url(#apAmber)" stroke="#924e15" stroke-width="1.8"/>
    <rect x="62" y="54" width="36" height="32" rx="4" fill="#3d0d22" opacity="0.85"/>
    ${label(66, 68, 'AL PASHA', '#f2dd8f', 5.5)}
    ${label(68, 78, 'GOLDEN AMBER', '#eac455', 4.4)}
    <path d="M50 96 C64 90, 96 90, 110 96" stroke="#3d0d22" stroke-width="1.4" fill="none" opacity="0.35"/>
    <g transform="translate(126 88)" fill="#e3ac2d" opacity="0.8">
      <path d="M0 0 L6 10 L-6 10 Z"/>
      <path d="M0 14 L7 26 L-7 26 Z"/>
    </g>
  `),

  noir: svg(`
    ${defs('apNoir', '#2a2230', '#0d0a10')}
    <ellipse cx="80" cy="116" rx="40" ry="5" fill="#000" opacity="0.18"/>
    <rect x="64" y="14" width="32" height="14" rx="3" fill="#e3ac2d"/>
    <rect x="70" y="26" width="20" height="8" fill="#924e15"/>
    <path d="M56 37 H104 L110 106 Q110 114 102 114 H58 Q50 114 50 106 Z" fill="url(#apNoir)" stroke="#e3ac2d" stroke-width="1.6"/>
    <rect x="62" y="52" width="36" height="36" rx="3" fill="none" stroke="#e3ac2d" stroke-width="1"/>
    ${label(66, 67, 'AL PASHA', '#eac455', 5.5)}
    ${label(70, 78, 'BLACK NOIR', '#f2dd8f', 4.6)}
    <line x1="50" y1="96" x2="110" y2="96" stroke="#e3ac2d" stroke-width="1" opacity="0.55"/>
  `),

  gardenia: svg(`
    ${defs('apGardenia', '#ffffff', '#f6cfdb')}
    <ellipse cx="80" cy="116" rx="38" ry="5" fill="#3d0d22" opacity="0.1"/>
    <rect x="66" y="17" width="28" height="13" rx="4" fill="#e3ac2d"/>
    <rect x="71" y="28" width="18" height="8" fill="#b76d16"/>
    <path d="M58 38 H102 L108 106 Q108 114 100 114 H60 Q52 114 52 106 Z" fill="url(#apGardenia)" stroke="#eda6bc" stroke-width="1.6"/>
    <rect x="64" y="54" width="32" height="30" rx="4" fill="#ffffff" opacity="0.9"/>
    ${label(67, 67, 'AL PASHA', '#3d0d22', 5.2)}
    ${label(70, 77, 'GARDENIA', '#93244e', 4.8)}
    <g transform="translate(124 88)">
      <circle cx="0" cy="0" r="9" fill="#ffffff" stroke="#eda6bc" stroke-width="1.4"/>
      <circle cx="0" cy="0" r="5" fill="#fbe8ee"/>
      <circle cx="0" cy="0" r="2" fill="#e3ac2d"/>
    </g>
  `),

  attar: svg(`
    ${defs('apAttar', '#93244e', '#3d0d22')}
    <ellipse cx="80" cy="116" rx="32" ry="4.5" fill="#3d0d22" opacity="0.14"/>
    <rect x="72" y="10" width="16" height="8" rx="3" fill="#e3ac2d"/>
    <rect x="75" y="18" width="10" height="16" fill="#b76d16"/>
    <path d="M64 34 H96 L102 102 Q102 112 92 112 H68 Q58 112 58 102 Z" fill="url(#apAttar)" stroke="#e3ac2d" stroke-width="2"/>
    <path d="M64 34 H96 L98 48 H62 Z" fill="#eac455" opacity="0.35"/>
    <rect x="66" y="62" width="28" height="30" rx="3" fill="#f9efc9" opacity="0.9"/>
    ${label(68, 75, 'AL PASHA', '#3d0d22', 4.6)}
    ${label(69, 84, 'OUD OIL', '#93244e', 4.6)}
    <circle cx="80" cy="54" r="3" fill="#e3ac2d" opacity="0.8"/>
    <g fill="#e3ac2d" opacity="0.55">
      <circle cx="46" cy="70" r="1.6"/>
      <circle cx="116" cy="60" r="2"/>
      <circle cx="122" cy="82" r="1.3"/>
    </g>
  `),

  sandal: svg(`
    ${defs('apSandal', '#f2dd8f', '#c98b4a')}
    <ellipse cx="80" cy="116" rx="38" ry="5" fill="#3d0d22" opacity="0.12"/>
    <rect x="66" y="17" width="28" height="13" rx="4" fill="#924e15"/>
    <rect x="71" y="28" width="18" height="8" fill="#793e18"/>
    <path d="M58 38 H102 L108 104 Q108 112 100 112 H60 Q52 112 52 104 Z" fill="url(#apSandal)" stroke="#924e15" stroke-width="1.6"/>
    <rect x="64" y="54" width="32" height="30" rx="4" fill="#faf7f2" opacity="0.9"/>
    ${label(67, 67, 'AL PASHA', '#3d0d22', 5.2)}
    ${label(70, 77, 'SANDAL', '#924e15', 5)}
    <path d="M118 108 L126 90 L134 108 Z" fill="#8a4b24"/>
    <path d="M122 108 L126 98 L130 108 Z" fill="#c98b4a"/>
  `),

  giftSet: svg(`
    ${defs('apGift', '#93244e', '#3d0d22')}
    <ellipse cx="80" cy="116" rx="48" ry="5" fill="#3d0d22" opacity="0.14"/>
    <rect x="30" y="58" width="100" height="52" rx="5" fill="url(#apGift)" stroke="#e3ac2d" stroke-width="1.6"/>
    <rect x="30" y="58" width="100" height="12" fill="#3d0d22" opacity="0.4"/>
    <line x1="80" y1="58" x2="80" y2="110" stroke="#e3ac2d" stroke-width="3"/>
    <path d="M80 58 C64 44, 54 46, 56 54 C58 60, 70 60, 80 58 Z" fill="#eac455"/>
    <path d="M80 58 C96 44, 106 46, 104 54 C102 60, 90 60, 80 58 Z" fill="#eac455"/>
    <g>
      <rect x="44" y="36" width="14" height="24" rx="3" fill="#f6cfdb"/>
      <rect x="47" y="32" width="8" height="6" rx="2" fill="#e3ac2d"/>
      <rect x="73" y="30" width="14" height="30" rx="3" fill="#f2dd8f"/>
      <rect x="76" y="26" width="8" height="6" rx="2" fill="#3d0d22"/>
      <rect x="102" y="36" width="14" height="24" rx="3" fill="#e0749a"/>
      <rect x="105" y="32" width="8" height="6" rx="2" fill="#e3ac2d"/>
    </g>
    ${label(54, 92, 'AL PASHA', '#f9efc9', 6)}
    ${label(58, 102, 'ROYAL GIFT SET', '#eac455', 5)}
  `),

  burner: svg(`
    <ellipse cx="80" cy="116" rx="42" ry="5" fill="#3d0d22" opacity="0.14"/>
    <path d="M48 92 H112 L104 112 Q103 116 98 116 H62 Q57 116 56 112 Z" fill="#681f3c" stroke="#e3ac2d" stroke-width="1.6"/>
    <path d="M58 92 H102 L96 104 H64 Z" fill="#93244e"/>
    <path d="M62 88 C62 74, 98 74, 98 88 Z" fill="#e3ac2d" opacity="0.9"/>
    <path d="M62 88 C62 78, 98 78, 98 88 Z" fill="#b76d16"/>
    <g stroke="#b9a89a" stroke-width="2" fill="none" opacity="0.75">
      <path d="M74 68 C66 58, 82 50, 74 38 C68 30, 78 22, 80 14"/>
      <path d="M90 66 C84 58, 96 50, 90 40 C86 34, 94 28, 94 20"/>
    </g>
    <path d="M56 112 H104" stroke="#e3ac2d" stroke-width="2"/>
  `),

  oudWood: svg(`
    ${defs('apWood', '#8a4b24', '#4d2a14')}
    <ellipse cx="80" cy="116" rx="40" ry="5" fill="#3d0d22" opacity="0.12"/>
    <path d="M40 96 H120 L112 114 H48 Z" fill="#681f3c" stroke="#e3ac2d" stroke-width="1.4"/>
    <g fill="url(#apWood)" stroke="#3d0d22" stroke-width="1">
      <path d="M48 96 L60 72 L74 96 Z"/>
      <path d="M64 96 L80 64 L96 96 Z"/>
      <path d="M88 96 L102 76 L116 96 Z"/>
    </g>
    <g stroke="#e3ac2d" stroke-width="1" opacity="0.5">
      <path d="M58 92 L60 80"/>
      <path d="M78 92 L80 74"/>
      <path d="M100 92 L102 82"/>
    </g>
    <g stroke="#b9a89a" stroke-width="2" fill="none" opacity="0.7">
      <path d="M70 60 C64 52, 76 46, 70 36"/>
      <path d="M92 58 C88 52, 98 46, 92 38"/>
    </g>
    ${label(58, 108, 'AL PASHA', '#eac455', 5)}
  `),

  vanilla: svg(`
    ${defs('apVanilla', '#faf7f2', '#f2dd8f')}
    <ellipse cx="80" cy="116" rx="38" ry="5" fill="#3d0d22" opacity="0.1"/>
    <rect x="66" y="16" width="28" height="13" rx="4" fill="#e3ac2d"/>
    <rect x="71" y="27" width="18" height="8" fill="#b76d16"/>
    <path d="M58 38 H102 L108 106 Q108 114 100 114 H60 Q52 114 52 106 Z" fill="url(#apVanilla)" stroke="#c98b4a" stroke-width="1.6"/>
    <rect x="64" y="54" width="32" height="30" rx="4" fill="#ffffff" opacity="0.9"/>
    ${label(67, 67, 'AL PASHA', '#3d0d22', 5.2)}
    ${label(69, 77, 'VANILLA', '#924e15', 5)}
    <g transform="translate(120 92)">
      <path d="M0 0 C10 4, 12 16, 2 22" stroke="#6b3a1e" stroke-width="3" fill="none"/>
      <path d="M-8 4 C2 8, 4 20, -6 26" stroke="#8a4b24" stroke-width="3" fill="none"/>
    </g>
  `),

  tobacco: svg(`
    ${defs('apTobacco', '#924e15', '#3d0d22')}
    <ellipse cx="80" cy="116" rx="40" ry="5" fill="#3d0d22" opacity="0.14"/>
    <rect x="64" y="14" width="32" height="14" rx="4" fill="#e3ac2d"/>
    <rect x="70" y="27" width="20" height="8" fill="#b76d16"/>
    <path d="M56 38 H104 L110 106 Q110 114 102 114 H58 Q50 114 50 106 Z" fill="url(#apTobacco)" stroke="#e3ac2d" stroke-width="1.6"/>
    <rect x="62" y="54" width="36" height="32" rx="4" fill="#3d0d22" opacity="0.85"/>
    ${label(66, 68, 'AL PASHA', '#eac455', 5.5)}
    ${label(67, 78, 'TOBACCO', '#f2dd8f', 5)}
    <g transform="translate(124 94)" fill="#5f8f45">
      <path d="M0 0 C12 -6, 18 6, 6 14 C-2 18, -8 8, 0 0 Z"/>
      <path d="M2 2 L10 12" stroke="#3f6630" stroke-width="1.4"/>
    </g>
  `),

  citrus: svg(`
    ${defs('apCitrus', '#f2dd8f', '#7fae4a')}
    <ellipse cx="80" cy="116" rx="38" ry="5" fill="#3d0d22" opacity="0.1"/>
    <rect x="68" y="18" width="24" height="12" rx="4" fill="#e3ac2d"/>
    <rect x="73" y="28" width="14" height="8" fill="#b76d16"/>
    <path d="M60 38 H100 L106 106 Q106 114 98 114 H62 Q54 114 54 106 Z" fill="url(#apCitrus)" stroke="#5f8f45" stroke-width="1.6"/>
    <rect x="66" y="54" width="28" height="30" rx="4" fill="#ffffff" opacity="0.88"/>
    ${label(68, 67, 'AL PASHA', '#3d0d22', 5)}
    ${label(69, 77, 'BERGAMOT', '#3f6630', 4.6)}
    <g transform="translate(124 92)">
      <circle cx="0" cy="0" r="11" fill="#eac455"/>
      <circle cx="0" cy="0" r="8" fill="#f2dd8f"/>
      <g stroke="#d4911d" stroke-width="1.2">
        <line x1="0" y1="-8" x2="0" y2="8"/>
        <line x1="-8" y1="0" x2="8" y2="0"/>
        <line x1="-5.5" y1="-5.5" x2="5.5" y2="5.5"/>
        <line x1="-5.5" y1="5.5" x2="5.5" y2="-5.5"/>
      </g>
    </g>
  `),

  vial: svg(`
    ${defs('apVial', '#f9efc9', '#eac455')}
    <ellipse cx="80" cy="116" rx="28" ry="4" fill="#3d0d22" opacity="0.12"/>
    <rect x="72" y="10" width="16" height="8" rx="3" fill="#3d0d22"/>
    <rect x="75" y="18" width="10" height="18" fill="#c3b09e"/>
    <path d="M66 36 H94 L100 100 Q100 110 90 110 H70 Q60 110 60 100 Z" fill="url(#apVial)" stroke="#b76d16" stroke-width="1.8"/>
    <path d="M66 36 H94 L96 50 H64 Z" fill="#ffffff" opacity="0.45"/>
    <rect x="66" y="64" width="28" height="28" rx="3" fill="#3d0d22" opacity="0.85"/>
    ${label(68, 77, 'AL PASHA', '#eac455', 4.6)}
    ${label(72, 86, 'MUSK OIL', '#f2dd8f', 4.2)}
    <path d="M72 24 H88" stroke="#3d0d22" stroke-width="2" opacity="0.4"/>
  `),

  diffuser: svg(`
    ${defs('apDiff', '#fbe8ee', '#e0749a')}
    <ellipse cx="80" cy="116" rx="34" ry="4.5" fill="#3d0d22" opacity="0.1"/>
    <g stroke="#8a4b24" stroke-width="2.2" stroke-linecap="round">
      <line x1="74" y1="70" x2="56" y2="16"/>
      <line x1="80" y1="70" x2="80" y2="10"/>
      <line x1="86" y1="70" x2="104" y2="18"/>
    </g>
    <path d="M62 64 H98 L104 104 Q104 112 96 112 H64 Q56 112 56 104 Z" fill="url(#apDiff)" stroke="#93244e" stroke-width="1.6"/>
    <rect x="66" y="80" width="28" height="22" rx="3" fill="#ffffff" opacity="0.9"/>
    ${label(68, 92, 'AL PASHA', '#3d0d22', 4.6)}
    ${label(69, 100, 'DIFFUSER', '#93244e', 4.2)}
    <circle cx="80" cy="70" r="4" fill="#e3ac2d"/>
  `),

  spray: svg(`
    ${defs('apSpray', '#f6cfdb', '#cd4a78')}
    <ellipse cx="80" cy="116" rx="34" ry="4.5" fill="#3d0d22" opacity="0.1"/>
    <rect x="68" y="12" width="24" height="12" rx="4" fill="#e3ac2d"/>
    <path d="M90 16 H104 V24 H94" fill="#b76d16"/>
    <rect x="72" y="24" width="16" height="10" fill="#c3b09e"/>
    <path d="M62 34 H98 L104 106 Q104 114 96 114 H64 Q56 114 56 106 Z" fill="url(#apSpray)" stroke="#93244e" stroke-width="1.6"/>
    <rect x="66" y="58" width="28" height="30" rx="3" fill="#ffffff" opacity="0.9"/>
    ${label(68, 72, 'AL PASHA', '#3d0d22', 4.6)}
    ${label(69, 82, 'BODY MIST', '#93244e', 4.2)}
    <g fill="#e3ac2d" opacity="0.6">
      <circle cx="118" cy="14" r="1.6"/>
      <circle cx="126" cy="22" r="1.2"/>
      <circle cx="132" cy="12" r="1"/>
    </g>
  `),

  sampler: svg(`
    ${defs('apSample', '#93244e', '#3d0d22')}
    <ellipse cx="80" cy="116" rx="46" ry="5" fill="#3d0d22" opacity="0.12"/>
    <rect x="26" y="96" width="108" height="16" rx="4" fill="#681f3c" stroke="#e3ac2d" stroke-width="1.4"/>
    ${[
      ['#f6cfdb', '#e3ac2d'],
      ['#f2dd8f', '#3d0d22'],
      ['#e0749a', '#e3ac2d'],
      ['#3d0d22', '#eac455'],
      ['#faf7f2', '#93244e'],
      ['#c98b4a', '#3d0d22'],
    ]
      .map(
        ([body, cap], i) => `
        <rect x="${34 + i * 16}" y="62" width="12" height="34" rx="3" fill="${body}" stroke="#3d0d22" stroke-width="0.6"/>
        <rect x="${37 + i * 16}" y="56" width="6" height="7" rx="2" fill="${cap}"/>
        <rect x="${36 + i * 16}" y="76" width="8" height="10" fill="#ffffff" opacity="0.55"/>
      `,
      )
      .join('')}
    ${label(56, 90, 'AL PASHA', '#eac455', 5.5)}
  `),

  bottle: svg(`
    ${defs('apBottle', '#93244e', '#3d0d22')}
    <ellipse cx="80" cy="116" rx="38" ry="5" fill="#3d0d22" opacity="0.12"/>
    <rect x="66" y="16" width="28" height="13" rx="4" fill="#e3ac2d"/>
    <rect x="71" y="27" width="18" height="8" fill="#b76d16"/>
    <path d="M58 38 H102 L108 106 Q108 114 100 114 H60 Q52 114 52 106 Z" fill="url(#apBottle)" stroke="#e3ac2d" stroke-width="1.6"/>
    <rect x="64" y="54" width="32" height="30" rx="4" fill="#f9efc9" opacity="0.9"/>
    ${label(67, 67, 'AL PASHA', '#3d0d22', 5.2)}
    ${label(72, 77, 'PARFUM', '#93244e', 5)}
  `),
};

export const ART_OPTIONS = [
  { value: 'royalOud', label: 'عود ملكي' },
  { value: 'rose', label: 'ورد طائفي' },
  { value: 'musk', label: 'مسك أبيض' },
  { value: 'amber', label: 'عنبر ذهبي' },
  { value: 'noir', label: 'عطر نوار' },
  { value: 'gardenia', label: 'جاردينيا' },
  { value: 'attar', label: 'دهن عود' },
  { value: 'sandal', label: 'صندل' },
  { value: 'giftSet', label: 'طقم هدايا' },
  { value: 'burner', label: 'مبخرة' },
  { value: 'oudWood', label: 'بخور عود' },
  { value: 'vanilla', label: 'فانيلا' },
  { value: 'tobacco', label: 'تاباكو' },
  { value: 'citrus', label: 'برغموت' },
  { value: 'vial', label: 'زيت مسك' },
  { value: 'diffuser', label: 'معطر جو' },
  { value: 'spray', label: 'بخاخ جسم' },
  { value: 'sampler', label: 'طقم عينات' },
  { value: 'bottle', label: 'زجاجة عامة' },
];
