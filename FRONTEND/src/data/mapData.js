/**
 * EcoSentinel AI - Global Demonstration Monitoring Station Locations
 * 
 * NOTICE: All station telemetry contained herein are SIMULATED demonstration values.
 * They illustrate the global monitoring network interface and do NOT represent physical
 * certified government telemetry feeds.
 */

export const MAP_STATIONS = [
  {
    id: 'station-vapi-in',
    name: 'Vapi GIDC Chemical Estate Station',
    city: 'Vapi, Gujarat',
    country: 'India',
    coordinates: [20.3716, 72.9106],
    pm25: 54.2,
    pm10: 118.5,
    aqi: 164,
    risk: 'High', // High | Moderate | Low
    status: 'STATUTORY BREACH',
    updatedAt: '10 mins ago',
    isSimulated: true,
    hotspotRadius: 120000 // In meters for map visualization
  },
  {
    id: 'station-manesar-in',
    name: 'Manesar IMT Automotive Belt Station',
    city: 'Manesar, Haryana',
    country: 'India',
    coordinates: [28.3588, 76.9388],
    pm25: 78.0,
    pm10: 142.0,
    aqi: 218,
    risk: 'High',
    status: 'STATUTORY BREACH',
    updatedAt: '15 mins ago',
    isSimulated: true,
    hotspotRadius: 140000
  },
  {
    id: 'station-tarapur-in',
    name: 'Tarapur MIDC Manufacturing Node',
    city: 'Tarapur, Maharashtra',
    country: 'India',
    coordinates: [19.8252, 72.6934],
    pm25: 36.4,
    pm10: 74.2,
    aqi: 88,
    risk: 'Moderate',
    status: 'COMPLIANT',
    updatedAt: '25 mins ago',
    isSimulated: true,
    hotspotRadius: 90000
  },
  {
    id: 'station-thames-uk',
    name: 'Thames Gateway Clean Air Monitor',
    city: 'London',
    country: 'United Kingdom',
    coordinates: [51.5074, 0.1278],
    pm25: 18.2,
    pm10: 32.5,
    aqi: 42,
    risk: 'Low',
    status: 'COMPLIANT',
    updatedAt: '35 mins ago',
    isSimulated: true,
    hotspotRadius: 70000
  },
  {
    id: 'station-ruhr-de',
    name: 'Ruhr Industrial Complex Monitor',
    city: 'Essen',
    country: 'Germany',
    coordinates: [51.4556, 7.0116],
    pm25: 28.6,
    pm10: 55.4,
    aqi: 76,
    risk: 'Moderate',
    status: 'COMPLIANT',
    updatedAt: '42 mins ago',
    isSimulated: true,
    hotspotRadius: 85000
  },
  {
    id: 'station-jurong-sg',
    name: 'Jurong Petrochemical Island Station',
    city: 'Jurong Island',
    country: 'Singapore',
    coordinates: [1.2644, 103.7042],
    pm25: 44.8,
    pm10: 89.1,
    aqi: 112,
    risk: 'Moderate',
    status: 'COMPLIANT',
    updatedAt: '18 mins ago',
    isSimulated: true,
    hotspotRadius: 65000
  },
  {
    id: 'station-la-us',
    name: 'Port of Los Angeles Bay Area Monitor',
    city: 'Los Angeles, California',
    country: 'United States',
    coordinates: [33.7432, -118.2673],
    pm25: 22.1,
    pm10: 48.0,
    aqi: 62,
    risk: 'Low',
    status: 'COMPLIANT',
    updatedAt: '1 hour ago',
    isSimulated: true,
    hotspotRadius: 75000
  }
];

