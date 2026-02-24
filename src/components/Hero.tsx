import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, ChevronRight, Calendar, MapPin } from 'lucide-react';

const Hero = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2026-03-20T09:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-purple/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-blue/20 blur-[120px] rounded-full animate-pulse" />
      
      {/* Floating Particles (Simulated with CSS) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{ 
              y: [null, Math.random() * -500],
              opacity: [0, 0.5, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1 rounded-full glass text-xs font-bold tracking-widest text-cyber-purple mb-6 uppercase">
            Department of Information Technology Presents
          </span>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold font-display mb-4 tracking-tighter">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">VELONIX</span>
            <span className="text-cyber-purple neon-glow-purple">'2K26</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            National Level Technical Symposium. Where Innovation Meets Technology.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
            <motion.a
              href="#register"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-cyber-purple rounded-xl font-bold flex items-center gap-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              Register Now <ChevronRight className="w-5 h-5" />
            </motion.a>
            
            <motion.a
              href="#events"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 glass rounded-xl font-bold hover:bg-white/10 transition-colors"
            >
              Explore Events
            </motion.a>
          </div>

          {/* Countdown */}
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="glass p-4 rounded-2xl">
                <div className="text-2xl md:text-3xl font-bold font-display text-cyber-purple">
                  {(value as number) < 10 ? `0${value}` : value}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">
                  {unit}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/50 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyber-purple" /> March 20, 2026
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyber-purple" /> IT Block, Main Campus
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white/20 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
