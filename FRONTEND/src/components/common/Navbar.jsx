import { Bell, MapPin, Menu } from 'lucide-react';
import SimulatedDataBadge from './SimulatedDataBadge';

export default function Navbar({ onMenuClick, currentStation = 'Vapi GIDC Industrial Cluster' }) {
  return (
    <header className="h-16 bg-white border-b border-[#E6EBE7] sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 rounded-lg text-[#77827B] hover:text-[#202923] hover:bg-[#F2F6F3] lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#202923] leading-none">
            Environmental Dashboard
          </h1>
          <p className="text-xs text-[#77827B] hidden sm:block mt-1">
            Real-time ambient air quality & statutory compliance monitoring
          </p>
        </div>
      </div>

      {/* Right: Station Display, Simulated Badge, Notifications, Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Location Display */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F7F9F7] text-[#202923] text-xs font-medium border border-[#E6EBE7]">
          <MapPin className="w-3.5 h-3.5 text-[#174B35]" />
          <span className="truncate max-w-[180px]">{currentStation}</span>
        </div>

        {/* Mandatory Simulated Data Badge */}
        <SimulatedDataBadge />

        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2 rounded-lg text-[#77827B] hover:text-[#202923] hover:bg-[#F2F6F3] border border-[#E6EBE7] transition-colors"
          title="2 Active Incidents"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B91C1C]"></span>
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E6EBE7]">
          <div className="w-8 h-8 rounded-full bg-[#EAF1EB] text-[#174B35] border border-[#D5E2D8] flex items-center justify-center font-bold text-xs">
            JS
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-[#202923] leading-none">Jainam S.</div>
            <div className="text-[10px] text-[#77827B] mt-0.5">EHS Lead</div>
          </div>
        </div>
      </div>
    </header>
  );
}
