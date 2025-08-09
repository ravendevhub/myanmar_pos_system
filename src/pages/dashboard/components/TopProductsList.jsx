import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TopProductsList = ({ products = [], title = "Top Selling Products" }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(value) + ' Ks';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="space-y-3">
        {products?.map((product, index) => (
          <div key={product?.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-primary">#{index + 1}</span>
            </div>
            
            <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-muted">
              <Image 
                src={product?.image} 
                alt={product?.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {product?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                SKU: {product?.sku}
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {product?.soldQuantity} units
              </p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(product?.revenue)}
              </p>
            </div>
          </div>
        ))}
        
        {products?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No sales data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProductsList;