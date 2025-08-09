import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainSidebar from '../../components/ui/MainSidebar';
import TopHeader from '../../components/ui/TopHeader';
import QuickActionBar from '../../components/ui/QuickActionBar';
import AlertNotificationPanel from '../../components/ui/AlertNotificationPanel';
import MetricCard from './components/MetricCard';
import SalesChart from './components/SalesChart';
import ExpenseChart from './components/ExpenseChart';
import AlertPanel from './components/AlertPanel';
import TopProductsList from './components/TopProductsList';
import TopDebtorsList from './components/TopDebtorsList';
import QuickActions from './components/QuickActions';
import DateFilter from './components/DateFilter';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date()?.toISOString()?.split('T')?.[0],
    endDate: new Date()?.toISOString()?.split('T')?.[0],
    type: 'today'
  });

  // Mock data for dashboard metrics
  const todayMetrics = {
    sales: 1250000,
    profit: 375000,
    pendingDues: 850000,
    lowStockItems: 12
  };

  const salesTrendData = [
    { date: '01 Jan', sales: 850000, profit: 255000 },
    { date: '02 Jan', sales: 920000, profit: 276000 },
    { date: '03 Jan', sales: 1100000, profit: 330000 },
    { date: '04 Jan', sales: 980000, profit: 294000 },
    { date: '05 Jan', sales: 1350000, profit: 405000 },
    { date: '06 Jan', sales: 1180000, profit: 354000 },
    { date: '07 Jan', sales: 1250000, profit: 375000 },
    { date: '08 Jan', sales: 1420000, profit: 426000 }
  ];

  const expenseData = [
    { month: 'Oct', income: 25000000, expense: 18000000 },
    { month: 'Nov', income: 28000000, expense: 19500000 },
    { month: 'Dec', income: 32000000, expense: 21000000 },
    { month: 'Jan', income: 35000000, expense: 22500000 }
  ];

  const stockAlerts = [
    {
      id: 1,
      type: 'low-stock',
      title: 'Rice (5kg) - Low Stock',
      message: 'Only 3 units remaining',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      actionable: true
    },
    {
      id: 2,
      type: 'out-of-stock',
      title: 'Cooking Oil (1L) - Out of Stock',
      message: 'Completely sold out',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      actionable: true
    },
    {
      id: 3,
      type: 'low-stock',
      title: 'Sugar (1kg) - Low Stock',
      message: 'Only 5 units remaining',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      actionable: true
    },
    {
      id: 4,
      type: 'expiring',
      title: 'Milk Products Expiring',
      message: '8 items expiring in 2 days',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      actionable: true
    }
  ];

  const topProducts = [
    {
      id: 1,
      name: 'Rice (5kg)',
      sku: 'RICE-5KG-001',
      image: 'https://images.pexels.com/photos/33239/rice-grain-seed-food.jpg?auto=compress&cs=tinysrgb&w=400',
      soldQuantity: 45,
      revenue: 675000
    },
    {
      id: 2,
      name: 'Cooking Oil (1L)',
      sku: 'OIL-1L-002',
      image: 'https://images.pexels.com/photos/4198170/pexels-photo-4198170.jpeg?auto=compress&cs=tinysrgb&w=400',
      soldQuantity: 32,
      revenue: 480000
    },
    {
      id: 3,
      name: 'Sugar (1kg)',
      sku: 'SUGAR-1KG-003',
      image: 'https://images.pexels.com/photos/65882/spoon-white-sugar-sweetener-sugar-65882.jpeg?auto=compress&cs=tinysrgb&w=400',
      soldQuantity: 28,
      revenue: 336000
    },
    {
      id: 4,
      name: 'Salt (500g)',
      sku: 'SALT-500G-004',
      image: 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=400',
      soldQuantity: 25,
      revenue: 125000
    }
  ];

  const topDebtors = [
    {
      id: 1,
      name: 'Mg Aung Kyaw',
      outstandingAmount: 750000,
      lastPurchase: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      daysPending: 15
    },
    {
      id: 2,
      name: 'Daw Thida',
      outstandingAmount: 520000,
      lastPurchase: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      daysPending: 8
    },
    {
      id: 3,
      name: 'Ko Zaw Min',
      outstandingAmount: 380000,
      lastPurchase: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      daysPending: 12
    },
    {
      id: 4,
      name: 'Ma Hnin Wai',
      outstandingAmount: 250000,
      lastPurchase: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      daysPending: 5
    }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(value) + ' Ks';
  };

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    console.log('Date filter changed:', filter);
    // Here you would typically refetch data based on the new date range
  };

  const handleViewCustomer = (customerId) => {
    navigate(`/customer-management?customer=${customerId}`);
  };

  const handleMetricClick = (metric) => {
    switch (metric) {
      case 'sales': navigate('/sales-management');
        break;
      case 'dues': navigate('/customer-management?filter=debtors');
        break;
      case 'stock': navigate('/product-management?filter=low-stock');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // Simulate data refresh when date filter changes
    console.log('Refreshing dashboard data for:', dateFilter);
  }, [dateFilter]);

  return (
    <div className="min-h-screen bg-background">
      <MainSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <TopHeader isCollapsed={sidebarCollapsed} />
      <AlertNotificationPanel />
      <QuickActionBar />
      <main className={`transition-all duration-300 ease-out pt-16 ${
        sidebarCollapsed ? 'ml-0 md:ml-20' : 'ml-0 md:ml-64'
      }`}>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's your business overview for {new Date()?.toLocaleDateString('en-GB', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <DateFilter onFilterChange={handleDateFilterChange} />
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Today's Sales"
              value={formatCurrency(todayMetrics?.sales)}
              change="+12.5%"
              changeType="positive"
              icon="TrendingUp"
              iconColor="text-success"
              onClick={() => handleMetricClick('sales')}
            />
            <MetricCard
              title="Total Profit"
              value={formatCurrency(todayMetrics?.profit)}
              change="+8.2%"
              changeType="positive"
              icon="DollarSign"
              iconColor="text-primary"
              onClick={() => handleMetricClick('profit')}
            />
            <MetricCard
              title="Pending Dues"
              value={formatCurrency(todayMetrics?.pendingDues)}
              change="-5.1%"
              changeType="negative"
              icon="CreditCard"
              iconColor="text-warning"
              onClick={() => handleMetricClick('dues')}
            />
            <MetricCard
              title="Low Stock Items"
              value={todayMetrics?.lowStockItems?.toString()}
              change="+3"
              changeType="negative"
              icon="AlertTriangle"
              iconColor="text-error"
              onClick={() => handleMetricClick('stock')}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <SalesChart data={salesTrendData} />
            <ExpenseChart data={expenseData} />
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Stock Alerts */}
            <div className="lg:col-span-1">
              <AlertPanel 
                alerts={stockAlerts} 
                title="Stock Alerts"
                onViewAll={() => navigate('/product-management?filter=alerts')}
              />
            </div>

            {/* Top Products */}
            <div className="lg:col-span-1">
              <TopProductsList products={topProducts} />
            </div>

            {/* Top Debtors */}
            <div className="lg:col-span-1">
              <TopDebtorsList 
                debtors={topDebtors} 
                onViewCustomer={handleViewCustomer}
              />
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <QuickActions />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;