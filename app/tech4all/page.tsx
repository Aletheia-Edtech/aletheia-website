"use client"

import {
  GraduationCap,
  User,
  Building2,
  HeartHandshake,
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  Brain,
  Mic,
  Target,
  BarChart3,
  Rocket,
  Globe,
  Activity,
  type LucideIcon,
} from "lucide-react"
import { useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react"
import Link from "next/link"
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from "framer-motion"
import SparkieBuddy from "@/components/animations/sparkie-buddy"
import { Nav } from "@/components/nav"
import { Footer } from "@/components/footer"
import { FeatureIllustration, type IllustrationKind } from "./components/FeatureIllustrations"

// ============================================================================
// CONTENT
// ============================================================================

const SPARK_OS_URL = "https://spark-os.com/"

// The SparkOS status, shown as floating cards around Sparkie in the hero.
const IMPACT_QUOTE = "Built for diverse minds. Ready to transform learning for every student."

const AUDIENCES: { icon: LucideIcon; title: string; text: string; points: string[] }[] = [
  {
    icon: GraduationCap,
    title: "Student",
    text: "Take courses, do classwork and homework, with a companion that notices when you're stuck and adapts to how you learn.",
    points: ["Courses", "Classwork", "Homework", "Emotional support"],
  },
  {
    icon: HeartHandshake,
    title: "Guardian",
    text: "Follow your child's homework, attendance and progress, and see how they're feeling about learning.",
    points: ["Homework", "Attendance", "Progress"],
  },
  {
    icon: User,
    title: "Educator",
    text: "Create courses, set homework, run classrooms and take attendance, all in one place.",
    points: ["Courses", "Homework", "Classrooms", "Attendance"],
  },
  {
    icon: Building2,
    title: "Organisation",
    text: "Privacy-first insight for admins across classes and schools, with bilingual learning that scales from one pilot to many sites.",
    points: ["Privacy-first", "Chinese & English", "Built to scale"],
  },
]

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  metric: string
  illustration: IllustrationKind
  // Each feature has its own colour, matching its illustration.
  theme: { stage: string; chip: string; icon: string }
}

const FEATURES: Feature[] = [
  {
    icon: Brain,
    title: "Emotional AI",
    description:
      "Not just smart—empathetic. Our AI recognizes frustration, celebrates breakthroughs, and adapts in real-time.",
    metric: "Highly empathetic",
    illustration: "emotional",
    theme: {
      stage: "bg-rose-50/80",
      chip: "text-rose-700 bg-rose-50 border-rose-200",
      icon: "bg-rose-50 text-rose-700",
    },
  },
  {
    icon: Mic,
    title: "Voice Interface",
    description: "Because not everyone learns by reading. Natural conversation in Chinese & English.",
    metric: "Bilingual: Chinese & English",
    illustration: "voice",
    theme: {
      stage: "bg-sky-50/80",
      chip: "text-sky-700 bg-sky-50 border-sky-200",
      icon: "bg-sky-50 text-sky-700",
    },
  },
  {
    icon: Target,
    title: "Adaptive Paths",
    description: "Every mind is unique. Every learning path should be too.",
    metric: "Personalized",
    illustration: "paths",
    theme: {
      stage: "bg-emerald-50/80",
      chip: "text-emerald-700 bg-emerald-50 border-emerald-200",
      icon: "bg-emerald-50 text-emerald-700",
    },
  },
  {
    icon: BarChart3,
    title: "Meaningful Analytics",
    description: "Data that serves students, not surveillance systems.",
    metric: "Privacy-first",
    illustration: "analytics",
    theme: {
      stage: "bg-violet-50/80",
      chip: "text-violet-700 bg-violet-50 border-violet-200",
      icon: "bg-violet-50 text-violet-700",
    },
  },
]

// ============================================================================
// SHARED PIECES
// ============================================================================

const EASE = [0.25, 0.46, 0.45, 0.94] as const

// The soft card style shared with the STEM for All page.
const SOFT_CARD =
  "rounded-[28px] border border-neutral-300/90 bg-gradient-to-b from-white/95 to-neutral-100/80 shadow-[0_18px_38px_rgba(0,0,0,0.05)]"

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"

// A faint dot grid that fades out towards the edges.
const dotGrid = (color: string): CSSProperties => ({
  backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
  backgroundSize: "22px 22px",
  maskImage: "radial-gradient(ellipse at center, black 35%, transparent 75%)",
  WebkitMaskImage: "radial-gradient(ellipse at center, black 35%, transparent 75%)",
})

// Fades a block in as it scrolls into view (once).
function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">{children}</p>
}

// ============================================================================
// HERO
// ============================================================================

// The four core features, orbiting Sparkie.
const ORBIT_ICONS: LucideIcon[] = [Brain, Mic, Target, BarChart3]

function IconBubble({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800">
      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
    </span>
  )
}

// A status card: in a grid on phones, floating around the orbit on larger screens.
function StatusCard({
  children,
  className = "",
  delay,
  float,
}: {
  children: ReactNode
  className?: string
  delay: number
  float: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduce ? 0 : delay, duration: 0.5, ease: EASE }}
      className={`md:absolute ${className}`}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: float, repeat: Infinity, ease: "easeInOut", delay }}
        className="h-full rounded-2xl border border-neutral-200 bg-white/90 backdrop-blur-sm px-4 py-3 text-left shadow-[0_14px_30px_rgba(0,0,0,0.07)]"
      >
        {children}
      </motion.div>
    </motion.li>
  )
}

function HeroVisual() {
  const reduce = useReducedMotion()
  const spin = { duration: 60, repeat: Infinity, ease: "linear" as const }

  return (
    <figure className="relative mx-auto w-full max-w-[540px]">
      <div className="relative mx-auto aspect-square w-full max-w-[380px] md:max-w-none" aria-hidden="true">
        {/* Rings */}
        <div className="absolute inset-[9%] rounded-full border border-dashed border-neutral-300" />
        <div className="absolute inset-[21%] rounded-full border border-neutral-200 bg-white/40" />
        <div className="absolute inset-[33%] rounded-full bg-white shadow-[0_24px_60px_rgba(83,164,232,0.22)]" />

        {/* Orbiting feature icons on the inner ring, clear of the corner cards (each counter-rotates to stay upright) */}
        <motion.div className="absolute inset-[21%]" animate={reduce ? undefined : { rotate: 360 }} transition={spin}>
          {ORBIT_ICONS.map((Icon, i) => {
            const angle = (i / ORBIT_ICONS.length) * Math.PI * 2 - Math.PI / 4
            return (
              <div
                key={i}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${50 + 50 * Math.cos(angle)}%`, top: `${50 + 50 * Math.sin(angle)}%` }}
              >
                <motion.div
                  animate={reduce ? undefined : { rotate: -360 }}
                  transition={spin}
                  className="flex h-11 w-11 md:h-14 md:w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-md"
                >
                  <Icon className="h-5 w-5 md:h-6 md:w-6 text-neutral-800" />
                </motion.div>
              </div>
            )
          })}
        </motion.div>

        {/* Little sparks */}
        {[
          { left: "24%", top: "30%", size: 8, d: 0 },
          { left: "73%", top: "66%", size: 10, d: 0.8 },
          { left: "68%", top: "26%", size: 6, d: 1.6 },
        ].map((spark, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-[#53A4E8]"
            style={{ left: spark.left, top: spark.top, width: spark.size, height: spark.size }}
            animate={reduce ? undefined : { y: [0, -8, 0], opacity: [0.35, 0.9, 0.35] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: spark.d }}
          />
        ))}

        {/* Sparkie */}
        <div className="absolute inset-0 flex items-center justify-center">
          <SparkieBuddy size={150} className="scale-[0.78] md:scale-100" />
        </div>
      </div>

      {/* SparkOS status */}
      <ul
        aria-label="SparkOS status"
        className="mt-6 grid grid-cols-2 gap-3 md:mt-0 md:block md:absolute md:inset-x-0 md:top-0 md:aspect-square"
      >
        <StatusCard className="md:left-[-4%] md:top-0 md:w-[38%] md:min-w-[190px]" delay={0.4} float={5}>
          <div className="flex items-center gap-3">
            <IconBubble icon={Rocket} />
            <div>
              <p className="text-sm font-medium text-neutral-900">Pilot rollout</p>
              <p className="text-xs text-neutral-500">Starting soon</p>
            </div>
          </div>
        </StatusCard>

        <StatusCard className="md:right-[-4%] md:top-[2%] md:w-[31%] md:min-w-[160px]" delay={0.6} float={6}>
          <p className="text-3xl font-bold tracking-tight text-neutral-900">+25%</p>
          <p className="mt-1 text-xs leading-snug text-neutral-500">
            Expected learning gains vs traditional classrooms
          </p>
        </StatusCard>

        <StatusCard className="md:left-[-6%] md:bottom-0 md:w-[42%] md:min-w-[200px]" delay={0.8} float={5.5}>
          <div className="flex items-start gap-3">
            <IconBubble icon={Globe} />
            <div>
              <p className="text-sm font-medium text-neutral-900">Expansion underway</p>
              <p className="text-xs leading-snug text-neutral-500">China, Singapore, and international partners</p>
            </div>
          </div>
        </StatusCard>

        <StatusCard className="md:right-[-3%] md:bottom-[3%] md:w-[38%] md:min-w-[200px]" delay={1} float={6.5}>
          <div className="flex items-center gap-3">
            <IconBubble icon={Activity} />
            <div>
              <p className="text-sm font-medium text-neutral-900">Emotional AI engine</p>
              <p className="flex items-center gap-1.5 text-xs text-emerald-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                Online
              </p>
            </div>
          </div>
        </StatusCard>
      </ul>

      <figcaption className="mt-6 md:mt-8 text-center text-base md:text-lg italic leading-relaxed text-neutral-500">
        &ldquo;{IMPACT_QUOTE}&rdquo;
      </figcaption>
    </figure>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={dotGrid("rgba(0,0,0,0.08)")} />

      <div className="relative max-w-6xl mx-auto px-6 pt-10 pb-16 md:pt-16 md:pb-24 grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        <div className="lg:col-span-6 text-center lg:text-left space-y-7">
          <div className="inline-block bg-white/80 border border-neutral-200 text-neutral-600 px-4 py-2 rounded-full text-sm font-normal tracking-wide">
            Flagship Platform
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none text-neutral-900">
            SparkOS
          </h1>
          <p className="text-lg md:text-xl font-normal leading-relaxed tracking-wide text-neutral-600 max-w-xl mx-auto lg:mx-0">
            An education system designed for diverse learners. Adaptive, empathetic, and built with individual student
            needs at the center of every decision.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
            <a
              href={SPARK_OS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 bg-neutral-900 text-white px-7 py-4 rounded-lg hover:bg-neutral-800 transition-colors tracking-wide ${FOCUS_RING}`}
            >
              <span>Explore SparkOS</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a
              href="#core-features"
              className={`inline-flex items-center justify-center gap-2 border border-neutral-300 bg-white/70 text-neutral-900 px-7 py-4 rounded-lg hover:border-neutral-900 transition-colors tracking-wide ${FOCUS_RING}`}
            >
              <span>Core Features</span>
              <ArrowDown className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-6">
          <HeroVisual />
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// BUILT FOR EVERYONE
// ============================================================================

function Audiences() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-24" aria-labelledby="audiences-title">
      <Reveal className="text-center space-y-5 mb-12 md:mb-16">
        <Eyebrow>Who it serves</Eyebrow>
        <h2
          id="audiences-title"
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-neutral-900"
        >
          Built for Everyone
        </h2>
        <p className="text-lg md:text-xl font-normal leading-relaxed tracking-wide text-neutral-600 max-w-3xl mx-auto">
          From individual learners to global institutions, SparkOS serves the entire educational ecosystem.
        </p>
      </Reveal>

      <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {AUDIENCES.map(({ icon: Icon, title, text, points }, index) => (
          <motion.li
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
            className="h-full"
          >
            <div
              className={`group h-full flex flex-col p-5 md:p-7 transition-transform duration-300 hover:-translate-y-1 ${SOFT_CARD}`}
            >
              <span className="text-[1.9rem] md:text-[2.4rem] font-normal leading-none tracking-tight text-neutral-300/80">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mt-5 inline-flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-[1.25rem] bg-neutral-50/95 text-neutral-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_18px_rgba(0,0,0,0.04)]">
                <Icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-xl md:text-2xl font-normal tracking-tight text-neutral-900">{title}</h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{text}</p>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${title} highlights`}>
                {points.map((point) => (
                  <li
                    key={point}
                    className="text-xs px-2.5 py-1 rounded-full border border-neutral-200 bg-white/80 text-neutral-600"
                  >
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <div className="h-px w-12 bg-neutral-300 transition-all duration-300 group-hover:w-20 group-hover:bg-neutral-500" />
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

// ============================================================================
// CORE FEATURES
// ============================================================================

function CoreFeatures() {
  const [activeIndex, setActiveIndex] = useState(0)
  const reduceMotion = useReducedMotion()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const active = FEATURES[activeIndex]
  const ActiveIcon = active.icon

  const select = (index: number, focus = false) => {
    const next = (index + FEATURES.length) % FEATURES.length
    setActiveIndex(next)
    if (focus) {
      const tab = tabRefs.current[next]
      tab?.focus()
      tab?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduceMotion ? "auto" : "smooth" })
    }
  }

  // Arrow keys move between tabs, as in a standard tab list.
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: activeIndex + 1,
      ArrowDown: activeIndex + 1,
      ArrowLeft: activeIndex - 1,
      ArrowUp: activeIndex - 1,
      Home: 0,
      End: FEATURES.length - 1,
    }
    if (event.key in moves) {
      event.preventDefault()
      select(moves[event.key], true)
    }
  }

  return (
    <section id="core-features" className="scroll-mt-24 max-w-6xl mx-auto px-6 py-16 md:py-24" aria-labelledby="features-title">
      <Reveal className="text-center space-y-5 mb-10 md:mb-12">
        <Eyebrow>Inside SparkOS</Eyebrow>
        <h2 id="features-title" className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-neutral-900">
          Core Features
        </h2>
        <p className="text-lg md:text-xl font-normal leading-relaxed tracking-wide text-neutral-600 max-w-2xl mx-auto">
          Built with cutting-edge technology to support diverse learning needs.
        </p>
      </Reveal>

      <Reveal>
        {/* Tabs: scroll sideways on phones */}
        <div
          role="tablist"
          aria-label="Core features"
          className="flex gap-2 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 pb-2 md:mx-0 md:px-0 md:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            const selected = index === activeIndex
            return (
              <button
                key={feature.title}
                ref={(el) => {
                  tabRefs.current[index] = el
                }}
                role="tab"
                type="button"
                id={`feature-tab-${index}`}
                aria-selected={selected}
                aria-controls="feature-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => select(index)}
                onKeyDown={handleKeyDown}
                className={`snap-start shrink-0 inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm tracking-wide transition-colors ${FOCUS_RING} ${
                  selected
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white/80 text-neutral-600 border-neutral-300 hover:border-neutral-900 hover:text-neutral-900"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {feature.title}
              </button>
            )
          })}
        </div>

        {/* Panel */}
        <div
          role="tabpanel"
          id="feature-panel"
          aria-labelledby={`feature-tab-${activeIndex}`}
          className={`mt-6 md:mt-8 overflow-hidden ${SOFT_CARD}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="grid md:grid-cols-2"
            >
              {/* Feature summary */}
              <div className="p-7 md:p-10 lg:p-12 flex flex-col gap-5">
                <div className="flex items-start justify-between">
                  <span
                    className={`inline-flex h-16 w-16 items-center justify-center rounded-[1.25rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_18px_rgba(0,0,0,0.04)] ${active.theme.icon}`}
                  >
                    <ActiveIcon className="h-8 w-8" aria-hidden="true" />
                  </span>
                  <span className="text-[2.2rem] md:text-[2.6rem] font-normal leading-none tracking-tight text-neutral-300/80">
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-normal tracking-tight text-neutral-900">{active.title}</h3>
                <span className={`self-start text-xs font-medium px-3 py-1.5 rounded-full border ${active.theme.chip}`}>
                  {active.metric}
                </span>
                <p className="text-base md:text-lg leading-relaxed text-neutral-600">{active.description}</p>
              </div>

              {/* Illustration */}
              <div
                className={`border-t md:border-t-0 md:border-l border-neutral-200 p-5 md:p-8 flex items-center transition-colors ${active.theme.stage}`}
              >
                <div className="w-full rounded-2xl bg-white/90 border border-white shadow-[0_12px_30px_rgba(0,0,0,0.06)] p-4 md:p-6">
                  <FeatureIllustration kind={active.illustration} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Position dots */}
        <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
          {FEATURES.map((feature, index) => (
            <span
              key={feature.title}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? "w-6 bg-neutral-900" : "w-1.5 bg-neutral-300"
              }`}
            />
          ))}
        </div>
      </Reveal>
    </section>
  )
}

// ============================================================================
// CALL TO ACTION
// ============================================================================

function CallToAction() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-20 md:pb-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-[32px] bg-neutral-900 px-6 py-14 md:px-16 md:py-20 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={dotGrid("rgba(255,255,255,0.12)")}
          />
          <div className="relative space-y-6">
            <div className="flex justify-center">
              <SparkieBuddy size={132} />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white">
              Ready to Transform Learning?
            </h2>
            <p className="text-lg md:text-xl font-normal leading-relaxed tracking-wide text-neutral-300 max-w-2xl mx-auto">
              Join us in creating accessible, inclusive learning experiences for every student.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-neutral-900 px-8 py-4 rounded-lg hover:bg-neutral-200 transition-colors tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href={SPARK_OS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 rounded-lg hover:border-white transition-colors tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
              >
                <span>Explore SparkOS</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

// ============================================================================
// PAGE
// ============================================================================

export default function Tech4All() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-neutral-50 text-neutral-900 font-serif flex flex-col">
        <Nav />

        <main className="flex-1 pt-24">
          <Hero />
          <Audiences />
          <CoreFeatures />
          <CallToAction />
        </main>

        <Footer />
      </div>
    </MotionConfig>
  )
}
