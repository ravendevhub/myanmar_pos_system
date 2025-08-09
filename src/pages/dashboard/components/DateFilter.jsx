import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DateFilter = ({ onFilterChange, className = '' }) => {
  const [activeFilter, setActiveFilter] = useState('today');
  const [customRange, setCustomRange] = useState({
    startDate: '',
    endDate: ''
  });

  const filterOptions = [
    { id: 'today', label: 'Today', value: 'today' },
    { id: 'week', label: 'This Week', value: 'week' },
    { id: 'month', label: 'This Month', value: 'month' },
    { id: 'custom', label: 'Custom Range', value: 'custom' }
  ];

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    
    const today = new Date();
    let startDate, endDate;

    switch (filterId) {
      case 'today':
        startDate = endDate = today?.toISOString()?.split('T')?.[0];
        break;
      case 'week':
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
        const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        startDate = weekStart?.toISOString()?.split('T')?.[0];
        endDate = weekEnd?.toISOString()?.split('T')?.[0];
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)?.toISOString()?.split('T')?.[0];
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)?.toISOString()?.split('T')?.[0];
        break;
      case 'custom':
        return; // Don't trigger change until custom dates are set
      default:
        return;
    }

    onFilterChange && onFilterChange({ startDate, endDate, type: filterId });
  };

  const handleCustomRangeChange = (field, value) => {
    const newRange = { ...customRange, [field]: value };
    setCustomRange(newRange);

    if (newRange?.startDate && newRange?.endDate) {
      onFilterChange && onFilterChange({
        startDate: newRange?.startDate,
        endDate: newRange?.endDate,
        type: 'custom'
      });
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <h4 className="text-sm font-medium text-foreground mb-3">Filter by Date</h4>
      <div className="flex flex-wrap gap-2 mb-4">
        {filterOptions?.map((option) => (
          <Button
            key={option?.id}
            variant={activeFilter === option?.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange(option?.id)}
          >
            {option?.label}
          </Button>
        ))}
      </div>
      {activeFilter === 'custom' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            type="date"
            label="Start Date"
            value={customRange?.startDate}
            onChange={(e) => handleCustomRangeChange('startDate', e?.target?.value)}
          />
          <Input
            type="date"
            label="End Date"
            value={customRange?.endDate}
            onChange={(e) => handleCustomRangeChange('endDate', e?.target?.value)}
          />
        </div>
      )}
    </div>
  );
};

export default DateFilter;