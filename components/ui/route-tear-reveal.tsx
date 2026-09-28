'use client';

import * as React from 'react';

/**
 * El papel de AMC se rasga al scrollear y por la grieta sale alguien
 * derrapando en moto: polvo, piedras y huella de goma sobre la ruta.
 *
 * Todo es SVG dibujado con números, salvo la foto de fondo que ya vive
 * en /images. Sin var() en atributos SVG ni filtros por cuadro: Safari
 * en iPhone no dibuja lo primero y se arrastra con lo segundo.
 */

export type Pt = [number, number];

export interface RouteTearRevealProps {
  /** Progreso manual del desgarro (0..1). Si no se pasa, lo maneja el scroll. */
  progress?: number;
  className?: string;
}

/* ---------------------------------------------------------------- colores */

const PAPER = '#f0eee7';
const INK = '#141512';
const GOLD = '#b2976c';
const DARK = '#0d0e0b';
const RIM = '#c8ab77';

/* ------------------------------------------------------------------- math */

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
    crack: smooth(0.02, 0.14, p), // la grieta sale del centro del texto
    open: smooth(0.12, 0.52, p), // el papel se parte y las mitades se separan
    ride: smooth(0.16, 0.7, p), // la moto entra derrapando
    dust: smooth(0.2, 0.8, p), // la polvareda crece
    shake: smooth(0.1, 0.16, p) * (1 - smooth(0.2, 0.3, p)), // el tirón del rasgado
  };
}

/** El desgarro de lado a lado: diagonal leve, ondas, fibras y algún diente. */
function tearLine(seed = 17, from = -900, to = 1900, step = 11, cx = 500, cy = 336, angle = -5): Pt[] {
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
    top: { dx: -14 * open, dy: -105 * open, rot: -1.8 * open },
    bottom: { dx: 16 * open, dy: 115 * open, rot: 1.6 * open },
  };
}

/** Ancho del alma blanca del papel que queda expuesta en el borde roto. */
function fibreWidths(n: number, open: number, seed = 5) {
  const r = rng(seed);
  const k = Math.min(1, open * 4);
  return Array.from({ length: n }, (_, i) => k * (2.5 + 6 * (0.5 + 0.5 * Math.sin(i * 0.37 + seed)) * (0.6 + r() * 0.8)));
}

/* --------------------------------------------------------------- geometría */

const VIEW_W = 1000;
const CX = 500;
const CY = 336;
const FAR = 4000;
const FRAME = '30 42 940 556';
const GROUND = 452; // por dónde pisa la rueda dentro del hueco

const lineCache = new WeakMap<Pt[], string>();
function lineD(pts: Pt[]) {
  let s = lineCache.get(pts);
  if (!s) {
    s = d(pts, false);
    lineCache.set(pts, s);
  }
  return s;
}

const d = (pts: Pt[], close = true) =>
  'M' + pts.map(([x, y]) => x.toFixed(1) + ' ' + y.toFixed(1)).join('L') + (close ? 'Z' : '');

/* ------------------------------------------------------------------- moto */

function Wheel({ cx, cy, r, back, animated }: { cx: number; cy: number; r: number; back?: boolean; animated: boolean }) {
  return (
    <g transform={'translate(' + cx + ' ' + cy + ')'}>
      <circle r={r} fill="none" stroke={DARK} strokeWidth={r * 0.39} />
      <circle r={r * 0.83} fill="none" stroke={RIM} strokeWidth={2} opacity={0.5} />
      <circle r={r * 0.15} fill={DARK} />
      <g stroke={DARK} strokeWidth={r * 0.074} opacity={0.9}>
        {animated ? (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={(back ? 360 : 0) + ' 0 0'}
            to={(back ? 0 : 360) + ' 0 0'}
            dur="0.8s"
            repeatCount="indefinite"
          />
        ) : null}
        <path
          d={'M0 ' + -r * 0.81 + ' V' + r * 0.81 + ' M' + -r * 0.81 + ' 0 H' + r * 0.81 +
            ' M' + -r * 0.57 + ' ' + -r * 0.57 + ' L' + r * 0.57 + ' ' + r * 0.57 +
            ' M' + r * 0.57 + ' ' + -r * 0.57 + ' L' + -r * 0.57 + ' ' + r * 0.57}
        />
      </g>
    </g>
  );
}

/** Moto de aventura y quien la maneja, de perfil, cruzada en pleno derrape. */
const Rider = React.memo(function Rider({ animated }: { animated: boolean }) {
  return (
    <g fill={DARK} strokeLinecap="round" strokeLinejoin="round">
      <Wheel cx={-130} cy={-54} r={54} back animated={animated} />
      <Wheel cx={130} cy={-54} r={54} animated={animated} />
      {/* basculante y escape */}
      <path d="M-130 -54 L-28 -84" stroke={DARK} strokeWidth={13} fill="none" />
      <path d="M-16 -104 L-88 -122" stroke={DARK} strokeWidth={17} fill="none" />
      {/* motor */}
      <path d="M-30 -86 L-26 -130 L34 -134 L52 -110 L42 -82 L-8 -74 Z" />
      {/* cola, asiento, tanque y trompa */}
      <path
        d="M-134 -190 L-96 -168 L-44 -150 L-6 -178 L36 -182 L66 -168 L88 -146 L120 -128
           L118 -114 L74 -124 L34 -128 L-2 -140 L-52 -134 L-104 -148 L-132 -166 Z"
      />
      {/* chasis */}
      <path d="M-40 -142 L-10 -96 M20 -140 L44 -104" stroke={DARK} strokeWidth={9} fill="none" />
      {/* horquilla */}
      <path d="M128 -60 L92 -182" stroke={DARK} strokeWidth={12} fill="none" />
      <path d="M142 -62 L104 -184" stroke={DARK} strokeWidth={7} fill="none" opacity={0.9} />
      {/* guardabarros alto */}
      <path d="M74 -116 Q130 -166 186 -110 L176 -100 Q130 -146 82 -104 Z" />
      {/* manubrio, parabrisas y faro */}
      <path d="M60 -198 L126 -210" stroke={DARK} strokeWidth={11} fill="none" />
      <path d="M92 -190 L112 -232 L128 -226 L108 -186 Z" />
      <path d="M112 -200 L140 -192 L136 -166 L110 -174 Z" fill={RIM} opacity={0.85} />
      {/* quien maneja: pierna de adentro afuera, cuerpo adelantado */}
      <path d="M-52 -168 L-4 -118 L10 -72" stroke={DARK} strokeWidth={27} fill="none" />
      <path d="M-48 -172 L44 -146 L116 -96" stroke={DARK} strokeWidth={25} fill="none" />
      <path d="M118 -96 L138 -104" stroke={DARK} strokeWidth={15} fill="none" />
      <path d="M-56 -176 Q-20 -232 26 -266" stroke={DARK} strokeWidth={46} fill="none" />
      <path d="M28 -262 L74 -238 L116 -210" stroke={DARK} strokeWidth={18} fill="none" />
      <path d="M-46 -214 Q-30 -252 -2 -272" stroke={DARK} strokeWidth={26} fill="none" />
      <circle cx={48} cy={-284} r={30} />
      <path d="M62 -300 Q88 -292 82 -270 L56 -266 Z" fill={RIM} opacity={0.6} />
      <path d="M22 -300 Q50 -318 78 -300" stroke={RIM} strokeWidth={2.5} fill="none" opacity={0.5} />
    </g>
  );
});

/* ---------------------------------------------------------------- polvareda */

const DUST = Array.from({ length: 24 }, (_, i) => {
  const r = rng(i * 7 + 3);
  return { x: -60 - r() * 420, y: -20 - r() * 150, r: 40 + r() * 92, o: 0.26 + r() * 0.48 };
});

const GRAVEL = Array.from({ length: 16 }, (_, i) => {
  const r = rng(i * 13 + 11);
  return { x: -40 - r() * 320, y: -8 - r() * 185, s: 3 + r() * 5, o: 0.35 + r() * 0.55 };
});

const Dust = React.memo(function Dust({ id, animated }: { id: string; animated: boolean }) {
  return (
    <g>
      <g>
        {animated ? (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="-8 5; 12 -7; -8 5"
            dur="3.4s"
            repeatCount="indefinite"
          />
        ) : null}
        {DUST.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={'url(#' + id + '-dust)'} opacity={p.o} />
        ))}
      </g>
      <g>
        {animated ? (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="10 -6; -10 6; 10 -6"
            dur="2.2s"
            repeatCount="indefinite"
          />
        ) : null}
        {GRAVEL.map((p, i) => (
          <rect key={i} x={p.x} y={p.y} width={p.s} height={p.s} fill="#e9e2d2" opacity={p.o} />
        ))}
      </g>
    </g>
  );
});

/* ------------------------------------------------------------------- papel */

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

const Half = React.memo(function Half({
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
  // el recorte de cada mitad no cambia nunca: se arma una sola vez
  const clipD = React.useMemo(() => {
    const shape = up
      ? [[line[0][0], -FAR] as Pt, [line[line.length - 1][0], -FAR] as Pt, ...[...line].reverse()]
      : [...line, [line[line.length - 1][0], FAR] as Pt, [line[0][0], FAR] as Pt];
    return d(shape);
  }, [line, up]);
  // el alma blanca y los dobleces se ensanchan al principio y después quedan fijos:
  // se redondea el avance para no rehacer cientos de puntos en cada cuadro
  const k = Math.round(Math.min(1, open * 4) * 10) / 10;
  const curl = Math.round(Math.min(1, open * 2.5) * 10) / 10;
  const coreD = React.useMemo(() => {
    const widths = fibreWidths(line.length, k / 4, up ? 5 : 8);
    return d(line.concat(line.map(([x, y], i) => [x, y + (up ? -widths[i] : widths[i])] as Pt).reverse()));
  }, [line, k, up]);
  const curls = React.useMemo(
    () =>
      CURLS[side].map(([cx, hw, depth]) => {
        const pts = line.filter(([x]) => Math.abs(x - cx) <= hw);
        const back = pts.map(([x, y]) => {
          const t = Math.cos(((x - cx) / hw) * (Math.PI / 2));
          return [x + (up ? 5 : -5) * t * curl, y + (up ? 1 : -1) * depth * t * t * curl] as Pt;
        });
        return d(pts.concat(back.reverse()));
      }),
    [line, side, up, curl],
  );
  const transform =
    'translate(' + m.dx.toFixed(2) + ' ' + m.dy.toFixed(2) + ') rotate(' + m.rot.toFixed(3) + ' ' + CX + ' ' + CY + ')';
  const clip = id + '-' + side;
  const shadow = 0.36 * Math.min(1, open * 3);
  return (
    <g transform={transform}>
      {/* la sombra de esta mitad sobre la ruta */}
      {open > 0 ? (
        <>
          <path
            d={lineD(line)}
            fill="none"
            stroke="#000"
            strokeOpacity={shadow}
            strokeWidth={30}
            transform={'translate(0 ' + (up ? 16 : -16) + ')'}
          />
          <path
            d={lineD(line)}
            fill="none"
            stroke="#000"
            strokeOpacity={shadow * 0.8}
            strokeWidth={16}
            transform={'translate(0 ' + (up ? 8 : -8) + ')'}
          />
        </>
      ) : null}
      <clipPath id={clip}>
        <path d={clipD} />
      </clipPath>
      <g clipPath={'url(#' + clip + ')'}>{children}</g>
      {open > 0 ? (
        <>
          <path d={coreD} fill="#fbfaf6" />
          {curls.map((c, i) => (
            <path key={i} d={c} fill={'url(#' + id + '-curl-' + side + ')'} stroke="#fff" strokeWidth={1} />
          ))}
        </>
      ) : null}
    </g>
  );
});

/* --------------------------------------------------------------- componente */

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

export default function RouteTearReveal({ progress, className = '' }: RouteTearRevealProps) {
  const rootRef = React.useRef<HTMLElement | null>(null);
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const id = 'amc' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const line = React.useMemo(() => tearLine(), []);
  const [p, setP] = React.useState(progress ?? 0);
  const [box, setBox] = React.useState(FRAME);

  const controlled = progress !== undefined;
  const cfg = React.useRef({ progress, controlled, reduced });
  cfg.current = { progress, controlled, reduced };

  // el viewBox sigue la forma del escenario, para que el afiche entre entero
  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const fit = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      if (!w || !h) return;
      const aspect = w / h;
      const vw = Math.min(2400, Math.max(760, 780 * aspect));
      const vh = vw / aspect;
      setBox((CX - vw / 2).toFixed(0) + ' ' + (CY - vh / 2).toFixed(0) + ' ' + vw.toFixed(0) + ' ' + vh.toFixed(0));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  // el scroll maneja el desgarro; sin scroll no se redibuja nada
  React.useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    let raf = 0;
    let visible = true;
    let cur = cfg.current.progress ?? 0;
    let settled = false;

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      settled = false;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(root);

    function tick() {
      raf = 0;
      if (!visible) return;
      const c = cfg.current;
      const target = c.controlled
        ? clamp01(c.progress ?? 0)
        : scrollProgress(root!.getBoundingClientRect().top, root!.offsetHeight, stage!.offsetHeight);
      if (c.reduced) {
        if (!settled) {
          settled = true;
          setP(1);
        }
        raf = requestAnimationFrame(tick);
        return;
      }
      const next = Math.abs(target - cur) < 0.0008 ? target : cur + (target - cur) * 0.22;
      if (Math.abs(next - cur) > 0.0004) {
        cur = next;
        setP(Math.round(next * 1000) / 1000);
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const s = stages(p);
  const shake = reduced ? 0 : Math.sin(p * 900) * 6 * s.shake;
  const crackReach = s.crack * 650;
  const crack = line.filter(([x]) => Math.abs(x - CX) <= crackReach);

  // la moto entra desde la izquierda, se cruza y crece hacia quien mira
  const rx = 540 - (1 - s.ride) * 620;
  const rs = 0.38 + 0.25 * s.ride;
  const rrot = -17 + 10 * s.ride;
  const rider = 'translate(' + rx.toFixed(1) + ' ' + GROUND + ') scale(' + rs.toFixed(3) + ') rotate(' + rrot.toFixed(2) + ')';

  const sheet = (
    <>
      <rect x={-FAR} y={-FAR} width={FAR * 2 + VIEW_W} height={FAR * 2} fill={PAPER} />
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
        fill={INK}
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
        fill={INK}
        style={{ fontFamily: 'var(--title)', fontSize: 186, fontWeight: 600, letterSpacing: '-0.045em' }}
      >
        DE RUTA
      </text>
      <circle cx={CX + 312} cy={546} r={15} fill={GOLD} />
    </>
  );

  return (
    <section ref={rootRef} className={'tear ' + className} id="inicio" aria-labelledby="cover-title">
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
          </defs>

          <g transform={'translate(' + shake.toFixed(2) + ' ' + (shake * 0.4).toFixed(2) + ')'}>
            {/* detrás del papel: la ruta y quien sale derrapando */}
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
                  opacity={0.26}
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
                  <g opacity={s.dust}>
                    <Dust id={id} animated={!reduced} />
                  </g>
                  <Rider animated={!reduced} />
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

        <div className="tear-bottom" style={{ opacity: 0.3 + 0.7 * smooth(0.35, 0.7, p) }}>
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
