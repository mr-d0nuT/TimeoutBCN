"use client";
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default function MapViewer() {
  const [eventos, setEventos] = useState([]);

  // Iconos por categoría
  const getIcon = (color) => L.divIcon({
    html: `<div style="background-color: ${color}; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.4);"></div>`,
    className: 'custom-marker'
  });

  useEffect(() => {
    // API REAL: Agenda Cultural de Barcelona (Open Data)
    const fetchBarnaData = async () => {
      try {
        const res = await fetch('https://opendata-ajuntament.barcelona.cat/data/api/3/action/datastore_search?resource_id=e7041793-6c8c-4f10-9080-33b09228a0f9&limit=100');
        const data = await res.json();
        const records = data.result.records.map(r => ({
          id: r._id,
          name: r.name,
          lat: parseFloat(r.lat),
          lng: parseFloat(r.lon),
          info: r.description,
          url: r.p_inf_esp_web
        })).filter(r => !isNaN(r.lat));
        setEventos(records);
      } catch (e) { console.error("Error cargando el pulso de la ciudad", e); }
    };
    fetchBarnaData();
  }, []);

  return (
    <div className="h-full w-full absolute inset-0">
      <MapContainer center={[41.3851, 2.1734]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        {eventos.map(ev => (
          <Marker key={ev.id} position={[ev.lat, ev.lng]} icon={getIcon('#3B82F6')}>
            <Popup>
              <div className="p-1 font-sans">
                <h3 className="font-bold text-sm">{ev.name}</h3>
                <p className="text-[10px] my-2 text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{__html: ev.info}}></p>
                <a href={ev.url} target="_blank" className="text-blue-500 text-[10px] font-bold underline">Más info</a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
