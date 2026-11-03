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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            CPCB Statutory Compliance Checker
          </h1>
          <p className="text-xs text-slate-500">
            Official National Ambient Air Quality Standards (NAAQS) Schedule (Gazette Notification 2009)
          </p>
        </div>
        <SimulatedDataBadge />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-slate-800">
              Statutory NAAQS Schedule (Industrial & Residential Areas)
            </span>
          </div>

          <a 
            href="https://cpcb.nic.in/air-quality-standards/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
          >
            <span>CPCB Reference Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Pollutant Parameter</th>
                <th className="p-3.5">Statutory Averaging Period</th>
                <th className="p-3.5">NAAQS 24h / Short Limit</th>
                <th className="p-3.5">Annual Standard (Future Scope)</th>
                <th className="p-3.5 text-right">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {standards.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="p-3.5 font-bold text-slate-800">{row.pollutant}</td>
                  <td className="p-3.5 text-slate-600 font-mono">{row.period}</td>
                  <td className="p-3.5 font-bold text-slate-900">{row.limit}</td>
                  <td className="p-3.5 text-slate-500">{row.annual}</td>
                  <td className="p-3.5 text-right">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${row.status === 'BREACH' ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Data Capture & Legal Compliance Criteria:</span>
          <p className="text-[11px] leading-relaxed">
            Statutory compliance requires discrete 24-hour averages with a minimum of 75% valid data capture (at least 18 hourly observations). Annual standards require arithmetic mean of at least 104 measurements per year at uniform intervals.
          </p>
        </div>
      </div>
    </div>
  );
}
