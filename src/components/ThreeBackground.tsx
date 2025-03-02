
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create geometric objects for the background
    const particles: THREE.Mesh[] = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.SphereGeometry(0.05 + Math.random() * 0.1, 8, 8);
      const material = new THREE.MeshPhongMaterial({ 
        color: Math.random() > 0.5 ? 0xF47521 : 0x1F2937,
        transparent: true,
        opacity: 0.7
      });
      
      const particle = new THREE.Mesh(geometry, material);
      
      // Position randomly but mostly behind the camera
      particle.position.x = (Math.random() - 0.5) * 10;
      particle.position.y = (Math.random() - 0.5) * 10;
      particle.position.z = (Math.random() * 5) - 10; // Mostly behind camera
      
      // Add random rotation
      particle.rotation.x = Math.random() * Math.PI;
      particle.rotation.y = Math.random() * Math.PI;
      
      scene.add(particle);
      particles.push(particle);
    }

    // Position camera
    camera.position.z = 5;

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      // Animate particles
      particles.forEach(particle => {
        particle.rotation.x += 0.002;
        particle.rotation.y += 0.002;
        particle.position.z += 0.01;
        
        // Reset particles when they get too close to the camera
        if (particle.position.z > 5) {
          particle.position.z = -10;
          particle.position.x = (Math.random() - 0.5) * 10;
          particle.position.y = (Math.random() - 0.5) * 10;
        }
      });
      
      renderer.render(scene, camera);
      
      return animationId;
    };

    const animationId = animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
};

export default ThreeBackground;
