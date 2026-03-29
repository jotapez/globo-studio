'use client';

import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

// ─── types ────────────────────────────────────────────────────────────────────

export interface HeadSphereProps {
  /** Path to the texture served from /public */
  imageSrc?: string;
  /** Diameter of the rendered sphere in pixels */
  size?: number;
}

// ─── component ────────────────────────────────────────────────────────────────

export function HeadSphere({ imageSrc = '/world-map.jpg', size = 300 }: HeadSphereProps) {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const meshRef    = useRef<THREE.Mesh | null>(null);
  const frameRef   = useRef<number>(0);
  const prevPosRef = useRef({ x: 0, y: 0 });

  // ── Three.js scene ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 250;

    const geometry = new THREE.SphereGeometry(100, 64, 64);
    const texture  = new THREE.TextureLoader().load(imageSrc);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh     = new THREE.Mesh(geometry, material);
    mesh.rotation.y = 0.35;
    scene.add(mesh);
    meshRef.current = mesh;

    const tick = () => {
      frameRef.current = requestAnimationFrame(tick);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frameRef.current);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [imageSrc, size]);

  // ── click → fly to a random spot ───────────────────────────────────────────
  const handleClick = useCallback(() => {
    const wrap = wrapRef.current;
    const mesh = meshRef.current;
    if (!wrap || !mesh) return;

    const parent = (wrap.offsetParent as HTMLElement) ?? document.body;
    const maxX   = parent.clientWidth  - size;
    const maxY   = parent.clientHeight - size;

    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    const dist = Math.hypot(newX - prevPosRef.current.x, newY - prevPosRef.current.y);

    prevPosRef.current = { x: newX, y: newY };

    gsap.to(wrap,           { left: newX, top: newY, duration: 1.5, ease: 'power4.out' });
    gsap.to(mesh.rotation, { y: mesh.rotation.y + dist * 0.02, duration: 1.5, ease: 'power4.out' });
  }, [size]);

  return (
    <div
      ref={wrapRef}
      onClick={handleClick}
      style={{
        position:   'absolute',
        left:       0,
        top:        0,
        width:      size,
        height:     size,
        cursor:     'pointer',
        userSelect: 'none',
      }}
    >
      {/* circular mask so the sphere has no square corners */}
      <div style={{ borderRadius: '50%', overflow: 'hidden', width: size, height: size }}>
        <canvas
          ref={canvasRef}
          style={{ display: 'block', width: size, height: size }}
        />
      </div>

      {/* drop shadow */}
      <div
        aria-hidden="true"
        style={{
          position:     'absolute',
          bottom:       -(size * 0.07),
          left:         '50%',
          transform:    'translateX(-50%)',
          width:        size * 0.65,
          height:       size * 0.12,
          background:   'black',
          borderRadius: '50%',
          filter:       `blur(${size * 0.06}px)`,
          opacity:      0.35,
          mixBlendMode: 'multiply' as const,
          pointerEvents:'none',
        }}
      />
    </div>
  );
}
