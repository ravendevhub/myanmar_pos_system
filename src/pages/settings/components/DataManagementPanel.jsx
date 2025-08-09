import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DataManagementPanel = ({ onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [backupData, setBackupData] = useState(null);
  const [importFile, setImportFile] = useState(null);

  const getStorageInfo = () => {
    const keys = Object.keys(localStorage);
    const totalSize = keys?.reduce((total, key) => {
      return total + localStorage.getItem(key)?.length;
    }, 0);

    return {
      totalKeys: keys?.length,
      totalSize: (totalSize / 1024)?.toFixed(2) + ' KB',
      lastBackup: localStorage.getItem('lastBackupDate') || 'Never'
    };
  };

  const storageInfo = getStorageInfo();

  const handleCreateBackup = async () => {
    setIsLoading(true);
    try {
      const backupData = {
        timestamp: new Date()?.toISOString(),
        version: '1.0.0',
        data: {
          storeInformation: JSON.parse(localStorage.getItem('storeInformation') || '{}'),
          systemUsers: JSON.parse(localStorage.getItem('systemUsers') || '[]'),
          receiptSettings: JSON.parse(localStorage.getItem('receiptSettings') || '{}'),
          paymentMethods: JSON.parse(localStorage.getItem('paymentMethods') || '{}'),
          systemPreferences: JSON.parse(localStorage.getItem('systemPreferences') || '{}'),
          products: JSON.parse(localStorage.getItem('products') || '[]'),
          customers: JSON.parse(localStorage.getItem('customers') || '[]'),
          sales: JSON.parse(localStorage.getItem('sales') || '[]'),
          categories: JSON.parse(localStorage.getItem('categories') || '[]')
        }
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `myanmar-pos-backup-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
      URL.revokeObjectURL(url);

      localStorage.setItem('lastBackupDate', new Date()?.toISOString());

      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          message: 'Backup created successfully'
        }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error creating backup:', error);
      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'error',
          message: 'Failed to create backup'
        }
      });
      window.dispatchEvent(event);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setImportFile(file);
    }
  };

  const handleRestoreBackup = async () => {
    if (!importFile) {
      alert('Please select a backup file first');
      return;
    }

    if (!window.confirm('This will replace all current data. Are you sure you want to continue?')) {
      return;
    }

    setIsLoading(true);
    try {
      const fileContent = await importFile?.text();
      const backupData = JSON.parse(fileContent);

      if (!backupData?.data) {
        throw new Error('Invalid backup file format');
      }

      // Restore all data
      Object.entries(backupData?.data)?.forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });

      localStorage.setItem('lastRestoreDate', new Date()?.toISOString());

      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          message: 'Data restored successfully. Please refresh the page.'
        }
      });
      window.dispatchEvent(event);

      // Refresh page after 2 seconds
      setTimeout(() => {
        window.location?.reload();
      }, 2000);
    } catch (error) {
      console.error('Error restoring backup:', error);
      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'error',
          message: 'Failed to restore backup. Please check the file format.'
        }
      });
      window.dispatchEvent(event);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = (dataType) => {
    const confirmMessage = `Are you sure you want to clear all ${dataType}? This action cannot be undone.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      switch (dataType) {
        case 'sales': localStorage.removeItem('sales');
          break;
        case 'products': localStorage.removeItem('products');
          localStorage.removeItem('categories');
          break;
        case 'customers': localStorage.removeItem('customers');
          break;
        case 'all':
          const keysToKeep = ['storeInformation', 'systemUsers', 'receiptSettings', 'paymentMethods', 'systemPreferences'];
          Object.keys(localStorage)?.forEach(key => {
            if (!keysToKeep?.includes(key)) {
              localStorage.removeItem(key);
            }
          });
          break;
        default:
          break;
      }

      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          message: `${dataType} data cleared successfully`
        }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const handleExportData = (dataType) => {
    try {
      let data = {};
      let filename = '';

      switch (dataType) {
        case 'sales':
          data = JSON.parse(localStorage.getItem('sales') || '[]');
          filename = 'sales-data';
          break;
        case 'products':
          data = {
            products: JSON.parse(localStorage.getItem('products') || '[]'),
            categories: JSON.parse(localStorage.getItem('categories') || '[]')
          };
          filename = 'products-data';
          break;
        case 'customers':
          data = JSON.parse(localStorage.getItem('customers') || '[]');
          filename = 'customers-data';
          break;
        default:
          return;
      }

      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
      URL.revokeObjectURL(url);

      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          message: `${dataType} data exported successfully`
        }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Data Management</h3>
          <p className="text-sm text-muted-foreground">
            Backup, restore, and manage your system data
          </p>
        </div>
      </div>
      {/* Storage Information */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <h4 className="text-md font-medium text-foreground mb-3">Storage Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Total Records:</span>
            <div className="font-medium">{storageInfo?.totalKeys}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Storage Used:</span>
            <div className="font-medium">{storageInfo?.totalSize}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Last Backup:</span>
            <div className="font-medium">
              {storageInfo?.lastBackup !== 'Never' 
                ? new Date(storageInfo.lastBackup)?.toLocaleDateString()
                : 'Never'
              }
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Backup & Restore */}
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Backup & Restore</h4>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="font-medium text-foreground">Create Backup</h5>
                    <p className="text-sm text-muted-foreground">
                      Download a complete backup of all system data
                    </p>
                  </div>
                  <Icon name="Download" size={24} className="text-primary" />
                </div>
                <Button
                  variant="default"
                  onClick={handleCreateBackup}
                  loading={isLoading}
                  iconName="Download"
                  className="w-full"
                >
                  Create Full Backup
                </Button>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="font-medium text-foreground">Restore Backup</h5>
                    <p className="text-sm text-muted-foreground">
                      Restore system data from a backup file
                    </p>
                  </div>
                  <Icon name="Upload" size={24} className="text-warning" />
                </div>
                <div className="space-y-3">
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleFileSelect}
                    description="Select a backup file to restore"
                  />
                  <Button
                    variant="warning"
                    onClick={handleRestoreBackup}
                    loading={isLoading}
                    iconName="Upload"
                    className="w-full"
                    disabled={!importFile}
                  >
                    Restore from Backup
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Export & Clear */}
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Data Export</h4>
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => handleExportData('sales')}
                iconName="FileText"
                className="w-full justify-start"
              >
                Export Sales Data
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExportData('products')}
                iconName="Package"
                className="w-full justify-start"
              >
                Export Products Data
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExportData('customers')}
                iconName="Users"
                className="w-full justify-start"
              >
                Export Customers Data
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Clear Data</h4>
            <div className="space-y-3">
              <Button
                variant="destructive"
                onClick={() => handleClearData('sales')}
                iconName="Trash2"
                className="w-full justify-start"
              >
                Clear Sales History
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleClearData('products')}
                iconName="Package"
                className="w-full justify-start"
              >
                Clear Products Data
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleClearData('customers')}
                iconName="Users"
                className="w-full justify-start"
              >
                Clear Customers Data
              </Button>
              <div className="border-t border-border pt-3">
                <Button
                  variant="destructive"
                  onClick={() => handleClearData('all')}
                  iconName="AlertTriangle"
                  className="w-full justify-start"
                >
                  Clear All Business Data
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  This will clear all sales, products, and customer data but keep system settings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Warning Notice */}
      <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
          <div>
            <h5 className="font-medium text-warning mb-1">Important Notice</h5>
            <p className="text-sm text-warning/80">
              Always create a backup before performing any data operations. 
              Data clearing operations cannot be undone. Ensure you have proper backups 
              before proceeding with any destructive operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagementPanel;