import { Bell, MapPin, Menu } from 'lucide-react';
import SimulatedDataBadge from './SimulatedDataBadge';

export default function Navbar({ onMenuClick, currentStation = 'Vapi GIDC Industrial Cluster' }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-none">
            Environmental Dashboard
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block mt-0.5">
            Real-time ambient air quality & CPCB compliance monitoring
          </p>
        </div>
      </div>

      {/* Right: Station Indicator, Simulated Badge, Notifications, Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Location Display */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span className="truncate max-w-[180px]">{currentStation}</span>
        </div>

        {/* Mandatory Simulated Data Badge */}
        <SimulatedDataBadge />

        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="2 Active Incidents"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs ring-2 ring-emerald-600/30">
            JS
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-none">Jainam S.</div>
            <div className="text-[10px] text-slate-400">EHS Officer</div>
          </div>
        </div>
      </div>
    </header>
  );
}
