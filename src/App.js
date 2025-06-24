// src/App.js - Version corrigée sans proxy
import React, { useState, useEffect } from 'react';
import { Download, Video, Music, RefreshCw, CheckCircle, AlertCircle, Folder, Play } from 'lucide-react';
import './App.css';

// Composant pour les annonces (sera remplacé par les vraies pubs plus tard)
const AdBanner = ({ position }) => (
  <div className="ad-banner" style={{
    background: 'linear-gradient(45deg, #f0f0f0, #e0e0e0)',
    padding: '20px',
    textAlign: 'center',
    borderRadius: '10px',
    margin: '20px 0',
    border: '2px dashed #ccc'
  }}>
    <p style={{ color: '#666', margin: 0 }}>
      📢 Publicité - {position} (sera remplacée par de vraies pubs)
    </p>
  </div>
);

const VideoDownloader = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState('');
  const [audioOnly, setAudioOnly] = useState(false);
  const [downloadPath] = useState('/Downloads');
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  
  const qualities = [
    { id: 'best', label: 'Meilleure qualité (1080p+)', icon: '🎬' },
    { id: '720p', label: 'Haute définition (720p)', icon: '📺' },
    { id: '480p', label: 'Qualité standard (480p)', icon: '📱' },
    { id: '360p', label: 'Qualité mobile (360p)', icon: '📲' },
  ];

  const audioQualities = [
    { id: 'best', label: 'Meilleure qualité (320kbps)', icon: '🎵' },
    { id: '256k', label: 'Haute qualité (256kbps)', icon: '🎶' },
    { id: '128k', label: 'Qualité standard (128kbps)', icon: '🎧' },
  ];

  const addLog = (message, type = 'info') => {
    const newLog = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setLogs(prev => [...prev.slice(-9), newLog]);
  };

  const analyzeVideo = async () => {
    if (!url.trim()) {
      addLog('Veuillez entrer une URL valide', 'error');
      return;
    }

    setIsAnalyzing(true);
    addLog('Analyse de la vidéo en cours...', 'info');
    
    // Simulation de l'analyse (sera remplacé par l'API plus tard)
    setTimeout(() => {
      setVideoInfo({
        title: "Exemple de Vidéo - Tutoriel React Moderne",
        duration: "15:30",
        thumbnail: "https://via.placeholder.com/320x180/6366f1/ffffff?text=Video+Preview",
        uploader: "TechChannel",
        views: "125,432",
        uploadDate: "2025-06-20"
      });
      addLog('✓ Analyse terminée avec succès', 'success');
      setSelectedQuality(audioOnly ? audioQualities[0].id : qualities[0].id);
      setIsAnalyzing(false);
    }, 2000);
  };

  const startDownload = async () => {
    setIsDownloading(true);
    setProgress(0);
    addLog('Début du téléchargement...', 'info');
    
    // Simulation du téléchargement (sera remplacé par l'API plus tard)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          addLog('✓ Téléchargement terminé avec succès!', 'success');
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 rounded-full bg-blue-500" />;
    }
  };

  // Analytics simple (sera remplacé par Google Analytics)
  useEffect(() => {
    console.log('Page vue:', window.location.href);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header avec effet de parallaxe */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="relative z-10 px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Video Downloader Pro
              </h1>
              <p className="text-xl text-slate-300">Téléchargez vos vidéos préférées avec style</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-12">
        {/* Pub Header */}
        <AdBanner position="Header" />

        {/* URL Input Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Collez l'URL de votre vidéo ici..."
                className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <button
              onClick={analyzeVideo}
              disabled={isAnalyzing || !url.trim()}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Analyse...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Analyser
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Video Info Card */}
        {videoInfo && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src={videoInfo.thumbnail}
                  alt="Video thumbnail"
                  className="w-full md:w-64 h-36 object-cover rounded-2xl"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{videoInfo.title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-300">
                  <div>
                    <span className="text-slate-400">Durée:</span>
                    <br />
                    <span className="text-white font-medium">{videoInfo.duration}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Chaîne:</span>
                    <br />
                    <span className="text-white font-medium">{videoInfo.uploader}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Vues:</span>
                    <br />
                    <span className="text-white font-medium">{videoInfo.views}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Date:</span>
                    <br />
                    <span className="text-white font-medium">{videoInfo.uploadDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pub Milieu */}
        <AdBanner position="Contenu Principal" />

        <div className="max-w-2xl mx-auto">
          {/* Download Options */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              {audioOnly ? <Music className="w-6 h-6" /> : <Video className="w-6 h-6" />}
              Options de téléchargement
            </h2>

            {/* Audio/Video Toggle */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setAudioOnly(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  !audioOnly 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                <Video className="w-4 h-4" />
                Vidéo
              </button>
              <button
                onClick={() => setAudioOnly(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  audioOnly 
                    ? 'bg-purple-500 text-white shadow-lg' 
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                <Music className="w-4 h-4" />
                Audio MP3
              </button>
            </div>

            {/* Quality Selection */}
            <div className="space-y-3 mb-6">
              <label className="text-white font-medium">Qualité:</label>
              <div className="grid gap-2">
                {(audioOnly ? audioQualities : qualities).map((quality) => (
                  <label key={quality.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-300">
                    <input
                      type="radio"
                      name="quality"
                      value={quality.id}
                      checked={selectedQuality === quality.id}
                      onChange={(e) => setSelectedQuality(e.target.value)}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-lg">{quality.icon}</span>
                    <span className="text-white">{quality.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Download Path */}
            <div className="mb-6">
              <label className="text-white font-medium mb-2 block">Dossier de destination:</label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                <Folder className="w-5 h-5 text-slate-400" />
                <span className="text-slate-300 flex-1">{downloadPath}</span>
                <button 
                  type="button"
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-all duration-300"
                >
                  Parcourir
                </button>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={startDownload}
              disabled={!videoInfo || isDownloading}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isDownloading ? (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Téléchargement... {Math.round(progress)}%
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Télécharger
                </div>
              )}
            </button>

            {/* Progress Bar */}
            {isDownloading && (
              <div className="mt-4">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Activity Logs */}
            <div className="mt-8">
              <h3 className="text-white font-medium mb-4">Journal d'activité</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                    {getLogIcon(log.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{log.message}</p>
                      <p className="text-xs text-slate-400">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
                {logs.length === 0 && (
                  <p className="text-slate-400 text-center py-8">Aucune activité pour le moment</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pub Sidebar */}
        <AdBanner position="Bas de page" />

        {/* Footer légal */}
        <footer className="mt-12 pt-8 border-t border-white/20">
          <div className="text-center text-slate-400 text-sm">
            <p className="mb-4">
              <strong>⚠️ Avertissement :</strong> Cet outil est fourni uniquement à des fins éducatives. 
              Respectez les droits d'auteur et les conditions d'utilisation des plateformes.
            </p>
            <div className="flex justify-center gap-6 flex-wrap">
              <button className="hover:text-white transition-colors">Mentions légales</button>
              <button className="hover:text-white transition-colors">Confidentialité</button>
              <button className="hover:text-white transition-colors">Contact</button>
              <button className="hover:text-white transition-colors">DMCA</button>
            </div>
            <p className="mt-4">© 2025 Video Downloader Pro - Tous droits réservés</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default VideoDownloader;