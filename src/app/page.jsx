"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const MapViewer = dynamic(() => import('../components/MapViewer'), { 
  ssr: false,
  loading: () => <div style={{ background: '#f3f4f6', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>Cargando Agenda de Barcelona...</div>
});

export default function BarnaPulseCore() {
  return (
    <main style={{ height: '100vh', width: '100vw', overflow: 'hidden', margin: 0, padding: 0 }}>
      <MapViewer />
    </main>
  );
}
