import React, { useRef, useEffect, useState, useCallback } from "react";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";
import "./LoadingPage.scss";

const friendlyMessages = {
  "/models/darkhomeoffice.glb": "Almost there...",
  "/models/darktargets.glb": "Opening curtains...",
  "/models/Light1stoffice.glb": "Preparing workstation setup...",
};

const defaultMessages = [
  "Fixing the vinyl recorder...",
  "Arranging picture frames...",
  "Polishing the floor...",
  "Setting up the lights...",
  "Dusting the bookshelf...",
  "Straightening the chairs...",
  "Organizing the desk...",
  "Opening the curtains...",
  "Adjusting the window blinds...",
  "Wiping the table...",
  "Stacking the books...",
  "Tidying up the papers...",
  "Checking the computer...",
  "Calibrating the monitor...",
  "Aligning the lamps...",
  "Sweeping the floor...",
  "Hanging up the art pieces...",
  "Turning on the heater...",
  "Placing the cushions...",
  "Preparing the coffee cup...",
];

const LoadingPage = ({ onComplete }) => {
  const { progress, item } = useProgress();
  const [isVisible, setIsVisible] = useState(true);
  const loadingDone = useRef(false);

  const loadingScreenRef = useRef(null);
  const progressText = useRef(null);
  const progressBar = useRef(null);
  const messageRef = useRef(null);

  //  Wrap animation in useCallback for stable reference
  const runWelcomeAnimation = useCallback(() => {
    const tl = gsap.timeline();

    tl.to(
      [
        progressText.current,
        progressBar.current,
        ".loading-item",
        ".loading-bar-container",
      ],
      {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        delay: 2,
      }
    )
      .to(messageRef.current, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      })
      .to(messageRef.current, {
        opacity: 0,
        duration: 1,
        delay: 0.8,
        ease: "power2.out",
      })
      .to(loadingScreenRef.current, {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          setIsVisible(false);
          if (typeof onComplete === "function") onComplete();
        },
      });

    // kill GSAP timeline if unmounted
    return () => tl.kill();
  }, [onComplete]);

  // Smoothly loading bar and text
  useEffect(() => {
  if (progressBar.current && progressText.current) {
    const clampedProgress = Math.min(Math.max(progress, 0), 100);
    const displayProgress = clampedProgress > 99.5 ? 100 : clampedProgress;

    progressBar.current.style.width = `${displayProgress}%`;
    progressText.current.textContent = `${Math.round(displayProgress)}%`;
  }
}, [progress]);

  // Scene-ready event and fallback
  useEffect(() => {
    const handleSceneReady = () => {
      if (!loadingDone.current) {
        loadingDone.current = true;
        runWelcomeAnimation();
      }
    };

    window.addEventListener("scene-ready", handleSceneReady);

    // fallback in case scene-ready never fires
    let timeout;
    if (progress >= 100 && !loadingDone.current) {
      timeout = setTimeout(() => {
        if (!loadingDone.current) {
          loadingDone.current = true;
          runWelcomeAnimation();
        }
      }, 500);
    }

    return () => {
      window.removeEventListener("scene-ready", handleSceneReady);
      if (timeout) clearTimeout(timeout);
    };
  }, [progress, runWelcomeAnimation]); 

  if (!isVisible) return null;

  return (
    <div ref={loadingScreenRef} className="loading-screen">
      <div className="loading-content">
        <div ref={messageRef} className="intro-message">
          Welcome.
        </div>

        <div className="loading-bar-wrapper">
          <div className="loading-bar-container">
            <div ref={progressBar} className="loading-bar"></div>
          </div>
          <div ref={progressText} className="percentage"></div>
          <div className="loading-item">
            {friendlyMessages[item] ||
              defaultMessages[
                Math.floor(Math.random() * defaultMessages.length)
              ]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
