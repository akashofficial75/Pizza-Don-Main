import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, MeshDistortMaterial, Sparkles, Html } from '@react-three/drei';
import * as THREE from 'three';

// Procedural 3D Pizza slice / whole pie with toppings and melting cheese glow
function PizzaMesh({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const cheeseRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle continuous rotation
      groupRef.current.rotation.y += delta * 0.35;
      // Slight interactive tilt based on mouse pointer
      const targetX = (state.pointer.y * Math.PI) / 12;
      const targetZ = -(state.pointer.x * Math.PI) / 12;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.4 + targetX, 0.05);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetZ, 0.05);
    }
  });

  // Generate toppings positions on the pizza pie
  const toppings = useMemo(() => {
    const items: { x: number; y: number; z: number; type: 'pepperoni' | 'olive' | 'basil' | 'mushroom' }[] = [];
    const types: ('pepperoni' | 'olive' | 'basil' | 'mushroom')[] = ['pepperoni', 'pepperoni', 'olive', 'basil', 'mushroom', 'pepperoni', 'basil'];
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const radius = 0.5 + Math.random() * 1.4;
      items.push({
        x: Math.cos(angle) * radius,
        y: 0.22 + Math.random() * 0.06,
        z: Math.sin(angle) * radius,
        type: types[i % types.length]
      });
    }
    return items;
  }, []);

  return (
    <group ref={groupRef} scale={isHovered ? 1.08 : 1.0}>
      {/* Golden Crust Base (Torus for rim + Cylinder for center) */}
      <mesh rotation={[0, 0, 0]} position={[0, 0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.3, 2.2, 0.3, 48]} />
        <meshStandardMaterial
          color="#C68A48"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Fluffy Outer Crust Rim */}
      <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.25, 0.25, 24, 48]} />
        <meshStandardMaterial
          color="#B87834"
          roughness={0.8}
        />
      </mesh>

      {/* Tomato Sauce Layer */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[2.08, 2.08, 0.04, 48]} />
        <meshStandardMaterial
          color="#9C1B22"
          roughness={0.6}
        />
      </mesh>

      {/* Golden Melted Cheese Layer with subtle distortion */}
      <mesh ref={cheeseRef} position={[0, 0.21, 0]}>
        <cylinderGeometry args={[1.98, 1.98, 0.05, 48]} />
        <MeshDistortMaterial
          color="#F6C852"
          roughness={0.4}
          metalness={0.1}
          distort={0.15}
          speed={1.2}
        />
      </mesh>

      {/* Toppings */}
      {toppings.map((top, idx) => {
        if (top.type === 'pepperoni') {
          return (
            <mesh key={idx} position={[top.x, top.y, top.z]} rotation={[Math.random() * 0.2, Math.random() * Math.PI, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 0.03, 24]} />
              <meshStandardMaterial color="#A82024" roughness={0.5} />
            </mesh>
          );
        }
        if (top.type === 'olive') {
          return (
            <mesh key={idx} position={[top.x, top.y, top.z]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.12, 0.05, 12, 24]} />
              <meshStandardMaterial color="#262822" roughness={0.3} />
            </mesh>
          );
        }
        if (top.type === 'basil') {
          return (
            <mesh key={idx} position={[top.x, top.y + 0.02, top.z]} rotation={[0.2, Math.random() * Math.PI, 0.1]} scale={[1, 0.2, 0.6]}>
              <sphereGeometry args={[0.2, 16, 8]} />
              <meshStandardMaterial color="#2A5C28" roughness={0.6} />
            </mesh>
          );
        }
        return (
          <mesh key={idx} position={[top.x, top.y, top.z]}>
            <boxGeometry args={[0.25, 0.08, 0.2]} />
            <meshStandardMaterial color="#D8CBA8" roughness={0.7} />
          </mesh>
        );
      })}

      {/* Golden Aura Glow under the pizza */}
      <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.0, 3.8, 48]} />
        <meshBasicMaterial color="#D4A017" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// Floating ingredients around the Pizza pie
function FloatingIngredients() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y -= delta * 0.15;
    }
  });

  const floaters = [
    { pos: [-3.2, 1.8, -1.0], color: '#A82024', type: 'tomato', size: 0.38 },
    { pos: [3.4, 1.2, 0.8], color: '#2A5C28', type: 'basil', size: 0.42 },
    { pos: [2.8, -1.6, 1.2], color: '#D4A017', type: 'goldleaf', size: 0.35 },
    { pos: [-2.9, -1.3, 0.5], color: '#2A5C28', type: 'basil', size: 0.32 },
    { pos: [0.8, 2.7, -1.5], color: '#8F1E22', type: 'pepperoni', size: 0.4 },
    { pos: [-1.8, 2.5, 0.6], color: '#262822', type: 'olive', size: 0.3 },
  ];

  return (
    <group ref={group}>
      {floaters.map((item, i) => (
        <Float key={i} speed={2.5} rotationIntensity={3.0} floatIntensity={1.8}>
          <mesh position={item.pos as [number, number, number]}>
            {item.type === 'basil' ? (
              <dodecahedronGeometry args={[item.size, 1]} />
            ) : item.type === 'olive' ? (
              <torusGeometry args={[item.size * 0.7, item.size * 0.3, 12, 24]} />
            ) : (
              <sphereGeometry args={[item.size, 24, 24]} />
            )}
            <meshStandardMaterial
              color={item.color}
              roughness={0.4}
              metalness={item.type === 'goldleaf' ? 0.8 : 0.1}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function HeroPizza3D() {
  const [isHovered, setIsHovered] = useState(false);
  const [webglError, setWebglError] = useState(false);

  if (webglError) {
    return (
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-red-600/10 rounded-full blur-3xl" />
        <img
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop"
          alt="Pizza Don Supreme"
          className="w-72 h-72 sm:w-96 sm:h-96 object-cover rounded-full border-4 border-amber-500/40 shadow-[0_0_60px_rgba(212,160,23,0.35)] animate-spin-slow"
          style={{ animationDuration: '40s' }}
        />
      </div>
    );
  }

  return (
    <div
      className="w-full h-[400px] sm:h-[480px] md:h-[540px] relative cursor-grab active:cursor-grabbing select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background radial gold glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 h-80 sm:w-96 sm:h-96 bg-amber-500/15 rounded-full blur-[80px]" />
      </div>

      <Canvas
        camera={{ position: [0, 3.8, 5.5], fov: 48 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => setWebglError(false)}
        onError={() => setWebglError(true)}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 15, 10]} intensity={1.8} castShadow color="#FFF6D8" />
        <pointLight position={[-8, -5, -8]} intensity={1.2} color="#D4A017" />
        <pointLight position={[0, 8, 0]} intensity={1.5} color="#F6C852" />

        {/* Cinematic Golden Sparkles / Steam wisps around pizza */}
        <Sparkles
          count={45}
          scale={[8, 5, 8]}
          size={4}
          speed={0.6}
          opacity={0.6}
          color="#D4A017"
        />

        <PizzaMesh isHovered={isHovered} />
        <FloatingIngredients />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 4}
          rotateSpeed={0.5}
        />
      </Canvas>

      {/* Interactive badge overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 border border-amber-500/30 backdrop-blur-md text-xs text-amber-300">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        <span>3D Interactive • Drag to Rotate</span>
      </div>
    </div>
  );
}
