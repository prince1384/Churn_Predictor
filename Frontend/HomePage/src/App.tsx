import React from 'react';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
export function App() {
  return <div className="bg-black text-white min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>;
}