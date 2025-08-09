import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ProductModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  product, 
  categories, 
  brands,
  mode = 'add' // 'add', 'edit', 'duplicate'
}) => {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    brand: '',
    unit: '',
    description: '',
    purchasePrice: '',
    sellingPrice: '',
    currentStock: '',
    minStock: '',
    image: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (product && (mode === 'edit' || mode === 'duplicate')) {
        setFormData({
          sku: mode === 'duplicate' ? generateSKU() : product?.sku,
          name: mode === 'duplicate' ? `${product?.name} (Copy)` : product?.name,
          category: product?.category,
          brand: product?.brand,
          unit: product?.unit,
          description: product?.description,
          purchasePrice: product?.purchasePrice?.toString(),
          sellingPrice: product?.sellingPrice?.toString(),
          currentStock: mode === 'duplicate' ? '0' : product?.currentStock?.toString(),
          minStock: product?.minStock?.toString(),
          image: product?.image || ''
        });
      } else {
        setFormData({
          sku: generateSKU(),
          name: '',
          category: '',
          brand: '',
          unit: '',
          description: '',
          purchasePrice: '',
          sellingPrice: '',
          currentStock: '0',
          minStock: '5',
          image: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, product, mode]);

  const generateSKU = () => {
    const timestamp = Date.now()?.toString()?.slice(-6);
    return `PRD${timestamp}`;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.sku?.trim()) newErrors.sku = 'SKU is required';
    if (!formData?.name?.trim()) newErrors.name = 'Product name is required';
    if (!formData?.category) newErrors.category = 'Category is required';
    if (!formData?.brand?.trim()) newErrors.brand = 'Brand is required';
    if (!formData?.unit?.trim()) newErrors.unit = 'Unit is required';
    if (!formData?.purchasePrice || parseFloat(formData?.purchasePrice) <= 0) {
      newErrors.purchasePrice = 'Valid purchase price is required';
    }
    if (!formData?.sellingPrice || parseFloat(formData?.sellingPrice) <= 0) {
      newErrors.sellingPrice = 'Valid selling price is required';
    }
    if (parseFloat(formData?.sellingPrice) <= parseFloat(formData?.purchasePrice)) {
      newErrors.sellingPrice = 'Selling price must be higher than purchase price';
    }
    if (!formData?.currentStock || parseInt(formData?.currentStock) < 0) {
      newErrors.currentStock = 'Valid stock quantity is required';
    }
    if (!formData?.minStock || parseInt(formData?.minStock) < 0) {
      newErrors.minStock = 'Valid minimum stock is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const productData = {
        ...formData,
        purchasePrice: parseFloat(formData?.purchasePrice),
        sellingPrice: parseFloat(formData?.sellingPrice),
        currentStock: parseInt(formData?.currentStock),
        minStock: parseInt(formData?.minStock),
        id: mode === 'edit' ? product?.id : Date.now(),
        createdAt: mode === 'edit' ? product?.createdAt : new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      };

      await onSave(productData);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryOptions = categories?.map(cat => ({ value: cat, label: cat }));
  const brandOptions = brands?.map(brand => ({ value: brand, label: brand }));

  const unitOptions = [
    { value: 'piece', label: 'Piece' },
    { value: 'kg', label: 'Kilogram' },
    { value: 'gram', label: 'Gram' },
    { value: 'liter', label: 'Liter' },
    { value: 'meter', label: 'Meter' },
    { value: 'box', label: 'Box' },
    { value: 'pack', label: 'Pack' },
    { value: 'bottle', label: 'Bottle' }
  ];

  if (!isOpen) return null;

  const modalTitle = {
    add: 'Add New Product',
    edit: 'Edit Product',
    duplicate: 'Duplicate Product'
  }?.[mode];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">{modalTitle}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="SKU"
              value={formData?.sku}
              onChange={(e) => handleInputChange('sku', e?.target?.value)}
              error={errors?.sku}
              required
              placeholder="Product SKU"
            />

            <Input
              label="Product Name"
              value={formData?.name}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              error={errors?.name}
              required
              placeholder="Enter product name"
            />

            <Select
              label="Category"
              options={categoryOptions}
              value={formData?.category}
              onChange={(value) => handleInputChange('category', value)}
              error={errors?.category}
              required
              searchable
              placeholder="Select category"
            />

            <Input
              label="Brand"
              value={formData?.brand}
              onChange={(e) => handleInputChange('brand', e?.target?.value)}
              error={errors?.brand}
              required
              placeholder="Enter brand name"
            />

            <Select
              label="Unit"
              options={unitOptions}
              value={formData?.unit}
              onChange={(value) => handleInputChange('unit', value)}
              error={errors?.unit}
              required
              placeholder="Select unit"
            />

            <Input
              label="Purchase Price (Ks)"
              type="number"
              value={formData?.purchasePrice}
              onChange={(e) => handleInputChange('purchasePrice', e?.target?.value)}
              error={errors?.purchasePrice}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />

            <Input
              label="Selling Price (Ks)"
              type="number"
              value={formData?.sellingPrice}
              onChange={(e) => handleInputChange('sellingPrice', e?.target?.value)}
              error={errors?.sellingPrice}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />

            <Input
              label="Current Stock"
              type="number"
              value={formData?.currentStock}
              onChange={(e) => handleInputChange('currentStock', e?.target?.value)}
              error={errors?.currentStock}
              required
              min="0"
              placeholder="0"
            />

            <Input
              label="Minimum Stock Alert"
              type="number"
              value={formData?.minStock}
              onChange={(e) => handleInputChange('minStock', e?.target?.value)}
              error={errors?.minStock}
              required
              min="0"
              placeholder="5"
            />
          </div>

          <Input
            label="Description"
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            placeholder="Product description (optional)"
          />

          <Input
            label="Product Image URL"
            value={formData?.image}
            onChange={(e) => handleInputChange('image', e?.target?.value)}
            placeholder="https://example.com/image.jpg (optional)"
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              {mode === 'edit' ? 'Update Product' : 'Save Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;