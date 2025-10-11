// src/components/Scene360.jsx

import { Canvas } from '@react-three/fiber';
import { useTexture, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Hotspot from './Hotspot';

function Sphere({ textureUrl }) {
  const texture = useTexture(textureUrl);
  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

export default function Scene360({ imageUrl, hotspots = [], onNavigate }) {
  return (
    <Canvas camera={{ position: [0, 0, 0.1] }}>
      <Sphere textureUrl={imageUrl} />
      <OrbitControls enableZoom={false} rotateSpeed={-0.5} />

      {/* --- ALTERAÇÃO AQUI --- */}
      {/* Mapeia os hotspots passando apenas as props necessárias para a nova seta */}
      {hotspots.map((spot) => (
        <Hotspot
          key={spot.leadsTo}
          position={spot.position}
          rotation={spot.rotation}
          onClick={() => onNavigate(spot.leadsTo)}
        />
      ))}
    </Canvas>
  );
}