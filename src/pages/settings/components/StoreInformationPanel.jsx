import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const StoreInformationPanel = ({ onSave }) => {
  const fileInputRef = useRef(null);
  const [storeData, setStoreData] = useState(() => {
    const saved = localStorage.getItem('storeInformation');
    return saved ? JSON.parse(saved) : {
      name: 'Myanmar POS Store',
      address: 'No. 123, Main Street, Yangon, Myanmar',
      phone: '+95 9 123 456 789',
      email: 'store@myanmarpos.com',
      taxId: 'TAX-001-2025',
      logo: null,
      currency: 'MMK',
      timezone: 'Asia/Yangon'
    };
  });

  const [logoPreview, setLogoPreview] = useState(storeData?.logo);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setStoreData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      if (file?.size > 2 * 1024 * 1024) {
        alert('Logo file size must be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const logoData = e?.target?.result;
        setLogoPreview(logoData);
        setStoreData(prev => ({
          ...prev,
          logo: logoData
        }));
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setStoreData(prev => ({
      ...prev,
      logo: null
    }));
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('storeInformation', JSON.stringify(storeData));
      onSave && onSave(storeData);
      
      // Show success message
      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          message: 'Store information updated successfully'
        }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error saving store information:', error);
      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'error',
          message: 'Failed to save store information'
        }
      });
      window.dispatchEvent(event);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Store Information</h3>
          <p className="text-sm text-muted-foreground">
            Configure your store details and branding
          </p>
        </div>
        <Button
          variant="default"
          onClick={handleSave}
          loading={isLoading}
          iconName="Save"
        >
          Save Changes
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Store Details */}
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Basic Information</h4>
            <div className="space-y-4">
              <Input
                label="Store Name"
                type="text"
                value={storeData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                placeholder="Enter store name"
                required
              />

              <Input
                label="Address"
                type="text"
                value={storeData?.address}
                onChange={(e) => handleInputChange('address', e?.target?.value)}
                placeholder="Enter store address"
                description="Full address including city and country"
              />

              <Input
                label="Phone Number"
                type="tel"
                value={storeData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                placeholder="+95 9 XXX XXX XXX"
              />

              <Input
                label="Email Address"
                type="email"
                value={storeData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                placeholder="store@example.com"
              />

              <Input
                label="Tax Registration ID"
                type="text"
                value={storeData?.taxId}
                onChange={(e) => handleInputChange('taxId', e?.target?.value)}
                placeholder="TAX-XXX-XXXX"
                description="Business tax registration number"
              />
            </div>
          </div>

          {/* System Settings */}
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">System Settings</h4>
            <div className="space-y-4">
              <Input
                label="Default Currency"
                type="text"
                value={storeData?.currency}
                onChange={(e) => handleInputChange('currency', e?.target?.value)}
                placeholder="MMK"
                description="Currency code (e.g., MMK, USD)"
              />

              <Input
                label="Timezone"
                type="text"
                value={storeData?.timezone}
                onChange={(e) => handleInputChange('timezone', e?.target?.value)}
                placeholder="Asia/Yangon"
                description="System timezone for transactions"
              />
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Store Logo</h4>
            <div className="space-y-4">
              {/* Logo Preview */}
              <div className="flex items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg bg-muted/50">
                {logoPreview ? (
                  <div className="relative">
                    <Image
                      src={logoPreview}
                      alt="Store Logo"
                      className="max-w-full max-h-40 object-contain"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 w-6 h-6"
                    >
                      <Icon name="X" size={14} />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Icon name="Image" size={48} className="text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No logo uploaded</p>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef?.current?.click()}
                  iconName="Upload"
                  className="w-full"
                >
                  Upload Logo
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Supported formats: JPG, PNG, GIF. Max size: 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="p-4 border border-border rounded-lg bg-card">
            <h5 className="text-sm font-medium text-foreground mb-3">Receipt Preview</h5>
            <div className="text-center space-y-2 p-4 bg-white border rounded text-black">
              {logoPreview && (
                <Image
                  src={logoPreview}
                  alt="Logo Preview"
                  className="w-16 h-16 object-contain mx-auto"
                />
              )}
              <div className="text-sm font-bold">{storeData?.name}</div>
              <div className="text-xs">{storeData?.address}</div>
              <div className="text-xs">{storeData?.phone}</div>
              {storeData?.taxId && (
                <div className="text-xs">Tax ID: {storeData?.taxId}</div>
              )}
              <div className="border-t border-gray-300 my-2"></div>
              <div className="text-xs">Receipt Preview</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreInformationPanel;