
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Create a simpler scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    // Configure renderer with fail-safe
    try {
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      mountRef.current.appendChild(renderer.domElement);
    } catch (error) {
      console.error("Error setting up renderer:", error);
      return; // Stop if renderer setup fails
    }

    // Basic lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Create a very small number of particles
    const particles: THREE.Mesh[] = [];
    const particleCount = 10; // Drastically reduced count
    
    try {
      for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(0.05, 8, 8);
        const material = new THREE.MeshBasicMaterial({
          color: Math.random() > 0.5 ? 0xF47521 : 0x1F2937,
          transparent: true,
          opacity: 0.5,
        });
        const particle = new THREE.Mesh(geometry, material);

        // Simple positioning
        particle.position.x = (Math.random() - 0.5) * 10;
        particle.position.y = (Math.random() - 0.5) * 10;
        particle.position.z = Math.random() * 5 - 10;

        scene.add(particle);
        particles.push(particle);
      }
    } catch (error) {
      console.error("Error creating particles:", error);
    }

    // Position camera
    camera.position.z = 5;

    // Handle window resize - with error handling
    const handleResize = () => {
      try {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      } catch (error) {
        console.error("Error in resize handler:", error);
      }
    };
    
    window.addEventListener('resize', handleResize);

    // Very simple animation loop
    let animationId: number;
    const animate = () => {
      try {
        animationId = requestAnimationFrame(animate);
        
        // Simple slow movement
        particles.forEach((particle) => {
          particle.position.z += 0.001;
          
          // Reset particle
          if (particle.position.z > 5) {
            particle.position.z = -10;
          }
        });
        
        renderer.render(scene, camera);
      } catch (error) {
        console.error("Error in animation loop:", error);
        cancelAnimationFrame(animationId);
      }
    };
    
    // Start animation
    try {
      animate();
    } catch (error) {
      console.error("Error starting animation:", error);
    }

    // Cleanup function
    return () => {
      // Clean up event listeners
      window.removeEventListener('resize', handleResize);
      
      // Cancel animation frame
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      // Properly dispose resources
      try {
        particles.forEach(particle => {
          scene.remove(particle);
          if (particle.geometry) particle.geometry.dispose();
          if (particle.material) {
            if (Array.isArray(particle.material)) {
              particle.material.forEach(material => material.dispose());
            } else {
              particle.material.dispose();
            }
          }
        });
        
        renderer.dispose();
        
        // Remove canvas from DOM
        if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
          mountRef.current.removeChild(renderer.domElement);
        }
      } catch (error) {
        console.error("Error in cleanup:", error);
      }
    };
  }, []);

  // Ensure the component takes up the full viewport
  return <div ref={mountRef} className="fixed inset-0 -z-10" />;
};

export default ThreeBackground;
