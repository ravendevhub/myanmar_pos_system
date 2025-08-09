import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const AlertNotificationPanel = ({ className = '' }) => {
  const [alerts, setAlerts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isToggleVisible, setIsToggleVisible] = useState(true);

  const mockAlerts = [
  {
    id: 1,
    type: 'warning',
    title: 'Low Stock Alert',
    message: 'Rice (5kg) - Only 3 units remaining',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    priority: 'high',
    actionable: true,
    action: {
      label: 'Reorder',
      path: '/product-management'
    }
  },
  {
    id: 2,
    type: 'error',
    title: 'Payment Processing Error',
    message: 'Transaction #POS-2025-0108-001 failed to process',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    priority: 'critical',
    actionable: true,
    action: {
      label: 'Retry',
      callback: () => console.log('Retrying payment...')
    }
  },
  {
    id: 3,
    type: 'success',
    title: 'Daily Sales Target Achieved',
    message: 'Congratulations! Today\'s target of 500,000 MMK reached',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    priority: 'medium',
    actionable: false
  },
  {
    id: 4,
    type: 'info',
    title: 'System Backup Completed',
    message: 'Daily backup completed successfully at 2:00 AM',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
    priority: 'low',
    actionable: false
  }];


  useEffect(() => {
    setAlerts(mockAlerts);
  }, []);

  const getAlertIcon = (type) => {
    const icons = {
      warning: 'AlertTriangle',
      error: 'XCircle',
      success: 'CheckCircle',
      info: 'Info'
    };
    return icons?.[type] || 'Bell';
  };

  const getAlertColors = (type, priority) => {
    const baseColors = {
      warning: {
        bg: 'bg-warning/10',
        border: 'border-warning/20',
        icon: 'text-warning',
        text: 'text-warning-foreground'
      },
      error: {
        bg: 'bg-error/10',
        border: 'border-error/20',
        icon: 'text-error',
        text: 'text-error-foreground'
      },
      success: {
        bg: 'bg-success/10',
        border: 'border-success/20',
        icon: 'text-success',
        text: 'text-success-foreground'
      },
      info: {
        bg: 'bg-secondary/10',
        border: 'border-secondary/20',
        icon: 'text-secondary',
        text: 'text-secondary-foreground'
      }
    };

    return baseColors?.[type] || baseColors?.info;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleDismiss = (alertId) => {
    setAlerts(alerts?.filter((alert) => alert?.id !== alertId));
  };

  const handleAction = (alert) => {
    if (alert?.action?.callback) {
      alert?.action?.callback();
    } else if (alert?.action?.path) {
      window.location.href = alert?.action?.path;
    }
    handleDismiss(alert?.id);
  };

  const toggleNotifications = () => {
    setIsVisible(!isVisible);
  };

  const criticalAlerts = alerts?.filter((alert) => alert?.priority === 'critical');
  const highPriorityAlerts = alerts?.filter((alert) => alert?.priority === 'high');
  const otherAlerts = alerts?.filter((alert) => !['critical', 'high']?.includes(alert?.priority));

  const sortedAlerts = [...criticalAlerts, ...highPriorityAlerts, ...otherAlerts];

  const isMobile = window.innerWidth < 768;

  const NotificationToggle = () =>
  <div className="fixed top-20 right-6 z-40">
      <Button
      variant="outline"
      size="sm"
      onClick={toggleNotifications}
      className="bg-card border-border shadow-md">

        <div className="relative">
          <Icon name="Bell" size={16} />
          {alerts?.length > 0 &&
        <span className="absolute -top-2 -right-2 bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {alerts?.length > 99 ? '99+' : alerts?.length}
            </span>
        }
        </div>
        <span className="ml-2">
          {isVisible ? 'Hide' : 'Show'} Alerts
        </span>
      </Button>
    </div>;


  if (!isVisible) {
    return <NotificationToggle />;
  }

  if (isMobile) {
    return (
      <>
        <NotificationToggle />
        {isVisible &&
        <div className={`fixed top-32 left-4 right-4 z-50 ${className}`}>
            {sortedAlerts?.slice(0, 2)?.map((alert) => {
            const colors = getAlertColors(alert?.type, alert?.priority);
            return (
              <div
                key={alert?.id}
                className={`mb-3 p-4 rounded-lg border ${colors?.bg} ${colors?.border} shadow-card animate-slide-in`}>

                  <div className="flex items-start space-x-3">
                    <Icon
                    name={getAlertIcon(alert?.type)}
                    size={20}
                    className={colors?.icon} />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        {alert?.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert?.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(alert?.timestamp)}
                        </span>
                        <div className="flex space-x-2">
                          {alert?.actionable &&
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleAction(alert)}>

                              {alert?.action?.label}
                            </Button>
                        }
                          <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleDismiss(alert?.id)}>

                            <Icon name="X" size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>);

          })}
          </div>
        }
      </>);

  }

  return (
    <>
      <NotificationToggle />
      {isVisible &&
      <div className={`fixed top-32 right-6 w-96 z-50 ${className}`}>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedAlerts?.map((alert) => {
            const colors = getAlertColors(alert?.type, alert?.priority);
            return (
              <div
                key={alert?.id}
                className={`p-4 rounded-lg border ${colors?.bg} ${colors?.border} shadow-card animate-fade-in`}>

                  <div className="flex items-start space-x-3">
                    <Icon
                    name={getAlertIcon(alert?.type)}
                    size={20}
                    className={colors?.icon} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-foreground">
                          {alert?.title}
                        </h4>
                        <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleDismiss(alert?.id)}
                        className="ml-2">

                          <Icon name="X" size={14} />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {alert?.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(alert?.timestamp)}
                        </span>
                        {alert?.actionable &&
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleAction(alert)}>

                            {alert?.action?.label}
                          </Button>
                      }
                      </div>
                    </div>
                  </div>
                </div>);

          })}
          </div>
          {alerts?.length > 3 &&
        <div className="mt-3 text-center">
              <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log('Show all alerts')}>

                View All Alerts ({alerts?.length})
              </Button>
            </div>
        }
        </div>
      }
    </>);

};

export default AlertNotificationPanel;