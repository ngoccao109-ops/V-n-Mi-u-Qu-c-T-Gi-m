import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RobotEmotion } from '../utils/ragEngine';

interface Robot3DProps {
  emotion: RobotEmotion;
  isThinking?: boolean;
  isListening?: boolean;
  onRobotClick?: () => void;
}

export const Robot3D: React.FC<Robot3DProps> = ({
  emotion,
  isThinking,
  isListening,
  onRobotClick
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const emotionRef = useRef<RobotEmotion>(emotion);
  const isThinkingRef = useRef<boolean>(!!isThinking);
  const isListeningRef = useRef<boolean>(!!isListening);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    emotionRef.current = emotion;
  }, [emotion]);

  useEffect(() => {
    isThinkingRef.current = !!isThinking;
  }, [isThinking]);

  useEffect(() => {
    isListeningRef.current = !!isListening;
  }, [isListening]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 400;
    let height = container.clientHeight || 520;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 3.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup (Bright, Clean, Crisp for Glossy White & Neon LED)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(3, 4, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.2);
    fillLight.position.set(-3, 2, 3);
    scene.add(fillLight);

    const backRimLight = new THREE.PointLight(0x38bdf8, 1.8, 8);
    backRimLight.position.set(0, 3, -2);
    scene.add(backRimLight);

    // 3. Dynamic Face Canvas (512x512 for optimal sharpness and zero lag)
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = 512;
    faceCanvas.height = 512;
    const faceCtx = faceCanvas.getContext('2d')!;
    const faceTexture = new THREE.CanvasTexture(faceCanvas);
    faceTexture.anisotropy = 8;
    faceTexture.generateMipmaps = true;

    // 4. Materials
    const glossyWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.05,
    });

    const darkCollarMat = new THREE.MeshStandardMaterial({
      color: 0x1e2430,
      roughness: 0.4,
      metalness: 0.2,
    });

    // Face Screen Material (Rendered on top with depthWrite false to guarantee 100% visibility)
    const faceScreenMat = new THREE.MeshBasicMaterial({
      map: faceTexture,
      transparent: true,
      depthWrite: false,
    });

    const blackVisorBaseMat = new THREE.MeshBasicMaterial({
      color: 0x05070a,
      depthWrite: false,
    });

    // 5. Robot Root (Floating Group)
    const robotRoot = new THREE.Group();
    scene.add(robotRoot);
    robotRoot.position.y = 0.05;

    // --- A. TORSO (Smooth Tapered Body) ---
    const torsoGroup = new THREE.Group();
    robotRoot.add(torsoGroup);

    // Torso Shape: smooth egg/cup body
    const bodyPoints: THREE.Vector2[] = [];
    bodyPoints.push(new THREE.Vector2(0.001, -0.92));
    bodyPoints.push(new THREE.Vector2(0.20, -0.82));
    bodyPoints.push(new THREE.Vector2(0.40, -0.62));
    bodyPoints.push(new THREE.Vector2(0.55, -0.32));
    bodyPoints.push(new THREE.Vector2(0.62, 0.02));
    bodyPoints.push(new THREE.Vector2(0.58, 0.28));
    bodyPoints.push(new THREE.Vector2(0.50, 0.46));
    bodyPoints.push(new THREE.Vector2(0.42, 0.52));

    const bodyGeo = new THREE.LatheGeometry(bodyPoints, 36);
    const bodyMesh = new THREE.Mesh(bodyGeo, glossyWhiteMat);
    bodyMesh.castShadow = true;
    torsoGroup.add(bodyMesh);

    // Collar rim
    const collarTorus = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.045, 16, 36),
      glossyWhiteMat
    );
    collarTorus.position.y = 0.52;
    collarTorus.rotation.x = Math.PI / 2;
    torsoGroup.add(collarTorus);

    // Dark collar interior
    const collarInner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.34, 0.2, 32),
      darkCollarMat
    );
    collarInner.position.y = 0.44;
    torsoGroup.add(collarInner);

    // --- B. LEVITATING WING ARMS (Hai cánh tay lơ lửng không khớp) ---
    const createWingArm = () => {
      const armShape = new THREE.Shape();
      armShape.moveTo(0, 0.32);
      armShape.quadraticCurveTo(0.12, 0.18, 0.13, -0.18);
      armShape.quadraticCurveTo(0.08, -0.42, 0, -0.48);
      armShape.quadraticCurveTo(-0.08, -0.42, -0.13, -0.18);
      armShape.quadraticCurveTo(-0.12, 0.18, 0, 0.32);

      const extrudeSettings = {
        depth: 0.07,
        bevelEnabled: true,
        bevelSegments: 6,
        bevelSize: 0.03,
        bevelThickness: 0.03,
      };

      const geo = new THREE.ExtrudeGeometry(armShape, extrudeSettings);
      geo.center();
      const mesh = new THREE.Mesh(geo, glossyWhiteMat);
      mesh.castShadow = true;
      mesh.rotation.y = Math.PI / 2;
      return mesh;
    };

    // Right Arm Pivot
    const rightArmPivot = new THREE.Group();
    rightArmPivot.position.set(-0.74, 0.16, 0);
    torsoGroup.add(rightArmPivot);
    const rightArmMesh = createWingArm();
    rightArmPivot.add(rightArmMesh);
    rightArmMesh.rotation.z = -0.12;

    // Left Arm Pivot
    const leftArmPivot = new THREE.Group();
    leftArmPivot.position.set(0.74, 0.16, 0);
    torsoGroup.add(leftArmPivot);
    const leftArmMesh = createWingArm();
    leftArmPivot.add(leftArmMesh);
    leftArmMesh.rotation.z = 0.12;

    // --- C. FLOATING HEAD & HIGH-VISIBILITY FACE SCREEN ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.82, 0); // Magnetic floating gap above collar
    robotRoot.add(headGroup);

    // Head Shell: Smooth white dome/egg
    const headGeo = new THREE.SphereGeometry(0.55, 36, 36);
    headGeo.scale(1.0, 0.88, 0.94);
    const headMesh = new THREE.Mesh(headGeo, glossyWhiteMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Black Visor Frame Base (Positioned right at front at z = 0.52 to ensure 100% visibility)
    const visorBaseShape = new THREE.Shape();
    visorBaseShape.ellipse(0, 0, 0.38, 0.28, 0, Math.PI * 2, false, 0);
    const visorBaseGeo = new THREE.ShapeGeometry(visorBaseShape, 32);

    const visorBaseMesh = new THREE.Mesh(visorBaseGeo, blackVisorBaseMat);
    visorBaseMesh.position.set(0, 0.02, 0.52);
    visorBaseMesh.renderOrder = 1;
    headGroup.add(visorBaseMesh);

    // Glowing LED Screen Plane (Positioned at z = 0.53 right in front of the black visor)
    const screenGeo = new THREE.PlaneGeometry(0.82, 0.62);
    const screenMesh = new THREE.Mesh(screenGeo, faceScreenMat);
    screenMesh.position.set(0, 0.02, 0.53);
    screenMesh.renderOrder = 2; // Always render on top!
    headGroup.add(screenMesh);

    // Mouse Tracking Event
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = Math.max(-1, Math.min(1, x));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, y));
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // =========================================================
    // 6. DRAWING BOLD & VIBRANT GLOWING LED EYES AND MOUTH
    // =========================================================
    let blinkTimer = 0;
    let isBlinking = false;
    let blinkDuration = 0.16;

    const renderLedFace = (delta: number, elapsed: number) => {
      // Natural Blinking
      blinkTimer += delta;
      if (blinkTimer > 3.2 + Math.sin(elapsed) * 1.5) {
        isBlinking = true;
        blinkTimer = 0;
      }
      if (isBlinking && blinkTimer > blinkDuration) {
        isBlinking = false;
      }

      const curEmotion = emotionRef.current;
      const thinking = isThinkingRef.current;
      const listening = isListeningRef.current;

      // Clear Canvas to Transparent so the black visor background shines through
      faceCtx.clearRect(0, 0, 512, 512);

      // Eye center coordinates
      const eyeY = 220;
      const leftEyeX = 165;
      const rightEyeX = 347;

      // Gaze Tracking Offsets
      let gazeX = 0;
      let gazeY = 0;
      if (thinking) {
        gazeX = 18;
        gazeY = -22;
      } else if (listening) {
        gazeX = 25;
        gazeY = 2;
      } else {
        gazeX = mouseRef.current.x * 16;
        gazeY = -mouseRef.current.y * 12;
      }

      // High-Voltage Cyan Neon Colors
      const ledPrimary = '#00f7ff';
      const ledCore = '#e0feff';

      // --- HELPER 1: BOLD HAPPY GLOWING CYAN CRESCENT EYES (^ ^) ---
      const drawCrescentEye = (cx: number, cy: number, isRight: boolean) => {
        faceCtx.save();
        faceCtx.translate(cx + gazeX, cy + gazeY);
        faceCtx.rotate(isRight ? 0.08 : -0.08);

        // Intense LED Bloom Glow
        faceCtx.shadowColor = ledPrimary;
        faceCtx.shadowBlur = 28;

        // Outer cyan crescent
        faceCtx.fillStyle = ledPrimary;
        faceCtx.beginPath();
        faceCtx.moveTo(-52, 16);
        faceCtx.bezierCurveTo(-32, -32, 32, -32, 52, 16);
        faceCtx.bezierCurveTo(28, -6, -28, -6, -52, 16);
        faceCtx.closePath();
        faceCtx.fill();

        // Inner white-cyan bright core
        faceCtx.fillStyle = ledCore;
        faceCtx.beginPath();
        faceCtx.moveTo(-38, 10);
        faceCtx.bezierCurveTo(-22, -22, 22, -22, 38, 10);
        faceCtx.bezierCurveTo(18, -2, -18, -2, -38, 10);
        faceCtx.closePath();
        faceCtx.fill();

        faceCtx.restore();
      };

      // --- HELPER 2: BOLD OVAL ALERT EYE ---
      const drawOvalEye = (cx: number, cy: number) => {
        faceCtx.save();
        faceCtx.translate(cx + gazeX, cy + gazeY);
        faceCtx.shadowColor = ledPrimary;
        faceCtx.shadowBlur = 25;

        faceCtx.fillStyle = ledPrimary;
        faceCtx.beginPath();
        faceCtx.ellipse(0, 0, 46, 34, 0, 0, Math.PI * 2);
        faceCtx.fill();

        faceCtx.fillStyle = ledCore;
        faceCtx.beginPath();
        faceCtx.ellipse(0, 0, 32, 22, 0, 0, Math.PI * 2);
        faceCtx.fill();
        faceCtx.restore();
      };

      // --- HELPER 3: SQUINT / THINKING EYE ---
      const drawSquintEye = (cx: number, cy: number, angle = 0) => {
        faceCtx.save();
        faceCtx.translate(cx + gazeX, cy + gazeY);
        faceCtx.shadowColor = ledPrimary;
        faceCtx.shadowBlur = 22;

        faceCtx.fillStyle = ledPrimary;
        faceCtx.beginPath();
        faceCtx.ellipse(0, 0, 48, 14, angle, 0, Math.PI * 2);
        faceCtx.fill();

        faceCtx.fillStyle = ledCore;
        faceCtx.beginPath();
        faceCtx.ellipse(0, 0, 34, 8, angle, 0, Math.PI * 2);
        faceCtx.fill();
        faceCtx.restore();
      };

      // --- HELPER 4: CONFUSED EYE ---
      const drawConfusedEye = (cx: number, cy: number, isRight: boolean) => {
        faceCtx.save();
        faceCtx.translate(cx + gazeX, cy + gazeY);
        faceCtx.shadowColor = ledPrimary;
        faceCtx.shadowBlur = 24;

        if (isRight) {
          faceCtx.fillStyle = ledPrimary;
          faceCtx.beginPath();
          faceCtx.ellipse(0, 0, 44, 16, 0.35, 0, Math.PI * 2);
          faceCtx.fill();
        } else {
          faceCtx.fillStyle = ledPrimary;
          faceCtx.beginPath();
          faceCtx.ellipse(0, 0, 48, 38, -0.1, 0, Math.PI * 2);
          faceCtx.fill();

          faceCtx.fillStyle = ledCore;
          faceCtx.beginPath();
          faceCtx.ellipse(0, 0, 34, 26, -0.1, 0, Math.PI * 2);
          faceCtx.fill();
        }
        faceCtx.restore();
      };

      // --- HELPER 5: SAD EYE (u u) ---
      const drawSadEye = (cx: number, cy: number) => {
        faceCtx.save();
        faceCtx.translate(cx + gazeX, cy + gazeY);
        faceCtx.shadowColor = ledPrimary;
        faceCtx.shadowBlur = 22;

        faceCtx.fillStyle = ledPrimary;
        faceCtx.beginPath();
        faceCtx.moveTo(-45, -10);
        faceCtx.bezierCurveTo(-24, 25, 24, 25, 45, -10);
        faceCtx.bezierCurveTo(24, 10, -24, 10, -45, -10);
        faceCtx.closePath();
        faceCtx.fill();
        faceCtx.restore();
      };

      // --- 1. RENDER EYES ---
      if (isBlinking && curEmotion !== 'happy' && curEmotion !== 'greeting') {
        // Thin glowing horizontal blink dash
        faceCtx.shadowColor = ledPrimary;
        faceCtx.shadowBlur = 18;
        faceCtx.fillStyle = ledPrimary;
        faceCtx.fillRect(leftEyeX - 42, eyeY - 3, 84, 6);
        faceCtx.fillRect(rightEyeX - 42, eyeY - 3, 84, 6);
      } else if (
        curEmotion === 'idle' ||
        curEmotion === 'happy' ||
        curEmotion === 'greeting' ||
        curEmotion === 'laughing' ||
        curEmotion === 'goodbye'
      ) {
        // VẦNG TRĂNG KHUYẾT LED TƯƠI VUI (^ ^)
        drawCrescentEye(leftEyeX, eyeY, false);
        drawCrescentEye(rightEyeX, eyeY, true);
      } else if (curEmotion === 'confused') {
        drawConfusedEye(leftEyeX, eyeY, false);
        drawConfusedEye(rightEyeX, eyeY, true);
      } else if (curEmotion === 'thinking') {
        drawSquintEye(leftEyeX, eyeY, -0.1);
        drawSquintEye(rightEyeX, eyeY, 0.1);

        // 3 floating cyan dots for thinking
        for (let i = 0; i < 3; i++) {
          const dotAlpha = 0.3 + 0.7 * Math.abs(Math.sin(elapsed * 5 - i * 0.7));
          faceCtx.fillStyle = `rgba(0, 247, 255, ${dotAlpha})`;
          faceCtx.shadowColor = ledPrimary;
          faceCtx.shadowBlur = 12;
          faceCtx.beginPath();
          faceCtx.arc(224 + i * 32, eyeY + 130, 6, 0, Math.PI * 2);
          faceCtx.fill();
        }
      } else if (curEmotion === 'shakeHead') {
        drawSquintEye(leftEyeX, eyeY, 0);
        drawSquintEye(rightEyeX, eyeY, 0);
      } else if (curEmotion === 'sad') {
        drawSadEye(leftEyeX, eyeY);
        drawSadEye(rightEyeX, eyeY);
      } else {
        // Explaining / Listening
        drawOvalEye(leftEyeX, eyeY);
        drawOvalEye(rightEyeX, eyeY);
      }

      // --- 2. RENDER GLOWING LED MOUTH (MIỆNG LED HIỂN THỊ RÕ RÀNG NGAY DƯỚI MẮT) ---
      const mouthX = 256 + gazeX * 0.4;
      const mouthY = 345 + gazeY * 0.3;

      faceCtx.save();
      faceCtx.shadowColor = ledPrimary;
      faceCtx.shadowBlur = 26;
      faceCtx.lineCap = 'round';
      faceCtx.lineJoin = 'round';

      if (curEmotion === 'explaining') {
        // Animated talking mouth opening & closing with speech
        const talkFreq = Math.abs(Math.sin(elapsed * 8.5));
        const talkH = talkFreq * 18 + 6;

        faceCtx.strokeStyle = ledPrimary;
        faceCtx.lineWidth = 10;
        faceCtx.fillStyle = 'rgba(0, 247, 255, 0.35)';
        faceCtx.beginPath();
        faceCtx.moveTo(mouthX - 38, mouthY - 4);
        faceCtx.quadraticCurveTo(mouthX, mouthY + talkH * 1.6, mouthX + 38, mouthY - 4);
        faceCtx.quadraticCurveTo(mouthX, mouthY + 2, mouthX - 38, mouthY - 4);
        faceCtx.closePath();
        faceCtx.fill();
        faceCtx.stroke();

        faceCtx.strokeStyle = ledCore;
        faceCtx.lineWidth = 4;
        faceCtx.beginPath();
        faceCtx.moveTo(mouthX - 30, mouthY - 2);
        faceCtx.quadraticCurveTo(mouthX, mouthY + talkH * 1.4, mouthX + 30, mouthY - 2);
        faceCtx.stroke();
      } else if (curEmotion === 'happy' || curEmotion === 'laughing') {
        // Wide Radiating Open Happy LED Smile
        faceCtx.strokeStyle = ledPrimary;
        faceCtx.lineWidth = 10;
        faceCtx.fillStyle = 'rgba(0, 247, 255, 0.4)';
        faceCtx.beginPath();
        faceCtx.moveTo(mouthX - 48, mouthY - 4);
        faceCtx.quadraticCurveTo(mouthX, mouthY + 36, mouthX + 48, mouthY - 4);
        faceCtx.quadraticCurveTo(mouthX, mouthY + 4, mouthX - 48, mouthY - 4);
        faceCtx.closePath();
        faceCtx.fill();
        faceCtx.stroke();

        faceCtx.strokeStyle = ledCore;
        faceCtx.lineWidth = 4;
        faceCtx.beginPath();
        faceCtx.moveTo(mouthX - 40, mouthY - 2);
        faceCtx.quadraticCurveTo(mouthX, mouthY + 30, mouthX + 40, mouthY - 2);
        faceCtx.stroke();
      } else if (curEmotion === 'thinking') {
        // Small cute circle 'o'
        faceCtx.strokeStyle = ledPrimary;
        faceCtx.lineWidth = 9;
        faceCtx.beginPath();
        faceCtx.ellipse(mouthX, mouthY + 4, 12, 14, 0, 0, Math.PI * 2);
        faceCtx.stroke();

        faceCtx.strokeStyle = ledCore;
        faceCtx.lineWidth = 4;
        faceCtx.beginPath();
        faceCtx.ellipse(mouthX, mouthY + 4, 8, 10, 0, 0, Math.PI * 2);
        faceCtx.stroke();
      } else if (curEmotion === 'confused') {
        // Wavy LED Smile '~'
        faceCtx.strokeStyle = ledPrimary;
        faceCtx.lineWidth = 9;
        faceCtx.beginPath();
        faceCtx.moveTo(mouthX - 32, mouthY);
        faceCtx.quadraticCurveTo(mouthX - 16, mouthY - 10, mouthX, mouthY);
        faceCtx.quadraticCurveTo(mouthX + 16, mouthY + 10, mouthX + 32, mouthY - 2);
        faceCtx.stroke();

        faceCtx.strokeStyle = ledCore;
        faceCtx.lineWidth = 4;
        faceCtx.beginPath();
        faceCtx.moveTo(mouthX - 26, mouthY);
        faceCtx.quadraticCurveTo(mouthX - 14, mouthY - 8, mouthX, mouthY);
        faceCtx.quadraticCurveTo(mouthX + 14, mouthY + 8, mouthX + 26, mouthY - 2);
        faceCtx.stroke();
      } else if (curEmotion === 'shakeHead') {
        // Straight LED Dash
        faceCtx.strokeStyle = ledPrimary;
        faceCtx.lineWidth = 9;
        faceCtx.beginPath();
        faceCtx.moveTo(mouthX - 28, mouthY + 2);
        faceCtx.lineTo(mouthX + 28, mouthY + 2);
        faceCtx.stroke();

        faceCtx.strokeStyle = ledCore;
        faceCtx.lineWidth = 4;
        faceCtx.beginPath();
        faceCtx.moveTo(mouthX - 22, mouthY + 2);
        faceCtx.lineTo(mouthX + 22, mouthY + 2);
        faceCtx.stroke();
      } else if (curEmotion === 'sad') {
        // Downward curved LED arc (︵)
        faceCtx.strokeStyle = ledPrimary;
        faceCtx.lineWidth = 9;
        faceCtx.beginPath();
        faceCtx.arc(mouthX, mouthY + 20, 28, Math.PI * 1.25, Math.PI * 1.75, false);
        faceCtx.stroke();

        faceCtx.strokeStyle = ledCore;
        faceCtx.lineWidth = 4;
        faceCtx.beginPath();
        faceCtx.arc(mouthX, mouthY + 20, 28, Math.PI * 1.28, Math.PI * 1.72, false);
        faceCtx.stroke();
      } else {
        // Default / Idle: Sweet Glowing Curved LED Smile (︶)
        faceCtx.strokeStyle = ledPrimary;
        faceCtx.lineWidth = 10;
        faceCtx.beginPath();
        faceCtx.arc(mouthX, mouthY - 8, 38, Math.PI * 0.22, Math.PI * 0.78, false);
        faceCtx.stroke();

        faceCtx.strokeStyle = ledCore;
        faceCtx.lineWidth = 4;
        faceCtx.beginPath();
        faceCtx.arc(mouthX, mouthY - 8, 38, Math.PI * 0.25, Math.PI * 0.75, false);
        faceCtx.stroke();
      }
      faceCtx.restore();

      // --- 3. DIGITAL LED BLUSH PILLS ON CHEEKS ---
      const drawBlushPills = (cx: number, cy: number) => {
        faceCtx.save();
        faceCtx.shadowColor = ledPrimary;
        faceCtx.shadowBlur = 14;
        faceCtx.fillStyle = 'rgba(0, 247, 255, 0.45)';
        for (let i = -1; i <= 1; i++) {
          faceCtx.beginPath();
          faceCtx.ellipse(cx + i * 11, cy + i * 3, 3.5, 6, 0.2, 0, Math.PI * 2);
          faceCtx.fill();
        }
        faceCtx.restore();
      };
      drawBlushPills(leftEyeX - 28, eyeY + 80);
      drawBlushPills(rightEyeX + 28, eyeY + 80);

      faceTexture.needsUpdate = true;
    };

    // =========================================================
    // 7. ANIMATION LOOP (Hovering, Head Float, Wing Flaps)
    // =========================================================
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Mouse Lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      const curEmotion = emotionRef.current;
      const thinking = isThinkingRef.current;
      const listening = isListeningRef.current;

      // 1. Anti-Gravity Floating Motion
      const floatY = Math.sin(elapsed * 2.2) * 0.06;
      robotRoot.position.y = 0.05 + floatY;
      torsoGroup.rotation.z = Math.sin(elapsed * 1.5) * 0.02;

      // 2. Head Independent Levitation & Tilt
      headGroup.position.y = 0.82 + Math.sin(elapsed * 2.2 + 0.8) * 0.02;

      let targetHeadRotY = mouseRef.current.x * 0.35;
      let targetHeadRotX = -mouseRef.current.y * 0.24;
      let targetHeadRotZ = 0;

      if (thinking) {
        targetHeadRotZ = -0.16;
        targetHeadRotY = -0.22;
        targetHeadRotX = -0.12;
      } else if (listening) {
        targetHeadRotZ = 0.12;
        targetHeadRotY = 0.28;
      } else if (curEmotion === 'confused') {
        targetHeadRotZ = 0.26;
        targetHeadRotY = 0.12;
      } else if (curEmotion === 'shakeHead') {
        targetHeadRotY = Math.sin(elapsed * 14) * 0.35;
      } else if (curEmotion === 'sad') {
        targetHeadRotX = 0.22;
      } else if (curEmotion === 'happy' || curEmotion === 'laughing') {
        targetHeadRotZ = Math.sin(elapsed * 6.5) * 0.08;
      }

      headGroup.rotation.y += (targetHeadRotY - headGroup.rotation.y) * 0.1;
      headGroup.rotation.x += (targetHeadRotX - headGroup.rotation.x) * 0.1;
      headGroup.rotation.z += (targetHeadRotZ - headGroup.rotation.z) * 0.1;

      // 3. Wing Arms Gestures
      rightArmPivot.position.y = 0.16 + Math.sin(elapsed * 2.2 - 0.5) * 0.02;
      leftArmPivot.position.y = 0.16 + Math.sin(elapsed * 2.2 - 0.5) * 0.02;

      let targetRightArmZ = -0.12 + Math.sin(elapsed * 1.8) * 0.03;
      let targetLeftArmZ = 0.12;
      let targetLeftArmX = 0;
      let targetLeftArmY = 0;

      if (curEmotion === 'greeting' || curEmotion === 'goodbye') {
        targetLeftArmZ = 1.35;
        targetLeftArmX = -0.3;
        targetLeftArmY = 0.35 + Math.sin(elapsed * 9) * 0.35;
      } else if (thinking) {
        targetLeftArmZ = 0.88;
        targetLeftArmX = 0.55;
        targetLeftArmY = -0.35;
      } else if (curEmotion === 'explaining') {
        targetLeftArmZ = 0.72;
        targetLeftArmX = -0.28 + Math.sin(elapsed * 2.5) * 0.06;
        targetLeftArmY = 0.42;
      } else if (curEmotion === 'happy' || curEmotion === 'laughing') {
        targetLeftArmZ = 0.52 + Math.sin(elapsed * 7) * 0.2;
        targetRightArmZ = -0.52 - Math.sin(elapsed * 7) * 0.2;
      } else if (listening) {
        targetLeftArmZ = 0.32;
        targetLeftArmX = 0.12;
      } else {
        targetLeftArmZ = 0.16 + Math.sin(elapsed * 2.2) * 0.04;
      }

      leftArmPivot.rotation.z += (targetLeftArmZ - leftArmPivot.rotation.z) * 0.1;
      leftArmPivot.rotation.x += (targetLeftArmX - leftArmPivot.rotation.x) * 0.1;
      leftArmPivot.rotation.y += (targetLeftArmY - leftArmPivot.rotation.y) * 0.1;

      rightArmPivot.rotation.z += (targetRightArmZ - rightArmPivot.rotation.z) * 0.1;

      // 4. Update Dynamic LED Face
      renderLedFace(delta, elapsed);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      faceTexture.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      onClick={onRobotClick}
      className="relative w-full h-full min-h-[420px] lg:min-h-[560px] cursor-pointer select-none flex items-center justify-center overflow-hidden"
      title="Nhấn vào tôi để tương tác hoặc xem biểu cảm!"
    />
  );
};
