"use client";
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configuración de iconos personalizados para evitar errores de Leaflet en React
const createIcon = (color) => L.divIcon({
  html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
  className: 'custom-leaflet-icon'
});

export default function MapViewer() {
  const eventosActivos = [
    { id: 1, lat: 41.3870, lng: 2.1698, titulo: "Manifestación Vivienda", color: "red" },
    { id: 2, lat: 41.3831, lng: 2.1668, titulo: "MACBA - Entrada Libre", color: "gold" },
    { id: 3, lat: 41.3739, lng: 2.1734, titulo: "Flea Market Drassanes", color: "purple" }
  ];

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={[41.3851, 2.1734]} 
        zoom={14} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        />
        {eventosActivos.map(evento => (
          <Marker key={evento.id} position={[evento.lat, evento.lng]} icon={createIcon(evento.color)}>
            <Popup>
              <h3 className="text-gray-900 font-bold">{evento.titulo}</h3>
              <p className="text-gray-600 text-sm">Validado por la comunidad</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
