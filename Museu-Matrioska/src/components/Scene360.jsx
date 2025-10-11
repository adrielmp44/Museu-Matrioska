import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useTexture, OrbitControls, DeviceOrientationControls } from '@react-three/drei';
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
  // Verifica se o dispositivo é móvel
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  return (
    <Canvas camera={{ position: [0, 0, 0.1] }}>
      <Sphere textureUrl={imageUrl} />

      {/* Renderiza os controles com base no dispositivo */}
      {isMobile ? (
        <DeviceOrientationControls />
      ) : (
        <OrbitControls enableZoom={false} rotateSpeed={-0.5} />
      )}

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