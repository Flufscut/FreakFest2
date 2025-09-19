import { Button } from '@/components/ui/button'
import { Instagram, Mail, MapPin, Twitter, Youtube } from 'lucide-react'
// Local TikTok icon (lucide-react does not export a TikTok brand icon)
const Tiktok = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M20 8.1c-1.8-.3-3.4-1.3-4.5-2.8V16c0 3.3-2.7 6-6 6S3.5 19.3 3.5 16c0-2.9 2.1-5.4 4.9-5.9v3.3c-.9.4-1.6 1.3-1.6 2.3 0 1.4 1.1 2.5 2.5 2.5S12 17.1 12 15.7V2h3.2c.4 2.1 2 3.9 4 4.5V8.1z"/>
  </svg>
)
import freakfestLogo from '@assets/fflogo - W.png'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://instagram.com/forthefreaksbooking',
      icon: Instagram
    },
    {
      name: 'X',
      url: 'https://linktr.ee/freakfest25?fbclid=PAZXh0bgNhZW0CMTEAAafP8Um1mCZDUTJwN7ycrBZUlKczkpYmY4o-sckpT_lrv2mv5GLld5oGLesphg_aem_j-Yq-E-qVtdEo1w2J_MJyg',
      icon: Twitter
    },
    {
      name: 'YouTube',
      url: 'https://linktr.ee/freakfest25?fbclid=PAZXh0bgNhZW0CMTEAAafP8Um1mCZDUTJwN7ycrBZUlKczkpYmY4o-sckpT_lrv2mv5GLld5oGLesphg_aem_j-Yq-E-qVtdEo1w2J_MJyg',
      icon: Youtube
    },
    {
      name: 'TikTok',
      url: 'https://linktr.ee/freakfest25?fbclid=PAZXh0bgNhZW0CMTEAAafP8Um1mCZDUTJwN7ycrBZUlKczkpYmY4o-sckpT_lrv2mv5GLld5oGLesphg_aem_j-Yq-E-qVtdEo1w2J_MJyg',
      icon: Tiktok
    },
    {
      name: 'Email',
      url: 'mailto:support@freakfest2025.com',
      icon: Mail
    }
  ]
  
  const legalLinks = [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' }
  ]

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img 
              src={freakfestLogo} 
              alt="Freakfest 2025" 
              className="h-12 w-auto mb-4"
            />
            <p className="text-muted-foreground mb-4 max-w-md">
              Four days of high-impact music at Cartersville Country Winery. 
              October 16-19, 2025 in Timmonsville, SC.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>571 Lamar Hwy, Timmonsville, SC</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-bold mb-4 text-primary">Event Info</h3>
            <div className="space-y-3">
              {[{name: 'Lineup', id: 'lineup'}, {name: 'Schedule', id: 'schedule'}, {name: 'Tickets', id: 'tickets'}, {name: 'Venue', id: 'venue'}, {name: 'FAQ', id: 'faq'}].map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    const element = document.getElementById(link.id)
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="block text-muted-foreground hover:text-primary transition-colors"
                  data-testid={`footer-nav-${link.id}`}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Contact & Social */}
          <div>
            <h3 className="font-display text-lg font-bold mb-4 text-primary">Connect</h3>
            <div className="space-y-3 mb-6">
              <div>
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto text-muted-foreground hover:text-primary"
                  onClick={() => window.location.href = 'mailto:support@freakfest2025.com'}
                  data-testid="footer-contact-email"
                >
                  support@freakfest2025.com
                </Button>
              </div>
              <div>
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto text-muted-foreground hover:text-primary"
                  onClick={() => window.open('https://instagram.com/forthefreaksbooking', '_blank')}
                  data-testid="footer-instagram"
                >
                  @forthefreaksbooking
                </Button>
              </div>
              <div>
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto text-muted-foreground hover:text-primary"
                  onClick={() => window.open('https://linktr.ee/freakfest25?fbclid=PAZXh0bgNhZW0CMTEAAafP8Um1mCZDUTJwN7ycrBZUlKczkpYmY4o-sckpT_lrv2mv5GLld5oGLesphg_aem_j-Yq-E-qVtdEo1w2J_MJyg', '_blank', 'noopener,noreferrer')}
                  data-testid="footer-linktree"
                >
                  Linktree
                </Button>
              </div>
              <div>
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto text-muted-foreground hover:text-primary"
                  onClick={() => window.open('https://linktr.ee/freakfest25?fbclid=PAZXh0bgNhZW0CMTEAAafP8Um1mCZDUTJwN7ycrBZUlKczkpYmY4o-sckpT_lrv2mv5GLld5oGLesphg_aem_j-Yq-E-qVtdEo1w2J_MJyg', '_blank', 'noopener,noreferrer')}
                  data-testid="footer-vendor-app"
                >
                  Vendor Application
                </Button>
              </div>
              <div>
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto text-muted-foreground hover:text-primary"
                  onClick={() => window.open('https://linktr.ee/freakfest25?fbclid=PAZXh0bgNhZW0CMTEAAafP8Um1mCZDUTJwN7ycrBZUlKczkpYmY4o-sckpT_lrv2mv5GLld5oGLesphg_aem_j-Yq-E-qVtdEo1w2J_MJyg', '_blank', 'noopener,noreferrer')}
                  data-testid="footer-volunteer-app"
                >
                  Volunteer Application
                </Button>
              </div>
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="icon"
                    className="hover-elevate"
                    onClick={() => {
                      if (social.url.startsWith('mailto:')) {
                        window.location.href = social.url
                      } else {
                        window.open(social.url, '_blank')
                      }
                    }}
                    data-testid={`footer-social-${social.name.toLowerCase()}`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Freakfest. All rights reserved. 
              Website designed for maximum headbanging experience.
            </p>
            
            <div className="flex gap-4 text-sm items-center">
              <button
                onClick={() => window.open('/assets/docs/Freakfest-Deck.pdf', '_blank', 'noopener,noreferrer')}
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="footer-sponsors-link"
                aria-label="Sponsors deck"
              >
                Sponsors
              </button>
              {legalLinks.map((link) => (
                <Button 
                  key={link.name}
                  variant="ghost" 
                  className="p-0 h-auto text-muted-foreground hover:text-primary text-sm"
                  onClick={() => {
                    // todo: remove mock functionality - implement actual routes
                    console.log('Navigate to:', link.href)
                  }}
                  data-testid={`footer-legal-${link.name.toLowerCase().replace(' ', '-')}`}
                >
                  {link.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}