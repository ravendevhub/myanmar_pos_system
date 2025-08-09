import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TopDebtorsList = ({ debtors, onViewCustomer, onRecordPayment }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US')?.format(amount) + ' Ks';
  };

  const getDaysSinceLastPurchase = (lastPurchase) => {
    const days = Math.floor((new Date() - new Date(lastPurchase)) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Top Debtors</h3>
        <Icon name="AlertTriangle" size={20} className="text-warning" />
      </div>
      <div className="space-y-4">
        {debtors?.map((debtor, index) => {
          const daysSince = getDaysSinceLastPurchase(debtor?.lastPurchase);
          const isOverdue = daysSince > 30;
          
          return (
            <div 
              key={debtor?.id} 
              className={`p-4 rounded-lg border transition-colors hover:bg-muted/30 ${
                isOverdue ? 'bg-error/5 border-error/20' : 'bg-warning/5 border-warning/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isOverdue ? 'bg-error text-error-foreground' : 'bg-warning text-warning-foreground'
                  }`}>
                    #{index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{debtor?.name}</h4>
                    <p className="text-sm text-muted-foreground">{debtor?.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${isOverdue ? 'text-error' : 'text-warning'}`}>
                    {formatCurrency(debtor?.outstandingDue)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {daysSince} days ago
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Total Purchases: {formatCurrency(debtor?.totalPurchases)}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onViewCustomer(debtor)}
                    iconName="Eye"
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => onRecordPayment(debtor)}
                    iconName="DollarSign"
                    className="text-success border-success hover:bg-success hover:text-success-foreground"
                  >
                    Pay
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <Button variant="ghost" size="sm" className="w-full">
          View All Debtors
          <Icon name="ArrowRight" size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default TopDebtorsList;