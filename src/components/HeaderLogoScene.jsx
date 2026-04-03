import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

const HeaderLogoScene = () => {
  const mountRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const width = mount.clientWidth || 220;
    const height = mount.clientHeight || 92;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.8, 0.06, 18, 120),
      new THREE.MeshBasicMaterial({
        color: isDark ? 0x67e8f9 : 0x0284c7,
        transparent: true,
        opacity: isDark ? 0.45 : 0.3,
      }),
    );
    ring.rotation.x = 1.1;
    group.add(ring);

    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(1.25, 0.045, 16, 120),
      new THREE.MeshBasicMaterial({
        color: isDark ? 0xa78bfa : 0x7c3aed,
        transparent: true,
        opacity: isDark ? 0.35 : 0.22,
      }),
    );
    orbit.rotation.x = 0.85;
    orbit.rotation.y = 0.45;
    group.add(orbit);

    const particleCount = 90;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const stride = i * 3;
      const radius = 1.3 + Math.random() * 1.2;
      const angle = Math.random() * Math.PI * 2;
      positions[stride] = Math.cos(angle) * radius;
      positions[stride + 1] = Math.sin(angle) * radius * 0.6;
      positions[stride + 2] = (Math.random() - 0.5) * 0.4;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: isDark ? 0xffffff : 0x0f172a,
      size: 0.04,
      transparent: true,
      opacity: isDark ? 0.7 : 0.35,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    group.add(particles);

    let frameId;
    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      ring.rotation.z += 0.004;
      orbit.rotation.z -= 0.003;
      particles.rotation.z += 0.0015;
      group.position.y = Math.sin(Date.now() * 0.0014) * 0.08;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const nextWidth = mount.clientWidth || 220;
      const nextHeight = mount.clientHeight || 92;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
      ring.geometry.dispose();
      ring.material.dispose();
      orbit.geometry.dispose();
      orbit.material.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, [isDark]);

  return <div ref={mountRef} className="header-logo-scene" aria-hidden="true" />;
};

export default HeaderLogoScene;
