import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const TopHeader = ({ isCollapsed = false }) => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const currentUser = {
    name: 'Aung Kyaw',
    role: 'Store Manager',
    avatar: null,
    store: 'Downtown Branch'
  };

  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Low Stock Alert',
      message: '5 products are running low on stock',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: 2,
      type: 'success',
      title: 'Daily Target Achieved',
      message: 'Sales target for today has been reached',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      type: 'error',
      title: 'Payment Failed',
      message: 'Transaction #POS-2025-001 requires attention',
      time: '3 hours ago',
      unread: false
    }
  ];

  const getPageTitle = () => {
    const pathTitles = {
      '/dashboard': 'Dashboard',
      '/new-sale': 'New Sale',
      '/sales-management': 'Sales Management',
      '/product-management': 'Product Management',
      '/customer-management': 'Customer Management',
      '/settings': 'Settings'
    };
    return pathTitles?.[location?.pathname] || 'Myanmar POS';
  };

  const unreadCount = notifications?.filter(n => n?.unread)?.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef?.current && !profileRef?.current?.contains(event?.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef?.current && !notificationRef?.current?.contains(event?.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
    setIsNotificationOpen(false);
  };

  const handleProfileAction = (action) => {
    console.log('Profile action:', action);
    setIsProfileOpen(false);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      warning: 'AlertTriangle',
      success: 'CheckCircle',
      error: 'XCircle',
      info: 'Info'
    };
    return icons?.[type] || 'Bell';
  };

  const getNotificationColor = (type) => {
    const colors = {
      warning: 'text-warning',
      success: 'text-success',
      error: 'text-error',
      info: 'text-secondary'
    };
    return colors?.[type] || 'text-muted-foreground';
  };

  return (
    <header 
      className={`fixed top-0 right-0 h-16 bg-card border-b border-border z-30 transition-all duration-300 ease-out ${
        isCollapsed ? 'left-20' : 'left-0 md:left-64'
      }`}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Page Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-foreground">{getPageTitle()}</h1>
          <div className="hidden sm:flex items-center text-sm text-muted-foreground">
            <Icon name="Clock" size={16} className="mr-1" />
            <span>{new Date()?.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Download">
              Backup
            </Button>
            <Button variant="outline" size="sm" iconName="Printer">
              Print
            </Button>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            {isNotificationOpen && (
              <div className="absolute right-0 top-12 w-80 bg-popover border border-border rounded-lg shadow-card z-50">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium text-popover-foreground">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications?.map((notification) => (
                    <button
                      key={notification?.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full p-4 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0 ${
                        notification?.unread ? 'bg-muted/50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon 
                          name={getNotificationIcon(notification?.type)} 
                          size={16} 
                          className={getNotificationColor(notification?.type)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-popover-foreground truncate">
                            {notification?.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification?.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification?.time}
                          </p>
                        </div>
                        {notification?.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-3 border-t border-border">
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <Button
              variant="ghost"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 px-3"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.role}</p>
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </Button>

            {isProfileOpen && (
              <div className="absolute right-0 top-12 w-64 bg-popover border border-border rounded-lg shadow-card z-50">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} color="white" />
                    </div>
                    <div>
                      <p className="font-medium text-popover-foreground">{currentUser?.name}</p>
                      <p className="text-sm text-muted-foreground">{currentUser?.role}</p>
                      <p className="text-xs text-muted-foreground">{currentUser?.store}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    iconName="User"
                    onClick={() => handleProfileAction('profile')}
                  >
                    My Profile
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    iconName="Settings"
                    onClick={() => handleProfileAction('settings')}
                  >
                    Account Settings
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    iconName="HelpCircle"
                    onClick={() => handleProfileAction('help')}
                  >
                    Help & Support
                  </Button>
                  <div className="border-t border-border my-2"></div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-error hover:text-error"
                    iconName="LogOut"
                    onClick={() => handleProfileAction('logout')}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;