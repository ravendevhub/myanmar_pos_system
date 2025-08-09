import React, { useState, useEffect, useMemo } from 'react';
import MainSidebar from '../../components/ui/MainSidebar';
import TopHeader from '../../components/ui/TopHeader';
import QuickActionBar from '../../components/ui/QuickActionBar';
import AlertNotificationPanel from '../../components/ui/AlertNotificationPanel';
import ProductTable from './components/ProductTable';
import SearchFilters from './components/SearchFilters';
import InventorySummary from './components/InventorySummary';
import ProductModal from './components/ProductModal';
import BulkActions from './components/BulkActions';
import Button from '../../components/ui/Button';
import CategoryBrandModal from './components/CategoryBrandModal';

const ProductManagement = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState('add');
  const [brandModalMode, setBrandModalMode] = useState('add');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);

  // Mock data for products
  const mockProducts = [
    {
      id: 1,
      sku: 'PRD001',
      name: 'Rice (5kg)',
      category: 'Food & Beverages',
      brand: 'Golden Grain',
      unit: 'bag',
      description: 'Premium quality rice, 5kg bag',
      purchasePrice: 3500,
      sellingPrice: 4200,
      currentStock: 3,
      minStock: 10,
      image: 'https://images.pexels.com/photos/33239/rice-grain-seed-food.jpg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-08T12:40:07Z'
    },
    {
      id: 2,
      sku: 'PRD002',
      name: 'Cooking Oil (1L)',
      category: 'Food & Beverages',
      brand: 'Pure Gold',
      unit: 'bottle',
      description: 'Pure cooking oil, 1 liter bottle',
      purchasePrice: 2800,
      sellingPrice: 3200,
      currentStock: 25,
      minStock: 15,
      image: 'https://images.pexels.com/photos/4198170/pexels-photo-4198170.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2025-01-02T00:00:00Z',
      updatedAt: '2025-01-08T12:40:07Z'
    },
    {
      id: 3,
      sku: 'PRD003',
      name: 'Instant Noodles',
      category: 'Food & Beverages',
      brand: 'Quick Meal',
      unit: 'pack',
      description: 'Instant noodles with chicken flavor',
      purchasePrice: 450,
      sellingPrice: 600,
      currentStock: 0,
      minStock: 20,
      image: 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2025-01-03T00:00:00Z',
      updatedAt: '2025-01-08T12:40:07Z'
    },
    {
      id: 4,
      sku: 'PRD004',
      name: 'Shampoo (400ml)',
      category: 'Personal Care',
      brand: 'Clean & Fresh',
      unit: 'bottle',
      description: 'Anti-dandruff shampoo, 400ml',
      purchasePrice: 1800,
      sellingPrice: 2400,
      currentStock: 15,
      minStock: 8,
      image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2025-01-04T00:00:00Z',
      updatedAt: '2025-01-08T12:40:07Z'
    },
    {
      id: 5,
      sku: 'PRD005',
      name: 'Notebook (A4)',
      category: 'Stationery',
      brand: 'Study Pro',
      unit: 'piece',
      description: 'A4 size notebook, 200 pages',
      purchasePrice: 800,
      sellingPrice: 1200,
      currentStock: 50,
      minStock: 20,
      image: 'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2025-01-05T00:00:00Z',
      updatedAt: '2025-01-08T12:40:07Z'
    },
    {
      id: 6,
      sku: 'PRD006',
      name: 'Green Tea (100g)',
      category: 'Food & Beverages',
      brand: 'Nature\'s Best',
      unit: 'pack',
      description: 'Premium green tea leaves, 100g pack',
      purchasePrice: 1500,
      sellingPrice: 2000,
      currentStock: 8,
      minStock: 12,
      image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2025-01-06T00:00:00Z',
      updatedAt: '2025-01-08T12:40:07Z'
    },
    {
      id: 7,
      sku: 'PRD007',
      name: 'Hand Soap (250ml)',
      category: 'Personal Care',
      brand: 'Clean & Fresh',
      unit: 'bottle',
      description: 'Antibacterial hand soap, 250ml',
      purchasePrice: 650,
      sellingPrice: 900,
      currentStock: 30,
      minStock: 15,
      image: 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2025-01-07T00:00:00Z',
      updatedAt: '2025-01-08T12:40:07Z'
    },
    {
      id: 8,
      sku: 'PRD008',
      name: 'Ballpoint Pen (Blue)',
      category: 'Stationery',
      brand: 'Write Well',
      unit: 'piece',
      description: 'Blue ink ballpoint pen',
      purchasePrice: 120,
      sellingPrice: 200,
      currentStock: 100,
      minStock: 50,
      image: 'https://images.pexels.com/photos/159644/art-supplies-brushes-rulers-scissors-159644.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2025-01-08T00:00:00Z',
      updatedAt: '2025-01-08T12:40:07Z'
    }
  ];

  useEffect(() => {
    // Load products from localStorage or use mock data
    const savedProducts = localStorage.getItem('pos_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(mockProducts);
      localStorage.setItem('pos_products', JSON.stringify(mockProducts));
    }
  }, []);

  // Save products to localStorage whenever products change
  useEffect(() => {
    if (products?.length > 0) {
      localStorage.setItem('pos_products', JSON.stringify(products));
    }
  }, [products]);

  // Save categories and brands to localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem('pos_categories');
    const savedBrands = localStorage.getItem('pos_brands');
    
    if (!savedCategories) {
      const initialCategories = [...new Set(mockProducts.map(product => product.category))]?.map((cat, index) => ({
        id: index + 1,
        name: cat,
        description: '',
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      }));
      localStorage.setItem('pos_categories', JSON.stringify(initialCategories));
    }

    if (!savedBrands) {
      const initialBrands = [...new Set(mockProducts.map(product => product.brand))]?.map((brand, index) => ({
        id: index + 1,
        name: brand,
        description: '',
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      }));
      localStorage.setItem('pos_brands', JSON.stringify(initialBrands));
    }
  }, []);

  // Get categories and brands from localStorage
  const categories = useMemo(() => {
    const savedCategories = JSON.parse(localStorage.getItem('pos_categories') || '[]');
    return savedCategories?.map(cat => cat?.name)?.sort();
  }, [products]);

  const brands = useMemo(() => {
    const savedBrands = JSON.parse(localStorage.getItem('pos_brands') || '[]');
    return savedBrands?.map(brand => brand?.name)?.sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products?.filter(product => {
      const matchesSearch = !searchTerm || 
        product?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        product?.sku?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      
      const matchesCategory = !selectedCategory || product?.category === selectedCategory;
      const matchesBrand = !selectedBrand || product?.brand === selectedBrand;
      
      let matchesStock = true;
      if (stockFilter === 'in-stock') {
        matchesStock = product?.currentStock > product?.minStock;
      } else if (stockFilter === 'low-stock') {
        matchesStock = product?.currentStock <= product?.minStock && product?.currentStock > 0;
      } else if (stockFilter === 'out-of-stock') {
        matchesStock = product?.currentStock === 0;
      }

      return matchesSearch && matchesCategory && matchesBrand && matchesStock;
    });

    // Sort products
    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        let aValue = a?.[sortConfig?.key];
        let bValue = b?.[sortConfig?.key];

        if (typeof aValue === 'string') {
          aValue = aValue?.toLowerCase();
          bValue = bValue?.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, selectedBrand, stockFilter, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectProduct = (productId, isSelected) => {
    if (isSelected) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev?.filter(id => id !== productId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedProducts(filteredProducts?.map(product => product?.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setStockFilter('all');
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setModalMode('add');
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setModalMode('edit');
    setIsProductModalOpen(true);
  };

  const handleDuplicateProduct = (product) => {
    setEditingProduct(product);
    setModalMode('duplicate');
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev?.filter(product => product?.id !== productId));
      setSelectedProducts(prev => prev?.filter(id => id !== productId));
    }
  };

  const handleViewHistory = (product) => {
    console.log('Viewing sales history for:', product?.name);
    // This would typically navigate to a sales history page
  };

  const handleSaveProduct = (productData) => {
    if (modalMode === 'edit') {
      setProducts(prev => prev?.map(product => 
        product?.id === productData?.id ? productData : product
      ));
    } else {
      setProducts(prev => [...prev, productData]);
    }
  };

  const handleBulkDelete = (productIds) => {
    setProducts(prev => prev?.filter(product => !productIds?.includes(product?.id)));
    setSelectedProducts([]);
  };

  const handleBulkExport = (productIds) => {
    const productsToExport = productIds?.length > 0 
      ? products?.filter(product => productIds?.includes(product?.id))
      : products;
    
    console.log('Exporting products:', productsToExport);
    // This would typically generate and download an Excel file
  };

  const handleGenerateBarcodes = (productIds) => {
    const selectedProductsData = products?.filter(product => productIds?.includes(product?.id));
    console.log('Generating barcodes for:', selectedProductsData);
    // This would typically generate barcode/QR code images
  };

  const handleImportExcel = (file) => {
    console.log('Importing Excel file:', file?.name);
    // This would typically parse the Excel file and add products
  };

  const handleManageCategories = () => {
    setCategoryModalMode('manage');
    setIsCategoryModalOpen(true);
  };

  const handleManageBrands = () => {
    setBrandModalMode('manage');
    setIsBrandModalOpen(true);
  };

  const handleSaveCategory = async (categoryData, mode) => {
    const savedCategories = JSON.parse(localStorage.getItem('pos_categories') || '[]');
    
    if (mode === 'edit') {
      const updatedCategories = savedCategories?.map(cat => 
        cat?.id === categoryData?.id ? categoryData : cat
      );
      localStorage.setItem('pos_categories', JSON.stringify(updatedCategories));
    } else {
      localStorage.setItem('pos_categories', JSON.stringify([...savedCategories, categoryData]));
    }
    
    // Force re-render by updating products state
    setProducts(prev => [...prev]);
  };

  const handleSaveBrand = async (brandData, mode) => {
    const savedBrands = JSON.parse(localStorage.getItem('pos_brands') || '[]');
    
    if (mode === 'edit') {
      const updatedBrands = savedBrands?.map(brand => 
        brand?.id === brandData?.id ? brandData : brand
      );
      localStorage.setItem('pos_brands', JSON.stringify(updatedBrands));
    } else {
      localStorage.setItem('pos_brands', JSON.stringify([...savedBrands, brandData]));
    }
    
    // Force re-render by updating products state
    setProducts(prev => [...prev]);
  };

  const handleDeleteCategory = async (categoryId) => {
    const savedCategories = JSON.parse(localStorage.getItem('pos_categories') || '[]');
    const updatedCategories = savedCategories?.filter(cat => cat?.id !== categoryId);
    localStorage.setItem('pos_categories', JSON.stringify(updatedCategories));
    
    // Force re-render by updating products state
    setProducts(prev => [...prev]);
  };

  const handleDeleteBrand = async (brandId) => {
    const savedBrands = JSON.parse(localStorage.getItem('pos_brands') || '[]');
    const updatedBrands = savedBrands?.filter(brand => brand?.id !== brandId);
    localStorage.setItem('pos_brands', JSON.stringify(updatedBrands));
    
    // Force re-render by updating products state
    setProducts(prev => [...prev]);
  };

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
              {/* Main Content */}
              <div className="flex-1 lg:w-3/4">
                {/* Category and Brand Management Buttons */}
                <div className="flex flex-wrap items-center gap-3 mb-4 p-4 bg-card border border-border rounded-lg">
                  <h3 className="text-sm font-medium text-foreground">Quick Management:</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleManageCategories}
                    iconName="FolderOpen"
                  >
                    Manage Categories
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleManageBrands}
                    iconName="Tag"
                  >
                    Manage Brands
                  </Button>
                </div>

                <BulkActions
                  selectedProducts={selectedProducts}
                  onBulkDelete={handleBulkDelete}
                  onBulkExport={handleBulkExport}
                  onGenerateBarcodes={handleGenerateBarcodes}
                  onImportExcel={handleImportExcel}
                  onClearSelection={() => setSelectedProducts([])}
                />

                <SearchFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  selectedBrand={selectedBrand}
                  onBrandChange={setSelectedBrand}
                  stockFilter={stockFilter}
                  onStockFilterChange={setStockFilter}
                  onClearFilters={handleClearFilters}
                  categories={categories}
                  brands={brands}
                />

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold text-foreground">
                      Products ({filteredProducts?.length})
                    </h2>
                    {selectedProducts?.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {selectedProducts?.length} selected
                      </span>
                    )}
                  </div>
                  
                  <Button onClick={handleAddProduct} iconName="Plus">
                    Add Product
                  </Button>
                </div>

                <ProductTable
                  products={filteredProducts}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  onDuplicate={handleDuplicateProduct}
                  onViewHistory={handleViewHistory}
                  selectedProducts={selectedProducts}
                  onSelectProduct={handleSelectProduct}
                  onSelectAll={handleSelectAll}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
              </div>

              {/* Sidebar */}
              <div className="lg:w-1/4">
                <InventorySummary products={products} />
              </div>
            </div>
          </div>
        </main>
      </div>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories}
        brands={brands}
        mode={modalMode}
      />

      {/* Category Management Modal */}
      <CategoryBrandModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        onDelete={handleDeleteCategory}
        type="category"
        item={editingCategory}
        mode={categoryModalMode}
      />

      {/* Brand Management Modal */}
      <CategoryBrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        onSave={handleSaveBrand}
        onDelete={handleDeleteBrand}
        type="brand"
        item={editingBrand}
        mode={brandModalMode}
      />

      <QuickActionBar />
      <AlertNotificationPanel />
    </div>
  );
};

export default ProductManagement;