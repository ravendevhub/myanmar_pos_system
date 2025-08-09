import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentTransactionAlerts = ({ alerts }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('my-MM', {
      style: 'currency',
      currency: 'MMK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount)?.replace('MMK', 'Ks');
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp)?.toLocaleDateString('en-GB');
  };

  const getAlertIcon = (type) => {
    const icons = {
      payment_failed: 'XCircle',
      low_stock: 'AlertTriangle',
      high_value: 'TrendingUp',
      refund: 'RotateCcw',
      credit_limit: 'CreditCard'
    };
    return icons?.[type] || 'Bell';
  };

  const getAlertColor = (type, priority) => {
    if (priority === 'high') {
      return {
        bg: 'bg-error/10',
        border: 'border-error/20',
        icon: 'text-error',
        text: 'text-error-foreground'
      };
    }
    
    const colors = {
      payment_failed: {
        bg: 'bg-error/10',
        border: 'border-error/20',
        icon: 'text-error',
        text: 'text-error-foreground'
      },
      low_stock: {
        bg: 'bg-warning/10',
        border: 'border-warning/20',
        icon: 'text-warning',
        text: 'text-warning-foreground'
      },
      high_value: {
        bg: 'bg-success/10',
        border: 'border-success/20',
        icon: 'text-success',
        text: 'text-success-foreground'
      },
      refund: {
        bg: 'bg-secondary/10',
        border: 'border-secondary/20',
        icon: 'text-secondary',
        text: 'text-secondary-foreground'
      },
      credit_limit: {
        bg: 'bg-warning/10',
        border: 'border-warning/20',
        icon: 'text-warning',
        text: 'text-warning-foreground'
      }
    };
    
    return colors?.[type] || {
      bg: 'bg-muted/10',
      border: 'border-border',
      icon: 'text-muted-foreground',
      text: 'text-foreground'
    };
  };

  const handleAlertAction = (alert) => {
    console.log('Alert action:', alert);
  };

  const handleDismissAlert = (alertId) => {
    console.log('Dismiss alert:', alertId);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Alerts</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">
            {alerts?.filter(a => !a?.dismissed)?.length} active
          </span>
          <Icon name="Bell" size={20} className="text-muted-foreground" />
        </div>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="mx-auto text-success mb-3" />
            <p className="text-sm text-muted-foreground">No alerts at the moment</p>
            <p className="text-xs text-muted-foreground mt-1">All systems running smoothly</p>
          </div>
        ) : (
          alerts?.map((alert) => {
            const colors = getAlertColor(alert?.type, alert?.priority);
            
            return (
              <div
                key={alert?.id}
                className={`p-3 rounded-lg border ${colors?.bg} ${colors?.border} ${
                  alert?.priority === 'high' ? 'ring-1 ring-error/20' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Icon 
                    name={getAlertIcon(alert?.type)} 
                    size={18} 
                    className={colors?.icon}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-medium text-foreground">
                        {alert?.title}
                      </h4>
                      {alert?.priority === 'high' && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-error text-error-foreground">
                          High
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {alert?.message}
                    </p>
                    
                    {alert?.amount && (
                      <p className="text-sm font-medium text-foreground mb-2">
                        Amount: {formatCurrency(alert?.amount)}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(alert?.timestamp)}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        {alert?.actionable && (
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => handleAlertAction(alert)}
                          >
                            {alert?.actionLabel || 'View'}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleDismissAlert(alert?.id)}
                        >
                          <Icon name="X" size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {alerts?.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            iconName="Archive"
          >
            Clear All Alerts
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentTransactionAlerts;