import React, { useMemo } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
export default function Model(props) {
  const { nodes } = useGLTF('/models/DarkOffice1st.glb');
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

        // Plank bevel seam
        ctx.strokeStyle = '#180E09';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();

        // Wood grain
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

  // STEP 1: POLY HAVEN "WOOD CABINET WORN LONG" 2K PBR MAPS (16x Anisotropy for Razor-Sharp Detail)
  const [woodDiff, woodAo, woodArm, woodDisp] = useTexture([
    '/textures/floor/wood_diff_2k.jpg',
    '/textures/floor/wood_ao_2k.jpg',
    '/textures/floor/wood_arm_2k.jpg',
    '/textures/floor/wood_disp_2k.png',
  ], (textures) => {
    // Loaded callback
  }, (err) => {
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

  // WALL & SHELVING MATERIAL (Ultra-Matte Deep Charcoal/Black #141211)
  const darkWallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#141211"),
      roughness: 0.94,
      metalness: 0.0,
      clearcoat: 0.0,
      envMapIntensity: 0.05,
      side: THREE.DoubleSide,
    });
  }, []);

  // EXTERIOR GROUND / BACKDROP MATERIAL (Deep studio dark #080708)
  const exteriorGroundMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#080708'),
      roughness: 1.0,
      metalness: 0.0,
    });
  }, []);

  // ARCHITECTURAL LIGHTING TARGETS (scaled for 1.25x room and 2-section built-in unit)
  const spotTargets = useMemo(() => {
    const t1 = new THREE.Object3D(); t1.position.set(-2.03, 0.20, 1.16);
    const t2 = new THREE.Object3D(); t2.position.set(-2.03, 0.20, -0.25);
    const t3 = new THREE.Object3D(); t3.position.set(-2.03, 0.20, -1.58);
    // 2-Section Back Wall Unit: t4 (Shelving Bay), t5 (Mural Niche)
    const t4 = new THREE.Object3D(); t4.position.set(-0.94, 0.20, -2.16);
    const t5 = new THREE.Object3D(); t5.position.set(0.94, 0.20, -2.16);
    return { t1, t2, t3, t4, t5 };
  }, []);

  // Isolate Floor Mesh from Walls/Shelving Geometry
  const { floorGeometry, wallGeometry } = useMemo(() => {
    if (!nodes?.Wall1k_Baked?.geometry) return {};
    const orig = nodes.Wall1k_Baked.geometry.toNonIndexed();
    const pos = orig.attributes.position;
    const norm = orig.attributes.normal;
    const uv = orig.attributes.uv;

    const floorPositions = [];
    const floorNormals = [];
    const floorUvs = [];

    const wallPositions = [];
    const wallNormals = [];
    const wallUvs = [];

    for (let i = 0; i < pos.count; i += 3) {
      // Average normal and position of triangle
      const ny = (norm.getY(i) + norm.getY(i + 1) + norm.getY(i + 2)) / 3;
      const py = (pos.getY(i) + pos.getY(i + 1) + pos.getY(i + 2)) / 3;
      const px = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3;
      const pz = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3;

      // Floor triangles are facing upward (ny > 0.8) and at floor level (py < 0.25)
      if (ny > 0.8 && py < 0.25) {
        for (let j = 0; j < 3; j++) {
          floorPositions.push(pos.getX(i + j), pos.getY(i + j), pos.getZ(i + j));
          floorNormals.push(norm.getX(i + j), norm.getY(i + j), norm.getZ(i + j));
          floorUvs.push(uv ? uv.getX(i + j) : 0, uv ? uv.getY(i + j) : 0);
        }
      } else {
        // Discard old back wall & baked 3-column shelving triangles (pz < -1.45 && px > -1.55)
        const isOldBackShelves = pz < -1.45 && px > -1.55;
        if (!isOldBackShelves) {
          for (let j = 0; j < 3; j++) {
            wallPositions.push(pos.getX(i + j), pos.getY(i + j), pos.getZ(i + j));
            wallNormals.push(norm.getX(i + j), norm.getY(i + j), norm.getZ(i + j));
            wallUvs.push(uv ? uv.getX(i + j) : 0, uv ? uv.getY(i + j) : 0);
          }
        }
      }
    }

    const fGeom = new THREE.BufferGeometry();
    fGeom.setAttribute('position', new THREE.Float32BufferAttribute(floorPositions, 3));
    fGeom.setAttribute('normal', new THREE.Float32BufferAttribute(floorNormals, 3));
    fGeom.setAttribute('uv', new THREE.Float32BufferAttribute(floorUvs, 2));
    fGeom.setAttribute('uv2', new THREE.Float32BufferAttribute(floorUvs, 2));

    const wGeom = new THREE.BufferGeometry();
    wGeom.setAttribute('position', new THREE.Float32BufferAttribute(wallPositions, 3));
    wGeom.setAttribute('normal', new THREE.Float32BufferAttribute(wallNormals, 3));
    wGeom.setAttribute('uv', new THREE.Float32BufferAttribute(wallUvs, 2));

    return { floorGeometry: fGeom, wallGeometry: wGeom };
  }, [nodes]);

  return (
    <group {...props} dispose={null}>
      {/* Scaled Room Shell & Floor: 1.25x width, 1.1x height, 1.25x depth */}
      <group scale={[1.25, 1.1, 1.25]}>
        {/* 1. Perimeter Walls (Isolated) */}
        {wallGeometry && (
          <mesh
            geometry={wallGeometry}
            material={darkWallMaterial}
            position={[0.001, 0.008, 0]}
          />
        )}

        {/* 2. Isolated Floor Mesh with Natural Matte Hardwood PBR Material */}
        {floorGeometry && (
          <mesh
            geometry={floorGeometry}
            position={[0.001, 0.008, 0]}
            receiveShadow
          >
            <meshStandardMaterial
              map={woodDiff || fallbackWoodTexture}
              aoMap={woodAo}
              aoMapIntensity={1.0}
              roughnessMap={woodArm}
              bumpMap={woodDisp}
              bumpScale={0.015}
              color="#FFFFFF"
              roughness={0.85}
              metalness={0.0}
              envMapIntensity={0.02}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* 3. Reconfigured 2-Bay Built-In Wall Unit */}
        <group position={[0, 0, 0]}>
          {/* Outer Perimeter Frame & Central Dividing Pillar */}
          {/* Top Header Beam */}
          <mesh position={[0, 2.30, -1.95]} material={darkWallMaterial} castShadow receiveShadow>
            <boxGeometry args={[3.10, 0.08, 0.35]} />
          </mesh>
          {/* Left Frame Column */}
          <mesh position={[-1.50, 1.25, -1.95]} material={darkWallMaterial} castShadow receiveShadow>
            <boxGeometry args={[0.10, 2.10, 0.35]} />
          </mesh>
          {/* Right Frame Column */}
          <mesh position={[1.50, 1.25, -1.95]} material={darkWallMaterial} castShadow receiveShadow>
            <boxGeometry args={[0.10, 2.10, 0.35]} />
          </mesh>
          {/* Center Dividing Pillar (Separates Section A & Section B) */}
          <mesh position={[0.0, 1.25, -1.95]} material={darkWallMaterial} castShadow receiveShadow>
            <boxGeometry args={[0.10, 2.10, 0.35]} />
          </mesh>
          {/* Bottom Counter / Base Plinth */}
          <mesh position={[0, 0.24, -1.95]} material={darkWallMaterial} castShadow receiveShadow>
            <boxGeometry args={[3.10, 0.08, 0.35]} />
          </mesh>
          {/* Recessed Alcove Backing Panel */}
          <mesh position={[0, 1.27, -2.12]} material={darkWallMaterial} receiveShadow>
            <boxGeometry args={[3.10, 2.10, 0.02]} />
          </mesh>

          {/* Section A (Left Bay): 3-Tier Horizontal Shelving for Future Objects */}
          <mesh position={[-0.75, 0.75, -1.95]} material={darkWallMaterial} castShadow receiveShadow>
            <boxGeometry args={[1.40, 0.04, 0.32]} />
          </mesh>
          <mesh position={[-0.75, 1.25, -1.95]} material={darkWallMaterial} castShadow receiveShadow>
            <boxGeometry args={[1.40, 0.04, 0.32]} />
          </mesh>
          <mesh position={[-0.75, 1.75, -1.95]} material={darkWallMaterial} castShadow receiveShadow>
            <boxGeometry args={[1.40, 0.04, 0.32]} />
          </mesh>

          {/* Section B (Right Bay): Large, Clean Open Whole-Block Niche for Future Mural/Painting */}
          {/* Left completely open and recessed without intermediate planks */}
        </group>
      </group>

      {/* Exterior Ground Plane */}
      {nodes?.Floor2k_Baked?.geometry && (
        <mesh
          geometry={nodes.Floor2k_Baked.geometry}
          material={exteriorGroundMaterial}
          position={[0, -0.01, 0]}
        />
      )}

      {/* 4. Architectural Grazing Spotlights with Soft Falloff (penumbra=0.85, #FFE4CC) */}
      {/* Left Wall Downlights (3 soft washes) */}
      <primitive object={spotTargets.t1} />
      <spotLight
        position={[-1.78, 2.65, 1.16]}
        target={spotTargets.t1}
        angle={Math.PI / 6}
        penumbra={0.85}
        intensity={2.8}
        distance={7.0}
        decay={2}
        color="#FFE4CC"
      />

      <primitive object={spotTargets.t2} />
      <spotLight
        position={[-1.78, 2.65, -0.25]}
        target={spotTargets.t2}
        angle={Math.PI / 6}
        penumbra={0.85}
        intensity={2.8}
        distance={7.0}
        decay={2}
        color="#FFE4CC"
      />

      <primitive object={spotTargets.t3} />
      <spotLight
        position={[-1.78, 2.65, -1.58]}
        target={spotTargets.t3}
        angle={Math.PI / 6}
        penumbra={0.85}
        intensity={2.8}
        distance={7.0}
        decay={2}
        color="#FFE4CC"
      />

      {/* Back Wall 2-Bay Downlights: Aligned to Section A & Section B */}
      {/* Section A (Shelving Bay) Downlight */}
      <primitive object={spotTargets.t4} />
      <spotLight
        position={[-0.94, 2.65, -1.78]}
        target={spotTargets.t4}
        angle={Math.PI / 6}
        penumbra={0.85}
        intensity={3.0}
        distance={7.0}
        decay={2}
        color="#FFE4CC"
      />

      {/* Section B (Mural / Art Niche) Downlight */}
      <primitive object={spotTargets.t5} />
      <spotLight
        position={[0.94, 2.65, -1.78]}
        target={spotTargets.t5}
        angle={Math.PI / 6}
        penumbra={0.85}
        intensity={3.0}
        distance={7.0}
        decay={2}
        color="#FFE4CC"
      />

      {/* Shelving & Niche Accent Glow */}
      <pointLight position={[-0.94, 1.5, -2.1]} color="#FFB370" intensity={0.55} distance={2.5} decay={2} />
      <pointLight position={[0.94, 1.6, -2.1]} color="#FFB370" intensity={0.55} distance={2.5} decay={2} />
    </group>
  );
}

useGLTF.preload('/models/DarkOffice1st.glb');
useTexture.preload('/textures/floor/wood_diff_2k.jpg');
useTexture.preload('/textures/floor/wood_ao_2k.jpg');
useTexture.preload('/textures/floor/wood_arm_2k.jpg');
useTexture.preload('/textures/floor/wood_disp_2k.png');



