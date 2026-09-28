'use client';

import * as React from 'react';

/**
 * El papel de AMC se rasga al scrollear y por la grieta sale alguien
 * derrapando en moto: polvo, piedras y huella de goma sobre la ruta.
 *
 * Todo es SVG dibujado con números (el desgarro, la moto, la polvareda),
 * salvo la foto de fondo que ya vive en /images.
 */

export type Pt = [number, number];

export interface RouteTearRevealProps {
  /** Progreso manual del desgarro (0..1). Si no se pasa, lo maneja el scroll. */
  progress?: number;
  className?: string;
}

/* ------------------------------------------------------------------ math */

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (x: number) => (x <= 0 ? 0 : x > 1 ? 1 : x);

function smooth(a: number, b: number, x: number) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

function scrollProgress(top: number, height: number, viewport: number) {
  const range = height - viewport;
  if (range <= 0) return top <= 0 ? 1 : 0;
  return clamp01(-top / range);
}

/** Un solo valor de scroll maneja todos los tiempos. */
function stages(p: number) {
  return {
    crack: smooth(0.02, 0.18, p), // la grieta sale del centro del texto
    open: smooth(0.16, 0.66, p), // el papel se parte y las mitades se separan
    ride: smooth(0.2, 0.82, p), // la moto entra derrapando
    dust: smooth(0.26, 0.95, p), // la polvareda crece
    shake: smooth(0.14, 0.2, p) * (1 - smooth(0.24, 0.34, p)), // el tirón del rasgado
  };
}

/** El desgarro de lado a lado: diagonal leve, ondas, fibras y algún diente. */
function tearLine(seed = 17, from = -900, to = 1900, step = 9, cx = 500, cy = 336, angle = -5): Pt[] {
  const r = rng(seed);
  const slope = Math.tan((angle * Math.PI) / 180);
  const out: Pt[] = [];
  for (let x = from; x <= to; x += step) {
    const fibre = (r() - 0.5) * 5;
    const tooth = r() < 0.09 ? (r() - 0.5) * 26 : 0;
    const wander = Math.sin(x * 0.017 + seed) * 11 + Math.sin(x * 0.051 + seed * 2) * 4;
    out.push([x, cy + (x - cx) * slope + wander + fibre + tooth]);
  }
  return out;
}

/** A dónde va cada mitad del papel. */
function pieceMotion(open: number) {
  return {
    top: { dx: -14 * open, dy: -120 * open, rot: -2 * open },
    bottom: { dx: 16 * open, dy: 120 * open, rot: 1.6 * open },
  };
}

/** Ancho del alma blanca del papel que queda expuesta en el borde roto. */
function fibreWidths(n: number, open: number, seed = 5) {
  const r = rng(seed);
  const k = Math.min(1, open * 4);
  return Array.from({ length: n }, (_, i) => k * (2.5 + 6 * (0.5 + 0.5 * Math.sin(i * 0.37 + seed)) * (0.6 + r() * 0.8)));
}

/* -------------------------------------------------------------- geometría */

const VIEW_W = 1000;
const CX = 500;
const CY = 336;
const FAR = 4000;
const FRAME = '30 42 940 556';
const GROUND = 452; // por dónde pisa la rueda dentro del hueco

const d = (pts: Pt[], close = true) =>
  'M' + pts.map(([x, y]) => x.toFixed(1) + ' ' + y.toFixed(1)).join('L') + (close ? 'Z' : '');

/* ------------------------------------------------------------------ moto */

const INK = '#0d0e0b';
const RIM = '#c8ab77';

function Wheel({ cx, cy, r, spin }: { cx: number; cy: number; r: number; spin: number }) {
  return (
    <g transform={'translate(' + cx + ' ' + cy + ')'}>
      <circle r={r} fill="none" stroke={INK} strokeWidth={r * 0.39} />
      <circle r={r * 0.83} fill="none" stroke={RIM} strokeWidth={2} opacity={0.5} />
      <circle r={r * 0.15} fill={INK} />
      <g transform={'rotate(' + spin.toFixed(1) + ')'} stroke={INK} strokeWidth={r * 0.074} opacity={0.9}>
        <path
          d={'M0 ' + (-r * 0.81) + ' V' + r * 0.81 + ' M' + -r * 0.81 + ' 0 H' + r * 0.81 +
            ' M' + -r * 0.57 + ' ' + -r * 0.57 + ' L' + r * 0.57 + ' ' + r * 0.57 +
            ' M' + r * 0.57 + ' ' + -r * 0.57 + ' L' + -r * 0.57 + ' ' + r * 0.57}
        />
      </g>
    </g>
  );
}

/** Moto de aventura y quien la maneja, de perfil, cruzada en pleno derrape. */
function Rider({ spin }: { spin: number }) {
  return (
    <g fill={INK} strokeLinecap="round" strokeLinejoin="round">
      <Wheel cx={-130} cy={-54} r={54} spin={-spin} />
      <Wheel cx={130} cy={-54} r={54} spin={spin} />
      {/* basculante y escape */}
      <path d="M-130 -54 L-28 -84" stroke={INK} strokeWidth={13} fill="none" />
      <path d="M-16 -104 L-88 -122" stroke={INK} strokeWidth={17} fill="none" />
      {/* motor */}
      <path d="M-30 -86 L-26 -130 L34 -134 L52 -110 L42 -82 L-8 -74 Z" />
      {/* cola, asiento, tanque y trompa */}
      <path
        d="M-134 -190 L-96 -168 L-44 -150 L-6 -178 L36 -182 L66 -168 L88 -146 L120 -128
           L118 -114 L74 -124 L34 -128 L-2 -140 L-52 -134 L-104 -148 L-132 -166 Z"
      />
      {/* chasis */}
      <path d="M-40 -142 L-10 -96 M20 -140 L44 -104" stroke={INK} strokeWidth={9} fill="none" />
      {/* horquilla */}
      <path d="M128 -60 L92 -182" stroke={INK} strokeWidth={12} fill="none" />
      <path d="M142 -62 L104 -184" stroke={INK} strokeWidth={7} fill="none" opacity={0.9} />
      {/* guardabarros alto */}
      <path d="M74 -116 Q130 -166 186 -110 L176 -100 Q130 -146 82 -104 Z" />
      {/* manubrio, parabrisas y faro */}
      <path d="M60 -198 L126 -210" stroke={INK} strokeWidth={11} fill="none" />
      <path d="M92 -190 L112 -232 L128 -226 L108 -186 Z" />
      <path d="M112 -200 L140 -192 L136 -166 L110 -174 Z" fill={RIM} opacity={0.85} />
      {/* quien maneja: pierna de adentro afuera, cuerpo adelantado */}
      <path d="M-52 -168 L-4 -118 L10 -72" stroke={INK} strokeWidth={27} fill="none" />
      <path d="M-48 -172 L44 -146 L116 -96" stroke={INK} strokeWidth={25} fill="none" />
      <path d="M118 -96 L138 -104" stroke={INK} strokeWidth={15} fill="none" />
      <path d="M-56 -176 Q-20 -232 26 -266" stroke={INK} strokeWidth={46} fill="none" />
      <path d="M28 -262 L74 -238 L116 -210" stroke={INK} strokeWidth={18} fill="none" />
      <path d="M-46 -214 Q-30 -252 -2 -272" stroke={INK} strokeWidth={26} fill="none" />
      <circle cx={48} cy={-284} r={30} />
      <path d="M62 -300 Q88 -292 82 -270 L56 -266 Z" fill={RIM} opacity={0.6} />
      <path d="M22 -300 Q50 -318 78 -300" stroke={RIM} strokeWidth={2.5} fill="none" opacity={0.5} />
    </g>
  );
}

/* ------------------------------------------------------------- polvareda */

const DUST = Array.from({ length: 46 }, (_, i) => {
  const r = rng(i * 7 + 3);
  return {
    x: -60 - r() * 430,
    y: -20 - r() * 150,
    r: 34 + r() * 96,
    o: 0.26 + r() * 0.5,
    ph: r() * Math.PI * 2,
    sp: 0.4 + r() * 0.9,
  };
});

const GRAVEL = Array.from({ length: 34 }, (_, i) => {
  const r = rng(i * 13 + 11);
  return { x: -40 - r() * 330, y: -8 - r() * 190, s: 2 + r() * 5, o: 0.3 + r() * 0.6, ph: r() * 6.3 };
});

function Dust({ id, k, t }: { id: string; k: number; t: number }) {
  return (
    <g opacity={k}>
      {DUST.map((p, i) => (
        <circle
          key={i}
          cx={p.x * (0.45 + 0.55 * k) + Math.sin(t * 0.0009 * p.sp + p.ph) * 12}
          cy={p.y * (0.5 + 0.5 * k) + Math.cos(t * 0.0007 * p.sp + p.ph) * 8}
          r={p.r * (0.55 + 0.45 * k)}
          fill={'url(#' + id + '-dust)'}
          opacity={p.o}
        />
      ))}
      {GRAVEL.map((p, i) => (
        <rect
          key={i}
          x={p.x * (0.5 + 0.5 * k) + Math.sin(t * 0.002 + p.ph) * 16}
          y={p.y * (0.5 + 0.5 * k) + Math.cos(t * 0.0016 + p.ph) * 10}
          width={p.s}
          height={p.s}
          fill="#e9e2d2"
          opacity={p.o * k}
          transform={'rotate(' + ((t * 0.05 + i * 40) % 360).toFixed(0) + ' ' + p.x.toFixed(0) + ' ' + p.y.toFixed(0) + ')'}
        />
      ))}
    </g>
  );
}

/* ----------------------------------------------------------------- papel */

const CURLS: Record<'top' | 'bottom', [number, number, number][]> = {
  top: [
    [300, 44, 30],
    [575, 30, 20],
    [790, 52, 34],
  ],
  bottom: [
    [205, 50, 32],
    [470, 34, 22],
    [690, 40, 28],
  ],
};

function Half({
  id,
  side,
  line,
  open,
  children,
}: {
  id: string;
  side: 'top' | 'bottom';
  line: Pt[];
  open: number;
  children: React.ReactNode;
}) {
  const up = side === 'top';
  const m = pieceMotion(open)[side];
  const shape = up
    ? [[line[0][0], -FAR] as Pt, [line[line.length - 1][0], -FAR] as Pt, ...[...line].reverse()]
    : [...line, [line[line.length - 1][0], FAR] as Pt, [line[0][0], FAR] as Pt];
  const widths = fibreWidths(line.length, open, up ? 5 : 8);
  const core = line.concat(line.map(([x, y], i) => [x, y + (up ? -widths[i] : widths[i])] as Pt).reverse());
  const curls = CURLS[side].map(([cx, hw, depth]) => {
    const pts = line.filter(([x]) => Math.abs(x - cx) <= hw);
    const back = pts.map(([x, y]) => {
      const s = Math.cos(((x - cx) / hw) * (Math.PI / 2));
      return [x + (up ? 6 : -6) * s * open, y + (up ? 1 : -1) * depth * s * s * Math.min(1, open * 2.5)] as Pt;
    });
    return d(pts.concat(back.reverse()));
  });
  const transform =
    'translate(' + m.dx.toFixed(2) + ' ' + m.dy.toFixed(2) + ') rotate(' + m.rot.toFixed(3) + ' ' + CX + ' ' + CY + ')';
  const clip = id + '-' + side;
  return (
    <g transform={transform}>
      {open > 0 ? (
        <path
          d={d(line, false)}
          fill="none"
          stroke="#000"
          strokeOpacity={0.5 * Math.min(1, open * 3)}
          strokeWidth={24}
          transform={'translate(0 ' + (up ? 12 : -12) + ')'}
          filter={'url(#' + id + '-soft)'}
        />
      ) : null}
      <clipPath id={clip}>
        <path d={d(shape)} />
      </clipPath>
      <g clipPath={'url(#' + clip + ')'}>{children}</g>
      {open > 0 ? (
        <>
          <path d={d(core)} fill="#fbfaf6" />
          {curls.map((c, i) => (
            <path key={i} d={c} fill={'url(#' + id + '-curl-' + side + ')'} stroke="#fff" strokeWidth={1} />
          ))}
        </>
      ) : null}
    </g>
  );
}

/* ------------------------------------------------------------- componente */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return reduced;
}

type Frame = { p: number; t: number };

export default function RouteTearReveal({ progress, className = '' }: RouteTearRevealProps) {
  const rootRef = React.useRef<HTMLElement | null>(null);
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const id = 'amc' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const line = React.useMemo(() => tearLine(), []);
  const [f, setF] = React.useState<Frame>({ p: progress ?? 0, t: 0 });
  const [box, setBox] = React.useState(FRAME);

  const controlled = progress !== undefined;
  const cfg = React.useRef({ progress, controlled, reduced });
  cfg.current = { progress, controlled, reduced };

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const fit = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      if (!w || !h) return;
      const aspect = w / h;
      const vw = Math.min(1600, Math.max(700, 780 * aspect));
      const vh = vw / aspect;
      setBox((CX - vw / 2).toFixed(0) + ' ' + (CY - vh / 2).toFixed(0) + ' ' + vw.toFixed(0) + ' ' + vh.toFixed(0));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    let raf = 0;
    let visible = true;
    let p = cfg.current.progress ?? 0;
    let last: Frame | null = null;

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(root);

    function tick(now: number) {
      raf = 0;
      if (!visible) return;
      const c = cfg.current;
      const target = c.controlled
        ? clamp01(c.progress ?? 0)
        : scrollProgress(root!.getBoundingClientRect().top, root!.offsetHeight, stage!.offsetHeight);
      // sin animación: el afiche ya aparece abierto
      p = c.reduced ? 1 : p + (target - p) * 0.13;
      if (Math.abs(target - p) < 0.0005) p = target;

      const next: Frame = { p, t: c.reduced ? 0 : now };
      if (!last || Math.abs(next.p - last.p) > 1e-4 || next.t !== last.t) {
        last = next;
        setF(next);
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const s = stages(f.p);
  const shake = reduced ? 0 : Math.sin(f.p * 900) * 6 * s.shake;
  const idle = reduced ? 0 : Math.sin(f.t * 0.011) * 1.6 * s.ride;
  const crackReach = s.crack * 650;
  const crack = line.filter(([x]) => Math.abs(x - CX) <= crackReach);
  const spin = reduced ? 0 : (f.t * 0.24) % 360;

  // la moto entra desde la izquierda, se cruza y crece hacia quien mira
  const rx = 540 - (1 - s.ride) * 620;
  const rs = 0.38 + 0.25 * s.ride;
  const rrot = -17 + 10 * s.ride;
  const rider =
    'translate(' + rx.toFixed(1) + ' ' + (GROUND + idle).toFixed(1) + ') scale(' + rs.toFixed(3) + ') rotate(' + rrot.toFixed(2) + ')';

  const sheet = (
    <>
      <rect x={-FAR} y={-FAR} width={FAR * 2 + VIEW_W} height={FAR * 2} fill="var(--paper)" />
      <text
        x={CX}
        y={128}
        textAnchor="middle"
        fill="#6d6c62"
        style={{ font: '600 15px Arial, Helvetica, sans-serif', letterSpacing: '0.42em' }}
      >
        AMERICA MOTOR COMPANY
      </text>
      <text
        x={CX}
        y={292}
        textAnchor="middle"
        textLength={640}
        lengthAdjust="spacingAndGlyphs"
        fill="var(--ink)"
        style={{ fontFamily: 'var(--title)', fontSize: 186, fontWeight: 600, letterSpacing: '-0.045em' }}
      >
        CULTURA
      </text>
      <text
        x={CX - 22}
        y={556}
        textAnchor="middle"
        textLength={620}
        lengthAdjust="spacingAndGlyphs"
        fill="var(--ink)"
        style={{ fontFamily: 'var(--title)', fontSize: 186, fontWeight: 600, letterSpacing: '-0.045em' }}
      >
        DE RUTA
      </text>
      <circle cx={CX + 312} cy={546} r={15} fill="var(--gold)" />
    </>
  );

  return (
    <section
      ref={rootRef}
      className={'tear ' + className}
      id="inicio"
      aria-labelledby="cover-title"
    >
      <h1 id="cover-title" className="sr-only">
        Cultura de ruta. America Motor Company.
      </h1>
      <div ref={stageRef} className="tear-stage">
        <svg
          viewBox={box}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="El afiche de AMC se rasga y por la grieta sale alguien derrapando en moto."
          className="tear-svg"
        >
          <defs>
            <radialGradient id={id + '-dust'}>
              <stop offset="0" stopColor="#f3ead6" stopOpacity={0.95} />
              <stop offset="0.55" stopColor="#d3bd93" stopOpacity={0.45} />
              <stop offset="1" stopColor="#a08a63" stopOpacity={0} />
            </radialGradient>
            <radialGradient id={id + '-glow'} cx="0.5" cy="0.6" r="0.6">
              <stop offset="0" stopColor="#d8b271" stopOpacity={0.5} />
              <stop offset="1" stopColor="#11120e" stopOpacity={0} />
            </radialGradient>
            <linearGradient id={id + '-night'} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0e0f0c" />
              <stop offset="0.55" stopColor="#1d1a13" />
              <stop offset="1" stopColor="#0b0c09" />
            </linearGradient>
            <linearGradient id={id + '-curl-top'} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#d8d3c8" />
            </linearGradient>
            <linearGradient id={id + '-curl-bottom'} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#d8d3c8" />
            </linearGradient>
            <filter id={id + '-blur'} x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
            <filter id={id + '-soft'} x="-20%" y="-60%" width="140%" height="220%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
            <filter id={id + '-grain'} x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.22" />
              </feComponentTransfer>
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>

          <g transform={'translate(' + shake.toFixed(2) + ' ' + (shake * 0.4).toFixed(2) + ')'}>
            {/* detrás del papel: la ruta de noche y quien sale derrapando */}
            {s.open > 0 ? (
              <g>
                <rect x={-FAR} y={-FAR} width={FAR * 2 + VIEW_W} height={FAR * 2} fill={'url(#' + id + '-night)'} />
                <image
                  href="/images/editorial-ruta.webp"
                  x={0}
                  y={42}
                  width={1000}
                  height={556}
                  preserveAspectRatio="xMidYMid slice"
                  opacity={0.3}
                  filter={'url(#' + id + '-blur)'}
                />
                <rect x={0} y={42} width={1000} height={556} fill={'url(#' + id + '-glow)'} />
                {/* huella de goma sobre el asfalto */}
                <path
                  d={'M' + (rx - 700).toFixed(0) + ' ' + (GROUND + 12) + ' Q' + (rx - 330).toFixed(0) + ' ' + (GROUND - 16) + ' ' + (rx - 60).toFixed(0) + ' ' + (GROUND + 2)}
                  stroke="#070806"
                  strokeWidth={16}
                  fill="none"
                  opacity={0.55 * s.ride}
                  strokeLinecap="round"
                />
                <g transform={rider}>
                  <Dust id={id} k={s.dust} t={f.t} />
                  <Rider spin={spin} />
                </g>
              </g>
            ) : null}

            {/* el afiche: entero hasta que cede, después en dos mitades */}
            {s.open > 0 ? (
              <>
                <Half id={id} side="top" line={line} open={s.open}>
                  {sheet}
                </Half>
                <Half id={id} side="bottom" line={line} open={s.open}>
                  {sheet}
                </Half>
              </>
            ) : (
              sheet
            )}

            {/* la grieta, antes de que el papel ceda */}
            {s.crack > 0 && s.open < 0.15 && crack.length > 1 ? (
              <path
                d={d(crack, false)}
                fill="none"
                stroke="#1d0f07"
                strokeWidth={2.6}
                strokeLinejoin="bevel"
                opacity={1 - s.open / 0.15}
              />
            ) : null}
          </g>
        </svg>

        <div className="tear-top">
          <span>VILLA CIUDAD DE AMÉRICA, CÓRDOBA</span>
          <span>ROAD · MACHINE · SHELTER · COMMUNITY</span>
        </div>

        <div className="tear-bottom" style={{ opacity: 0.25 + 0.75 * smooth(0.45, 0.85, f.p) }}>
          <p>
            Un lugar para bajar de la moto.
            <br />Y sentir que llegaste.
          </p>
          <a className="round-link" href="#espiritu" aria-label="Entrá en AMC">
            <span>ENTRÁ EN AMC</span>
            <span className="circle">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </span>
          </a>
        </div>

        {!controlled ? (
          <div className="tear-hint" aria-hidden="true" style={{ opacity: Math.max(0, 0.75 - s.crack * 3) }}>
            DESLIZÁ
            <span />
          </div>
        ) : null}
      </div>
    </section>
  );
}
