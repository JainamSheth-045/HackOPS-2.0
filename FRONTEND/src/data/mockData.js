/**
 * EcoSentinel AI - Demonstration Environmental Telemetry & Compliance Data
 * 
 * NOTICE: All readings contained herein are SIMULATED values generated for
 * hackathon demonstration and testing purposes. They do NOT represent physical
 * certified CAAQMS continuous monitoring telemetry.
 */

export const DEMO_STATIONS = [
  {
    id: 'sta-vapi-01',
    code: 'STA-GJ-VAPI-01',
    name: 'Station Alpha - Chemical Processing Sector',
    cluster: 'Vapi GIDC Industrial Area',
    state: 'Gujarat',
    coordinates: '20.3716° N, 72.9106° E',
    status: 'ACTIVE',
    lastSync: 'Just now',
    currentAQI: 164,
    aqiBand: 'Moderate',
    statutoryStatus: 'BREACH'
  },
  {
    id: 'sta-mane-02',
    code: 'STA-HR-MANE-02',
    name: 'Station Beta - Auto Manufacturing Belt',
    cluster: 'Manesar IMT Sector 8',
    state: 'Haryana',
    coordinates: '28.3588° N, 76.9388° E',
    status: 'ACTIVE',
    lastSync: '2 mins ago',
    currentAQI: 218,
    aqiBand: 'Poor',
    statutoryStatus: 'BREACH'
  },
  {
    id: 'sta-tara-03',
    code: 'STA-MH-TARA-03',
    name: 'Station Gamma - Heavy Engineering & Textile',
    cluster: 'Tarapur MIDC Zone B',
    state: 'Maharashtra',
    coordinates: '19.8252° N, 72.6934° E',
    status: 'MAINTENANCE',
    lastSync: '14 mins ago',
    currentAQI: 88,
    aqiBand: 'Satisfactory',
    statutoryStatus: 'COMPLIANT'
  }
];

export const CURRENT_TELEMETRY = {
  stationId: 'sta-vapi-01',
  stationName: 'Station Alpha - Vapi GIDC',
  isSimulated: true,
  dataOrigin: 'SIMULATED',
  timestamp: new Date().toISOString(),
  
  // Current values & statutory comparisons
  pm25: {
    current: 54.2,
    unit: 'µg/m³',
    standardPeriod: '24 Hours',
    cpcbLimit: 60.0,
    utilizationPercent: 90.3,
    status: 'WARNING', // Close to 60 limit
    subIndex: 114
  },
  pm10: {
    current: 118.5,
    unit: 'µg/m³',
    standardPeriod: '24 Hours',
    cpcbLimit: 100.0,
    utilizationPercent: 118.5,
    status: 'BREACH', // Exceeds 100 limit!
    subIndex: 164
  },
  so2: {
    current: 42.1,
    unit: 'µg/m³',
    standardPeriod: '24 Hours',
    cpcbLimit: 80.0,
    utilizationPercent: 52.6,
    status: 'COMPLIANT',
    subIndex: 53
  },
  no2: {
    current: 51.3,
    unit: 'µg/m³',
    standardPeriod: '24 Hours',
    cpcbLimit: 80.0,
    utilizationPercent: 64.1,
    status: 'COMPLIANT',
    subIndex: 64
  },
  co: {
    current: 1.4,
    unit: 'mg/m³',
    standardPeriod: '8 Hours',
    cpcbLimit: 2.0,
    utilizationPercent: 70.0,
    status: 'COMPLIANT',
    subIndex: 70
  },
  o3: {
    current: 48.0,
    unit: 'µg/m³',
    standardPeriod: '8 Hours',
    cpcbLimit: 100.0,
    utilizationPercent: 48.0,
    status: 'COMPLIANT',
    subIndex: 48
  },

  // CPCB National AQI (2014) Summary
  aqi: {
    score: 164,
    category: 'Moderate',
    prominentPollutant: 'PM10',
    color: '#EAB308',
    description: 'May cause breathing discomfort to people with asthma, lung, and heart diseases.'
  },

  // Statutory NAAQS Compliance (2009)
  statutoryCompliance: {
    isCompliant: false,
    status: 'STATUTORY BREACH',
    breachedPollutants: ['PM10'],
    statutoryNotice: 'Rolling 24-hr PM10 concentration (118.5 µg/m³) exceeds the mandatory CPCB NAAQS statutory limit of 100 µg/m³ under the Air Act (1981).'
  }
};

// 24-Hour hourly historical telemetry for Recharts
export const HOURLY_TRENDS_24H = [
  { time: '09:00', pm25: 42, pm10: 84, so2: 30, no2: 38, pm25Limit: 60, pm10Limit: 100 },
  { time: '10:00', pm25: 45, pm10: 88, so2: 32, no2: 40, pm25Limit: 60, pm10Limit: 100 },
  { time: '11:00', pm25: 48, pm10: 92, so2: 35, no2: 44, pm25Limit: 60, pm10Limit: 100 },
  { time: '12:00', pm25: 50, pm10: 96, so2: 38, no2: 46, pm25Limit: 60, pm10Limit: 100 },
  { time: '13:00', pm25: 49, pm10: 95, so2: 36, no2: 45, pm25Limit: 60, pm10Limit: 100 },
  { time: '14:00', pm25: 46, pm10: 90, so2: 34, no2: 42, pm25Limit: 60, pm10Limit: 100 },
  { time: '15:00', pm25: 48, pm10: 94, so2: 35, no2: 44, pm25Limit: 60, pm10Limit: 100 },
  { time: '16:00', pm25: 52, pm10: 99, so2: 38, no2: 48, pm25Limit: 60, pm10Limit: 100 },
  { time: '17:00', pm25: 56, pm10: 105, so2: 40, no2: 52, pm25Limit: 60, pm10Limit: 100 },
  { time: '18:00', pm25: 58, pm10: 110, so2: 42, no2: 55, pm25Limit: 60, pm10Limit: 100 },
  { time: '19:00', pm25: 61, pm10: 116, so2: 44, no2: 58, pm25Limit: 60, pm10Limit: 100 },
  { time: '20:00', pm25: 64, pm10: 122, so2: 46, no2: 60, pm25Limit: 60, pm10Limit: 100 },
  { time: '21:00', pm25: 62, pm10: 120, so2: 45, no2: 57, pm25Limit: 60, pm10Limit: 100 },
  { time: '22:00', pm25: 59, pm10: 115, so2: 43, no2: 54, pm25Limit: 60, pm10Limit: 100 },
  { time: '23:00', pm25: 57, pm10: 112, so2: 41, no2: 52, pm25Limit: 60, pm10Limit: 100 },
  { time: '00:00', pm25: 55, pm10: 108, so2: 39, no2: 49, pm25Limit: 60, pm10Limit: 100 },
  { time: '01:00', pm25: 52, pm10: 104, so2: 38, no2: 47, pm25Limit: 60, pm10Limit: 100 },
  { time: '02:00', pm25: 50, pm10: 102, so2: 37, no2: 45, pm25Limit: 60, pm10Limit: 100 },
  { time: '03:00', pm25: 48, pm10: 98, so2: 36, no2: 44, pm25Limit: 60, pm10Limit: 100 },
  { time: '04:00', pm25: 49, pm10: 101, so2: 37, no2: 46, pm25Limit: 60, pm10Limit: 100 },
  { time: '05:00', pm25: 51, pm10: 106, so2: 39, no2: 48, pm25Limit: 60, pm10Limit: 100 },
  { time: '06:00', pm25: 53, pm10: 112, so2: 40, no2: 50, pm25Limit: 60, pm10Limit: 100 },
  { time: '07:00', pm25: 55, pm10: 115, so2: 41, no2: 51, pm25Limit: 60, pm10Limit: 100 },
  { time: '08:00', pm25: 54, pm10: 118, so2: 42, no2: 51, pm25Limit: 60, pm10Limit: 100 }
];

export const RECENT_INCIDENTS = [
  {
    id: 'INC-2026-081',
    pollutant: 'PM10',
    value: '118.5 µg/m³',
    standard: '100.0 µg/m³ (24h)',
    severity: 'HIGH',
    status: 'OPEN',
    location: 'Station Alpha - Vapi GIDC',
    detectedAt: '25 mins ago',
    causeSummary: 'Suspected baghouse dust filtration leak in Sector 2 crushing line.'
  },
  {
    id: 'INC-2026-079',
    pollutant: 'SO2',
    value: '94.2 µg/m³',
    standard: '80.0 µg/m³ (24h)',
    severity: 'MODERATE',
    status: 'IN_PROGRESS',
    location: 'Station Gamma - Tarapur MIDC',
    detectedAt: '3 hours ago',
    causeSummary: 'Alkali scrubber circulation pump pressure drop during fuel oil boiler transition.'
  },
  {
    id: 'INC-2026-074',
    pollutant: 'PM2.5',
    value: '78.0 µg/m³',
    standard: '60.0 µg/m³ (24h)',
    severity: 'MODERATE',
    status: 'MITIGATED',
    location: 'Station Beta - Manesar IMT',
    detectedAt: 'Yesterday',
    causeSummary: 'Fugitive dust plume from unpaved raw material loading dock; water misting deployed.'
  }
];

export const CPCB_SUB_INDICES = [
  { pollutant: 'PM2.5', label: 'Fine Particulates', value: 54.2, unit: 'µg/m³', subIndex: 114, band: 'Moderate', color: 'text-amber-600', bg: 'bg-amber-50' },
  { pollutant: 'PM10', label: 'Respirable Dust', value: 118.5, unit: 'µg/m³', subIndex: 164, band: 'Moderate (Prominent)', color: 'text-amber-700', bg: 'bg-amber-100 font-semibold' },
  { pollutant: 'SO2', label: 'Sulphur Dioxide', value: 42.1, unit: 'µg/m³', subIndex: 53, band: 'Satisfactory', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { pollutant: 'NO2', label: 'Nitrogen Dioxide', value: 51.3, unit: 'µg/m³', subIndex: 64, band: 'Satisfactory', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { pollutant: 'CO', label: 'Carbon Monoxide', value: 1.4, unit: 'mg/m³', subIndex: 70, band: 'Satisfactory', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { pollutant: 'O3', label: 'Ground Ozone', value: 48.0, unit: 'µg/m³', subIndex: 48, band: 'Good', color: 'text-green-600', bg: 'bg-green-50' }
];

