import React, { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import Dark1stOffice from "./models/DarkOffice1st";
import Light1stHomeOffice from "./models/LightOffice1st";
import { useFrame } from "@react-three/fiber";
import { useToggleRoomStore } from "../stores/toggleRoomStore.js";
import { EffectComposer, Bloom, N8AO } from "@react-three/postprocessing";
import { Environment } from "@react-three/drei";

const Scene = ({ pointerRef }) => {
  const darkgroupRef = useRef();
  const lightgroupRef = useRef();
  const lightRoomGroupPosition = new THREE.Vector3(1.24, 0, -32.431);

  const groupRotationRef = useRef(0);
  const { isDarkRoom } = useToggleRoomStore();
  const [sceneReady, setSceneReady] = useState(false);

  // Toggle visibility smoothly matching transition overlay
  useEffect(() => {
    if (!darkgroupRef.current || !lightgroupRef.current) return;

    const delay = 3000;
    const timeout = setTimeout(() => {
      darkgroupRef.current.visible = isDarkRoom;
      lightgroupRef.current.visible = !isDarkRoom;
    }, delay);

    return () => clearTimeout(timeout);
  }, [isDarkRoom]);

  // Smooth pointer-based rotation
  useFrame(() => {
    if (!darkgroupRef.current || !lightgroupRef.current) return;

    const targetRotation = pointerRef?.current?.x ? pointerRef.current.x * Math.PI * 0.02 : 0;

    groupRotationRef.current = THREE.MathUtils.lerp(
      groupRotationRef.current,
      targetRotation,
      0.1
    );

    darkgroupRef.current.rotation.y = groupRotationRef.current;
    lightgroupRef.current.rotation.y = groupRotationRef.current;

    // Trigger "scene-ready" once for fade-in sync
    if (!sceneReady) {
      setSceneReady(true);
      setTimeout(() => {
        window.dispatchEvent(new Event("scene-ready"));
      }, 500);
    }
  });

  return (
    <Suspense fallback={null}>
      <color attach="background" args={[isDarkRoom ? "#0B0A0D" : "#EBEBEB"]} />

      {/* 1. ENVIRONMENT REFLECTION FOR DARK OFFICE */}
      {isDarkRoom && <Environment preset="city" environmentIntensity={0.25} />}

      {/* Dark Room — Architecture Focus: Walls, Built-in Shelves & PBR Wood Flooring */}
      <group ref={darkgroupRef} visible={isDarkRoom}>
        {/* Soft Dark Slate/Indigo Ambient Fill (adds readable depth to shadows) */}
        <ambientLight color="#2A2B36" intensity={0.35} />
        <directionalLight position={[12, 22, 14]} intensity={0.20} color="#3A3028" />

        {/* Signature Atmospheric Background Studio Void Glow */}
        <pointLight position={[-7.0, 2.5, 2.0]} color="#523B68" intensity={1.4} distance={14} decay={2} />
        <pointLight position={[6.5, 1.5, 5.5]} color="#4A3422" intensity={0.9} distance={12} decay={2} />
        <pointLight position={[0, 1.5, -5.0]} color="#2A1E38" intensity={1.2} distance={12} decay={2} />

        {/* Clean Base Room Shell */}
        <Dark1stOffice />
      </group>

      {/* Light Room */}
      <group ref={lightgroupRef} position={lightRoomGroupPosition} visible={!isDarkRoom}>
        {/* Natural, clean daylight studio lighting for Light Room */}
        <ambientLight intensity={1.4} color="#FFF9F2" />
        <directionalLight position={[15, 22, 12]} intensity={1.8} color="#FFFFFF" />
        <directionalLight position={[-12, 14, -10]} intensity={0.6} color="#DCE6F2" />
        <pointLight
          position={[
            -lightRoomGroupPosition.x + 2,
            -lightRoomGroupPosition.y + 4.0,
            -lightRoomGroupPosition.z - 28,
          ]}
          intensity={1.0}
          color="#FFF4E0"
          distance={14}
          decay={2}
        />

        <Light1stHomeOffice
          position={[
            -lightRoomGroupPosition.x,
            -lightRoomGroupPosition.y,
            -lightRoomGroupPosition.z,
          ]}
        />
      </group>

      {/* Cinematic Post-Processing: Subtle Bloom + Ambient Occlusion */}
      {isDarkRoom && (
        <EffectComposer disableNormalPass multisampling={4}>
          <N8AO intensity={1.2} distanceFalloff={0.4} aoRadius={0.6} />
          <Bloom
            intensity={0.35}
            luminanceThreshold={0.82}
            luminanceSmoothing={0.3}
            mipmapBlur
            radius={0.4}
          />
        </EffectComposer>
      )}
    </Suspense>
  );
};

export default Scene;
