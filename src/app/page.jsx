"use client";
import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Camera, Activity, ShieldAlert, X } from 'lucide-react';

const MapViewer = dynamic(() => import('../components/MapViewer'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-800 animate-pulse flex items-center justify-center">Cargando Mapa...</div>
});

export default function BarnaPulseCore() {
  const [modoAR, setModoAR] = useState(false);
  const videoRef = useRef(null);

  const encenderCamara = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setModoAR(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 200);
    } catch (err) {
      alert("Error de cámara: " + err.message);
    }
  };

  const apagarCamara = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
    setModoAR(false);
  };

  return (
    <main className="fixed inset-0 bg-black overflow-hidden flex flex-col md:flex-row">
      {/* VISOR PRINCIPAL */}
      <div className="relative flex-grow h-full bg-gray-900">
        {modoAR ? (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        ) : (
          <MapViewer />
        )}
      </div>

      {/* PANEL DE CONTROL */}
      <div className="absolute bottom-0 left-0 w-full md:relative md:w-96 bg-gray-900/90 backdrop-blur-xl p-6 border-t md:border-t-0 md:border-r border-gray-800 z-[1000] shadow-2xl">
        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-6">
          BarnaPulse
        </h1>

        <button 
          onClick={modoAR ? apagarCamara : encenderCamara}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all mb-6 ${
            modoAR ? 'bg-red-600 text-white' : 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
          }`}
        >
          {modoAR ? <><X /> Ver Mapa</> : <><Camera /> Activar BarnaLens</>}
        </button>

        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase mb-2">
            <Activity size={14} /> Sistema en Vivo
          </div>
          <p className="text-gray-300 text-sm">Explora los eventos gratuitos en el mapa o usa la cámara para escanear tu entorno.</p>
        </div>
      </div>
    </main>
  );
}
