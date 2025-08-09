import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const PaymentMethodsPanel = ({ onSave }) => {
  const [paymentMethods, setPaymentMethods] = useState(() => {
    const saved = localStorage.getItem('paymentMethods');
    return saved ? JSON.parse(saved) : {
      cash: {
        enabled: true,
        isDefault: true,
        name: 'Cash',
        icon: 'Banknote',
        description: 'Physical cash payment',
        settings: {
          allowChange: true,
          requireExactAmount: false
        }
      },
      kbzpay: {
        enabled: true,
        isDefault: false,
        name: 'KBZPay',
        icon: 'Smartphone',
        description: 'KBZ Bank mobile payment',
        settings: {
          merchantId: '',
          apiKey: '',
          qrCodeEnabled: true
        }
      },
      wavepay: {
        enabled: true,
        isDefault: false,
        name: 'WavePay',
        icon: 'Waves',
        description: 'Wave Money mobile payment',
        settings: {
          merchantId: '',
          apiKey: '',
          qrCodeEnabled: true
        }
      },
      bank: {
        enabled: false,
        isDefault: false,
        name: 'Bank Transfer',
        icon: 'Building2',
        description: 'Direct bank transfer',
        settings: {
          accountNumber: '',
          bankName: '',
          accountName: ''
        }
      },
      credit: {
        enabled: true,
        isDefault: false,
        name: 'Credit Sale',
        icon: 'CreditCard',
        description: 'Customer credit payment',
        settings: {
          maxCreditLimit: 100000,
          creditTermDays: 30,
          requireApproval: true
        }
      }
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleMethodToggle = (methodKey) => {
    setPaymentMethods(prev => ({
      ...prev,
      [methodKey]: {
        ...prev?.[methodKey],
        enabled: !prev?.[methodKey]?.enabled,
        isDefault: !prev?.[methodKey]?.enabled ? false : prev?.[methodKey]?.isDefault
      }
    }));
  };

  const handleSetDefault = (methodKey) => {
    setPaymentMethods(prev => {
      const updated = { ...prev };
      // Remove default from all methods
      Object.keys(updated)?.forEach(key => {
        updated[key] = { ...updated?.[key], isDefault: false };
      });
      // Set new default
      updated[methodKey] = { ...updated?.[methodKey], isDefault: true };
      return updated;
    });
  };

  const handleSettingChange = (methodKey, settingKey, value) => {
    setPaymentMethods(prev => ({
      ...prev,
      [methodKey]: {
        ...prev?.[methodKey],
        settings: {
          ...prev?.[methodKey]?.settings,
          [settingKey]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
      onSave && onSave(paymentMethods);

      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          message: 'Payment methods updated successfully'
        }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error saving payment methods:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMethodColor = (methodKey) => {
    const colors = {
      cash: 'text-success',
      kbzpay: 'text-primary',
      wavepay: 'text-secondary',
      bank: 'text-warning',
      credit: 'text-error'
    };
    return colors?.[methodKey] || 'text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Payment Methods</h3>
          <p className="text-sm text-muted-foreground">
            Configure available payment options for your store
          </p>
        </div>
        <Button
          variant="default"
          onClick={handleSave}
          loading={isLoading}
          iconName="Save"
        >
          Save Changes
        </Button>
      </div>
      {/* Payment Methods List */}
      <div className="space-y-4">
        {Object.entries(paymentMethods)?.map(([methodKey, method]) => (
          <div key={methodKey} className="p-6 border border-border rounded-lg bg-card">
            {/* Method Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${getMethodColor(methodKey)}`}>
                  <Icon name={method?.icon} size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-foreground">{method?.name}</h4>
                  <p className="text-sm text-muted-foreground">{method?.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {method?.isDefault && (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    Default
                  </span>
                )}
                <Checkbox
                  label="Enabled"
                  checked={method?.enabled}
                  onChange={() => handleMethodToggle(methodKey)}
                />
              </div>
            </div>

            {/* Method Settings */}
            {method?.enabled && (
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Set as Default Payment</span>
                  <Button
                    variant={method?.isDefault ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSetDefault(methodKey)}
                    disabled={method?.isDefault}
                  >
                    {method?.isDefault ? 'Default' : 'Set Default'}
                  </Button>
                </div>

                {/* Method-specific settings */}
                {methodKey === 'cash' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Checkbox
                      label="Allow Change Calculation"
                      description="Calculate and display change amount"
                      checked={method?.settings?.allowChange}
                      onChange={(e) => handleSettingChange(methodKey, 'allowChange', e?.target?.checked)}
                    />
                    <Checkbox
                      label="Require Exact Amount"
                      description="Customer must pay exact amount"
                      checked={method?.settings?.requireExactAmount}
                      onChange={(e) => handleSettingChange(methodKey, 'requireExactAmount', e?.target?.checked)}
                    />
                  </div>
                )}

                {(methodKey === 'kbzpay' || methodKey === 'wavepay') && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Merchant ID"
                        type="text"
                        value={method?.settings?.merchantId}
                        onChange={(e) => handleSettingChange(methodKey, 'merchantId', e?.target?.value)}
                        placeholder="Enter merchant ID"
                        description="Your registered merchant identifier"
                      />
                      <Input
                        label="API Key"
                        type="password"
                        value={method?.settings?.apiKey}
                        onChange={(e) => handleSettingChange(methodKey, 'apiKey', e?.target?.value)}
                        placeholder="Enter API key"
                        description="API key for payment processing"
                      />
                    </div>
                    <Checkbox
                      label="Enable QR Code Payments"
                      description="Generate QR codes for mobile payments"
                      checked={method?.settings?.qrCodeEnabled}
                      onChange={(e) => handleSettingChange(methodKey, 'qrCodeEnabled', e?.target?.checked)}
                    />
                  </div>
                )}

                {methodKey === 'bank' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Bank Name"
                      type="text"
                      value={method?.settings?.bankName}
                      onChange={(e) => handleSettingChange(methodKey, 'bankName', e?.target?.value)}
                      placeholder="Enter bank name"
                    />
                    <Input
                      label="Account Number"
                      type="text"
                      value={method?.settings?.accountNumber}
                      onChange={(e) => handleSettingChange(methodKey, 'accountNumber', e?.target?.value)}
                      placeholder="Enter account number"
                    />
                    <Input
                      label="Account Name"
                      type="text"
                      value={method?.settings?.accountName}
                      onChange={(e) => handleSettingChange(methodKey, 'accountName', e?.target?.value)}
                      placeholder="Enter account holder name"
                      className="md:col-span-2"
                    />
                  </div>
                )}

                {methodKey === 'credit' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Maximum Credit Limit (Ks)"
                        type="number"
                        value={method?.settings?.maxCreditLimit}
                        onChange={(e) => handleSettingChange(methodKey, 'maxCreditLimit', parseInt(e?.target?.value) || 0)}
                        placeholder="100000"
                        description="Maximum credit amount per customer"
                      />
                      <Input
                        label="Credit Term (Days)"
                        type="number"
                        value={method?.settings?.creditTermDays}
                        onChange={(e) => handleSettingChange(methodKey, 'creditTermDays', parseInt(e?.target?.value) || 0)}
                        placeholder="30"
                        description="Payment due period in days"
                      />
                    </div>
                    <Checkbox
                      label="Require Manager Approval"
                      description="Credit sales require manager authorization"
                      checked={method?.settings?.requireApproval}
                      onChange={(e) => handleSettingChange(methodKey, 'requireApproval', e?.target?.checked)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Payment Summary */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">Active Payment Methods</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(paymentMethods)?.filter(([_, method]) => method?.enabled)?.map(([methodKey, method]) => (
              <span
                key={methodKey}
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                  method?.isDefault 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card border border-border text-foreground'
                }`}
              >
                <Icon name={method?.icon} size={14} />
                <span>{method?.name}</span>
                {method?.isDefault && <Icon name="Star" size={12} />}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsPanel;