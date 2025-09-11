import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    // Three.js scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random() * 0.5 + 0.5; // Grayscale colors
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    // Material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    // Points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    // Position camera
    camera.position.z = 3;
    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.x += 0.0005;
      particles.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      window.removeEventListener('resize', handleResize);
      scene.remove(particles);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);
  return <section className="relative overflow-hidden pt-16 pb-32">
      {/* 3D Background */}
      <canvas ref={canvasRef} className="absolute inset-0 -z-10" />
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold text-center leading-tight mb-6">
          <span className="block">Predict Customer Churn</span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-white">
            Before It Happens
          </span>
        </h1>
        <p className="text-xl text-gray-300 text-center max-w-3xl mb-10">
          Our advanced AI-powered platform helps you identify at-risk customers
          and take proactive measures to improve retention.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link to="/login" className="bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
            Get Started <ArrowRight size={18} />
          </Link>
          <button className="border border-gray-600 text-white px-8 py-3 rounded-md font-medium hover:bg-white/10 transition-colors">
            Watch Demo
          </button>
        </div>
        <div className="w-full max-w-4xl bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gray-800 p-1">
          <div className="bg-black rounded-lg overflow-hidden">
            <div className="h-[300px] sm:h-[400px] bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
              <div className="text-center p-8">
                <div className="inline-block p-4 rounded-full bg-white/5 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gray-500 to-gray-700 animate-pulse"></div>
                </div>
                <p className="text-gray-400">
                  Interactive dashboard visualization
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}