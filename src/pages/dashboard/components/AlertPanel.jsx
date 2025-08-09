import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertPanel = ({ alerts = [], title = "Stock Alerts", onViewAll }) => {
  const getAlertIcon = (type) => {
    const icons = {
      'low-stock': 'AlertTriangle',
      'out-of-stock': 'XCircle',
      'expiring': 'Clock',
      'payment': 'CreditCard'
    };
    return icons?.[type] || 'Bell';
  };

  const getAlertColor = (type) => {
    const colors = {
      'low-stock': 'text-warning',
      'out-of-stock': 'text-error',
      'expiring': 'text-secondary',
      'payment': 'text-primary'
    };
    return colors?.[type] || 'text-muted-foreground';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {alerts?.length > 3 && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All
          </Button>
        )}
      </div>
      <div className="space-y-3">
        {alerts?.slice(0, 5)?.map((alert) => (
          <div key={alert?.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
            <Icon 
              name={getAlertIcon(alert?.type)} 
              size={16} 
              className={getAlertColor(alert?.type)}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {alert?.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {alert?.message}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatTimeAgo(alert?.timestamp)}
              </p>
            </div>
            {alert?.actionable && (
              <Button variant="outline" size="xs">
                Fix
              </Button>
            )}
          </div>
        ))}
        
        {alerts?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No alerts at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertPanel;