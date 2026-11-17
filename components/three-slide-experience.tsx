"use client"

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import { ChevronDown } from "lucide-react"

// ============================================================================
// TYPEWRITER COMPONENT
// ============================================================================

interface TypewriterProps {
  text: string
  speed?: number
  className?: string
  /** Show the full text at once (used when the visitor comes back to a slide). */
  instant?: boolean
}

export function Typewriter({ text, speed = 100, className = "", instant = false }: TypewriterProps) {
  const [displayText, setDisplayText] = useState(instant ? text : "")
  const [currentIndex, setCurrentIndex] = useState(instant ? text.length : 0)
  const [cursorVisible, setCursorVisible] = useState(!instant)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    } else if (cursorVisible) {
      const timeout = setTimeout(() => setCursorVisible(false), 1200)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed, cursorVisible])

  return (
    <span className={className}>
      {displayText}
      {cursorVisible && <span className="animate-pulse">|</span>}
    </span>
  )
}

// ============================================================================
// THREE SLIDE EXPERIENCE COMPONENT
// ============================================================================

export interface ThreeSlideExperienceProps {
  onComplete?: () => void
}

export interface ThreeSlideExperienceRef {
  goToFirstSlide: () => void
}

const ROLES = ["Storytellers.", "Innovators.", "Engineers.", "Designers.", "Strategists."]
const EASE = [0.25, 0.46, 0.45, 0.94] as const

// How long input is ignored after a step, so one gesture moves exactly one step.
const SLIDE_LOCK_MS = 700
const ROLE_LOCK_MS = 380
// A wheel event after this much quiet time starts a new gesture (trackpad momentum
// keeps firing small events for a second or more after the fingers lift).
const GESTURE_GAP_MS = 180
const SWIPE_THRESHOLD_PX = 40

type Direction = 1 | -1

export const ThreeSlideExperience = forwardRef<ThreeSlideExperienceRef, ThreeSlideExperienceProps>(
  ({ onComplete }, ref) => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [visibleRoles, setVisibleRoles] = useState(0)
    const [isActive, setIsActive] = useState(true)
    const [showContinueScrolling, setShowContinueScrolling] = useState(false)
    const [introPlayed, setIntroPlayed] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Latest state for the event handlers, so they are bound once per mode.
    const stateRef = useRef({ currentSlide, visibleRoles })
    stateRef.current = { currentSlide, visibleRoles }
    const completedRef = useRef(false)
    const lockedUntil = useRef(0)
    const lastWheelAt = useRef(0)
    const lastWheelDelta = useRef(0)
    const touchStartY = useRef<number | null>(null)
    const onCompleteRef = useRef(onComplete)
    onCompleteRef.current = onComplete

    // The intro typewriter plays once; coming back to the first slide shows it at once.
    useEffect(() => {
      if (currentSlide !== 0) setIntroPlayed(true)
    }, [currentSlide])

    // Moves one step through the story. Returns how long to ignore further input.
    const step = (direction: Direction): number => {
      const { currentSlide: slide, visibleRoles: roles } = stateRef.current

      if (slide === 0) {
        if (direction > 0) {
          setCurrentSlide(1)
          return SLIDE_LOCK_MS
        }
        return 0
      }

      if (slide === 1) {
        if (direction > 0) {
          if (roles < ROLES.length) {
            setVisibleRoles(roles + 1)
            return ROLE_LOCK_MS
          }
          setCurrentSlide(2)
          return SLIDE_LOCK_MS
        }
        if (roles > 0) {
          setVisibleRoles(roles - 1)
          setShowContinueScrolling(false)
          return ROLE_LOCK_MS
        }
        setCurrentSlide(0)
        return SLIDE_LOCK_MS
      }

      // Last slide
      if (direction < 0) {
        setVisibleRoles(ROLES.length)
        setShowContinueScrolling(true)
        setCurrentSlide(1)
        return SLIDE_LOCK_MS
      }
      finish()
      return SLIDE_LOCK_MS
    }

    // Hands scrolling back to the page and glides down to the signature and footer.
    const finish = () => {
      completedRef.current = true
      setIsActive(false)
      document.body.style.overflow = ""
      onCompleteRef.current?.()
      requestAnimationFrame(() => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })
      })
    }

    const tryStep = (direction: Direction) => {
      const now = performance.now()
      if (now < lockedUntil.current) return
      const lockMs = step(direction)
      if (lockMs) lockedUntil.current = now + lockMs
    }

    // Returns the direction if this wheel event starts a new gesture, otherwise null.
    const readWheelGesture = (e: WheelEvent): Direction | null => {
      const now = performance.now()
      const delta =
        e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY
      const gap = now - lastWheelAt.current
      const previous = lastWheelDelta.current
      lastWheelAt.current = now
      lastWheelDelta.current = delta

      if (Math.abs(delta) < 1) return null

      const reversed = previous !== 0 && Math.sign(delta) !== Math.sign(previous)
      // A fresh swipe during the previous one's momentum shows up as deltas growing again.
      const accelerating = Math.abs(delta) > 12 && Math.abs(delta) > Math.abs(previous) * 1.6
      // A mouse wheel sends one large event per notch; a trackpad sends a fast stream of small ones.
      const wheelNotch = Math.abs(delta) >= 50 && gap > 60
      const isNewGesture = gap > GESTURE_GAP_MS || reversed || accelerating || wheelNotch

      return isNewGesture ? (delta > 0 ? 1 : -1) : null
    }

    // Coming back up from the page into the story: re-enter on the last slide and step back.
    const reEnter = () => {
      const now = performance.now()
      if (now < lockedUntil.current) return
      completedRef.current = false
      setIsActive(true)
      const lockMs = step(-1)
      lockedUntil.current = now + (lockMs || SLIDE_LOCK_MS)
    }

    const atTop = () => window.scrollY <= 1

    useImperativeHandle(ref, () => ({
      goToFirstSlide: () => {
        setCurrentSlide(0)
        setVisibleRoles(0)
        setShowContinueScrolling(false)
        lockedUntil.current = performance.now() + SLIDE_LOCK_MS

        const activate = () => {
          completedRef.current = false
          setIsActive(true)
        }
        if (atTop()) {
          activate()
          return
        }
        // Lock the page only once the smooth scroll has reached the top.
        const startedAt = performance.now()
        const waitForTop = () => {
          if (atTop() || performance.now() - startedAt > 1500) {
            window.scrollTo({ top: 0 })
            activate()
          } else {
            requestAnimationFrame(waitForTop)
          }
        }
        window.scrollTo({ top: 0, behavior: "smooth" })
        requestAnimationFrame(waitForTop)
      },
    }))

    // While the story is playing: the page is locked and input moves through the slides.
    useEffect(() => {
      if (!isActive) return

      if (window.scrollY > 0) window.scrollTo({ top: 0 })
      document.body.style.overflow = "hidden"

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault()
        const direction = readWheelGesture(e)
        if (direction) tryStep(direction)
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.repeat) {
          if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " "].includes(e.key)) e.preventDefault()
          return
        }
        if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
          e.preventDefault()
          tryStep(1)
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          e.preventDefault()
          tryStep(-1)
        }
      }

      const handleTouchStart = (e: TouchEvent) => {
        touchStartY.current = e.touches[0].clientY
      }

      // Stops the page itself from moving or bouncing while a swipe drives the slides.
      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault()
      }

      const handleTouchEnd = (e: TouchEvent) => {
        if (touchStartY.current === null) return
        const deltaY = touchStartY.current - e.changedTouches[0].clientY
        touchStartY.current = null
        if (Math.abs(deltaY) > SWIPE_THRESHOLD_PX) tryStep(deltaY > 0 ? 1 : -1)
      }

      window.addEventListener("wheel", handleWheel, { passive: false })
      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("touchstart", handleTouchStart, { passive: true })
      window.addEventListener("touchmove", handleTouchMove, { passive: false })
      window.addEventListener("touchend", handleTouchEnd)

      return () => {
        document.body.style.overflow = ""
        window.removeEventListener("wheel", handleWheel)
        window.removeEventListener("keydown", handleKeyDown)
        window.removeEventListener("touchstart", handleTouchStart)
        window.removeEventListener("touchmove", handleTouchMove)
        window.removeEventListener("touchend", handleTouchEnd)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive])

    // After the story: normal scrolling, plus a way back in from the top of the page.
    useEffect(() => {
      if (isActive) return

      const handleWheel = (e: WheelEvent) => {
        const direction = readWheelGesture(e)
        if (direction === -1 && completedRef.current && atTop()) reEnter()
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.key === "ArrowUp" || e.key === "PageUp") && !e.repeat && completedRef.current && atTop()) {
          e.preventDefault()
          reEnter()
        }
      }

      const handleTouchStart = (e: TouchEvent) => {
        touchStartY.current = atTop() ? e.touches[0].clientY : null
      }

      const handleTouchEnd = (e: TouchEvent) => {
        if (touchStartY.current === null) return
        const deltaY = touchStartY.current - e.changedTouches[0].clientY
        touchStartY.current = null
        if (deltaY < -SWIPE_THRESHOLD_PX && completedRef.current && atTop()) reEnter()
      }

      window.addEventListener("wheel", handleWheel, { passive: true })
      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("touchstart", handleTouchStart, { passive: true })
      window.addEventListener("touchend", handleTouchEnd, { passive: true })

      return () => {
        window.removeEventListener("wheel", handleWheel)
        window.removeEventListener("keydown", handleKeyDown)
        window.removeEventListener("touchstart", handleTouchStart)
        window.removeEventListener("touchend", handleTouchEnd)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive])

    // Show "Continue scrolling" shortly after the last role appears.
    useEffect(() => {
      if (currentSlide === 1 && visibleRoles === ROLES.length && !showContinueScrolling) {
        const timer = setTimeout(() => setShowContinueScrolling(true), 800)
        return () => clearTimeout(timer)
      }
      if (currentSlide !== 1 && showContinueScrolling) {
        setShowContinueScrolling(false)
      }
    }, [currentSlide, visibleRoles, showContinueScrolling])

    const slideTransition = {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
      exit: { opacity: 0, y: -30, transition: { duration: 0.3, ease: EASE } },
    }

    const renderSlideContent = () => {
      switch (currentSlide) {
        case 0:
          return (
            <motion.div key="slide-0" {...slideTransition} className="text-center space-y-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight leading-tight">
                <Typewriter text="Our Reason of Being" speed={150} instant={introPlayed} />
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: introPlayed ? 0.2 : 3, duration: introPlayed ? 0.5 : 1 }}
                className="text-lg md:text-xl font-normal leading-relaxed tracking-wide text-neutral-700 max-w-3xl mx-auto"
              >
                We are a collective of creative adults whom the {"'child'"} in each of us survived.
              </motion.p>
            </motion.div>
          )

        case 1:
          return (
            <motion.div key="slide-1" {...slideTransition} className="text-center space-y-8">
              {ROLES.map((role, index) => (
                <motion.div
                  key={role}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={
                    index < visibleRoles
                      ? { opacity: 1, y: 0, scale: 1 }
                      : { opacity: 0, y: 40, scale: 0.9 }
                  }
                  transition={{ duration: 0.5, ease: EASE }}
                  className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight"
                >
                  {role}
                </motion.div>
              ))}
            </motion.div>
          )

        case 2:
          return (
            <motion.div key="slide-2" {...slideTransition} className="text-center space-y-16 pt-24">
              {[
                <>Bridging communities with heart and<br />through world-class artistry and technologies.</>,
                <>We meet challenges by tailoring solutions<br />based on a mix of strategy, content and unique proposition.</>,
                <>
                  <div>No communications white noise.</div>
                  <div>No BS.</div>
                </>,
                <>Relentlessly pursuing perfection, we are outsiders.<br />By choice.</>,
              ].map((content, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.15, duration: 0.6, ease: EASE }}
                  className={`text-xl md:text-2xl lg:text-3xl font-bold leading-tight tracking-wide${index === 3 ? " pb-16" : ""}`}
                >
                  {content}
                </motion.div>
              ))}
            </motion.div>
          )

        default:
          return null
      }
    }

    return (
      <MotionConfig reducedMotion="user">
        <div ref={containerRef} className="relative">
          {/* Background */}
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,182,193,0.1),transparent_50%)]" />
          </div>

          {/* Main Content */}
          <div className="min-h-screen flex items-center justify-center relative">
            <div className="px-6 w-full">
              <AnimatePresence mode="wait">{renderSlideContent()}</AnimatePresence>
            </div>

            {/* Right Side Progress Ticks */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  key="progress-ticks"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.3 }}
                  className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30"
                >
                  <div className="flex flex-col space-y-4">
                    {[0, 1, 2].map((slideIndex) => (
                      <motion.div
                        key={slideIndex}
                        className={`w-3 h-3 rounded-full transition-colors duration-500 ${
                          slideIndex === currentSlide
                            ? "bg-neutral-900 shadow-lg"
                            : slideIndex < currentSlide
                              ? "bg-neutral-400"
                              : "bg-neutral-200"
                        }`}
                        animate={{ scale: slideIndex === currentSlide ? 1.25 : 1 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Scroll Prompts */}
            <div className="fixed bottom-8 left-0 right-0 px-6 z-30 pointer-events-none">
              {/* Scroll to Explore Hint */}
              {isActive && currentSlide === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: introPlayed ? 0.6 : 4 }}
                  className="text-center"
                >
                  <div className="flex flex-col items-center space-y-3 text-neutral-500">
                    <motion.div
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="text-xs uppercase tracking-wider font-medium"
                    >
                      Scroll to Explore
                    </motion.div>
                    <motion.div
                      animate={{ y: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                      className="flex items-center justify-center"
                    >
                      <ChevronDown className="w-6 h-6 text-neutral-400" />
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Roles Progress Indicator */}
              {isActive && currentSlide === 1 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                  <div className="flex flex-col items-center space-y-3 text-neutral-500">
                    <AnimatePresence mode="wait">
                      {!showContinueScrolling ? (
                        <motion.div
                          key="scroll-to-reveal"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="text-xs uppercase tracking-wider font-medium text-neutral-500"
                        >
                          Scroll to reveal
                        </motion.div>
                      ) : (
                        <motion.div
                          key="continue-scrolling"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="flex flex-col items-center space-y-3"
                        >
                          <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            className="text-xs uppercase tracking-wider font-medium text-neutral-500"
                          >
                            Continue scrolling
                          </motion.div>
                          <motion.div
                            animate={{ y: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                            className="flex items-center justify-center"
                          >
                            <ChevronDown className="w-6 h-6 text-neutral-400" />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {!showContinueScrolling && (
                        <motion.div
                          key="role-dots"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="flex space-x-2"
                        >
                          {ROLES.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index < visibleRoles ? "bg-neutral-600" : "bg-neutral-300"
                              }`}
                            />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </MotionConfig>
    )
  },
)

ThreeSlideExperience.displayName = "ThreeSlideExperience"
