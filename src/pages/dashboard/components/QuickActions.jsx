import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = ({ className = '' }) => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'new-sale',
      label: 'New Sale',
      icon: 'Plus',
      variant: 'default',
      path: '/new-sale',
      description: 'Start a new transaction'
    },
    {
      id: 'sales-report',
      label: 'Sales Report',
      icon: 'FileText',
      variant: 'outline',
      action: 'generateReport',
      description: 'Generate sales report'
    },
    {
      id: 'backup-data',
      label: 'Backup Data',
      icon: 'Download',
      variant: 'outline',
      action: 'backup',
      description: 'Backup system data'
    },
    {
      id: 'print-receipt',
      label: 'Print Receipt',
      icon: 'Printer',
      variant: 'outline',
      action: 'print',
      description: 'Print last receipt'
    }
  ];

  const handleAction = (action) => {
    if (action?.path) {
      navigate(action?.path);
    } else {
      switch (action?.action) {
        case 'generateReport': console.log('Generating sales report...');
          // Mock report generation
          alert('Daily sales report generated successfully!');
          break;
        case 'backup': console.log('Starting backup...');
          // Mock backup process
          alert('Data backup completed successfully!');
          break;
        case 'print': console.log('Printing last receipt...');
          // Mock print process
          alert('Receipt sent to printer!');
          break;
        default:
          console.log('Action:', action?.id);
      }
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions?.map((action) => (
          <Button
            key={action?.id}
            variant={action?.variant}
            onClick={() => handleAction(action)}
            iconName={action?.icon}
            iconPosition="left"
            className="justify-start h-12"
            title={action?.description}
          >
            <div className="flex flex-col items-start ml-2">
              <span className="text-sm font-medium">{action?.label}</span>
              <span className="text-xs text-muted-foreground">{action?.description}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;