import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
const ThreeDMetric = ({
  churnRate
}) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    // Initialize scene if not already initialized
    if (!sceneRef.current) {
      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;
      // Setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);
      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 2);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
      // Add point lights for more dramatic lighting
      const pointLight1 = new THREE.PointLight(0x0088ff, 1, 10);
      pointLight1.position.set(2, 2, 2);
      scene.add(pointLight1);
      const pointLight2 = new THREE.PointLight(0xff8800, 1, 10);
      pointLight2.position.set(-2, -1, -2);
      scene.add(pointLight2);
      // Camera position
      camera.position.z = 5;
      // Store in ref
      sceneRef.current = {
        scene,
        camera,
        renderer,
        container,
        pointLight1,
        pointLight2
      };
      // Handle resize
      const handleResize = () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener('resize', handleResize);
      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        container.removeChild(renderer.domElement);
        sceneRef.current = null;
      };
    }
  }, []);
  useEffect(() => {
    if (!sceneRef.current) return;
    const {
      scene,
      camera,
      renderer,
      pointLight1,
      pointLight2
    } = sceneRef.current;
    // Clear existing objects except lights
    scene.children.forEach(child => {
      if (!(child instanceof THREE.Light)) {
        scene.remove(child);
      }
    });
    // Create a sphere representing the churn rate
    const normalizedChurnRate = Math.min((typeof churnRate === 'number' ? churnRate : parseFloat(churnRate)) / 100, 1);
    // Choose geometry and particle count based on churn rate
    const particleCount = Math.floor(300 + normalizedChurnRate * 1200);
    const radius = 0.8 + normalizedChurnRate * 1.0;
    const tube = 0.2 + normalizedChurnRate * 0.4;
    const geometry = new THREE.TorusKnotGeometry(radius, tube, 200, 32);
    // Material color based on churn rate
    const hue = (1 - normalizedChurnRate) * 0.3; // 0.3 (red) to 0 (green)
    // Enhanced material with better visuals
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color().setHSL(hue, 0.8, 0.5),
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
      emissive: new THREE.Color().setHSL(hue, 0.9, 0.3),
      emissiveIntensity: 0.5,
      reflectivity: 0.5,
      envMapIntensity: 1.0
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);
    // Add a wireframe for extra visual interest
    const wireframe = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15
    }));
    scene.add(wireframe);
    // Add particles for a more sophisticated visual effect
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.01 + normalizedChurnRate * 0.03,
      transparent: true,
      opacity: 0.5,
      color: new THREE.Color().setHSL(hue, 0.8, 0.6),
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      // Rotate the torus knot
      const speed = 0.005 + normalizedChurnRate * 0.02;
      torusKnot.rotation.x += speed;
      torusKnot.rotation.y += speed;
      wireframe.rotation.x += speed;
      wireframe.rotation.y += speed;
      // Rotate particles
      particles.rotation.x += speed * 0.05;
      particles.rotation.y += speed * 0.1;
      // Move lights for dynamic effect
      const time = Date.now() * 0.001;
      const orbit = 2.5 + normalizedChurnRate * 2.0;
      pointLight1.position.x = Math.sin(time) * orbit;
      pointLight1.position.z = Math.cos(time) * orbit;
      pointLight2.position.x = Math.sin(time * 0.7) * orbit;
      pointLight2.position.z = Math.cos(time * 0.7) * orbit;
      renderer.render(scene, camera);
    };
    animate();
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [churnRate]);
  return <div className="w-full h-72 relative" ref={containerRef}>
      {/* Enhanced overlay with gradient */}
      <div className="absolute top-4 left-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-3 rounded-lg border border-gray-700/50 shadow-lg z-10">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <span className="text-xs text-gray-400 block">
              Current Churn Rate
            </span>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              {churnRate}%
            </span>
          </div>
        </div>
      </div>
      {/* Indicators at bottom */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-gray-400 z-10">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
          <span>Low Risk</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
          <span>Medium Risk</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
          <span>High Risk</span>
        </div>
      </div>
    </div>;
};
export default ThreeDMetric;