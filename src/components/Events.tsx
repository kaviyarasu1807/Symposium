import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { TECHNICAL_EVENTS, NON_TECHNICAL_EVENTS, type Event } from '@/src/constants';
import { cn } from '@/src/lib/utils';

const EventCard = ({ event, index }: { event: Event; index: number; key?: string }) => {
  const Icon = (Icons as any)[event.icon] || Icons.Zap;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group relative"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-purple to-cyber-blue rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-500" />
      <div className="relative glass p-8 rounded-2xl h-full flex flex-col items-start gap-4 overflow-hidden">
        {/* Animated Background Shape */}
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyber-purple/10 rounded-full blur-2xl group-hover:bg-cyber-purple/20 transition-colors" />
        
        <div className="p-3 bg-cyber-purple/10 rounded-xl text-cyber-purple group-hover:scale-110 transition-transform">
          <Icon className="w-8 h-8" />
        </div>
        
        <h3 className="text-xl font-bold font-display group-hover:text-cyber-purple transition-colors">
          {event.name}
        </h3>
        
        <p className="text-sm text-white/60 leading-relaxed">
          {event.description}
        </p>
        
        <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-bold text-cyber-purple uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          Learn More <Icons.ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </motion.div>
  );
};

const Events = () => {
  return (
    <section id="events" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold font-display mb-4"
          >
            Symposium <span className="text-cyber-purple">Events</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/60 max-w-xl mx-auto"
          >
            From high-stakes technical challenges to creative non-technical showdowns.
          </motion.p>
        </div>

        <div className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <h3 className="text-2xl font-bold font-display text-cyber-purple uppercase tracking-tighter">Technical Events</h3>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TECHNICAL_EVENTS.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <h3 className="text-2xl font-bold font-display text-cyber-blue uppercase tracking-tighter">Non-Technical Events</h3>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {NON_TECHNICAL_EVENTS.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
