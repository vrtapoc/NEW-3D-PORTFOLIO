import * as THREE from "three";

/**
 * Creates a dark smoked natural oak floor plank texture using HTML5 Canvas.
 * Target Base Hex: #4A3022 (RGB: 74, 48, 34)
 * Darkest grain: #342219 (RGB: 52, 34, 25)
 * Lighter highlight grain: #5A3C29 (RGB: 90, 60, 41)
 * Long rectangular planks with 25%-50% staggered layout and subtle longitudinal oak grain.
 */
export function createDarkSmokedOakTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  // Warm Natural Scandinavian Oak / Hazelnut Palette (#987B66 base, #B5967F highlight, #503321 shadow)
  const baseColor = "#987B66";
  const plankColors = [
    "#987B66", // Warm Natural Oak Base
    "#8E715C", // Warm Hazelnut Plank
    "#B5967F", // Golden Highlight Plank
    "#7D624E", // Deep Natural Oak Plank
    "#AC8E77", // Soft Blonde Oak Plank
    "#947762", // Natural Hazelnut Plank
    "#BC9E87", // Warm Highlight Board
    "#866A55", // Shadow Tone Board (#503321 undertone)
  ];

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 1024, 1024);

  // 8 wide luxury planks across 1024px canvas (~128px per plank)
  const numPlanks = 8;
  const plankHeight = 1024 / numPlanks; // 128px per plank

  for (let i = 0; i < numPlanks; i++) {
    const y = i * plankHeight;
    const color = plankColors[i % plankColors.length];

    ctx.fillStyle = color;
    ctx.fillRect(0, y, 1024, plankHeight);

    // Natural warm oak longitudinal grain lines (#503321 shadow undertone)
    ctx.strokeStyle = "rgba(80, 51, 33, 0.24)";
    ctx.lineWidth = 1.3;

    for (let g = 0; g < 7; g++) {
      const gy = y + (g + 1) * (plankHeight / 8);
      ctx.beginPath();
      ctx.moveTo(0, gy);
      for (let x = 0; x <= 1024; x += 32) {
        const wave = Math.sin((x + i * 180) * 0.012) * 2.2 + Math.cos(x * 0.02 + i) * 1.0;
        ctx.lineTo(x, gy + wave);
      }
      ctx.stroke();
    }

    // Soft warm golden-blonde highlight grain lines (#B5967F)
    ctx.strokeStyle = "rgba(225, 200, 180, 0.28)";
    ctx.lineWidth = 1.1;
    for (let g = 0; g < 4; g++) {
      const gy = y + 16 + g * 28;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      for (let x = 0; x <= 1024; x += 48) {
        ctx.lineTo(x, gy + Math.sin(x * 0.035 + g * 2) * 1.3);
      }
      ctx.stroke();
    }

    // Fine, subtle dark brown plank bevel seam (#2E1E14)
    ctx.strokeStyle = "rgba(46, 30, 20, 0.70)";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();

    // Subtle soft light rim along the top edge of each plank
    ctx.strokeStyle = "rgba(235, 215, 195, 0.35)";
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(0, y + 2.0);
    ctx.lineTo(1024, y + 2.0);
    ctx.stroke();
  }

  // Staggered vertical butt joints (25%-50% offset per row)
  ctx.strokeStyle = "rgba(46, 30, 20, 0.65)";
  ctx.lineWidth = 1.8;

  for (let i = 0; i < numPlanks; i++) {
    const y = i * plankHeight;
    const staggerOffsets = [
      [280, 800],
      [540],
      [180, 720],
      [420, 940],
      [320, 860],
      [140, 660],
      [480],
      [240, 760],
    ];
    const offsets = staggerOffsets[i % staggerOffsets.length];

    offsets.forEach((ox) => {
      ctx.beginPath();
      ctx.moveTo(ox, y);
      ctx.lineTo(ox, y + plankHeight);
      ctx.stroke();
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.6, 1.6);
  texture.needsUpdate = true;

  return texture;
}

/**
 * Creates a subtle warm charcoal concrete / microcement texture using HTML5 Canvas.
 * Target base color: #3F3A35 (RGB: 63, 58, 53)
 * Tonal variation between #302C28 and #4A4540 with soft cloudy architectural noise and fine micro-grain.
 */
export function createCharcoalConcreteTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  // Base warm charcoal concrete #3F3A35 (RGB: 63, 58, 53)
  ctx.fillStyle = "#3F3A35";
  ctx.fillRect(0, 0, 1024, 1024);

  // Broad cloudy architectural tonal variations (1-2m scale)
  const clouds = [
    { x: 250, y: 300, r: 380, color: "rgba(48, 44, 40, 0.24)" },   // #302C28 (darkest)
    { x: 750, y: 200, r: 420, color: "rgba(74, 69, 64, 0.20)" },   // #4A4540 (lightest)
    { x: 500, y: 700, r: 460, color: "rgba(58, 53, 48, 0.22)" },   // #3A3530
    { x: 150, y: 800, r: 320, color: "rgba(70, 65, 60, 0.18)" },   // #46413C
    { x: 850, y: 750, r: 400, color: "rgba(52, 47, 43, 0.24)" },   // #342F2B
    { x: 400, y: 450, r: 300, color: "rgba(66, 61, 56, 0.16)" },   // #423D38
  ];

  clouds.forEach((c) => {
    const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
    grad.addColorStop(0, c.color);
    grad.addColorStop(1, "rgba(63, 58, 53, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Fine microcement surface grain
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Subtle pseudo-random micro-noise (-3 to +3 intensity)
    const noise = (Math.random() - 0.5) * 6;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));         // R
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.95)); // G
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.88)); // B (warm taupe undertone)
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.needsUpdate = true;

  return texture;
}

/**
 * Creates a clean light Scandinavian oak texture for light room.
 */
export function createLightOakTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  const baseColor = "#E5D7C3";
  const plankColors = ["#E7DAC6", "#E1D2BE", "#E9DCC9", "#DFCFBA", "#E5D6C2", "#E3D4BF"];

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 1024, 1024);

  const numPlanks = 16;
  const plankHeight = 1024 / numPlanks;

  for (let i = 0; i < numPlanks; i++) {
    const y = i * plankHeight;
    const color = plankColors[i % plankColors.length];

    ctx.fillStyle = color;
    ctx.fillRect(0, y, 1024, plankHeight);

    ctx.strokeStyle = "rgba(140, 110, 80, 0.06)";
    ctx.lineWidth = 1;
    for (let g = 0; g < 5; g++) {
      const gy = y + (g + 1) * (plankHeight / 6);
      ctx.beginPath();
      ctx.moveTo(0, gy);
      for (let x = 0; x <= 1024; x += 64) {
        ctx.lineTo(x, gy + Math.sin((x + i * 100) * 0.015) * 1.2);
      }
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(160, 140, 120, 0.35)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(160, 140, 120, 0.3)";
  ctx.lineWidth = 1.2;
  for (let i = 0; i < numPlanks; i++) {
    const y = i * plankHeight;
    const offset1 = ((i * 370) % 800) + 100;
    ctx.beginPath();
    ctx.moveTo(offset1, y);
    ctx.lineTo(offset1, y + plankHeight);
    ctx.stroke();

    const offset2 = (offset1 + 512) % 1024;
    ctx.beginPath();
    ctx.moveTo(offset2, y);
    ctx.lineTo(offset2, y + plankHeight);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.needsUpdate = true;

  return texture;
}

export function convertMaterialsToBasic(materials, alphaTestValue = 0) {
  const newMaterials = {};

  Object.keys(materials).forEach((key) => {
    const oldMaterial = materials[key];

    const isFanMaterial =
      ["galvanized_steel", "material.041", "material.042"].includes(
        oldMaterial.name?.toLowerCase()
      );

    const isGlassLike =
      oldMaterial.transparent ||
      (oldMaterial.name && oldMaterial.name.toLowerCase().includes("glass"));

    if (
      !isFanMaterial &&
      (oldMaterial instanceof THREE.MeshStandardMaterial ||
        oldMaterial instanceof THREE.MeshPhysicalMaterial ||
        oldMaterial instanceof THREE.MeshLambertMaterial) &&
      !isGlassLike
    ) {
      const newMaterial = new THREE.MeshBasicMaterial({
        map: oldMaterial.map || null,
        color: oldMaterial.color ? oldMaterial.color.clone() : new THREE.Color(0xffffff),
        transparent: oldMaterial.transparent || false,
        alphaTest: oldMaterial.transparent ? 0.1 : alphaTestValue,
        side: THREE.DoubleSide,
      });
      newMaterials[key] = newMaterial;
    } else {
      oldMaterial.side = THREE.DoubleSide;
      newMaterials[key] = oldMaterial;
    }
  });

  return newMaterials;
}