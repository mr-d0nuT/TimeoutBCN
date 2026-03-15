"use client";
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default function MapViewer() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ICONO DINÁMICO
  const getIcon = (categoria) => L.divIcon({
    html: `<div style="background-color: ${categoria === 'Actividades' ? '#3B82F6' : '#F59E0B'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
    className: 'custom-marker'
  });

  useEffect(() => {
    const fetchLiveEvents = async () => {
      try {
        // Consultamos la Agenda Cultural de Barcelona (API REAL)
        const response = await fetch('https://opendata-ajuntament.barcelona.cat/data/api/3/action/datastore_search?resource_id=e7041793-6c8c-4f10-9080-33b09228a0f9&limit=50');
        const data = await response.json();
        
        // Mapeamos los datos de la API a nuestro formato
        const liveEvents = data.result.records.map(item => ({
          id: item._id,
          titulo: item.name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          descripcion: item.description,
          tipo: item.category_name
        })).filter(e => !isNaN(e.lat));

        setEventos(liveEvents);
        setLoading(false);
      } catch (err) {
        console.error("Fallo al conectar con Open Data BCN", err);
        setLoading(false);
      }
    };

    fetchLiveEvents();
    // Consultar cada 5 minutos para mantener la "vida" de la app
    const interval = setInterval(fetchLiveEvents, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full absolute inset-0">
      {loading && (
        <div className="absolute inset-0 z-[500] bg-gray-900/60 flex items-center justify-center backdrop-blur-sm">
          <div className="text-white font-bold animate-pulse">Sincronizando con Barcelona Open Data...</div>
        </div>
      )}
      <MapContainer 
        center={[41.3851, 2.1734]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        
        {eventos.map(ev => (
          <Marker key={ev.id} position={[ev.lat, ev.lng]} icon={getIcon(ev.tipo)}>
            <Popup className="custom-popup">
              <div className="p-1">
                <h3 className="font-bold text-gray-900 leading-tight">{ev.titulo}</h3>
                <p className="text-[10px] text-blue-600 font-bold uppercase mt-1">{ev.tipo}</p>
                <div className="mt-2 text-[11px] text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{ __html: ev.descripcion }} />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
