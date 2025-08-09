import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VoucherTable = ({ vouchers, onVoucherClick, onEditVoucher, onDeleteVoucher, onPrintVoucher }) => {
  const [selectedVouchers, setSelectedVouchers] = useState([]);

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

  const handleSelectVoucher = (voucherId) => {
    setSelectedVouchers(prev => 
      prev?.includes(voucherId) 
        ? prev?.filter(id => id !== voucherId)
        : [...prev, voucherId]
    );
  };

  const handleSelectAll = () => {
    if (selectedVouchers?.length === vouchers?.length) {
      setSelectedVouchers([]);
    } else {
      setSelectedVouchers(vouchers?.map(v => v?.id));
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for vouchers:`, selectedVouchers);
    setSelectedVouchers([]);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header with Bulk Actions */}
      {selectedVouchers?.length > 0 && (
        <div className="px-6 py-3 bg-muted border-b border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {selectedVouchers?.length} voucher(s) selected
            </span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Printer"
                onClick={() => handleBulkAction('print')}
              >
                Print Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                onClick={() => handleBulkAction('export')}
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedVouchers?.length === vouchers?.length && vouchers?.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Voucher #</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Items</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Total</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Payment</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {vouchers?.map((voucher) => (
              <tr
                key={voucher?.id}
                className="hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => onVoucherClick(voucher)}
              >
                <td className="px-4 py-3" onClick={(e) => e?.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedVouchers?.includes(voucher?.id)}
                    onChange={() => handleSelectVoucher(voucher?.id)}
                    className="rounded border-border"
                  />
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-sm font-medium text-primary">
                    {voucher?.voucherNumber}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {formatDate(voucher?.date)}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {voucher?.customerName}
                    </div>
                    {voucher?.customerPhone && (
                      <div className="text-xs text-muted-foreground">
                        {voucher?.customerPhone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {voucher?.totalItems} items
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-foreground">
                    {formatCurrency(voucher?.totalAmount)}
                  </div>
                  {voucher?.discount > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Discount: {formatCurrency(voucher?.discount)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-foreground">
                    {voucher?.paymentMethod}
                  </div>
                  {voucher?.paidAmount < voucher?.totalAmount && (
                    <div className="text-xs text-muted-foreground">
                      Paid: {formatCurrency(voucher?.paidAmount)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(voucher?.paymentStatus)}`}>
                    {voucher?.paymentStatus?.charAt(0)?.toUpperCase() + voucher?.paymentStatus?.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3" onClick={(e) => e?.stopPropagation()}>
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditVoucher(voucher)}
                      title="Edit Voucher"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onPrintVoucher(voucher)}
                      title="Print Voucher"
                    >
                      <Icon name="Printer" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteVoucher(voucher)}
                      title="Delete Voucher"
                      className="text-error hover:text-error"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 p-4">
        {vouchers?.map((voucher) => (
          <div
            key={voucher?.id}
            className="bg-card border border-border rounded-lg p-4 cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => onVoucherClick(voucher)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="font-mono text-sm font-medium text-primary">
                  {voucher?.voucherNumber}
                </span>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatDate(voucher?.date)}
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(voucher?.paymentStatus)}`}>
                {voucher?.paymentStatus?.charAt(0)?.toUpperCase() + voucher?.paymentStatus?.slice(1)}
              </span>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Customer:</span>
                <span className="text-sm font-medium text-foreground">{voucher?.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Items:</span>
                <span className="text-sm text-foreground">{voucher?.totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total:</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(voucher?.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Payment:</span>
                <span className="text-sm text-foreground">{voucher?.paymentMethod}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2" onClick={(e) => e?.stopPropagation()}>
              <Button
                variant="outline"
                size="sm"
                iconName="Edit"
                onClick={() => onEditVoucher(voucher)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Printer"
                onClick={() => onPrintVoucher(voucher)}
              >
                Print
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {vouchers?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Receipt" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No vouchers found</h3>
          <p className="text-muted-foreground mb-4">
            No sales vouchers match your current filters.
          </p>
          <Button variant="default" iconName="Plus">
            Create New Sale
          </Button>
        </div>
      )}
    </div>
  );
};

export default VoucherTable;