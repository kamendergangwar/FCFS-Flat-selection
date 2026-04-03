import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

const AnimatedBackground = () => {
  const mountRef = useRef(null);
  const { isDark } = useTheme();
  const location = useLocation();
  const isWorkflowPage = location.pathname.startsWith('/application/');
  const isDashboardPage = location.pathname === '/dashboard';
  const particleOpacity = isDashboardPage ? (isDark ? 0.75 : 0.35) : isWorkflowPage ? (isDark ? 0.35 : 0.18) : (isDark ? 0.5 : 0.24);
  const coreOpacity = isDashboardPage ? (isDark ? 0.32 : 0.18) : isWorkflowPage ? (isDark ? 0.16 : 0.08) : (isDark ? 0.22 : 0.12);
  const haloOpacity = isDashboardPage ? (isDark ? 0.28 : 0.16) : isWorkflowPage ? (isDark ? 0.12 : 0.07) : (isDark ? 0.18 : 0.1);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 11;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const coreGeometry = new THREE.IcosahedronGeometry(2.4, 1);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0x7dd3fc : 0x2563eb,
      wireframe: true,
      transparent: true,
      opacity: coreOpacity,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(coreMesh);

    const haloGeometry = new THREE.TorusGeometry(3.8, 0.04, 16, 160);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0xf9a8d4 : 0x7c3aed,
      transparent: true,
      opacity: haloOpacity,
    });
    const haloMesh = new THREE.Mesh(haloGeometry, haloMaterial);
    haloMesh.rotation.x = 1.1;
    group.add(haloMesh);

    const particleCount = 1400;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const stride = index * 3;
      particlePositions[stride] = (Math.random() - 0.5) * 28;
      particlePositions[stride + 1] = (Math.random() - 0.5) * 24;
      particlePositions[stride + 2] = (Math.random() - 0.5) * 20;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: isDark ? 0xffffff : 0x1e293b,
      size: 0.04,
      transparent: true,
      opacity: particleOpacity,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const pointer = { x: 0, y: 0 };

    const handlePointerMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('resize', handleResize);

    let animationFrameId;
    const animate = () => {
      animationFrameId = window.requestAnimationFrame(animate);

      group.rotation.x += 0.0018;
      group.rotation.y += 0.0024;
      haloMesh.rotation.z += 0.0015;
      particles.rotation.y -= 0.00035;
      particles.rotation.x += 0.0002;

      group.position.x += (pointer.x * 0.9 - group.position.x) * 0.025;
      group.position.y += (-pointer.y * 0.7 - group.position.y) * 0.025;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
      coreGeometry.dispose();
      coreMaterial.dispose();
      haloGeometry.dispose();
      haloMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, [coreOpacity, haloOpacity, isDark, particleOpacity]);

  return (
    <div className="pointer-events-none fixed inset-0">
      <div className={`absolute inset-0 ${isDark
        ? 'bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.24),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.22),_transparent_28%),linear-gradient(160deg,_#020617_0%,_#0f172a_45%,_#172554_100%)]'
        : 'bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.16),_transparent_24%),linear-gradient(160deg,_#e9f1ff_0%,_#dfeafe_52%,_#d3e1fb_100%)]'}`} />
      <div ref={mountRef} className={`absolute inset-0 ${isWorkflowPage ? 'opacity-55' : 'opacity-90'}`} />
      <div className={`skyline-wrap absolute inset-x-0 bottom-0 ${isDark ? 'opacity-60' : 'opacity-95'}`}>
        <div className={`skyline skyline-back ${isDark ? 'skyline-dark' : 'skyline-light'}`}>
          <span style={{ '--w': '7%', '--h': '22%', '--x': '0%' }} />
          <span style={{ '--w': '10%', '--h': '28%', '--x': '7%' }} />
          <span style={{ '--w': '8%', '--h': '18%', '--x': '17%' }} />
          <span style={{ '--w': '12%', '--h': '34%', '--x': '25%' }} />
          <span style={{ '--w': '7%', '--h': '24%', '--x': '37%' }} />
          <span style={{ '--w': '11%', '--h': '30%', '--x': '44%' }} />
          <span style={{ '--w': '9%', '--h': '20%', '--x': '55%' }} />
          <span style={{ '--w': '13%', '--h': '36%', '--x': '64%' }} />
          <span style={{ '--w': '8%', '--h': '25%', '--x': '77%' }} />
          <span style={{ '--w': '15%', '--h': '32%', '--x': '85%' }} />
        </div>
        <div className={`skyline skyline-front ${isDark ? 'skyline-dark-front' : 'skyline-light-front'}`}>
          <span style={{ '--w': '9%', '--h': '30%', '--x': '2%' }} />
          <span style={{ '--w': '6%', '--h': '18%', '--x': '12%' }} />
          <span style={{ '--w': '11%', '--h': '40%', '--x': '20%' }} />
          <span style={{ '--w': '8%', '--h': '24%', '--x': '33%' }} />
          <span style={{ '--w': '14%', '--h': '44%', '--x': '41%' }} />
          <span style={{ '--w': '9%', '--h': '28%', '--x': '56%' }} />
          <span style={{ '--w': '7%', '--h': '22%', '--x': '67%' }} />
          <span style={{ '--w': '12%', '--h': '38%', '--x': '74%' }} />
          <span style={{ '--w': '10%', '--h': '26%', '--x': '87%' }} />
        </div>
      </div>
      <div className={`absolute inset-0 ${isDark
        ? isWorkflowPage
          ? 'bg-[linear-gradient(180deg,_rgba(2,6,23,0.42)_0%,_rgba(2,6,23,0.56)_100%)]'
          : 'bg-[linear-gradient(180deg,_rgba(2,6,23,0.18)_0%,_rgba(2,6,23,0.44)_100%)]'
        : isWorkflowPage
          ? 'bg-[linear-gradient(180deg,_rgba(255,255,255,0.18)_0%,_rgba(203,213,225,0.34)_100%)]'
          : 'bg-[linear-gradient(180deg,_rgba(255,255,255,0.04)_0%,_rgba(203,213,225,0.2)_100%)]'}`} />
    </div>
  );
};

export default AnimatedBackground;
