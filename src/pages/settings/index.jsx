import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';

import MainSidebar from '../../components/ui/MainSidebar';
import TopHeader from '../../components/ui/TopHeader';
import QuickActionBar from '../../components/ui/QuickActionBar';
import AlertNotificationPanel from '../../components/ui/AlertNotificationPanel';

// Import setting panels
import StoreInformationPanel from './components/StoreInformationPanel';
import UserManagementPanel from './components/UserManagementPanel';
import ReceiptSettingsPanel from './components/ReceiptSettingsPanel';
import PaymentMethodsPanel from './components/PaymentMethodsPanel';
import SystemPreferencesPanel from './components/SystemPreferencesPanel';
import DataManagementPanel from './components/DataManagementPanel';
import SellerManagementPanel from './components/SellerManagementPanel';

const Settings = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('store');

  const settingSections = [
    {
      id: 'store',
      label: 'Store Information',
      icon: 'Store',
      component: StoreInformationPanel
    },
    {
      id: 'users',
      label: 'User Management',
      icon: 'Users',
      component: UserManagementPanel
    },
    {
      id: 'sellers',
      label: 'Seller Management',
      icon: 'UserCheck',
      component: SellerManagementPanel
    },
    {
      id: 'payments',
      label: 'Payment Methods',
      icon: 'CreditCard',
      component: PaymentMethodsPanel
    },
    {
      id: 'receipt',
      label: 'Receipt Settings',
      icon: 'Receipt',
      component: ReceiptSettingsPanel
    },
    {
      id: 'preferences',
      label: 'System Preferences',
      icon: 'Settings',
      component: SystemPreferencesPanel
    },
    {
      id: 'data',
      label: 'Data Management',
      icon: 'Database',
      component: DataManagementPanel
    }
  ];

  const ActiveComponent = settingSections?.find(section => section?.id === activeSection)?.component;

  return (
    <div className="min-h-screen bg-background">
      <MainSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-0 md:ml-64'}`}>
        <TopHeader isCollapsed={isSidebarCollapsed} />
        
        <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Settings Navigation */}
              <div className="lg:w-1/4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Settings</h2>
                  <nav className="space-y-2">
                    {settingSections?.map((section) => (
                      <button
                        key={section?.id}
                        onClick={() => setActiveSection(section?.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeSection === section?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <Icon name={section?.icon} size={20} />
                        <span className="text-sm font-medium">{section?.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Settings Content */}
              <div className="flex-1">
                <div className="bg-card border border-border rounded-lg">
                  {ActiveComponent && <ActiveComponent />}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <QuickActionBar />
      <AlertNotificationPanel />
    </div>
  );
};

export default Settings;