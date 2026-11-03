import { 
  LayoutDashboard, 
  AlertTriangle, 
  Activity, 
  ShieldCheck, 
  ClipboardList, 
  Settings, 
  Leaf, 
  X
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
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#092215] text-slate-200 flex flex-col transition-transform duration-300 ease-in-out border-r border-emerald-900/40 shadow-2xl lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-emerald-900/50 bg-[#06180f]">
          <NavLink to="/" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/50 ring-2 ring-emerald-400/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">
                EcoSentinel <span className="text-emerald-400">AI</span>
              </span>
              <span className="text-[10px] text-emerald-400/70 font-medium tracking-wider uppercase block">
                Compliance OS
              </span>
            </div>
          </NavLink>

          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-900/50 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-500/70">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-700/80 text-white shadow-md shadow-emerald-950 ring-1 ring-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-emerald-900/40'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Status Panel */}
        <div className="p-4 border-t border-emerald-900/50 bg-[#06180f]/80">
          <div className="bg-[#0b291a] rounded-xl p-3 border border-emerald-800/40 text-xs">
            <div className="flex items-center justify-between text-slate-300 mb-1">
              <span className="font-semibold text-emerald-300">Station Alpha</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              Vapi GIDC Industrial Area
            </div>
            <div className="mt-2 pt-2 border-t border-emerald-800/40 text-[10px] text-emerald-400/80 flex items-center justify-between">
              <span>Standard: CPCB 2009</span>
              <span className="font-semibold text-white">Live Demo</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

