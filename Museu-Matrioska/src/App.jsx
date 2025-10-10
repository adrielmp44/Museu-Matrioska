// src/App.jsx

import React, { useState } from 'react';
import YouTube from 'react-youtube';
import MenuScreen from './components/MenuScreen'; // Caminho relativo
import Scene360 from './components/Scene360';     // Caminho relativo
import './App.css';

// Importações de imagens e assets com caminhos relativos
import local1Img from './assets/fotos_museu/Local 1.jpg';
import local2Img from './assets/fotos_museu/Local 2.jpg';
import local3Img from './assets/fotos_museu/Local 3.jpg';
import local4Img from './assets/fotos_museu/Local 4.jpg';
import local5Img from './assets/fotos_museu/Local 5.jpg';
import local6Img from './assets/fotos_museu/Local 6.jpg';
import icone_som from './assets/logo_matrioska/icone_som.png';

// --- DADOS DA APLICAÇÃO ---
const images = {
  local1: local1Img,
  local2: local2Img,
  local3: local3Img,
  local4: local4Img,
  local5: local5Img,
  local6: local6Img,
};

const navigationData = {
  local1: [
    { position: [-4, -5, -6.5], leadsTo: 'local2' },
    { position: [-15, 0.19, 0], leadsTo: 'local3' },
  ],
  local2: [{ position: [10, -5, 15], leadsTo: 'local1' }],
  local3: [
    { position: [0, -4, -15], leadsTo: 'local1' },
    { position: [20, -5, 0], leadsTo: 'local4' },
  ],
  local4: [
    { position: [-15, -4, 0], leadsTo: 'local3' },
    { position: [10, -4.5, 10], leadsTo: 'local5' },
  ],
  local5: [
    { position: [-10, -5, -12], leadsTo: 'local4' },
    { position: [15, -5, 8], leadsTo: 'local6' },
  ],
  local6: [{ position: [0, -4, 18], leadsTo: 'local5' }],
};

// --- COMPONENTES DE UI REUTILIZÁVEIS ---
const SharedOverlay = ({ children }) => (
  <>
    <div className="animated-background" style={{ backgroundImage: `url(${local4Img})` }} />
    <div className="overlay-container">{children}</div>
  </>
);

const MapViewContent = ({ onSelect, onBack }) => (
  <div className="overlay-content">
    <h2>MAPA DO MUSEU</h2>
    <p>Selecione um local para visitar:</p>
    <div className="map-buttons">
      {Object.keys(images).map((key) => (
        <button key={key} onClick={() => onSelect(key)}>
          {key.charAt(0).toUpperCase() + key.slice(1).replace('l', 'l ')}
        </button>
      ))}
    </div>
    <button className="back-button" onClick={onBack}>
      Voltar ao Menu
    </button>
  </div>
);

const CreditsViewContent = ({ onBack }) => (
  <div className="overlay-content">
    <h2>CRÉDITOS</h2>
    <p>Este tour virtual foi desenvolvido pelos bolsistas pepequers.</p>
    <br />
    <p>Agradecimentos especiais ao museu.</p>
    <button className="back-button" onClick={onBack}>
      Voltar ao Menu
    </button>
  </div>
);

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const [view, setView] = useState('menu');
  const [currentSceneKey, setCurrentSceneKey] = useState('local1');
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(50);

  const videoId = 'CvL55F4GdZM';
  const youtubeOptions = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
      loop: 1,
      playlist: videoId,
      controls: 0,
    },
  };

  const onPlayerReady = (event) => {
    setPlayer(event.target);
    event.target.setVolume(volume);
  };

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event) => {
    const newVolume = Number(event.target.value);
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume);
    }
  };

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

  const renderView = () => {
    switch (view) {
      case 'tour':
        return (
          <div className="tour-container">
            <Scene360
              imageUrl={images[currentSceneKey]}
              hotspots={navigationData[currentSceneKey] || []}
              onNavigate={handleSceneSelect}
            />
            <button className="back-button tour-back-button" onClick={handleBackToMenu}>
              Voltar ao Menu
            </button>
          </div>
        );
      case 'map':
        return (
          <SharedOverlay>
            <MapViewContent onSelect={handleSceneSelect} onBack={handleBackToMenu} />
          </SharedOverlay>
        );
      case 'credits':
        return (
          <SharedOverlay>
            <CreditsViewContent onBack={handleBackToMenu} />
          </SharedOverlay>
        );
      case 'menu':
      default:
        return <MenuScreen onStart={handleStart} onMap={() => setView('map')} onCredits={() => setView('credits')} />;
    }
  };

  return (
    <>
      <YouTube videoId={videoId} opts={youtubeOptions} onReady={onPlayerReady} style={{ display: 'none' }} />

      {renderView()}

      <div className="audio-controls">
        <img
          src={icone_som}
          alt="Ícone de som"
          className={`sound-icon ${!isPlaying ? 'paused' : ''}`}
          onClick={togglePlay}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
      </div>
    </>
  );
}