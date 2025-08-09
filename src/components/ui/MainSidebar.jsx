import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const MainSidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'BarChart3',
      description: 'Business overview and analytics'
    },
    {
      label: 'New Sale',
      path: '/new-sale',
      icon: 'Plus',
      description: 'Process new transaction'
    },
    {
      label: 'Sales Management',
      path: '/sales-management',
      icon: 'Receipt',
      description: 'View and manage sales'
    },
    {
      label: 'Product Management',
      path: '/product-management',
      icon: 'Package',
      description: 'Inventory and products'
    },
    {
      label: 'Customer Management',
      path: '/customer-management',
      icon: 'Users',
      description: 'Customer relationships'
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: 'Settings',
      description: 'System configuration'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Logo Section */}
      <div className={`flex items-center px-6 py-4 border-b border-border ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Store" size={20} color="white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-foreground">Myanmar POS</span>
              <span className="text-xs text-muted-foreground">Point of Sale System</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems?.map((item) => {
          const isActive = isActivePath(item?.path);
          return (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-250 ease-out group ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-subtle'
                  : 'text-foreground hover:bg-muted hover:text-foreground'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item?.label : ''}
            >
              <Icon 
                name={item?.icon} 
                size={20} 
                className={`${isCollapsed ? '' : 'mr-3'} ${
                  isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                }`}
              />
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item?.label}</span>
                  <span className={`text-xs ${
                    isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  }`}>
                    {item?.description}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle (Desktop Only) */}
      {!window.matchMedia('(max-width: 768px)')?.matches && (
        <div className="px-4 py-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className={`w-full ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          >
            <Icon 
              name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} 
              size={16} 
              className="text-muted-foreground"
            />
            {!isCollapsed && <span className="ml-2 text-sm">Collapse</span>}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:block fixed left-0 top-0 h-screen z-40 transition-all duration-300 ease-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsMobileOpen(false)}
        >
          <aside 
            className="fixed left-0 top-0 h-screen w-64 z-50 animate-slide-in"
            onClick={(e) => e?.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}
      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-30"
        onClick={() => setIsMobileOpen(true)}
      >
        <Icon name="Menu" size={20} />
      </Button>
    </>
  );
};

export default MainSidebar;