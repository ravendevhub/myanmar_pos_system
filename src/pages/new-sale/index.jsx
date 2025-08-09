import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainSidebar from '../../components/ui/MainSidebar';
import TopHeader from '../../components/ui/TopHeader';
import QuickActionBar from '../../components/ui/QuickActionBar';
import AlertNotificationPanel from '../../components/ui/AlertNotificationPanel';
import ProductSearch from './components/ProductSearch';
import SaleCart from './components/SaleCart';
import PaymentPanel from './components/PaymentPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const NewSale = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [saleNumber, setSaleNumber] = useState('');

  useEffect(() => {
    // Generate sale number
    const now = new Date();
    const saleNum = `POS-${now?.getFullYear()}-${String(now?.getMonth() + 1)?.padStart(2, '0')}${String(now?.getDate())?.padStart(2, '0')}-${String(Math.floor(Math.random() * 1000))?.padStart(3, '0')}`;
    setSaleNumber(saleNum);
  }, []);

  useEffect(() => {
    // Calculate totals
    const newSubtotal = cartItems?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);
    const newTotalDiscount = cartItems?.reduce((sum, item) => sum + (item?.discount || 0), 0);
    const taxableAmount = newSubtotal - newTotalDiscount;
    const newTax = taxableAmount * 0.05; // 5% tax
    const newTotal = taxableAmount + newTax;

    setSubtotal(newSubtotal);
    setTotalDiscount(newTotalDiscount);
    setTax(newTax);
    setTotal(newTotal);
  }, [cartItems]);

  const handleProductSelect = (product) => {
    const existingItem = cartItems?.find(item => item?.id === product?.id);
    
    if (existingItem) {
      setCartItems(cartItems?.map(item =>
        item?.id === product?.id
          ? { 
              ...item, 
              quantity: item?.quantity + 1,
              lineTotal: (item?.quantity + 1) * item?.price - (item?.discount || 0)
            }
          : item
      ));
    } else {
      const newItem = {
        ...product,
        quantity: 1,
        discount: 0,
        discountAmount: 0,
        lineTotal: product?.price
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    setCartItems(cartItems?.map(item =>
      item?.id === itemId
        ? { 
            ...item, 
            quantity: newQuantity,
            lineTotal: newQuantity * item?.price - (item?.discount || 0)
          }
        : item
    ));
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems?.filter(item => item?.id !== itemId));
  };

  const handleUpdateDiscount = (itemId, discount, type = 'flat') => {
    setCartItems(cartItems?.map(item => {
      if (item?.id === itemId) {
        const calculatedDiscount = type === 'percentage' 
          ? (item?.price * item?.quantity * discount / 100)
          : discount;
        
        return {
          ...item,
          discount: calculatedDiscount,
          discountAmount: discount,
          discountType: type,
          lineTotal: (item?.price * item?.quantity) - calculatedDiscount
        };
      }
      return item;
    }));
  };

  const handlePaymentComplete = (paymentData) => {
    console.log('Payment completed:', paymentData);
    
    // Save sale to localStorage
    const saleRecord = {
      id: Date.now(),
      saleNumber,
      items: cartItems,
      customer: paymentData?.customer,
      paymentMethod: paymentData?.paymentMethod,
      subtotal,
      totalDiscount,
      tax,
      total,
      amountReceived: paymentData?.amountReceived,
      change: paymentData?.change,
      timestamp: paymentData?.timestamp,
      status: 'completed'
    };

    const existingSales = JSON.parse(localStorage.getItem('sales') || '[]');
    existingSales?.push(saleRecord);
    localStorage.setItem('sales', JSON.stringify(existingSales));

    // Clear cart and redirect
    setCartItems([]);
    alert('ရောင်းချမှုအောင်မြင်ပါသည်!');
    
    // Navigate to sales management or print receipt
    navigate('/sales-management');
  };

  const handleHoldSale = (saleData) => {
    console.log('Sale held:', saleData);
    
    // Save held sale to localStorage
    const heldSale = {
      id: Date.now(),
      saleNumber,
      items: cartItems,
      customer: saleData?.customer,
      paymentMethod: saleData?.paymentMethod,
      subtotal,
      totalDiscount,
      tax,
      total,
      timestamp: saleData?.timestamp,
      status: 'held'
    };

    const existingHeldSales = JSON.parse(localStorage.getItem('heldSales') || '[]');
    existingHeldSales?.push(heldSale);
    localStorage.setItem('heldSales', JSON.stringify(existingHeldSales));

    // Clear cart
    setCartItems([]);
    alert('ရောင်းချမှုကို ဆိုင်းငံ့ထားပါသည်!');
  };

  const handleClearCart = () => {
    if (cartItems?.length > 0) {
      if (window.confirm('စာရင်းကို ရှင်းလင်းမှာ သေချာပါသလား?')) {
        setCartItems([]);
      }
    }
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      <MainSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={handleToggleSidebar}
      />
      <TopHeader isCollapsed={isSidebarCollapsed} />
      <AlertNotificationPanel />
      <QuickActionBar />
      <main 
        className={`transition-all duration-300 ease-out pt-16 ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <div className="p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">အသစ်ရောင်းချရန်</h1>
              <p className="text-muted-foreground">ရောင်းချမှုအမှတ်: {saleNumber}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleClearCart}
                disabled={cartItems?.length === 0}
                iconName="Trash2"
              >
                စာရင်းရှင်းရန်
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/sales-management')}
                iconName="List"
              >
                ရောင်းချမှုများ
              </Button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Product Search - Left Panel */}
            <div className="lg:col-span-4">
              <ProductSearch 
                onProductSelect={handleProductSelect}
                className="h-full"
              />
            </div>

            {/* Sale Cart - Center Panel */}
            <div className="lg:col-span-5">
              <SaleCart
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onUpdateDiscount={handleUpdateDiscount}
                subtotal={subtotal}
                totalDiscount={totalDiscount}
                tax={tax}
                total={total}
                className="h-full"
              />
            </div>

            {/* Payment Panel - Right Panel */}
            <div className="lg:col-span-3">
              <PaymentPanel
                total={total}
                onPaymentComplete={handlePaymentComplete}
                onHoldSale={handleHoldSale}
                className="h-full"
              />
            </div>
          </div>

          {/* Mobile Quick Actions */}
          <div className="lg:hidden fixed bottom-20 left-4 right-4 bg-card border border-border rounded-lg p-4 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">စုစုပေါင်း</p>
                <p className="text-lg font-bold text-primary">
                  {total?.toLocaleString()} Ks
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCart}
                  disabled={cartItems?.length === 0}
                >
                  <Icon name="Trash2" size={16} />
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  disabled={cartItems?.length === 0}
                  onClick={() => {
                    // Scroll to payment section on mobile
                    document.querySelector('.payment-panel')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  ငွေရှင်းရန်
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewSale;