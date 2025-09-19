import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import './MenuScreen.css'; // Não se esqueça de criar este arquivo CSS


import backgroundMenuImage from '../assets/fotos_museu/Local 4.jpg'; // Você pode escolher qualquer uma, to pensando em fazer algo que fique aleatorio toda vida que a página entre, mas só se sobrar tempo

function RotatingSphere({ textureUrl }) {
  const texture = useTexture(textureUrl);
  const sphereRef = React.useRef();

  //velocidade que gira, se aumentar fica muito doido

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += .0005;
    }
  });

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

export default function MenuScreen({ onStart, onMap, onCredits }) {
  return (
    <div className="menu-container">
      <div className="background-canvas">
        <Canvas>
          <RotatingSphere textureUrl={backgroundMenuImage} />
        </Canvas>
      </div>
      <div className="menu-overlay">
        <h1>Museu Matrioska</h1>
        <h2>em memórias de Jacinto de Sousa</h2>
        <div className="menu-buttons">
          <button onClick={onStart}>COMEÇAR</button>
          <button onClick={onMap}>MAPA</button>
          <button onClick={onCredits}>CRÉDITOS</button>
        </div>
      </div>
    </div>
  );
}