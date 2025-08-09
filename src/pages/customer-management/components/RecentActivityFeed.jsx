import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivityFeed = ({ activities }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US')?.format(amount) + ' Ks';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getActivityIcon = (type) => {
    const icons = {
      'new_customer': 'UserPlus',
      'purchase': 'ShoppingCart',
      'payment': 'DollarSign',
      'edit': 'Edit',
      'credit_limit': 'CreditCard'
    };
    return icons?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      'new_customer': 'text-success',
      'purchase': 'text-primary',
      'payment': 'text-success',
      'edit': 'text-secondary',
      'credit_limit': 'text-warning'
    };
    return colors?.[type] || 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <Icon name="Activity" size={20} className="text-muted-foreground" />
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities?.map((activity) => (
          <div key={activity?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
            <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${getActivityColor(activity?.type)}`}>
              <Icon name={getActivityIcon(activity?.type)} size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">
                <span className="font-medium">{activity?.customerName}</span>
                <span className="text-muted-foreground"> {activity?.description}</span>
              </p>
              {activity?.amount && (
                <p className="text-sm font-medium text-primary mt-1">
                  {formatCurrency(activity?.amount)}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {formatTimeAgo(activity?.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <button className="w-full text-sm text-primary hover:text-primary/80 transition-colors">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivityFeed;