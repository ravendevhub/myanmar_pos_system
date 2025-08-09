import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import Settings from './pages/settings';
import SalesManagement from './pages/sales-management';
import ProductManagement from './pages/product-management';
import Dashboard from './pages/dashboard';
import CustomerManagement from './pages/customer-management';
import NewSale from './pages/new-sale';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CustomerManagement />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/sales-management" element={<SalesManagement />} />
        <Route path="/product-management" element={<ProductManagement />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customer-management" element={<CustomerManagement />} />
        <Route path="/new-sale" element={<NewSale />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
