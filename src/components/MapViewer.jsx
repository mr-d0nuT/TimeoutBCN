"use client";
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default function MapViewer() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    // Icono estándar para evitar errores de carga de imágenes
    const blueIcon = L.divIcon({
      html: `<div style="background:#3B82F6;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 0 5px rgba(0,0,0,0.5);"></div>`,
      className: 'custom'
    });

    const fetchBarnaData = async () => {
      try {
        const res = await fetch('https://opendata-ajuntament.barcelona.cat/data/api/3/action/datastore_search?resource_id=e7041793-6c8c-4f10-9080-33b09228a0f9&limit=50');
        const data = await res.json();
        const records = data.result.records
          .filter(r => r.lat && r.lon)
          .map(r => ({
            id: r._id,
            name: r.name,
            pos: [parseFloat(r.lat), parseFloat(r.lon)],
            info: r.description
          }));
        setEventos(records);
      } catch (e) { console.error("Error API", e); }
    };
    fetchBarnaData();
  }, []);

  return (
    <div style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}>
      <MapContainer center={[41.3851, 2.1734]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        {eventos.map(ev => (
          <Marker key={ev.id} position={ev.pos} icon={L.divIcon({html: '<div style="background:#3B82F6;width:12px;height:12px;border-radius:50%;border:2px solid white;"></div>'})}>
            <Popup>
              <div className="text-gray-900 font-sans">
                <h3 className="font-bold">{ev.name}</h3>
                <div className="text-[10px] mt-1" dangerouslySetInnerHTML={{__html: ev.info}}></div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
