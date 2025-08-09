import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainSidebar from '../../components/ui/MainSidebar';
import TopHeader from '../../components/ui/TopHeader';
import QuickActionBar from '../../components/ui/QuickActionBar';
import AlertNotificationPanel from '../../components/ui/AlertNotificationPanel';
import VoucherTable from './components/VoucherTable';
import FilterToolbar from './components/FilterToolbar';
import SalesSummaryCards from './components/SalesSummaryCards';
import PaymentMethodBreakdown from './components/PaymentMethodBreakdown';
import RecentTransactionAlerts from './components/RecentTransactionAlerts';
import VoucherDetailModal from './components/VoucherDetailModal';
import Button from '../../components/ui/Button';

const SalesManagement = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({});

  // Mock data
  const mockVouchers = [
    {
      id: 1,
      voucherNumber: 'POS-2025-0108-001',
      date: new Date('2025-01-08T10:30:00'),
      customerName: 'Mg Aung Kyaw',
      customerPhone: '09-123-456-789',
      totalItems: 5,
      subtotal: 85000,
      discount: 5000,
      tax: 0,
      totalAmount: 80000,
      paidAmount: 80000,
      paymentMethod: 'Cash',
      paymentStatus: 'paid',
      cashier: 'Ma Thida',
      products: [
        { sku: 'RICE001', name: 'Premium Rice 5kg', quantity: 2, price: 25000 },
        { sku: 'OIL001', name: 'Cooking Oil 1L', quantity: 3, price: 12000 }
      ],
      paymentHistory: [
        { date: new Date('2025-01-08T10:30:00'), amount: 80000, method: 'Cash' }
      ],
      notes: 'Regular customer, 5% discount applied'
    },
    {
      id: 2,
      voucherNumber: 'POS-2025-0108-002',
      date: new Date('2025-01-08T11:15:00'),
      customerName: 'Daw Su Su Win',
      customerPhone: '09-987-654-321',
      totalItems: 3,
      subtotal: 45000,
      discount: 0,
      tax: 0,
      totalAmount: 45000,
      paidAmount: 25000,
      paymentMethod: 'KBZPay',
      paymentStatus: 'partial',
      cashier: 'Ko Thant',
      products: [
        { sku: 'SOAP001', name: 'Soap Bar', quantity: 5, price: 3000 },
        { sku: 'SHAM001', name: 'Shampoo 500ml', quantity: 2, price: 15000 }
      ],
      paymentHistory: [
        { date: new Date('2025-01-08T11:15:00'), amount: 25000, method: 'KBZPay' }
      ],
      notes: 'Partial payment, remaining 20,000 Ks due'
    },
    {
      id: 3,
      voucherNumber: 'POS-2025-0108-003',
      date: new Date('2025-01-08T14:20:00'),
      customerName: 'Walk-in Customer',
      customerPhone: null,
      totalItems: 8,
      subtotal: 120000,
      discount: 10000,
      tax: 0,
      totalAmount: 110000,
      paidAmount: 0,
      paymentMethod: 'Credit',
      paymentStatus: 'unpaid',
      cashier: 'Ma Mya Mya',
      products: [
        { sku: 'TEA001', name: 'Green Tea 100g', quantity: 4, price: 8000 },
        { sku: 'COFFEE001', name: 'Instant Coffee 200g', quantity: 2, price: 18000 },
        { sku: 'SUGAR001', name: 'White Sugar 1kg', quantity: 2, price: 5000 }
      ],
      paymentHistory: [],
      notes: 'Credit sale - payment due in 7 days'
    },
    {
      id: 4,
      voucherNumber: 'POS-2025-0107-045',
      date: new Date('2025-01-07T16:45:00'),
      customerName: 'Ko Zaw Min',
      customerPhone: '09-555-123-456',
      totalItems: 2,
      subtotal: 35000,
      discount: 0,
      tax: 0,
      totalAmount: 35000,
      paidAmount: 35000,
      paymentMethod: 'WavePay',
      paymentStatus: 'paid',
      cashier: 'Ma Thida',
      products: [
        { sku: 'MILK001', name: 'Fresh Milk 1L', quantity: 5, price: 7000 }
      ],
      paymentHistory: [
        { date: new Date('2025-01-07T16:45:00'), amount: 35000, method: 'WavePay' }
      ],
      notes: ''
    }
  ];

  const mockSummaryData = {
    todaySales: 235000,
    todayChange: 12.5,
    totalVouchers: 4,
    vouchersChange: 8.3,
    pendingPayments: 130000,
    pendingChange: -5.2,
    averageSale: 58750,
    averageChange: 3.7
  };

  const mockPaymentData = [
    { method: 'cash', amount: 115000, count: 2 },
    { method: 'kbzpay', amount: 25000, count: 1 },
    { method: 'wavepay', amount: 35000, count: 1 },
    { method: 'credit', amount: 110000, count: 1 }
  ];

  const mockAlerts = [
    {
      id: 1,
      type: 'payment_failed',
      title: 'Payment Processing Failed',
      message: 'KBZPay transaction for voucher POS-2025-0108-004 failed to process',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      priority: 'high',
      actionable: true,
      actionLabel: 'Retry',
      amount: 45000
    },
    {
      id: 2,
      type: 'credit_limit',
      title: 'Credit Limit Warning',
      message: 'Customer Daw Su Su Win approaching credit limit',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      priority: 'medium',
      actionable: true,
      actionLabel: 'View Customer',
      amount: 20000
    },
    {
      id: 3,
      type: 'high_value',
      title: 'High Value Transaction',
      message: 'Large sale completed - voucher POS-2025-0108-005',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      priority: 'low',
      actionable: false,
      amount: 250000
    }
  ];

  useEffect(() => {
    setVouchers(mockVouchers);
    setFilteredVouchers(mockVouchers);
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    
    let filtered = [...mockVouchers];
    
    // Apply date range filter
    if (newFilters?.dateRange && newFilters?.dateRange !== 'today') {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      
      switch (newFilters?.dateRange) {
        case 'yesterday':
          const yesterday = new Date(startOfDay);
          yesterday?.setDate(yesterday?.getDate() - 1);
          filtered = filtered?.filter(v => 
            new Date(v.date) >= yesterday && new Date(v.date) < startOfDay
          );
          break;
        case 'this_week':
          const weekStart = new Date(startOfDay);
          weekStart?.setDate(weekStart?.getDate() - weekStart?.getDay());
          filtered = filtered?.filter(v => new Date(v.date) >= weekStart);
          break;
        // Add more date range filters as needed
      }
    }
    
    // Apply payment status filter
    if (newFilters?.paymentStatus && newFilters?.paymentStatus !== 'all') {
      filtered = filtered?.filter(v => v?.paymentStatus === newFilters?.paymentStatus);
    }
    
    // Apply customer filter
    if (newFilters?.customer) {
      filtered = filtered?.filter(v => 
        v?.customerName?.toLowerCase()?.includes(newFilters?.customer?.toLowerCase())
      );
    }
    
    // Apply voucher number filter
    if (newFilters?.voucherNumber) {
      filtered = filtered?.filter(v => 
        v?.voucherNumber?.toLowerCase()?.includes(newFilters?.voucherNumber?.toLowerCase())
      );
    }
    
    setFilteredVouchers(filtered);
  };

  const handleVoucherClick = (voucher) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleEditVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleDeleteVoucher = (voucher) => {
    if (window.confirm(`Are you sure you want to delete voucher ${voucher?.voucherNumber}?`)) {
      const updatedVouchers = vouchers?.filter(v => v?.id !== voucher?.id);
      setVouchers(updatedVouchers);
      setFilteredVouchers(updatedVouchers);
      console.log('Voucher deleted:', voucher?.voucherNumber);
    }
  };

  const handlePrintVoucher = (voucher) => {
    console.log('Printing voucher:', voucher?.voucherNumber);
  };

  const handleSaveVoucher = (updatedVoucher) => {
    const updatedVouchers = vouchers?.map(v => 
      v?.id === updatedVoucher?.id ? updatedVoucher : v
    );
    setVouchers(updatedVouchers);
    setFilteredVouchers(updatedVouchers);
    setIsModalOpen(false);
    console.log('Voucher updated:', updatedVoucher?.voucherNumber);
  };

  const handleNewSale = () => {
    navigate('/new-sale');
  };

  return (
    <div className="min-h-screen bg-background">
      <MainSidebar 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <TopHeader isCollapsed={isSidebarCollapsed} />
      <main 
        className={`pt-16 transition-all duration-300 ease-out ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <div className="p-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Sales Management</h1>
              <p className="text-muted-foreground">
                Track and manage all sales transactions and vouchers
              </p>
            </div>
            <Button
              variant="default"
              size="lg"
              iconName="Plus"
              onClick={handleNewSale}
              className="mt-4 sm:mt-0"
            >
              New Sale
            </Button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Section - Main Content */}
            <div className="xl:col-span-8 space-y-6">
              <FilterToolbar
                onFiltersChange={handleFiltersChange}
                totalVouchers={vouchers?.length}
                filteredCount={filteredVouchers?.length}
              />
              
              <VoucherTable
                vouchers={filteredVouchers}
                onVoucherClick={handleVoucherClick}
                onEditVoucher={handleEditVoucher}
                onDeleteVoucher={handleDeleteVoucher}
                onPrintVoucher={handlePrintVoucher}
              />
            </div>

            {/* Right Section - Summary & Alerts */}
            <div className="xl:col-span-4 space-y-6">
              <SalesSummaryCards summaryData={mockSummaryData} />
              <PaymentMethodBreakdown paymentData={mockPaymentData} />
              <RecentTransactionAlerts alerts={mockAlerts} />
            </div>
          </div>
        </div>
      </main>
      <QuickActionBar />
      <AlertNotificationPanel />
      <VoucherDetailModal
        voucher={selectedVoucher}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveVoucher}
      />
    </div>
  );
};

export default SalesManagement;