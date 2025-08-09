import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SearchFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange, 
  selectedBrand, 
  onBrandChange,
  stockFilter,
  onStockFilterChange,
  onClearFilters,
  categories,
  brands 
}) => {
  const stockFilterOptions = [
    { value: 'all', label: 'All Stock Levels' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories?.map(cat => ({ value: cat, label: cat }))
  ];

  const brandOptions = [
    { value: '', label: 'All Brands' },
    ...brands?.map(brand => ({ value: brand, label: brand }))
  ];

  const hasActiveFilters = searchTerm || selectedCategory || selectedBrand || stockFilter !== 'all';

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <Input
            type="search"
            placeholder="Search by SKU or product name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Category Filter */}
        <div>
          <Select
            placeholder="Category"
            options={categoryOptions}
            value={selectedCategory}
            onChange={onCategoryChange}
          />
        </div>

        {/* Brand Filter */}
        <div>
          <Select
            placeholder="Brand"
            options={brandOptions}
            value={selectedBrand}
            onChange={onBrandChange}
          />
        </div>

        {/* Stock Level Filter */}
        <div className="md:col-span-2 lg:col-span-1">
          <Select
            placeholder="Stock Level"
            options={stockFilterOptions}
            value={stockFilter}
            onChange={onStockFilterChange}
          />
        </div>

        {/* Clear Filters */}
        <div className="md:col-span-2 lg:col-span-1 flex items-end">
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="w-full"
              iconName="X"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            
            {searchTerm && (
              <div className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                <Icon name="Search" size={12} className="mr-1" />
                <span>"{searchTerm}"</span>
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}

            {selectedCategory && (
              <div className="flex items-center bg-secondary/10 text-secondary px-2 py-1 rounded-full text-sm">
                <Icon name="Tag" size={12} className="mr-1" />
                <span>{selectedCategory}</span>
                <button
                  onClick={() => onCategoryChange('')}
                  className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}

            {selectedBrand && (
              <div className="flex items-center bg-accent/10 text-accent px-2 py-1 rounded-full text-sm">
                <Icon name="Award" size={12} className="mr-1" />
                <span>{selectedBrand}</span>
                <button
                  onClick={() => onBrandChange('')}
                  className="ml-1 hover:bg-accent/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}

            {stockFilter !== 'all' && (
              <div className="flex items-center bg-warning/10 text-warning px-2 py-1 rounded-full text-sm">
                <Icon name="Package" size={12} className="mr-1" />
                <span>{stockFilterOptions?.find(opt => opt?.value === stockFilter)?.label}</span>
                <button
                  onClick={() => onStockFilterChange('all')}
                  className="ml-1 hover:bg-warning/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;