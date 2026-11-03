import { BookOpen, ExternalLink, AlertOctagon } from 'lucide-react';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';

export default function CompliancePage() {
  const standards = [
    { pollutant: 'PM2.5 (Fine Particulate Matter)', period: '24 Hours', limit: '60 µg/m³', annual: '40 µg/m³', status: 'COMPLIANT' },
    { pollutant: 'PM10 (Respirable Particulate Dust)', period: '24 Hours', limit: '100 µg/m³', annual: '60 µg/m³', status: 'BREACH' },
    { pollutant: 'SO2 (Sulphur Dioxide)', period: '24 Hours', limit: '80 µg/m³', annual: '50 µg/m³', status: 'COMPLIANT' },
    { pollutant: 'NO2 (Nitrogen Dioxide)', period: '24 Hours', limit: '80 µg/m³', annual: '40 µg/m³', status: 'COMPLIANT' },
    { pollutant: 'CO (Carbon Monoxide)', period: '8 Hours / 1 Hour', limit: '2.0 / 4.0 mg/m³', annual: 'N/A', status: 'COMPLIANT' },
    { pollutant: 'O3 (Ground-level Ozone)', period: '8 Hours / 1 Hour', limit: '100 / 180 µg/m³', annual: 'N/A', status: 'COMPLIANT' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#202923] tracking-tight">
            CPCB Statutory Compliance Checker
          </h1>
          <p className="text-xs text-[#77827B] mt-1">
            Official National Ambient Air Quality Standards (NAAQS) Schedule (Gazette Notification 2009)
          </p>
        </div>
        <SimulatedDataBadge />
      </div>

      <div className="rounded-xl bg-white border border-[#E6EBE7] overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-[#E6EBE7] bg-[#F7F9F7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#174B35]" />
            <span className="text-xs font-bold text-[#202923] uppercase tracking-wider">
              Statutory NAAQS Schedule (Industrial & Residential Areas)
            </span>
          </div>

          <a 
            href="https://cpcb.nic.in/air-quality-standards/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#174B35] hover:text-[#103B2B] inline-flex items-center gap-1.5"
          >
            <span>CPCB Reference Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F7] text-[#77827B] font-semibold border-b border-[#E6EBE7] text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-4">Pollutant Parameter</th>
                <th className="p-4">Averaging Period</th>
                <th className="p-4">NAAQS 24h / Short Limit</th>
                <th className="p-4">Annual Standard (Future Scope)</th>
                <th className="p-4 text-right">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6EBE7]">
              {standards.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F7F9F7]/60 transition-colors">
                  <td className="p-4 font-semibold text-[#202923]">{row.pollutant}</td>
                  <td className="p-4 text-[#77827B] font-mono">{row.period}</td>
                  <td className="p-4 font-bold text-[#202923]">{row.limit}</td>
                  <td className="p-4 text-[#77827B]">{row.annual}</td>
                  <td className="p-4 text-right">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      row.status === 'BREACH' 
                        ? 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]' 
                        : 'bg-[#EAF1EB] text-[#174B35] border-[#D5E2D8]'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#EAF1EB] border border-[#D5E2D8] text-[#202923] text-xs flex items-start gap-3">
        <AlertOctagon className="w-4 h-4 text-[#174B35] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Data Capture & Legal Compliance Criteria:</span>
          <p className="text-xs text-[#77827B] leading-relaxed">
            Statutory compliance requires discrete 24-hour averages with a minimum of 75% valid data capture (at least 18 hourly observations). Annual standards require arithmetic mean of at least 104 measurements per year at uniform intervals.
          </p>
        </div>
      </div>
    </div>
  );
}
