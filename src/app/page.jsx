"use client";
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Camera, WifiOff, Activity, ShieldAlert, X } from 'lucide-react';

const MapViewer = dynamic(() => import('../components/MapViewer'), { ssr: false });

export default function BarnaPulseCore() {
  const [modoARActivo, setModoARActivo] = useState(false);
  const videoRef = useRef(null);

  // Intentar activar la cámara ignorando comprobaciones previas
  const activarCamara = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Intenta la trasera en móviles
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setModoARActivo(true);
      
      // Esperar un milisegundo a que el elemento <video> aparezca en el DOM
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 300);

    } catch (err) {
      console.error("Error de acceso:", err);
      alert("Error de Cámara: " + err.name + ". Asegúrate de dar permiso en el aviso del navegador.");
    }
  };

  const desactivarCamara = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setModoARActivo(false);
  };

  return (
    <main className="h-screen w-screen flex flex-col md:flex-row bg-gray-900 relative overflow-hidden">
      
      {/* CAPA BASE: MAPA O VÍDEO */}
      <div className="absolute inset-0 z-0 bg-black">
        {modoARActivo ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover"
          />
        ) : (
          <MapViewer />
        )}
      </div>

      {/* PANEL DE INTERFAZ */}
      <div className="z-10 w-full md:w-96 p-6 flex flex-col bg-gray-900/80 backdrop-blur-xl border-r border-gray-800 shadow-2xl">
        
        <header className="mb-8">
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
            BarnaPulse
          </h1>
          <div className="flex items-center gap-2 bg-emerald-900/50 text-emerald-400 px-3 py-2 rounded-lg text-sm font-bold border border-emerald-800/50">
            <Activity size={18} /> Sistema Activo
          </div>
        </header>

        {/* BOTÓN DE ACCIÓN ÚNICO */}
        <section className="mb-6">
          {!modoARActivo ? (
            <button 
              onClick={activarCamara}
              className="w-full py-4 rounded-xl font-bold flex justify-center items-center gap-3 bg-blue-600 hover:bg-blue-500 shadow-lg text-white transition-all"
            >
              <Camera size={22} /> Activar BarnaLens (AR)
            </button>
          ) : (
            <button 
              onClick={desactivarCamara}
              className="w-full py-4 rounded-xl font-bold flex justify-center items-center gap-3 bg-red-600 hover:bg-red-500 shadow-lg text-white transition-all"
            >
              <X size={22} /> Cerrar BarnaLens
            </button>
          )}
        </section>

        {/* INDICADOR DE ESTADO IA */}
        <section className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 mt-auto">
          <h2 className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">🔮 Análisis IA</h2>
          <h3 className="text-lg font-bold text-white mb-1">Barcelona En Vivo</h3>
          <p className="text-sm text-gray-300">Explora el mapa o usa la cámara para ver eventos cercanos.</p>
        </section>
      </div>
    </main>
  );
}
