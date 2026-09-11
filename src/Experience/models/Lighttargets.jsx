import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useNavigate } from "react-router";

// import { useUiStore } from "../../stores/uiStore";

export default function Model(props) {
  let navigate = useNavigate();
  // const { openPanel } = useUiStore();
  const { nodes } = useGLTF("/models/lighttargets.glb");

  // --- Camera trigger ---
  const targetPosition = new THREE.Vector3(42.9, 36.4, 13.5);
  const [showPulses, setShowPulses] = useState(false);
  const wasNear = useRef(false);

  // Refs for pulse groups
  const aboutPulseRef = useRef();
  const skillsPulseRef = useRef();
  const projectsPulseRef = useRef();
  const contactsPulseRef = useRef();

  // Base materials
  const blackMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: false,
    opacity: 1,
  });

  // Pulse ring material
  const createPulseMaterial = () =>
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: true,
    });

  // Animation refs
  const aboutAnimRef = useRef();
  const skillsAnimRef = useRef();
  const projectsAnimRef = useRef();
  const contactsAnimRef = useRef();

  // Hover tracking
  const hoverState = useRef({
    about: false,
    skills: false,
    projects: false,
    contacts: false,
  });

  // --- CAMERA TRIGGER + REPEATABLE FADE-IN ---
  useFrame(({ camera }) => {
    const distance = camera.position.distanceTo(targetPosition);
    const isNear = distance < 1.5; // detection radius

    const pulseGroups = [
      aboutPulseRef,
      projectsPulseRef,
      skillsPulseRef,
      contactsPulseRef,
    ];

    // --- When camera ENTERS the trigger area ---
    if (!wasNear.current && isNear) {
      wasNear.current = true;

      // Hide all pulses immediately
      pulseGroups.forEach((ref) => {
        if (ref.current) {
          ref.current.visible = false;
          ref.current.children.forEach((ring) => (ring.material.opacity = 0));
        }
      });

      // Wait 12 seconds, then fade-in one by one
      setTimeout(() => {
        setShowPulses(true);

        pulseGroups.forEach((ref, i) => {
          if (!ref.current) return;

          // keep it hidden first
          ref.current.visible = false;
          ref.current.scale.set(0.5, 0.5, 0.5);
          ref.current.children.forEach((ring) => {
            ring.material.opacity = 0;
          });

          setTimeout(() => {
            if (!ref.current) return;
            ref.current.visible = true;

            // start tiny and invisible
            ref.current.scale.set(0.5, 0.5, 0.5);
            ref.current.children.forEach((r) => {
              r.material.opacity = 0;
            });

            // fade + scale in smoothly
            gsap.to(ref.current.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 1.5,
              ease: "power3.out",
            });

            gsap.to(ref.current.children.map((r) => r.material), {
              opacity: 0.15,
              duration: 1.8,
              ease: "power3.out",
            });
          }, i * 1000);
        });
      }, 12500);
    }

    // --- When camera LEAVES the trigger area ---
    if (wasNear.current && !isNear) {
      wasNear.current = false;
      setShowPulses(false);

      pulseGroups.forEach((ref) => {
        if (ref.current) {
          gsap.to(ref.current.children.map((r) => r.material), {
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
              if (ref.current) ref.current.visible = false;
            },
          });
        }
      });
    }
  });

  // --- Pulse animation loop (alternating inner/outer) ---
  useFrame(({ clock }) => {
    if (!showPulses) return;

    const t = clock.elapsedTime * 2;
    const pulseRefs = [
      { ref: aboutPulseRef, key: "about" },
      { ref: skillsPulseRef, key: "skills" },
      { ref: projectsPulseRef, key: "projects" },
      { ref: contactsPulseRef, key: "contacts" },
    ];

    pulseRefs.forEach(({ ref, key }) => {
      if (!ref.current) return;
      if (!hoverState.current[key]) {
        const [inner, outer] = ref.current.children;

        if (outer) {
          const outerWave = (Math.sin(t) + 1) / 2;
          const outerScale = 1 + outerWave * 0.2;
          outer.scale.set(outerScale, outerScale, outerScale);
          outer.material.opacity = 0.3 + (1 - outerWave) * 0.2;
        }

        if (inner) {
          const innerWave = (Math.sin(t - Math.PI / 1.5) + 1) / 2;
          const innerScale = 1 + innerWave * 0.2;
          inner.scale.set(innerScale, innerScale, innerScale);
          inner.material.opacity = 0.3 + (1 - innerWave) * 0.2;
        }
      }
    });
  });

  // Animation group mapping
  const animationPairs = {
    About_Hitbox: { ref: aboutAnimRef, pulse: aboutPulseRef, key: "about" },
    Skills_Hitbox: { ref: skillsAnimRef, pulse: skillsPulseRef, key: "skills" },
    Projects_Hitbox: {
      ref: projectsAnimRef,
      pulse: projectsPulseRef,
      key: "projects",
    },
    Contacts_Hitbox: {
      ref: contactsAnimRef,
      pulse: contactsPulseRef,
      key: "contacts",
    },
  };

  // Hover scaling — fades out pulse and reappears when unhovered
  const onHover = (key, isHovering) => {
    const animObject = animationPairs[key];
    if (!animObject?.ref.current) return;
    const pulseGroup = animObject.pulse.current;

    gsap.to(animObject.ref.current.scale, {
      x: isHovering ? 1 : 0,
      y: isHovering ? 1 : 0,
      z: isHovering ? 1 : 0,
      duration: 0.5,
      ease: "power2.out",
    });

    if (pulseGroup) {
      if (isHovering) {
        gsap.to(pulseGroup.children.map((r) => r.material), {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        });
        gsap.to(pulseGroup.scale, {
          x: 0.8,
          y: 0.8,
          z: 0.8,
          duration: 0.6,
          ease: "power2.out",
        });
      } else {
        // When hover ends → smoothly fade back in and expand slightly
        pulseGroup.visible = true;

        pulseGroup.children.forEach((r) => {
          r.material.opacity = 0; // start fully transparent
        });

        // Optional: gentle pop effect
        gsap.fromTo(
          pulseGroup.scale,
          { x: 0.8, y: 0.8, z: 0.8 },
          { x: 1, y: 1, z: 1, duration: 1.2, ease: "power3.out" }
        );

        // fade-in the pulse rings with staggered timing
        gsap.to(pulseGroup.children.map((r) => r.material), {
          opacity: 0.25,
          duration: 1.5,
          ease: "power3.out",
          stagger: 0.1,
        });
      }

    }
  };

  return (
    <group {...props} dispose={null}>
      {/* --- About --- */}
      <mesh
        geometry={nodes.About_Hitbox.geometry}
        material={nodes.About_Hitbox.material}
        visible={false}
        position={[1.674, 0.584, -28.723]}
        onPointerOver={() => {
          onHover("About_Hitbox", true);
          hoverState.current.about = true;
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover("About_Hitbox", false);
          hoverState.current.about = false;
          document.body.style.cursor = "auto";
        }}
        onClick={() => {
          navigate("/about");
        }}
      />
      <mesh
        ref={aboutAnimRef}
        geometry={nodes.About_Hitbox_Anim.geometry}
        material={blackMaterial}
        scale={[0, 0, 0]}
        position={[1.674, 0.584, -28.723]}
      />
      <group
        ref={aboutPulseRef}
        visible={false}
        position={[2.4, 1.2, -27.999]}
        rotation={[0, Math.PI / 4, 0]}
      >
        {[0, 1].map((i) => (
          <mesh key={i} material={createPulseMaterial()}>
            <ringGeometry args={[0.12 + i * 0.03, 0.14 + i * 0.03, 64]} />
          </mesh>
        ))}
      </group>

      {/* --- Projects --- */}
      <mesh
        geometry={nodes.Projects_Hitbox.geometry}
        material={nodes.Projects_Hitbox.material}
        visible={false}
        position={[-2.289, 1.632, -29.336]}
        onPointerOver={() => {
          onHover("Projects_Hitbox", true);
          hoverState.current.projects = true;
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover("Projects_Hitbox", false);
          hoverState.current.projects = false;
          document.body.style.cursor = "auto";
        }}
        onClick={() => {
          navigate("/project-experience");
        }}
      />
      <mesh
        ref={projectsAnimRef}
        geometry={nodes.Projects_Hitbox_Anim.geometry}
        material={blackMaterial}
        scale={[0, 0, 0]}
        position={[-2.289, 1.632, -29.336]}
      />
      <group
        ref={projectsPulseRef}
        visible={false}
        position={[-2.189, 1.632, -29.136]}
        rotation={[0, Math.PI / 4, 0]}
      >
        {[0, 1].map((i) => (
          <mesh key={i} material={createPulseMaterial()}>
            <ringGeometry args={[0.12 + i * 0.03, 0.14 + i * 0.03, 64]} />
          </mesh>
        ))}
      </group>

      {/* --- Skills --- */}
      <mesh
        geometry={nodes.Skills_Hitbox.geometry}
        material={nodes.Skills_Hitbox.material}
        visible={false}
        position={[-2.134, 0.494, -31.226]}
        onPointerOver={() => {
          onHover("Skills_Hitbox", true);
          hoverState.current.skills = true;
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover("Skills_Hitbox", false);
          hoverState.current.skills = false;
          document.body.style.cursor = "auto";
        }}
        onClick={() => {
          navigate("/skills");
        }}
      />
      <mesh
        ref={skillsAnimRef}
        geometry={nodes.Skills_Hitbox_Anim.geometry}
        material={blackMaterial}
        scale={[0, 0, 0]}
        position={[-2.134, 0.494, -31.226]}
      />
      <group
        ref={skillsPulseRef}
        visible={false}
        position={[-1.78, 0.694, -31.026]}
        rotation={[0, Math.PI / 4, 0]}
      >
        {[0, 1].map((i) => (
          <mesh key={i} material={createPulseMaterial()}>
            <ringGeometry args={[0.12 + i * 0.03, 0.14 + i * 0.03, 64]} />
          </mesh>
        ))}
      </group>

      {/* --- Contacts --- */}
      <mesh
        geometry={nodes.Contacts_Hitbox.geometry}
        material={nodes.Contacts_Hitbox.material}
        visible={false}
        position={[1.396, 0.691, -31.847]}
        onPointerOver={() => {
          onHover("Contacts_Hitbox", true);
          hoverState.current.contacts = true;
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover("Contacts_Hitbox", false);
          hoverState.current.contacts = false;
          document.body.style.cursor = "auto";
        }}
        onClick={() => {
          navigate("/contacts");
        }}
      />
      <mesh
        ref={contactsAnimRef}
        geometry={nodes.Contacts_Hitbox_Anim.geometry}
        material={blackMaterial}
        scale={[0, 0, 0]}
        position={[1.396, 0.691, -31.847]}
      />
      <group
        ref={contactsPulseRef}
        visible={false}
        position={[1.396, 0.781, -31.847]}
        rotation={[0, Math.PI / 4, 0]}
      >
        {[0, 1].map((i) => (
          <mesh key={i} material={createPulseMaterial()}>
            <ringGeometry args={[0.12 + i * 0.03, 0.14 + i * 0.03, 64]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

useGLTF.preload("/lighttargets.glb");
