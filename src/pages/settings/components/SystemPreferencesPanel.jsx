import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const SystemPreferencesPanel = ({ onSave }) => {
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('systemPreferences');
    return saved ? JSON.parse(saved) : {
      language: 'en',
      currency: 'MMK',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      theme: 'light',
      autoBackup: true,
      backupFrequency: 'daily',
      lowStockAlert: true,
      lowStockThreshold: 10,
      soundEnabled: true,
      notifications: true,
      autoLogout: false,
      logoutTime: 30,
      printAfterSale: true,
      openDrawerAfterSale: true,
      defaultCustomer: 'walk-in',
      taxIncluded: false,
      roundingEnabled: true,
      decimalPlaces: 0
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  const languageOptions = [
    { value: 'en', label: 'English', description: 'English interface' },
    { value: 'my', label: 'မြန်မာ', description: 'Myanmar interface' }
  ];

  const currencyOptions = [
    { value: 'MMK', label: 'Myanmar Kyat (Ks)', description: 'Myanmar Kyats' },
    { value: 'USD', label: 'US Dollar ($)', description: 'US Dollars' }
  ];

  const dateFormatOptions = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', description: '08/01/2025' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', description: '01/08/2025' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD', description: '2025-01-08' }
  ];

  const timeFormatOptions = [
    { value: '12h', label: '12 Hour', description: '2:30 PM' },
    { value: '24h', label: '24 Hour', description: '14:30' }
  ];

  const themeOptions = [
    { value: 'light', label: 'Light Mode', description: 'Light color scheme' },
    { value: 'dark', label: 'Dark Mode', description: 'Dark color scheme' },
    { value: 'auto', label: 'Auto', description: 'Follow system preference' }
  ];

  const backupFrequencyOptions = [
    { value: 'hourly', label: 'Every Hour' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'manual', label: 'Manual Only' }
  ];

  const logoutTimeOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' }
  ];

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('systemPreferences', JSON.stringify(preferences));
      onSave && onSave(preferences);

      // Apply theme immediately
      if (preferences?.theme === 'dark') {
        document.documentElement?.classList?.add('dark');
      } else if (preferences?.theme === 'light') {
        document.documentElement?.classList?.remove('dark');
      }

      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          message: 'System preferences updated successfully'
        }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error saving system preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all preferences to default values?')) {
      const defaultPreferences = {
        language: 'en',
        currency: 'MMK',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        theme: 'light',
        autoBackup: true,
        backupFrequency: 'daily',
        lowStockAlert: true,
        lowStockThreshold: 10,
        soundEnabled: true,
        notifications: true,
        autoLogout: false,
        logoutTime: 30,
        printAfterSale: true,
        openDrawerAfterSale: true,
        defaultCustomer: 'walk-in',
        taxIncluded: false,
        roundingEnabled: true,
        decimalPlaces: 0
      };
      setPreferences(defaultPreferences);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">System Preferences</h3>
          <p className="text-sm text-muted-foreground">
            Configure system behavior and display options
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleResetToDefaults}
            iconName="RotateCcw"
          >
            Reset to Defaults
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            loading={isLoading}
            iconName="Save"
          >
            Save Changes
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Display & Localization */}
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Display & Localization</h4>
            <div className="space-y-4">
              <Select
                label="Interface Language"
                options={languageOptions}
                value={preferences?.language}
                onChange={(value) => handlePreferenceChange('language', value)}
              />

              <Select
                label="Currency"
                options={currencyOptions}
                value={preferences?.currency}
                onChange={(value) => handlePreferenceChange('currency', value)}
              />

              <Select
                label="Date Format"
                options={dateFormatOptions}
                value={preferences?.dateFormat}
                onChange={(value) => handlePreferenceChange('dateFormat', value)}
              />

              <Select
                label="Time Format"
                options={timeFormatOptions}
                value={preferences?.timeFormat}
                onChange={(value) => handlePreferenceChange('timeFormat', value)}
              />

              <Select
                label="Theme"
                options={themeOptions}
                value={preferences?.theme}
                onChange={(value) => handlePreferenceChange('theme', value)}
              />
            </div>
          </div>

          {/* Number Formatting */}
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Number Formatting</h4>
            <div className="space-y-4">
              <Checkbox
                label="Enable Rounding"
                description="Round amounts to nearest whole number"
                checked={preferences?.roundingEnabled}
                onChange={(e) => handlePreferenceChange('roundingEnabled', e?.target?.checked)}
              />

              <Input
                label="Decimal Places"
                type="number"
                value={preferences?.decimalPlaces}
                onChange={(e) => handlePreferenceChange('decimalPlaces', parseInt(e?.target?.value) || 0)}
                min="0"
                max="4"
                description="Number of decimal places to display"
              />

              <Checkbox
                label="Tax Included in Prices"
                description="Display prices with tax included"
                checked={preferences?.taxIncluded}
                onChange={(e) => handlePreferenceChange('taxIncluded', e?.target?.checked)}
              />
            </div>
          </div>
        </div>

        {/* System Behavior */}
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">System Behavior</h4>
            <div className="space-y-4">
              <Checkbox
                label="Auto Backup"
                description="Automatically backup data"
                checked={preferences?.autoBackup}
                onChange={(e) => handlePreferenceChange('autoBackup', e?.target?.checked)}
              />

              {preferences?.autoBackup && (
                <Select
                  label="Backup Frequency"
                  options={backupFrequencyOptions}
                  value={preferences?.backupFrequency}
                  onChange={(value) => handlePreferenceChange('backupFrequency', value)}
                />
              )}

              <Checkbox
                label="Auto Logout"
                description="Automatically logout after inactivity"
                checked={preferences?.autoLogout}
                onChange={(e) => handlePreferenceChange('autoLogout', e?.target?.checked)}
              />

              {preferences?.autoLogout && (
                <Select
                  label="Logout Time"
                  options={logoutTimeOptions}
                  value={preferences?.logoutTime}
                  onChange={(value) => handlePreferenceChange('logoutTime', value)}
                />
              )}
            </div>
          </div>

          {/* Alerts & Notifications */}
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Alerts & Notifications</h4>
            <div className="space-y-4">
              <Checkbox
                label="Low Stock Alerts"
                description="Show alerts when products are low in stock"
                checked={preferences?.lowStockAlert}
                onChange={(e) => handlePreferenceChange('lowStockAlert', e?.target?.checked)}
              />

              {preferences?.lowStockAlert && (
                <Input
                  label="Low Stock Threshold"
                  type="number"
                  value={preferences?.lowStockThreshold}
                  onChange={(e) => handlePreferenceChange('lowStockThreshold', parseInt(e?.target?.value) || 0)}
                  min="1"
                  description="Alert when stock falls below this number"
                />
              )}

              <Checkbox
                label="Sound Notifications"
                description="Play sounds for alerts and actions"
                checked={preferences?.soundEnabled}
                onChange={(e) => handlePreferenceChange('soundEnabled', e?.target?.checked)}
              />

              <Checkbox
                label="System Notifications"
                description="Show system notifications"
                checked={preferences?.notifications}
                onChange={(e) => handlePreferenceChange('notifications', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Sales Behavior */}
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Sales Behavior</h4>
            <div className="space-y-4">
              <Checkbox
                label="Print Receipt After Sale"
                description="Automatically print receipt after completing sale"
                checked={preferences?.printAfterSale}
                onChange={(e) => handlePreferenceChange('printAfterSale', e?.target?.checked)}
              />

              <Checkbox
                label="Open Cash Drawer After Sale"
                description="Automatically open cash drawer after sale"
                checked={preferences?.openDrawerAfterSale}
                onChange={(e) => handlePreferenceChange('openDrawerAfterSale', e?.target?.checked)}
              />

              <Input
                label="Default Customer Type"
                type="text"
                value={preferences?.defaultCustomer}
                onChange={(e) => handlePreferenceChange('defaultCustomer', e?.target?.value)}
                placeholder="walk-in"
                description="Default customer for new sales"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Current Settings Preview */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-3">Current Settings Preview</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Date:</span>
            <div className="font-medium">
              {new Date()?.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Time:</span>
            <div className="font-medium">
              {new Date()?.toLocaleTimeString('en-GB', {
                hour12: preferences?.timeFormat === '12h',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Currency:</span>
            <div className="font-medium">
              {preferences?.currency === 'MMK' ? '25,000 Ks' : '$25.00'}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Theme:</span>
            <div className="font-medium capitalize">{preferences?.theme}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemPreferencesPanel;