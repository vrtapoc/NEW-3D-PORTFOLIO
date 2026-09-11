import React, { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

// 1. GLOBAL UNIFIED ROOM PARAMETERS
const ROOM_SIZE = 5.6; // Length of floor along X and Z
const WALL_HEIGHT = 3.2; // Uniform height for both walls
const WALL_THICKNESS = 0.38; // Uniform thickness for both walls
const SLAB_HEIGHT = 0.22; // Thickness of foundation slab underneath
const FLOOR_Y = 0; // Top level of the floor

export default function Model(props) {
  const gl = useThree((state) => state.gl);
  const maxAnisotropy = gl?.capabilities?.getMaxAnisotropy ? gl.capabilities.getMaxAnisotropy() : 16;

  // Helper: Procedural dark oak fallback texture in case of asset loading errors
  const fallbackWoodTexture = useMemo(() => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.fillStyle = '#3E2A1E';
      ctx.fillRect(0, 0, 1024, 1024);

      const numPlanks = 8;
      const plankHeight = 1024 / numPlanks;
      const tones = ['#4A3324', '#3E2A1E', '#523A2A', '#382419', '#442E20', '#4E3626', '#352116', '#483122'];

      for (let i = 0; i < numPlanks; i++) {
        const y = i * plankHeight;
        ctx.fillStyle = tones[i % tones.length];
        ctx.fillRect(0, y, 1024, plankHeight);

        ctx.strokeStyle = '#180E09';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(25, 15, 10, 0.25)';
        ctx.lineWidth = 1.2;
        for (let g = 0; g < 6; g++) {
          const gy = y + (g + 1) * (plankHeight / 7);
          ctx.beginPath();
          ctx.moveTo(0, gy);
          for (let x = 0; x <= 1024; x += 32) {
            ctx.lineTo(x, gy + Math.sin((x + i * 150) * 0.015) * 2.0);
          }
          ctx.stroke();
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      return texture;
    } catch {
      return null;
    }
  }, []);

  // POLY HAVEN "WOOD CABINET WORN LONG" 2K PBR MAPS (16x Anisotropy)
  const [woodDiff, woodAo, woodArm, woodDisp] = useTexture([
    '/textures/floor/wood_diff_2k.jpg',
    '/textures/floor/wood_ao_2k.jpg',
    '/textures/floor/wood_arm_2k.jpg',
    '/textures/floor/wood_disp_2k.png',
  ], () => {}, (err) => {
    console.warn('[DarkOffice1st] Warning loading floor PBR maps, using fallback procedural wood texture:', err);
  });

  useMemo(() => {
    [woodDiff, woodAo, woodArm, woodDisp].forEach((tex) => {
      if (tex) {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(4, 4);
        tex.anisotropy = maxAnisotropy;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        tex.needsUpdate = true;
      }
    });
    if (woodDiff) woodDiff.colorSpace = THREE.SRGBColorSpace;
  }, [woodDiff, woodAo, woodArm, woodDisp, maxAnisotropy]);

  // 2. MATERIALS
  const wallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#141211"),
      roughness: 0.94,
      metalness: 0.0,
      clearcoat: 0.0,
      envMapIntensity: 0.05,
      side: THREE.DoubleSide,
    });
  }, []);

  const floorMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: woodDiff || fallbackWoodTexture,
      aoMap: woodAo,
      aoMapIntensity: 1.0,
      roughnessMap: woodArm,
      bumpMap: woodDisp,
      bumpScale: 0.015,
      color: "#FFFFFF",
      roughness: 0.85,
      metalness: 0.0,
      envMapIntensity: 0.02,
      side: THREE.DoubleSide,
    });
  }, [woodDiff, woodAo, woodArm, woodDisp, fallbackWoodTexture]);

  // 4. SPOTLIGHTS TARGETS
  const spotTargets = useMemo(() => {
    // Left Wall 3 Downlight Targets (aligned along Left Wall)
    const tL1 = new THREE.Object3D(); tL1.position.set(-ROOM_SIZE / 2 + 0.6, FLOOR_Y, -ROOM_SIZE / 2 + ROOM_SIZE * 0.25);
    const tL2 = new THREE.Object3D(); tL2.position.set(-ROOM_SIZE / 2 + 0.6, FLOOR_Y, -ROOM_SIZE / 2 + ROOM_SIZE * 0.50);
    const tL3 = new THREE.Object3D(); tL3.position.set(-ROOM_SIZE / 2 + 0.6, FLOOR_Y, -ROOM_SIZE / 2 + ROOM_SIZE * 0.75);

    // Right Wall 2 Downlight Targets (Bay 1: Shelves, Bay 2: Mural Alcove)
    const tR1 = new THREE.Object3D(); tR1.position.set(-ROOM_SIZE / 2 + ROOM_SIZE * 0.25, FLOOR_Y, -ROOM_SIZE / 2 + 0.6);
    const tR2 = new THREE.Object3D(); tR2.position.set(-ROOM_SIZE / 2 + ROOM_SIZE * 0.75, FLOOR_Y, -ROOM_SIZE / 2 + 0.6);

    return { tL1, tL2, tL3, tR1, tR2 };
  }, []);

  const shelfWidth = (ROOM_SIZE / 2) - 0.2;

  return (
    <group {...props} dispose={null}>
      {/* Centered Unified Room Structure */}
      <group position={[-ROOM_SIZE / 2, 0, -ROOM_SIZE / 2]}>
        
        {/* A. Foundation Slab (Standard crisp box directly beneath the floor) */}
        <mesh
          position={[(ROOM_SIZE - WALL_THICKNESS) / 2, -SLAB_HEIGHT / 2, (ROOM_SIZE - WALL_THICKNESS) / 2]}
          material={wallMaterial}
          receiveShadow
        >
          <boxGeometry args={[ROOM_SIZE + WALL_THICKNESS, SLAB_HEIGHT, ROOM_SIZE + WALL_THICKNESS]} />
        </mesh>

        {/* B. PBR Wood Flooring (Elevated 5mm above slab to eliminate Z-fighting) */}
        <mesh
          position={[ROOM_SIZE / 2, FLOOR_Y + 0.005, ROOM_SIZE / 2]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={floorMaterial}
          receiveShadow
        >
          <planeGeometry args={[ROOM_SIZE, ROOM_SIZE]} />
        </mesh>

        {/* C. Left Wall (Solid, Flat Architectural Wall - castShadow={false} prevents floor shadow) */}
        <mesh
          position={[-WALL_THICKNESS / 2, WALL_HEIGHT / 2, (ROOM_SIZE - WALL_THICKNESS) / 2]}
          material={wallMaterial}
          receiveShadow
        >
          <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, ROOM_SIZE + WALL_THICKNESS]} />
        </mesh>

        {/* D. Right Wall (Built-in 2-Bay Unit - castShadow={false} keeps floor evenly lit) */}
        <group position={[0, 0, 0]}>
          {/* Backboard */}
          <mesh
            position={[ROOM_SIZE / 2, WALL_HEIGHT / 2, -WALL_THICKNESS + 0.025]}
            material={wallMaterial}
            receiveShadow
          >
            <boxGeometry args={[ROOM_SIZE, WALL_HEIGHT, 0.05]} />
          </mesh>

          {/* Top Header */}
          <mesh
            position={[ROOM_SIZE / 2, WALL_HEIGHT - 0.15, -WALL_THICKNESS / 2]}
            material={wallMaterial}
            receiveShadow
          >
            <boxGeometry args={[ROOM_SIZE, 0.3, WALL_THICKNESS]} />
          </mesh>

          {/* Bottom Base */}
          <mesh
            position={[ROOM_SIZE / 2, 0.09, -WALL_THICKNESS / 2]}
            material={wallMaterial}
            receiveShadow
          >
            <boxGeometry args={[ROOM_SIZE, 0.18, WALL_THICKNESS]} />
          </mesh>

          {/* Left Vertical Divider Pillar (Side Jamb framing the Shelves) */}
          <mesh
            position={[0.1, WALL_HEIGHT / 2, -WALL_THICKNESS / 2]}
            material={wallMaterial}
            receiveShadow
          >
            <boxGeometry args={[0.2, WALL_HEIGHT, WALL_THICKNESS]} />
          </mesh>

          {/* Center Divider */}
          <mesh
            position={[ROOM_SIZE / 2, WALL_HEIGHT / 2, -WALL_THICKNESS / 2]}
            material={wallMaterial}
            receiveShadow
          >
            <boxGeometry args={[0.2, WALL_HEIGHT, WALL_THICKNESS]} />
          </mesh>

          {/* Right Outer Cap */}
          <mesh
            position={[ROOM_SIZE - 0.125, WALL_HEIGHT / 2, -WALL_THICKNESS / 2]}
            material={wallMaterial}
            receiveShadow
          >
            <boxGeometry args={[0.25, WALL_HEIGHT, WALL_THICKNESS]} />
          </mesh>

          {/* Bay 1: Left Bay Shelves (Framed neatly between Left Pillar and Center Divider) */}
          <mesh
            position={[((ROOM_SIZE / 2 - 0.1) + 0.2) / 2, 0.86, -WALL_THICKNESS / 2]}
            material={wallMaterial}
            receiveShadow
          >
            <boxGeometry args={[(ROOM_SIZE / 2 - 0.1) - 0.2, 0.06, WALL_THICKNESS - 0.06]} />
          </mesh>
          <mesh
            position={[((ROOM_SIZE / 2 - 0.1) + 0.2) / 2, 1.54, -WALL_THICKNESS / 2]}
            material={wallMaterial}
            receiveShadow
          >
            <boxGeometry args={[(ROOM_SIZE / 2 - 0.1) - 0.2, 0.06, WALL_THICKNESS - 0.06]} />
          </mesh>
          <mesh
            position={[((ROOM_SIZE / 2 - 0.1) + 0.2) / 2, 2.22, -WALL_THICKNESS / 2]}
            material={wallMaterial}
            receiveShadow
          >
            <boxGeometry args={[(ROOM_SIZE / 2 - 0.1) - 0.2, 0.06, WALL_THICKNESS - 0.06]} />
          </mesh>

          {/* Bay 2: Right Bay (Completely Open Vertical Recessed Mural Block) */}
        </group>
      </group>

      {/* 4. ARCHITECTURAL LIGHTING & SPOTLIGHTS (Smooth Soft Falloff penumbra=0.8) */}
      {/* Left Wall Downlights (3 Evenly Spaced Soft Washes) */}
      <primitive object={spotTargets.tL1} />
      <spotLight
        position={[-ROOM_SIZE / 2 + 0.25, WALL_HEIGHT + 0.35, -ROOM_SIZE / 2 + ROOM_SIZE * 0.25]}
        target={spotTargets.tL1}
        angle={Math.PI / 5}
        penumbra={0.8}
        intensity={3.2}
        distance={8.0}
        decay={2}
        color="#FFE4CC"
      />

      <primitive object={spotTargets.tL2} />
      <spotLight
        position={[-ROOM_SIZE / 2 + 0.25, WALL_HEIGHT + 0.35, -ROOM_SIZE / 2 + ROOM_SIZE * 0.50]}
        target={spotTargets.tL2}
        angle={Math.PI / 5}
        penumbra={0.8}
        intensity={3.2}
        distance={8.0}
        decay={2}
        color="#FFE4CC"
      />

      <primitive object={spotTargets.tL3} />
      <spotLight
        position={[-ROOM_SIZE / 2 + 0.25, WALL_HEIGHT + 0.35, -ROOM_SIZE / 2 + ROOM_SIZE * 0.75]}
        target={spotTargets.tL3}
        angle={Math.PI / 5}
        penumbra={0.8}
        intensity={3.2}
        distance={8.0}
        decay={2}
        color="#FFE4CC"
      />

      {/* Right Wall Downlights */}
      {/* Spotlight 1: Bay 1 (Left Shelving Bay) */}
      <primitive object={spotTargets.tR1} />
      <spotLight
        position={[-ROOM_SIZE / 2 + ROOM_SIZE * 0.25, WALL_HEIGHT + 0.35, -ROOM_SIZE / 2 + 0.25]}
        target={spotTargets.tR1}
        angle={Math.PI / 5}
        penumbra={0.8}
        intensity={3.4}
        distance={8.0}
        decay={2}
        color="#FFE4CC"
      />

      {/* Spotlight 2: Bay 2 (Right Mural / Art Alcove) */}
      <primitive object={spotTargets.tR2} />
      <spotLight
        position={[-ROOM_SIZE / 2 + ROOM_SIZE * 0.75, WALL_HEIGHT + 0.35, -ROOM_SIZE / 2 + 0.25]}
        target={spotTargets.tR2}
        angle={Math.PI / 5}
        penumbra={0.8}
        intensity={3.4}
        distance={8.0}
        decay={2}
        color="#FFE4CC"
      />

      {/* Warm Ambient Accent Glows inside Shelves & Mural Bay */}
      <pointLight
        position={[-ROOM_SIZE / 2 + ROOM_SIZE * 0.25, 1.5, -ROOM_SIZE / 2 + 0.1]}
        color="#FFB370"
        intensity={0.55}
        distance={3.0}
        decay={2}
      />
      <pointLight
        position={[-ROOM_SIZE / 2 + ROOM_SIZE * 0.75, 1.5, -ROOM_SIZE / 2 + 0.1]}
        color="#FFB370"
        intensity={0.55}
        distance={3.0}
        decay={2}
      />
    </group>
  );
}

useTexture.preload('/textures/floor/wood_diff_2k.jpg');
useTexture.preload('/textures/floor/wood_ao_2k.jpg');
useTexture.preload('/textures/floor/wood_arm_2k.jpg');
useTexture.preload('/textures/floor/wood_disp_2k.png');



