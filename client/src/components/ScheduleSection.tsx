import { Clock, Calendar, Music2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useScrollReveal, useScrollRevealMultiple } from '@/hooks/useScrollReveal'

interface ScheduleEvent {
  id: string
  time: string
  act: string
  day: string
  type: 'music' | 'activity' | 'break'
}

// todo: remove mock functionality - replace with data from /data/schedule.json
const mockSchedule: ScheduleEvent[] = [
  { id: '1', day: 'Thursday, Oct 16', time: '5:00 PM', act: 'Gates Open', type: 'activity' },
  { id: '2', day: 'Thursday, Oct 16', time: '6:30 PM', act: 'WATER SPIRIT', type: 'music' },
  { id: '3', day: 'Thursday, Oct 16', time: '7:45 PM', act: 'FUTURE COFFINS', type: 'music' },
  { id: '4', day: 'Thursday, Oct 16', time: '9:00 PM', act: 'ENDS OF SANITY', type: 'music' },
  { id: '5', day: 'Thursday, Oct 16', time: '10:30 PM', act: 'GRAVES OF VALOR', type: 'music' },
  { id: '6', day: 'Friday, Oct 17', time: '12:00 PM', act: 'Gates Open', type: 'activity' },
  { id: '7', day: 'Friday, Oct 17', time: '2:00 PM', act: 'IMMORTAL COWGIRL', type: 'music' },
  { id: '8', day: 'Friday, Oct 17', time: '3:30 PM', act: 'LUNA NEXUS', type: 'music' },
  { id: '9', day: 'Friday, Oct 17', time: '5:00 PM', act: 'BRASS TONGUE', type: 'music' },
  { id: '10', day: 'Friday, Oct 17', time: '6:30 PM', act: 'BLIND EQUATION', type: 'music' }
]

const groupByDay = (events: ScheduleEvent[]) => {
  return events.reduce((acc, event) => {
    if (!acc[event.day]) {
      acc[event.day] = []
    }
    acc[event.day].push(event)
    return acc
  }, {} as Record<string, ScheduleEvent[]>)
}

export default function ScheduleSection() {
  const groupedSchedule = groupByDay(mockSchedule)
  const titleRef = useScrollReveal({ threshold: 0.3 })
  const ctaRef = useScrollReveal({ threshold: 0.3 })
  const setCardRef = useScrollRevealMultiple(Object.keys(groupedSchedule).length)

  return (
    <section id="schedule" className="diagonal-section overlapping-section bg-background relative overflow-hidden">
      {/* Background energy effects */}
      <div className="absolute inset-0 energy-pulse"></div>
      <div className="absolute top-32 right-16 w-36 h-36 bg-secondary/5 rounded-full floating delay-400"></div>
      <div className="absolute bottom-24 left-12 w-28 h-28 bg-primary/10 rounded-full floating delay-200"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Explosive title with scroll reveal */}
        <div 
          ref={titleRef}
          className="text-center mb-20 scroll-bounce-in"
        >
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-black mb-8 text-primary">
            THE SCHEDULE
          </h2>
          <div className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
            FOUR DAYS • NON-STOP ENERGY • ZERO BREAKS
          </div>
          <div className="w-32 h-1 bg-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-400 font-medium">
            *Schedule subject to change • Get ready for chaos
          </p>
        </div>

        {/* Dynamic schedule grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {Object.entries(groupedSchedule).map(([day, events], dayIndex) => (
            <Card 
              key={day} 
              ref={setCardRef(dayIndex)}
              className={`hover-elevate transition-all duration-500 bg-black/60 border-primary/30 backdrop-blur-sm overflow-hidden ${dayIndex % 2 === 0 ? 'scroll-slide-left' : 'scroll-slide-right'}`}
              data-testid={`schedule-day-${day.split(',')[0].toLowerCase()}`}
            >
              <CardContent className="p-8">
                {/* Day header with energy effect */}
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-primary/20">
                  <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/10 pulse-glow">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-3xl font-black text-primary">{day}</h3>
                </div>
                
                {/* Events with staggered animations */}
                <div className="space-y-4">
                  {events.map((event, index) => {
                    const delayClasses = ['scroll-delay-100', 'scroll-delay-200', 'scroll-delay-300', 'scroll-delay-400', 'scroll-delay-500', 'scroll-delay-600']
                    const delayClass = delayClasses[Math.min(index, delayClasses.length - 1)]
                    
                    return (
                      <div 
                        key={event.id}
                        className={`flex items-center gap-6 p-4 rounded-lg backdrop-blur-sm transition-all duration-300 scroll-reveal ${delayClass} ${event.type === 'music' 
                            ? 'bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40' :
                            event.type === 'activity' 
                            ? 'bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20' :
                            'bg-gradient-to-r from-gray-800/20 to-gray-700/10 border border-gray-600/20'
                          }`}
                        data-testid={`schedule-event-${event.id}`}
                      >
                        {/* Time with glow effect */}
                        <div className="flex items-center gap-3 min-w-[120px]">
                          <div className="p-2 rounded-full bg-primary/20">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-mono text-lg font-bold text-primary">{event.time}</span>
                        </div>
                        
                        {/* Act name with emphasis */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            {event.type === 'music' && (
                              <Music2 className="h-5 w-5 text-primary" />
                            )}
                            <span className={`font-display font-bold text-lg ${
                              event.type === 'music' ? 'text-primary' : 'text-white'
                            }`}>
                              {event.act}
                            </span>
                          </div>
                          <div className={`text-sm mt-1 ${
                            event.type === 'music' ? 'text-primary/70' : 'text-gray-400'
                          }`}>
                            {event.type === 'music' ? 'Live Performance' : 'Festival Activity'}
                          </div>
                        </div>
                        
                        {/* Visual indicator */}
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          event.type === 'music' ? 'bg-primary pulse-glow' : 'bg-secondary'
                        }`} />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action with scroll reveal */}
        <div className="text-center mt-20">
          <div 
            ref={ctaRef}
            className="scroll-scale-up bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-lg p-8 max-w-3xl mx-auto"
          >
            <div className="text-2xl md:text-3xl font-display font-black text-primary mb-4">
              PLAN YOUR FESTIVAL EXPERIENCE
            </div>
            <div className="text-lg text-gray-300 font-medium">
              Mark your calendar and prepare for the most intense four days of your life
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom diagonal flow */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-r from-transparent via-secondary/10 to-transparent transform -skew-y-1"></div>
    </section>
  )
}