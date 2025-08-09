import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CustomerTable = ({ customers, onViewCustomer, onEditCustomer, onRecordPayment, onViewHistory }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCustomers = [...customers]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'totalPurchases' || sortField === 'outstandingDue') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    } else if (sortField === 'lastPurchase') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else {
      aValue = String(aValue)?.toLowerCase();
      bValue = String(bValue)?.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US')?.format(amount) + ' Ks';
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-GB');
  };

  const getRowClassName = (customer) => {
    const baseClass = "hover:bg-muted/50 transition-colors";
    if (customer?.outstandingDue > 0) {
      const daysSinceLastPurchase = Math.floor((new Date() - new Date(customer.lastPurchase)) / (1000 * 60 * 60 * 24));
      if (daysSinceLastPurchase > 30) {
        return `${baseClass} bg-error/5 border-l-4 border-l-error`;
      }
      return `${baseClass} bg-warning/5 border-l-4 border-l-warning`;
    }
    return baseClass;
  };

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="flex flex-col">
          <Icon 
            name="ChevronUp" 
            size={12} 
            className={`${sortField === field && sortDirection === 'asc' ? 'text-primary' : 'text-muted-foreground/50'}`}
          />
          <Icon 
            name="ChevronDown" 
            size={12} 
            className={`${sortField === field && sortDirection === 'desc' ? 'text-primary' : 'text-muted-foreground/50'} -mt-1`}
          />
        </div>
      </div>
    </th>
  );

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <SortableHeader field="name">Customer Name</SortableHeader>
              <SortableHeader field="phone">Phone</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Address
              </th>
              <SortableHeader field="totalPurchases">Total Purchases</SortableHeader>
              <SortableHeader field="outstandingDue">Outstanding Due</SortableHeader>
              <SortableHeader field="lastPurchase">Last Purchase</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {sortedCustomers?.map((customer) => (
              <tr key={customer?.id} className={getRowClassName(customer)}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <Icon name="User" size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{customer?.name}</div>
                      <div className="text-sm text-muted-foreground">ID: {customer?.customerId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {customer?.phone}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                  {customer?.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                  {formatCurrency(customer?.totalPurchases)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    customer?.outstandingDue > 0 ? 'text-error' : 'text-success'
                  }`}>
                    {formatCurrency(customer?.outstandingDue)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {formatDate(customer?.lastPurchase)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewCustomer(customer)}
                      title="View Customer"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditCustomer(customer)}
                      title="Edit Customer"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    {customer?.outstandingDue > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRecordPayment(customer)}
                        title="Record Payment"
                        className="text-success hover:text-success"
                      >
                        <Icon name="DollarSign" size={16} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewHistory(customer)}
                      title="View Purchase History"
                    >
                      <Icon name="History" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;