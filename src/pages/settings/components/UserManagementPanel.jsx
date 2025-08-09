import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const UserManagementPanel = ({ onSave }) => {
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'cashier',
    password: '',
    confirmPassword: '',
    isActive: true
  });

  const roleOptions = [
    { value: 'admin', label: 'Admin', description: 'Full system access' },
    { value: 'manager', label: 'Manager', description: 'Store management access' },
    { value: 'cashier', label: 'Cashier', description: 'Sales and basic operations' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only access' }
  ];

  const rolePermissions = {
    admin: {
      dashboard: true,
      sales: true,
      products: true,
      customers: true,
      reports: true,
      settings: true,
      users: true,
      backup: true,
      delete: true
    },
    manager: {
      dashboard: true,
      sales: true,
      products: true,
      customers: true,
      reports: true,
      settings: false,
      users: false,
      backup: true,
      delete: false
    },
    cashier: {
      dashboard: true,
      sales: true,
      products: false,
      customers: true,
      reports: false,
      settings: false,
      users: false,
      backup: false,
      delete: false
    },
    viewer: {
      dashboard: true,
      sales: false,
      products: false,
      customers: false,
      reports: true,
      settings: false,
      users: false,
      backup: false,
      delete: false
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const savedUsers = localStorage.getItem('systemUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Default admin user
      const defaultUsers = [
        {
          id: 1,
          name: 'Admin User',
          email: 'admin@myanmarpos.com',
          phone: '+95 9 111 111 111',
          role: 'admin',
          isActive: true,
          createdAt: new Date()?.toISOString(),
          lastLogin: new Date()?.toISOString()
        }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('systemUsers', JSON.stringify(defaultUsers));
    }
  };

  const handleInputChange = (field, value) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateUser = () => {
    if (!newUser?.name?.trim()) return 'Name is required';
    if (!newUser?.email?.trim()) return 'Email is required';
    if (!newUser?.password) return 'Password is required';
    if (newUser?.password !== newUser?.confirmPassword) return 'Passwords do not match';
    if (users?.some(u => u?.email === newUser?.email && u?.id !== editingUser?.id)) {
      return 'Email already exists';
    }
    return null;
  };

  const handleSaveUser = async () => {
    const error = validateUser();
    if (error) {
      alert(error);
      return;
    }

    setIsLoading(true);
    try {
      let updatedUsers;
      
      if (editingUser) {
        // Update existing user
        updatedUsers = users?.map(user => 
          user?.id === editingUser?.id 
            ? { ...user, ...newUser, updatedAt: new Date()?.toISOString() }
            : user
        );
      } else {
        // Add new user
        const user = {
          ...newUser,
          id: Date.now(),
          createdAt: new Date()?.toISOString(),
          lastLogin: null
        };
        updatedUsers = [...users, user];
      }

      setUsers(updatedUsers);
      localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
      
      // Reset form
      setNewUser({
        name: '',
        email: '',
        phone: '',
        role: 'cashier',
        password: '',
        confirmPassword: '',
        isActive: true
      });
      setShowAddUser(false);
      setEditingUser(null);

      onSave && onSave(updatedUsers);

      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          message: `User ${editingUser ? 'updated' : 'created'} successfully`
        }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user?.name,
      email: user?.email,
      phone: user?.phone || '',
      role: user?.role,
      password: '',
      confirmPassword: '',
      isActive: user?.isActive
    });
    setShowAddUser(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      let updatedUsers = users?.filter(user => user?.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
    }
  };

  const handleToggleStatus = (userId) => {
    let updatedUsers = users?.map(user =>
      user?.id === userId ? { ...user, isActive: !user?.isActive } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-error/10 text-error',
      manager: 'bg-warning/10 text-warning',
      cashier: 'bg-success/10 text-success',
      viewer: 'bg-secondary/10 text-secondary'
    };
    return colors?.[role] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">User Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage system users and their permissions
          </p>
        </div>
        <Button
          variant="default"
          onClick={() => setShowAddUser(true)}
          iconName="UserPlus"
        >
          Add User
        </Button>
      </div>
      {/* Add/Edit User Form */}
      {showAddUser && (
        <div className="p-6 border border-border rounded-lg bg-card">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-foreground">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowAddUser(false);
                setEditingUser(null);
                setNewUser({
                  name: '',
                  email: '',
                  phone: '',
                  role: 'cashier',
                  password: '',
                  confirmPassword: '',
                  isActive: true
                });
              }}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              value={newUser?.name}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              placeholder="Enter full name"
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={newUser?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              placeholder="user@example.com"
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              value={newUser?.phone}
              onChange={(e) => handleInputChange('phone', e?.target?.value)}
              placeholder="+95 9 XXX XXX XXX"
            />

            <Select
              label="Role"
              options={roleOptions}
              value={newUser?.role}
              onChange={(value) => handleInputChange('role', value)}
              required
            />

            <Input
              label="Password"
              type="password"
              value={newUser?.password}
              onChange={(e) => handleInputChange('password', e?.target?.value)}
              placeholder="Enter password"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              value={newUser?.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
              placeholder="Confirm password"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddUser(false);
                setEditingUser(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSaveUser}
              loading={isLoading}
              iconName="Save"
            >
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </div>
      )}
      {/* Users List */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-foreground">System Users</h4>
        
        <div className="grid gap-4">
          {users?.map((user) => (
            <div key={user?.id} className="p-4 border border-border rounded-lg bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="User" size={20} color="white" />
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground">{user?.name}</h5>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    {user?.phone && (
                      <p className="text-sm text-muted-foreground">{user?.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user?.role)}`}>
                    {roleOptions?.find(r => r?.value === user?.role)?.label}
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${user?.isActive ? 'bg-success' : 'bg-error'}`}></div>
                    <span className="text-xs text-muted-foreground">
                      {user?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditUser(user)}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleStatus(user?.id)}
                    >
                      <Icon name={user?.isActive ? 'UserX' : 'UserCheck'} size={16} />
                    </Button>
                    {user?.role !== 'admin' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(user?.id)}
                        className="text-error hover:text-error"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Role Permissions */}
              <div className="mt-4 pt-4 border-t border-border">
                <h6 className="text-sm font-medium text-foreground mb-2">Permissions</h6>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(rolePermissions?.[user?.role])?.map(([permission, hasAccess]) => (
                    <span
                      key={permission}
                      className={`px-2 py-1 rounded text-xs ${
                        hasAccess 
                          ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                      }`}
                    >
                      {permission?.charAt(0)?.toUpperCase() + permission?.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagementPanel;