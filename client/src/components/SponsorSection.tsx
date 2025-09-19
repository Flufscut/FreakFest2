import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { Building2, Star, Crown, Trophy } from 'lucide-react'

interface SponsorTier {
  id: string
  name: string
  price: string
  benefits: string[]
  icon: any
  popular?: boolean
}

interface SponsorFormData {
  name: string
  company: string
  email: string
  phone: string
  budget: string
  notes: string
}

// todo: remove mock functionality - pull from sponsor deck PSD
const sponsorTiers: SponsorTier[] = [
  {
    id: 'bronze',
    name: 'Bronze Partner',
    price: '$2,500',
    icon: Building2,
    benefits: [
      'Logo on festival website',
      'Social media mentions',
      '2 complimentary tickets',
      'Program book listing'
    ]
  },
  {
    id: 'silver', 
    name: 'Silver Sponsor',
    price: '$5,000',
    icon: Star,
    benefits: [
      'All Bronze benefits',
      'Logo on event banners',
      '4 VIP tickets',
      'Merchandise booth space',
      'Email list mention'
    ]
  },
  {
    id: 'gold',
    name: 'Gold Sponsor',
    price: '$10,000',
    icon: Trophy,
    popular: true,
    benefits: [
      'All Silver benefits',
      'Stage naming rights',
      '8 VIP tickets',
      'Prime booth location',
      'Artist meet & greet access'
    ]
  },
  {
    id: 'platinum',
    name: 'Platinum Partner',
    price: '$20,000+',
    icon: Crown,
    benefits: [
      'All Gold benefits',
      'Title sponsorship opportunity',
      '15 VIP tickets',
      'Custom activation space',
      'Private artist performance'
    ]
  }
]

export default function SponsorSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()
  const { register, handleSubmit, reset, setValue, watch } = useForm<SponsorFormData>()

  const onSubmit = async (data: SponsorFormData) => {
    // todo: remove mock functionality - integrate with real API
    console.log('Sponsor form submitted:', data)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Thank you for your interest!',
        description: 'We\'ll be in touch within 24 hours to discuss sponsorship opportunities.'
      })
      
      reset()
      setIsModalOpen(false)
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again or contact us directly.',
        variant: 'destructive'
      })
    }
  }

  return (
    <section id="sponsors" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-6xl font-black mb-6 text-primary">SPONSORS</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Partner with us to reach thousands of passionate music fans
          </p>
        </div>

        {/* Sponsor Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {sponsorTiers.map((tier) => {
            const IconComponent = tier.icon
            return (
              <Card 
                key={tier.id}
                className={`hover-elevate transition-all duration-300 relative ${
                  tier.popular ? 'border-primary border-2' : ''
                }`}
                data-testid={`sponsor-tier-${tier.id}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-bold">
                      MOST POPULAR
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  
                  <h3 className="font-display text-xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-4">{tier.price}</p>
                  
                  <div className="space-y-2 text-sm text-left">
                    {tier.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Existing Sponsors Logo Grid - todo: remove mock functionality */}
        <div className="mb-16">
          <h3 className="font-display text-2xl font-bold text-center mb-8">Our Amazing Partners</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {Array.from({length: 6}, (_, i) => (
              <div key={i} className="aspect-square w-24 h-24 bg-card-border rounded-lg flex items-center justify-center" data-testid={`sponsor-logo-${i}`}>
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="font-display font-bold text-lg px-8 py-6" data-testid="button-sponsor-request">
                REQUEST SPONSORSHIP INFO
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-4" data-testid="sponsor-modal">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl font-bold">Sponsor Freakfest 2025</DialogTitle>
                <DialogDescription>
                  Tell us about your company and we'll send you our full sponsorship package.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      {...register('name', { required: true })}
                      placeholder="Your name"
                      data-testid="input-sponsor-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      {...register('company', { required: true })}
                      placeholder="Company name"
                      data-testid="input-sponsor-company"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { required: true })}
                    placeholder="your@email.com"
                    data-testid="input-sponsor-email"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="(555) 123-4567"
                    data-testid="input-sponsor-phone"
                  />
                </div>
                
                <div>
                  <Label htmlFor="budget">Budget Range</Label>
                  <Select onValueChange={(value) => setValue('budget', value)}>
                    <SelectTrigger data-testid="select-sponsor-budget">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                      <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10000-20000">$10,000 - $20,000</SelectItem>
                      <SelectItem value="20000+">$20,000+</SelectItem>
                      <SelectItem value="custom">Custom Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    {...register('notes')}
                    placeholder="Tell us about your goals and interests..."
                    rows={3}
                    data-testid="textarea-sponsor-notes"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1"
                    data-testid="button-sponsor-cancel"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 font-display font-bold"
                    data-testid="button-sponsor-submit"
                  >
                    SEND REQUEST
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  )
}