import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const VoucherDetailModal = ({ voucher, isOpen, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedVoucher, setEditedVoucher] = useState(voucher);
  const [originalVoucher, setOriginalVoucher] = useState(voucher);

  if (!isOpen || !voucher) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('my-MM', {
      style: 'currency',
      currency: 'MMK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount)?.replace('MMK', 'Ks');
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-GB');
  };

  const formatTime = (date) => {
    return new Date(date)?.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleSave = () => {
    // Recalculate totals based on edited products
    const newSubtotal = editedVoucher?.products?.reduce((sum, product) => 
      sum + (product?.price * product?.quantity), 0
    );
    
    const updatedVoucher = {
      ...editedVoucher,
      subtotal: newSubtotal,
      totalAmount: newSubtotal - (editedVoucher?.discount || 0) + (editedVoucher?.tax || 0),
      updatedAt: new Date()?.toISOString()
    };
    
    setEditedVoucher(updatedVoucher);
    setOriginalVoucher(updatedVoucher);
    onSave(updatedVoucher);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedVoucher(originalVoucher);
    setIsEditing(false);
  };

  const handleQuantityChange = (index, newQuantity) => {
    const newProducts = [...editedVoucher?.products];
    if (newQuantity <= 0) {
      newProducts?.splice(index, 1);
    } else {
      newProducts[index].quantity = parseInt(newQuantity);
    }
    
    setEditedVoucher({
      ...editedVoucher,
      products: newProducts
    });
  };

  const handleAddProduct = () => {
    // This would typically open a product selection modal
    // For now, we'll just show a placeholder alert('Add product functionality would open a product selection modal here');
  };

  const handleRemoveProduct = (index) => {
    if (window.confirm('Are you sure you want to remove this product?')) {
      const newProducts = editedVoucher?.products?.filter((_, i) => i !== index);
      setEditedVoucher({
        ...editedVoucher,
        products: newProducts
      });
    }
  };

  const handlePrint = () => {
    console.log('Printing voucher:', voucher?.voucherNumber);
  };

  const handlePaymentUpdate = () => {
    console.log('Updating payment for voucher:', voucher?.voucherNumber);
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-success/10 text-success border-success/20';
      case 'partial':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'unpaid':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const currentVoucher = isEditing ? editedVoucher : voucher;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-foreground">
              Voucher Details
            </h2>
            <span className="font-mono text-lg text-primary">
              {currentVoucher?.voucherNumber}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(currentVoucher?.paymentStatus)}`}>
              {currentVoucher?.paymentStatus?.charAt(0)?.toUpperCase() + currentVoucher?.paymentStatus?.slice(1)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Edit"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Printer"
                  onClick={handlePrint}
                >
                  Print
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="default"
                  size="sm"
                  iconName="Save"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="X"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Voucher Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="text-lg font-medium text-foreground mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                    <p className="text-sm text-foreground mt-1">
                      {formatDate(currentVoucher?.date)} at {formatTime(currentVoucher?.date)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Cashier</label>
                    <p className="text-sm text-foreground mt-1">{currentVoucher?.cashier}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Customer</label>
                    <p className="text-sm text-foreground mt-1">{currentVoucher?.customerName}</p>
                    {currentVoucher?.customerPhone && (
                      <p className="text-xs text-muted-foreground">{currentVoucher?.customerPhone}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                    <p className="text-sm text-foreground mt-1">{currentVoucher?.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-foreground">Products</h3>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddProduct}
                      iconName="Plus"
                    >
                      Add Product
                    </Button>
                  )}
                </div>
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Product</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Qty</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-foreground">Price</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-foreground">Total</th>
                        {isEditing && (
                          <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {currentVoucher?.products?.map((product, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-sm font-medium text-foreground">{product?.name}</p>
                              <p className="text-xs text-muted-foreground">SKU: {product?.sku}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {isEditing ? (
                              <div className="flex items-center justify-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="xs"
                                  onClick={() => handleQuantityChange(index, product?.quantity - 1)}
                                  disabled={product?.quantity <= 1}
                                >
                                  <Icon name="Minus" size={12} />
                                </Button>
                                <Input
                                  type="number"
                                  value={product?.quantity}
                                  onChange={(e) => handleQuantityChange(index, parseInt(e?.target?.value) || 1)}
                                  className="w-16 text-center"
                                  min="1"
                                />
                                <Button
                                  variant="outline"
                                  size="xs"
                                  onClick={() => handleQuantityChange(index, product?.quantity + 1)}
                                >
                                  <Icon name="Plus" size={12} />
                                </Button>
                              </div>
                            ) : (
                              <span className="text-sm text-foreground">{product?.quantity}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-foreground">
                            {formatCurrency(product?.price)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-medium text-foreground">
                            {formatCurrency(product?.quantity * product?.price)}
                          </td>
                          {isEditing && (
                            <td className="px-4 py-3 text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveProduct(index)}
                                className="text-error hover:bg-error/10"
                              >
                                <Icon name="Trash2" size={16} />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column - Payment & Summary */}
            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="text-lg font-medium text-foreground mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="text-sm text-foreground">
                      {formatCurrency(isEditing ? 
                        editedVoucher?.products?.reduce((sum, product) => sum + (product?.price * product?.quantity), 0) :
                        currentVoucher?.subtotal
                      )}
                    </span>
                  </div>
                  {currentVoucher?.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Discount</span>
                      <span className="text-sm text-error">-{formatCurrency(currentVoucher?.discount)}</span>
                    </div>
                  )}
                  {currentVoucher?.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tax</span>
                      <span className="text-sm text-foreground">{formatCurrency(currentVoucher?.tax)}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="text-base font-medium text-foreground">Total</span>
                      <span className="text-base font-bold text-foreground">
                        {formatCurrency(isEditing ? 
                          (editedVoucher?.products?.reduce((sum, product) => sum + (product?.price * product?.quantity), 0) - (currentVoucher?.discount || 0) + (currentVoucher?.tax || 0)) :
                          currentVoucher?.totalAmount
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Paid Amount</span>
                    <span className="text-sm text-foreground">{formatCurrency(currentVoucher?.paidAmount)}</span>
                  </div>
                  {currentVoucher?.paidAmount < currentVoucher?.totalAmount && (
                    <div className="flex justify-between">
                      <span className="text-sm text-error">Outstanding</span>
                      <span className="text-sm font-medium text-error">
                        {formatCurrency(currentVoucher?.totalAmount - currentVoucher?.paidAmount)}
                      </span>
                    </div>
                  )}
                </div>

                {currentVoucher?.paymentStatus !== 'paid' && !isEditing && (
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full mt-4"
                    iconName="CreditCard"
                    onClick={handlePaymentUpdate}
                  >
                    Update Payment
                  </Button>
                )}
              </div>

              {/* Payment History */}
              {currentVoucher?.paymentHistory && currentVoucher?.paymentHistory?.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-lg font-medium text-foreground mb-4">Payment History</h3>
                  <div className="space-y-3">
                    {currentVoucher?.paymentHistory?.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {formatCurrency(payment?.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(payment?.date)} - {payment?.method}
                          </p>
                        </div>
                        <Icon name="CheckCircle" size={16} className="text-success" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-lg font-medium text-foreground mb-4">Notes</h3>
                {isEditing ? (
                  <textarea
                    value={editedVoucher?.notes || ''}
                    onChange={(e) => setEditedVoucher({
                      ...editedVoucher,
                      notes: e?.target?.value
                    })}
                    placeholder="Add notes about this transaction..."
                    className="w-full h-24 p-3 border border-border rounded-lg bg-background text-foreground resize-none"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {currentVoucher?.notes || 'No notes added'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherDetailModal;