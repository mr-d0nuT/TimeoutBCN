"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Camera, Activity, Users, Star } from 'lucide-react';

const MapViewer = dynamic(() => import('../components/MapViewer'), { ssr: false });

export default function BarnaPulseCore() {
  const [reportes, setReportes] = useState(128); // Simulación de colaboración viva

  return (
    <main className="h-screen w-screen relative bg-black flex flex-col md:flex-row">
      {/* MAPA DINÁMICO */}
      <div className="flex-grow relative"><MapViewer /></div>

      {/* PANEL LATERAL DE COLABORACIÓN */}
      <div className="absolute bottom-0 left-0 w-full md:relative md:w-96 bg-gray-900/90 backdrop-blur-xl border-t md:border-t-0 md:border-r border-gray-800 p-6 z-[1000] flex flex-col">
        <h1 className="text-2xl font-black text-white mb-2">BarnaPulse</h1>
        <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase mb-6">
          <Activity size={12} animate-pulse /> Sincronizado con Barcelona Open Data
        </div>

        <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 mb-4 transition-all active:scale-95 shadow-lg shadow-blue-500/20">
          <Camera size={20} /> Activar BarnaLens AR
        </button>

        <div className="space-y-4 flex-grow overflow-y-auto pr-2">
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Colaboración Ciudadana</span>
              <span className="flex items-center gap-1 text-yellow-500 text-[10px] font-bold"><Users size={12}/> {reportes} activos</span>
            </div>
            <p className="text-xs text-gray-300 leading-tight">¿Estás viendo algo? Cuelga una foto o valida un evento para subir tu Trust Score.</p>
            <button onClick={() => setReportes(reportes + 1)} className="mt-3 w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-[10px] font-bold text-white transition-colors">
              + AÑADIR ALERTA EN VIVO
            </button>
          </div>
          
          {/* Feed de Reviews (Simulado hasta conectar Supabase) */}
          <div className="border-l-2 border-indigo-500 pl-4 space-y-3">
             <div className="text-[11px]"><span className="text-indigo-400 font-bold">@Marc88:</span> "Muchísima gente en el mercado de Sant Antoni. ¡Id con cuidado!"</div>
             <div className="text-[11px]"><span className="text-indigo-400 font-bold">@Laia_BCN:</span> "Confirmo concierto gratis en Pl. del Rei. ¡Suena genial!"</div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-800 text-[10px] text-gray-500 text-center font-mono">
          BARCELONA_CORE_V3 // DOMINGO 17:45H
        </div>
      </div>
    </main>
  );
}
