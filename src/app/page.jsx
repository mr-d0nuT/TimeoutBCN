"use client";
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Camera, WifiOff, Activity, ShieldAlert, X } from 'lucide-react';

// Carga dinámica del mapa para evitar errores de servidor (SSR)
const MapViewer = dynamic(() => import('../components/MapViewer'), { ssr: false });

export default function BarnaPulseCore() {
  const [meshNetworkActive, setMeshNetworkActive] = useState(false);
  const [vibeActual, setVibeActual] = useState(null);
  
  const [cameraSoportada, setCameraSoportada] = useState(false);
  const [modoARActivo, setModoARActivo] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Escudo de seguridad: Solo ejecutar esto si estamos en un navegador real
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      if (!navigator.onLine) setMeshNetworkActive(true);

      window.addEventListener('offline', () => setMeshNetworkActive(true));
      window.addEventListener('online', () => setMeshNetworkActive(false));

      // Verificar si el dispositivo tiene cámara
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        setCameraSoportada(true);
      }
    }

    setVibeActual({
      lugar: "Plaça dels Àngels (MACBA)",
      estado: "Aforo Fluido - Entrada Gratuita",
      score: 92,
      alerta: "Excelente ambiente. Ideal para visitar ahora mismo."
    });
  }, []);

  const toggleVisor = async () => {
    if (modoARActivo) {
      // APAGAR CÁMARA -> VOLVER AL MAPA
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setModoARActivo(false);
    } else {
      // ENCENDER CÁMARA -> OCULTAR MAPA
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        setModoARActivo(true);
        // Pequeño retraso para asegurar que la etiqueta <video> ya existe en pantalla
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }, 100);
      } catch (err) {
        alert("No se pudo acceder a la cámara. Comprueba los permisos de tu navegador.");
        console.error(err);
      }
    }
  };

  return (
    <main className="h-screen w-screen flex flex-col md:flex-row bg-gray-900 relative overflow-hidden">
      
      {/* CAPA BASE: MAPA (Por defecto) O CÁMARA (Al pulsar botón) */}
      <div className="absolute inset-0 z-0 bg-black">
        {modoARActivo ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <MapViewer />
        )}
      </div>

      {/* PANEL DE CONTROL SUPERPUESTO */}
      <div className={`z-10 w-full md:w-96 p-6 flex flex-col shadow-2xl transition-all duration-500 ${modoARActivo ? 'bg-black/50 backdrop-blur-md border-transparent' : 'bg-gray-900/80 backdrop-blur-xl border-r border-gray-800'}`}>
        
        <header className="mb-8">
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
            BarnaPulse
          </h1>
          
          {meshNetworkActive ? (
            <div className="flex items-center gap-2 bg-red-900/50 text-red-400 px-3 py-2 rounded-lg text-sm font-bold border border-red-800/50">
              <WifiOff size={18} /> Red Mesh Offline
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-900/50 text-emerald-400 px-3 py-2 rounded-lg text-sm font-bold border border-emerald-800/50">
              <Activity size={18} /> Conexión P2P Estable
            </div>
          )}
        </header>

        {/* BOTÓN MAESTRO (Alternar Mapa / Cámara) */}
        <section className="mb-6">
          <button 
            onClick={toggleVisor}
            disabled={!cameraSoportada && !modoARActivo}
            className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-3 transition-all ${
              modoARActivo 
                ? 'bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)] text-white'
                : cameraSoportada 
                  ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white' 
                  : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
            }`}
          >
            {modoARActivo ? (
              <><X size={22} /> Cerrar Cámara (Ver Mapa)</>
            ) : (
              <><Camera size={22} /> {cameraSoportada ? "Activar BarnaLens" : "Cámara no detectada"}</>
            )}
          </button>
        </section>

        {/* RADAR HOLOGRÁFICO (Solo visible al encender la cámara) */}
        {modoARActivo && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none animate-pulse z-0">
            <div className="w-64 h-64 border-2 border-emerald-400 rounded-full flex items-center justify-center bg-emerald-900/20 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
               <span className="text-emerald-400 font-bold text-sm bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">Escaneando Barcelona...</span>
            </div>
          </div>
        )}

        {/* IA VIBE CHECK */}
        {vibeActual && (
          <section className={`${modoARActivo ? 'bg-black/60' : 'bg-gray-800/50'} rounded-xl p-5 border border-gray-700 relative mt-auto z-10`}>
            <h2 className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">
              🔮 Análisis IA de tu entorno
            </h2>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white">{vibeActual.lugar}</h3>
              <p className="text-emerald-400 font-medium">{vibeActual.estado}</p>
            </div>
            <div className="bg-gray-900/80 p-4 rounded-lg flex items-start gap-3 border border-gray-700">
              <ShieldAlert className="text-blue-400 shrink-0 mt-1" size={18} />
              <p className="text-sm text-gray-300 leading-relaxed">{vibeActual.alerta}</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
