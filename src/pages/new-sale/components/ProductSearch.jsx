import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ProductSearch = ({ onProductSelect, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);

  const mockProducts = [
    {
      id: 1,
      sku: 'RICE001',
      name: 'ထမင်းဆန် (၅ကီလို)',
      category: 'food',
      price: 8500,
      stock: 45,
      image: 'https://images.pexels.com/photos/33239/rice-grain-seed-food.jpg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 2,
      sku: 'OIL001',
      name: 'ပြောင်းဆီ (၁လီတာ)',
      category: 'food',
      price: 3200,
      stock: 28,
      image: 'https://images.pexels.com/photos/4198170/pexels-photo-4198170.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 3,
      sku: 'SOAP001',
      name: 'ဆပ်ပြာ (လက်ဆေး)',
      category: 'personal-care',
      price: 1500,
      stock: 67,
      image: 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 4,
      sku: 'NOODLE001',
      name: 'ခေါက်ဆွဲ (မမ်)',
      category: 'food',
      price: 800,
      stock: 120,
      image: 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 5,
      sku: 'DRINK001',
      name: 'ကိုကာကိုလာ (၃၃၀မီလီ)',
      category: 'beverages',
      price: 1200,
      stock: 89,
      image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 6,
      sku: 'TOOTH001',
      name: 'သွားတိုက်ဆေး',
      category: 'personal-care',
      price: 2800,
      stock: 34,
      image: 'https://images.pexels.com/photos/298611/pexels-photo-298611.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  const categories = [
    { value: 'all', label: 'အားလုံး' },
    { value: 'food', label: 'အစားအစာ' },
    { value: 'beverages', label: 'အရည်များ' },
    { value: 'personal-care', label: 'ကိုယ်ရေးကိုယ်တာ' },
    { value: 'household', label: 'အိမ်သုံးပစ္စည်း' }
  ];

  useEffect(() => {
    setProducts(mockProducts);
    setRecentProducts(mockProducts?.slice(0, 3));
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered?.filter(product => product?.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered?.filter(product =>
        product?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        product?.sku?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const handleProductSelect = (product) => {
    onProductSelect(product);
    setSearchTerm('');
  };

  const getStockStatus = (stock) => {
    if (stock <= 10) return { color: 'text-error', label: 'နည်း' };
    if (stock <= 30) return { color: 'text-warning', label: 'အလယ်အလတ်' };
    return { color: 'text-success', label: 'များ' };
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-4 ${className}`}>
      <div className="space-y-4">
        {/* Search Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">ကုန်ပစ္စည်းရှာဖွေရန်</h3>
          <Button variant="ghost" size="icon">
            <Icon name="Scan" size={20} />
          </Button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Input
            type="text"
            placeholder="SKU သို့မဟုတ် ကုန်ပစ္စည်းအမည်ရိုက်ထည့်ပါ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="pl-10"
          />
          <Icon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories?.map((category) => (
            <Button
              key={category?.value}
              variant={selectedCategory === category?.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category?.value)}
            >
              {category?.label}
            </Button>
          ))}
        </div>

        {/* Product List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {searchTerm || selectedCategory !== 'all' ? (
            // Search Results
            (filteredProducts?.length > 0 ? (filteredProducts?.map((product) => {
              const stockStatus = getStockStatus(product?.stock);
              return (
                <div
                  key={product?.id}
                  onClick={() => handleProductSelect(product)}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted cursor-pointer transition-colors"
                >
                  <img
                    src={product?.image}
                    alt={product?.name}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/images/no_image.png';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {product?.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      SKU: {product?.sku}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-semibold text-primary">
                        {product?.price?.toLocaleString()} Ks
                      </span>
                      <span className={`text-xs ${stockStatus?.color}`}>
                        {product?.stock} {stockStatus?.label}
                      </span>
                    </div>
                  </div>
                  <Icon name="Plus" size={16} className="text-muted-foreground" />
                </div>
              );
            })) : (<div className="text-center py-8">
              <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">ကုန်ပစ္စည်းမတွေ့ပါ</p>
            </div>))
          ) : (
            // Recent Products
            (<div>
              <h4 className="text-sm font-medium text-foreground mb-3">မကြာသေးမီရောင်းချခဲ့သော</h4>
              {recentProducts?.map((product) => {
                const stockStatus = getStockStatus(product?.stock);
                return (
                  <div
                    key={product?.id}
                    onClick={() => handleProductSelect(product)}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted cursor-pointer transition-colors mb-2"
                  >
                    <img
                      src={product?.image}
                      alt={product?.name}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/images/no_image.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {product?.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        SKU: {product?.sku}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-semibold text-primary">
                          {product?.price?.toLocaleString()} Ks
                        </span>
                        <span className={`text-xs ${stockStatus?.color}`}>
                          {product?.stock} {stockStatus?.label}
                        </span>
                      </div>
                    </div>
                    <Icon name="Plus" size={16} className="text-muted-foreground" />
                  </div>
                );
              })}
            </div>)
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSearch;