import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
const ThreeDBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    const shapes: THREE.Mesh[] = [];
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x666666,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
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
      mesh.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      scene.add(mesh);
      shapes.push(mesh);
    }
    let frameId: number;
    const animate = () => {
      shapes.forEach((shape, i) => {
        shape.rotation.x += 0.002 + i * 0.0002;
        shape.rotation.y += 0.002 + i * 0.0002;
      });
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  return <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />;
};
export default ThreeDBackground;
