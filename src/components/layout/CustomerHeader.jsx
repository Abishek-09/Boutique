import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useScrollLock } from '../../hooks/useScrollLock';
import { cmsService } from '../../services/cmsService';
import { LiveSearchInput } from '../common/LiveSearchInput';

export const CustomerHeader = () => {
  const { totalItemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Lock body scroll when mobile menu drawer is open
  useScrollLock(isMobileMenuOpen);

  const cmsData = cmsService.getHomepageContent();
  const announcement = cmsData?.announcement;

  // Auto-close search and mobile drawers whenever route changes
  useEffect(() => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close drawers on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside header closes search drawer
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDetectedScope = () => {
    if (location.pathname.startsWith('/new-arrivals')) return 'new-arrivals';
    if (location.pathname.startsWith('/offers')) return 'offers';
    if (location.pathname.startsWith('/collections')) return 'collections';
    return 'shop';
  };

  const [searchScope, setSearchScope] = useState('shop');

  useEffect(() => {
    setSearchScope(getDetectedScope());
  }, [location.pathname, isSearchOpen]);

  const scopeConfig = {
    'new-arrivals': {
      label: 'New Arrivals',
      placeholder: 'Search within New Arrivals (e.g. Silk, Saree, Kurti)...',
      targetPath: '/new-arrivals',
    },
    offers: {
      label: 'Offers & Vouchers',
      placeholder: 'Search within Offers & Vouchers (e.g. Festive, Saree, 15%)...',
      targetPath: '/offers',
    },
    collections: {
      label: 'Collections',
      placeholder: 'Search within Collections (e.g. Banarasi, Pastel)...',
      targetPath: location.pathname.startsWith('/collections/') ? location.pathname : '/collections',
    },
    shop: {
      label: 'Entire Store',
      placeholder: 'Search entire boutique catalog by name, fabric, or SKU...',
      targetPath: '/shop',
    },
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const q = encodeURIComponent(searchQuery.trim());
      const config = scopeConfig[searchScope] || scopeConfig.shop;
      navigate(`${config.targetPath}?search=${q}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Collections', path: '/collections' },
    { label: 'New Arrivals', path: '/new-arrivals' },
    { label: 'Offers', path: '/offers' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path + '/'));
  };

  return (
    <header ref={headerRef} style={{ position: 'sticky', top: 0, zIndex: 900, backgroundColor: 'rgba(255, 255, 255, 0.96)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border)' }}>
      {/* 1. Announcement Bar - Sleek Luxury Edition */}
      {announcement?.enabled && (
        <div
          style={{
            backgroundColor: 'var(--text-espresso)',
            color: 'var(--bg-base)',
            padding: '7px 16px',
            fontSize: '11px',
            textAlign: 'center',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span style={{ color: 'var(--accent-gold)', fontSize: '9px' }}>✦</span>
          <span>{announcement.text}</span>
          <span style={{ color: 'var(--accent-gold)', fontSize: '9px' }}>✦</span>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div
        className="container header-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px',
          transition: 'height 0.25s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Mobile Hamburger Menu Button */}
          <button
            className="mobile-toggle"
            onClick={() => setIsMobileMenuOpen(true)}
            style={{ display: 'none', padding: '8px', color: 'var(--text-espresso)' }}
            aria-label="Toggle navigation menu"
          >
            <Menu size={22} strokeWidth={1.3} />
          </button>

          {/* Boutique Brand Logo */}
          <Link to="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textDecoration: 'none' }}>
            <span
              className="brand-logo-text"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '26px',
                fontWeight: 600,
                letterSpacing: '0.18em',
                color: 'var(--text-espresso)',
                lineHeight: 1,
              }}
            >
              MAISON D'OR
            </span>
            <span
              className="brand-logo-sub"
              style={{
                fontSize: '8.5px',
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                color: 'var(--accent-gold)',
                marginTop: '4px',
                fontWeight: 600,
              }}
            >
              HERITAGE ATELIER
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.label}
                to={link.path}
                className={`desktop-nav-link ${active ? 'active' : ''}`}
                style={{
                  fontSize: '12.5px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--primary)' : 'var(--text-espresso)',
                  transition: 'var(--transition-smooth)',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="header-actions">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            className="nav-action-btn"
            title="Search boutique catalog"
            aria-label="Search"
          >
            <Search size={19} strokeWidth={1.3} />
          </button>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            onClick={() => setIsSearchOpen(false)}
            className="nav-action-btn"
            title="Saved Wishlist"
            aria-label="Wishlist"
          >
            <Heart size={19} strokeWidth={1.3} />
            {wishlistCount > 0 && (
              <span className="nav-action-badge">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Shopping Bag Link (Navigates to dedicated /cart page) */}
          <Link
            to="/cart"
            onClick={() => setIsSearchOpen(false)}
            className="nav-action-btn"
            title="Your Shopping Bag"
            aria-label="Shopping Bag"
          >
            <ShoppingBag size={19} strokeWidth={1.3} />
            {totalItemCount > 0 && (
              <span className="nav-action-badge">
                {totalItemCount}
              </span>
            )}
          </Link>

          {/* Account Link */}
          <Link
            to="/account"
            onClick={() => setIsSearchOpen(false)}
            className="nav-action-btn"
            title="Customer Account"
            aria-label="Account"
          >
            <User size={19} strokeWidth={1.3} />
          </Link>
        </div>
      </div>

      {/* Expandable Search Drawer */}
      {isSearchOpen && (
        <div
          style={{
            backgroundColor: 'var(--surface-sand)',
            borderTop: '1px solid var(--border)',
            padding: '16px 16px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div className="container" style={{ maxWidth: '720px', padding: 0 }}>
            {/* Scope Selection Pill Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Search Scope:
                </span>
                {getDetectedScope() !== 'shop' ? (
                  <div style={{ display: 'inline-flex', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-full)', padding: '2px', border: '1px solid var(--border)' }}>
                    <button
                      type="button"
                      onClick={() => setSearchScope(getDetectedScope())}
                      style={{
                        padding: '3px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '11px',
                        fontWeight: searchScope === getDetectedScope() ? 600 : 500,
                        backgroundColor: searchScope === getDetectedScope() ? 'var(--primary)' : 'transparent',
                        color: searchScope === getDetectedScope() ? '#FFFFFF' : 'var(--text-espresso)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                      }}
                    >
                      ● In {scopeConfig[getDetectedScope()].label}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchScope('shop')}
                      style={{
                        padding: '3px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '11px',
                        fontWeight: searchScope === 'shop' ? 600 : 500,
                        backgroundColor: searchScope === 'shop' ? 'var(--primary)' : 'transparent',
                        color: searchScope === 'shop' ? '#FFFFFF' : 'var(--text-espresso)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                      }}
                    >
                      Entire Store
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--accent-gold)', fontWeight: 600 }}>
                    Entire Boutique Atelier
                  </span>
                )}
              </div>

              {searchScope !== 'shop' && (
                <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontStyle: 'italic' }}>
                  Targeted search active
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <LiveSearchInput
                  value={searchQuery}
                  onChange={(val) => setSearchQuery(val)}
                  onSubmit={(query) => {
                    if (query.trim()) {
                      const q = encodeURIComponent(query.trim());
                      const config = scopeConfig[searchScope] || scopeConfig.shop;
                      navigate(`${config.targetPath}?search=${q}`);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }
                  }}
                  scope={searchScope}
                  scopeLabel={scopeConfig[searchScope]?.label}
                  placeholder={scopeConfig[searchScope]?.placeholder || scopeConfig.shop.placeholder}
                  autoFocus={true}
                  showSubmitButton={true}
                />
              </div>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{ height: '42px', flexShrink: 0 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu with Backdrop (Portalled to document.body to break free from header stacking context) */}
      {isMobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="mobile-menu-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(28, 25, 23, 0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 99990,
            animation: 'fadeIn 0.2s ease',
            display: 'flex',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
        >
          <div
            className="mobile-menu-drawer"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '85%',
              maxWidth: '320px',
              height: '100%',
              maxHeight: '100dvh',
              backgroundColor: '#FFFFFF',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              padding: 'max(24px, env(safe-area-inset-top)) 20px max(24px, env(safe-area-inset-bottom))',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              boxShadow: 'var(--shadow-lg)',
              animation: 'slideRight 0.25s ease',
            }}
          >
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 700, color: 'var(--text-espresso)', display: 'block' }}>
                  MAISON D'OR
                </span>
                <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent-gold)', fontWeight: 600 }}>
                  HERITAGE ATELIER
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ padding: '6px', color: 'var(--text-espresso)' }}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    fontSize: '16px',
                    fontFamily: 'var(--font-serif)',
                    color: isActive(link.path) ? 'var(--primary)' : 'var(--text-espresso)',
                    fontWeight: 600,
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: '44px',
                  }}
                >
                  <span>{link.label}</span>
                  {isActive(link.path) && <span style={{ color: 'var(--primary)', fontSize: '13px' }}>●</span>}
                </Link>
              ))}

              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link
                  to="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn btn-ghost btn-block btn-sm"
                  style={{ border: '1px solid var(--border)', justifyContent: 'space-between', minHeight: '42px' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Heart size={15} /> SAVED WISHLIST
                  </span>
                  {wishlistCount > 0 && (
                    <span style={{ backgroundColor: 'var(--primary)', color: '#FFFFFF', borderRadius: 'var(--radius-full)', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn btn-sand btn-block btn-sm"
                  style={{ minHeight: '42px' }}
                >
                  <User size={15} /> MY ACCOUNT & ORDERS
                </Link>

                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn btn-dark btn-block btn-sm"
                  style={{ minHeight: '42px' }}
                >
                  STAFF ADMIN PORTAL
                </Link>
              </div>
            </nav>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        .desktop-nav-link {
          position: relative;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-espresso);
          padding: 8px 2px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: color 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .desktop-nav-link:hover {
          color: var(--primary);
          transform: translateY(-1px);
        }
        .desktop-nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 1.5px;
          background-color: var(--accent-gold);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .desktop-nav-link:hover::after {
          transform: scaleX(1);
        }
        .desktop-nav-link.active {
          color: var(--primary) !important;
          font-weight: 600 !important;
        }
        .desktop-nav-link.active::after {
          transform: scaleX(1);
          background-color: var(--accent-gold);
        }
        .mobile-nav-link {
          transition: var(--transition-smooth);
        }
        .mobile-nav-link:hover {
          color: var(--primary) !important;
          padding-left: 6px;
        }
        .nav-action-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-espresso);
          background-color: transparent;
          border: 1px solid transparent;
          position: relative;
          transition: var(--transition-smooth);
          cursor: pointer;
          text-decoration: none;
        }
        .nav-action-btn:focus {
          outline: none;
        }
        .nav-action-btn:focus-visible {
          outline: 1.5px solid var(--accent-gold);
          outline-offset: 2px;
        }
        .nav-action-btn:hover {
          background-color: rgba(197, 160, 89, 0.12);
          color: var(--primary);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(88, 17, 26, 0.10);
          border-color: rgba(197, 160, 89, 0.35);
        }
        .nav-action-btn:active {
          transform: translateY(0);
        }
        .nav-action-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background-color: var(--primary);
          color: #FFFFFF;
          border-radius: 50%;
          font-size: 10px;
          width: 17px;
          height: 17px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          box-shadow: 0 2px 6px rgba(88, 17, 26, 0.35);
          transition: transform 0.25s ease;
        }
        .nav-action-btn:hover .nav-action-badge {
          transform: scale(1.12);
        }
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @media (max-width: 1024px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: inline-flex !important;
          }
        }
        @media (max-width: 640px) {
          .header-container {
            height: 64px !important;
          }
          .brand-logo-text {
            font-size: 19px !important;
          }
          .brand-logo-sub {
            font-size: 8px !important;
            letterSpacing: 0.18em !important;
          }
          .header-actions {
            gap: 4px !important;
          }
        }
      `}</style>
    </header>
  );
};
