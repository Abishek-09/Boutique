import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { Menu, Bell, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AdminSidebar } from '../components/layout/AdminSidebar';

export const AdminLayout = () => {
  const { isAdminAuthenticated } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const scrollContainerRef = React.useRef(null);

  // Smoothly reset right content scroll position upon route change
  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname]);

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/products/new')) return 'Add New Product';
    if (path.includes('/products/') && path.includes('/edit')) return 'Edit Product';
    if (path.includes('/products')) return 'Product Catalog Management';
    if (path.includes('/categories')) return 'Boutique Categories';
    if (path.includes('/collections')) return 'Themed Collections';
    if (path.includes('/inventory')) return 'Inventory & Stock Control';
    if (path.includes('/orders/')) return 'Order Details & Dispatch';
    if (path.includes('/orders')) return 'Orders & Fulfillment';
    if (path.includes('/customers/')) return 'Patron Profile & History';
    if (path.includes('/customers')) return 'Patron Database';
    if (path.includes('/offers')) return 'Coupons & Promotional Offers';
    if (path.includes('/reviews')) return 'Review Moderation';
    if (path.includes('/homepage')) return 'Homepage CMS Editor';
    if (path.includes('/enquiries')) return 'Customer Concierge Enquiries';
    if (path.includes('/settings')) return 'Atelier Settings';
    return 'Operations Dashboard';
  };

  return (
    <div
      className="admin-layout"
      style={{
        display: 'flex',
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-base)',
      }}
    >
      {/* Sidebar - Pinned & Stationary */}
      <AdminSidebar isMobileOpen={isMobileOpen} onCloseMobile={() => setIsMobileOpen(false)} />

      {/* Main Content Area - Dedicated Right Content Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="admin-main-wrapper"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          height: '100vh',
          maxHeight: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {/* Top Navbar - Sticky inside the right content scroll container */}
        <header
          className="admin-header"
          style={{
            height: '70px',
            flexShrink: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.97)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 900,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
            <button
              onClick={() => setIsMobileOpen(true)}
              className="admin-mobile-toggle"
              style={{ display: 'none', padding: '6px', color: 'var(--text-espresso)' }}
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            <h2
              className="admin-header-title"
              style={{
                fontSize: '18px',
                margin: 0,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {getPageTitle()}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div
              className="admin-status-pill"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                backgroundColor: 'var(--surface-sand)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-espresso)',
              }}
            >
              <ShieldCheck size={14} color="var(--primary)" />
              <span className="admin-status-text">Admin Active</span>
            </div>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sand btn-sm"
              style={{ fontSize: '11px', padding: '6px 10px' }}
            >
              <span className="admin-view-text">Store</span> <ExternalLink size={12} />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-main-content" style={{ flex: 1, padding: '32px' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        .admin-layout {
          height: 100vh;
          height: 100dvh;
          max-height: 100vh;
          max-height: 100dvh;
          overflow: hidden;
        }
        .admin-main-wrapper {
          height: 100vh;
          height: 100dvh;
          max-height: 100vh;
          max-height: 100dvh;
          overflow-y: auto;
          overflow-x: hidden;
        }
        @media (max-width: 1024px) {
          .admin-mobile-toggle {
            display: block !important;
          }
          .admin-header {
            padding: 0 16px !important;
          }
          .admin-main-content {
            padding: 20px 16px !important;
          }
        }
        @media (max-width: 640px) {
          .admin-header {
            height: 60px !important;
            padding: 0 12px !important;
          }
          .admin-header-title {
            font-size: 15px !important;
          }
          .admin-status-text {
            display: none !important;
          }
          .admin-status-pill {
            padding: 6px !important;
          }
          .admin-main-content {
            padding: 16px 12px !important;
          }
        }
      `}</style>
    </div>
  );
};
