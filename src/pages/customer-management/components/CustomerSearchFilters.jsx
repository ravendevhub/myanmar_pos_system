import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';


const CustomerSearchFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  debtFilter, 
  setDebtFilter, 
  activityFilter, 
  setActivityFilter,
  onClearFilters 
}) => {
  const debtFilterOptions = [
    { value: 'all', label: 'All Customers' },
    { value: 'with-debt', label: 'With Outstanding Debt' },
    { value: 'no-debt', label: 'No Outstanding Debt' },
    { value: 'overdue', label: 'Overdue Payments' }
  ];

  const activityFilterOptions = [
    { value: 'all', label: 'All Activity' },
    { value: 'recent', label: 'Recent Customers (30 days)' },
    { value: 'inactive', label: 'Inactive (90+ days)' },
    { value: 'top-buyers', label: 'Top Buyers' }
  ];

  const hasActiveFilters = searchTerm || debtFilter !== 'all' || activityFilter !== 'all';

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Search & Filter Customers</h3>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
          >
            Clear Filters
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <Input
            type="search"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full"
          />
        </div>
        
        <div className="md:col-span-1">
          <Select
            options={debtFilterOptions}
            value={debtFilter}
            onChange={setDebtFilter}
            placeholder="Filter by debt status"
          />
        </div>
        
        <div className="md:col-span-1">
          <Select
            options={activityFilterOptions}
            value={activityFilter}
            onChange={setActivityFilter}
            placeholder="Filter by activity"
          />
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning/20 border-l-4 border-l-warning rounded-sm"></div>
            <span>Outstanding Debt</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error/20 border-l-4 border-l-error rounded-sm"></div>
            <span>Overdue Payment</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="Download">
            Export
          </Button>
          <Button variant="outline" size="sm" iconName="MessageSquare">
            Bulk Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerSearchFilters;