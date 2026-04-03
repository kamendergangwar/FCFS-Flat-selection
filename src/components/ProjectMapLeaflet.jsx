import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/*
 * Interactive satellite-style map of Nagpur using Leaflet + OpenStreetMap.
 * Projects are plotted with custom animated markers at real coordinates.
 */

/* ─── Real Nagpur coordinates for each project ─── */
const PROJECT_COORDS = {
  'mihan':          [21.0790, 79.0573],
  'manish-nagar':   [21.1012, 79.0665],
  'wardha-road':    [21.1142, 79.0820],
  'trimurti-nagar': [21.1350, 79.0575],
  'hingna':         [21.1450, 79.0180],
  'dharampeth':     [21.1410, 79.0640],
  'sadar':          [21.1530, 79.0780],
  'koradi-road':    [21.1800, 79.0920],
};

const NAGPUR_CENTER = [21.1350, 79.0640];
const DEFAULT_ZOOM = 12;

/* ─── Custom marker HTML ─── */
const createMarkerIcon = (project, isSelected) => {
  const size = isSelected ? 56 : 42;
  const iconSize = isSelected ? 22 : 16;
  const pulseSize = isSelected ? 56 : 0;

  return L.divIcon({
    className: 'project-marker-icon',
    iconSize: [size + 48, size + 42],
    iconAnchor: [(size + 48) / 2, size + 34],
    popupAnchor: [0, -(size + 10)],
    html: `
      <div style="
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        filter: drop-shadow(0 4px 12px rgba(0,0,0,0.35));
      ">
        ${isSelected ? `
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${pulseSize}px;
            height: ${pulseSize}px;
            border-radius: 50%;
            background: ${project.accent}30;
            animation: mapPulse 2s ease-in-out infinite;
          "></div>
        ` : ''}
        <div style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 18px;
          background: linear-gradient(180deg, ${project.accent}, ${project.accent}cc);
          border: 3px solid rgba(255,255,255,0.96);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
          ${isSelected ? `
            box-shadow: 0 0 0 4px ${project.accent}40, 0 0 20px ${project.accent}60, 0 8px 24px rgba(0,0,0,0.3);
            transform: scale(1.1);
          ` : `
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          `}
        ">
          <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 21h18"></path>
            <path d="M5 21V7l7-4 7 4v14"></path>
            <path d="M9 9h.01"></path>
            <path d="M9 13h.01"></path>
            <path d="M15 9h.01"></path>
            <path d="M15 13h.01"></path>
            <path d="M10 21v-4h4v4"></path>
          </svg>
        </div>
        <div style="
          margin-top: 6px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: ${isSelected ? '11px' : '10px'};
          font-weight: ${isSelected ? '800' : '600'};
          white-space: nowrap;
          position: relative;
          z-index: 2;
          ${isSelected ? `
            background: ${project.accent};
            color: white;
            box-shadow: 0 2px 10px ${project.accent}50;
          ` : `
            background: rgba(15,23,42,0.85);
            color: rgba(255,255,255,0.9);
            backdrop-filter: blur(8px);
          `}
        ">${project.name.split(' ').slice(0, 2).join(' ')}</div>
      </div>
    `,
  });
};

/* ─── Selected project popup HTML ─── */
const createPopupContent = (project) => `
  <div style="
    font-family: 'Sora', 'Segoe UI', sans-serif;
    min-width: 220px;
    padding: 2px;
  ">
    <div style="
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    ">
      <div style="
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: ${project.accent};
        box-shadow: 0 0 8px ${project.accent}80;
        flex-shrink: 0;
      "></div>
      <div>
        <div style="font-size: 14px; font-weight: 800; color: #0f172a; line-height: 1.2;">
          ${project.name}
        </div>
        <div style="font-size: 11px; color: #64748b; margin-top: 1px;">
          ${project.locality}
        </div>
      </div>
    </div>
    <div style="
      padding: 8px 10px;
      background: #f8fafc;
      border-radius: 8px;
      font-size: 12px;
      color: #334155;
      line-height: 1.5;
      margin-bottom: 8px;
    ">
      ${project.preview}
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
      <div style="padding: 6px 8px; background: #f1f5f9; border-radius: 6px;">
        <div style="font-size: 9px; text-transform: uppercase; letter-spacing: .08em; color: #94a3b8; font-weight: 700;">Commute</div>
        <div style="font-size: 10px; color: #334155; font-weight: 600; margin-top: 2px;">${project.commute.split('.')[0]}</div>
      </div>
      <div style="padding: 6px 8px; background: #f1f5f9; border-radius: 6px;">
        <div style="font-size: 9px; text-transform: uppercase; letter-spacing: .08em; color: #94a3b8; font-weight: 700;">Lifestyle</div>
        <div style="font-size: 10px; color: #334155; font-weight: 600; margin-top: 2px;">${project.lifestyle.split('.')[0]}</div>
      </div>
    </div>
    <div style="
      margin-top: 8px;
      padding: 6px 10px;
      background: linear-gradient(135deg, ${project.accent}15, ${project.accent}08);
      border: 1px solid ${project.accent}25;
      border-radius: 8px;
      font-size: 11px;
      color: #1e293b;
      font-weight: 600;
    ">
      ✓ ${project.fit}
    </div>
  </div>
`;

/* ─── Map dark/styled tile URL ─── */
// CartoDB Positron for a clean modern look, or dark matter for dark mode
const TILE_LIGHT = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const TILE_DARK = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

/* ─── Inject CSS for pulse animation ─── */
const injectStyles = () => {
  if (document.getElementById('project-map-styles')) return;
  const style = document.createElement('style');
  style.id = 'project-map-styles';
  style.textContent = `
    @keyframes mapPulse {
      0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.6; }
      50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
      100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.6; }
    }
    .project-marker-icon {
      background: none !important;
      border: none !important;
    }
    .leaflet-popup-content-wrapper {
      border-radius: 16px !important;
      box-shadow: 0 12px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1) !important;
      border: 1px solid rgba(148,163,184,0.15) !important;
      padding: 0 !important;
    }
    .leaflet-popup-content {
      margin: 12px 14px !important;
      font-size: 13px !important;
    }
    .leaflet-popup-tip {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
    }
    .leaflet-popup-close-button {
      color: #94a3b8 !important;
      font-size: 20px !important;
      padding: 6px 8px 0 0 !important;
    }
    .leaflet-popup-close-button:hover {
      color: #0f172a !important;
    }
    .leaflet-control-zoom a {
      background: rgba(15,23,42,0.85) !important;
      color: white !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      backdrop-filter: blur(10px) !important;
      width: 34px !important;
      height: 34px !important;
      line-height: 34px !important;
      font-size: 16px !important;
      border-radius: 10px !important;
    }
    .leaflet-control-zoom a:hover {
      background: rgba(15,23,42,0.95) !important;
    }
    .leaflet-control-zoom {
      border: none !important;
      border-radius: 12px !important;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2) !important;
    }
    .leaflet-control-attribution {
      background: rgba(0,0,0,0.5) !important;
      color: rgba(255,255,255,0.5) !important;
      font-size: 9px !important;
      padding: 2px 6px !important;
      border-radius: 6px 0 0 0 !important;
      backdrop-filter: blur(8px) !important;
    }
    .leaflet-control-attribution a {
      color: rgba(255,255,255,0.6) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ═══════════════════════ COMPONENT ═══════════════════════ */
const ProjectMapLeaflet = ({ projects, selectedProjectId, onSelectProject, onHoverProject, className, darkMode = true }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const onSelectRef = useRef(onSelectProject);
  const onHoverRef = useRef(onHoverProject);
  onSelectRef.current = onSelectProject;
  onHoverRef.current = onHoverProject;

  useEffect(() => {
    injectStyles();
  }, []);

  /* ─── Init map ─── */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: NAGPUR_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      dragging: true,
    });

    L.tileLayer(darkMode ? TILE_DARK : TILE_LIGHT, {
      attribution: TILE_ATTR,
      maxZoom: 18,
      subdomains: 'abcd',
    }).addTo(map);

    // Position zoom control
    map.zoomControl.setPosition('bottomright');

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, [darkMode]);

  /* ─── Update markers when projects or selection changes ─── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m) => map.removeLayer(m));
    markersRef.current = {};

    projects.forEach((project) => {
      const coords = PROJECT_COORDS[project.id];
      if (!coords) return;

      const isSelected = project.id === selectedProjectId;
      const icon = createMarkerIcon(project, isSelected);

      const marker = L.marker(coords, {
        icon,
        zIndexOffset: isSelected ? 1000 : 0,
        riseOnHover: true,
      }).addTo(map);

      // Popup for selected
      if (isSelected) {
        marker.bindPopup(createPopupContent(project), {
          maxWidth: 280,
          offset: [0, -5],
          autoPan: true,
          closeButton: true,
        });
      }

      marker.on('click', () => {
        onSelectRef.current(project.id);
      });

      marker.on('mouseover', () => {
        onHoverRef.current?.(project.id);
      });

      marker.on('mouseout', () => {
        onHoverRef.current?.(null);
      });

      markersRef.current[project.id] = marker;
    });

    // Fly to selected project
    const selCoords = PROJECT_COORDS[selectedProjectId];
    if (selCoords) {
      map.flyTo(selCoords, 13, { duration: 1.0, easeLinearity: 0.25 });
      // Open popup after fly
      setTimeout(() => {
        const selMarker = markersRef.current[selectedProjectId];
        if (selMarker) selMarker.openPopup();
      }, 1100);
    }
  }, [projects, selectedProjectId]);

  return (
    <div className={`relative ${className || 'h-[420px] w-full'}`}>
      <div ref={containerRef} className="h-full w-full rounded-none" style={{ zIndex: 1 }} />
    </div>
  );
};

export default ProjectMapLeaflet;
