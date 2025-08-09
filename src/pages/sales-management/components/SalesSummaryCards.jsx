import React from 'react';
import Icon from '../../../components/AppIcon';

const SalesSummaryCards = ({ summaryData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('my-MM', {
      style: 'currency',
      currency: 'MMK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount)?.replace('MMK', 'Ks');
  };

  const cards = [
    {
      title: 'Today\'s Sales',
      value: formatCurrency(summaryData?.todaySales),
      change: summaryData?.todayChange,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20'
    },
    {
      title: 'Total Vouchers',
      value: summaryData?.totalVouchers?.toString(),
      change: summaryData?.vouchersChange,
      icon: 'Receipt',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    {
      title: 'Pending Payments',
      value: formatCurrency(summaryData?.pendingPayments),
      change: summaryData?.pendingChange,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20'
    },
    {
      title: 'Average Sale',
      value: formatCurrency(summaryData?.averageSale),
      change: summaryData?.averageChange,
      icon: 'BarChart3',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20'
    }
  ];

  const getChangeColor = (change) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return 'TrendingUp';
    if (change < 0) return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="space-y-4">
      {cards?.map((card, index) => (
        <div
          key={index}
          className={`bg-card border rounded-lg p-4 ${card?.borderColor}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {card?.title}
              </p>
              <p className="text-2xl font-bold text-foreground mb-2">
                {card?.value}
              </p>
              <div className="flex items-center space-x-1">
                <Icon 
                  name={getChangeIcon(card?.change)} 
                  size={14} 
                  className={getChangeColor(card?.change)}
                />
                <span className={`text-sm font-medium ${getChangeColor(card?.change)}`}>
                  {Math.abs(card?.change)}%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs yesterday
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${card?.bgColor}`}>
              <Icon name={card?.icon} size={24} className={card?.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SalesSummaryCards;