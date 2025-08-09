import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionBar = ({ className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const quickActions = [
    {
      id: 'new-sale',
      label: 'New Sale',
      icon: 'Plus',
      path: '/new-sale',
      variant: 'default',
      priority: 'high',
      description: 'Start new transaction'
    },
    {
      id: 'print-receipt',
      label: 'Print Receipt',
      icon: 'Printer',
      action: 'print',
      variant: 'outline',
      priority: 'medium',
      description: 'Print last receipt'
    },
    {
      id: 'cash-drawer',
      label: 'Open Drawer',
      icon: 'DollarSign',
      action: 'drawer',
      variant: 'outline',
      priority: 'medium',
      description: 'Open cash drawer'
    },
    {
      id: 'emergency',
      label: 'Emergency',
      icon: 'AlertTriangle',
      action: 'emergency',
      variant: 'destructive',
      priority: 'high',
      description: 'Emergency functions'
    }
  ];

  const contextualActions = {
    '/dashboard': [
      {
        id: 'daily-report',
        label: 'Daily Report',
        icon: 'FileText',
        action: 'report',
        variant: 'secondary'
      },
      {
        id: 'backup-data',
        label: 'Backup',
        icon: 'Download',
        action: 'backup',
        variant: 'outline'
      }
    ],
    '/sales-management': [
      {
        id: 'export-sales',
        label: 'Export',
        icon: 'Download',
        action: 'export',
        variant: 'outline'
      },
      {
        id: 'refund',
        label: 'Process Refund',
        icon: 'RotateCcw',
        action: 'refund',
        variant: 'warning'
      }
    ],
    '/product-management': [
      {
        id: 'add-product',
        label: 'Add Product',
        icon: 'Package',
        path: '/product-management/new',
        variant: 'default'
      },
      {
        id: 'stock-alert',
        label: 'Stock Alerts',
        icon: 'AlertCircle',
        action: 'stock-alerts',
        variant: 'warning'
      }
    ],
    '/customer-management': [
      {
        id: 'add-customer',
        label: 'Add Customer',
        icon: 'UserPlus',
        path: '/customer-management/new',
        variant: 'default'
      },
      {
        id: 'loyalty-program',
        label: 'Loyalty',
        icon: 'Star',
        action: 'loyalty',
        variant: 'secondary'
      }
    ]
  };

  const handleAction = (action) => {
    if (action?.path) {
      navigate(action?.path);
    } else {
      switch (action?.action) {
        case 'print': console.log('Printing last receipt...');
          break;
        case 'drawer': console.log('Opening cash drawer...');
          break;
        case 'emergency': console.log('Emergency action triggered...');
          break;
        case 'report': console.log('Generating daily report...');
          break;
        case 'backup': console.log('Starting backup...');
          break;
        case 'export':
          console.log('Exporting sales data...');
          break;
        case 'refund': console.log('Processing refund...');
          break;
        case 'stock-alerts': console.log('Showing stock alerts...');
          break;
        case 'loyalty': console.log('Opening loyalty program...');
          break;
        default:
          console.log('Action:', action?.id);
      }
    }
  };

  const getCurrentActions = () => {
    const contextual = contextualActions?.[location?.pathname] || [];
    const highPriorityGlobal = quickActions?.filter(action => action?.priority === 'high');
    return [...highPriorityGlobal, ...contextual];
  };

  const visibleActions = getCurrentActions();
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    return (
      <div className={`fixed bottom-4 right-4 z-40 ${className}`}>
        <div className="flex flex-col-reverse items-end space-y-reverse space-y-3">
          {/* Expanded Actions */}
          {isExpanded && (
            <div className="flex flex-col space-y-2 mb-2">
              {visibleActions?.slice(1)?.map((action) => (
                <Button
                  key={action?.id}
                  variant={action?.variant}
                  size="icon"
                  onClick={() => handleAction(action)}
                  className="w-12 h-12 rounded-full shadow-card animate-fade-in"
                  title={action?.description || action?.label}
                >
                  <Icon name={action?.icon} size={20} />
                </Button>
              ))}
            </div>
          )}

          {/* Main Action Button */}
          <div className="relative">
            <Button
              variant="default"
              size="icon"
              onClick={() => {
                if (visibleActions?.length > 1) {
                  setIsExpanded(!isExpanded);
                } else if (visibleActions?.[0]) {
                  handleAction(visibleActions?.[0]);
                }
              }}
              className="w-14 h-14 rounded-full shadow-card"
            >
              <Icon 
                name={isExpanded ? 'X' : (visibleActions?.[0]?.icon || 'Plus')} 
                size={24} 
              />
            </Button>
            {visibleActions?.length > 1 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                {visibleActions?.length}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
      <div className="flex items-center space-x-3 bg-card border border-border rounded-full px-4 py-3 shadow-card">
        {visibleActions?.map((action, index) => (
          <React.Fragment key={action?.id}>
            {index > 0 && <div className="w-px h-6 bg-border"></div>}
            <Button
              variant={action?.variant}
              size="sm"
              onClick={() => handleAction(action)}
              iconName={action?.icon}
              className="rounded-full"
              title={action?.description || action?.label}
            >
              <span className="hidden lg:inline ml-2">{action?.label}</span>
            </Button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default QuickActionBar;