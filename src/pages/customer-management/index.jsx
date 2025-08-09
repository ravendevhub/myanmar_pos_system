import React, { useState, useEffect } from 'react';
import MainSidebar from '../../components/ui/MainSidebar';
import TopHeader from '../../components/ui/TopHeader';
import QuickActionBar from '../../components/ui/QuickActionBar';
import AlertNotificationPanel from '../../components/ui/AlertNotificationPanel';
import Button from '../../components/ui/Button';


// Import all components
import CustomerSummaryCard from './components/CustomerSummaryCard';
import CustomerTable from './components/CustomerTable';
import CustomerSearchFilters from './components/CustomerSearchFilters';
import TopDebtorsList from './components/TopDebtorsList';
import RecentActivityFeed from './components/RecentActivityFeed';
import CustomerDetailModal from './components/CustomerDetailModal';
import AddEditCustomerModal from './components/AddEditCustomerModal';
import PaymentRecordModal from './components/PaymentRecordModal';

const CustomerManagement = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debtFilter, setDebtFilter] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');
  
  // Modal states
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Mock data
  const mockCustomers = [
    {
      id: 1,
      customerId: 'CUST-001',
      name: 'Aung Kyaw Moe',
      phone: '+95 9 123 456 789',
      address: 'No. 123, Pyay Road, Kamayut Township, Yangon',
      totalPurchases: 450000,
      outstandingDue: 75000,
      lastPurchase: '2025-01-05',
      joinDate: '2024-03-15',
      creditLimit: 200000,
      totalOrders: 18,
      averageOrderValue: 25000
    },
    {
      id: 2,
      customerId: 'CUST-002',
      name: 'Thida Aye',
      phone: '+95 9 987 654 321',
      address: 'No. 456, Inya Road, Bahan Township, Yangon',
      totalPurchases: 320000,
      outstandingDue: 45000,
      lastPurchase: '2025-01-03',
      joinDate: '2024-05-20',
      creditLimit: 150000,
      totalOrders: 12,
      averageOrderValue: 26667
    },
    {
      id: 3,
      customerId: 'CUST-003',
      name: 'Zaw Min Htut',
      phone: '+95 9 555 123 456',
      address: 'No. 789, University Avenue, Bahan Township, Yangon',
      totalPurchases: 680000,
      outstandingDue: 120000,
      lastPurchase: '2024-12-28',
      joinDate: '2024-01-10',
      creditLimit: 300000,
      totalOrders: 25,
      averageOrderValue: 27200
    },
    {
      id: 4,
      customerId: 'CUST-004',
      name: 'Mya Thandar',
      phone: '+95 9 777 888 999',
      address: 'No. 321, Shwedagon Pagoda Road, Dagon Township, Yangon',
      totalPurchases: 180000,
      outstandingDue: 0,
      lastPurchase: '2025-01-07',
      joinDate: '2024-08-12',
      creditLimit: 100000,
      totalOrders: 8,
      averageOrderValue: 22500
    },
    {
      id: 5,
      customerId: 'CUST-005',
      name: 'Kyaw Swar Aung',
      phone: '+95 9 444 555 666',
      address: 'No. 654, Bogyoke Aung San Road, Pabedan Township, Yangon',
      totalPurchases: 520000,
      outstandingDue: 85000,
      lastPurchase: '2024-12-15',
      joinDate: '2024-02-28',
      creditLimit: 250000,
      totalOrders: 20,
      averageOrderValue: 26000
    }
  ];

  const mockActivities = [
    {
      id: 1,
      type: 'payment',
      customerName: 'Aung Kyaw Moe',
      description: 'made a payment',
      amount: 25000,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      type: 'new_customer',
      customerName: 'Nwe Nwe Aung',
      description: 'registered as new customer',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: 3,
      type: 'purchase',
      customerName: 'Thida Aye',
      description: 'made a purchase',
      amount: 35000,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
    },
    {
      id: 4,
      type: 'credit_limit',
      customerName: 'Zaw Min Htut',
      description: 'credit limit updated',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
    }
  ];

  useEffect(() => {
    setCustomers(mockCustomers);
  }, []);

  useEffect(() => {
    let filtered = customers;

    // Search filter
    if (searchTerm) {
      filtered = filtered?.filter(customer =>
        customer?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        customer?.phone?.includes(searchTerm)
      );
    }

    // Debt filter
    if (debtFilter !== 'all') {
      switch (debtFilter) {
        case 'with-debt':
          filtered = filtered?.filter(customer => customer?.outstandingDue > 0);
          break;
        case 'no-debt':
          filtered = filtered?.filter(customer => customer?.outstandingDue === 0);
          break;
        case 'overdue':
          filtered = filtered?.filter(customer => {
            const daysSince = Math.floor((new Date() - new Date(customer.lastPurchase)) / (1000 * 60 * 60 * 24));
            return customer?.outstandingDue > 0 && daysSince > 30;
          });
          break;
      }
    }

    // Activity filter
    if (activityFilter !== 'all') {
      switch (activityFilter) {
        case 'recent':
          filtered = filtered?.filter(customer => {
            const daysSince = Math.floor((new Date() - new Date(customer.lastPurchase)) / (1000 * 60 * 60 * 24));
            return daysSince <= 30;
          });
          break;
        case 'inactive':
          filtered = filtered?.filter(customer => {
            const daysSince = Math.floor((new Date() - new Date(customer.lastPurchase)) / (1000 * 60 * 60 * 24));
            return daysSince > 90;
          });
          break;
        case 'top-buyers':
          filtered = [...filtered]?.sort((a, b) => b?.totalPurchases - a?.totalPurchases)?.slice(0, 10);
          break;
      }
    }

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, debtFilter, activityFilter]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setDebtFilter('all');
    setActivityFilter('all');
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setIsAddEditModalOpen(true);
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsAddEditModalOpen(true);
  };

  const handleRecordPayment = (customer) => {
    setSelectedCustomer(customer);
    setIsPaymentModalOpen(true);
  };

  const handleViewHistory = (customer) => {
    console.log('View history for:', customer?.name);
    // This would typically navigate to a detailed history page
  };

  const handleSaveCustomer = (customerData) => {
    if (editingCustomer) {
      // Update existing customer
      setCustomers(prev => prev?.map(c => c?.id === editingCustomer?.id ? customerData : c));
    } else {
      // Add new customer
      setCustomers(prev => [...prev, customerData]);
    }
  };

  const handlePaymentRecord = (paymentData) => {
    // Update customer's outstanding due
    setCustomers(prev => prev?.map(customer => 
      customer?.id === paymentData?.customerId 
        ? { ...customer, outstandingDue: customer?.outstandingDue - paymentData?.amount }
        : customer
    ));
    
    // Update selected customer if it's the same one
    if (selectedCustomer && selectedCustomer?.id === paymentData?.customerId) {
      setSelectedCustomer(prev => ({
        ...prev,
        outstandingDue: prev?.outstandingDue - paymentData?.amount
      }));
    }
  };

  // Calculate summary metrics
  const totalCustomers = customers?.length;
  const totalOutstandingDebt = customers?.reduce((sum, customer) => sum + customer?.outstandingDue, 0);
  const customersWithDebt = customers?.filter(customer => customer?.outstandingDue > 0)?.length;
  const recentCustomers = customers?.filter(customer => {
    const daysSince = Math.floor((new Date() - new Date(customer.joinDate)) / (1000 * 60 * 60 * 24));
    return daysSince <= 30;
  })?.length;

  // Get top debtors
  const topDebtors = customers?.filter(customer => customer?.outstandingDue > 0)?.sort((a, b) => b?.outstandingDue - a?.outstandingDue)?.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <MainSidebar isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
      <TopHeader isCollapsed={isCollapsed} />
      <QuickActionBar />
      <AlertNotificationPanel />
      <main className={`transition-all duration-300 ease-out pt-16 ${isCollapsed ? 'ml-20' : 'ml-0 md:ml-64'}`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Customer Management</h1>
              <p className="text-muted-foreground">Manage customer relationships and credit accounts</p>
            </div>
            <Button onClick={handleAddCustomer} iconName="UserPlus">
              Add Customer
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Summary Cards */}
            <div className="lg:col-span-2 space-y-4">
              <CustomerSummaryCard
                title="Total Customers"
                value={totalCustomers}
                subtitle={`${recentCustomers} new this month`}
                icon="Users"
                color="primary"
                trend="up"
                trendValue="+12%"
              />
              
              <CustomerSummaryCard
                title="Outstanding Debt"
                value={`${new Intl.NumberFormat('en-US')?.format(totalOutstandingDebt)} Ks`}
                subtitle={`${customersWithDebt} customers with debt`}
                icon="AlertTriangle"
                color="warning"
                trend="down"
                trendValue="-5%"
              />
              
              <CustomerSummaryCard
                title="Recent Registrations"
                value={recentCustomers}
                subtitle="Last 30 days"
                icon="UserPlus"
                color="success"
                trend="up"
                trendValue="+8%"
              />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-7 space-y-6">
              <CustomerSearchFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                debtFilter={debtFilter}
                setDebtFilter={setDebtFilter}
                activityFilter={activityFilter}
                setActivityFilter={setActivityFilter}
                onClearFilters={handleClearFilters}
              />

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredCustomers?.length} of {totalCustomers} customers
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" iconName="Filter">
                    More Filters
                  </Button>
                  <Button variant="outline" size="sm" iconName="SortAsc">
                    Sort
                  </Button>
                </div>
              </div>

              <CustomerTable
                customers={filteredCustomers}
                onViewCustomer={handleViewCustomer}
                onEditCustomer={handleEditCustomer}
                onRecordPayment={handleRecordPayment}
                onViewHistory={handleViewHistory}
              />
            </div>

            {/* Right Panel */}
            <div className="lg:col-span-3 space-y-6">
              <TopDebtorsList
                debtors={topDebtors}
                onViewCustomer={handleViewCustomer}
                onRecordPayment={handleRecordPayment}
              />
              
              <RecentActivityFeed activities={mockActivities} />
            </div>
          </div>
        </div>
      </main>
      {/* Modals */}
      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleEditCustomer}
        onRecordPayment={handleRecordPayment}
      />
      <AddEditCustomerModal
        customer={editingCustomer}
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveCustomer}
      />
      <PaymentRecordModal
        customer={selectedCustomer}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onRecordPayment={handlePaymentRecord}
      />
    </div>
  );
};

export default CustomerManagement;