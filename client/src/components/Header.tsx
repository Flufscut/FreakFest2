import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { Link } from 'wouter'
import freakfestLogo from '@assets/fflogo - W.png'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    // If we're not on the home page, navigate to the anchor route
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.location.href = `/${sectionId === 'hero' ? '' : `#${sectionId}`}`.replace(/\/$/, '')
      setIsMenuOpen(false)
      return
    }
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    } else {
      // Fallback to hash navigation on same page
      window.location.hash = sectionId
    }
    setIsMenuOpen(false)
  }

  const navItems = [
    { label: 'Home', id: 'home', isLink: true, href: '/' },
    { label: 'Lineup', id: 'lineup', isLink: true },
    { label: 'Artists', id: 'artists', isLink: true },
    {
      label: 'Tickets',
      id: 'tickets',
      externalUrl:
        'https://freakfest.bigcartel.com/product/freak-fest-2025-ticket?utm_source=site&utm_medium=nav&utm_campaign=freakfest2025'
    },
    { label: 'Venue', id: 'venue', isLink: true },
    { label: 'Gallery', id: 'gallery', isLink: true },
    { label: 'FAQ', id: 'faq', isLink: true }
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <img 
              src={freakfestLogo} 
              alt="Freakfest 2025" 
              className="h-8 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.externalUrl ? (
                <button
                  key={item.id}
                  onClick={() => window.open(item.externalUrl as string, '_blank')}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                  data-testid={`nav-${item.id}`}
                >
                  {item.label}
                </button>
              ) : item.isLink ? (
                <Link key={item.id} href={item.href ?? `/${item.id}`}>
                  <button
                    className="text-foreground hover:text-primary transition-colors font-medium"
                    data-testid={`nav-${item.id}`}
                  >
                    {item.label}
                  </button>
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                  data-testid={`nav-${item.id}`}
                >
                  {item.label}
                </button>
              )
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => window.open('https://freakfest.bigcartel.com/product/freak-fest-2025-ticket?utm_source=site&utm_medium=nav&utm_campaign=freakfest2025', '_blank')}
              className="hidden sm:inline-flex font-display font-bold power-surge bg-primary text-black border-2 border-primary"
              data-testid="button-buy-tickets-nav"
            >
              BUY TICKETS
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-menu-toggle"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              item.externalUrl ? (
                <button
                  key={item.id}
                  onClick={() => {
                    window.open(item.externalUrl as string, '_blank')
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left py-2 px-4 text-foreground hover:text-primary hover:bg-black/20 rounded-md transition-colors"
                  data-testid={`nav-mobile-${item.id}`}
                >
                  {item.label}
                </button>
              ) : item.isLink ? (
                <Link key={item.id} href={item.href ?? `/${item.id}`}>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-left py-2 px-4 text-foreground hover:text-primary hover:bg-black/20 rounded-md transition-colors"
                    data-testid={`nav-mobile-${item.id}`}
                  >
                    {item.label}
                  </button>
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left py-2 px-4 text-foreground hover:text-primary hover:bg-black/20 rounded-md transition-colors"
                  data-testid={`nav-mobile-${item.id}`}
                >
                  {item.label}
                </button>
              )
            ))}
            <Button 
              onClick={() => {
                window.open('https://freakfest.bigcartel.com/product/freak-fest-2025-ticket?utm_source=site&utm_medium=nav&utm_campaign=freakfest2025', '_blank')
                setIsMenuOpen(false)
              }}
              className="w-full mt-4 font-display font-bold power-surge bg-primary text-black border-2 border-primary"
              data-testid="button-buy-tickets-mobile"
            >
              BUY TICKETS
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}