import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AddEditCustomerModal = ({ customer, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    creditLimit: '',
    openingCredit: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer?.name || '',
        phone: customer?.phone || '',
        address: customer?.address || '',
        creditLimit: customer?.creditLimit || '',
        openingCredit: customer?.outstandingDue || ''
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        address: '',
        creditLimit: '100000',
        openingCredit: '0'
      });
    }
    setErrors({});
  }, [customer, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Customer name is required';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]+$/?.test(formData?.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData?.address?.trim()) {
      newErrors.address = 'Address is required';
    }

    if (formData?.creditLimit && isNaN(Number(formData?.creditLimit))) {
      newErrors.creditLimit = 'Credit limit must be a valid number';
    }

    if (formData?.openingCredit && isNaN(Number(formData?.openingCredit))) {
      newErrors.openingCredit = 'Opening credit must be a valid number';
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
      const customerData = {
        ...formData,
        creditLimit: Number(formData?.creditLimit) || 100000,
        outstandingDue: Number(formData?.openingCredit) || 0,
        id: customer?.id || Date.now(),
        customerId: customer?.customerId || `CUST-${Date.now()}`,
        joinDate: customer?.joinDate || new Date()?.toISOString(),
        totalPurchases: customer?.totalPurchases || 0,
        lastPurchase: customer?.lastPurchase || new Date()?.toISOString()
      };

      await onSave(customerData);
      onClose();
    } catch (error) {
      console.error('Error saving customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">
            {customer ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Customer Name"
            name="name"
            type="text"
            placeholder="Enter customer name"
            value={formData?.name}
            onChange={handleInputChange}
            error={errors?.name}
            required
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="Enter phone number"
            value={formData?.phone}
            onChange={handleInputChange}
            error={errors?.phone}
            required
          />

          <Input
            label="Address"
            name="address"
            type="text"
            placeholder="Enter customer address"
            value={formData?.address}
            onChange={handleInputChange}
            error={errors?.address}
            required
          />

          <Input
            label="Credit Limit (Ks)"
            name="creditLimit"
            type="number"
            placeholder="Enter credit limit"
            value={formData?.creditLimit}
            onChange={handleInputChange}
            error={errors?.creditLimit}
            description="Maximum credit amount allowed for this customer"
          />

          <Input
            label="Opening Credit Balance (Ks)"
            name="openingCredit"
            type="number"
            placeholder="Enter opening credit balance"
            value={formData?.openingCredit}
            onChange={handleInputChange}
            error={errors?.openingCredit}
            description="Any existing credit balance to be recorded"
          />

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
              iconName="Save"
            >
              {customer ? 'Update Customer' : 'Add Customer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditCustomerModal;