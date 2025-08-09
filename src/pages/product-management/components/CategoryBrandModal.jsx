import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CategoryBrandModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  type, // 'category' or 'brand'
  item = null, // null for add, item object for edit
  mode = 'add' // 'add', 'edit', 'manage'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'manage') {
        // Load existing items for management view
        const savedItems = JSON.parse(localStorage.getItem(`pos_${type}s`) || '[]');
        setItems(savedItems);
      } else if (item && mode === 'edit') {
        setFormData({
          name: item?.name || '',
          description: item?.description || ''
        });
      } else {
        setFormData({
          name: '',
          description: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, item, mode, type]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.name?.trim()) {
      newErrors.name = `${type === 'category' ? 'Category' : 'Brand'} name is required`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const itemData = {
        ...formData,
        id: mode === 'edit' ? item?.id : Date.now(),
        createdAt: mode === 'edit' ? item?.createdAt : new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      };

      await onSave(itemData, mode);
      
      if (mode === 'manage') {
        // Update local items list
        const savedItems = JSON.parse(localStorage.getItem(`pos_${type}s`) || '[]');
        if (mode === 'edit') {
          const updatedItems = savedItems?.map(existingItem => 
            existingItem?.id === itemData?.id ? itemData : existingItem
          );
          setItems(updatedItems);
        } else {
          setItems([...savedItems, itemData]);
        }
      }
      
      setFormData({ name: '', description: '' });
      
      if (mode !== 'manage') {
        onClose();
      }
    } catch (error) {
      console.error(`Error saving ${type}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (selectedItem) => {
    setFormData({
      name: selectedItem?.name || '',
      description: selectedItem?.description || ''
    });
    // Don't change mode here, just update form data
  };

  const handleDelete = async (itemToDelete) => {
    if (window.confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) {
      try {
        await onDelete(itemToDelete?.id);
        const updatedItems = items?.filter(item => item?.id !== itemToDelete?.id);
        setItems(updatedItems);
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
      }
    }
  };

  if (!isOpen) return null;

  const modalTitle = mode === 'manage' 
    ? `Manage ${type === 'category' ? 'Categories' : 'Brands'}`
    : mode === 'edit' 
      ? `Edit ${type === 'category' ? 'Category' : 'Brand'}`
      : `Add New ${type === 'category' ? 'Category' : 'Brand'}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">{modalTitle}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6">
          {mode === 'manage' ? (
            // Management View
            <div className="space-y-6">
              {/* Add Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={`${type === 'category' ? 'Category' : 'Brand'} Name`}
                    value={formData?.name}
                    onChange={(e) => handleInputChange('name', e?.target?.value)}
                    error={errors?.name}
                    required
                    placeholder={`Enter ${type} name`}
                  />
                  <Input
                    label="Description"
                    value={formData?.description}
                    onChange={(e) => handleInputChange('description', e?.target?.value)}
                    placeholder="Optional description"
                  />
                </div>
                <Button type="submit" loading={isLoading} className="w-full">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Add {type === 'category' ? 'Category' : 'Brand'}
                </Button>
              </form>

              {/* Items List */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Existing {type === 'category' ? 'Categories' : 'Brands'} ({items?.length})
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {items?.length > 0 ? (
                    items?.map((listItem) => (
                      <div key={listItem?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                        <div>
                          <h4 className="font-medium text-foreground">{listItem?.name}</h4>
                          {listItem?.description && (
                            <p className="text-sm text-muted-foreground">{listItem?.description}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(listItem)}
                          >
                            <Icon name="Edit" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(listItem)}
                            className="text-error hover:bg-error/10"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Icon name="Package" size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No {type}s added yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Add/Edit Form
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Input
                  label={`${type === 'category' ? 'Category' : 'Brand'} Name`}
                  value={formData?.name}
                  onChange={(e) => handleInputChange('name', e?.target?.value)}
                  error={errors?.name}
                  required
                  placeholder={`Enter ${type} name`}
                />
                <Input
                  label="Description"
                  value={formData?.description}
                  onChange={(e) => handleInputChange('description', e?.target?.value)}
                  placeholder="Optional description"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" loading={isLoading}>
                  {mode === 'edit' ? `Update ${type === 'category' ? 'Category' : 'Brand'}` : `Save ${type === 'category' ? 'Category' : 'Brand'}`}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryBrandModal;