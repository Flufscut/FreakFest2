import { Link, useLocation } from 'wouter'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Instagram, Twitter, Music, ExternalLink } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Extended Artist interface with more detailed info
interface DetailedArtist {
  id: string
  name: string
  genre: string
  blurb: string
  isHeadliner?: boolean
  bio: string
  hometown: string
  yearsActive: string
  discography: string[]
  socials?: {
    instagram?: string
    twitter?: string
    website?: string
    spotify?: string
    bandcamp?: string
  }
}

// todo: remove mock functionality - replace with data from /data/artists.json
const detailedArtists: DetailedArtist[] = [
  {
    id: '1',
    name: 'ENDS OF SANITY',
    genre: 'Metalcore',
    blurb: 'Crushing breakdowns and emotional intensity',
    isHeadliner: true,
    bio: 'Formed in the underground scenes of the Pacific Northwest, Ends of Sanity has carved out a reputation for delivering bone-crushing performances that blend technical prowess with raw emotional power. Their sound combines the aggression of modern metalcore with introspective lyricism that explores themes of mental health, societal pressures, and personal redemption.',
    hometown: 'Seattle, WA',
    yearsActive: '2018-Present',
    discography: ['Fractured Reality (2023)', 'Breaking Point EP (2021)', 'First Light (2019)'],
    socials: { 
      instagram: '@endsofsanity',
      spotify: 'Ends of Sanity',
      bandcamp: 'endsofsanity'
    }
  },
  {
    id: '2',
    name: 'GRAVES OF VALOR',
    genre: 'Death Metal',
    blurb: 'Technical precision meets brutal power',
    isHeadliner: true,
    bio: 'Veterans of the extreme metal scene, Graves of Valor represents the pinnacle of technical death metal craftsmanship. With over a decade of experience, they have perfected a sound that is both devastatingly heavy and musically sophisticated, featuring complex arrangements that never sacrifice the primal energy that defines great death metal.',
    hometown: 'Tampa, FL',
    yearsActive: '2012-Present',
    discography: ['Eternal Warfare (2024)', 'Blood & Honor (2022)', 'Rise from Ashes (2020)', 'First Strike (2015)'],
    socials: { 
      instagram: '@gravesofvalor',
      twitter: '@gravesofvalor_official',
      spotify: 'Graves of Valor'
    }
  },
  {
    id: '3',
    name: 'BRASS TONGUE',
    genre: 'Hardcore',
    blurb: 'Relentless energy and raw emotion',
    isHeadliner: true,
    bio: 'Brass Tongue embodies the spirit of hardcore punk with a modern edge. Their music serves as both a rallying cry and a therapeutic release, addressing social injustice, personal struggles, and the power of community. Known for their electrifying live performances, they create an atmosphere where audiences don\'t just listen—they participate.',
    hometown: 'Boston, MA',
    yearsActive: '2019-Present',
    discography: ['Speak Truth (2023)', 'United We Stand EP (2022)', 'First Voice (2020)'],
    socials: { 
      instagram: '@brasstongue',
      bandcamp: 'brasstongue'
    }
  },
  {
    id: '4',
    name: 'BLIND EQUATION',
    genre: 'Progressive Metal',
    blurb: 'Complex compositions with brutal execution',
    isHeadliner: true,
    bio: 'Blind Equation pushes the boundaries of progressive metal, creating intricate soundscapes that challenge both performer and listener. Their compositions feature complex time signatures, unconventional song structures, and a dynamic range that can shift from whisper-quiet passages to earth-shaking crescendos within a single track.',
    hometown: 'Austin, TX',
    yearsActive: '2017-Present',
    discography: ['Mathematical Chaos (2023)', 'Variable Unknown (2021)', 'First Theorem (2018)'],
    socials: { 
      instagram: '@blindequation',
      website: 'blindequation.com',
      spotify: 'Blind Equation'
    }
  },
  {
    id: '5',
    name: 'WATER SPIRIT',
    genre: 'Ambient/Electronic',
    blurb: 'Ethereal soundscapes meet crushing drops',
    bio: 'Water Spirit creates immersive electronic experiences that blur the lines between ambient meditation and dance floor energy. Their sets take audiences on a journey through ethereal soundscapes before delivering crushing drops that shake the very foundations of the venue.',
    hometown: 'Portland, OR',
    yearsActive: '2020-Present',
    discography: ['Liquid Dreams (2023)', 'Flow State EP (2022)'],
    socials: { 
      instagram: '@waterspirit',
      spotify: 'Water Spirit'
    }
  },
  {
    id: '6',
    name: 'FUTURE COFFINS',
    genre: 'Doom Metal',
    blurb: 'Heavy atmospheres and haunting melodies',
    bio: 'Future Coffins specializes in creating heavy, atmospheric doom metal that explores themes of mortality, existentialism, and the human condition. Their slow, crushing riffs are paired with haunting melodies that linger long after the final note has faded.',
    hometown: 'New Orleans, LA',
    yearsActive: '2016-Present',
    discography: ['Eternal Rest (2023)', 'Mourning Songs (2021)', 'Death Dreams (2018)'],
    socials: { 
      instagram: '@futurecoffins',
      bandcamp: 'futurecoffins'
    }
  },
  {
    id: '7',
    name: 'IMMORTAL COWGIRL',
    genre: 'Alt Country/Metal',
    blurb: 'Where country meets crushing riffs',
    bio: 'Immortal Cowgirl represents a unique fusion of country storytelling with metal intensity. Their music tells tales of the American experience with the crushing power of heavy guitars, creating a sound that is both familiar and completely unexpected.',
    hometown: 'Nashville, TN',
    yearsActive: '2021-Present',
    discography: ['Steel & Whiskey (2024)', 'Outlaw Heart EP (2022)'],
    socials: { 
      instagram: '@immortalcowgirl',
      spotify: 'Immortal Cowgirl'
    }
  },
  {
    id: '8',
    name: 'LUNA NEXUS',
    genre: 'Synth Metal',
    blurb: 'Cosmic sounds with earthshaking bass',
    bio: 'Luna Nexus combines the cosmic atmospheres of synthesizer-driven music with the crushing power of metal. Their performances create an otherworldly experience that transports audiences to distant galaxies while keeping them grounded with earth-shaking bass lines.',
    hometown: 'Denver, CO',
    yearsActive: '2019-Present',
    discography: ['Cosmic Collision (2023)', 'Stellar Journey (2021)'],
    socials: { 
      instagram: '@lunanexus',
      website: 'lunanexus.space',
      spotify: 'Luna Nexus'
    }
  }
]

function ArtistProfilePage({ artistId }: { artistId: string }) {
  const artist = detailedArtists.find(a => a.id === artistId)
  
  if (!artist) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Artist Not Found</h1>
          <Link href="/artists">
            <Button>Back to Artists</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        {/* Back Navigation */}
        <div className="container mx-auto px-4 py-8">
          <Link href="/artists">
            <Button variant="ghost" className="mb-8" data-testid="button-back-to-artists">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Artists
            </Button>
          </Link>
        </div>

        {/* Artist Hero */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="aspect-square bg-card-border rounded-lg mb-8 flex items-center justify-center max-w-md mx-auto">
                  <Music className="h-24 w-24 text-muted-foreground" />
                </div>
              </div>
              
              <div>
                {artist.isHeadliner && (
                  <Badge className="mb-4 bg-primary text-primary-foreground">HEADLINER</Badge>
                )}
                <h1 className="font-display text-4xl md:text-6xl font-black mb-4 text-primary">
                  {artist.name}
                </h1>
                <Badge variant="secondary" className="text-lg px-4 py-2 mb-6">
                  {artist.genre}
                </Badge>
                <p className="text-xl text-muted-foreground mb-8">
                  {artist.blurb}
                </p>
                
                {/* Quick Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Hometown</h3>
                    <p className="text-muted-foreground">{artist.hometown}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Years Active</h3>
                    <p className="text-muted-foreground">{artist.yearsActive}</p>
                  </div>
                </div>

                {/* Social Links */}
                {artist.socials && (
                  <div className="flex flex-wrap gap-3">
                    {artist.socials.instagram && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://instagram.com/${artist.socials?.instagram?.replace('@', '')}`, '_blank')}
                        data-testid={`instagram-${artist.id}`}
                      >
                        <Instagram className="h-4 w-4 mr-2" />
                        Instagram
                      </Button>
                    )}
                    {artist.socials.twitter && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://twitter.com/${artist.socials?.twitter?.replace('@', '')}`, '_blank')}
                        data-testid={`twitter-${artist.id}`}
                      >
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </Button>
                    )}
                    {artist.socials.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://${artist.socials?.website}`, '_blank')}
                        data-testid={`website-${artist.id}`}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Website
                      </Button>
                    )}
                    {artist.socials.spotify && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://open.spotify.com/search/${encodeURIComponent(artist.socials?.spotify || '')}`, '_blank')}
                        data-testid={`spotify-${artist.id}`}
                      >
                        🎵 Spotify
                      </Button>
                    )}
                    {artist.socials.bandcamp && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://${artist.socials?.bandcamp}.bandcamp.com`, '_blank')}
                        data-testid={`bandcamp-${artist.id}`}
                      >
                        🎵 Bandcamp
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Biography */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl font-bold mb-8 text-primary">Biography</h2>
              <p className="text-lg leading-relaxed text-muted-foreground mb-12">
                {artist.bio}
              </p>
              
              {/* Discography */}
              <h2 className="font-display text-3xl font-bold mb-8 text-primary">Discography</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {artist.discography.map((release, index) => (
                  <Card key={index} className="hover-elevate" data-testid={`release-${index}`}>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground">{release}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

type ApiArtist = {
  id: string
  name: string
  instagramHandle: string
  instagramUrl: string
  profileImageUrl?: string
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState<ApiArtist[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [location] = useLocation()
  const artistId = location.split('/artists/')[1]
  const sortedArtists = useMemo(() => {
    if (!artists) return [] as ApiArtist[]
    return [...artists].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
  }, [artists])
  
  useEffect(() => {
    let isMounted = true
    const CACHE_KEY = 'artists-cache-v1'
    const CACHE_TTL_MS = 10 * 60 * 1000

    // Try fast path from sessionStorage for instant paint
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached) as { ts: number, artists: ApiArtist[] }
        if (Date.now() - parsed.ts < CACHE_TTL_MS && parsed.artists?.length) {
          setArtists(parsed.artists)
          setLoading(false)
        }
      }
    } catch {}

    ;(async () => {
      try {
        const res = await fetch('/api/artists')
        if (!res.ok) throw new Error(`Failed to load artists: ${res.status}`)
        const data = await res.json()
        if (isMounted) {
          setArtists(data.artists)
          setLoading(false)
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), artists: data.artists }))
          } catch {}
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e?.message ?? 'Failed to load artists')
          setLoading(false)
        }
      }
    })()
    return () => { isMounted = false }
  }, [])

  // Render all artists at once; no infinite scroll
  
  if (artistId) {
    return <ArtistProfilePage artistId={artistId} />
  }

  if (artistId) {
    return <ArtistProfilePage artistId={artistId} />
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        {/* Artists Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="font-display text-4xl md:text-6xl font-black mb-6 text-primary">ARTISTS</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get to know the incredible artists performing at Freakfest 2025
              </p>
              <div className="text-sm text-muted-foreground mt-2">Listed A–Z</div>
            </div>

            {error && (
              <div className="text-center text-red-500 mb-8">{error}</div>
            )}

            <div className="bg-black/60 rounded-lg p-8">
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedArtists.map((artist) => {
                  const targetUrl = artist.instagramUrl || (artist.instagramHandle ? `https://instagram.com/${artist.instagramHandle.replace(/^@/, '')}` : undefined)
                  return (
                    <div
                      key={artist.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => { if (targetUrl) window.open(targetUrl, '_blank', 'noopener') }}
                      onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && targetUrl) { e.preventDefault(); window.open(targetUrl, '_blank', 'noopener') } }}
                      className="explosive-entry glitch-effect transition-transform bg-black/60 rounded-lg p-6 backdrop-blur-sm cursor-pointer focus:outline-none text-center"
                      data-testid={`artist-card-${artist.id}`}
                    >
                      <div className="font-display font-bold text-primary text-lg text-explosion">
                        {artist.name}
                      </div>
                      {artist.instagramHandle && (
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-2">
                          <Instagram className="h-4 w-4" />
                          <span>@{artist.instagramHandle.replace(/^@/, '')}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              {/* render all at once; no sentinel */}
            </div>

            {loading && (
              <div className="mt-8 flex items-center justify-center py-16">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-primary text-xl tracking-widest">FREAKFEST</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}