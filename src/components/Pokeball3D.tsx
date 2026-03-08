import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface Pokeball3DProps {
  className?: string;
}

const Pokeball3D: React.FC<Pokeball3DProps> = ({
  className = "w-full h-[500px] bg-gray-900 rounded-xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing",
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  useEffect(() => {
    if (!mountRef.current || isPlayingVideo) return;
    const container = mountRef.current;

    // --- 1. INITIALISATION DE LA SCÈNE ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x111827, 0.05);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.5, 6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    container.appendChild(renderer.domElement);

    // --- 2. ÉCLAIRAGE ---
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 5, 4);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 4;
    dirLight.shadow.camera.bottom = -4;
    dirLight.shadow.camera.left = -4;
    dirLight.shadow.camera.right = 4;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 20;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x88bbff, 1.5);
    fillLight.position.set(-5, 3, -4);
    scene.add(fillLight);

    const rimLight = new THREE.SpotLight(0xffffff, 5);
    rimLight.position.set(0, 5, -5);
    rimLight.angle = Math.PI / 4;
    rimLight.penumbra = 0.5;
    scene.add(rimLight);

    // --- 3. CRÉATION DE LA POKÉBALL ---
    const pokeballGroup = new THREE.Group();
    const pokeballItems: THREE.Mesh[] = [];

    const radius = 1.5;
    const gap = 0.04;

    const plasticMaterialSettings = {
      roughness: 0.4,
      metalness: 0.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    };

    const redMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xcc0000,
      ...plasticMaterialSettings
    });

    const whiteMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xeeeeee,
      ...plasticMaterialSettings
    });

    const blackMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.7,
      metalness: 0.2,
    });

    const topPivot = new THREE.Group();
    topPivot.position.set(0, 0, -radius);
    
    const topGeom = new THREE.SphereGeometry(radius, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2 - gap);
    const topHemisphere = new THREE.Mesh(topGeom, redMaterial);
    topHemisphere.position.set(0, 0, radius);
    topHemisphere.castShadow = true;
    topHemisphere.receiveShadow = true;
    topPivot.add(topHemisphere);
    pokeballItems.push(topHemisphere);
    pokeballGroup.add(topPivot);

    const bottomGeom = new THREE.SphereGeometry(radius, 64, 32, 0, Math.PI * 2, Math.PI / 2 + gap, Math.PI / 2);
    const bottomHemisphere = new THREE.Mesh(bottomGeom, whiteMaterial);
    bottomHemisphere.castShadow = true;
    bottomHemisphere.receiveShadow = true;
    pokeballGroup.add(bottomHemisphere);
    pokeballItems.push(bottomHemisphere);

    const coreGeom = new THREE.SphereGeometry(radius - 0.02, 64, 32);
    const core = new THREE.Mesh(coreGeom, blackMaterial);
    core.receiveShadow = true;
    pokeballGroup.add(core);
    pokeballItems.push(core);

    const buttonGroup = new THREE.Group();
    buttonGroup.position.set(0, 0, radius - 0.05);
    buttonGroup.rotation.x = Math.PI / 2;

    const ringGeom = new THREE.CylinderGeometry(0.45, 0.45, 0.15, 64);
    const ring = new THREE.Mesh(ringGeom, blackMaterial);
    buttonGroup.add(ring);
    pokeballItems.push(ring);

    const btnOuterGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 64);
    const btnOuter = new THREE.Mesh(btnOuterGeom, whiteMaterial);
    btnOuter.position.y = 0.02;
    buttonGroup.add(btnOuter);
    pokeballItems.push(btnOuter);

    const btnInnerMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.1,
      emissive: 0x444444,
      emissiveIntensity: 0.2
    });
    const btnInnerGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.22, 64);
    const btnInner = new THREE.Mesh(btnInnerGeom, btnInnerMaterial);
    btnInner.position.y = 0.03;
    buttonGroup.add(btnInner);
    pokeballItems.push(btnInner);

    pokeballGroup.add(buttonGroup);

    // --- 4. PIKACHU ---
    const pikaGroup = new THREE.Group();
    pikaGroup.scale.setScalar(0);
    pikaGroup.position.y = -0.5;

    const pikaYellow = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 });
    const pikaBlack = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
    const pikaRed = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 });

    const bodyGeom = new THREE.CapsuleGeometry(0.3, 0.3, 16, 16);
    const body = new THREE.Mesh(bodyGeom, pikaYellow);
    body.position.y = 0.45;
    body.castShadow = true;
    pikaGroup.add(body);
    pokeballItems.push(body);

    const headGeom = new THREE.SphereGeometry(0.35, 32, 32);
    const head = new THREE.Mesh(headGeom, pikaYellow);
    head.position.y = 0.9;
    head.castShadow = true;
    pikaGroup.add(head);
    pokeballItems.push(head);

    const earGeom = new THREE.ConeGeometry(0.08, 0.4, 16);
    const earL = new THREE.Mesh(earGeom, pikaYellow);
    earL.position.set(-0.2, 1.15, 0);
    earL.rotation.z = Math.PI / 6;
    pikaGroup.add(earL);
    pokeballItems.push(earL);

    const earR = new THREE.Mesh(earGeom, pikaYellow);
    earR.position.set(0.2, 1.15, 0);
    earR.rotation.z = -Math.PI / 6;
    pikaGroup.add(earR);
    pokeballItems.push(earR);

    const earTipGeom = new THREE.ConeGeometry(0.081, 0.15, 16);
    const earTipL = new THREE.Mesh(earTipGeom, pikaBlack);
    earTipL.position.y = 0.13;
    earL.add(earTipL);
    pokeballItems.push(earTipL);
    
    const earTipR = new THREE.Mesh(earTipGeom, pikaBlack);
    earTipR.position.y = 0.13;
    earR.add(earTipR);
    pokeballItems.push(earTipR);

    const cheekGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16);
    const cheekL = new THREE.Mesh(cheekGeom, pikaRed);
    cheekL.rotation.x = Math.PI / 2;
    cheekL.position.set(-0.2, 0.85, 0.31);
    pikaGroup.add(cheekL);
    pokeballItems.push(cheekL);

    const cheekR = cheekL.clone();
    cheekR.position.set(0.2, 0.85, 0.31);
    pikaGroup.add(cheekR);
    pokeballItems.push(cheekR);

    const eyeGeom = new THREE.SphereGeometry(0.05, 16, 16);
    const eyeL = new THREE.Mesh(eyeGeom, pikaBlack);
    eyeL.position.set(-0.15, 0.95, 0.32);
    pikaGroup.add(eyeL);
    pokeballItems.push(eyeL);

    const eyeR = eyeL.clone();
    eyeR.position.set(0.15, 0.95, 0.32);
    pikaGroup.add(eyeR);
    pokeballItems.push(eyeR);

    const noseGeom = new THREE.SphereGeometry(0.02, 16, 16);
    const nose = new THREE.Mesh(noseGeom, pikaBlack);
    nose.position.set(0, 0.9, 0.35);
    pikaGroup.add(nose);
    pokeballItems.push(nose);

    pokeballGroup.add(pikaGroup);
    scene.add(pokeballGroup);

    // --- 5. OMBRE ---
    const planeGeom = new THREE.PlaneGeometry(10, 10);
    const shadowMaterial = new THREE.ShadowMaterial({ opacity: 0.4 });
    const groundPlane = new THREE.Mesh(planeGeom, shadowMaterial);
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.position.y = -1.8;
    groundPlane.receiveShadow = true;
    scene.add(groundPlane);
    pokeballItems.push(groundPlane);

    // --- 6. CONTRÔLES ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 2.5;
    controls.maxDistance = 8;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;

    // --- 7. INTERACTIONS ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let currentRotationY = 0;

    const onPointerMove = (event: PointerEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pokeballGroup.children, true);
      
      if (intersects.length > 0) {
        container.style.cursor = "pointer";
      } else {
        container.style.cursor = "grab";
      }
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pokeballGroup.children, true);
      if (intersects.length > 0) {
        setIsPlayingVideo(true);
      }
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("click", onClick);

    // --- 8. ANIMATION ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      currentRotationY += 0.01;
      pokeballGroup.rotation.y = currentRotationY;
      pokeballGroup.position.y = Math.sin(elapsedTime * 2) * 0.1;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("click", onClick);
      container.style.cursor = "auto";
      
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      pokeballItems.forEach((mesh) => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => mat.dispose());
        } else {
          mesh.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, [isPlayingVideo]);

  const handleVideoEnd = () => {
    setIsPlayingVideo(false);
  };

  useEffect(() => {
    if (isPlayingVideo && videoRef.current) {
      videoRef.current.play();
    }
  }, [isPlayingVideo]);

  return (
    <>
      <div className={`relative ${className}`}>
        <div ref={mountRef} className="w-full h-full" />
      </div>

      {isPlayingVideo && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src="/pokeballpikachu.mp4"
            className="w-full h-full object-contain"
            onEnded={handleVideoEnd}
            autoPlay
            playsInline
          />
          <button 
            onClick={() => setIsPlayingVideo(false)}
            className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 text-white px-6 py-2 rounded-full text-sm font-semibold backdrop-blur-md transition-all shadow-lg border border-white/30"
          >
            Fermer
          </button>
        </div>
      )}
    </>
  );
};

export default Pokeball3D;