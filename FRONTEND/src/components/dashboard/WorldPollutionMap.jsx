import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Globe, Filter, MapPin, Clock } from 'lucide-react';
import SimulatedDataBadge from '../common/SimulatedDataBadge';
import { MAP_STATIONS } from '../../data/mapData';

// Helper to create clean Minimal Premium map markers using Leaflet DivIcon
const createCustomMarker = (risk) => {
  let color = '#174B35';
  let pulseRing = 'rgba(23, 75, 53, 0.25)';

  if (risk === 'High') {
    color = '#B91C1C';
    pulseRing = 'rgba(185, 28, 28, 0.3)';
  } else if (risk === 'Moderate') {
    color = '#D97706';
    pulseRing = 'rgba(217, 119, 6, 0.25)';
  }

  const html = `
    <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 26px; height: 26px; border-radius: 9999px; background: ${pulseRing}; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="width: 14px; height: 14px; border-radius: 9999px; background: ${color}; border: 2.5px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.25);"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

export default function WorldPollutionMap() {
  const [filterSeverity, setFilterSeverity] = useState('All');

  // Filter stations based on selection
  const filteredStations = MAP_STATIONS.filter((station) => {
    if (filterSeverity === 'All') return true;
    return station.risk === filterSeverity;
  });

  const getRiskColors = (risk) => {
    switch (risk) {
      case 'High':
        return {
          badge: 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]',
          hotspot: '#B91C1C'
        };
      case 'Moderate':
        return {
          badge: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
          hotspot: '#D97706'
        };
      default:
        return {
          badge: 'bg-[#EAF1EB] text-[#174B35] border-[#D5E2D8]',
          hotspot: '#174B35'
        };
    }
  };

  return (
    <div className="rounded-xl bg-white border border-[#E6EBE7] p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#EAF1EB] text-[#174B35]">
              <Globe className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-[#202923] tracking-tight">
              Global Environmental Monitoring Network
            </h2>
          </div>
          <p className="text-xs text-[#77827B] mt-0.5">
            Interactive spatial telemetry across continuous ambient air stations and demonstration nodes
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SimulatedDataBadge />

          {/* Severity Filter Controls */}
          <div className="inline-flex items-center p-1 rounded-lg bg-[#F7F9F7] border border-[#E6EBE7] text-xs">
            <Filter className="w-3.5 h-3.5 text-[#77827B] ml-2 mr-1" />
            {['All', 'Low', 'Moderate', 'High'].map((severity) => (
              <button
                key={severity}
                type="button"
                onClick={() => setFilterSeverity(severity)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filterSeverity === severity
                    ? 'bg-white text-[#174B35] font-semibold shadow-xs'
                    : 'text-[#77827B] hover:text-[#202923]'
                }`}
              >
                {severity === 'All' ? 'All (7)' : severity}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Display Container */}
      <div className="relative w-full h-[460px] rounded-lg overflow-hidden border border-[#E6EBE7] z-10">
        <MapContainer
          center={[22.5, 78.5]} // Centered over India / South Asia
          zoom={4}
          scrollWheelZoom={true}
          className="h-full w-full"
          style={{ minHeight: '100%', width: '100%' }}
        >
          {/* OpenStreetMap Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Station Markers, Hotspots & Popups */}
          {filteredStations.map((station) => {
            const colors = getRiskColors(station.risk);
            const markerIcon = createCustomMarker(station.risk);

            return (
              <span key={station.id}>
                {/* Hotspot Coverage Area */}
                <Circle
                  center={station.coordinates}
                  radius={station.hotspotRadius}
                  pathOptions={{
                    color: colors.hotspot,
                    fillColor: colors.hotspot,
                    fillOpacity: 0.12,
                    weight: 1.5,
                    dashArray: '4, 4'
                  }}
                />

                {/* Point Marker */}
                <Marker
                  position={station.coordinates}
                  icon={markerIcon}
                >
                  <Popup className="custom-station-popup">
                    <div className="p-1 space-y-2.5 text-xs text-[#202923] font-sans min-w-[220px]">
                      {/* Station Title */}
                      <div className="border-b border-[#E6EBE7] pb-1.5">
                        <div className="font-bold text-sm text-[#202923] leading-tight">
                          {station.name}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[#77827B] mt-0.5">
                          <MapPin className="w-3 h-3 text-[#174B35]" />
                          <span>{station.city}, {station.country}</span>
                        </div>
                      </div>

                      {/* Air Quality Metrics */}
                      <div className="grid grid-cols-2 gap-2 bg-[#F7F9F7] p-2 rounded border border-[#E6EBE7]">
                        <div>
                          <div className="text-[10px] text-[#77827B] uppercase font-semibold">PM2.5</div>
                          <div className="font-bold text-[#202923]">{station.pm25} <span className="text-[10px] font-normal">µg/m³</span></div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#77827B] uppercase font-semibold">PM10</div>
                          <div className="font-bold text-[#202923]">{station.pm10} <span className="text-[10px] font-normal">µg/m³</span></div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#77827B] uppercase font-semibold">AQI Score</div>
                          <div className="font-bold text-[#202923] text-sm">{station.aqi}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#77827B] uppercase font-semibold">Risk Level</div>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${colors.badge}`}>
                            {station.risk}
                          </span>
                        </div>
                      </div>

                      {/* Status and Timestamp */}
                      <div className="flex items-center justify-between text-[10px] text-[#77827B]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{station.updatedAt}</span>
                        </span>
                        <span className="font-semibold text-[#174B35] uppercase">
                          {station.status}
                        </span>
                      </div>

                      {/* Simulated Transparency Notice */}
                      <div className="pt-1 border-t border-[#E6EBE7] text-[10px] text-[#77827B] text-center font-mono">
                        * Synthetic Demonstration Telemetry
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </span>
            );
          })}
        </MapContainer>

        {/* Minimal Floating Map Legend */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-xs p-3 rounded-lg border border-[#E6EBE7] shadow-sm text-xs space-y-1.5 pointer-events-auto">
          <div className="text-[11px] font-bold text-[#202923] uppercase tracking-wide">
            Pollution Risk Legend
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#77827B]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#174B35]"></span>
            <span>Low Risk (AQI &le; 50)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#77827B]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span>
            <span>Moderate (AQI 51–150)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#77827B]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B91C1C]"></span>
            <span>High Risk / Breach (&gt; 150)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#77827B] pt-0.5 border-t border-[#E6EBE7]">
            <span className="w-2.5 h-2.5 rounded-full border border-dashed border-[#77827B]"></span>
            <span>Demonstration Hotspot Zone</span>
          </div>
        </div>
      </div>
    </div>
  );
}
