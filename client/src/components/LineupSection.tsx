import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Music, ArrowRight } from 'lucide-react'
import { Link } from 'wouter'
import freakfestFlyer from '@assets/FFMAINUPDATE_1758052176341.png'

interface Artist {
  id: string
  name: string
  genre: string
  blurb: string
  isHeadliner?: boolean
  socials?: {
    instagram?: string
    twitter?: string
    website?: string
  }
}

// Real artist lineup from Google Sheets data
const mockLineup: Artist[] = [
  {
    id: '1',
    name: 'GODS',
    genre: 'Rock/Metal',
    blurb: "'ALCHEMY' OUT NOW! Crushing riffs meet melodic mastery",
    isHeadliner: true,
    socials: { instagram: '@godstheband' }
  },
  {
    id: '2', 
    name: 'SECTION!',
    genre: 'Electronic/Bass',
    blurb: 'High-energy electronic soundscapes',
    isHeadliner: true,
    socials: { instagram: '@section.sound' }
  },
  {
    id: '3',
    name: 'ANTO',
    genre: 'Tech & Bass House',
    blurb: 'Tech & Bass House DJ/Producer from Charleston, SC',
    isHeadliner: true,
    socials: { instagram: '@antomusic.us' }
  },
  {
    id: '4',
    name: 'DBLCRWN',
    genre: 'Producer/DJ',
    blurb: 'Producer/DJ/Engineer/Podcaster, Guitarist in Gods',
    isHeadliner: true,
    socials: { instagram: '@dbl.crwn' }
  },
  {
    id: '5',
    name: 'SIRENA',
    genre: 'Electronic/DJ',
    blurb: 'Palestinian DJ bringing explosive energy',
    socials: { instagram: '@sirenamusic__' }
  },
  {
    id: '6',
    name: 'PUBLIC CONSUMPTION',
    genre: '70s Rock/Jam',
    blurb: '70s rock / jam band based in Charleston SC',
    socials: { instagram: '@publicconsumptionband' }
  },
  {
    id: '7',
    name: 'VASHI',
    genre: 'Event Curator',
    blurb: 'Charleston Event Curator and Sound Selector',
    socials: { instagram: '@vashi_music' }
  },
  {
    id: '8',
    name: 'JUICE COLLECTIVE TAKEOVER',
    genre: 'Collective',
    blurb: 'You got the juice now... Curated by D3xtrmusic',
    socials: { instagram: '@juiceartco' }
  }
]

export default function LineupSection() {
  return (
    <section id="lineup" className="diagonal-section overlapping-section bg-background relative overflow-hidden">
      {/* Background energy effects */}
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Explosive title with enhanced effects */}
        <div className="text-center mb-20">
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-black mb-8 text-primary explosive-entry text-explosion glitch-effect">
            THE LINEUP
          </h2>
          <div className="text-2xl md:text-3xl font-display font-bold text-card-foreground mb-4 diagonal-slide delay-200">
            Bands all day • Rave all night at The Club
          </div>
          <div className="w-32 h-1 bg-primary mx-auto mb-6 explosive-entry delay-300"></div>
        </div>

        {/* Freakfest Flyer Showcase */}
        <div className="text-center mb-16 explosive-entry delay-400">
          <div className="max-w-2xl mx-auto">
            <img 
              src={freakfestFlyer} 
              alt="Freakfest 2025 Official Lineup Poster" 
              className="w-full rounded-lg shadow-2xl border-2 border-primary/30 hover:border-primary/60 transition-all duration-500 hover:scale-105"
              data-testid="freakfest-lineup-poster"
            />
            <p className="text-sm text-muted-foreground mt-4 font-mono">
              OFFICIAL FREAKFEST 2025 LINEUP POSTER
            </p>
          </div>
        </div>

        {/* Dynamic headliner grid removed per request (keep supporting acts below) */}
        
        {/* Supporting acts teaser with explosive effects */}
        <div className="bg-black/60 rounded-lg p-8 mb-12 diagonal-slide delay-600 energy-wave explosive-card">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {mockLineup.filter(artist => !artist.isHeadliner).map((artist, index) => (
              <div key={artist.id} className="explosive-entry glitch-effect hover:scale-110 transition-transform" style={{animationDelay: `${0.8 + index * 0.1}s`}}>
                <div className="font-display font-bold text-primary text-lg text-explosion">{artist.name}</div>
                <div className="text-xs text-gray-400 mt-1">{artist.genre}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Explosive CTA */}
        <div className="text-center explosive-entry delay-700">
          <div className="text-xl md:text-2xl font-display font-bold text-primary mb-6">
            EXPERIENCE THE FULL LINEUP
          </div>
          <Link href="/artists">
            <Button 
              size="lg" 
              className="font-display font-black text-xl px-12 py-8 pulse-glow bg-primary hover:bg-primary/90 text-black border-2 border-primary transform hover:scale-105 transition-all duration-300" 
              data-testid="button-view-all-artists"
            >
              VIEW ALL ARTISTS
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Bottom diagonal flow */}
    </section>
  )
}