import * as THREE from "three";

export function convertMaterialsToBasic(materials, alphaTestValue = 0) {
  const newMaterials = {};

  Object.keys(materials).forEach((key) => {
    const oldMaterial = materials[key];

    // Materials you want to keep unchanged (fan-related)
    const isFanMaterial =
      ["galvanized_steel", "material.041", "material.042"].includes(
        oldMaterial.name?.toLowerCase()
      );

    // Skip converting transparent/glass-like materials
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
      // Convert baked/diffuse materials to MeshBasic
      const newMaterial = new THREE.MeshBasicMaterial({
        map: oldMaterial.map || null,
        color: oldMaterial.color ? oldMaterial.color.clone() : new THREE.Color(0xffffff),
        transparent: oldMaterial.transparent || false,
        alphaTest: oldMaterial.transparent ? 0.1 : alphaTestValue,
        side: THREE.DoubleSide, // fixes red face orientation / invisible sides
      });
      newMaterials[key] = newMaterial;
    } else {
      // Keep fan, glass, and other materials as-is, but force DoubleSide
      oldMaterial.side = THREE.DoubleSide;
      newMaterials[key] = oldMaterial;
    }
  });

  return newMaterials;
}