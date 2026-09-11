import React, { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import Dark1stOffice from "./models/DarkOffice1st";
import Dark2ndOffice from "./models/DarkOffice2nd";
import Dark3rdOffice from "./models/DarkOffice3rd";
import Dark4thOffice from "./models/DarkOffice4th";
import Dark5thOffice from "./models/DarkOffice5th";
import Dark6thOffice from "./models/DarkOffice6th";
import Light1stHomeOffice from "./models/LightOffice1st";
import Light2ndHomeOffice from "./models/LightOffice2nd";
import Light3rdHomeOffice from "./models/LightOffice3rd";
import Light4thHomeOffice from "./models/LightOffice4th";
import Light5thHomeOffice from "./models/LightOffice5th";
import Light6thHomeOffice from "./models/LightOffice6th";
import Light7thHomeOffice from "./models/LightOffice7th.jsx";
import DarkTargets from "./models/Darktargets";
import LightTargets from "./models/Lighttargets";
import Gridplanes from "./components/GridPlanes";
import { useFrame } from "@react-three/fiber";
import { useToggleRoomStore } from "../stores/toggleRoomStore.js";
import gsap from "gsap";

const Scene = ({ pointerRef}) => {
  const darkgroupRef = useRef();
  const lightgroupRef = useRef();
  const gridPlanesRef = useRef();
  const darkRoomGroupPosition = new THREE.Vector3(0, 0, 0);
  const lightRoomGroupPosition = new THREE.Vector3(1.24, 0, -32.431);

  const groupRotationRef = useRef(0);
  const { isDarkRoom } = useToggleRoomStore();
  const [sceneReady, setSceneReady] = useState(false);

  // Toggle visibility instead of disposing
  useEffect(() => {
    if (!darkgroupRef.current || !lightgroupRef.current) return;

    // Wait a bit before toggling visibility 
    const delay = 3000; // 1 second (adjust to match your overlay duration)
    const timeout = setTimeout(() => {
      darkgroupRef.current.visible = isDarkRoom;
      lightgroupRef.current.visible = !isDarkRoom;
    }, delay);

    return () => clearTimeout(timeout);
  }, [isDarkRoom]);

  // Slightly delay grid move for smoother transition
    if (gridPlanesRef.current) {
      const targetPosition = isDarkRoom
        ? darkRoomGroupPosition
        : lightRoomGroupPosition;

      gsap.to(gridPlanesRef.current.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 1,
        delay: 0.5,
        ease: "power2.inOut",
      });
    }

  // Smooth pointer-based rotation
  useFrame(() => {
    if (!darkgroupRef.current || !lightgroupRef.current || !gridPlanesRef.current) return;

    const targetRotation = pointerRef.current.x * Math.PI * 0.02;

    groupRotationRef.current = THREE.MathUtils.lerp(
      groupRotationRef.current,
      targetRotation,
      0.1
    );

    darkgroupRef.current.rotation.y = groupRotationRef.current;
    lightgroupRef.current.rotation.y = groupRotationRef.current;
    gridPlanesRef.current.rotation.y = groupRotationRef.current;

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
      {/* Dark Room */}
      <group ref={darkgroupRef}>
        <Dark1stOffice />
        <Dark2ndOffice />
        <Dark3rdOffice />
        <Dark4thOffice />
        <Dark5thOffice />
        <Dark6thOffice />
        <DarkTargets/>
      </group>

      {/* Light Room */}
      <group ref={lightgroupRef} position={lightRoomGroupPosition}>
        <Light1stHomeOffice
          position={[
            -lightRoomGroupPosition.x,
            -lightRoomGroupPosition.y,
            -lightRoomGroupPosition.z,
          ]}
        />
        <Light2ndHomeOffice
          position={[
            -lightRoomGroupPosition.x,
            -lightRoomGroupPosition.y,
            -lightRoomGroupPosition.z,
          ]}
        />
        <Light3rdHomeOffice
          position={[
            -lightRoomGroupPosition.x,
            -lightRoomGroupPosition.y,
            -lightRoomGroupPosition.z,
          ]}
        />
        <Light4thHomeOffice
          position={[
            -lightRoomGroupPosition.x,
            -lightRoomGroupPosition.y,
            -lightRoomGroupPosition.z,
          ]}
        />
        <Light5thHomeOffice
          position={[
            -lightRoomGroupPosition.x,
            -lightRoomGroupPosition.y,
            -lightRoomGroupPosition.z,
          ]}
        />
        <Light6thHomeOffice
          position={[
            -lightRoomGroupPosition.x,
            -lightRoomGroupPosition.y,
            -lightRoomGroupPosition.z,
          ]}
        />
        <Light7thHomeOffice
          position={[
            -lightRoomGroupPosition.x,
            -lightRoomGroupPosition.y,
            -lightRoomGroupPosition.z,
          ]}
        />
        <LightTargets
          position={[
            -lightRoomGroupPosition.x,
            -lightRoomGroupPosition.y,
            -lightRoomGroupPosition.z,
          ]}
        />  
      </group>

      {/* Grid */}
      <Gridplanes
        ref={gridPlanesRef}
        rows={8}no
        columns={8}
        planeWidth={3}
        planeDepth={3}
        spacing={0}
      />
    </Suspense>
  );
};

export default Scene;
