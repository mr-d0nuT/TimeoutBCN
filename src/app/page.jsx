"use client";
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Camera, WifiOff, Activity, ShieldAlert, X } from 'lucide-react';

const MapViewer = dynamic(() => import('../components/MapViewer'), { ssr: false });

export default function BarnaPulseCore() {
  const [meshNetworkActive, setMeshNetworkActive] = useState(false);
  const [vibeActual, setVibeActual] = useState(null);
  
  // Nuevos estados para el motor AR Universal
  const [cameraSoportada, setCameraSoportada] = useState(false);
  const [modoARActivo, setModoARActivo] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const initMeshNetwork = () => {
      if (!navigator.onLine) setMeshNetworkActive(true);
    };

    // 1. Detección de Cámara Universal (Funciona en el 99% de móviles)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setCameraSoportada(true);
    }

    // 2. Datos IA en tiempo real
    setVibeActual({
      lugar: "Plaça dels Àngels (MACBA)",
      estado: "Aforo Fluido - Entrada Gratuita Activa",
      score: 92,
      alerta: "Excelente ambiente. Ideal para visitar ahora mismo."
    });

    window.addEventListener('offline', initMeshNetwork);
    return () => window.removeEventListener('offline', initMeshNetwork);
  }, []);

  // 3. Función para encender la cámara trasera a la fuerza
  const activarBarnaLens = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Fuerza la cámara trasera
      });
      setModoARActivo(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Permiso de cámara denegado o hardware no disponible.");
      console.error(err);
    }
  };

  const apagarBarnaLens = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setModoARActivo(false);
  };

  return (
    <main className="h-screen w-screen flex flex-col md:flex-row bg-gray-900 relative overflow-hidden">
      
      {/* CAPA BASE 1: MAPA O CÁMARA AR */}
      <div className="absolute inset-0 z-0 bg-black">
        {modoARActivo ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <MapViewer />
        )}
      </div>

      {/* OVERLAY DE INTERFAZ DE USUARIO */}
      <div className={`z-10 w-full md:w-96 p-6 flex flex-col shadow-2xl transition-all duration-500 ${modoARActivo ? 'bg-black/40 backdrop-blur-sm border-transparent' : 'bg-gray-900/80 backdrop-blur-xl border-r border-gray-800'}`}>
        
        <header className="mb-8">
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
            BarnaPulse
          </h1>
          
          {meshNetworkActive ? (
            <div className="flex items-center gap-2 bg-red-900/50 text-red-400 px-3 py-2 rounded-lg text-sm font-bold border border-red-800/50">
              <WifiOff size={18} /> Protocolo Mesh Offline Activo
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-900/50 text-emerald-400 px-3 py-2 rounded-lg text-sm font-bold border border-emerald-800/50">
              <Activity size={18} /> Conexión P2P Estable
            </div>
          )}
        </header>

        {/* MODULO BarnaLens (AR UNIVERSAL) */}
        <section className="mb-6">
          {!modoARActivo ? (
            <button 
              onClick={activarBarnaLens}
              disabled={!cameraSoportada}
              className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-3 transition-all ${
                cameraSoportada 
                  ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white' 
                  : 'bg-gray-800 text-gray-500 border border-gray-700'
              }`}
            >
              <Camera size={22} />
              {cameraSoportada ? "Activar Visión AR (BarnaLens)" : "Cámara no detectada"}
            </button>
          ) : (
            <button 
              onClick={apagarBarnaLens}
              className="w-full py-4 rounded-xl font-bold flex justify-center items-center gap-3 transition-all bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)] text-white"
            >
              <X size={22} />
              Cerrar BarnaLens
            </button>
          )}
        </section>

        {/* HUD HOLOGRÁFICO (Solo visible en modo AR) */}
        {modoARActivo && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none animate-pulse">
            <div className="w-48 h-48 border-2 border-emerald-400 rounded-full flex items-center justify-center bg-emerald-900/20 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
               <span className="text-emerald-400 font-bold text-sm bg-black/50 px-2 py-1 rounded">Escaneando entorno...</span>
            </div>
          </div>
        )}

        {/* MODULO IA VIBE CHECK */}
        {vibeActual && (
          <section className={`${modoARActivo ? 'bg-black/60' : 'bg-gray-800/50'} rounded-xl p-5 border border-gray-700 relative mt-auto`}>
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
}
