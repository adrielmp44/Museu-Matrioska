import React, { useState, useEffect, Suspense } from 'react';
import YouTube from 'react-youtube';
import MenuScreen from './components/MenuScreen';
import Scene360 from './components/Scene360';
import { navigationData } from './data/navigationData'; // Importando dados externos
import './App.css';

// Importações de assets estáticos
import icone_som from './assets/logo_matrioska/icone_som.png';

// =====================================================================
// 1. CARREGAMENTO DAS FOTOS
// =====================================================================
const fotosGlob = import.meta.glob('./assets/fotos_museu/*.{jpg,jpeg,png,JPG,JPEG}', { eager: true });
const images = {};

Object.keys(fotosGlob).forEach((path) => {
  const match = path.match(/\/(\d+)\.(jpg|jpeg|png|JPG|JPEG)$/);
  if (match) {
    const number = parseInt(match[1], 10);
    images[`local${number}`] = fotosGlob[path].default;
  }
});

// Ordena chaves para o Mapa
const sortedKeys = Object.keys(images).sort((a, b) => {
  const numA = parseInt(a.replace('local', ''));
  const numB = parseInt(b.replace('local', ''));
  return numA - numB;
});

// Componentes Auxiliares
const MapViewContent = ({ onSelect, onBack }) => (
  <div className="overlay-container">
    <div className="overlay-content map-content">
      <h2>MAPA DO MUSEU</h2>
      <p>Locais disponíveis: {sortedKeys.length}</p>
      <div className="map-buttons">
        {sortedKeys.map((key) => (
          <button key={key} onClick={() => onSelect(key)}>
            {key.replace('local', 'Local ')}
          </button>
        ))}
      </div>
      <button className="back-button" onClick={onBack}> Voltar ao Menu </button>
    </div>
  </div>
);

const CreditsViewContent = ({ onBack }) => (
  <div className="overlay-container">
    <div className="overlay-content">
       <h2>CRÉDITOS</h2> 
       <p>Desenvolvido pelos bolsistas - PPCA - PROGRAMA DE PROMOÇÃO DA CULTURA ARTÍSTICA.</p> 
       <button className="back-button" onClick={onBack}> Voltar ao Menu </button> 
    </div>
  </div>
);

// =====================================================================
// APP PRINCIPAL
// =====================================================================
export default function App() {
  const [view, setView] = useState('menu');
  const [currentSceneKey, setCurrentSceneKey] = useState('local1');
  
  // Audio
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [volume, setVolume] = useState(50);

  // Giroscópio
  const [isGyroEnabled, setIsGyroEnabled] = useState(true);

  const currentImageUrl = images[currentSceneKey];
  const videoId = 'CvL55F4GdZM';
  const youtubeOptions = { height: '0', width: '0', playerVars: { autoplay: 0, loop: 1, playlist: videoId, controls: 0 } };

  const onPlayerReady = (event) => { setPlayer(event.target); event.target.setVolume(volume); };
  
  const toggleGyro = () => setIsGyroEnabled(!isGyroEnabled);

  const handleFirstInteraction = () => {
    if (player && !hasInteracted) {
      player.playVideo();
      setIsPlaying(true);
      setHasInteracted(true);
    }
  };

  const togglePlay = () => { if (player) { if (isPlaying) { player.pauseVideo(); setIsPlaying(false); } else { player.playVideo(); setIsPlaying(true); } } };
  const handleVolumeChange = (e) => { const vol = Number(e.target.value); setVolume(vol); if (player) player.setVolume(vol); };

  const handleStart = () => {
    handleFirstInteraction();
    const startScene = images['local1'] ? 'local1' : sortedKeys[0];
    
    if (!startScene) {
      alert("Nenhuma imagem encontrada! Verifique a pasta assets/fotos_museu.");
      return;
    }
    setCurrentSceneKey(startScene);
    setView('tour');
  };

  const handleSceneSelect = (key) => { handleFirstInteraction(); setCurrentSceneKey(key); setView('tour'); };
  
  // Renderização
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  return (
    <>
      <YouTube videoId={videoId} opts={youtubeOptions} onReady={onPlayerReady} style={{ display: 'none' }} />

      {view === 'menu' && (
        <MenuScreen 
          onStart={handleStart} 
          onMap={() => setView('map')} 
          onCredits={() => setView('credits')} 
        />
      )}

      {view === 'tour' && (
        <div className="tour-container">
          <Scene360
            imageUrl={currentImageUrl}
            hotspots={navigationData[currentSceneKey] || []}
            onNavigate={handleSceneSelect}
            gyroEnabled={isGyroEnabled}
          />
          <button className="back-button tour-back-button" onClick={() => setView('menu')}>
             Voltar ao Menu 
          </button>
        </div>
      )}

      {view === 'map' && <MapViewContent onSelect={(key) => { handleSceneSelect(key); }} onBack={() => setView('menu')} />}
      
      {view === 'credits' && <CreditsViewContent onBack={() => setView('menu')} />}

      {/* Controles Flutuantes */}
      <div className="audio-controls">
        <img src={icone_som} alt="Som" className={`sound-icon ${!isPlaying ? 'paused' : ''}`} onClick={togglePlay} />
        <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange} className="volume-slider" />
        
        {view === 'tour' && isMobile && (
          <button 
            className={`gyro-button ${isGyroEnabled ? 'active' : ''}`} 
            onClick={toggleGyro}
          >
            {isGyroEnabled ? 'Giro: ON' : 'Giro: OFF'}
          </button>
        )}
      </div>
    </>
  );
}