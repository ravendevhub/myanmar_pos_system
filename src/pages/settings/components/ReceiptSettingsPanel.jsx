import React, { useState } from 'react';

import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ReceiptSettingsPanel = ({ onSave }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('receiptSettings');
    return saved ? JSON.parse(saved) : {
      paperSize: '80mm',
      showLogo: true,
      showTax: true,
      showQRCode: true,
      showLineTotal: true,
      headerText: 'Thank you for your purchase!',
      footerText: 'Please come again!',
      taxRate: 5,
      invoicePrefix: 'POS',
      printCopies: 1,
      autoOpenDrawer: true,
      printAfterSale: true
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  const paperSizeOptions = [
    { value: '58mm', label: '58mm (Small)', description: 'Compact receipt format' },
    { value: '80mm', label: '80mm (Standard)', description: 'Standard receipt format' }
  ];

  const copiesOptions = [
    { value: 1, label: '1 Copy' },
    { value: 2, label: '2 Copies' },
    { value: 3, label: '3 Copies' }
  ];

  const handleSettingChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('receiptSettings', JSON.stringify(settings));
      onSave && onSave(settings);

      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          message: 'Receipt settings updated successfully'
        }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error saving receipt settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSampleReceipt = () => {
    const storeInfo = JSON.parse(localStorage.getItem('storeInformation') || '{}');
    const currentDate = new Date()?.toLocaleDateString('en-GB');
    const currentTime = new Date()?.toLocaleTimeString('en-GB', { hour12: false });

    return {
      store: storeInfo,
      invoiceNumber: `${settings?.invoicePrefix}-${new Date()?.getFullYear()}-${String(Date.now())?.slice(-6)}`,
      date: currentDate,
      time: currentTime,
      items: [
        { name: 'Rice (5kg)', qty: 2, price: 8500, total: 17000 },
        { name: 'Cooking Oil (1L)', qty: 1, price: 3200, total: 3200 },
        { name: 'Sugar (1kg)', qty: 3, price: 1800, total: 5400 }
      ],
      subtotal: 25600,
      tax: settings?.showTax ? Math.round(25600 * (settings?.taxRate / 100)) : 0,
      total: 25600 + (settings?.showTax ? Math.round(25600 * (settings?.taxRate / 100)) : 0),
      payment: 'Cash',
      received: 30000,
      change: 30000 - (25600 + (settings?.showTax ? Math.round(25600 * (settings?.taxRate / 100)) : 0))
    };
  };

  const sampleReceipt = generateSampleReceipt();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Receipt Settings</h3>
          <p className="text-sm text-muted-foreground">
            Customize receipt format and printing options
          </p>
        </div>
        <Button
          variant="default"
          onClick={handleSave}
          loading={isLoading}
          iconName="Save"
        >
          Save Settings
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Form */}
        <div className="space-y-6">
          {/* Paper Format */}
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Paper Format</h4>
            <div className="space-y-4">
              <Select
                label="Paper Size"
                options={paperSizeOptions}
                value={settings?.paperSize}
                onChange={(value) => handleSettingChange('paperSize', value)}
              />

              <Select
                label="Print Copies"
                options={copiesOptions}
                value={settings?.printCopies}
                onChange={(value) => handleSettingChange('printCopies', value)}
              />
            </div>
          </div>

          {/* Receipt Content */}
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Receipt Content</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Checkbox
                  label="Show Logo"
                  checked={settings?.showLogo}
                  onChange={(e) => handleSettingChange('showLogo', e?.target?.checked)}
                />
                <Checkbox
                  label="Show Tax Line"
                  checked={settings?.showTax}
                  onChange={(e) => handleSettingChange('showTax', e?.target?.checked)}
                />
                <Checkbox
                  label="Show QR Code"
                  checked={settings?.showQRCode}
                  onChange={(e) => handleSettingChange('showQRCode', e?.target?.checked)}
                />
                <Checkbox
                  label="Show Line Totals"
                  checked={settings?.showLineTotal}
                  onChange={(e) => handleSettingChange('showLineTotal', e?.target?.checked)}
                />
              </div>

              <Input
                label="Header Text"
                type="text"
                value={settings?.headerText}
                onChange={(e) => handleSettingChange('headerText', e?.target?.value)}
                placeholder="Thank you message"
              />

              <Input
                label="Footer Text"
                type="text"
                value={settings?.footerText}
                onChange={(e) => handleSettingChange('footerText', e?.target?.value)}
                placeholder="Closing message"
              />

              <Input
                label="Invoice Prefix"
                type="text"
                value={settings?.invoicePrefix}
                onChange={(e) => handleSettingChange('invoicePrefix', e?.target?.value)}
                placeholder="POS"
                description="Prefix for invoice numbers"
              />

              {settings?.showTax && (
                <Input
                  label="Tax Rate (%)"
                  type="number"
                  value={settings?.taxRate}
                  onChange={(e) => handleSettingChange('taxRate', parseFloat(e?.target?.value) || 0)}
                  placeholder="5"
                  min="0"
                  max="100"
                  step="0.1"
                />
              )}
            </div>
          </div>

          {/* Printing Options */}
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Printing Options</h4>
            <div className="space-y-4">
              <Checkbox
                label="Auto Open Cash Drawer"
                description="Automatically open cash drawer after printing"
                checked={settings?.autoOpenDrawer}
                onChange={(e) => handleSettingChange('autoOpenDrawer', e?.target?.checked)}
              />
              <Checkbox
                label="Print After Sale"
                description="Automatically print receipt after completing sale"
                checked={settings?.printAfterSale}
                onChange={(e) => handleSettingChange('printAfterSale', e?.target?.checked)}
              />
            </div>
          </div>
        </div>

        {/* Receipt Preview */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground">Receipt Preview</h4>
          
          <div className={`bg-white border-2 border-dashed border-border p-4 text-black font-mono text-sm ${
            settings?.paperSize === '58mm' ? 'max-w-xs' : 'max-w-sm'
          } mx-auto`}>
            {/* Header */}
            <div className="text-center mb-4">
              {settings?.showLogo && sampleReceipt?.store?.logo && (
                <Image
                  src={sampleReceipt?.store?.logo}
                  alt="Store Logo"
                  className="w-16 h-16 object-contain mx-auto mb-2"
                />
              )}
              <div className="font-bold text-lg">{sampleReceipt?.store?.name || 'Myanmar POS Store'}</div>
              <div className="text-xs">{sampleReceipt?.store?.address || 'Store Address'}</div>
              <div className="text-xs">{sampleReceipt?.store?.phone || 'Phone Number'}</div>
              {sampleReceipt?.store?.taxId && (
                <div className="text-xs">Tax ID: {sampleReceipt?.store?.taxId}</div>
              )}
            </div>

            {/* Header Text */}
            {settings?.headerText && (
              <div className="text-center text-xs mb-2 border-t border-b border-gray-300 py-1">
                {settings?.headerText}
              </div>
            )}

            {/* Invoice Details */}
            <div className="text-xs mb-2">
              <div className="flex justify-between">
                <span>Invoice: {sampleReceipt?.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date: {sampleReceipt?.date}</span>
                <span>Time: {sampleReceipt?.time}</span>
              </div>
            </div>

            <div className="border-t border-gray-300 my-2"></div>

            {/* Items */}
            <div className="space-y-1 mb-2">
              {sampleReceipt?.items?.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between">
                    <span className="truncate">{item?.name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>{item?.qty} x {item?.price?.toLocaleString()} Ks</span>
                    {settings?.showLineTotal && (
                      <span>{item?.total?.toLocaleString()} Ks</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-300 my-2"></div>

            {/* Totals */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{sampleReceipt?.subtotal?.toLocaleString()} Ks</span>
              </div>
              {settings?.showTax && (
                <div className="flex justify-between">
                  <span>Tax ({settings?.taxRate}%):</span>
                  <span>{sampleReceipt?.tax?.toLocaleString()} Ks</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t border-gray-300 pt-1">
                <span>Total:</span>
                <span>{sampleReceipt?.total?.toLocaleString()} Ks</span>
              </div>
            </div>

            <div className="border-t border-gray-300 my-2"></div>

            {/* Payment */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Payment:</span>
                <span>{sampleReceipt?.payment}</span>
              </div>
              <div className="flex justify-between">
                <span>Received:</span>
                <span>{sampleReceipt?.received?.toLocaleString()} Ks</span>
              </div>
              <div className="flex justify-between">
                <span>Change:</span>
                <span>{sampleReceipt?.change?.toLocaleString()} Ks</span>
              </div>
            </div>

            {/* QR Code */}
            {settings?.showQRCode && (
              <div className="text-center mt-4">
                <div className="w-16 h-16 bg-gray-200 mx-auto flex items-center justify-center text-xs">
                  QR Code
                </div>
                <div className="text-xs mt-1">Scan for digital receipt</div>
              </div>
            )}

            {/* Footer */}
            {settings?.footerText && (
              <div className="text-center text-xs mt-4 border-t border-gray-300 pt-2">
                {settings?.footerText}
              </div>
            )}
          </div>

          {/* Print Test Button */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => window.print()}
              iconName="Printer"
            >
              Test Print
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptSettingsPanel;