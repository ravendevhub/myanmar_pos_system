import React from 'react';
import Icon from '../../../components/AppIcon';

const PaymentMethodBreakdown = ({ paymentData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('my-MM', {
      style: 'currency',
      currency: 'MMK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount)?.replace('MMK', 'Ks');
  };

  const getMethodIcon = (method) => {
    const icons = {
      cash: 'Banknote',
      kbzpay: 'Smartphone',
      wavepay: 'Smartphone',
      credit: 'CreditCard'
    };
    return icons?.[method] || 'DollarSign';
  };

  const getMethodColor = (method) => {
    const colors = {
      cash: 'text-success',
      kbzpay: 'text-primary',
      wavepay: 'text-secondary',
      credit: 'text-warning'
    };
    return colors?.[method] || 'text-muted-foreground';
  };

  const getMethodBgColor = (method) => {
    const colors = {
      cash: 'bg-success/10',
      kbzpay: 'bg-primary/10',
      wavepay: 'bg-secondary/10',
      credit: 'bg-warning/10'
    };
    return colors?.[method] || 'bg-muted/10';
  };

  const totalAmount = paymentData?.reduce((sum, item) => sum + item?.amount, 0);

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Payment Methods</h3>
        <Icon name="PieChart" size={20} className="text-muted-foreground" />
      </div>
      <div className="space-y-3">
        {paymentData?.map((method, index) => {
          const percentage = totalAmount > 0 ? (method?.amount / totalAmount) * 100 : 0;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getMethodBgColor(method?.method)}`}>
                    <Icon 
                      name={getMethodIcon(method?.method)} 
                      size={16} 
                      className={getMethodColor(method?.method)}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground capitalize">
                      {method?.method === 'kbzpay' ? 'KBZPay' : 
                       method?.method === 'wavepay' ? 'WavePay' : 
                       method?.method}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {method?.count} transactions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(method?.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {percentage?.toFixed(1)}%
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    method?.method === 'cash' ? 'bg-success' :
                    method?.method === 'kbzpay' ? 'bg-primary' :
                    method?.method === 'wavepay'? 'bg-secondary' : 'bg-warning'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Total Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
          <span className="text-lg font-bold text-foreground">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodBreakdown;