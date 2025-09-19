import { useEffect, useMemo, useRef, useState } from 'react'
import { Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface UrgencyBannerProps {
  percentSold?: number
}

export default function UrgencyBanner({ percentSold = 73 }: UrgencyBannerProps) {
  const [tickerIndex, setTickerIndex] = useState(0)
  const tickerTimerRef = useRef<number | null>(null)

  const feed = useMemo(() => {
    const cities = ['Charlotte, NC', 'Charleston, SC', 'Atlanta, GA', 'Raleigh, NC', 'Savannah, GA', 'Greenville, SC', 'Columbia, SC']
    const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Riley', 'Casey', 'Drew', 'Morgan', 'Jamie', 'Kendall']
    const tiers = ['3 Day Pass', '4 Day Pass', 'VIP Pass']
    const items = Array.from({ length: 40 }).map(() => {
      const n = names[Math.floor(Math.random() * names.length)]
      const c = cities[Math.floor(Math.random() * cities.length)]
      const t = tiers[Math.floor(Math.random() * tiers.length)]
      return `${n} in ${c} grabbed a ${t}`
    })
    return items
  }, [])

  useEffect(() => {
    const schedule = () => {
      // Random interval between 2.5s and 6s
      const next = 2500 + Math.floor(Math.random() * 3500)
      tickerTimerRef.current = window.setTimeout(() => {
        setTickerIndex((i) => (i + 1) % feed.length)
        schedule()
      }, next) as unknown as number
    }
    schedule()
    return () => {
      if (tickerTimerRef.current) window.clearTimeout(tickerTimerRef.current)
    }
  }, [feed])

  const getMessage = () => {
    if (percentSold >= 90) return "Final wave"
    if (percentSold >= 75) return "Limited passes left"
    if (percentSold >= 60) return "Moving fast"
    return "Secure your spot"
  }

  return (
    <motion.div
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative mt-6 md:mt-10"
      data-testid="urgency-banner"
      aria-live="polite"
    >
      {/* Neon beam background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -inset-x-10 top-0 h-full bg-gradient-to-r from-transparent via-primary/15 to-transparent blur-xl animate-pulse" />
      </div>

      <div className="container mx-auto px-4">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3 rounded-lg border border-primary/30 bg-black/60 backdrop-blur-sm px-4 py-3 ring-1 ring-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-black/60 border border-primary/40 shadow-[0_0_30px_theme(colors.primary/30%)]">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm md:text-base text-foreground/90">
              <span className="font-display font-black tracking-wide text-primary mr-2">{getMessage().toUpperCase()}</span>
              <span className="text-muted-foreground">{percentSold}% sold • Don’t miss out</span>
            </div>
          </div>

          {/* Live-style ticker (md+) */}
          <div className="hidden md:flex flex-1 items-center justify-center min-h-[28px] overflow-hidden">
            <div className="relative h-[22px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={tickerIndex}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -16, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="text-sm text-muted-foreground font-medium whitespace-nowrap"
                >
                  {feed[tickerIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <span>Tickets</span>
              <div className="w-28 h-2 rounded-full bg-white/10 overflow-hidden border border-primary/30">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${Math.min(100, Math.max(0, percentSold))}%` }}
                />
              </div>
            </div>
            <Button
              className="font-display font-black text-sm md:text-base bg-primary hover:bg-primary/90 text-black border-2 border-primary"
              onClick={() => window.open('https://freakfest.bigcartel.com/product/freak-fest-2025-ticket?utm_source=site&utm_medium=urgency&utm_campaign=freakfest2025', '_blank', 'noopener')}
            >
              Get Tickets
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}