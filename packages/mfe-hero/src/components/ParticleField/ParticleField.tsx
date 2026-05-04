import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { sampleTextPositions } from './textSampler';
import { gsap } from 'gsap';

const PARTICLE_COUNT = 4000;
const CYAN = new THREE.Color('#00D9C0');
const BLUE = new THREE.Color('#0099FF');

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // ── Scene setup ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;

    // ── Geometry ─────────────────────────────────────────────────
    const geometry = new THREE.BufferGeometry();
    const targetPositions = sampleTextPositions('CRISTIAN MARIN', PARTICLE_COUNT);
    const currentPositions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    // Randomize starting positions (scatter from edges)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      currentPositions[i * 3 + 0] = (Math.random() - 0.5) * 30;
      currentPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      currentPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      const c = Math.random() > 0.5 ? CYAN : BLUE;
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // ── Animate particles toward text positions ───────────────────
    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    const obj = { progress: 0, opacity: 0 };

    gsap.to(obj, {
      progress: 1,
      opacity: 0.9,
      duration: 2.2,
      ease: 'power3.out',
      delay: 0.3,
      onUpdate() {
        material.opacity = obj.opacity;
        const p = obj.progress;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          posAttr.setX(i, currentPositions[i * 3] + (targetPositions[i * 3] - currentPositions[i * 3]) * p);
          posAttr.setY(i, currentPositions[i * 3 + 1] + (targetPositions[i * 3 + 1] - currentPositions[i * 3 + 1]) * p);
          posAttr.setZ(i, currentPositions[i * 3 + 2] * (1 - p));
        }
        posAttr.needsUpdate = true;
      },
    });

    // ── Mouse parallax ────────────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Drift animation after assembly ────────────────────────────
    let driftTime = 0;

    // ── Render loop ───────────────────────────────────────────────
    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      driftTime += 0.003;

      // Gentle drift after particles assembled
      if (obj.progress > 0.9) {
        const posArr = posAttr.array as Float32Array;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          posArr[i * 3 + 1] += Math.sin(driftTime + i * 0.01) * 0.0003;
        }
        posAttr.needsUpdate = true;
      }

      // Camera follows mouse with spring
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}
