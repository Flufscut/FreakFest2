import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Mail, ArrowRight } from 'lucide-react'

export default function EmailCapture() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)
    
    try {
      // todo: remove mock functionality - integrate with real email service
      console.log('Email subscription:', email)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: 'You\'re in!',
        description: 'Thanks for subscribing. You\'ll be the first to know about updates, special offers, and lineup announcements.'
      })
      
      setEmail('')
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again or contact us directly.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-24 bg-background border-y border-primary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-black/60">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-black mb-8 text-primary explosive-entry text-explosion glitch-effect">
            GET UPDATES BEFORE ANYONE ELSE
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto font-medium">
            Be the first to know about lineup additions, early bird specials, 
            exclusive merchandise, and behind-the-scenes content.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" data-testid="email-signup-form">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 text-base"
              disabled={isLoading}
              data-testid="input-email-signup"
            />
            <Button 
              type="submit" 
              size="lg"
              disabled={isLoading}
              className="font-display font-bold lightning-surge bg-primary text-black border-2 border-primary"
              data-testid="button-subscribe"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  SUBSCRIBING...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  SUBSCRIBE
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground mt-4 max-w-md mx-auto">
            We respect your privacy. No spam, unsubscribe anytime. 
            By subscribing you agree to receive marketing emails from Freakfest.
          </p>
          
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Exclusive content</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Early access</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Special offers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}