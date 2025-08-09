import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PaymentRecordModal = ({ customer, isOpen, onClose, onRecordPayment }) => {
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'Cash',
    reference: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !customer) return null;

  const paymentMethods = [
    { value: 'Cash', label: 'Cash' },
    { value: 'KBZPay', label: 'KBZPay' },
    { value: 'WavePay', label: 'WavePay' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'Other', label: 'Other' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US')?.format(amount) + ' Ks';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!paymentData?.amount || isNaN(Number(paymentData?.amount))) {
      newErrors.amount = 'Please enter a valid payment amount';
    } else if (Number(paymentData?.amount) <= 0) {
      newErrors.amount = 'Payment amount must be greater than 0';
    } else if (Number(paymentData?.amount) > customer?.outstandingDue) {
      newErrors.amount = 'Payment amount cannot exceed outstanding due';
    }

    if (!paymentData?.method) {
      newErrors.method = 'Please select a payment method';
    }

    if (paymentData?.method !== 'Cash' && !paymentData?.reference?.trim()) {
      newErrors.reference = 'Reference number is required for this payment method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const payment = {
        id: Date.now(),
        customerId: customer?.id,
        amount: Number(paymentData?.amount),
        method: paymentData?.method,
        reference: paymentData?.reference,
        notes: paymentData?.notes,
        date: new Date()?.toISOString(),
        voucherNo: `PAY-${new Date()?.getFullYear()}-${String(Date.now())?.slice(-6)}`
      };

      await onRecordPayment(payment);
      
      // Reset form
      setPaymentData({
        amount: '',
        method: 'Cash',
        reference: '',
        notes: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error recording payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleQuickAmount = (percentage) => {
    const amount = Math.round(customer?.outstandingDue * percentage);
    setPaymentData(prev => ({
      ...prev,
      amount: amount?.toString()
    }));
    if (errors?.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Record Payment</h2>
            <p className="text-sm text-muted-foreground">{customer?.name}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Outstanding Due Info */}
        <div className="p-6 bg-error/5 border-b border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Outstanding Due:</span>
            <span className="text-lg font-bold text-error">{formatCurrency(customer?.outstandingDue)}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Input
              label="Payment Amount (Ks)"
              name="amount"
              type="number"
              placeholder="Enter payment amount"
              value={paymentData?.amount}
              onChange={handleInputChange}
              error={errors?.amount}
              required
            />
            
            {/* Quick Amount Buttons */}
            <div className="flex space-x-2 mt-2">
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => handleQuickAmount(0.25)}
              >
                25%
              </Button>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => handleQuickAmount(0.5)}
              >
                50%
              </Button>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => handleQuickAmount(0.75)}
              >
                75%
              </Button>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => handleQuickAmount(1)}
              >
                Full
              </Button>
            </div>
          </div>

          <Select
            label="Payment Method"
            options={paymentMethods}
            value={paymentData?.method}
            onChange={(value) => setPaymentData(prev => ({ ...prev, method: value }))}
            error={errors?.method}
            required
          />

          {paymentData?.method !== 'Cash' && (
            <Input
              label="Reference Number"
              name="reference"
              type="text"
              placeholder="Enter transaction reference"
              value={paymentData?.reference}
              onChange={handleInputChange}
              error={errors?.reference}
              description="Transaction ID or reference number"
              required
            />
          )}

          <Input
            label="Notes (Optional)"
            name="notes"
            type="text"
            placeholder="Add any notes about this payment"
            value={paymentData?.notes}
            onChange={handleInputChange}
          />

          {/* Payment Summary */}
          {paymentData?.amount && !errors?.amount && (
            <div className="bg-success/5 border border-success/20 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Amount:</span>
                  <span className="font-medium text-success">{formatCurrency(Number(paymentData?.amount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining Due:</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(customer?.outstandingDue - Number(paymentData?.amount))}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              iconName="DollarSign"
            >
              Record Payment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentRecordModal;