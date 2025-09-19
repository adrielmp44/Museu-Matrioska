import React, { useState } from 'react';
import MenuScreen from './components/MenuScreen';
import Scene360 from './components/Scene360';
import './App.css';

import local1Img from './assets/fotos_museu/Local 1.jpg';
import local2Img from './assets/fotos_museu/Local 2.jpg';
import local3Img from './assets/fotos_museu/Local 3.jpg';
import local4Img from './assets/fotos_museu/Local 4.jpg';
import local5Img from './assets/fotos_museu/Local 5.jpg';
import local6Img from './assets/fotos_museu/Local 6.jpg';

const images = {
  local1: local1Img,
  local2: local2Img,
  local3: local3Img,
  local4: local4Img,
  local5: local5Img,
  local6: local6Img,
};

// =======================================================
// == MAPA DE NAVEGAÇÃO DOS HOTSPOTS ==
// =======================================================

const navigationData = {
  local1: [
    { position: [-4, -5, -6.5], leadsTo: 'local2' },
    { position: [-15, 0.19, 0], leadsTo: 'local3' },
  ],
  local2: [
    { position: [10, -5, 15], leadsTo: 'local1' },
  ],
  local3: [
    { position: [0, -4, -15], leadsTo: 'local1' },
    { position: [20, -5, 0], leadsTo: 'local4' },
  ],
  local4: [
    { position: [-15, -4, 0], leadsTo: 'local3' },
    { position: [10, -4.5, 10], leadsTo: 'local5' }, // <--- MODIFICADO para levar ao local 5
  ],
  local5: [ // <--- ADICIONADO
    { position: [-10, -5, -12], leadsTo: 'local4' }, // Volta para o local 4
    { position: [15, -5, 8], leadsTo: 'local6' },   // Vai para o local 6
  ],
  local6: [ // <--- ADICIONADO
    { position: [0, -4, 18], leadsTo: 'local5' }, // Volta para o local 5
  ],
};


export default function App() {
  const [view, setView] = useState('menu');
  const [currentSceneKey, setCurrentSceneKey] = useState('local1');

  const handleStart = () => {
    setCurrentSceneKey('local1');
    setView('tour');
  };

  const handleSceneSelect = (sceneKey) => {
    setCurrentSceneKey(sceneKey);
    setView('tour');
  };
  
  const handleBackToMenu = () => {
    setView('menu');
  };

  const MapView = () => (
    <div className="overlay-container">
      <div className="overlay-content">
        <h2>MAPA DO MUSEU</h2>
        <p>Selecione um local para visitar:</p>
        <div className="map-buttons">
            {Object.keys(images).map((key) => (
                <button key={key} onClick={() => handleSceneSelect(key)}>
                    {key.charAt(0).toUpperCase() + key.slice(1).replace('l', 'l ')}
                </button>
            ))}
        </div>
        <button className="back-button" onClick={handleBackToMenu}>Voltar ao Menu</button>
      </div>
    </div>
  );

  const CreditsView = () => (
    <div className="overlay-container">
       <div className="overlay-content">
        <h2>CRÉDITOS</h2>
        <p>Este tour virtual foi desenvolvido pelos:</p>
        <p>bolsistas pepequers</p>
        <br />
        <p>Agradecimentos especiais ao museu.</p>
        <button className="back-button" onClick={handleBackToMenu}>Voltar ao Menu</button>
      </div>
    </div>
  );

  if (view === 'menu') {
    return (
      <MenuScreen
        onStart={handleStart}
        onMap={() => setView('map')}
        onCredits={() => setView('credits')}
      />
    );
  }

  if (view === 'tour') {
    return (
      <div className="tour-container"> 
        <Scene360 
          imageUrl={images[currentSceneKey]}
          hotspots={navigationData[currentSceneKey] || []} // Passa os hotspots da cena atual
          onNavigate={handleSceneSelect} // Passa a função de navegação
        />
        <button className="back-button tour-back-button" onClick={handleBackToMenu}>
          Voltar ao Menu
        </button>
      </div>
    );
  }

  if (view === 'map') {
    return <MapView />;
  }

  if (view === 'credits') {
    return <CreditsView />;
  }

  return null;
}