import React from 'react';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue }) => {
  const isPositive = trend === 'up';
  
  return (
    <div className="glass-card flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-muted uppercase tracking-wider">{title}</h3>
          <div className="avatar" style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', border: '1px solid rgba(20, 184, 166, 0.2)' }}>
            {Icon && <Icon size={18} className="text-secondary" />}
          </div>
        </div>
        <div className="text-h2 font-bold text-main tracking-tight mb-2">{value}</div>
      </div>
      {trendValue && (
        <div className={`text-xs font-semibold flex items-center gap-1 ${isPositive ? 'text-success' : 'text-danger'}`}>
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white/5">
            {isPositive ? '↑' : '↓'}
          </span>
          <span>{trendValue}</span>
          <span className="text-muted font-normal ml-0.5">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
