"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { motion, useReducedMotion } from "framer-motion"

// Illustrations for the Core Features panel on the Tech4All page.
// Neutral ink and paper, with one accent colour per feature:
// Emotional AI rose, Voice Interface blue (Sparkie's), Adaptive Paths green, Meaningful Analytics violet.

const INK = "#171717"
const LINE = "#d4d4d4"
const SOFT = "#f5f5f5"
const PAPER = "#ffffff"
const BLUE = "#53A4E8"
const BLUE_SOFT = "#DCEAF9"
const PINK = "#E9AEBB"
const ROSE = "#E2728A"
const ROSE_SOFT = "#FCE7EC"
const GREEN = "#3FAF7F"
const GREEN_SOFT = "#DDF3E8"
const VIOLET = "#8B7BE0"
const VIOLET_SOFT = "#ECE9FB"

const EASE = [0.25, 0.46, 0.45, 0.94] as const

// Scale and rotate each shape around its own centre / base.
const centred: CSSProperties = { transformBox: "fill-box", transformOrigin: "center" }
const fromBottom: CSSProperties = { transformBox: "fill-box", transformOrigin: "bottom" }

export type IllustrationKind = "emotional" | "voice" | "paths" | "analytics"

const LABELS: Record<IllustrationKind, string> = {
  emotional:
    "Illustration: the AI reads a stressed student's face; as the pace eases, the mood gauge swings from stressed to calm, the heartbeat settles and the student smiles.",
  voice:
    "Illustration: a student says 'I don't understand fractions', the AI answers 'Let's build a pizza together!', and a pizza is built slice by slice, in English or Chinese.",
  paths: "Illustration: one student, three different learning routes, all reaching the same goal.",
  analytics: "Illustration: a progress chart rising, protected by a privacy shield that keeps the student's data safe.",
}

export function FeatureIllustration({ kind }: { kind: IllustrationKind }) {
  const Illustration = {
    emotional: EmotionalAI,
    voice: VoiceInterface,
    paths: AdaptivePaths,
    analytics: MeaningfulAnalytics,
  }[kind]

  return (
    <svg viewBox="0 0 360 260" className="w-full h-auto" role="img" aria-label={LABELS[kind]}>
      <Illustration />
    </svg>
  )
}

// ============================================================================
// EMOTIONAL AI: stressed -> calm, on a loop
// ============================================================================

// Heartbeat trace (two beats per pass), drawn over and over.
const ECG =
  "M24 226 H92 l6 -10 l6 10 h8 l7 -30 l9 52 l7 -32 l5 10 h22 l6 -8 l6 8 H222 l6 -10 l6 10 h8 l7 -30 l9 52 l7 -32 l5 10 h22 l6 -8 l6 8 H336"

// Mood gauge: a half circle from stressed (left) to calm (right).
const GAUGE = { cx: 286, cy: 104, r: 42 }
const gaugePoint = (t: number) => {
  const a = Math.PI + t * Math.PI
  return `${(GAUGE.cx + GAUGE.r * Math.cos(a)).toFixed(1)} ${(GAUGE.cy + GAUGE.r * Math.sin(a)).toFixed(1)}`
}
const gaugeArc = (from: number, to: number) => `M${gaugePoint(from)} A${GAUGE.r} ${GAUGE.r} 0 0 1 ${gaugePoint(to)}`

const SPARKLE = "M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z"
const AMBER = "#F2C46D"

function EmotionalAI() {
  const reduce = useReducedMotion()
  const loop = { duration: 7, times: [0, 0.3, 0.45, 0.9, 1], repeat: Infinity, ease: "easeInOut" as const }
  // Stressed first, then calm; reduced motion shows the calm state only.
  const kf = <T,>(stressed: T, calm: T) => (reduce ? calm : [stressed, stressed, calm, calm, stressed])
  const transition = reduce ? { duration: 0 } : loop

  return (
    <g>
      {/* Soft glow behind the student */}
      <circle cx={112} cy={108} r={74} fill={ROSE_SOFT} opacity={0.7} />

      {/* Student */}
      <motion.g
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={centred}
      >
        <circle cx={112} cy={108} r={52} fill="#FFF6F0" stroke={INK} strokeWidth={2.5} />
        <path
          d="M64 100 C62 66 88 52 112 52 C138 52 162 66 160 100 C148 86 130 80 112 82 C94 80 76 86 64 100 Z"
          fill={INK}
        />
      </motion.g>
      <motion.circle cx={84} cy={126} r={8} fill={PINK} animate={{ opacity: kf(0.15, 0.8) }} transition={transition} />
      <motion.circle cx={140} cy={126} r={8} fill={PINK} animate={{ opacity: kf(0.15, 0.8) }} transition={transition} />
      <ellipse cx={95} cy={111} rx={5} ry={6.5} fill={INK} />
      <ellipse cx={129} cy={111} rx={5} ry={6.5} fill={INK} />
      {/* Brows: worried (inner ends raised), then relaxed */}
      <motion.path
        initial={{ d: reduce ? "M82 96 L104 94" : "M82 100 L104 92" }}
        animate={{ d: kf("M82 100 L104 92", "M82 96 L104 94") }}
        transition={transition}
        stroke={INK}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <motion.path
        initial={{ d: reduce ? "M142 96 L120 94" : "M142 100 L120 92" }}
        animate={{ d: kf("M142 100 L120 92", "M142 96 L120 94") }}
        transition={transition}
        stroke={INK}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <motion.path
        initial={{ d: reduce ? "M97 134 Q112 150 127 134" : "M97 140 Q112 130 127 140" }}
        animate={{ d: kf("M97 140 Q112 130 127 140", "M97 134 Q112 150 127 134") }}
        transition={transition}
        stroke={INK}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
      {/* Sweat drop while stressed */}
      <motion.path
        d="M168 78 C163 87 161 92 168 95 C175 92 173 87 168 78 Z"
        fill={BLUE_SOFT}
        stroke={BLUE}
        strokeWidth={1.5}
        animate={{ opacity: kf(1, 0) }}
        transition={transition}
      />

      {/* Face tracking: corner brackets and a sweeping scan line */}
      {["M48 60 V44 H64", "M160 44 H176 V60", "M176 156 V172 H160", "M64 172 H48 V156"].map((d) => (
        <path key={d} d={d} fill="none" stroke={ROSE} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {!reduce && (
        <motion.line
          x1={54}
          x2={170}
          stroke={ROSE}
          strokeWidth={2}
          strokeLinecap="round"
          initial={{ y1: 50, y2: 50, opacity: 0 }}
          animate={{ y1: [50, 166, 50], y2: [50, 166, 50], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Celebration sparkles once calm */}
      {[
        { x: 190, y: 60, color: AMBER, size: 1 },
        { x: 34, y: 128, color: GREEN, size: 0.8 },
        { x: 190, y: 150, color: ROSE, size: 0.7 },
      ].map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y}) scale(${s.size})`}>
          <motion.path
            d={SPARKLE}
            fill={s.color}
            animate={{ opacity: kf(0, 1) }}
            transition={reduce ? { duration: 0 } : { ...loop, delay: i * 0.15 }}
          />
        </g>
      ))}

      {/* Mood gauge: the needle swings from stressed to calm */}
      <path d={gaugeArc(0, 0.32)} fill="none" stroke={ROSE} strokeWidth={10} strokeLinecap="round" />
      <path d={gaugeArc(0.36, 0.64)} fill="none" stroke={AMBER} strokeWidth={10} strokeLinecap="round" />
      <path d={gaugeArc(0.68, 1)} fill="none" stroke={GREEN} strokeWidth={10} strokeLinecap="round" />
      <motion.line
        x1={GAUGE.cx}
        y1={GAUGE.cy}
        x2={GAUGE.cx}
        y2={GAUGE.cy - 34}
        stroke={INK}
        strokeWidth={3.5}
        strokeLinecap="round"
        initial={{ rotate: reduce ? 60 : -60 }}
        animate={{ rotate: kf(-60, 60) }}
        transition={transition}
        // Pivot at the needle's base (bottom centre of the line).
        style={{ originX: 0.5, originY: 1 }}
      />
      <circle cx={GAUGE.cx} cy={GAUGE.cy} r={6} fill={INK} />
      {/* Stressed and calm faces at the two ends */}
      <circle cx={244} cy={124} r={9} fill={ROSE_SOFT} stroke={ROSE} strokeWidth={1.5} />
      <path d="M240 128 Q244 124 248 128" fill="none" stroke={INK} strokeWidth={1.5} strokeLinecap="round" />
      <circle cx={328} cy={124} r={9} fill={GREEN_SOFT} stroke={GREEN} strokeWidth={1.5} />
      <path d="M324 125 Q328 130 332 125" fill="none" stroke={INK} strokeWidth={1.5} strokeLinecap="round" />

      {/* Pace: three arrows while rushing, one once the pace eases */}
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M${270 + i * 12} 150 L${279 + i * 12} 158 L${270 + i * 12} 166`}
          stroke={i === 0 ? ROSE : INK}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          animate={{ opacity: i === 0 ? 1 : kf(1, 0.15) }}
          transition={transition}
        />
      ))}

      {/* Heartbeat, rose while stressed and green once calm */}
      <line x1={24} y1={226} x2={336} y2={226} stroke={LINE} strokeWidth={1} strokeDasharray="2 6" />
      <motion.path
        d={ECG}
        fill="none"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduce ? 1 : 0, stroke: reduce ? GREEN : ROSE }}
        animate={{ pathLength: reduce ? 1 : [0, 1], stroke: kf(ROSE, GREEN) }}
        transition={
          reduce
            ? { duration: 0 }
            : { pathLength: { duration: 1.75, repeat: Infinity, ease: "linear" }, stroke: loop }
        }
      />
    </g>
  )
}

// ============================================================================
// VOICE INTERFACE: the fractions conversation, and a pizza built slice by slice
// ============================================================================

const WEDGES = [
  { d: "M0 0 L0 -38 A38 38 0 0 1 38 0 Z", dot: [14, -14], out: [3, -3] },
  { d: "M0 0 L38 0 A38 38 0 0 1 0 38 Z", dot: [14, 14], out: [3, 3] },
  { d: "M0 0 L0 38 A38 38 0 0 1 -38 0 Z", dot: [-14, 14], out: [-3, 3] },
  { d: "M0 0 L-38 0 A38 38 0 0 1 0 -38 Z", dot: [-14, -14], out: [-3, -3] },
]

function VoiceInterface() {
  const reduce = useReducedMotion()
  const pop = (delay: number) => ({
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { delay: reduce ? 0 : delay, duration: 0.45, ease: EASE },
    style: centred,
  })

  return (
    <g>
      {/* Student */}
      <motion.g {...pop(0.1)}>
        <circle cx={32} cy={52} r={14} fill={SOFT} stroke={INK} strokeWidth={2} />
        <circle cx={32} cy={48} r={4.5} fill={INK} />
        <path d="M24 61 a8 7 0 0 1 16 0" fill={INK} />
        <rect x={54} y={30} width={214} height={44} rx={16} fill={SOFT} stroke={LINE} strokeWidth={1.5} />
        <text x={70} y={57} fontSize={13.5} fill={INK}>
          I don&apos;t understand fractions
        </text>
      </motion.g>

      {/* AI */}
      <motion.g {...pop(0.8)}>
        <rect x={94} y={96} width={214} height={44} rx={16} fill={BLUE_SOFT} stroke={BLUE} strokeWidth={1.5} />
        <text x={110} y={123} fontSize={13.5} fill={INK}>
          Let&apos;s build a pizza together!
        </text>
        <circle cx={330} cy={118} r={14} fill={BLUE_SOFT} stroke={BLUE} strokeWidth={2} />
        <circle cx={325} cy={116} r={2.5} fill={INK} />
        <circle cx={335} cy={116} r={2.5} fill={INK} />
        <path d="M325 123 Q330 127 335 123" stroke={INK} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      </motion.g>

      {/* Pizza, one slice at a time */}
      <g transform="translate(92 206)">
        <circle r={42} fill="none" stroke={LINE} strokeWidth={1.5} strokeDasharray="3 5" />
        {WEDGES.map((wedge, i) => (
          // Each slice slides in from outside and settles into place.
          <motion.g
            key={i}
            initial={reduce ? false : { opacity: 0, x: wedge.out[0] * 8, y: wedge.out[1] * 8 }}
            animate={{ opacity: 1, x: wedge.out[0], y: wedge.out[1] }}
            transition={{ delay: reduce ? 0 : 1.3 + i * 0.35, duration: 0.5, ease: EASE }}
          >
            <path d={wedge.d} fill="#F6DA8A" stroke="#E0A95B" strokeWidth={3} strokeLinejoin="round" />
            <circle cx={wedge.dot[0]} cy={wedge.dot[1]} r={5} fill="#D97A6C" />
          </motion.g>
        ))}
      </g>

      {/* Voice: microphone and waveform */}
      <rect x={176} y={180} width={14} height={24} rx={7} fill="none" stroke={INK} strokeWidth={2} />
      <path d="M170 196 a13 13 0 0 0 26 0 M183 209 v8" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      {/* Bars grow and shrink around a shared centre line (y = 197) */}
      {Array.from({ length: 9 }).map((_, i) => {
        const heights = [6, 24, 10, 18, 6]
        return (
          <motion.rect
            key={i}
            x={212 + i * 13}
            width={6}
            rx={3}
            fill={BLUE}
            initial={{ height: 12, y: 191 }}
            animate={
              reduce
                ? { height: 12, y: 191 }
                : { height: heights, y: heights.map((h) => 197 - h / 2) }
            }
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 1.4 + (i % 3) * 0.25, repeat: Infinity, delay: i * 0.09, ease: "easeInOut" }
            }
          />
        )
      })}

      {/* Bilingual */}
      <rect x={226} y={226} width={44} height={24} rx={12} fill={PAPER} stroke={LINE} strokeWidth={1.5} />
      <text x={248} y={242} fontSize={12} fill={INK} textAnchor="middle">
        EN
      </text>
      <rect x={278} y={226} width={52} height={24} rx={12} fill={INK} />
      <text x={304} y={242} fontSize={12} fill={PAPER} textAnchor="middle">
        中文
      </text>
    </g>
  )
}

// ============================================================================
// ADAPTIVE PATHS: three routes to one goal, drawn in turn
// ============================================================================

const ROUTES = [
  "M62 130 C 110 130, 120 56, 180 56 S 250 130, 300 130",
  "M62 130 C 120 130, 140 130, 180 130 S 260 130, 300 130",
  "M62 130 C 110 130, 120 204, 180 204 S 250 130, 300 130",
]

function Waypoint({ index, active }: { index: number; active: boolean }) {
  const fill = active ? GREEN_SOFT : PAPER
  const stroke = active ? GREEN : LINE
  const common = { fill, stroke, strokeWidth: 2, style: { transition: "fill 0.4s, stroke 0.4s" } }
  if (index === 0) return <path d="M180 42 L193 64 L167 64 Z" strokeLinejoin="round" {...common} />
  if (index === 1) return <rect x={168} y={118} width={24} height={24} rx={5} {...common} />
  return <circle cx={180} cy={204} r={12} {...common} />
}

function AdaptivePaths() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(reduce ? 1 : 0)

  useEffect(() => {
    if (reduce) return
    const timer = setInterval(() => setActive((current) => (current + 1) % ROUTES.length), 2600)
    return () => clearInterval(timer)
  }, [reduce])

  return (
    <g>
      {/* All routes, faint */}
      {ROUTES.map((d) => (
        <path key={d} d={d} fill="none" stroke={LINE} strokeWidth={2.5} strokeDasharray="2 8" strokeLinecap="round" />
      ))}

      {/* The current route, drawn */}
      <motion.path
        key={active}
        d={ROUTES[active]}
        fill="none"
        stroke={GREEN}
        strokeWidth={4}
        strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduce ? 0 : 1.4, ease: EASE }}
      />

      {/* Different ways of learning along the way */}
      {ROUTES.map((_, i) => (
        <Waypoint key={i} index={i} active={i === active} />
      ))}

      {/* Student */}
      <circle cx={44} cy={130} r={20} fill={INK} />
      <circle cx={44} cy={123} r={5.5} fill={PAPER} />
      <path d="M34 142 a10 9 0 0 1 20 0" fill={PAPER} />

      {/* Goal */}
      <ellipse cx={316} cy={164} rx={16} ry={4.5} fill={LINE} />
      <line x1={316} y1={98} x2={316} y2={164} stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <motion.path
        d="M318 100 L346 111 L318 122 Z"
        fill={GREEN}
        stroke={GREEN}
        strokeWidth={2}
        strokeLinejoin="round"
        animate={reduce ? undefined : { skewY: [0, -4, 0, 3, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformBox: "fill-box", transformOrigin: "left center" }}
      />
    </g>
  )
}

// ============================================================================
// MEANINGFUL ANALYTICS: progress that grows, kept private
// ============================================================================

const BAR_HEIGHTS = [40, 58, 52, 78, 96, 120]
const TREND = BAR_HEIGHTS.map((h, i) => [73 + i * 30, 206 - h - 14] as const)

function MeaningfulAnalytics() {
  const reduce = useReducedMotion()
  const delay = (seconds: number) => (reduce ? 0 : seconds)

  return (
    <g>
      {/* Axes */}
      <path d="M44 34 V206 H252" fill="none" stroke={LINE} strokeWidth={2} strokeLinecap="round" />
      {[86, 126, 166].map((y) => (
        <line key={y} x1={50} y1={y} x2={250} y2={y} stroke={SOFT} strokeWidth={2} />
      ))}

      {/* Bars */}
      {BAR_HEIGHTS.map((h, i) => (
        <motion.rect
          key={i}
          x={64 + i * 30}
          y={206 - h}
          width={18}
          height={h}
          rx={4}
          fill={i >= 4 ? VIOLET_SOFT : "#e5e5e5"}
          stroke={i >= 4 ? VIOLET : "none"}
          strokeWidth={1.5}
          initial={{ scaleY: reduce ? 1 : 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: delay(0.1 + i * 0.08), duration: 0.6, ease: EASE }}
          style={fromBottom}
        />
      ))}

      {/* Trend */}
      <motion.path
        d={TREND.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ")}
        fill="none"
        stroke={INK}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: delay(0.7), duration: 0.9, ease: EASE }}
      />
      {TREND.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={4}
          fill={PAPER}
          stroke={INK}
          strokeWidth={2}
          initial={{ opacity: reduce ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay(0.75 + i * 0.12) }}
        />
      ))}

      {/* Privacy shield over the student */}
      <motion.g
        initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay(1.2), duration: 0.5, ease: EASE }}
        style={centred}
      >
        <motion.circle
          cx={304}
          cy={108}
          r={50}
          fill="none"
          stroke={VIOLET_SOFT}
          strokeWidth={3}
          animate={reduce ? undefined : { opacity: [0.3, 1, 0.3], scale: [0.96, 1.04, 0.96] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={centred}
        />
        <path
          d="M304 62 L338 75 V106 C338 132 323 149 304 158 C285 149 270 132 270 106 V75 Z"
          fill={PAPER}
          stroke={INK}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <path d="M296 104 v-8 a8 8 0 0 1 16 0 v8" fill="none" stroke={VIOLET} strokeWidth={3} strokeLinecap="round" />
        <rect x={291} y={103} width={26} height={21} rx={5} fill={VIOLET} />
        <circle cx={304} cy={112} r={3} fill={PAPER} />
      </motion.g>

      {/* Student */}
      <circle cx={304} cy={196} r={8} fill={INK} />
      <path d="M288 222 a16 13 0 0 1 32 0" fill={INK} />
    </g>
  )
}
