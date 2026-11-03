import { 
  LayoutDashboard, 
  AlertTriangle, 
  Activity, 
  ShieldCheck, 
  ClipboardList, 
  Settings, 
  Leaf, 
  X,
  Radio
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Report Pollution', path: '/report', icon: AlertTriangle },
  { name: 'Environmental Intelligence', path: '/intelligence', icon: Activity },
  { name: 'Compliance Checker', path: '/compliance', icon: ShieldCheck },
  { name: 'Incident Management', path: '/incidents', icon: ClipboardList },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#202923]/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white text-[#202923] flex flex-col transition-transform duration-200 ease-in-out border-r border-[#E6EBE7] lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#E6EBE7]">
          <NavLink to="/" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-8 h-8 rounded-lg bg-[#EAF1EB] text-[#174B35] flex items-center justify-center border border-[#D5E2D8] transition-transform group-hover:scale-105">
              <Leaf className="w-4 h-4 text-[#174B35]" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-[#202923] block leading-none">
                EcoSentinel <span className="text-[#174B35]">AI</span>
              </span>
              <span className="text-[10px] text-[#77827B] font-medium tracking-wide uppercase block mt-1">
                Environmental Intelligence
              </span>
            </div>
          </NavLink>

          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 rounded-md text-[#77827B] hover:text-[#202923] hover:bg-[#F2F6F3] lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#77827B]">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#174B35] text-white shadow-xs'
                      : 'text-[#77827B] hover:text-[#202923] hover:bg-[#F2F6F3]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#77827B]'}`} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Station Status Widget */}
        <div className="p-4 border-t border-[#E6EBE7]">
          <div className="bg-[#F7F9F7] rounded-lg p-3 border border-[#E6EBE7] text-xs">
            <div className="flex items-center justify-between text-[#202923] mb-1">
              <span className="font-semibold text-xs flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#174B35]" />
                Station Alpha
              </span>
              <span className="w-2 h-2 rounded-full bg-[#174B35]"></span>
            </div>
            <div className="text-[11px] text-[#77827B] truncate">
              Vapi GIDC, Gujarat
            </div>
            <div className="mt-2 pt-2 border-t border-[#E6EBE7] text-[10px] text-[#77827B] flex items-center justify-between">
              <span>CPCB 2009 Standards</span>
              <span className="font-medium text-[#174B35]">Active</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
