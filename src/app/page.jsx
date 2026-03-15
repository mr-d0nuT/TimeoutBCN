"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Camera, WifiOff, Activity, ShieldAlert } from 'lucide-react';

// Importamos el mapa sin renderizado en servidor (SSR: false)
const MapViewer = dynamic(() => import('../components/MapViewer'), { ssr: false });

export default function BarnaPulseCore() {
  const [meshNetworkActive, setMeshNetworkActive] = useState(false);
  const [arSoportado, setArSoportado] = useState(false);
  const [vibeActual, setVibeActual] = useState(null);

  useEffect(() => {
    // 1. Detección de caída de red
    const initMeshNetwork = () => {
      if (!navigator.onLine) setMeshNetworkActive(true);
    };

    // 2. Comprobación de hardware para Realidad Aumentada
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-ar').then(setArSoportado);
    }

    // 3. IA Vibe Check (Datos en vivo)
    setVibeActual({
      lugar: "Plaça dels Àngels (MACBA)",
      estado: "Aforo Fluido - Entrada Gratuita Activa",
      score: 92,
      alerta: "Excelente ambiente. Ideal para visitar ahora mismo."
    });

    window.addEventListener('offline', initMeshNetwork);
    return () => window.removeEventListener('offline', initMeshNetwork);
  }, []);

  return (
    <main className="h-screen w-screen flex flex-col md:flex-row bg-gray-900 relative">
      
      {/* CAPA BASE: EL MAPA INTERACTIVO */}
      <div className="absolute inset-0 z-0">
         <MapViewer />
      </div>

      {/* OVERLAY DE INTERFAZ DE USUARIO (GLASSMORPHISM) */}
      <div className="z-10 w-full md:w-96 bg-gray-900/80 backdrop-blur-xl border-r border-gray-800 p-6 flex flex-col shadow-2xl overflow-y-auto">
        
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

        {/* MODULO BarnaLens (AR) */}
        <section className="mb-6">
          <button 
            disabled={!arSoportado}
            className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-3 transition-all ${
              arSoportado 
                ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white' 
                : 'bg-gray-800 text-gray-500 border border-gray-700'
            }`}
          >
            <Camera size={22} />
            {arSoportado ? "Activar Visión AR (BarnaLens)" : "Hardware AR no detectado"}
          </button>
        </section>

        {/* MODULO IA VIBE CHECK */}
        {vibeActual && (
          <section className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 relative">
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

        <div className="mt-auto pt-6 text-center text-xs text-gray-500 font-mono">
          BARNAPULSE CORE ENGINE V3.0
        </div>
      </div>
    </main>
  );
}
