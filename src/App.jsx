import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { ShopPage } from './pages/customer/ShopPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { NewArrivalsPage } from './pages/customer/NewArrivalsPage';
import { CollectionsPage } from './pages/customer/CollectionsPage';
import { CollectionDetailPage } from './pages/customer/CollectionDetailPage';
import { WishlistPage } from './pages/customer/WishlistPage';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderSuccessPage } from './pages/customer/OrderSuccessPage';
import { AccountPage } from './pages/customer/AccountPage';
import { MyOrdersPage } from './pages/customer/MyOrdersPage';
import { OrderDetailPage } from './pages/customer/OrderDetailPage';
import { AboutPage } from './pages/customer/AboutPage';
import { ContactPage } from './pages/customer/ContactPage';
import { OffersPage } from './pages/customer/OffersPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminCollectionsPage } from './pages/admin/AdminCollectionsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminOrderDetailPage } from './pages/admin/AdminOrderDetailPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminCustomerDetailPage } from './pages/admin/AdminCustomerDetailPage';
import { AdminOffersPage } from './pages/admin/AdminOffersPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminHomepagePage } from './pages/admin/AdminHomepagePage';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="app-container">
                <Routes>
                  {/* Customer Storefront Routes */}
                  <Route element={<CustomerLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                    <Route path="/collections" element={<CollectionsPage />} />
                    <Route path="/collections/:slug" element={<CollectionDetailPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-success/:id" element={<OrderSuccessPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/account/orders" element={<MyOrdersPage />} />
                    <Route path="/account/orders/:id" element={<OrderDetailPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/offers" element={<OffersPage />} />
                  </Route>

                  {/* Admin Login Routes (Direct /admin endpoint and /admin/login) */}
                  <Route path="/admin" element={<AdminLoginPage />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />

                  {/* Admin Management Protected Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="products" element={<AdminProductsPage />} />
                    <Route path="products/new" element={<AdminProductsPage />} />
                    <Route path="products/:id/edit" element={<AdminProductsPage />} />
                    <Route path="inventory" element={<AdminInventoryPage />} />
                    <Route path="categories" element={<AdminCategoriesPage />} />
                    <Route path="collections" element={<AdminCollectionsPage />} />
                    <Route path="orders" element={<AdminOrdersPage />} />
                    <Route path="orders/:id" element={<AdminOrderDetailPage />} />
                    <Route path="customers" element={<AdminCustomersPage />} />
                    <Route path="customers/:id" element={<AdminCustomerDetailPage />} />
                    <Route path="offers" element={<AdminOffersPage />} />
                    <Route path="reviews" element={<AdminReviewsPage />} />
                    <Route path="homepage" element={<AdminHomepagePage />} />
                    <Route path="enquiries" element={<AdminEnquiriesPage />} />
                    <Route path="settings" element={<AdminSettingsPage />} />
                  </Route>

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
