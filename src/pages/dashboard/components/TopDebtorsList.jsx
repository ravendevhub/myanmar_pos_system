import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TopDebtorsList = ({ debtors = [], title = "Top Debtors", onViewCustomer }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(value) + ' Ks';
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDebtorRisk = (amount) => {
    if (amount >= 500000) return { level: 'high', color: 'text-error', bg: 'bg-error/10' };
    if (amount >= 200000) return { level: 'medium', color: 'text-warning', bg: 'bg-warning/10' };
    return { level: 'low', color: 'text-success', bg: 'bg-success/10' };
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="space-y-3">
        {debtors?.map((debtor, index) => {
          const risk = getDebtorRisk(debtor?.outstandingAmount);
          
          return (
            <div key={debtor?.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">#{index + 1}</span>
              </div>
              <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <Icon name="User" size={20} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {debtor?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last purchase: {formatDate(debtor?.lastPurchase)}
                </p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${risk?.bg} ${risk?.color}`}>
                  {formatCurrency(debtor?.outstandingAmount)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {debtor?.daysPending} days pending
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="xs"
                onClick={() => onViewCustomer && onViewCustomer(debtor?.id)}
              >
                <Icon name="ExternalLink" size={14} />
              </Button>
            </div>
          );
        })}
        
        {debtors?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Users" size={48} className="text-success mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No outstanding debts</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopDebtorsList;