// src/components/Hotspot.jsx

import React, { useState } from 'react';
import { useCursor } from '@react-three/drei';
import { a, useSpring } from '@react-spring/three';

export default function Hotspot({ position, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  useCursor(isHovered);

  const { scale } = useSpring({
    scale: isHovered ? 1.5 : 1,
    config: { tension: 400, friction: 30 },
  });

  return (
    <a.group
      position={position}
      onClick={onClick}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      scale={scale}
    >
      {/* Anel externo do hotspot */}
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.7, 0.8, 32]} />
        <meshBasicMaterial color="red" transparent opacity={0.8} />
      </mesh>

      {/* Círculo interno do hotspot */}
      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color="red" transparent opacity={0.6} />
      </mesh>
    </a.group>
  );
}