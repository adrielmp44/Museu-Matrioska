// src/App.jsx

import React from 'react';
import YouTube from 'react-youtube';
import MenuScreen from './components/MenuScreen';
import Scene360 from './components/Scene360';
import './App.css';

// Importações de imagens e assets
import local1Img from './assets/fotos_museu/Local 1.jpg';
import local2Img from './assets/fotos_museu/Local 2.jpg';
import local3Img from './assets/fotos_museu/Local 3.jpg';
import local4Img from './assets/fotos_museu/Local 4.jpg';
import local5Img from './assets/fotos_museu/Local 5.jpg';
import local6Img from './assets/fotos_museu/Local 6.jpg';
import icone_som from './assets/logo_matrioska/icone_som.png';

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
    { position: [-5, -7, -5], leadsTo: 'local2', rotation: [0, 3.1, 0] },
  ],
  local2: [
    { position: [18, -7, -1], leadsTo: 'local1', rotation: [0, 1.6, 0] },
    { position: [9, -7, 6], leadsTo: 'local3', rotation: [0, 0, 0] },
  ],
  local3: [
    { position: [14, -7, 1], leadsTo: 'local4', rotation: [0, 1.5, 0] },
    { position: [11, -7, -6], leadsTo: 'local2', rotation: [0, 3, 0] },
  ],
  local4: [
    { position: [6, -7, 3], leadsTo: 'local5', rotation: [0, 1.5 , 0] },
    { position: [-1, -7, 8], leadsTo: 'local3', rotaticxon: [0, 0, 0] },
  ],
  local5: [
    { position: [-1, -7, 8], leadsTo: 'local4', rotation: [0, 0, 0] },
  ],
};

const SharedOverlay = ({ children }) => ( <div className="overlay-container">{children}</div> );
const MapViewContent = ({ onSelect, onBack }) => ( <div className="overlay-content"> <h2>MAPA DO MUSEU</h2> <p>Selecione um local para visitar:</p> <div className="map-buttons"> {Object.keys(images).map((key) => ( <button key={key} onClick={() => onSelect(key)}> {key.charAt(0).toUpperCase() + key.slice(1).replace('l', 'l ')} </button> ))} </div> <button className="back-button" onClick={onBack}> Voltar ao Menu </button> </div> );
const CreditsViewContent = ({ onBack }) => ( <div className="overlay-content"> <h2>CRÉDITOS</h2> <p>Este tour virtual foi desenvolvido pelos bolsistas pepequers.</p> <br /> <p>Agradecimentos especiais ao museu.</p> <button className="back-button" onClick={onBack}> Voltar ao Menu </button> </div> );

export default function App() {
  const [view, setView] = React.useState('menu');
  const [currentSceneKey, setCurrentSceneKey] = React.useState('local1');
  const [player, setPlayer] = React.useState(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [hasInteracted, setHasInteracted] = React.useState(false);
  const [volume, setVolume] = React.useState(50);
  const videoId = 'CvL55F4GdZM';
  const youtubeOptions = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
      loop: 1,
      playlist: videoId,
      controls: 0,
    },
  };

  const onPlayerReady = (event) => {
    setPlayer(event.target);
    event.target.setVolume(volume);
  };

  const handleFirstInteraction = () => {
    if (player && !hasInteracted) {
      player.playVideo();
      setIsPlaying(true);
      setHasInteracted(true);
    }
  };
  
  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
      setIsPlaying(false);
    } else {
      player.playVideo();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = Number(event.target.value);
    setVolume(newVolume);
    if (player) player.setVolume(newVolume);
  };
  
  const handleStart = () => { handleFirstInteraction(); setCurrentSceneKey('local1'); setView('tour'); };
  const handleSceneSelect = (sceneKey) => { handleFirstInteraction(); setCurrentSceneKey(sceneKey); setView('tour'); };
  const handleMapClick = () => { handleFirstInteraction(); setView('map'); };
  const handleCreditsClick = () => { handleFirstInteraction(); setView('credits'); };
  const handleBackToMenu = () => setView('menu');

  const renderView = () => {
    switch (view) {
      case 'tour': return ( <div className="tour-container"> <Scene360 imageUrl={images[currentSceneKey]} hotspots={navigationData[currentSceneKey] || []} onNavigate={handleSceneSelect} /> <button className="back-button tour-back-button" onClick={handleBackToMenu}> Voltar ao Menu </button> </div> );
      case 'map': return ( <SharedOverlay> <MapViewContent onSelect={handleSceneSelect} onBack={handleBackToMenu} /> </SharedOverlay> );
      case 'credits': return ( <SharedOverlay> <CreditsViewContent onBack={handleBackToMenu} /> </SharedOverlay> );
      default: return <MenuScreen onStart={handleStart} onMap={handleMapClick} onCredits={handleCreditsClick} />;
    }
  };

  return (
    <>
      <YouTube videoId={videoId} opts={youtubeOptions} onReady={onPlayerReady} style={{ display: 'none' }} />
      {renderView()}
      <div className="audio-controls">
        <img src={icone_som} alt="Ícone de som" className={`sound-icon ${!isPlaying ? 'paused' : ''}`} onClick={togglePlay} />
        <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange} className="volume-slider" />
      </div>
    </>
  );
}