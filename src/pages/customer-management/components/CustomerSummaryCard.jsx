import React from 'react';
import Icon from '../../../components/AppIcon';

const CustomerSummaryCard = ({ title, value, subtitle, icon, trend, trendValue, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary/10 border-primary/20 text-primary',
    success: 'bg-success/10 border-success/20 text-success',
    warning: 'bg-warning/10 border-warning/20 text-warning',
    error: 'bg-error/10 border-error/20 text-error'
  };

  const iconColorClasses = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error'
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-card transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses?.[color]}`}>
          <Icon name={icon} size={24} className={iconColorClasses?.[color]} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-muted-foreground'
          }`}>
            <Icon 
              name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
              size={16} 
            />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
        <p className="text-sm font-medium text-foreground mb-1">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default CustomerSummaryCard;