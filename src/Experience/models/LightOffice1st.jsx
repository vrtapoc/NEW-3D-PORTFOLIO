import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { createLightOakTexture } from '../utils/convertToBasic';

export default function Model(props) {
  const { nodes } = useGLTF('/models/LightOffice1st.glb');

  // Clean materials without baked clutter shadows
  const { floorMaterial, wallsMaterial, backdropMaterial } = useMemo(() => {
    const woodTexture = createLightOakTexture();

    const floor = new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.55,
      metalness: 0.0,
    });

    const walls = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FAF7F2'), // warm clean white/cream
      roughness: 0.85,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });

    const backdrop = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#DFDFDF'),
      transparent: true,
      opacity: 0.7,
    });

    return { floorMaterial: floor, wallsMaterial: walls, backdropMaterial: backdrop };
  }, []);

  return (
    <group {...props} dispose={null}>
      {/* Scaled room geometry: 1.5x width, 1.2x wall height, 1.5x depth */}
      <group scale={[1.5, 1.2, 1.5]}>
        <group position={[2.122, 0.068, -28.172]}>
          <mesh geometry={nodes.Cube028.geometry} material={floorMaterial} />
          <mesh geometry={nodes.Cube028_1.geometry} material={wallsMaterial} />
        </group>
      </group>
      <mesh
        geometry={nodes.BackdropLight_Baked.geometry}
        material={backdropMaterial}
        position={[0, -0.01, -29.998]}
        scale={[1.5, 1.5, 1.5]}
      />
    </group>
  );
}

useGLTF.preload('/models/LightOffice1st.glb');


