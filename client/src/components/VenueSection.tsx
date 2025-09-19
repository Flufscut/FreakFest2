import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Car, Navigation, Info, Accessibility } from 'lucide-react'

// todo: remove mock functionality - pull from config file
const venueInfo = {
  name: 'Cartersville Country Winery',
  address: '571 Lamar Hwy, Timmonsville, SC',
  mapUrl: 'https://maps.google.com/?q=571+Lamar+Hwy,+Timmonsville,+SC'
}

const travelInfo = [
  {
    icon: Car,
    title: 'Parking',
    details: 'Parking available; first come, first serve. Arrive early for closer spots.'
  },
  {
    icon: Navigation,
    title: 'Rideshare',
    details: 'Uber/Lyft pickup zone located at main entrance.'
  },
  {
    icon: Info,
    title: 'Arrival Tips',
    details: 'Bring warm clothes — it got cold last year. Greeting committee will direct you on arrival.'
  },
  {
    icon: Accessibility,
    title: 'Accessibility',
    details: 'ADA accessible entry and viewing areas. Contact support for accommodations.'
  }
]

export default function VenueSection() {
  return (
    <section id="venue" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-black mb-8 text-primary explosive-entry text-explosion glitch-effect">VENUE & TRAVEL</h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Located in the heart of South Carolina's beautiful countryside
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Map Section */}
          <div className="space-y-6">
            <Card className="overflow-hidden" data-testid="venue-map-card">
              <CardContent className="p-0">
                <div className="overflow-hidden">
                  <iframe
                    title="Cartersville Country Winery Map"
                    src="https://www.google.com/maps?q=Cartersville%20Country%20Winery%20571%20Lamar%20Hwy%20Timmonsville%20SC%2029161&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    className="w-full h-[320px] md:h-[420px] border-0"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl font-bold mb-2">{venueInfo.name}</h3>
                  <p className="text-muted-foreground mb-4">{venueInfo.address}</p>
                  <Button 
                    onClick={() => window.open(venueInfo.mapUrl, '_blank')}
                    className="w-full"
                    data-testid="button-directions"
                  >
                    GET DIRECTIONS
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Travel Info */}
          <div className="space-y-6">
            {travelInfo.map((info, index) => {
              const IconComponent = info.icon
              return (
                <Card key={index} className="hover-elevate" data-testid={`travel-info-${index}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-primary/10 flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-display text-lg font-bold mb-2">{info.title}</h4>
                        <p className="text-muted-foreground">{info.details}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Additional Policies */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <h3 className="font-display text-2xl font-bold mb-6 text-center">Important Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-primary mb-3">Entry & Re-Entry</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• No re-entry allowed once you leave</li>
                    <li>• Gates open 1 hour before first act</li>
                    <li>• Valid ID required for entry</li>
                    <li>• Wristbands must remain on at all times</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-3">Prohibited Items</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Weapons of any kind</li>
                    <li>• Outside alcohol or beverages</li>
                    <li>• Professional cameras/recording equipment</li>
                    <li>• Glass containers</li>
                    <li>• Fireworks, lasers, or drones</li>
                  </ul>
                </div>
              </div>
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Questions? Contact{' '}
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto text-primary"
                    onClick={() => window.location.href = 'mailto:support@freakfest2025.com'}
                    data-testid="button-contact-support"
                  >
                    support@freakfest2025.com
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}