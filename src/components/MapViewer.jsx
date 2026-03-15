"use client";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const createIcon = (color) => L.divIcon({
  html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
  className: 'custom-icon'
});

export default function MapViewer() {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer 
        center={[41.3851, 2.1734]} 
        zoom={14} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        <Marker position={[41.3851, 2.1734]} icon={createIcon('red')}>
          <Popup>Barcelona Central</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
