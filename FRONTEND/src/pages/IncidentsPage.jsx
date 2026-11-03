import { useState, useEffect } from 'react';
import {
  PlusCircle,
  RefreshCw,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  Wrench,
  ShieldCheck,
  Building,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';
import { RECENT_INCIDENTS } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState(RECENT_INCIDENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);

  // CAPA Modal State
  const [selectedIncidentForCapa, setSelectedIncidentForCapa] = useState(null);
  const [capaData, setCapaData] = useState(null);
  const [isCapaLoading, setIsCapaLoading] = useState(false);
  const [capaError, setCapaError] = useState(null);

  const fetchLiveIncidents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/incidents?limit=25`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.incidents && data.incidents.length > 0) {
          // Format live incidents to match table structure
          const formatted = data.incidents.map((dbInc) => ({
            id: dbInc.tracking_code || dbInc.id,
            rawId: dbInc.id,
            tracking_code: dbInc.tracking_code,
            location: dbInc.location_name || dbInc.address || 'Industrial Cluster',
            pollutant: dbInc.incident_type,
            value: dbInc.status,
            standard: 'CPCB NAAQS',
            severity: (dbInc.severity || 'MODERATE').toUpperCase(),
            status: (dbInc.status || 'SUBMITTED').toUpperCase(),
            causeSummary: dbInc.description,
            isDbRecord: true
          }));
          setIncidents(formatted);
          setIsLive(true);
        }
      }
    } catch {
      // Fallback silently to mock incidents
      setIsLive(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveIncidents();
  }, []);

  const handleOpenCapa = async (incident) => {
    setSelectedIncidentForCapa(incident);
    setIsCapaLoading(true);
    setCapaData(null);
    setCapaError(null);

    try {
      // Use rawId (UUID) or tracking code
      const targetId = incident.rawId || incident.tracking_code || incident.id;
      const res = await fetch(`${API_BASE_URL}/capa/${targetId}`);
      if (!res.ok) {
        throw new Error(`Failed to load CAPA details (HTTP ${res.status})`);
      }
      const data = await res.json();
      setCapaData(data);
    } catch (err) {
      console.error('CAPA fetch error:', err);
      setCapaError(err.message || 'Unable to connect to CAPA backend service');
    } finally {
      setIsCapaLoading(false);
    }
  };

  const handleCloseCapa = () => {
    setSelectedIncidentForCapa(null);
    setCapaData(null);
    setCapaError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#202923] tracking-tight">
            Pollution Incident Management & CAPA
          </h1>
          <p className="text-xs text-[#77827B] mt-1">
            Lifecycle tracking of statutory breaches, root cause investigations, and corrective actions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isLive && (
            <span className="text-[10px] font-bold text-[#065F46] bg-[#D1FAE5] border border-[#A7F3D0] px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
              Live Supabase
            </span>
          )}
          <SimulatedDataBadge />
          <button
            type="button"
            onClick={fetchLiveIncidents}
            disabled={isLoading}
            className="p-2 rounded-lg border border-[#E6EBE7] bg-white hover:bg-[#F7F9F7] text-[#77827B] text-xs transition-colors cursor-pointer"
            title="Refresh from Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/report"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#174B35] hover:bg-[#103B2B] text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Incident</span>
          </Link>
        </div>
      </div>

      <div className="rounded-xl bg-white border border-[#E6EBE7] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F7] text-[#77827B] font-semibold border-b border-[#E6EBE7] text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-4">Ticket ID</th>
                <th className="p-4">Station & Cluster</th>
                <th className="p-4">Incident Type / Exceedance</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Status</th>
                <th className="p-4">Root Cause Summary</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6EBE7]">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-[#F7F9F7]/60 transition-colors">
                  <td className="p-4 font-mono font-bold text-[#202923]">{inc.id}</td>
                  <td className="p-4 text-[#77827B]">{inc.location}</td>
                  <td className="p-4">
                    <div className="font-semibold text-[#202923]">{inc.pollutant}</div>
                    {inc.value && inc.value !== inc.status && (
                      <div className="text-[11px] text-[#77827B]">{inc.value}</div>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${
                        inc.severity === 'CRITICAL' || inc.severity === 'HIGH'
                          ? 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]'
                          : 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F7F9F7] text-[#77827B] border border-[#E6EBE7] uppercase">
                      {inc.status}
                    </span>
                  </td>
                  <td className="p-4 text-[#77827B] max-w-xs truncate text-xs" title={inc.causeSummary}>
                    {inc.causeSummary}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenCapa(inc)}
                      className="text-xs font-semibold text-[#174B35] hover:text-[#103B2B] hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>CAPA Details</span>
                      <span>&rarr;</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CAPA Details Modal */}
      {selectedIncidentForCapa && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={handleCloseCapa}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-[#E6EBE7] overflow-hidden space-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-[#F7F9F7] border-b border-[#E6EBE7] flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-[#EAF1EB] text-[#174B35] px-2 py-0.5 rounded border border-[#D5E2D8]">
                    {selectedIncidentForCapa.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      selectedIncidentForCapa.severity === 'CRITICAL' || selectedIncidentForCapa.severity === 'HIGH'
                        ? 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]'
                        : 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                    }`}
                  >
                    {selectedIncidentForCapa.severity}
                  </span>
                </div>
                <h2 className="text-base font-bold text-[#202923]">
                  Corrective & Preventive Action (CAPA) Dossier
                </h2>
                <p className="text-xs text-[#77827B]">
                  Incident: {selectedIncidentForCapa.pollutant} &bull; {selectedIncidentForCapa.location}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseCapa}
                className="p-1.5 rounded-lg text-[#77827B] hover:text-[#202923] hover:bg-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Loading State */}
              {isCapaLoading && (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
                  <Loader2 className="w-7 h-7 text-[#174B35] animate-spin" />
                  <p className="text-xs font-medium text-[#77827B]">
                    Querying Supabase corrective_actions registry...
                  </p>
                </div>
              )}

              {/* Error State */}
              {!isCapaLoading && capaError && (
                <div className="rounded-xl bg-[#FEF2F2] border border-[#FECACA] p-4 flex items-start gap-3 text-xs text-[#991B1B]">
                  <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">Failed to Load CAPA Details</p>
                    <p>{capaError}</p>
                    <button
                      type="button"
                      onClick={() => handleOpenCapa(selectedIncidentForCapa)}
                      className="mt-2 text-xs font-semibold text-[#DC2626] underline cursor-pointer"
                    >
                      Retry Query
                    </button>
                  </div>
                </div>
              )}

              {/* No CAPA Details State */}
              {!isCapaLoading && !capaError && capaData && !capaData.has_capa && (
                <div className="rounded-xl border border-dashed border-[#D5E2D8] bg-[#F7F9F7] p-8 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#EAF1EB] text-[#174B35] flex items-center justify-center mx-auto">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#202923]">
                      No CAPA Details Available
                    </h3>
                    <p className="text-xs text-[#77827B] max-w-md mx-auto">
                      No formal corrective or preventive action plan has been filed for ticket{' '}
                      <span className="font-mono font-semibold text-[#202923]">{selectedIncidentForCapa.id}</span> in the database yet.
                    </p>
                  </div>

                  <div className="pt-2 text-[11px] text-[#77827B] bg-white rounded-lg p-3 border border-[#E6EBE7] inline-block text-left">
                    <p><strong className="text-[#202923]">Current Ticket Status:</strong> {selectedIncidentForCapa.status}</p>
                    <p><strong className="text-[#202923]">Observations:</strong> {selectedIncidentForCapa.causeSummary}</p>
                    <p className="mt-1 text-[10px] text-[#174B35] font-medium">* CAPA records are populated once an EHS rapid response crew transitions an incident to 'In Progress'.</p>
                  </div>
                </div>
              )}

              {/* Active CAPA Details Display */}
              {!isCapaLoading && !capaError && capaData && capaData.has_capa && (
                <div className="space-y-4">
                  {capaData.capa_records.map((action, idx) => (
                    <div key={action.id || idx} className="rounded-xl border border-[#A7F3D0] bg-[#F7FBF8] p-5 space-y-4">
                      {/* Status & Category Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E6EBE7]">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                          <span className="text-xs font-bold text-[#065F46] uppercase tracking-wider">
                            Plan #{idx + 1}: {action.action_type || 'Corrective'} Action
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] uppercase tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
                          Status: {action.status || 'In Progress'}
                        </span>
                      </div>

                      {/* Corrective Action Description */}
                      <div className="space-y-1.5">
                        <div className="text-xs font-semibold text-[#202923] flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5 text-[#174B35]" />
                          <span>Corrective Action Plan</span>
                        </div>
                        <p className="text-xs text-[#202923] font-medium bg-white p-3.5 rounded-lg border border-[#E6EBE7] leading-relaxed">
                          {action.action_description}
                        </p>
                      </div>

                      {/* Preventive Action / Resolution Notes */}
                      <div className="space-y-1.5">
                        <div className="text-xs font-semibold text-[#202923] flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                          <span>Preventive Action & Execution Progress</span>
                        </div>
                        <p className="text-xs text-[#77827B] bg-white p-3.5 rounded-lg border border-[#E6EBE7] leading-relaxed">
                          {action.resolution_notes || 'Preventive recalibration and redundant interlock inspection scheduled.'}
                        </p>
                      </div>

                      {/* Key Metadata Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 bg-white rounded-lg border border-[#E6EBE7] flex items-center gap-2.5 text-xs">
                          <div className="p-1.5 rounded-md bg-[#EAF1EB] text-[#174B35]">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block text-[10px] font-semibold text-[#77827B] uppercase">Responsible Engineer</span>
                            <span className="font-bold text-[#202923]">{action.assigned_to || 'Assigned Officer'}</span>
                          </div>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-[#E6EBE7] flex items-center gap-2.5 text-xs">
                          <div className="p-1.5 rounded-md bg-[#EAF1EB] text-[#174B35]">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block text-[10px] font-semibold text-[#77827B] uppercase">Target Completion Date</span>
                            <span className="font-bold text-[#202923] font-mono">
                              {action.target_date ? new Date(action.target_date).toLocaleDateString() : 'Immediate'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Department Assignment if available */}
                      {capaData.assignments && capaData.assignments.length > 0 && (
                        <div className="p-3 bg-[#EAF1EB]/50 rounded-lg border border-[#D5E2D8] flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <Building className="w-3.5 h-3.5 text-[#174B35]" />
                            <span className="text-[#202923] font-medium">
                              Department: <strong className="text-[#174B35]">{capaData.assignments[0].assigned_department}</strong>
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold text-[#77827B]">
                            Priority: {capaData.assignments[0].priority}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-[#F7F9F7] border-t border-[#E6EBE7] flex items-center justify-between flex-wrap gap-3">
              <span className="text-[11px] text-[#77827B] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#174B35]" />
                <span>Statutory Compliance Registry &bull; CPCB Air Act Section 16</span>
              </span>

              <button
                type="button"
                onClick={handleCloseCapa}
                className="px-4 py-2 rounded-lg bg-[#174B35] hover:bg-[#103B2B] text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
