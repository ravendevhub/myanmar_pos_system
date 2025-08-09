import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SaleCart = ({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onUpdateDiscount,
  subtotal,
  totalDiscount,
  tax,
  total,
  className = '' 
}) => {
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    onUpdateQuantity(itemId, newQuantity);
  };

  const handleDiscountChange = (itemId, discount, type = 'flat') => {
    onUpdateDiscount(itemId, discount, type);
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString() + ' Ks';
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-4 ${className}`}>
      <div className="space-y-4">
        {/* Cart Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">ရောင်းချမည့်စာရင်း</h3>
          <div className="text-sm text-muted-foreground">
            {cartItems?.length} ပစ္စည်း
          </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {cartItems?.length > 0 ? (
            cartItems?.map((item) => (
              <div key={item?.id} className="border border-border rounded-lg p-3">
                <div className="flex items-start space-x-3">
                  <img
                    src={item?.image}
                    alt={item?.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => {
                      e.target.src = '/assets/images/no_image.png';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {item?.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      SKU: {item?.sku}
                    </p>
                    <p className="text-sm text-primary font-medium">
                      {formatCurrency(item?.price)} × {item?.quantity}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(item?.id)}
                    className="flex-shrink-0"
                  >
                    <Icon name="Trash2" size={16} className="text-error" />
                  </Button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item?.id, item?.quantity - 1)}
                      disabled={item?.quantity <= 1}
                    >
                      <Icon name="Minus" size={16} />
                    </Button>
                    <span className="w-12 text-center text-sm font-medium">
                      {item?.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item?.id, item?.quantity + 1)}
                    >
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(item?.lineTotal)}
                    </p>
                    {item?.discount > 0 && (
                      <p className="text-xs text-success">
                        -{formatCurrency(item?.discount)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Discount Input */}
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="လျှော့စျေး"
                      value={item?.discountAmount || ''}
                      onChange={(e) => handleDiscountChange(item?.id, parseFloat(e?.target?.value) || 0, 'flat')}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm">
                      Ks
                    </Button>
                    <Button variant="outline" size="sm">
                      %
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Icon name="ShoppingCart" size={48} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">ကုန်ပစ္စည်းမရွေးချယ်ရသေးပါ</p>
              <p className="text-sm text-muted-foreground mt-1">
                ဘယ်ဘက်မှ ကုန်ပစ္စည်းများကို ရွေးချယ်ပါ
              </p>
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {cartItems?.length > 0 && (
          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">စုစုပေါင်း</span>
              <span className="text-foreground">{formatCurrency(subtotal)}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">လျှော့စျေး</span>
                <span className="text-success">-{formatCurrency(totalDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">အခွန် (5%)</span>
              <span className="text-foreground">{formatCurrency(tax)}</span>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-foreground">စုစုပေါင်း</span>
                <span className="text-lg font-bold text-primary">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaleCart;