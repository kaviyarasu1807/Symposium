import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Events from './components/Events';
import RegistrationForm from './components/RegistrationForm';
import Contact from './components/Contact';
import AdminDashboard from './components/AdminDashboard';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setIsAdmin(true);
    }
  }, []);

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div className="relative">
      <Navbar />
      <main>
        <Hero />
        <Events />
        <RegistrationForm />
        <Contact />
      </main>
      
      <footer className="py-12 border-t border-white/10 bg-cyber-bg">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-2xl font-bold tracking-tighter font-display">
              VELONIX<span className="text-cyber-purple">'2K26</span>
            </span>
          </div>
          <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
            Organized by the Department of Information Technology. 
            Empowering the next generation of tech leaders.
          </p>
          <div className="flex items-center justify-center gap-6 text-white/40 mb-8">
            <a href="#" className="hover:text-cyber-purple transition-colors">Instagram</a>
            <a href="#" className="hover:text-cyber-purple transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-cyber-purple transition-colors">Twitter</a>
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/20">
            © 2026 VELONIX Symposium. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
