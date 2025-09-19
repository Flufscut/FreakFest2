import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, MapPin } from 'lucide-react'

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    // todo: remove mock functionality
    const targetDate = new Date('2025-10-16T00:00:00').getTime()
    
    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = targetDate - now
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }

    const timer = setInterval(updateCountdown, 1000)
    updateCountdown()
    
    return () => clearInterval(timer)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      id="hero"
      className="relative min-h-screen flex items-start justify-center overflow-hidden pt-32 pb-16 md:pb-24 bg-black"
    >
      {/* Explosive background effects */}
      <div className="absolute inset-0 particle-burst"></div>
      
      {/* Enhanced floating elements for explosive atmosphere */}
      
      {/* Energy wave overlay */}
      <div className="absolute inset-0 energy-wave opacity-30"></div>
      
      <div className="container mx-auto px-4 text-center text-foreground relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Massive explosive title with enhanced effects */}
          <div className="mb-8">
            <h1 className="font-display text-6xl md:text-8xl lg:text-[12rem] xl:text-[15rem] font-black leading-none">
              <span className="block text-primary drop-shadow-2xl text-explosion glitch-effect" style={{textShadow: '0 0 40px currentColor, 0 0 80px currentColor, 0 0 120px currentColor'}}>
                FREAK
              </span>
              <span className="block text-foreground -mt-4 md:-mt-8 lg:-mt-16 text-explosion glitch-effect" style={{textShadow: '0 0 20px #000, 0 0 40px #000', animationDelay: '0.5s'}}>
                FEST
              </span>
            </h1>
            <div className="text-4xl md:text-6xl lg:text-8xl font-display font-bold text-primary explosive-entry delay-400 mt-4">
              2025
            </div>
          </div>
          
          {/* Key info with explosive animations */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8 text-xl md:text-2xl diagonal-slide delay-300">
            <div className="flex items-center gap-3 bg-black/40 px-6 py-3 rounded-lg backdrop-blur-sm">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="font-bold">OCT 16-19</span>
            </div>
            <div className="flex items-center gap-3 bg-black/40 px-6 py-3 rounded-lg backdrop-blur-sm">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="font-bold">TIMMONSVILLE, SC</span>
            </div>
          </div>
          
          {/* Power tagline */}
          <div className="mb-8 explosive-entry delay-500">
            <p className="text-2xl md:text-4xl font-display font-bold text-primary mb-4">
              HIGH ENERGY • ZERO FILLER • PURE CHAOS
            </p>
            <p className="text-lg md:text-xl text-muted-foreground font-medium">
              Cartersville Country Winery • Bands all day, rave all night at The Club
            </p>
          </div>

          {/* Explosive countdown */}
          <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto mb-10 explosive-entry delay-400">
            {[{label: 'DAYS', value: timeLeft.days}, {label: 'HOURS', value: timeLeft.hours}, {label: 'MINUTES', value: timeLeft.minutes}, {label: 'SECONDS', value: timeLeft.seconds}].map((unit, index) => (
              <div 
                key={unit.label} 
                className="bg-black/60 border border-primary/30 rounded-lg p-3 md:p-4 hover:border-primary/60 transition-all duration-300" 
                data-testid={`countdown-${unit.label.toLowerCase()}`}
                style={{animationDelay: `${0.6 + index * 0.1}s`}}
              >
                <div className="text-2xl md:text-4xl font-display font-black text-primary pulse-glow">{unit.value.toString().padStart(2, '0')}</div>
                <div className="text-xs md:text-sm text-muted-foreground font-bold">{unit.label}</div>
              </div>
            ))}
          </div>

          {/* Explosive CTA */}
          <div className="explosive-entry delay-500">
            <Button 
              size="lg"
              className="text-xl md:text-2xl px-12 py-8 font-display font-black energy-explosion bg-primary hover:bg-primary/90 text-black border-2 border-primary hover:scale-105 transform transition-all duration-300"
              onClick={() => window.open('https://freakfest.bigcartel.com/product/freak-fest-2025-ticket?utm_source=site&utm_medium=hero&utm_campaign=freakfest2025', '_blank', 'noopener')}
              data-testid="button-buy-tickets-hero"
              style={{textShadow: '0 0 10px currentColor'}}
            >
              SECURE YOUR SPOT
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <p className="mt-4 mb-8 text-primary font-bold text-lg animate-pulse">
              LIMITED CAPACITY • SELLING FAST
            </p>
          </div>
          
        </div>
      </div>
      
      {/* Bottom energy bar */}
    </section>
  )
}