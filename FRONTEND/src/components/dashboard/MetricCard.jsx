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
          badgeBg: 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]',
          badgeText: 'Statutory Breach',
          barColor: 'bg-[#B91C1C]',
          borderColor: 'border-[#FECACA]',
          iconBg: 'bg-[#FEE2E2] text-[#B91C1C]'
        };
      case 'WARNING':
        return {
          badgeBg: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
          badgeText: 'Near Threshold',
          barColor: 'bg-[#D97706]',
          borderColor: 'border-[#FDE68A]',
          iconBg: 'bg-[#FEF3C7] text-[#92400E]'
        };
      default:
        return {
          badgeBg: 'bg-[#EAF1EB] text-[#174B35] border-[#D5E2D8]',
          badgeText: 'Compliant',
          barColor: 'bg-[#174B35]',
          borderColor: 'border-[#E6EBE7]',
          iconBg: 'bg-[#EAF1EB] text-[#174B35]'
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div className={`rounded-xl bg-white border ${styles.borderColor} p-5 shadow-xs transition-shadow hover:shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold tracking-wider text-[#77827B] uppercase block">
            {title}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-[#202923] tracking-tight">
              {value}
            </span>
            <span className="text-xs font-medium text-[#77827B]">
              {unit}
            </span>
          </div>
        </div>

        <div className={`p-2.5 rounded-lg ${styles.iconBg}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      {/* CPCB Standard Info */}
      <div className="mt-4 pt-3 border-t border-[#E6EBE7]">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[#77827B] text-[11px]">CPCB Standard ({standard})</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wide ${styles.badgeBg}`}>
            {styles.badgeText}
          </span>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-[#E6EBE7] overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${styles.barColor}`}
            style={{ width: `${Math.min(utilization || 0, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#77827B] mt-2">
          <span>{description || '24-hr Rolling Average'}</span>
          <span className="font-semibold text-[#202923]">{utilization}% of limit</span>
        </div>
      </div>
    </div>
  );
}
