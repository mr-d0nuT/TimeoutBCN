"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { Camera, Activity, Users } from 'lucide-react';

const MapViewer = dynamic(() => import('../components/MapViewer'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-900 flex items-center justify-center text-white">Iniciando BarnaPulse...</div>
});

export default function BarnaPulseCore() {
  return (
    <main className="h-screen w-screen relative overflow-hidden bg-black">
      {/* CAPA 1: EL MAPA (Al fondo) */}
      <div className="absolute inset-0 z-0">
        <MapViewer />
      </div>

      {/* CAPA 2: INTERFAZ (Encima del mapa) */}
      <div className="absolute bottom-0 left-0 w-full md:w-96 p-6 z-[1000] bg-gray-900/85 backdrop-blur-md md:h-screen md:border-r border-gray-800">
        <div className="flex flex-col h-full">
          <h1 className="text-3xl font-black text-white mb-1">BarnaPulse</h1>
          <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase mb-8">
            <Activity size={12} className="animate-pulse" /> Live Open Data Barcelona
          </div>

          <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 mb-6 active:scale-95 transition-transform">
            <Camera size={20} /> Activar BarnaLens AR
          </button>

          <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Alertas Ciudadanas</span>
              <span className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold tracking-tighter">
                <Users size={12}/> 1.2k cerca de ti
              </span>
            </div>
            <p className="text-xs text-gray-300">Explora los eventos en vivo. Pulsa en los puntos azules para ver detalles.</p>
          </div>

          <div className="mt-auto pt-6 text-[10px] text-gray-600 font-mono text-center">
            CORE_V3.1 // BARCELONA_PULSE
          </div>
        </div>
      </div>
    </main>
  );
}
