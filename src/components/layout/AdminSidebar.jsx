import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Sparkles,
  Boxes,
  ShoppingBag,
  Users,
  Tag,
  Star,
  Home,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const AdminSidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { adminUser, logoutAdmin } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    showToast('Admin logged out', 'info');
    navigate('/admin');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Collections', path: '/admin/collections', icon: Sparkles },
    { label: 'Inventory & Stock', path: '/admin/inventory', icon: Boxes },
    { label: 'Orders & Courier', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Patrons / Customers', path: '/admin/customers', icon: Users },
    { label: 'Coupons & Offers', path: '/admin/offers', icon: Tag },
    { label: 'Reviews Moderation', path: '/admin/reviews', icon: Star },
    { label: 'Homepage CMS', path: '/admin/homepage', icon: Home },
    { label: 'Customer Enquiries', path: '/admin/enquiries', icon: MessageSquare },
    { label: 'Boutique Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(28, 25, 23, 0.7)',
            backdropFilter: 'blur(6px)',
            zIndex: 945,
            animation: 'fadeIn 0.2s ease',
          }}
        />
      )}

      <aside
        className={`admin-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}
        style={{
          width: '260px',
          flexShrink: 0,
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          maxHeight: '100vh',
          position: 'relative',
          zIndex: 950,
          transition: 'transform 0.3s ease',
          overflow: 'hidden',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '24px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF',
            flexShrink: 0,
          }}
        >
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 600, letterSpacing: '0.14em', color: 'var(--text-espresso)', display: 'block' }}>
              MAISON D'OR
            </span>
            <span style={{ fontSize: '8.5px', textTransform: 'uppercase', letterSpacing: '0.28em', color: 'var(--accent-gold)', display: 'block', fontWeight: 600, marginTop: '2px' }}>
              ATELIER MANAGEMENT
            </span>
          </div>

          <button
            onClick={onCloseMobile}
            className="mobile-close-btn"
            style={{ display: 'none', color: 'var(--text-espresso)', padding: '4px' }}
            aria-label="Close menu"
          >
            <X size={18} strokeWidth={1.3} />
          </button>
        </div>

        {/* Storefront Quick Switch */}
        <div style={{ padding: '11px 20px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-alt)', flexShrink: 0 }}>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '11.5px',
              color: 'var(--text-espresso)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontWeight: 500,
              letterSpacing: '0.04em',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-espresso)')}
          >
            <span>Live Customer Storefront</span>
            <ExternalLink size={12} strokeWidth={1.4} color="var(--accent-gold)" />
          </Link>
        </div>

        {/* Navigation Links with Editorial Gold Indicator Line */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={onCloseMobile}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px 10px 12px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '12.5px',
                  letterSpacing: '0.04em',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--primary)' : 'var(--text-espresso)',
                  backgroundColor: isActive ? 'rgba(197, 160, 89, 0.09)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent-gold)' : '3px solid transparent',
                  transition: 'var(--transition-smooth)',
                })}
              >
                <Icon size={16} strokeWidth={1.3} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Admin User Footer */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--surface-alt)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ overflow: 'hidden' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {adminUser?.name || 'Aaradhya S.'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Store Manager</span>
          </div>

          <button
            onClick={handleLogout}
            style={{ color: 'var(--danger)', padding: '6px' }}
            title="Logout Admin"
            aria-label="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 1024px) {
          .admin-sidebar {
            position: fixed !important;
            top: 0;
            left: 0;
            bottom: 0;
            transform: translateX(-100%);
            box-shadow: var(--shadow-lg);
          }
          .admin-sidebar.mobile-open {
            transform: translateX(0);
          }
          .mobile-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};
