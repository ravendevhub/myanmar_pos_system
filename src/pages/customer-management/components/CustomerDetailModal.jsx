import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const CustomerDetailModal = ({ customer, isOpen, onClose, onEdit, onRecordPayment }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !customer) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US')?.format(amount) + ' Ks';
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-GB');
  };

  const monthlyPurchases = [
    { month: 'Jan', amount: 45000 },
    { month: 'Feb', amount: 52000 },
    { month: 'Mar', amount: 48000 },
    { month: 'Apr', amount: 61000 },
    { month: 'May', amount: 55000 },
    { month: 'Jun', amount: 67000 }
  ];

  const paymentHistory = [
    {
      id: 1,
      date: '2025-01-05',
      amount: 25000,
      method: 'Cash',
      voucherNo: 'POS-2025-0105-001',
      type: 'payment'
    },
    {
      id: 2,
      date: '2025-01-03',
      amount: 45000,
      method: 'Credit',
      voucherNo: 'POS-2025-0103-015',
      type: 'purchase'
    },
    {
      id: 3,
      date: '2024-12-28',
      amount: 15000,
      method: 'KBZPay',
      voucherNo: 'POS-2024-1228-008',
      type: 'payment'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'history', label: 'Payment History', icon: 'History' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="User" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{customer?.name}</h2>
              <p className="text-sm text-muted-foreground">Customer ID: {customer?.customerId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(customer)} iconName="Edit">
              Edit
            </Button>
            {customer?.outstandingDue > 0 && (
              <Button variant="default" size="sm" onClick={() => onRecordPayment(customer)} iconName="DollarSign">
                Record Payment
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span className="text-sm font-medium">{tab?.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Icon name="Phone" size={16} className="text-muted-foreground" />
                      <span className="text-foreground">{customer?.phone}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Icon name="MapPin" size={16} className="text-muted-foreground mt-0.5" />
                      <span className="text-foreground">{customer?.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Calendar" size={16} className="text-muted-foreground" />
                      <span className="text-foreground">Joined: {formatDate(customer?.joinDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Credit Information */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Credit Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Credit Limit:</span>
                      <span className="font-medium text-foreground">{formatCurrency(customer?.creditLimit || 100000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Outstanding Due:</span>
                      <span className={`font-medium ${customer?.outstandingDue > 0 ? 'text-error' : 'text-success'}`}>
                        {formatCurrency(customer?.outstandingDue)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Available Credit:</span>
                      <span className="font-medium text-success">
                        {formatCurrency((customer?.creditLimit || 100000) - customer?.outstandingDue)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Summary */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Purchase Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary">{formatCurrency(customer?.totalPurchases)}</div>
                      <div className="text-sm text-muted-foreground">Total Purchases</div>
                    </div>
                    <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-secondary">{customer?.totalOrders || 15}</div>
                      <div className="text-sm text-muted-foreground">Total Orders</div>
                    </div>
                    <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-success">{formatCurrency(customer?.averageOrderValue || 35000)}</div>
                      <div className="text-sm text-muted-foreground">Avg. Order Value</div>
                    </div>
                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-warning">{formatDate(customer?.lastPurchase)}</div>
                      <div className="text-sm text-muted-foreground">Last Purchase</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Purchase Trends</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyPurchases}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                      <YAxis stroke="var(--color-muted-foreground)" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'var(--color-card)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [formatCurrency(value), 'Amount']}
                      />
                      <Bar dataKey="amount" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Purchase Pattern</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyPurchases}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                      <YAxis stroke="var(--color-muted-foreground)" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'var(--color-card)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [formatCurrency(value), 'Amount']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="var(--color-secondary)" 
                        strokeWidth={3}
                        dot={{ fill: 'var(--color-secondary)', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Payment & Purchase History</h3>
              <div className="space-y-3">
                {paymentHistory?.map((record) => (
                  <div key={record?.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        record?.type === 'payment' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'
                      }`}>
                        <Icon name={record?.type === 'payment' ? 'DollarSign' : 'ShoppingCart'} size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {record?.type === 'payment' ? 'Payment Received' : 'Purchase Made'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {record?.voucherNo} • {record?.method}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${
                        record?.type === 'payment' ? 'text-success' : 'text-foreground'
                      }`}>
                        {record?.type === 'payment' ? '+' : ''}{formatCurrency(record?.amount)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(record?.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailModal;