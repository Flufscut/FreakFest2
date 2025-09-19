import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface FAQ {
  id: string
  question: string
  answer: string
}

// todo: remove mock functionality - pull from /data/faq.json
const faqs: FAQ[] = [
  {
    id: '1',
    question: 'What time do doors open?',
    answer: 'Gates open 1 hour before the first scheduled performance each day. Specific times vary by day - check the schedule section for details.'
  },
  {
    id: '2',
    question: 'What items are prohibited?',
    answer: 'Weapons, illegal substances, outside alcohol, glass containers, fireworks, drones, laser pointers, professional audio/video equipment (without approval), large umbrellas, hard coolers, and pets (except service animals).'
  },
  {
    id: '3',
    question: 'Is camping included with tickets?',
    answer: 'Yes. Camping is free with your ticket and first come, first serve. We recommend arriving on Thursday to get a good spot.'
  },
  {
    id: '4',
    question: 'What is the refund policy?',
    answer: 'All ticket sales are final. The event will take place rain or shine. Refunds will only be issued if the event is officially canceled by organizers.'
  },
  {
    id: '5',
    question: 'Will there be food and drinks available?',
    answer: 'Yes! Multiple food vendors and bars will be available throughout the festival grounds. We offer everything from local specialties to vegetarian/vegan options.'
  },
  {
    id: '6',
    question: 'Is the venue ADA accessible?',
    answer: 'Yes, we provide accessible entry points and designated viewing areas. Contact support@freakfest2025.com in advance for specific accommodation requests.'
  },
  {
    id: '7',
    question: 'What is the format of the festival each day?',
    answer: 'Our roots are in hardcore punk and we also love rave culture — bands play all day, then we rave all night in a different building/stage called The Club.'
  },
  {
    id: '8',
    question: 'How do I get support?',
    answer: 'Contact us at support@freakfest2025.com or reach out on Instagram @forthefreaksbooking. Our team responds within 24 hours.'
  },
  {
    id: '9',
    question: 'Can I bring my camera?',
    answer: 'Personal cameras and phones are welcome! Professional equipment requires prior approval. No recording devices during performances unless specified.'
  },
  {
    id: '10',
    question: 'What other programming is there besides music?',
    answer: 'Drag show, arts & crafts vendors, food vendors, a pro wrestling show, open mic night, DJ open decks + more.'
  }
]

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-black mb-8 text-primary explosive-entry text-explosion glitch-effect">FAQ</h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Everything you need to know about Freakfest 2025
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq) => (
              <AccordionItem 
                key={faq.id} 
                value={faq.id}
                className="bg-background border border-border rounded-lg px-6"
                data-testid={`faq-item-${faq.id}`}
              >
                <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="text-center mt-12 p-8 bg-muted/50 rounded-lg">
            <h3 className="font-display text-xl font-bold mb-4">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <span className="text-sm">Email us:</span>
              <button 
                onClick={() => window.location.href = 'mailto:support@freakfest2025.com'}
                className="text-primary hover:underline font-medium"
                data-testid="button-contact-support-faq"
              >
                support@freakfest2025.com
              </button>
              <span className="text-sm text-muted-foreground">or follow</span>
              <button 
                onClick={() => window.open('https://instagram.com/forthefreaksbooking', '_blank')}
                className="text-primary hover:underline font-medium"
                data-testid="button-instagram-support"
              >
                @forthefreaksbooking
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}