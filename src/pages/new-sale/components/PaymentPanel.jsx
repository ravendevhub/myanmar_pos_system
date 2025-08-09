import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PaymentPanel = ({ 
  total, 
  onPaymentComplete, 
  onHoldSale,
  className = '' 
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedSeller, setSelectedSeller] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [change, setChange] = useState(0);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [isNewSeller, setIsNewSeller] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [newSellerData, setNewSellerData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  // Updated mock customers with "None" option
  const mockCustomers = [
    { value: 'none', label: 'ဖောက်သည်မရှိ (None)' },
    { value: '', label: 'လူကြီးမင်း (Walk-in)' },
    { value: 'customer1', label: 'မောင်မောင် - 09123456789' },
    { value: 'customer2', label: 'မမမ - 09987654321' },
    { value: 'customer3', label: 'ကိုကို - 09456789123' },
    { value: 'new', label: '+ ဖောက်သည်အသစ်ထည့်ရန်' }
  ];

  // Mock sellers - load from localStorage
  const [mockSellers, setMockSellers] = useState([]);

  useEffect(() => {
    // Load sellers from localStorage
    const savedSellers = JSON.parse(localStorage.getItem('pos_sellers') || '[]');
    const sellerOptions = [
      { value: '', label: 'ရောင်းသူရွေးချယ်ပါ' },
      ...savedSellers?.map(seller => ({ 
        value: seller?.id?.toString(), 
        label: `${seller?.name}${seller?.phone ? ` - ${seller?.phone}` : ''}` 
      })),
      { value: 'new', label: '+ ရောင်းသူအသစ်ထည့်ရန်' }
    ];
    setMockSellers(sellerOptions);
  }, []);

  const paymentMethods = [
    { value: 'cash', label: 'လက်ငင်း', icon: 'Banknote' },
    { value: 'kbzpay', label: 'KBZ Pay', icon: 'Smartphone' },
    { value: 'wavepay', label: 'Wave Pay', icon: 'Smartphone' },
    { value: 'credit', label: 'အကြွေး', icon: 'CreditCard' }
  ];

  useEffect(() => {
    const received = parseFloat(amountReceived) || 0;
    setChange(Math.max(0, received - total));
  }, [amountReceived, total]);

  const handleCustomerChange = (value) => {
    setSelectedCustomer(value);
    setIsNewCustomer(value === 'new');
  };

  const handleSellerChange = (value) => {
    setSelectedSeller(value);
    setIsNewSeller(value === 'new');
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method !== 'cash') {
      setAmountReceived(total?.toString());
    } else {
      setAmountReceived('');
    }
  };

  const handleSaveNewSeller = () => {
    if (!newSellerData?.name?.trim()) return;

    const sellerData = {
      id: Date.now(),
      name: newSellerData?.name?.trim(),
      phone: newSellerData?.phone?.trim(),
      email: newSellerData?.email?.trim(),
      createdAt: new Date()?.toISOString(),
      updatedAt: new Date()?.toISOString()
    };

    // Save to localStorage
    const savedSellers = JSON.parse(localStorage.getItem('pos_sellers') || '[]');
    const updatedSellers = [...savedSellers, sellerData];
    localStorage.setItem('pos_sellers', JSON.stringify(updatedSellers));

    // Update sellers dropdown
    const sellerOptions = [
      { value: '', label: 'ရောင်းသူရွေးချယ်ပါ' },
      ...updatedSellers?.map(seller => ({ 
        value: seller?.id?.toString(), 
        label: `${seller?.name}${seller?.phone ? ` - ${seller?.phone}` : ''}` 
      })),
      { value: 'new', label: '+ ရောင်းသူအသစ်ထည့်ရန်' }
    ];
    setMockSellers(sellerOptions);

    // Select the new seller and reset form
    setSelectedSeller(sellerData?.id?.toString());
    setIsNewSeller(false);
    setNewSellerData({ name: '', phone: '', email: '' });
  };

  const handleCompleteSale = () => {
    const saleData = {
      customer: selectedCustomer,
      seller: selectedSeller,
      paymentMethod,
      amountReceived: parseFloat(amountReceived) || 0,
      change,
      total,
      timestamp: new Date(),
      newCustomer: isNewCustomer ? newCustomerData : null,
      newSeller: isNewSeller ? newSellerData : null
    };
    
    // Save new customer if needed
    if (isNewCustomer && newCustomerData?.name?.trim()) {
      const customerData = {
        id: Date.now(),
        ...newCustomerData,
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      };
      const savedCustomers = JSON.parse(localStorage.getItem('pos_customers') || '[]');
      localStorage.setItem('pos_customers', JSON.stringify([...savedCustomers, customerData]));
    }

    onPaymentComplete(saleData);
  };

  const handleHoldSale = () => {
    const saleData = {
      customer: selectedCustomer,
      seller: selectedSeller,
      paymentMethod,
      total,
      timestamp: new Date(),
      status: 'held'
    };
    onHoldSale(saleData);
  };

  const isPaymentValid = () => {
    if (paymentMethod === 'cash') {
      return parseFloat(amountReceived) >= total;
    }
    return true;
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString() + ' Ks';
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-4 ${className}`}>
      <div className="space-y-6">
        {/* Payment Header */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">ငွေရှင်းစာ</h3>
          <div className="text-3xl font-bold text-primary">
            {formatCurrency(total)}
          </div>
        </div>

        {/* Customer Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">ဖောက်သည်</label>
          <Select
            options={mockCustomers}
            value={selectedCustomer}
            onChange={handleCustomerChange}
            placeholder="ဖောက်သည်ရွေးချယ်ပါ"
          />

          {isNewCustomer && (
            <div className="space-y-3 p-3 bg-muted rounded-lg">
              <Input
                label="အမည်"
                value={newCustomerData?.name}
                onChange={(e) => setNewCustomerData({...newCustomerData, name: e?.target?.value})}
                placeholder="ဖောက်သည်အမည်"
              />
              <Input
                label="ဖုန်းနံပါတ်"
                value={newCustomerData?.phone}
                onChange={(e) => setNewCustomerData({...newCustomerData, phone: e?.target?.value})}
                placeholder="09xxxxxxxxx"
              />
              <Input
                label="လိပ်စာ"
                value={newCustomerData?.address}
                onChange={(e) => setNewCustomerData({...newCustomerData, address: e?.target?.value})}
                placeholder="လိပ်စာ (ရွေးချယ်စရာ)"
              />
            </div>
          )}
        </div>

        {/* Seller Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">ရောင်းသူ</label>
          <Select
            options={mockSellers}
            value={selectedSeller}
            onChange={handleSellerChange}
            placeholder="ရောင်းသူရွေးချယ်ပါ"
          />

          {isNewSeller && (
            <div className="space-y-3 p-3 bg-muted rounded-lg">
              <Input
                label="ရောင်းသူအမည် *"
                value={newSellerData?.name}
                onChange={(e) => setNewSellerData({...newSellerData, name: e?.target?.value})}
                placeholder="ရောင်းသူအမည်"
                required
              />
              <Input
                label="ဖုန်းနံပါတ်"
                value={newSellerData?.phone}
                onChange={(e) => setNewSellerData({...newSellerData, phone: e?.target?.value})}
                placeholder="09xxxxxxxxx"
              />
              <Input
                label="အီးမေးလ်"
                type="email"
                value={newSellerData?.email}
                onChange={(e) => setNewSellerData({...newSellerData, email: e?.target?.value})}
                placeholder="email@example.com"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveNewSeller}
                disabled={!newSellerData?.name?.trim()}
                className="w-full"
              >
                <Icon name="Save" size={16} className="mr-2" />
                ရောင်းသူသိမ်းရန်
              </Button>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">ငွေပေးချေမှုနည်းလမ်း</label>
          <div className="grid grid-cols-2 gap-2">
            {paymentMethods?.map((method) => (
              <Button
                key={method?.value}
                variant={paymentMethod === method?.value ? 'default' : 'outline'}
                onClick={() => handlePaymentMethodChange(method?.value)}
                className="flex items-center justify-center space-x-2 h-12"
              >
                <Icon name={method?.icon} size={18} />
                <span className="text-sm">{method?.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Cash Payment Details */}
        {paymentMethod === 'cash' && (
          <div className="space-y-4">
            <Input
              label="လက်ခံငွေ"
              type="number"
              value={amountReceived}
              onChange={(e) => setAmountReceived(e?.target?.value)}
              placeholder="0"
              className="text-lg"
            />
            
            {amountReceived && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">ပြန်အမ်း</span>
                  <span className="text-lg font-semibold text-success">
                    {formatCurrency(change)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Digital Payment Info */}
        {(paymentMethod === 'kbzpay' || paymentMethod === 'wavepay') && (
          <div className="p-4 bg-secondary/10 rounded-lg text-center">
            <Icon name="QrCode" size={48} className="mx-auto text-secondary mb-2" />
            <p className="text-sm text-secondary-foreground">
              QR ကုဒ်ကို စကင်န်ဖတ်ပြီး ငွေပေးချေပါ
            </p>
            <p className="text-lg font-semibold text-secondary mt-2">
              {formatCurrency(total)}
            </p>
          </div>
        )}

        {/* Credit Sale Info */}
        {paymentMethod === 'credit' && (
          <div className="p-4 bg-warning/10 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="AlertTriangle" size={20} className="text-warning" />
              <span className="text-sm font-medium text-warning-foreground">အကြွေးရောင်းချမှု</span>
            </div>
            <p className="text-sm text-muted-foreground">
              ဤရောင်းချမှုကို အကြွေးအဖြစ် မှတ်တမ်းတင်မည်
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="default"
            fullWidth
            onClick={handleCompleteSale}
            disabled={!isPaymentValid() || total <= 0}
            className="h-12 text-lg"
          >
            <Icon name="Check" size={20} className="mr-2" />
            ရောင်းချမှုပြီးစီးရန်
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleHoldSale}
              disabled={total <= 0}
            >
              <Icon name="Pause" size={16} className="mr-2" />
              ဆိုင်းငံ့ရန်
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
              disabled={total <= 0}
            >
              <Icon name="Printer" size={16} className="mr-2" />
              ပရင့်ထုတ်ရန်
            </Button>
          </div>
        </div>

        {/* Quick Amount Buttons for Cash */}
        {paymentMethod === 'cash' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">အမြန်ရွေးချယ်ရန်</label>
            <div className="grid grid-cols-3 gap-2">
              {[1000, 5000, 10000, 20000, 50000, 100000]?.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmountReceived((parseFloat(amountReceived) || 0) + amount)}
                >
                  +{amount?.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPanel;