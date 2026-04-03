import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NagpurLocationScene = ({ locations, selectedLocationId, onSelectLocation }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return undefined;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#07111f');
    scene.fog = new THREE.Fog('#07111f', 10, 34);

    const camera = new THREE.PerspectiveCamera(42, mountNode.clientWidth / mountNode.clientHeight, 0.1, 100);
    camera.position.set(0, 7.5, 13);
    camera.lookAt(0, 2.8, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountNode.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight('#dbeafe', 1.45));

    const keyLight = new THREE.DirectionalLight('#ffffff', 2.3);
    keyLight.position.set(6, 10, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#60a5fa', 1.4);
    rimLight.position.set(-6, 5, -6);
    scene.add(rimLight);

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(6.2, 7.2, 0.8, 56),
      new THREE.MeshStandardMaterial({
        color: '#0f2037',
        metalness: 0.18,
        roughness: 0.84,
      }),
    );
    platform.position.y = -0.4;
    scene.add(platform);

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(4.7, 0.12, 22, 120),
      new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        emissive: '#1d4ed8',
        emissiveIntensity: 0.7,
      }),
    );
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 0.06;
    scene.add(halo);

    const selectedLocation = locations.find((location) => location.id === selectedLocationId) || locations[0];
    const otherLocations = locations.filter((location) => location.id !== selectedLocation.id).slice(0, 4);

    const clickableMeshes = [];
    const previewBuildings = [];

    const selectedGroup = new THREE.Group();
    selectedGroup.userData.locationId = selectedLocation.id;

    const selectedBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.7, 2.1, 0.7, 32),
      new THREE.MeshStandardMaterial({ color: '#0b1220', roughness: 0.9 }),
    );
    selectedBase.position.y = 0.35;

    const selectedTowerMaterial = new THREE.MeshStandardMaterial({
      color: selectedLocation.accent,
      emissive: selectedLocation.accent,
      emissiveIntensity: 0.55,
      metalness: 0.24,
      roughness: 0.36,
    });

    const selectedTower = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 5.4, 2.4),
      selectedTowerMaterial,
    );
    selectedTower.position.y = 3.35;

    const selectedAnnex = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 3.2, 1.15),
      new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        emissive: selectedLocation.accent,
        emissiveIntensity: 0.18,
        metalness: 0.18,
        roughness: 0.32,
      }),
    );
    selectedAnnex.position.set(1.75, 1.95, -0.55);

    const selectedBeacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 24, 24),
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#ffffff',
        emissiveIntensity: 1.1,
      }),
    );
    selectedBeacon.position.y = 6.35;

    selectedGroup.add(selectedBase, selectedTower, selectedAnnex, selectedBeacon);
    scene.add(selectedGroup);
    clickableMeshes.push(selectedBase, selectedTower, selectedAnnex, selectedBeacon);
    selectedBase.userData.group = selectedGroup;
    selectedTower.userData.group = selectedGroup;
    selectedAnnex.userData.group = selectedGroup;
    selectedBeacon.userData.group = selectedGroup;

    const previewOffsets = [
      [-4.1, 0.2, -1.2],
      [-2.2, 0.1, 2.6],
      [2.3, 0.1, 2.5],
      [4.2, 0.2, -1.1],
    ];

    otherLocations.forEach((location, index) => {
      const group = new THREE.Group();
      const [x, y, z] = previewOffsets[index];
      group.position.set(x, y, z);
      group.userData.locationId = location.id;

      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.75, 0.9, 0.28, 24),
        new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.9 }),
      );
      base.position.y = 0.15;

      const tower = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 2.2 + index * 0.2, 1.1),
        new THREE.MeshStandardMaterial({
          color: location.accent,
          emissive: location.accent,
          emissiveIntensity: 0.18,
          metalness: 0.16,
          roughness: 0.46,
        }),
      );
      tower.position.y = 1.3 + index * 0.08;

      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 18, 18),
        new THREE.MeshStandardMaterial({
          color: '#f8fafc',
          emissive: '#ffffff',
          emissiveIntensity: 0.8,
        }),
      );
      beacon.position.y = tower.position.y + tower.geometry.parameters.height / 2 + 0.22;

      group.add(base, tower, beacon);
      group.userData.towerMesh = tower;
      previewBuildings.push(group);
      scene.add(group);

      clickableMeshes.push(base, tower, beacon);
      base.userData.group = group;
      tower.userData.group = group;
      beacon.userData.group = group;
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      halo.rotation.z += 0.004;
      selectedGroup.rotation.y += 0.005;
      selectedGroup.position.y = Math.sin(elapsed * 1.2) * 0.08;
      selectedTower.material.emissiveIntensity = 0.5 + Math.sin(elapsed * 2.8) * 0.08;
      selectedBeacon.position.y = 6.25 + Math.sin(elapsed * 2.2) * 0.14;

      previewBuildings.forEach((group, index) => {
        group.rotation.y += 0.003 + index * 0.0005;
        group.position.y = Math.sin(elapsed * 1.4 + index) * 0.04;
        group.scale.setScalar(0.98 + Math.sin(elapsed * 1.6 + index) * 0.015);
      });

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    const handleResize = () => {
      if (!mountNode.clientWidth || !mountNode.clientHeight) return;
      camera.aspect = mountNode.clientWidth / mountNode.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    };

    const handlePointerDown = (event) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      const hit = raycaster.intersectObjects(clickableMeshes, false)[0];
      if (hit?.object?.userData?.group?.userData?.locationId) {
        onSelectLocation(hit.object.userData.group.userData.locationId);
      }
    };

    window.addEventListener('resize', handleResize);
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      window.cancelAnimationFrame(frameId);
      renderer.dispose();
      scene.traverse((object) => {
        if (object.isMesh) {
          object.geometry.dispose();
          object.material.dispose();
        }
      });
      if (mountNode.contains(renderer.domElement)) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, [locations, selectedLocationId, onSelectLocation]);

  return <div ref={mountRef} className="h-[280px] w-full overflow-hidden rounded-[1.75rem]" />;
};

export default NagpurLocationScene;
