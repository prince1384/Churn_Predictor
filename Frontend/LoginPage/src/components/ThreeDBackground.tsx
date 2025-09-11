import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
const ThreeDBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    // Add renderer to DOM
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    // Create random positions for particles
    for (let i = 0; i < particlesCount * 3; i++) {
      // x, y, z positions
      posArray[i] = (Math.random() - 0.5) * 50;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    // Material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    });
    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    // Create floating geometric shapes
    const shapes: THREE.Mesh[] = [];
    // Create wireframe material
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x666666,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    // Create several geometric shapes
    for (let i = 0; i < 15; i++) {
      let geometry;
      const random = Math.random();
      if (random < 0.33) {
        geometry = new THREE.IcosahedronGeometry(Math.random() * 2 + 1, 0);
      } else if (random < 0.66) {
        geometry = new THREE.OctahedronGeometry(Math.random() * 2 + 1, 0);
      } else {
        geometry = new THREE.TetrahedronGeometry(Math.random() * 2 + 1, 0);
      }
      const mesh = new THREE.Mesh(geometry, wireMaterial);
      // Random position
      mesh.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40);
      // Random rotation
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      scene.add(mesh);
      shapes.push(mesh);
    }
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX / window.innerWidth * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      // Rotate particle system
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0005;
      // Subtle camera movement based on mouse position
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.03;
      camera.position.y += (mouseY * 2 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);
      // Animate shapes
      shapes.forEach(shape => {
        shape.rotation.x += 0.003;
        shape.rotation.y += 0.003;
      });
      renderer.render(scene, camera);
    };
    animate();
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      // Dispose geometries and materials
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      shapes.forEach(shape => {
        shape.geometry.dispose();
      });
      wireMaterial.dispose();
    };
  }, []);
  return <div ref={mountRef} className="absolute inset-0" />;
};
export default ThreeDBackground;