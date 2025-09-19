import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'

export default function WhatIsSection() {
  return (
    <section id="about" className="py-24 bg-background relative z-0 mt-16 md:mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-black mb-8 text-primary explosive-entry text-explosion glitch-effect">
            WHAT IS FREAK FEST?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
            A 4 day music and arts festival at Cartersville Country Winery in Timmonsville, SC —
            bands all day, then we rave all night in The Club.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <p className="text-xl md:text-2xl font-display font-black tracking-wide text-primary/90 mb-6">
            Four days. Three stages. One winery in South Carolina. High energy. Zero filler.
          </p>

          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground mb-5">
            Freakfest is a <span className="text-primary font-semibold">DIY music and arts takeover</span> at
            Cartersville Country Winery in Timmonsville, SC. We’re rooted in hardcore punk with a deep love for
            rave culture—<span className="text-primary font-semibold">bands by day</span> on multiple stages, then we flip
            the building and <span className="text-primary font-semibold">rave all night</span> in The Club.
          </p>

          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground mb-5">
            Post up under the stars: <span className="text-primary font-semibold">free camping</span> comes with your ticket
            (first come, first serve—arrive Thursday to lock your spot). We’ve got two indoor stages and one outdoor stage,
            indoor bathrooms, and a grounds layout designed for fast changeovers and non‑stop flow.
          </p>

          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground mb-6">
            Beyond the music: drag shows, arts & food vendors, pro wrestling, open mic night, and DJ open decks.
            Bring warm layers, follow the greeting crew on arrival, and—most importantly—<span className="text-primary font-semibold">take care of each other</span>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mt-2">
            {[
              'Hardcore energy',
              'Rave all night',
              '3 stages',
              'Free camping',
              'Drag',
              'Vendors',
              'Wrestling'
            ].map((pill) => (
              <span
                key={pill}
                className="px-3 py-1 rounded-full text-xs md:text-sm bg-black/50 border border-primary/30 text-foreground/90 hover:border-primary/60 transition-colors"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


