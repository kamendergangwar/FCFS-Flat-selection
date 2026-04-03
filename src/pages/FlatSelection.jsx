import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ApplicationLayout from '../components/ApplicationLayout';
import CityMapSVG from '../components/CityMapSVG';
import {
  Building2, CheckCircle2, ChevronDown, ChevronRight, Clock, Compass,
  Filter, Home, IndianRupee, Layers3, MapPin, Maximize2,
  Sparkles, Timer, X,
} from 'lucide-react';

/* ───────────────── seed data ───────────────── */
const projectSeeds = [
  { id: 'mihan', name: 'MIHAN Smart Township', locality: 'MIHAN, Nagpur', accent: '#38bdf8', mapPosition: { x: 67, y: 77 }, buildings: ['Aster', 'Nova', 'Orion'], preview: 'Airport corridor access with strong future growth potential.', fit: 'Best for buyers prioritising future appreciation and city-edge access.', commute: 'Approx. 12 mins to airport and MIHAN business district.', lifestyle: 'Modern township energy with newer roads and wider parcels.' },
  { id: 'manish-nagar', name: 'Manish Nagar Heights', locality: 'Manish Nagar, Nagpur', accent: '#fb923c', mapPosition: { x: 54, y: 68 }, buildings: ['Cedar', 'Iris', 'Maple'], preview: 'Balanced family-oriented address with strong everyday convenience.', fit: 'Great for applicants who want practical daily living with strong connectivity.', commute: 'Quick Wardha Road access and close retail catchment.', lifestyle: 'Residential comfort with schools, shops, and regular transit nearby.' },
  { id: 'wardha-road', name: 'Wardha Road Residency', locality: 'Wardha Road, Nagpur', accent: '#f87171', mapPosition: { x: 58, y: 58 }, buildings: ['Elm', 'Prism', 'Apex'], preview: 'Well-connected corridor project for city-wide movement.', fit: 'Ideal for working professionals who need reliable cross-city access.', commute: 'Strong arterial access toward central business and transit routes.', lifestyle: 'Urban convenience with a strong commuter profile.' },
  { id: 'trimurti-nagar', name: 'Trimurti Nagar Square', locality: 'Trimurti Nagar, Nagpur', accent: '#a78bfa', mapPosition: { x: 45, y: 44 }, buildings: ['Skyline', 'Vertex', 'Aura'], preview: 'Central residential cluster with schools and services nearby.', fit: 'A smart fit for applicants wanting a central, established neighborhood.', commute: 'Smooth mid-city connectivity for schools, offices, and markets.', lifestyle: 'Steady residential rhythm with mature local infrastructure.' },
  { id: 'hingna', name: 'Hingna Hills Enclave', locality: 'Hingna, Nagpur', accent: '#4ade80', mapPosition: { x: 28, y: 39 }, buildings: ['Pine', 'Spruce', 'Willow'], preview: 'Calmer west-side project with more breathing room and open edges.', fit: 'Suited to buyers looking for quieter surroundings and practical layouts.', commute: 'Convenient west-side movement toward industrial and work belts.', lifestyle: 'More open residential feel with a calmer neighborhood pace.' },
  { id: 'dharampeth', name: 'Dharampeth Urban Homes', locality: 'Dharampeth, Nagpur', accent: '#f43f5e', mapPosition: { x: 52, y: 35 }, buildings: ['Elite', 'Crown', 'Axis'], preview: 'Premium city-core project with high convenience value.', fit: 'Premium pick for applicants who want a central city address.', commute: 'Fast access to civic, medical, and retail zones.', lifestyle: 'High-street convenience and dense city amenities.' },
  { id: 'sadar', name: 'Sadar Cantonment Greens', locality: 'Sadar, Nagpur', accent: '#22c55e', mapPosition: { x: 62, y: 24 }, buildings: ['Magnolia', 'Oak', 'Harbor'], preview: 'Leafier north-central project with established surroundings.', fit: 'Strong choice for buyers who value mature localities and daily convenience.', commute: 'Reliable road network with strong north-central connectivity.', lifestyle: 'Leafy streets, established amenities, and stable neighborhood character.' },
  { id: 'koradi-road', name: 'Koradi Road Meadows', locality: 'Koradi Road, Nagpur', accent: '#06b6d4', mapPosition: { x: 69, y: 15 }, buildings: ['Vista', 'Halo', 'Northstar'], preview: 'Growth-corridor inventory with value-upside positioning.', fit: 'Good for long-term value seekers looking in expansion corridors.', commute: 'North-bound movement toward emerging development belts.', lifestyle: 'Newer township feel with future-led upside.' },
  { id: 'metro-city', name: 'Metro City Grand Township', locality: 'Outer Ring Road, Nagpur', accent: '#6366f1', mapPosition: { x: 76, y: 48 }, buildings: ['Alpha','Bravo','Cedar','Delta','Echo','Falcon','Galaxy','Harbor','Ivy','Jade','Kite','Lotus','Metro','Nova','Opal','Plaza','Quartz','Regal','Sky','Tulip'], preview: 'Large-format township inventory with multiple towers, amenities, and phased releases.', fit: 'Best for applicants comparing many tower options inside one integrated township.', commute: 'Strong ring-road connectivity with room for future infrastructure growth.', lifestyle: 'Clubhouse-led community living with broad inventory across many towers.' },
];

const floorNumbers = Array.from({ length: 10 }, (_, i) => i + 1);
const flatSlots = [
  { code: '01', label: 'Unit A', x: 18, y: 28, width: 112, height: 78 },
  { code: '02', label: 'Unit B', x: 190, y: 28, width: 112, height: 78 },
  { code: '03', label: 'Unit C', x: 18, y: 116, width: 112, height: 78 },
  { code: '04', label: 'Unit D', x: 190, y: 116, width: 112, height: 78 },
  { code: '05', label: 'Unit E', x: 18, y: 204, width: 112, height: 78 },
  { code: '06', label: 'Unit F', x: 190, y: 204, width: 112, height: 78 },
  { code: '07', label: 'Unit G', x: 18, y: 292, width: 112, height: 78 },
  { code: '08', label: 'Unit H', x: 190, y: 292, width: 112, height: 78 },
];

/* ───────────── helpers ───────────── */
const formatPrice = (p) => `₹${p.toLocaleString('en-IN')}`;
const getStatusTone = (status, isSel) => {
  if (isSel) return { fill: '#3b82f6', stroke: '#1d4ed8', glow: 'rgba(59,130,246,.35)', chipCls: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Selected' };
  if (status === 'available') return { fill: '#22c55e', stroke: '#15803d', glow: 'rgba(34,197,94,.25)', chipCls: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Available' };
  if (status === 'held') return { fill: '#60a5fa', stroke: '#2563eb', glow: 'rgba(96,165,250,.25)', chipCls: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Held' };
  return { fill: '#ef4444', stroke: '#dc2626', glow: 'rgba(239,68,68,.25)', chipCls: 'bg-rose-100 text-rose-700 border-rose-200', label: 'Sold' };
};
const getFloorBand = (v) => { if (v === 'low') return f => f <= 3; if (v === 'mid') return f => f >= 4 && f <= 7; if (v === 'high') return f => f >= 8; return () => true; };

const buildProjectCatalog = () =>
  projectSeeds.map((project, pi) => ({
    ...project,
    buildings: project.buildings.map((bName, bi) => ({
      id: `${project.id}-${bName.toLowerCase()}`,
      name: `Building ${bName}`,
      floors: floorNumbers.map((floor) => ({
        number: floor,
        flats: flatSlots.map((slot, si) => {
          const areaOpts = [540, 610, 680, 740, 820, 880, 960, 1040];
          const area = areaOpts[si];
          const base = 3150000 + area * 1200 + floor * 8500 + pi * 65000 + bi * 42000;
          const seed = pi * 17 + bi * 11 + floor * 7 + si * 5;
          let status = 'available';
          if (seed % 9 === 0) status = 'sold';
          else if (seed % 5 === 0) status = 'held';
          return { id: `${bName}-${floor}${slot.code}`, code: slot.code, label: slot.label, area, price: Math.round(base / 10000) * 10000, type: area < 700 ? '1 BHK' : area < 900 ? '2 BHK' : '3 BHK', facing: si % 2 === 0 ? 'East Facing' : 'West Facing', status, slot };
        }),
      })),
    })),
  }));

const formatTime = (ms) => { if (ms <= 0) return '00:00'; const s = Math.floor(ms / 1000); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };

/* ───────────── Breadcrumb ───────────── */
const Breadcrumb = ({ items, isDark }) => (
  <nav className={`flex items-center gap-1 text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
    {items.map((item, i) => (
      <span key={i} className="flex items-center gap-1">
        {i > 0 && <ChevronRight className={`h-3 w-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />}
        <span className={i === items.length - 1 ? (isDark ? 'font-semibold text-cyan-300' : 'font-semibold text-sky-600') : ''}>{item}</span>
      </span>
    ))}
  </nav>
);

/* ═══════════════════════ MAIN COMPONENT ═══════════════════════ */
const FlatSelection = () => {
  const navigate = useNavigate();
  const { applicationData, updateApplicationData } = useAuth();
  const { isDark } = useTheme();
  const projectCatalog = useMemo(buildProjectCatalog, []);

  const savedPid = applicationData.flatSelected?.location?.id || projectCatalog[0].id;
  const initProject = projectCatalog.find((p) => p.id === savedPid) || projectCatalog[0];
  const initBid = applicationData.flatSelected?.buildingId || initProject.buildings[0].id;
  const initFloor = applicationData.flatSelected?.floor || 1;

  const [selProjId, setSelProjId] = useState(initProject.id);
  const [selBldgId, setSelBldgId] = useState(initBid);
  const [selFloor, setSelFloor] = useState(initFloor);
  const [selFlatId, setSelFlatId] = useState(applicationData.flatSelected?.id || null);
  const [budgetCap, setBudgetCap] = useState(70);
  const [floorFilter, setFloorFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [resEnd, setResEnd] = useState(applicationData.flatLocked?.expiresAt || null);
  const [remaining, setRemaining] = useState(15 * 60 * 1000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [hoverFlatId, setHoverFlatId] = useState(null);
  const [showExpandedPlan, setShowExpandedPlan] = useState(false);
  const [hoveredProjectId, setHoveredProjectId] = useState(null);
  const [hasMapInteracted, setHasMapInteracted] = useState(false);

  const selProject = useMemo(() => projectCatalog.find((p) => p.id === selProjId) || projectCatalog[0], [projectCatalog, selProjId]);
  const focusProjectId = hoveredProjectId || (hasMapInteracted ? selProjId : null);
  const focusProject = useMemo(() => projectCatalog.find((p) => p.id === focusProjectId) || null, [focusProjectId, projectCatalog]);

  useEffect(() => { const ok = selProject.buildings.find((b) => b.id === selBldgId); if (!ok) { setSelBldgId(selProject.buildings[0].id); setSelFloor(1); setSelFlatId(null); } }, [selBldgId, selProject]);

  const selBuilding = useMemo(() => selProject.buildings.find((b) => b.id === selBldgId) || selProject.buildings[0], [selBldgId, selProject]);
  const floorMatcher = useMemo(() => getFloorBand(floorFilter), [floorFilter]);
  const filteredFloors = useMemo(() => selBuilding.floors.filter((f) => floorMatcher(f.number)), [floorMatcher, selBuilding]);

  useEffect(() => { if (!filteredFloors.length || filteredFloors.some((f) => f.number === selFloor)) return; setSelFloor(filteredFloors[0].number); setSelFlatId(null); }, [filteredFloors, selFloor]);

  const selFloorData = useMemo(() => selBuilding.floors.find((f) => f.number === selFloor) || selBuilding.floors[0], [selBuilding, selFloor]);
  const filteredFlats = useMemo(() => {
    const cap = budgetCap * 100000;
    return selFloorData.flats.filter((f) => {
      if (f.price > cap) return false;
      if (areaFilter === 'compact') return f.area <= 650;
      if (areaFilter === 'family') return f.area > 650 && f.area <= 850;
      if (areaFilter === 'premium') return f.area > 850;
      return true;
    });
  }, [areaFilter, budgetCap, selFloorData.flats]);

  const selFlat = selFloorData.flats.find((f) => f.id === selFlatId) || selBuilding.floors.flatMap((f) => f.flats).find((f) => f.id === selFlatId) || null;

  useEffect(() => { if (selFlat && !filteredFlats.some((f) => f.id === selFlat.id)) setSelFlatId(null); }, [filteredFlats, selFlat]);

  useEffect(() => { if (!selFlat) { setResEnd(null); setRemaining(15 * 60 * 1000); return; } setResEnd(new Date(Date.now() + 15 * 60 * 1000).toISOString()); }, [selFlatId]);
  useEffect(() => { if (!resEnd) return; const tick = () => setRemaining(Math.max(0, new Date(resEnd).getTime() - Date.now())); tick(); const id = setInterval(tick, 1000); return () => clearInterval(id); }, [resEnd]);

  const projStats = useMemo(() => selProject.buildings.reduce((t, b) => { b.floors.forEach((f) => f.flats.forEach((u) => { t[u.status] = (t[u.status] || 0) + 1; })); return t; }, { available: 0, held: 0, sold: 0 }), [selProject]);

  const pickProject = useCallback((id) => { const p = projectCatalog.find((x) => x.id === id); if (!p) return; setHasMapInteracted(true); setSelProjId(id); setSelBldgId(p.buildings[0].id); setSelFloor(1); setSelFlatId(null); }, [projectCatalog]);
  const pickBuilding = useCallback((id) => { setSelBldgId(id); setSelFloor(1); setSelFlatId(null); }, []);
  const pickFloor = useCallback((n) => { setSelFloor(n); setSelFlatId(null); }, []);
  const pickFlat = useCallback((f) => { if (f.status !== 'available' && f.id !== selFlatId) return; setSelFlatId(f.id); }, [selFlatId]);

  const handleConfirm = async () => {
    if (!selFlat) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    const payload = { ...selFlat, tower: selBuilding.name, buildingId: selBuilding.id, floor: selFloorData.number, location: { id: selProject.id, name: selProject.name, locality: selProject.locality, accent: selProject.accent } };
    updateApplicationData({ flatSelected: payload, flatLocked: { ...payload, lockedAt: new Date().toISOString(), expiresAt: resEnd || new Date(Date.now() + 15 * 60 * 1000).toISOString() } });
    setIsSubmitting(false);
    navigate('/application/13');
  };

  const timerSec = Math.floor(remaining / 1000);
  const isUrgent = selFlat && timerSec <= 120;
  const isExpired = selFlat && remaining <= 0;

  /* ─── card base classes ─── */
  const cardCls = isDark
    ? 'rounded-2xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-md'
    : 'rounded-2xl border border-slate-200 bg-white shadow-sm';
  const sectionCls = isDark
    ? 'rounded-3xl border border-slate-700/60 bg-slate-950/60 backdrop-blur-lg shadow-[0_20px_60px_rgba(2,6,23,.2)]'
    : 'rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_16px_48px_rgba(15,23,42,.05)]';
  const labelCls = `text-[10px] font-bold uppercase tracking-[.24em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`;

  const renderFloorPlanSvg = (maxW) => (
    <svg viewBox="0 0 320 390" className="w-full" style={{ maxWidth: maxW, margin: '0 auto', display: 'block' }}>
      <defs>
        {selFloorData.flats.map((flat) => {
          const tone = getStatusTone(flat.status, flat.id === selFlatId);
          return (
            <filter key={`g-${flat.id}`} id={`g-${flat.id}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="b" /><feFlood floodColor={tone.glow} result="c" /><feComposite in="c" in2="b" operator="in" result="s" />
              <feMerge><feMergeNode in="s" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          );
        })}
      </defs>
      <rect x="6" y="6" width="308" height="378" rx="20" fill={isDark ? '#0f172a' : '#f8fafc'} stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth="1.5" />
      <rect x="140" y="30" width="40" height="300" rx="10" fill={isDark ? '#1e293b' : '#e2e8f0'} stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="1" />
      <text x="160" y="182" textAnchor="middle" fontSize="8" fill={isDark ? '#475569' : '#94a3b8'} fontWeight="700" letterSpacing=".1em">CORRIDOR</text>
      <rect x="140" y="340" width="40" height="26" rx="8" fill={isDark ? '#334155' : '#cbd5e1'} />
      <text x="160" y="357" textAnchor="middle" fontSize="7" fill={isDark ? '#e2e8f0' : '#475569'} fontWeight="700">LIFT</text>
      {selFloorData.flats.map((flat) => {
        const isSel = flat.id === selFlatId;
        const isHov = flat.id === hoverFlatId;
        const tone = getStatusTone(flat.status, isSel);
        const isVis = filteredFlats.some((x) => x.id === flat.id);
        const cx = flat.slot.x + flat.slot.width / 2;
        return (
          <g key={flat.id} onClick={() => isVis && pickFlat(flat)} onMouseEnter={() => setHoverFlatId(flat.id)} onMouseLeave={() => setHoverFlatId(null)} className={isVis ? 'cursor-pointer' : 'pointer-events-none opacity-20'} style={{ transition: 'opacity .25s' }}>
            <rect x={flat.slot.x} y={flat.slot.y} width={flat.slot.width} height={flat.slot.height} rx="14" fill={tone.fill} stroke={tone.stroke} strokeWidth={isSel ? '3' : isHov ? '2' : '1.2'} opacity={isVis ? (isSel ? 1 : isHov ? .95 : .85) : .2} filter={isSel || isHov ? `url(#g-${flat.id})` : undefined} style={{ transition: 'all .2s' }} />
            {isSel && <rect x={flat.slot.x + 6} y={flat.slot.y + 6} width="32" height="12" rx="6" fill="rgba(0,0,0,.5)" />}
            {isSel && <text x={flat.slot.x + 22} y={flat.slot.y + 15} textAnchor="middle" fontSize="6" fill="#fff" fontWeight="800">ACTIVE</text>}
            <text x={cx} y={flat.slot.y + 22} textAnchor="middle" fontSize="9" fill="#fff" fontWeight="800">{flat.label}</text>
            <text x={cx} y={flat.slot.y + 36} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,.9)" fontWeight="700">{flat.type}</text>
            <text x={cx} y={flat.slot.y + 48} textAnchor="middle" fontSize="7" fill="rgba(255,255,255,.75)" fontWeight="600">{flat.area} sq.ft</text>
            <rect x={cx - 28} y={flat.slot.y + 53} width="56" height="13" rx="6.5" fill="rgba(0,0,0,.22)" />
            <text x={cx} y={flat.slot.y + 62.5} textAnchor="middle" fontSize="6.5" fill="#fff" fontWeight="700">{formatPrice(flat.price)}</text>
          </g>
        );
      })}
    </svg>
  );

  return (
    <ApplicationLayout stepNumber={11} title="Flat Selection" hideDefaultActions hideSectionHeader fullWidth>
      <div className="space-y-5">

        {/* ═══════ 1. COMPACT HERO BAR ═══════ */}
        <section className={`relative overflow-hidden rounded-2xl ${isDark ? 'bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border border-slate-700/60' : 'bg-gradient-to-r from-sky-50 via-white to-indigo-50 border border-slate-200/80'}`}>
          <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(ellipse_at_left,rgba(56,189,248,.1),transparent_50%)]' : 'bg-[radial-gradient(ellipse_at_left,rgba(14,165,233,.08),transparent_50%)]'}`} />
          <div className="relative flex flex-wrap items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${isDark ? 'bg-cyan-400/10 text-cyan-400' : 'bg-sky-100 text-sky-600'}`}>
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className={`text-lg font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Find your dream flat
                  <span className={`ml-2 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>— FCFS Booking</span>
                </h2>
                <Breadcrumb items={[selProject.name, selBuilding.name, `Floor ${selFloorData.number}`, selFlat?.id || '—']} isDark={isDark} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              {[
                { label: 'Available', value: projStats.available, color: 'text-emerald-500' },
                { label: 'Held', value: projStats.held, color: 'text-blue-400' },
                { label: 'Sold', value: projStats.sold, color: 'text-rose-400' },
              ].map((s) => (
                <div key={s.label} className={`flex items-center gap-2 rounded-xl px-3 py-2 ${isDark ? 'bg-white/5 border border-slate-700/50' : 'bg-white/80 border border-slate-200'}`}>
                  <span className={`text-lg font-black ${s.color}`}>{s.value}</span>
                  <span className={`text-[10px] uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ 2. MAIN TWO-COLUMN GRID ═══════ */}
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_380px]">

          {/* ─── LEFT COLUMN ─── */}
          <div className="space-y-5">

            {/* ═══════ MAP SECTION ═══════ */}
            <section className={sectionCls}>
              <div className={`flex flex-col gap-3 border-b px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${isDark ? 'border-slate-700/60' : 'border-slate-200/80'}`}>
                <div className="flex items-center gap-3">
                  <MapPin className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-sky-500'}`} />
                  <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Choose Project</h3>
                </div>
                <div className={`flex flex-wrap items-center gap-3 text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />Open</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" />Held</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" />Sold</span>
                </div>
              </div>
              <CityMapSVG projects={projectCatalog} selectedProjectId={selProject.id} onSelectProject={pickProject} onHoverProject={setHoveredProjectId} isDark={isDark} />
              {/* Compact project info footer */}
              <div className={`grid gap-3 border-t p-4 md:grid-cols-[1.2fr_1fr] ${isDark ? 'border-slate-700/60 bg-slate-950/50' : 'border-slate-200/80 bg-slate-50/50'}`}>
                {focusProject ? (
                  <>
                    <div>
                      <h4 className={`text-lg font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{focusProject.name}</h4>
                      <p className={`mt-0.5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{focusProject.locality}</p>
                      <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{focusProject.preview}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {[{ l: 'Best Fit', t: focusProject.fit }, { l: 'Commute', t: focusProject.commute }].map((d) => (
                        <div key={d.l} className={`rounded-lg p-2.5 ${isDark ? 'bg-slate-900/80 border border-slate-700/50' : 'bg-white border border-slate-200'}`}>
                          <p className={labelCls}>{d.l}</p>
                          <p className={`mt-0.5 text-xs leading-5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{d.t}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="col-span-full flex items-center gap-3">
                    <MapPin className={`h-5 w-5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Hover or click a project marker on the map to see details here.</p>
                  </div>
                )}
              </div>
            </section>

            {/* ═══════ UNIFIED SELECTION PANEL ═══════ */}
            <section className={sectionCls}>
              <div className={`flex flex-col gap-3 border-b px-4 py-3.5 sm:px-5 lg:flex-row lg:items-center lg:justify-between ${isDark ? 'border-slate-700/60' : 'border-slate-200/80'}`}>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Select Your Unit</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { label: selBuilding.name.replace('Building ', ''), step: '1', done: true },
                    { label: `Floor ${selFloorData.number}`, step: '2', done: true },
                    { label: selFlat ? selFlat.id : '—', step: '3', done: !!selFlat },
                  ].map((s) => (
                    <div key={s.step} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                      s.done ? (isDark ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200' : 'border-sky-200 bg-sky-50 text-sky-700')
                             : (isDark ? 'border-slate-700/60 bg-slate-900 text-slate-500' : 'border-slate-200 bg-slate-50 text-slate-400')
                    }`}>
                      <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
                        s.done ? (isDark ? 'bg-cyan-400/20' : 'bg-sky-100') : (isDark ? 'bg-slate-800' : 'bg-slate-200')
                      }`}>{s.step}</span>
                      {s.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 p-4 sm:p-5">
                {/* Building Selection */}
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Building2 className={`h-3.5 w-3.5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                    <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Building</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:flex-wrap">
                    {selProject.buildings.map((b) => {
                      const avail = b.floors.flatMap((f) => f.flats).filter((u) => u.status === 'available').length;
                      const active = b.id === selBuilding.id;
                      return (
                        <button key={b.id} type="button" onClick={() => pickBuilding(b.id)}
                          className={`rounded-xl border px-4 py-2.5 text-left transition-all duration-200 ${
                            active
                              ? isDark ? 'border-blue-400/50 bg-blue-500/15 shadow-md shadow-blue-500/10' : 'border-blue-400 bg-blue-50 shadow-sm'
                              : isDark ? 'border-slate-700/60 bg-slate-900/60 hover:border-slate-500' : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{b.name.replace('Building ', '')}</p>
                          <p className={`mt-0.5 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{avail} open</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Floor Selection */}
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Layers3 className={`h-3.5 w-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
                    <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Floor</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
                    {filteredFloors.map((f) => {
                      const avail = f.flats.filter((u) => u.status === 'available').length;
                      const active = f.number === selFloorData.number;
                      return (
                        <button key={f.number} type="button" onClick={() => pickFloor(f.number)}
                          className={`min-w-[64px] rounded-xl border px-3 py-2 text-center transition-all duration-200 ${
                            active
                              ? isDark ? 'border-emerald-500/50 bg-emerald-500/15 shadow-md shadow-emerald-500/10' : 'border-emerald-400 bg-emerald-50 shadow-sm'
                              : isDark ? 'border-slate-700/60 bg-slate-900/60 hover:border-emerald-400/30' : 'border-slate-200 bg-white hover:border-emerald-200'
                          }`}
                        >
                          <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{f.number}</p>
                          <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{avail} open</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Filters Row */}
                <div>
                  <button type="button" onClick={() => setShowFilters(!showFilters)}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors sm:w-auto ${
                      isDark ? 'border-slate-700/60 bg-slate-900/60 text-slate-300 hover:border-slate-500' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Filter className="h-3 w-3" /> Filters
                    <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ${showFilters ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        <div className={cardCls + ' p-3'}>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}><IndianRupee className="mr-1 inline h-3 w-3" />Budget</span>
                            <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-white">{budgetCap}L</span>
                          </div>
                          <input type="range" min="35" max="90" step="5" value={budgetCap} onChange={(e) => setBudgetCap(+e.target.value)} className="mt-2 w-full accent-slate-700" />
                        </div>
                        <div className={cardCls + ' p-3'}>
                          <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Floor Band</span>
                          <select value={floorFilter} onChange={(e) => setFloorFilter(e.target.value)} className={`mt-1.5 w-full rounded-lg border px-2.5 py-2 text-xs font-medium outline-none ${isDark ? 'border-slate-700/60 bg-slate-950 text-slate-100' : 'border-slate-200 bg-white text-slate-800'}`}>
                            <option value="all">All floors</option>
                            <option value="low">Low (1-3)</option>
                            <option value="mid">Mid (4-7)</option>
                            <option value="high">High (8-10)</option>
                          </select>
                        </div>
                        <div className={cardCls + ' p-3'}>
                          <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Area Type</span>
                          <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} className={`mt-1.5 w-full rounded-lg border px-2.5 py-2 text-xs font-medium outline-none ${isDark ? 'border-slate-700/60 bg-slate-950 text-slate-100' : 'border-slate-200 bg-white text-slate-800'}`}>
                            <option value="all">All</option>
                            <option value="compact">Compact ≤650</option>
                            <option value="family">Family 650-850</option>
                            <option value="premium">Premium 850+</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floor Plan + Unit Cards */}
                <div className={`rounded-2xl border p-4 ${isDark ? 'border-slate-700/50 bg-slate-950/50' : 'border-slate-200/80 bg-slate-50/60'}`}>
                  <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <Home className={`h-3.5 w-3.5 ${isDark ? 'text-cyan-400' : 'text-sky-500'}`} />
                      <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Floor {selFloorData.number} — {selBuilding.name.replace('Building ', '')} Tower
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 sm:justify-end">
                      <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{filteredFlats.length} units</span>
                      <button type="button" onClick={() => setShowExpandedPlan(true)}
                        className={`rounded-lg border p-1.5 transition-colors ${isDark ? 'border-slate-700/60 bg-slate-900 text-slate-300 hover:border-slate-500' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                        <Maximize2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
                    {/* SVG Floor Plan */}
                    <div className={`rounded-xl border p-3 ${isDark ? 'border-slate-700/50 bg-slate-900/60' : 'border-slate-200 bg-white'}`}>
                      {renderFloorPlanSvg(480)}
                    </div>

                    {/* Unit Cards Grid */}
                    <div className="grid content-start gap-2 sm:grid-cols-2">
                      {filteredFlats.map((flat) => {
                        const isSel = flat.id === selFlatId;
                        const tone = getStatusTone(flat.status, isSel);
                        return (
                          <button key={flat.id} type="button" onClick={() => pickFlat(flat)} disabled={flat.status !== 'available' && !isSel}
                            className={`group rounded-xl border p-3 text-left transition-all duration-200 ${
                              isSel ? (isDark ? 'border-blue-400/50 bg-blue-500/10 ring-1 ring-blue-400/30' : 'border-blue-400 bg-blue-50 ring-1 ring-blue-300/40')
                              : flat.status !== 'available'
                                ? (isDark ? 'cursor-not-allowed border-slate-700/40 bg-slate-900/40 opacity-50' : 'cursor-not-allowed border-slate-200/60 bg-slate-50 opacity-50')
                                : (isDark ? 'border-slate-700/50 bg-slate-900/50 hover:border-slate-500' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm')
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{flat.id}</p>
                                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{flat.type} · {flat.area} sq.ft</p>
                              </div>
                              <span className={`rounded-md border px-1.5 py-0.5 text-[9px] font-bold ${tone.chipCls}`}>{tone.label}</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <span className={`text-xs font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{formatPrice(flat.price)}</span>
                              {isSel && <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />}
                            </div>
                          </button>
                        );
                      })}
                      {filteredFlats.length === 0 && (
                        <div className={`col-span-full rounded-xl border border-dashed p-6 text-center ${isDark ? 'border-slate-700/40' : 'border-slate-300'}`}>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No units match your filters.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ─── RIGHT COLUMN · STICKY SIDEBAR ─── */}
          <aside className="xl:sticky xl:top-6 xl:self-start">
            <div className={`overflow-hidden rounded-2xl border ${isDark ? 'border-slate-700/60 bg-gradient-to-b from-slate-900 via-[#0c1f38] to-slate-950' : 'border-slate-200 bg-gradient-to-b from-white via-slate-50 to-sky-50'}`}>
              <div className="h-1 bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400" />
              <div className={`p-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <p className={labelCls}>Booking Summary</p>

                {/* Timer */}
                <div className={`mt-3 rounded-xl border p-3.5 transition-colors duration-500 ${
                  isExpired ? 'border-red-500/30 bg-red-500/10' : isUrgent ? 'border-amber-500/30 bg-amber-500/10' : isDark ? 'border-slate-700/50 bg-white/5' : 'border-slate-200 bg-white/80'
                }`}>
                  <p className={`flex items-center gap-1.5 text-[10px] font-semibold ${isDark ? 'text-cyan-200/80' : 'text-sky-700'}`}>
                    <Timer className="h-3 w-3" /> Reservation Timer
                  </p>
                  <p className={`mt-1.5 font-mono text-3xl font-black tracking-tight ${isExpired ? 'text-red-400' : isUrgent ? 'animate-pulse text-amber-400' : isDark ? 'text-white' : 'text-slate-900'}`}>
                    {formatTime(remaining)}
                  </p>
                  <div className={`mt-2 h-1 overflow-hidden rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                    <div className={`h-full rounded-full transition-all duration-1000 ${isExpired ? 'bg-red-500' : isUrgent ? 'bg-amber-400' : 'bg-gradient-to-r from-cyan-400 to-violet-400'}`}
                      style={{ width: `${Math.min(100, (remaining / (15 * 60 * 1000)) * 100)}%` }} />
                  </div>
                  <p className={`mt-1.5 text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isExpired ? 'Timer expired — please select again.' : selFlat ? 'Unit held while you review.' : 'Select a unit to start timer.'}
                  </p>
                </div>

                {/* Selection Path */}
                <div className="mt-3 space-y-1.5">
                  {[
                    { label: 'Project', value: selProject.name, sub: selProject.locality },
                    { label: 'Building', value: selBuilding.name },
                    { label: 'Floor', value: `Floor ${selFloorData.number}` },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-lg border p-2.5 ${isDark ? 'border-slate-700/50 bg-white/[.04]' : 'border-slate-200 bg-white/80'}`}>
                      <p className={labelCls}>{item.label}</p>
                      <p className={`mt-0.5 text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.value}</p>
                      {item.sub && <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.sub}</p>}
                    </div>
                  ))}
                </div>

                {/* Selected Flat */}
                <div className={`mt-3 rounded-xl border p-3.5 ${isDark ? 'border-slate-700/50 bg-white/[.04]' : 'border-slate-200 bg-white/80'}`}>
                  <p className={`flex items-center gap-1.5 text-[10px] font-semibold ${isDark ? 'text-cyan-200/80' : 'text-sky-700'}`}>
                    <Home className="h-3 w-3" /> Selected Flat
                  </p>
                  {selFlat ? (
                    <div className="mt-2 space-y-2">
                      <div className={`rounded-lg p-3 ${isDark ? 'bg-slate-950/40' : 'bg-slate-100'}`}>
                        <p className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{selFlat.id}</p>
                        <p className={`mt-0.5 text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{selFlat.type} · {selFlat.area} sq.ft · {selFlat.facing}</p>
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div className={`rounded-lg p-2.5 ${isDark ? 'bg-slate-950/40' : 'bg-slate-100'}`}>
                          <p className={labelCls}>Price</p>
                          <p className={`mt-0.5 flex items-center gap-0.5 text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            <IndianRupee className="h-3 w-3 text-emerald-400" />{formatPrice(selFlat.price).replace('₹', '')}
                          </p>
                        </div>
                        <div className={`rounded-lg p-2.5 ${isDark ? 'bg-slate-950/40' : 'bg-slate-100'}`}>
                          <p className={labelCls}>Facing</p>
                          <p className={`mt-0.5 text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selFlat.facing.replace(' Facing', '')}</p>
                        </div>
                      </div>
                      <div className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-2.5">
                        <p className="text-[10px] uppercase tracking-wide text-emerald-400">Status</p>
                        <p className="mt-0.5 text-xs font-bold text-emerald-300">Ready to reserve</p>
                      </div>
                    </div>
                  ) : (
                    <div className={`mt-2 rounded-lg border border-dashed p-4 text-center ${isDark ? 'border-white/10' : 'border-slate-300'}`}>
                      <Home className={`mx-auto h-6 w-6 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                      <p className={`mt-1.5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Select a green unit to see details.</p>
                    </div>
                  )}
                </div>

                {/* Guide */}
                <div className={`mt-3 rounded-lg border p-3 ${isDark ? 'border-cyan-400/15 bg-cyan-400/[.05]' : 'border-sky-200 bg-sky-50/80'}`}>
                  <p className={`flex items-center gap-1 text-[10px] font-semibold ${isDark ? 'text-cyan-200/80' : 'text-sky-700'}`}>
                    <Compass className="h-3 w-3" /> Guide
                  </p>
                  <p className={`mt-1 text-xs leading-relaxed ${isDark ? 'text-cyan-50/80' : 'text-slate-700'}`}>{selProject.fit}</p>
                </div>

                {/* CTA */}
                <button type="button" onClick={handleConfirm} disabled={!selFlat || isSubmitting || isExpired}
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-black transition-all duration-200 hover:translate-y-[-1px] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 ${
                    isDark ? 'bg-gradient-to-r from-white to-slate-100 text-slate-900 shadow-lg shadow-white/10' : 'bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-lg shadow-slate-300/50'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isSubmitting ? 'Reserving…' : isExpired ? 'Timer Expired' : 'Confirm & Pay'}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ═══════ EXPANDED PLAN MODAL ═══════ */}
      {showExpandedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className={`relative w-full max-w-4xl rounded-2xl border p-5 shadow-2xl ${isDark ? 'border-slate-700/60 bg-slate-950' : 'border-slate-200 bg-white'}`}>
            <button type="button" onClick={() => setShowExpandedPlan(false)} className={`absolute right-3 top-3 rounded-lg border p-2 transition-colors ${isDark ? 'border-slate-700/60 bg-slate-900 text-slate-200 hover:border-slate-500' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
              <X className="h-4 w-4" />
            </button>
            <p className={labelCls}>Expanded Floor Plan</p>
            <h3 className={`mt-1 text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selBuilding.name} · Floor {selFloorData.number}</h3>
            <div className={`mt-4 rounded-xl border p-4 ${isDark ? 'border-slate-700/50 bg-slate-900/60' : 'border-slate-200 bg-slate-50'}`}>
              {renderFloorPlanSvg(780)}
            </div>
          </div>
        </div>
      )}
    </ApplicationLayout>
  );
};

export default FlatSelection;
