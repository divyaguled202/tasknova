import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Individual glowing floating orb
function FloatingOrb({
  position,
  color,
  speed = 1.5,
  distort = 0.3,
  radius = 1,
  emissiveIntensity = 0.6,
}) {
  const meshRef = useRef(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(t * 0.3 * speed) * 0.2;
    meshRef.current.rotation.y = Math.cos(t * 0.2 * speed) * 0.3;
  });

  return (
    <Float
      speed={speed}
      rotationIntensity={1.2}
      floatIntensity={2}
      floatingRange={[-0.3, 0.3]}
      position={position}
    >
      <Sphere ref={meshRef} args={[radius, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={speed * 1.5}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.85}
        />
      </Sphere>
    </Float>
  );
}

// Glowing wireframe torus / ring for high-tech SaaS vibe
function FloatingRing({
  position,
  color,
  radius = 2,
  tube = 0.05,
  speed = 0.8,
}) {
  const ref = useRef(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * speed;
    ref.current.rotation.x = t * 0.4;
    ref.current.rotation.y = t * 0.6;
    ref.current.rotation.z = Math.sin(t * 0.2) * 0.5;
  });

  return (
    <Float speed={speed * 1.2} rotationIntensity={1.5} floatIntensity={1.5} position={position}>
      <mesh ref={ref}>
        <torusGeometry args={[radius, tube, 16, 60]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          wireframe
          transparent
          opacity={0.45}
        />
      </mesh>
    </Float>
  );
}

// Interactive Scene with mouse parallax
function Scene() {
  const sceneGroup = useRef(null);

  useFrame((state) => {
    if (!sceneGroup.current) return;
    // Gentle mouse parallax
    const targetX = state.pointer.x * 0.8;
    const targetY = state.pointer.y * 0.8;
    sceneGroup.current.rotation.y = THREE.MathUtils.lerp(sceneGroup.current.rotation.y, targetX * 0.15, 0.05);
    sceneGroup.current.rotation.x = THREE.MathUtils.lerp(sceneGroup.current.rotation.x, -targetY * 0.15, 0.05);
  });

  return (
    <group ref={sceneGroup}>
      {/* Dynamic studio lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#c084fc" />
      <pointLight position={[-8, -5, -4]} intensity={2.5} color="#8b5cf6" distance={25} />
      <pointLight position={[8, 6, -3]} intensity={2.8} color="#06b6d4" distance={25} />
      <pointLight position={[0, -8, 2]} intensity={2.0} color="#ec4899" distance={20} />

      {/* Floating 3D Glowing Spheres */}
      <FloatingOrb position={[-3.8, 2.2, -2]} color="#8b5cf6" radius={1.4} speed={1.2} distort={0.4} emissiveIntensity={0.8} />
      <FloatingOrb position={[4.2, -1.8, -3]} color="#06b6d4" radius={1.6} speed={0.9} distort={0.3} emissiveIntensity={0.7} />
      <FloatingOrb position={[3.5, 2.5, -4]} color="#ec4899" radius={1.1} speed={1.5} distort={0.5} emissiveIntensity={0.9} />
      <FloatingOrb position={[-2.5, -3.2, -3.5]} color="#6366f1" radius={1.3} speed={1.1} distort={0.35} emissiveIntensity={0.6} />
      <FloatingOrb position={[0.2, 3.8, -5]} color="#a855f7" radius={0.9} speed={1.8} distort={0.45} emissiveIntensity={0.9} />

      {/* Tech Rings */}
      <FloatingRing position={[-3.8, 2.2, -2]} color="#c084fc" radius={2.2} tube={0.03} speed={0.7} />
      <FloatingRing position={[4.2, -1.8, -3]} color="#22d3ee" radius={2.5} tube={0.04} speed={0.6} />
      <FloatingRing position={[-1.2, -1.5, -4]} color="#f472b6" radius={1.8} tube={0.03} speed={0.9} />

      {/* 3D Starfield & Dust */}
      <Stars radius={50} depth={50} count={1200} factor={4} saturation={0.5} fade speed={1} />
    </group>
  );
}

export function ThreeBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-br from-[#06040d] via-[#0e0a22] to-[#150a2e]">
      {/* Atmospheric radial glows */}
      <div className="absolute -top-40 -left-40 w-[650px] h-[650px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Scene />
      </Canvas>

      {/* Fine-grain noise overlay for filmic SaaS look */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}
