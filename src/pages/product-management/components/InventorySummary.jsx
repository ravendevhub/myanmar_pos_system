import React from 'react';
import Icon from '../../../components/AppIcon';

const InventorySummary = ({ products }) => {
  const totalProducts = products?.length;
  const totalValue = products?.reduce((sum, product) => sum + (product?.sellingPrice * product?.currentStock), 0);
  const lowStockProducts = products?.filter(product => product?.currentStock <= product?.minStock && product?.currentStock > 0);
  const outOfStockProducts = products?.filter(product => product?.currentStock === 0);
  const categories = [...new Set(products.map(product => product.category))]?.length;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US')?.format(price) + ' Ks';
  };

  const summaryCards = [
    {
      title: 'Total Products',
      value: totalProducts?.toLocaleString(),
      icon: 'Package',
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      title: 'Total Value',
      value: formatPrice(totalValue),
      icon: 'DollarSign',
      color: 'text-success',
      bg: 'bg-success/10'
    },
    {
      title: 'Categories',
      value: categories?.toString(),
      icon: 'Tag',
      color: 'text-secondary',
      bg: 'bg-secondary/10'
    },
    {
      title: 'Low Stock',
      value: lowStockProducts?.length?.toString(),
      icon: 'AlertTriangle',
      color: 'text-warning',
      bg: 'bg-warning/10'
    },
    {
      title: 'Out of Stock',
      value: outOfStockProducts?.length?.toString(),
      icon: 'XCircle',
      color: 'text-error',
      bg: 'bg-error/10'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Inventory Summary</h3>
      <div className="grid grid-cols-1 gap-4">
        {summaryCards?.map((card, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg ${card?.bg} flex items-center justify-center`}>
                <Icon name={card?.icon} size={20} className={card?.color} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card?.title}</p>
                <p className="text-lg font-semibold text-foreground">{card?.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Low Stock Alerts */}
      {lowStockProducts?.length > 0 && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <h4 className="font-medium text-warning">Low Stock Alerts</h4>
          </div>
          <div className="space-y-2">
            {lowStockProducts?.slice(0, 5)?.map((product) => (
              <div key={product?.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground truncate">{product?.name}</span>
                <span className="text-warning font-medium">{product?.currentStock} left</span>
              </div>
            ))}
            {lowStockProducts?.length > 5 && (
              <p className="text-xs text-muted-foreground">
                +{lowStockProducts?.length - 5} more items
              </p>
            )}
          </div>
        </div>
      )}
      {/* Out of Stock Alerts */}
      {outOfStockProducts?.length > 0 && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="XCircle" size={16} className="text-error" />
            <h4 className="font-medium text-error">Out of Stock</h4>
          </div>
          <div className="space-y-2">
            {outOfStockProducts?.slice(0, 5)?.map((product) => (
              <div key={product?.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground truncate">{product?.name}</span>
                <span className="text-error font-medium">0 units</span>
              </div>
            ))}
            {outOfStockProducts?.length > 5 && (
              <p className="text-xs text-muted-foreground">
                +{outOfStockProducts?.length - 5} more items
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventorySummary;