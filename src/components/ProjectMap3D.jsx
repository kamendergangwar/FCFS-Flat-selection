import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

/*
 * 3D interactive map for Flat Selection.
 *
 * Shows a stylised terrain disc with glowing building towers for each project,
 * pulsing beacons, animated particle field, connecting road-grid lines,
 * and a subtle auto-orbit.  Clicking a tower selects the project.
 */

const CAMERA_DISTANCE = 15;
const CAMERA_HEIGHT = 9;
const ORBIT_SPEED = 0.08;
const COLORS = {
  bg: '#060e1a',
  fog: '#060e1a',
  platform: '#0d1b2e',
  platformEdge: '#1a3050',
  grid: '#1a3a5e',
  road: '#22506e',
  particle: '#38bdf8',
  halo: '#1d4ed8',
  ambient: '#93c5fd',
};

/* ─── helpers ─── */
const mapProjectTo3D = (project, index, total) => {
  // spread projects on a circle/scatter based on their mapPosition
  const nx = (project.mapPosition.x / 100) * 2 - 1;   // -1..1
  const nz = (project.mapPosition.y / 100) * 2 - 1;   // -1..1
  return {
    x: nx * 4.5,
    z: nz * 3.8,
  };
};

const ProjectMap3D = ({ projects, selectedProjectId, onSelectProject, className }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  const onSelectRef = useRef(onSelectProject);
  onSelectRef.current = onSelectProject;

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    /* ═══════ Scene setup ═══════ */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(COLORS.bg);
    scene.fog = new THREE.FogExp2(COLORS.fog, 0.028);
    sceneRef.current = scene;

    const w = mountNode.clientWidth;
    const h = mountNode.clientHeight;
    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 120);
    camera.position.set(0, CAMERA_HEIGHT, CAMERA_DISTANCE);
    camera.lookAt(0, 1.0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mountNode.appendChild(renderer.domElement);

    /* ═══════ Lights ═══════ */
    scene.add(new THREE.AmbientLight(COLORS.ambient, 0.8));

    const keyLight = new THREE.DirectionalLight('#ffffff', 1.6);
    keyLight.position.set(8, 14, 10);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#60a5fa', 0.9);
    fillLight.position.set(-8, 6, -5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight('#a78bfa', 1.2, 30);
    rimLight.position.set(0, 8, -10);
    scene.add(rimLight);

    /* ═══════ Terrain Platform ═══════ */
    // Main disc
    const platformGeo = new THREE.CylinderGeometry(7.5, 8.5, 1.0, 72);
    const platformMat = new THREE.MeshStandardMaterial({
      color: COLORS.platform,
      metalness: 0.1,
      roughness: 0.85,
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -0.5;
    scene.add(platform);

    // Top surface layer (lighter, to simulate terrain)
    const surfaceGeo = new THREE.CylinderGeometry(7.4, 7.4, 0.12, 72);
    const surfaceMat = new THREE.MeshStandardMaterial({
      color: '#112840',
      metalness: 0.05,
      roughness: 0.92,
    });
    const surface = new THREE.Mesh(surfaceGeo, surfaceMat);
    surface.position.y = 0.06;
    scene.add(surface);

    // Rim glow ring
    const rimGeo = new THREE.TorusGeometry(7.0, 0.06, 16, 100);
    const rimMat = new THREE.MeshStandardMaterial({
      color: '#38bdf8',
      emissive: '#0ea5e9',
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.7,
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.14;
    scene.add(rim);

    // Inner ring
    const innerRimGeo = new THREE.TorusGeometry(4.5, 0.04, 16, 80);
    const innerRimMat = new THREE.MeshStandardMaterial({
      color: '#8b5cf6',
      emissive: '#7c3aed',
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.45,
    });
    const innerRim = new THREE.Mesh(innerRimGeo, innerRimMat);
    innerRim.rotation.x = Math.PI / 2;
    innerRim.position.y = 0.13;
    scene.add(innerRim);

    /* ═══════ Grid lines on platform ═══════ */
    const gridMat = new THREE.LineBasicMaterial({ color: COLORS.grid, transparent: true, opacity: 0.18 });
    for (let i = -6; i <= 6; i += 1.5) {
      // horizontal
      const hGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-7, 0.14, i),
        new THREE.Vector3(7, 0.14, i),
      ]);
      scene.add(new THREE.Line(hGeo, gridMat));
      // vertical
      const vGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i, 0.14, -7),
        new THREE.Vector3(i, 0.14, 7),
      ]);
      scene.add(new THREE.Line(vGeo, gridMat));
    }

    /* ═══════ Road-like curves connecting projects ═══════ */
    const roadMat = new THREE.LineBasicMaterial({
      color: COLORS.road,
      transparent: true,
      opacity: 0.3,
    });

    const positions3D = projects.map((p, i) => mapProjectTo3D(p, i, projects.length));

    // connect adjacent projects with curves
    for (let i = 0; i < projects.length - 1; i++) {
      const a = positions3D[i];
      const b = positions3D[i + 1];
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(a.x, 0.15, a.z),
        new THREE.Vector3((a.x + b.x) / 2, 0.15 + 0.3, (a.z + b.z) / 2),
        new THREE.Vector3(b.x, 0.15, b.z),
      );
      const curveGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(30));
      scene.add(new THREE.Line(curveGeo, roadMat));
    }

    /* ═══════ Project towers ═══════ */
    const clickableMeshes = [];
    const towerGroups = [];

    projects.forEach((project, i) => {
      const pos = positions3D[i];
      const isSel = project.id === selectedProjectId;
      const group = new THREE.Group();
      group.position.set(pos.x, 0.12, pos.z);
      group.userData.projectId = project.id;

      // Base pad
      const baseGeo = new THREE.CylinderGeometry(0.55, 0.7, 0.25, 24);
      const baseMat = new THREE.MeshStandardMaterial({
        color: '#0b1525',
        roughness: 0.9,
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.12;
      group.add(base);

      // Tower
      const towerH = isSel ? 3.8 : 1.6 + Math.random() * 0.8;
      const towerGeo = new THREE.BoxGeometry(0.7, towerH, 0.7);
      const towerMat = new THREE.MeshStandardMaterial({
        color: project.accent,
        emissive: project.accent,
        emissiveIntensity: isSel ? 0.7 : 0.25,
        metalness: 0.22,
        roughness: 0.35,
      });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.y = 0.25 + towerH / 2;
      group.add(tower);

      // Secondary smaller tower
      const annexH = towerH * 0.55;
      const annexGeo = new THREE.BoxGeometry(0.38, annexH, 0.38);
      const annexMat = new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        emissive: project.accent,
        emissiveIntensity: 0.12,
        metalness: 0.15,
        roughness: 0.4,
      });
      const annex = new THREE.Mesh(annexGeo, annexMat);
      annex.position.set(0.55, 0.25 + annexH / 2, -0.15);
      group.add(annex);

      // Beacon sphere on top
      const beaconGeo = new THREE.SphereGeometry(isSel ? 0.22 : 0.14, 20, 20);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#ffffff',
        emissiveIntensity: isSel ? 1.4 : 0.7,
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = 0.25 + towerH + 0.25;
      group.add(beacon);

      // Glow ring for selected
      if (isSel) {
        const glowGeo = new THREE.TorusGeometry(0.9, 0.035, 12, 48);
        const glowMat = new THREE.MeshStandardMaterial({
          color: project.accent,
          emissive: project.accent,
          emissiveIntensity: 2.0,
          transparent: true,
          opacity: 0.6,
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.rotation.x = Math.PI / 2;
        glow.position.y = 0.2;
        group.add(glow);

        // Vertical beam from selected
        const beamGeo = new THREE.CylinderGeometry(0.04, 0.04, 6, 8);
        const beamMat = new THREE.MeshStandardMaterial({
          color: project.accent,
          emissive: project.accent,
          emissiveIntensity: 1.5,
          transparent: true,
          opacity: 0.35,
        });
        const beam = new THREE.Mesh(beamGeo, beamMat);
        beam.position.y = 3.5;
        group.add(beam);
      }

      scene.add(group);
      towerGroups.push({ group, project, isSel, tower, beacon, towerH });

      // register clickable
      [base, tower, annex, beacon].forEach((m) => {
        m.userData.group = group;
        clickableMeshes.push(m);
      });
    });

    /* ═══════ Floating particles ═══════ */
    const particleCount = 200;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 18;
      pPositions[i * 3 + 1] = Math.random() * 6 + 0.5;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: COLORS.particle,
      size: 0.06,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* ═══════ Interaction ═══════ */
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerDown = (e) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      if (hits.length > 0) {
        const pid = hits[0].object.userData.group?.userData?.projectId;
        if (pid) onSelectRef.current(pid);
      }
    };

    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    /* ═══════ Hover cursor ═══════ */
    const handlePointerMove = (e) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'grab';
    };
    renderer.domElement.addEventListener('pointermove', handlePointerMove);

    /* ═══════ Animation loop ═══════ */
    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // slow orbit
      const angle = elapsed * ORBIT_SPEED;
      camera.position.x = Math.sin(angle) * CAMERA_DISTANCE * 0.3;
      camera.position.z = CAMERA_DISTANCE + Math.cos(angle) * 2;
      camera.lookAt(0, 1.0, 0);

      // rings
      rim.rotation.z = elapsed * 0.15;
      innerRim.rotation.z = -elapsed * 0.1;

      // particles drift
      const pArr = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pArr[i * 3 + 1] += 0.003;
        if (pArr[i * 3 + 1] > 7) pArr[i * 3 + 1] = 0.3;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y = elapsed * 0.02;

      // tower animations
      towerGroups.forEach(({ group, beacon, tower, isSel, towerH }, idx) => {
        const phase = idx * 0.7;
        group.position.y = 0.12 + Math.sin(elapsed * 1.0 + phase) * 0.04;
        beacon.position.y = 0.25 + towerH + 0.25 + Math.sin(elapsed * 2.0 + phase) * 0.12;

        if (isSel) {
          tower.material.emissiveIntensity = 0.6 + Math.sin(elapsed * 2.5) * 0.15;
          group.rotation.y = elapsed * 0.3;
        } else {
          group.rotation.y += 0.002;
        }
      });

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    /* ═══════ Resize ═══════ */
    const handleResize = () => {
      if (!mountNode.clientWidth || !mountNode.clientHeight) return;
      camera.aspect = mountNode.clientWidth / mountNode.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    /* ═══════ Cleanup ═══════ */
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      if (mountNode.contains(renderer.domElement)) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, [projects, selectedProjectId]);

  return <div ref={mountRef} className={className || 'h-[420px] w-full'} />;
};

export default ProjectMap3D;
