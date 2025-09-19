import { Canvas } from '@react-three/fiber';
import { useTexture, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Hotspot from './Hotspot.jsx'; // Importe o novo componente

function Sphere({ textureUrl }) {
  const texture = useTexture(textureUrl);
  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

// O componente agora aceita 'hotspots' e uma função 'onNavigate'
export default function Scene360({ imageUrl, hotspots = [], onNavigate }) {
  return (
    <Canvas camera={{ position: [0, 0, 0.1] }}>
      <Sphere textureUrl={imageUrl} />
      <OrbitControls enableZoom={false} rotateSpeed={-0.5} />

      {hotspots.map((spot) => (
        <Hotspot
          key={spot.leadsTo}
          position={spot.position}
          onClick={() => onNavigate(spot.leadsTo)}
        />
      ))}
    </Canvas>
  );
}