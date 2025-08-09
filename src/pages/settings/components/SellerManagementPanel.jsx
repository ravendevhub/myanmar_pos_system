import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SellerManagementPanel = () => {
  const [sellers, setSellers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    commissionRate: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = () => {
    const savedSellers = JSON.parse(localStorage.getItem('pos_sellers') || '[]');
    setSellers(savedSellers);
  };

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
    if (!formData?.name?.trim()) newErrors.name = 'Seller name is required';
    if (formData?.email && !/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (formData?.commissionRate && (parseFloat(formData?.commissionRate) < 0 || parseFloat(formData?.commissionRate) > 100)) {
      newErrors.commissionRate = 'Commission rate must be between 0-100%';
    }
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const sellerData = {
        ...formData,
        commissionRate: formData?.commissionRate ? parseFloat(formData?.commissionRate) : 0,
        id: editingSeller ? editingSeller?.id : Date.now(),
        createdAt: editingSeller ? editingSeller?.createdAt : new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      };

      const savedSellers = JSON.parse(localStorage.getItem('pos_sellers') || '[]');
      
      let updatedSellers;
      if (editingSeller) {
        updatedSellers = savedSellers?.map(seller => 
          seller?.id === editingSeller?.id ? sellerData : seller
        );
      } else {
        updatedSellers = [...savedSellers, sellerData];
      }
      
      localStorage.setItem('pos_sellers', JSON.stringify(updatedSellers));
      setSellers(updatedSellers);
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving seller:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (seller) => {
    setEditingSeller(seller);
    setFormData({
      name: seller?.name || '',
      phone: seller?.phone || '',
      email: seller?.email || '',
      address: seller?.address || '',
      commissionRate: seller?.commissionRate?.toString() || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (seller) => {
    if (window.confirm(`Are you sure you want to delete ${seller?.name}? This action cannot be undone.`)) {
      const savedSellers = JSON.parse(localStorage.getItem('pos_sellers') || '[]');
      let updatedSellers = savedSellers?.filter(s => s?.id !== seller?.id);
      localStorage.setItem('pos_sellers', JSON.stringify(updatedSellers));
      setSellers(updatedSellers);
    }
  };

  const handleAdd = () => {
    setEditingSeller(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      commissionRate: ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSeller(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      commissionRate: ''
    });
    setErrors({});
  };

  const filteredSellers = sellers?.filter(seller =>
    seller?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    seller?.phone?.includes(searchTerm) ||
    seller?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Seller Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage sellers and sales staff
          </p>
        </div>
        <Button onClick={handleAdd} iconName="UserPlus">
          Add Seller
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search sellers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            icon="Search"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredSellers?.length} seller(s)
        </div>
      </div>

      {/* Sellers List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {filteredSellers?.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredSellers?.map((seller) => (
              <div key={seller?.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name="User" size={20} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{seller?.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          {seller?.phone && (
                            <span className="flex items-center space-x-1">
                              <Icon name="Phone" size={14} />
                              <span>{seller?.phone}</span>
                            </span>
                          )}
                          {seller?.email && (
                            <span className="flex items-center space-x-1">
                              <Icon name="Mail" size={14} />
                              <span>{seller?.email}</span>
                            </span>
                          )}
                        </div>
                        {seller?.address && (
                          <p className="text-xs text-muted-foreground mt-1">
                            <Icon name="MapPin" size={12} className="inline mr-1" />
                            {seller?.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {seller?.commissionRate > 0 && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Commission:</span>
                        <span className="ml-1 font-medium text-success">{seller?.commissionRate}%</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(seller)}
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(seller)}
                        className="text-error hover:bg-error/10"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Icon name="Users" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? 'No sellers found matching your search' : 'No sellers added yet'}
            </p>
            {!searchTerm && (
              <Button variant="outline" onClick={handleAdd} className="mt-4">
                <Icon name="UserPlus" size={16} className="mr-2" />
                Add Your First Seller
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                {editingSeller ? 'Edit Seller' : 'Add New Seller'}
              </h2>
              <Button variant="ghost" size="icon" onClick={handleCloseModal}>
                <Icon name="X" size={20} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Seller Name"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                error={errors?.name}
                required
                placeholder="Enter seller name"
              />

              <Input
                label="Phone Number"
                value={formData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                error={errors?.phone}
                placeholder="09xxxxxxxxx"
              />

              <Input
                label="Email"
                type="email"
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                error={errors?.email}
                placeholder="seller@example.com"
              />

              <Input
                label="Address"
                value={formData?.address}
                onChange={(e) => handleInputChange('address', e?.target?.value)}
                placeholder="Enter address (optional)"
              />

              <Input
                label="Commission Rate (%)"
                type="number"
                value={formData?.commissionRate}
                onChange={(e) => handleInputChange('commissionRate', e?.target?.value)}
                error={errors?.commissionRate}
                min="0"
                max="100"
                step="0.1"
                placeholder="0"
              />

              <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={handleCloseModal} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" loading={isLoading}>
                  {editingSeller ? 'Update Seller' : 'Save Seller'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerManagementPanel;