"use client";
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default function MapViewer() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const fetchAgendaHoy = async () => {
      try {
        // Consultamos la API de la Guía de Barcelona para los eventos de HOY
        const res = await fetch('https://opendata-ajuntament.barcelona.cat/data/api/3/action/datastore_search?resource_id=e7041793-6c8c-4f10-9080-33b09228a0f9&limit=100');
        const data = await res.json();
        const records = data.result.records
          .filter(r => r.lat && r.lon)
          .map(r => ({
            id: r._id,
            name: r.name,
            pos: [parseFloat(r.lat), parseFloat(r.lon)],
            info: r.description,
            hora: r.prox_ses_horari || "Ver guía"
          }));
        setEventos(records);
      } catch (e) {
        console.error("Error conectando con Guía BCN", e);
      }
    };
    fetchAgendaHoy();
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <MapContainer 
        center={[41.387, 2.170]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        
        {eventos.map(ev => (
          <Marker 
            key={ev.id} 
            position={ev.pos} 
            icon={L.divIcon({
              html: `<div style="background:#2563eb;width:10px;height:10px;border-radius:50%;border:2px solid white;"></div>`,
              className: 'event-marker'
            })}
          >
            <Popup>
              <div style={{ fontFamily: 'sans-serif', fontSize: '12px' }}>
                <h3 style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{ev.name}</h3>
                <p style={{ margin: '0', color: '#666' }}>{ev.hora}</p>
                <a href={`http://guia.barcelona.cat/ca/detall/_${ev.id}`} target="_blank" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '10px', fontWeight: 'bold' }}>VER EN GUIA.BARCELONA.CAT</a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
