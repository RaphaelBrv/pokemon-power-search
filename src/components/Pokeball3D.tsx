import * as React from "react";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Définition des types pour plus de clarté
type ThreeContext = {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  controls: OrbitControls | null;
  pokeballGroup: THREE.Group | null;
  mountRef: React.RefObject<HTMLDivElement>;
  requestRef: React.MutableRefObject<number | null>; // Pour l'ID de requestAnimationFrame
};

// Le composant React fonctionnel
const Pokeball3D: React.FC<{ className?: string }> = ({
  className = "w-full h-80",
}) => {
  // Référence au conteneur div où le canvas sera monté
  const mountRef = useRef<HTMLDivElement>(null);

  // Références pour stocker les objets Three.js et l'ID d'animation
  // afin qu'ils persistent entre les rendus sans causer de re-rendu
  const threeContext = useRef<ThreeContext>({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    pokeballGroup: null,
    mountRef: mountRef, // Passer la ref ici pour l'utiliser dans les fonctions
    requestRef: { current: null },
  }).current; // .current pour accéder à l'objet mutable

  // Effet exécuté une fois après le montage initial du composant
  useEffect(() => {
    // --- Initialisation de Three.js ---
    const initThree = () => {
      if (!threeContext.mountRef.current) return; // Sécurité: vérifier que le point de montage existe

      const currentMount = threeContext.mountRef.current;

      // 1. Scène
      threeContext.scene = new THREE.Scene();
      threeContext.scene.background = null; // Fond transparent au lieu du gris

      // 2. Caméra
      threeContext.camera = new THREE.PerspectiveCamera(
        70,
        currentMount.clientWidth / currentMount.clientHeight, // Utiliser les dimensions du conteneur
        0.1,
        1000
      );
      threeContext.camera.position.set(0, 1, 4);

      // 3. Renderer
      threeContext.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true, // Rendre le fond transparent
      });
      threeContext.renderer.setSize(
        currentMount.clientWidth,
        currentMount.clientHeight
      );
      currentMount.appendChild(threeContext.renderer.domElement); // Ajouter le canvas au div référencé

      // 4. Lumières
      threeContext.scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
      dirLight.position.set(8, 15, 10);
      threeContext.scene.add(dirLight);
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
      fillLight.position.set(-8, 5, -10);
      threeContext.scene.add(fillLight);

      // 5. Création de la Pokéball
      threeContext.pokeballGroup = new THREE.Group();

      const sphereRadius = 1.5;
      const bandThickness = 0.22;
      const buttonRadius = 0.4;
      const buttonHeight = 0.1;
      const buttonRingThickness = 0.05;

      // Matériaux
      const materialTop = new THREE.MeshStandardMaterial({
        color: 0xcc0000,
        roughness: 0.4,
        metalness: 0.1,
      });
      const materialBottom = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.35,
        metalness: 0.05,
      });
      const materialBand = new THREE.MeshStandardMaterial({
        color: 0x080808,
        roughness: 0.2,
        metalness: 0.2,
      });
      const materialButtonOuter = new THREE.MeshStandardMaterial({
        color: 0xf0f0f0,
        roughness: 0.4,
        metalness: 0.1,
      });
      const materialButtonInner = new THREE.MeshStandardMaterial({
        color: 0xb0b0b0,
        roughness: 0.5,
        metalness: 0.1,
      });
      const materialButtonRing = materialBand;

      // Géométrie de la Sphère
      const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 64, 32);

      // Assignation des matériaux haut/bas via les groupes
      sphereGeometry.clearGroups();
      const indices = sphereGeometry.index!.array; // Utiliser ! car on sait qu'il existe
      const uvAttribute = sphereGeometry.getAttribute("uv");
      const faceCount = indices.length / 3;
      const topGroupIndices: number[] = []; // Typage explicite
      const bottomGroupIndices: number[] = []; // Typage explicite

      for (let i = 0; i < faceCount; i++) {
        const a = indices[i * 3];
        const b = indices[i * 3 + 1];
        const c = indices[i * 3 + 2];
        const vA = uvAttribute.getY(a);
        const vB = uvAttribute.getY(b);
        const vC = uvAttribute.getY(c);
        if ((vA + vB + vC) / 3 > 0.5) {
          topGroupIndices.push(a, b, c);
        } else {
          bottomGroupIndices.push(a, b, c);
        }
      }
      sphereGeometry.setIndex([...topGroupIndices, ...bottomGroupIndices]);
      sphereGeometry.addGroup(0, topGroupIndices.length, 0);
      sphereGeometry.addGroup(
        topGroupIndices.length,
        bottomGroupIndices.length,
        1
      );

      // Création du Mesh de la sphère
      const pokeballSphere = new THREE.Mesh(sphereGeometry, [
        materialTop,
        materialBottom,
      ]);
      threeContext.pokeballGroup.add(pokeballSphere);

      // Bande Noire - Cercle Complet
      const bandGeometry = new THREE.TorusGeometry(
        sphereRadius,
        bandThickness / 2,
        24,
        100
      );
      const bandMesh = new THREE.Mesh(bandGeometry, materialBand);
      bandMesh.rotation.x = Math.PI / 2;
      threeContext.pokeballGroup.add(bandMesh);

      // Contour Noir du Bouton
      const buttonRingRadius = buttonRadius + buttonRingThickness;
      const buttonRingHeight = buttonHeight * 0.8;
      const buttonRingGeometry = new THREE.CylinderGeometry(
        buttonRingRadius,
        buttonRingRadius,
        buttonRingHeight,
        64
      );
      const buttonRingMesh = new THREE.Mesh(
        buttonRingGeometry,
        materialButtonRing
      );
      buttonRingMesh.rotation.x = Math.PI / 2;
      buttonRingMesh.position.z = sphereRadius + 0.005;
      threeContext.pokeballGroup.add(buttonRingMesh);

      // Bouton Blanc (Extérieur)
      const buttonOuterGeometry = new THREE.CylinderGeometry(
        buttonRadius,
        buttonRadius,
        buttonHeight,
        64
      );
      const buttonOuterMesh = new THREE.Mesh(
        buttonOuterGeometry,
        materialButtonOuter
      );
      buttonOuterMesh.rotation.x = Math.PI / 2;
      buttonOuterMesh.position.z = sphereRadius + 0.01;
      threeContext.pokeballGroup.add(buttonOuterMesh);

      // Bouton Gris (Intérieur)
      const buttonInnerGeometry = new THREE.CylinderGeometry(
        buttonRadius * 0.6,
        buttonRadius * 0.6,
        buttonHeight + 0.01,
        64
      );
      const buttonInnerMesh = new THREE.Mesh(
        buttonInnerGeometry,
        materialButtonInner
      );
      buttonInnerMesh.position.z = 0.015;
      buttonOuterMesh.add(buttonInnerMesh); // Ajouté comme enfant du bouton blanc

      threeContext.scene.add(threeContext.pokeballGroup);

      // 6. Contrôles Orbitaux
      threeContext.controls = new OrbitControls(
        threeContext.camera,
        threeContext.renderer.domElement
      );
      threeContext.controls.enableDamping = true;
      threeContext.controls.dampingFactor = 0.05;
      threeContext.controls.screenSpacePanning = false;
      threeContext.controls.minDistance = 2.5;
      threeContext.controls.maxDistance = 8;
      threeContext.controls.target.set(0, 0, 0);
      threeContext.controls.update();
    };

    // --- Boucle d'animation ---
    const animate = () => {
      // Demander la prochaine frame
      threeContext.requestRef.current = requestAnimationFrame(animate);

      // Faire tourner doucement la pokeball
      if (threeContext.pokeballGroup) {
        threeContext.pokeballGroup.rotation.y += 0.005;
      }

      // Mettre à jour les contrôles si le damping est activé
      if (threeContext.controls?.enableDamping) {
        threeContext.controls.update();
      }

      // Rendre la scène si tout est initialisé
      if (threeContext.renderer && threeContext.scene && threeContext.camera) {
        threeContext.renderer.render(threeContext.scene, threeContext.camera);
      }
    };

    // --- Gestion du redimensionnement ---
    const handleResize = () => {
      if (
        !threeContext.mountRef.current ||
        !threeContext.renderer ||
        !threeContext.camera
      )
        return;

      const currentMount = threeContext.mountRef.current;
      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;

      // Mettre à jour la taille du renderer
      threeContext.renderer.setSize(width, height);
      // Mettre à jour l'aspect de la caméra
      threeContext.camera.aspect = width / height;
      threeContext.camera.updateProjectionMatrix();
    };

    // --- Initialisation et démarrage ---
    initThree(); // Initialiser la scène
    animate(); // Démarrer la boucle d'animation
    window.addEventListener("resize", handleResize); // Ajouter l'écouteur de redimensionnement

    // --- Fonction de nettoyage ---
    // Exécutée lorsque le composant est démonté
    return () => {
      // Arrêter la boucle d'animation
      if (threeContext.requestRef.current) {
        cancelAnimationFrame(threeContext.requestRef.current);
      }

      // Supprimer l'écouteur d'événement
      window.removeEventListener("resize", handleResize);

      // Supprimer le canvas du DOM
      if (threeContext.renderer) {
        threeContext.mountRef.current?.removeChild(
          threeContext.renderer.domElement
        );
      }

      // Disposer les objets Three.js pour libérer la mémoire
      threeContext.scene?.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          // Si le matériau est un tableau (multi-matériaux)
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material?.dispose());
          } else if (object.material) {
            // Vérifier si le matériau existe
            object.material.dispose();
          }
        }
      });
      threeContext.renderer?.dispose(); // Très important
      // Nettoyer les références
      threeContext.scene = null;
      threeContext.camera = null;
      threeContext.renderer = null;
      threeContext.controls = null;
      threeContext.pokeballGroup = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Le tableau vide assure que l'effet ne s'exécute qu'une fois au montage/démontage

  // Rendu du composant: un div qui servira de point de montage pour le canvas Three.js
  return (
    <div
      ref={mountRef}
      className={className}
      style={{ overflow: "hidden", borderRadius: "8px" }} // Empêche les barres de défilement sur ce div
    />
  );
};

export default Pokeball3D;
