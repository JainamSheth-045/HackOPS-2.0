export default function MetricCard({
  title,
  value,
  unit,
  standard,
  utilization,
  status, // 'COMPLIANT' | 'WARNING' | 'BREACH'
  icon: Icon,
  description
}) {
  const getStatusStyles = () => {
    switch (status) {
      case 'BREACH':
        return {
          badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
          badgeText: 'Statutory Breach',
          barColor: 'bg-rose-500',
          borderColor: 'border-rose-200',
          iconBg: 'bg-rose-50 text-rose-600',
          glow: 'ring-1 ring-rose-500/20'
        };
      case 'WARNING':
        return {
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
          badgeText: 'Near Threshold',
          barColor: 'bg-amber-500',
          borderColor: 'border-amber-200',
          iconBg: 'bg-amber-50 text-amber-600',
          glow: 'ring-1 ring-amber-500/20'
        };
      default:
        return {
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          badgeText: 'Compliant',
          barColor: 'bg-emerald-500',
          borderColor: 'border-slate-200',
          iconBg: 'bg-emerald-50 text-emerald-600',
          glow: ''
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div className={`bg-white rounded-2xl border ${styles.borderColor} p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden ${styles.glow}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            {title}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {value}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {unit}
            </span>
          </div>
        </div>

        <div className={`p-2.5 rounded-xl ${styles.iconBg}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      {/* CPCB Standard Info */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-500">CPCB Limit ({standard})</span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${styles.badgeBg}`}>
            {styles.badgeText}
          </span>
        </div>

        {/* Utilization Bar */}
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${styles.barColor}`}
            style={{ width: `${Math.min(utilization || 0, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
          <span>{description || '24-hr Rolling Average'}</span>
          <span className="font-semibold text-slate-600">{utilization}% of limit</span>
        </div>
      </div>
    </div>
  );
}
