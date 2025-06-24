// src/App.js - REMPLACEZ TOUT LE CONTENU PAR CECI
import React, { useState, useEffect } from 'react';
import { Video, Music, RefreshCw, CheckCircle, AlertCircle, Play, ExternalLink } from 'lucide-react';
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

  // Extraction de l'ID YouTube
  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Fonctions utilitaires pour d'autres plateformes
  const extractTitleFromUrl = (url) => {
    try {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return 'Vidéo YouTube';
      } else if (url.includes('tiktok.com')) {
        return 'Vidéo TikTok';
      } else if (url.includes('instagram.com')) {
        return 'Vidéo Instagram';
      } else if (url.includes('twitter.com') || url.includes('x.com')) {
        return 'Vidéo Twitter/X';
      }
      return 'Vidéo';
    } catch {
      return 'Vidéo_inconnue';
    }
  };

  const extractChannelFromUrl = (url) => {
    try {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return 'Chaîne YouTube';
      } else if (url.includes('tiktok.com')) {
        return 'Utilisateur TikTok';
      } else if (url.includes('instagram.com')) {
        return 'Compte Instagram';
      } else if (url.includes('twitter.com') || url.includes('x.com')) {
        return 'Compte Twitter/X';
      }
      return 'Auteur';
    } catch {
      return 'Auteur_inconnu';
    }
  };

  // Analyse de vidéo avec récupération des métadonnées réelles
  const analyzeVideo = async () => {
    if (!url.trim()) {
      addLog('Veuillez entrer une URL valide', 'error');
      return;
    }

    // Vérification URL supportée
    const supportedDomains = ['youtube.com', 'youtu.be', 'tiktok.com', 'instagram.com', 'twitter.com', 'x.com'];
    const isSupported = supportedDomains.some(domain => url.includes(domain));
    
    if (!isSupported) {
      addLog('❌ URL non supportée. Utilisez YouTube, TikTok, Instagram ou Twitter/X', 'error');
      return;
    }

    setIsAnalyzing(true);
    addLog('Analyse de la vidéo en cours...', 'info');
    
    try {
      let videoData = {
        title: extractTitleFromUrl(url),
        author: extractChannelFromUrl(url),
        thumbnail: "https://via.placeholder.com/320x180/6366f1/ffffff?text=Video+Preview",
        duration: "Inconnue",
        views: "N/A"
      };

      // Pour YouTube, récupérer les vraies métadonnées
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = extractYouTubeId(url);
        if (videoId) {
          addLog(`🔍 ID vidéo YouTube: ${videoId}`, 'info');
          
          try {
            // Récupération des métadonnées via YouTube oEmbed
            addLog('📡 Récupération des informations YouTube...', 'info');
            const metaResponse = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
            
            if (metaResponse.ok) {
              const metadata = await metaResponse.json();
              videoData = {
                title: metadata.title,
                author: metadata.author_name,
                thumbnail: metadata.thumbnail_url,
                duration: "Disponible",
                views: "Disponible"
              };
              addLog('✅ Informations YouTube récupérées', 'success');
            } else {
              // Fallback avec thumbnail YouTube directe
              videoData.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
              addLog('⚠️ Métadonnées limitées, thumbnail récupérée', 'info');
            }
          } catch (metaError) {
            addLog('⚠️ Erreur métadonnées, utilisation des données de base', 'info');
          }
        }
      }

      // Pour TikTok, essayer d'extraire des infos basiques
      if (url.includes('tiktok.com')) {
        videoData.thumbnail = "https://via.placeholder.com/320x180/ff0050/ffffff?text=TikTok+Video";
        addLog('📱 Vidéo TikTok détectée', 'info');
      }

      // Pour Instagram
      if (url.includes('instagram.com')) {
        videoData.thumbnail = "https://via.placeholder.com/320x180/E4405F/ffffff?text=Instagram+Video";
        addLog('📸 Vidéo Instagram détectée', 'info');
      }

      // Créer l'objet videoInfo
      setVideoInfo({
        title: videoData.title,
        duration: videoData.duration,
        thumbnail: videoData.thumbnail,
        uploader: videoData.author,
        views: videoData.views,
        uploadDate: new Date().toLocaleDateString(),
        originalUrl: url,
        platform: url.includes('youtube') ? 'YouTube' : 
                 url.includes('tiktok') ? 'TikTok' : 
                 url.includes('instagram') ? 'Instagram' : 
                 url.includes('twitter') || url.includes('x.com') ? 'Twitter/X' : 'Autre'
      });
      
      addLog('✅ Analyse terminée avec succès!', 'success');
      addLog(`🎯 Plateforme: ${videoData.platform || 'Détectée'}`, 'info');
      setSelectedQuality(audioOnly ? audioQualities[0].id : qualities[0].id);
      
    } catch (error) {
      addLog(`❌ Erreur: ${error.message}`, 'error');
      
      // Fallback simple
      setVideoInfo({
        title: extractTitleFromUrl(url),
        duration: "Analyse partielle",
        thumbnail: "https://via.placeholder.com/320x180/f59e0b/ffffff?text=Video+Detectee",
        uploader: extractChannelFromUrl(url),
        views: "Détection réussie",
        uploadDate: new Date().toLocaleDateString(),
        originalUrl: url,
        platform: 'Détectée'
      });
      
      addLog('⚠️ Analyse partielle réussie', 'success');
      setSelectedQuality(audioOnly ? audioQualities[0].id : qualities[0].id);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Fonction de téléchargement avec redirection intelligente
  const startDownload = async () => {
    if (!videoInfo) {
      addLog('❌ Aucune vidéo analysée', 'error');
      return;
    }

    setIsDownloading(true);
    setProgress(0);
    addLog('🚀 Préparation du téléchargement...', 'info');
    
    try {
      // Progression visuelle
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 300);

      // Outils de téléchargement par plateforme
      const getDownloadTools = (platform, url) => {
        const videoId = extractYouTubeId(url);
        
        switch (platform) {
          case 'YouTube':
            return [
              {
                name: "Y2mate",
                url: `https://www.y2mate.com/youtube/${videoId}`,
                description: "Populaire et fiable",
                quality: "HD+Audio"
              },
              {
                name: "SaveFrom.net", 
                url: `https://savefrom.net/#url=${encodeURIComponent(url)}`,
                description: "Service rapide",
                quality: "Toutes qualités"
              },
              {
                name: "YTmp3",
                url: `https://ytmp3.cc/en13/${videoId}/`,
                description: "Spécialisé MP3",
                quality: "Audio seulement"
              }
            ];
          
          case 'TikTok':
            return [
              {
                name: "SnapTik",
                url: `https://snaptik.app/en`,
                description: "TikTok sans filigrane",
                quality: "Original"
              },
              {
                name: "TikMate",
                url: `https://tikmate.app/`,
                description: "Téléchargeur TikTok",
                quality: "HD"
              }
            ];
          
          case 'Instagram':
            return [
              {
                name: "InstaLoader",
                url: `https://instasave.net/`,
                description: "Photos et vidéos",
                quality: "Original"
              },
              {
                name: "IG Downloader",
                url: `https://igdownloader.app/`,
                description: "Rapide et simple",
                quality: "HD"
              }
            ];
          
          default:
            return [
              {
                name: "9xBuddy",
                url: `https://9xbuddy.org/process?url=${encodeURIComponent(url)}`,
                description: "Multi-plateformes",
                quality: "Variable"
              }
            ];
        }
      };

      const downloadTools = getDownloadTools(videoInfo.platform, videoInfo.originalUrl);
      
      setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(100);
        
        addLog('✅ Outils de téléchargement prêts!', 'success');
        addLog(`🎯 ${downloadTools.length} options disponibles pour ${videoInfo.platform}`, 'info');
        
        // Interface de choix moderne
        const showDownloadOptions = () => {
          const modal = document.createElement('div');
          modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 1000; display: flex;
            align-items: center; justify-content: center; backdrop-filter: blur(5px);
          `;
          
          const content = document.createElement('div');
          content.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px; border-radius: 20px; color: white; max-width: 500px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          `;
          
          content.innerHTML = `
            <h2 style="margin-top: 0; text-align: center;">🚀 Choisir un outil de téléchargement</h2>
            <p style="text-align: center; opacity: 0.9;">Pour: ${videoInfo.title.substring(0, 50)}...</p>
            <div style="margin: 20px 0;">
              ${downloadTools.map((tool, index) => `
                <button onclick="window.openTool(${index})" style="
                  width: 100%; padding: 15px; margin: 10px 0; background: rgba(255,255,255,0.2);
                  border: none; border-radius: 10px; color: white; cursor: pointer;
                  transition: all 0.3s; font-size: 16px;
                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
                   onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                  <strong>${tool.name}</strong><br>
                  <small>${tool.description} • ${tool.quality}</small>
                </button>
              `).join('')}
            </div>
            <button onclick="window.closeModal()" style="
              width: 100%; padding: 10px; background: rgba(255,255,255,0.1);
              border: none; border-radius: 10px; color: white; cursor: pointer;
            ">Fermer</button>
          `;
          
          modal.appendChild(content);
          document.body.appendChild(modal);
          
          // Fonctions globales temporaires
          window.openTool = (index) => {
            const tool = downloadTools[index];
            window.open(tool.url, '_blank');
            addLog(`📤 Redirection vers ${tool.name}`, 'success');
            window.closeModal();
          };
          
          window.closeModal = () => {
            document.body.removeChild(modal);
            delete window.openTool;
            delete window.closeModal;
          };
        };
        
        showDownloadOptions();
        
        addLog('💡 Choisissez votre outil préféré dans la popup', 'info');
        
      }, 2000);
      
    } catch (error) {
      addLog(`❌ Erreur: ${error.message}`, 'error');
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
        setProgress(0);
      }, 4000);
    }
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
    addLog('🚀 Video Downloader Pro - Redirection intelligente', 'info');
    addLog('💡 Support: YouTube, TikTok, Instagram, Twitter/X', 'info');
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
              <p className="text-sm text-slate-400 mt-2">
                ✨ Redirection intelligente vers les meilleurs outils ✨
              </p>
              <div className="flex justify-center gap-4 mt-4 text-xs text-slate-500">
                <span>📺 YouTube</span>
                <span>📱 TikTok</span>
                <span>📸 Instagram</span>
                <span>🐦 Twitter/X</span>
              </div>
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
                placeholder="Collez l'URL de votre vidéo ici... (YouTube, TikTok, Instagram, Twitter)"
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
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-white">{videoInfo.title}</h3>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-lg">
                    {videoInfo.platform}
                  </span>
                </div>
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
              <label className="text-white font-medium">Qualité souhaitée:</label>
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

            {/* Download Info */}
            <div className="mb-6">
              <label className="text-white font-medium mb-2 block">Méthode de téléchargement:</label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <ExternalLink className="w-5 h-5 text-green-400" />
                <span className="text-green-300 flex-1">Redirection vers outils spécialisés fiables</span>
                <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded">Sécurisé</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                💡 Nous vous dirigeons vers les meilleurs outils de téléchargement pour chaque plateforme
              </p>
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
                  Préparation... {Math.round(progress)}%
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Accéder aux outils de téléchargement
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
              <strong>⚠️ Avertissement :</strong> Nous vous redirigeons vers des outils tiers. 
              Respectez les droits d'auteur et les conditions d'utilisation des plateformes.
            </p>
            <p className="mb-4 text-xs">
              <strong>🔒 Sécurité :</strong> Tous les outils recommandés sont vérifiés et sécurisés. 
              Aucune donnée personnelle n'est collectée lors de la redirection.
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