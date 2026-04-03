import { useState } from 'react';

/*
 * Lightweight SVG city map of Nagpur.
 * Shows stylised roads, area labels, and animated project markers.
 * No external tile providers — instant render, zero network cost.
 */

const NAGPUR_AREAS = [
  { name: 'Dharampeth', x: 310, y: 175 },
  { name: 'Sadar', x: 390, y: 125 },
  { name: 'Civil Lines', x: 345, y: 145 },
  { name: 'Sitabuldi', x: 350, y: 200 },
  { name: 'Laxmi Nagar', x: 420, y: 195 },
  { name: 'Manish Nagar', x: 340, y: 310 },
  { name: 'Wardha Road', x: 370, y: 270 },
  { name: 'MIHAN', x: 430, y: 350 },
  { name: 'Hingna', x: 180, y: 210 },
  { name: 'Koradi', x: 440, y: 80 },
  { name: 'Besa', x: 460, y: 300 },
  { name: 'Trimurti Ngr', x: 275, y: 225 },
];

const PROJECT_POSITIONS = {
  'mihan':        { x: 440, y: 355 },
  'manish-nagar': { x: 345, y: 315 },
  'wardha-road':  { x: 375, y: 268 },
  'trimurti-nagar': { x: 278, y: 230 },
  'hingna':       { x: 175, y: 205 },
  'dharampeth':   { x: 315, y: 180 },
  'sadar':        { x: 395, y: 130 },
  'koradi-road':  { x: 445, y: 75 },
  'metro-city':   { x: 490, y: 240 },
};

const CityMapSVG = ({ projects, selectedProjectId, onSelectProject, onHoverProject, isDark }) => {
  const [hovId, setHovId] = useState(null);

  const bgColor = isDark ? '#0f172a' : '#f1f5f9';
  const roadColor = isDark ? '#1e293b' : '#e2e8f0';
  const roadStroke = isDark ? '#334155' : '#cbd5e1';
  const majorRoad = isDark ? '#1e3a5f' : '#dbeafe';
  const majorStroke = isDark ? '#2563eb30' : '#93c5fd80';
  const areaTextColor = isDark ? '#475569' : '#94a3b8';
  const waterColor = isDark ? '#0c1929' : '#e0f2fe';
  const parkColor = isDark ? '#0a2018' : '#dcfce7';

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
      <svg viewBox="0 0 640 360" className="w-full h-full" style={{ display: 'block' }}>
        {/* Background */}
        <rect width="640" height="360" fill={bgColor} />

        {/* Decorative grid pattern */}
        <defs>
          <pattern id="cityGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={isDark ? '#1e293b40' : '#e2e8f020'} strokeWidth="0.5" />
          </pattern>
          <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
          </filter>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="640" height="360" fill="url(#cityGrid)" />

        {/* Water bodies / lakes */}
        <ellipse cx="380" cy="168" rx="22" ry="14" fill={waterColor} opacity="0.6" />
        <ellipse cx="295" cy="135" rx="15" ry="10" fill={waterColor} opacity="0.5" />
        <ellipse cx="500" cy="180" rx="18" ry="11" fill={waterColor} opacity="0.5" />

        {/* Parks / green zones */}
        <rect x="330" y="150" width="30" height="20" rx="10" fill={parkColor} opacity="0.5" />
        <rect x="260" y="180" width="25" height="18" rx="9" fill={parkColor} opacity="0.4" />
        <rect x="420" y="250" width="35" height="22" rx="11" fill={parkColor} opacity="0.4" />

        {/* ─── Major Roads ─── */}
        {/* Ring Road (outer) */}
        <ellipse cx="340" cy="210" rx="220" ry="170" fill="none" stroke={majorStroke} strokeWidth="8" strokeDasharray="none" opacity="0.6" />
        <ellipse cx="340" cy="210" rx="220" ry="170" fill="none" stroke={majorRoad} strokeWidth="4" />

        {/* Inner Ring */}
        <ellipse cx="345" cy="200" rx="120" ry="90" fill="none" stroke={majorStroke} strokeWidth="5" opacity="0.5" />
        <ellipse cx="345" cy="200" rx="120" ry="90" fill="none" stroke={majorRoad} strokeWidth="2.5" />

        {/* Wardha Road (vertical south) */}
        <line x1="365" y1="120" x2="435" y2="380" stroke={roadColor} strokeWidth="6" />
        <line x1="365" y1="120" x2="435" y2="380" stroke={roadStroke} strokeWidth="2" strokeDasharray="8 4" />

        {/* Central Avenue (horizontal) */}
        <line x1="100" y1="200" x2="560" y2="200" stroke={roadColor} strokeWidth="5" />
        <line x1="100" y1="200" x2="560" y2="200" stroke={roadStroke} strokeWidth="1.5" strokeDasharray="8 4" />

        {/* NH to MIHAN (diagonal SE) */}
        <line x1="350" y1="210" x2="520" y2="360" stroke={roadColor} strokeWidth="5" />
        <line x1="350" y1="210" x2="520" y2="360" stroke={roadStroke} strokeWidth="1.5" strokeDasharray="6 3" />

        {/* Koradi Road (north) */}
        <line x1="370" y1="30" x2="380" y2="200" stroke={roadColor} strokeWidth="4" />
        <line x1="370" y1="30" x2="380" y2="200" stroke={roadStroke} strokeWidth="1" strokeDasharray="6 3" />

        {/* Hingna Road (west) */}
        <line x1="50" y1="210" x2="340" y2="200" stroke={roadColor} strokeWidth="4" />
        <line x1="50" y1="210" x2="340" y2="200" stroke={roadStroke} strokeWidth="1" strokeDasharray="6 3" />

        {/* Amravati Road (NW) */}
        <line x1="120" y1="60" x2="340" y2="190" stroke={roadColor} strokeWidth="3.5" />

        {/* Kamptee Road (N) */}
        <line x1="320" y1="20" x2="345" y2="190" stroke={roadColor} strokeWidth="3.5" />

        {/* ─── Area labels ─── */}
        {NAGPUR_AREAS.map((a) => (
          <text key={a.name} x={a.x} y={a.y} textAnchor="middle" fontSize="8" fontWeight="600" fill={areaTextColor} letterSpacing=".04em" opacity="0.7">
            {a.name}
          </text>
        ))}

        {/* City center label */}
        <text x="350" y="208" textAnchor="middle" fontSize="10" fontWeight="800" fill={isDark ? '#64748b' : '#94a3b8'} letterSpacing=".15em" opacity="0.5">
          NAGPUR
        </text>

        {/* ─── Project Markers ─── */}
        {projects.map((project) => {
          const pos = PROJECT_POSITIONS[project.id];
          if (!pos) return null;
          const isSel = project.id === selectedProjectId;
          const isHov = project.id === hovId;
          const active = isSel || isHov;
          const pinSize = isSel ? 14 : isHov ? 12 : 10;

          return (
            <g
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              onMouseEnter={() => { setHovId(project.id); onHoverProject?.(project.id); }}
              onMouseLeave={() => { setHovId(null); onHoverProject?.(null); }}
              style={{ cursor: 'pointer' }}
              filter={active ? 'url(#glow)' : 'url(#pinShadow)'}
            >
              {/* Pulse ring for selected */}
              {isSel && (
                <>
                  <circle cx={pos.x} cy={pos.y} r={pinSize + 8} fill="none" stroke={project.accent} strokeWidth="1.5" opacity="0.3">
                    <animate attributeName="r" from={pinSize + 4} to={pinSize + 16} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={pos.x} cy={pos.y} r={pinSize + 4} fill={project.accent} opacity="0.12" />
                </>
              )}

              {/* Pin circle */}
              <circle
                cx={pos.x} cy={pos.y} r={pinSize}
                fill={project.accent}
                stroke="white" strokeWidth={isSel ? 3 : 2}
                style={{ transition: 'all 0.25s ease' }}
              />

              {/* Building icon inside */}
              <g transform={`translate(${pos.x - 5}, ${pos.y - 5}) scale(${isSel ? 0.45 : 0.38})`}>
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M15 9h.01M15 13h.01M10 21v-4h4v4" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </g>

              {/* Label */}
              <rect
                x={pos.x - 28} y={pos.y + pinSize + 4}
                width="56" height="16" rx="8"
                fill={isSel ? project.accent : isDark ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.92)'}
                stroke={isSel ? 'transparent' : isDark ? '#47556930' : '#94a3b830'}
                strokeWidth="0.5"
              />
              <text
                x={pos.x} y={pos.y + pinSize + 15}
                textAnchor="middle" fontSize="7"
                fontWeight={isSel ? '800' : '600'}
                fill={isSel ? 'white' : isDark ? '#e2e8f0' : '#334155'}
              >
                {project.name.split(' ').slice(0, 2).join(' ')}
              </text>
            </g>
          );
        })}

        {/* Compass rose */}
        <g transform="translate(580, 40)" opacity="0.4">
          <circle cx="0" cy="0" r="16" fill="none" stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="1" />
          <text x="0" y="-20" textAnchor="middle" fontSize="8" fontWeight="800" fill={isDark ? '#64748b' : '#94a3b8'}>N</text>
          <line x1="0" y1="-14" x2="0" y2="-6" stroke={isDark ? '#64748b' : '#94a3b8'} strokeWidth="1.5" />
          <polygon points="0,-14 -3,-8 3,-8" fill={isDark ? '#64748b' : '#94a3b8'} />
        </g>

        {/* Scale indicator */}
        <g transform="translate(40, 340)" opacity="0.4">
          <line x1="0" y1="0" x2="60" y2="0" stroke={isDark ? '#64748b' : '#94a3b8'} strokeWidth="1.5" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke={isDark ? '#64748b' : '#94a3b8'} strokeWidth="1" />
          <line x1="60" y1="-3" x2="60" y2="3" stroke={isDark ? '#64748b' : '#94a3b8'} strokeWidth="1" />
          <text x="30" y="-5" textAnchor="middle" fontSize="6" fill={isDark ? '#64748b' : '#94a3b8'} fontWeight="600">~5 km</text>
        </g>
      </svg>
    </div>
  );
};

export default CityMapSVG;
