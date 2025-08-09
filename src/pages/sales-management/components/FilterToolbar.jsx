import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterToolbar = ({ onFiltersChange, totalVouchers, filteredCount }) => {
  const [filters, setFilters] = useState({
    dateRange: 'today',
    paymentStatus: 'all',
    customer: '',
    voucherNumber: '',
    startDate: '',
    endDate: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this_week', label: 'This Week' },
    { value: 'last_week', label: 'Last Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'this_year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const paymentStatusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'partial', label: 'Partial' },
    { value: 'unpaid', label: 'Unpaid' }
  ];

  const customerOptions = [
    { value: '', label: 'All Customers' },
    { value: 'walk_in', label: 'Walk-in Customer' },
    { value: 'mg_aung', label: 'Mg Aung' },
    { value: 'daw_su', label: 'Daw Su Su' },
    { value: 'ko_thant', label: 'Ko Thant' },
    { value: 'ma_mya', label: 'Ma Mya Mya' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      dateRange: 'today',
      paymentStatus: 'all',
      customer: '',
      voucherNumber: '',
      startDate: '',
      endDate: ''
    };
    setFilters(resetFilters);
    onFiltersChange(resetFilters);
    setShowAdvanced(false);
  };

  const handleExport = () => {
    console.log('Exporting filtered vouchers...');
  };

  const handlePrintReport = () => {
    console.log('Printing sales report...');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Main Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
        <div className="md:col-span-2">
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
          />
        </div>
        
        <div>
          <Select
            label="Payment Status"
            options={paymentStatusOptions}
            value={filters?.paymentStatus}
            onChange={(value) => handleFilterChange('paymentStatus', value)}
          />
        </div>

        <div>
          <Select
            label="Customer"
            options={customerOptions}
            value={filters?.customer}
            onChange={(value) => handleFilterChange('customer', value)}
            searchable
          />
        </div>

        <div>
          <Input
            label="Voucher Number"
            type="text"
            placeholder="POS-2025-001"
            value={filters?.voucherNumber}
            onChange={(e) => handleFilterChange('voucherNumber', e?.target?.value)}
          />
        </div>

        <div className="flex items-end space-x-2">
          <Button
            variant="outline"
            size="default"
            iconName="Filter"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Less' : 'More'}
          </Button>
        </div>
      </div>
      {/* Custom Date Range */}
      {filters?.dateRange === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
          <Input
            label="Start Date"
            type="date"
            value={filters?.startDate}
            onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
          />
          <Input
            label="End Date"
            type="date"
            value={filters?.endDate}
            onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
          />
        </div>
      )}
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-border pt-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            <Input
              label="Min Amount (Ks)"
              type="number"
              placeholder="0"
              value={filters?.minAmount || ''}
              onChange={(e) => handleFilterChange('minAmount', e?.target?.value)}
            />
            <Input
              label="Max Amount (Ks)"
              type="number"
              placeholder="1000000"
              value={filters?.maxAmount || ''}
              onChange={(e) => handleFilterChange('maxAmount', e?.target?.value)}
            />
            <Select
              label="Payment Method"
              options={[
                { value: '', label: 'All Methods' },
                { value: 'cash', label: 'Cash' },
                { value: 'kbzpay', label: 'KBZPay' },
                { value: 'wavepay', label: 'WavePay' },
                { value: 'credit', label: 'Credit' }
              ]}
              value={filters?.paymentMethod || ''}
              onChange={(value) => handleFilterChange('paymentMethod', value)}
            />
            <Select
              label="Sort By"
              options={[
                { value: 'date_desc', label: 'Date (Newest)' },
                { value: 'date_asc', label: 'Date (Oldest)' },
                { value: 'amount_desc', label: 'Amount (High to Low)' },
                { value: 'amount_asc', label: 'Amount (Low to High)' },
                { value: 'customer', label: 'Customer Name' }
              ]}
              value={filters?.sortBy || 'date_desc'}
              onChange={(value) => handleFilterChange('sortBy', value)}
            />
          </div>
        </div>
      )}
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-4 mb-3 sm:mb-0">
          <span className="text-sm text-muted-foreground">
            Showing {filteredCount} of {totalVouchers} vouchers
          </span>
          {(filters?.dateRange !== 'today' || filters?.paymentStatus !== 'all' || 
            filters?.customer || filters?.voucherNumber) && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={handleReset}
            >
              Clear Filters
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            onClick={handleExport}
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Printer"
            onClick={handlePrintReport}
          >
            Print Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            onClick={() => window.location?.reload()}
          >
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterToolbar;