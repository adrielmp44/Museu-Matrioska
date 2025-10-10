// src/components/MenuScreen.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import './MenuScreen.css';

// Caminhos relativos para os assets
import backgroundMenuImage1 from '../assets/fotos_museu/Local 1.jpg';
import backgroundMenuImage2 from '../assets/fotos_museu/Local 2.jpg';
import logo from '../assets/logo_matrioska/Logo-Matrioska.png';

// 1. IMPORTAÇÃO DE TODOS OS LOGOS DO SITE
import logoAzul from '../assets/logo_site/Fundo_Azul.png';
import logoAzulBB from '../assets/logo_site/Fundo_AzulBB.png';
import logoLaranja from '../assets/logo_site/Fundo_Laranja.png';
import logoPreto from '../assets/logo_site/Fundo_Preto.png';
import logoSalmao from '../assets/logo_site/Fundo_Salmão.png';
import logoVermelho from '../assets/logo_site/Fundo_Vermelho.png';

function RotatingSphere() {
  const textures = useTexture([backgroundMenuImage1, backgroundMenuImage2]);
  const sphereRef = useRef();
  const [activeTexture, setActiveTexture] = useState(textures[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * textures.length);
    setActiveTexture(textures[randomIndex]);
  }, [textures]);

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={activeTexture} side={THREE.BackSide} />
    </mesh>
  );
}

export default function MenuScreen({ onStart, onMap, onCredits }) {
  // 2. LÓGICA PARA SORTEAR O LOGO DO SITE
  const siteLogos = [logoAzul, logoAzulBB, logoLaranja, logoPreto, logoSalmao, logoVermelho];
  const [activeSiteLogo, setActiveSiteLogo] = useState(siteLogos[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * siteLogos.length);
    setActiveSiteLogo(siteLogos[randomIndex]);
  }, []); // Array vazio faz com que o sorteio ocorra apenas uma vez, ao carregar

  return (
    <div className="menu-container">
      <div className="background-canvas">
        <Canvas>
          <RotatingSphere />
        </Canvas>
      </div>

      <div className="menu-overlay">
        <img src={logo} alt="Logo Museu Matrioska" className="logo" />
        <div className="subtitle-container">
          <p>Experiência 360°: Museu Jacinto de Sousa</p>
        </div>
        <div className="menu-buttons">
          <button onClick={onStart}>Começar</button>
          <button onClick={onMap}>Mapa</button>
          <button onClick={onCredits}>Sobre</button>
        </div>
        <div className="footer-menu">
          <p>Em memória de Jacinto de Sousa</p>
        </div>

        <div className="site-logo-container">
          <img src={activeSiteLogo} alt="Logo do Museu" />
        </div>
      </div>
    </div>
  );
}