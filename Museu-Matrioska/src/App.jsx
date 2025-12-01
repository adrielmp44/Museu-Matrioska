import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import MenuScreen from './components/MenuScreen';
import Scene360 from './components/Scene360';
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

const sortedKeys = Object.keys(images).sort((a, b) => {
  const numA = parseInt(a.replace('local', ''));
  const numB = parseInt(b.replace('local', ''));
  return numA - numB;
});

// =====================================================================
// 2. DADOS DE NAVEGAÇÃO (CORRIGIDO PARA APARECER NA TELA)
// =====================================================================
// Lógica:
// - IR (Next): Position [0, -2, -5] (Frente)
// - VOLTAR (Prev): Position [0, -2, 5] (Costas)

const navigationData = {
  local1: [
    { leadsTo: 'local2', position: [-7, -7, -2], rotation: [0, 4.7, 0] },
    { leadsTo: 'local5', position: [-1.5, -7, -5], rotation: [0, 3.1, 0] }
  ],
  local2: [
    { leadsTo: 'local1', position: [7, -7, -1], rotation: [0, -4.7, 0] },
    { leadsTo: 'local3', position: [-7, -7, -1], rotation: [0, 4.7, 0] }
  ],
  local3: [
    { leadsTo: 'local2', position: [4, -7, 0], rotation: [0, 1.7, 0] },
    { leadsTo: 'local4', position: [0, -7, -8], rotation: [0, 3, 0] }
  ],
  local4: [
    { leadsTo: 'local3', position: [0, -7, 5], rotation: [0, 0, 0] },
    { leadsTo: 'local6', position: [-6, -7, -1], rotation: [0, -1.5, 0] },
    { leadsTo: 'local13', position: [0, -7, -4], rotation: [0, -3.1, 0] },
    { leadsTo: 'local5', position: [8, -7, 0], rotation: [0, 1.6, 0] }
  ],
  local5: [
    { leadsTo: 'local1', position: [5, -7, -0], rotation: [0, 1.6, 0] },
    { leadsTo: 'local4', position: [0, -7, 10], rotation: [0, 0, 0] },
    { leadsTo: 'local16', position: [-10, -7, -0], rotation: [0, -1.6, 0] }
  ],
  local6: [
    { leadsTo: 'local5', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local5', position: [0, -7, -5], rotation: [0, 3.14, 0] }
  ],
  local7: [
    { leadsTo: 'local6', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local8', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local8: [
    { leadsTo: 'local7', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local9', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local9: [
    { leadsTo: 'local8', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local10', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local10: [
    { leadsTo: 'local9', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local11', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local11: [
    { leadsTo: 'local10', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local12', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local12: [
    { leadsTo: 'local11', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local13', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local13: [
    { leadsTo: 'local12', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local14', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local14: [
    { leadsTo: 'local13', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local15', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local15: [
    { leadsTo: 'local14', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local16', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local16: [
    { leadsTo: 'local15', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local17', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local17: [
    { leadsTo: 'local16', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local18', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local18: [
    { leadsTo: 'local17', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local19', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local19: [
    { leadsTo: 'local18', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local20', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local20: [
    { leadsTo: 'local19', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local21', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local21: [
    { leadsTo: 'local20', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local22', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local22: [
    { leadsTo: 'local21', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local23', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local23: [
    { leadsTo: 'local22', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local24', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local24: [
    { leadsTo: 'local23', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local25', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local25: [
    { leadsTo: 'local24', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local26', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local26: [
    { leadsTo: 'local25', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local27', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local27: [
    { leadsTo: 'local26', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local28', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local28: [
    { leadsTo: 'local27', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local29', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local29: [
    { leadsTo: 'local28', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local30', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local30: [
    { leadsTo: 'local29', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local31', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local31: [
    { leadsTo: 'local30', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local32', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local32: [
    { leadsTo: 'local31', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local33', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local33: [
    { leadsTo: 'local32', position: [0, -2, 5], rotation: [0, 3.14, 0] },
    { leadsTo: 'local34', position: [0, -2, -5], rotation: [0, 0, 0] }
  ],
  local34: [
    { leadsTo: 'local33', position: [0, -2, 5], rotation: [0, 3.14, 0] }
  ],
};


// =====================================================================
// 3. COMPONENTES DE INTERFACE
// =====================================================================

const SharedOverlay = ({ children }) => (<div className="overlay-container">{children}</div>);

const MapViewContent = ({ onSelect, onBack }) => (
  <div className="overlay-content map-content">
    <h2>MAPA DO MUSEU</h2>
    <p>Selecione um local ({sortedKeys.length} disponíveis):</p>
    <div className="map-buttons">
      {sortedKeys.map((key) => (
        <button key={key} onClick={() => onSelect(key)}>
          {key.replace('local', 'Local ')}
        </button>
      ))}
    </div>
    <button className="back-button" onClick={onBack}> Voltar ao Menu </button>
  </div>
);

const CreditsViewContent = ({ onBack }) => (<div className="overlay-content"> <h2>CRÉDITOS</h2> <p>Desenvolvido pelos bolsistas pepequers.</p> <button className="back-button" onClick={onBack}> Voltar ao Menu </button> </div>);

// =====================================================================
// 4. APP PRINCIPAL
// =====================================================================

export default function App() {

  const [view, setView] = React.useState('menu');
  const [currentSceneKey, setCurrentSceneKey] = React.useState('local1');
  const [player, setPlayer] = React.useState(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [hasInteracted, setHasInteracted] = React.useState(false);
  const [volume, setVolume] = React.useState(50);

  const currentImageUrl = images[currentSceneKey];
  const videoId = 'CvL55F4GdZM';
  const youtubeOptions = { height: '0', width: '0', playerVars: { autoplay: 0, loop: 1, playlist: videoId, controls: 0 } };

  const onPlayerReady = (event) => { setPlayer(event.target); event.target.setVolume(volume); };

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
  const handleBackToMenu = () => setView('menu');

  const renderView = () => {
    switch (view) {
      case 'tour':
        if (!currentImageUrl) {
          return (
            <div className="overlay-container">
              <div className="overlay-content">
                <h2>Erro de Imagem</h2>
                <p>Faltando: <b>{currentSceneKey}</b></p>
                <button className="back-button" onClick={handleBackToMenu}>Voltar</button>
              </div>
            </div>
          );
        }

        return (
          <div className="tour-container">
            <Scene360
              imageUrl={currentImageUrl}
              hotspots={navigationData[currentSceneKey] || []}
              onNavigate={handleSceneSelect}
            />
            <button className="back-button tour-back-button" onClick={handleBackToMenu}> Voltar ao Menu </button>
          </div>
        );
      case 'map': return (<SharedOverlay> <MapViewContent onSelect={handleSceneSelect} onBack={handleBackToMenu} /> </SharedOverlay>);
      case 'credits': return (<SharedOverlay> <CreditsViewContent onBack={handleBackToMenu} /> </SharedOverlay>);
      default: return <MenuScreen onStart={handleStart} onMap={() => { handleFirstInteraction(); setView('map'); }} onCredits={() => { handleFirstInteraction(); setView('credits'); }} />;
    }
  };

  return (
    <>
      <YouTube videoId={videoId} opts={youtubeOptions} onReady={onPlayerReady} style={{ display: 'none' }} />
      {renderView()}
      <div className="audio-controls">
        <img src={icone_som} alt="Som" className={`sound-icon ${!isPlaying ? 'paused' : ''}`} onClick={togglePlay} />
        <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange} className="volume-slider" />
      </div>
    </>
  );
}