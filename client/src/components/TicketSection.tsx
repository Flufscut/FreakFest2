import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Users } from 'lucide-react'

interface TicketTier {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  inclusions: string[]
  isPopular?: boolean
  icon: any
  href?: string
}

// Core passes (3 columns) with updated pricing
const ticketTiers: TicketTier[] = [
  {
    id: '3-day-pass',
    name: '3 DAY PASS (FRI/SAT/SUN)',
    price: 60,
    description: '3 days of pure energy',
    icon: Star,
    href: 'https://freakfest.bigcartel.com/product/freak-fest-2025-ticket',
    inclusions: [
      'Friday, Saturday & Sunday access',
      'All 3 stages (2 indoor + 1 outdoor)',
      'Free camping included (first come, first serve; arrive Thursday)',
      'Bands all day, rave all night at The Club'
    ]
  },
  {
    id: '4-day-pass',
    name: '4 DAY PASS (THURS/FRI/SAT/SUN)',
    price: 70,
    description: 'Complete festival experience',
    icon: Star,
    isPopular: true,
    href: 'https://freakfest.bigcartel.com/product/freak-fest-2025-ticket',
    inclusions: [
      'All 4 days access (Oct 16-19)',
      'All 3 stages (2 indoor + 1 outdoor)',
      'Free camping included (first come, first serve; arrive Thursday)',
      'Bands all day, rave all night at The Club'
    ]
  },
  {
    id: 'vip-pass',
    name: 'VIP PASS',
    price: 80,
    description: 'Ultimate VIP experience',
    icon: Users,
    href: 'https://freakfest.bigcartel.com/product/freak-fest-2025-ticket',
    inclusions: [
      'VIP access & amenities',
      'All 4 days access',
      'Premium viewing areas',
      'Exclusive VIP perks',
      'Free camping included (first come, first serve; arrive Thursday)'
    ]
  }
]

export default function TicketSection() {
  const handlePurchase = (href?: string) => {
    const baseUrl = 'https://freakfest.bigcartel.com/product/freak-fest-2025-ticket'
    const utmParams = 'utm_source=site&utm_medium=tickets&utm_campaign=freakfest2025'
    const url = `${href || baseUrl}?${utmParams}`
    window.open(url, '_blank', 'noopener')
  }

  return (
    <section id="tickets" className="pt-24 pb-36 md:pb-48 bg-background relative overflow-hidden z-10 mt-16 md:mt-24">
      {/* Background energy effects */}
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Explosive title */}
        <div className="text-center mb-20">
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-black mb-8 text-primary explosive-entry text-explosion glitch-effect">
            GET TICKETS
          </h2>
          <div className="text-2xl md:text-3xl font-display font-bold text-card-foreground mb-4 diagonal-slide delay-200">
            SECURE YOUR SPOT • LIMITED CAPACITY
          </div>
          <div className="w-32 h-1 bg-primary mx-auto explosive-entry delay-300"></div>
        </div>

        {/* Dynamic ticket grid with perspective */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto perspective-1000">
          {ticketTiers.map((tier, index) => {
            const IconComponent = tier.icon
            return (
              <Card 
                key={tier.id} 
                className={`
                  relative hover-elevate transition-all duration-500 
                  ${tier.isPopular ? 'border-primary border-2 scale-105 pulse-glow' : 'border-primary/30'} 
                  bg-black/70 backdrop-blur-sm explosive-entry
                  transform-gpu
                `}
                style={{animationDelay: `${0.4 + index * 0.15}s`}}
                data-testid={`ticket-card-${tier.id}`}
              >
                {tier.isPopular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                    <Badge className="bg-primary text-black font-display font-black px-6 py-2 text-lg lightning-surge">
                      MOST POPULAR
                    </Badge>
                  </div>
                )}
                
                {/* Card glow effect */}
                
                <CardHeader className="text-center pb-6 relative z-10">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-full bg-black/60 pulse-glow">
                      <IconComponent className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  
                  <CardTitle className="font-display text-3xl font-black text-primary mb-2 text-center flex flex-wrap items-center justify-center gap-x-2">
                    {(() => {
                      const name = tier.name.toUpperCase()
                      const openIdx = name.indexOf('(')
                      const closeIdx = name.indexOf(')')
                      if (openIdx !== -1 && closeIdx !== -1 && closeIdx > openIdx) {
                        const before = name.slice(0, openIdx).trimEnd()
                        const inside = name.slice(openIdx, closeIdx + 1)
                        return (
                          <>
                            <span>{before}</span>
                            <span className="whitespace-nowrap">{inside}</span>
                          </>
                        )
                      }
                      return name
                    })()}
                  </CardTitle>
                  <p className="text-gray-300 font-medium text-lg text-center">{tier.description}</p>
                  
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center gap-3">
                      <span className="font-display text-5xl font-black text-primary">
                        ${tier.price}
                      </span>
                      {tier.originalPrice && (
                        <span className="text-xl text-gray-500 line-through">
                          ${tier.originalPrice}
                        </span>
                      )}
                    </div>
                    {tier.originalPrice && (
                      <Badge variant="destructive" className="mt-3 text-lg px-4 py-1">
                        SAVE ${tier.originalPrice - tier.price}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6 relative z-10">
                  <div className="space-y-4">
                    {tier.inclusions.map((inclusion, inclusionIndex) => (
                      <div 
                        key={inclusionIndex} 
                        className="flex items-start gap-3 diagonal-slide"
                        style={{animationDelay: `${0.6 + index * 0.15 + inclusionIndex * 0.05}s`}}
                        data-testid={`inclusion-${tier.id}-${inclusionIndex}`}
                      >
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground font-medium">{inclusion}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-6 space-y-4">
                    <Button 
                      className="w-full font-display font-black text-lg md:text-xl py-6 md:py-8 ticket-rush bg-primary hover:bg-primary/90 text-black border-2 border-primary transform hover:scale-105 transition-all duration-300 whitespace-normal break-words leading-snug text-center"
                      size="lg"
                      onClick={() => handlePurchase(tier.href)}
                      data-testid={`button-buy-${tier.id}`}
                    >
                      <span className="block sm:hidden">SECURE PASS</span>
                      <span className="hidden sm:inline">SECURE {tier.name.toUpperCase()}</span>
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground font-medium">
                        All sales final • Rain or shine • Refund only if event canceled
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Single-day note */}
        <div className="text-center mt-6">
          <span className="inline-block bg-black/70 backdrop-blur-sm border border-primary/30 px-4 py-2 rounded-md text-foreground text-sm italic">
            *single-day passes also available starting at $25
          </span>
        </div>

        {/* Urgency messaging */}
        <div className="text-center mt-16 explosive-entry delay-700">
          <div className="bg-black/60 rounded-lg p-8 max-w-3xl mx-auto">
            <div className="text-2xl md:text-3xl font-display font-black text-primary mb-4">
              SELLING FAST
            </div>
            <div className="text-lg text-muted-foreground font-medium">
              Don't miss out on the most intense festival experience of 2025
            </div>
          </div>
        </div>
      </div>
      
      {/* Top diagonal flow */}
    </section>
  )
}