import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ProductTable = ({ 
  products, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onViewHistory, 
  selectedProducts, 
  onSelectProduct, 
  onSelectAll,
  sortConfig,
  onSort 
}) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRowExpansion = (productId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded?.has(productId)) {
      newExpanded?.delete(productId);
    } else {
      newExpanded?.add(productId);
    }
    setExpandedRows(newExpanded);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US')?.format(price) + ' Ks';
  };

  const getStockStatus = (currentStock, minStock) => {
    if (currentStock === 0) {
      return { status: 'out', color: 'text-error', bg: 'bg-error/10' };
    } else if (currentStock <= minStock) {
      return { status: 'low', color: 'text-warning', bg: 'bg-warning/10' };
    }
    return { status: 'good', color: 'text-success', bg: 'bg-success/10' };
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const handleSort = (column) => {
    onSort(column);
  };

  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    return (
      <div className="space-y-4">
        {products?.map((product) => {
          const stockStatus = getStockStatus(product?.currentStock, product?.minStock);
          const isExpanded = expandedRows?.has(product?.id);
          
          return (
            <div key={product?.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={selectedProducts?.includes(product?.id)}
                  onChange={(e) => onSelectProduct(product?.id, e?.target?.checked)}
                  className="mt-1"
                />
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {product?.image ? (
                    <Image 
                      src={product?.image} 
                      alt={product?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon name="Package" size={20} className="text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-foreground truncate">{product?.name}</h3>
                      <p className="text-sm text-muted-foreground">SKU: {product?.sku}</p>
                      <p className="text-sm text-muted-foreground">{product?.category}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRowExpansion(product?.id)}
                    >
                      <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
                    </Button>
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">{formatPrice(product?.sellingPrice)}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${stockStatus?.bg} ${stockStatus?.color}`}>
                      {product?.currentStock} units
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-border space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Brand:</span>
                          <span className="ml-1 text-foreground">{product?.brand}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Unit:</span>
                          <span className="ml-1 text-foreground">{product?.unit}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Purchase:</span>
                          <span className="ml-1 text-foreground">{formatPrice(product?.purchasePrice)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Min Stock:</span>
                          <span className="ml-1 text-foreground">{product?.minStock}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
                          <Icon name="Edit" size={14} />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onDuplicate(product)}>
                          <Icon name="Copy" size={14} />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onViewHistory(product)}>
                          <Icon name="History" size={14} />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => onDelete(product?.id)}>
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={selectedProducts?.length === products?.length && products?.length > 0}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="text-left p-4 font-medium text-foreground">Image</th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('sku')}
                  className="flex items-center space-x-1 hover:text-primary"
                >
                  <span>SKU</span>
                  <Icon name={getSortIcon('sku')} size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-primary"
                >
                  <span>Product Name</span>
                  <Icon name={getSortIcon('name')} size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center space-x-1 hover:text-primary"
                >
                  <span>Category</span>
                  <Icon name={getSortIcon('category')} size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Brand</th>
              <th className="text-right p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('purchasePrice')}
                  className="flex items-center space-x-1 hover:text-primary ml-auto"
                >
                  <span>Purchase Price</span>
                  <Icon name={getSortIcon('purchasePrice')} size={14} />
                </button>
              </th>
              <th className="text-right p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('sellingPrice')}
                  className="flex items-center space-x-1 hover:text-primary ml-auto"
                >
                  <span>Selling Price</span>
                  <Icon name={getSortIcon('sellingPrice')} size={14} />
                </button>
              </th>
              <th className="text-center p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('currentStock')}
                  className="flex items-center space-x-1 hover:text-primary mx-auto"
                >
                  <span>Stock</span>
                  <Icon name={getSortIcon('currentStock')} size={14} />
                </button>
              </th>
              <th className="text-center p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => {
              const stockStatus = getStockStatus(product?.currentStock, product?.minStock);
              
              return (
                <tr key={product?.id} className="border-b border-border hover:bg-muted/30">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts?.includes(product?.id)}
                      onChange={(e) => onSelectProduct(product?.id, e?.target?.checked)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {product?.image ? (
                        <Image 
                          src={product?.image} 
                          alt={product?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon name="Package" size={16} className="text-muted-foreground" />
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-mono text-sm text-foreground">{product?.sku}</td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">{product?.name}</p>
                      <p className="text-sm text-muted-foreground">{product?.unit}</p>
                    </div>
                  </td>
                  <td className="p-4 text-foreground">{product?.category}</td>
                  <td className="p-4 text-foreground">{product?.brand}</td>
                  <td className="p-4 text-right text-foreground">{formatPrice(product?.purchasePrice)}</td>
                  <td className="p-4 text-right font-medium text-foreground">{formatPrice(product?.sellingPrice)}</td>
                  <td className="p-4 text-center">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${stockStatus?.bg} ${stockStatus?.color}`}>
                      <span className="font-medium">{product?.currentStock}</span>
                      {product?.currentStock <= product?.minStock && (
                        <Icon name="AlertTriangle" size={14} className="ml-1" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
                        <Icon name="Edit" size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDuplicate(product)}>
                        <Icon name="Copy" size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onViewHistory(product)}>
                        <Icon name="History" size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(product?.id)}>
                        <Icon name="Trash2" size={14} className="text-error" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;