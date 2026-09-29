import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const DemoBadge = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <aside
      className="demo-pill"
      style={{
        padding: collapsed ? '6px 12px' : '8px 18px',
      }}
      aria-label="Demo mode indicator"
    >
      <span className="demo-pill-dot" aria-hidden="true"></span>
      {!collapsed ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', letterSpacing: '0.04em' }}>
          <span style={{ color: '#FBF9F5', fontWeight: 400 }}>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Maison D'Or</span>
            {' '}&bull; {isAdmin ? 'Admin Suite' : 'Customer Boutique'}
          </span>
          <span style={{ color: 'rgba(197, 160, 89, 0.4)' }}>|</span>
          <Link
            to={isAdmin ? '/' : '/admin'}
            style={{
              color: 'var(--accent-gold)',
              textDecoration: 'none',
              fontWeight: 500,
              letterSpacing: '0.06em',
              transition: 'var(--transition)',
              borderBottom: '1px solid rgba(197, 160, 89, 0.4)',
              paddingBottom: '1px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent-gold)')}
          >
            {isAdmin ? 'View Storefront' : 'Open Admin Suite'} &rarr;
          </Link>
          <button
            onClick={() => setCollapsed(true)}
            style={{
              color: 'var(--text-light)',
              opacity: 0.6,
              padding: '0 4px',
              fontSize: '13px',
              lineHeight: 1,
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
            title="Minimize"
            aria-label="Minimize demo mode indicator"
          >
            &times;
          </button>
        </div>
      ) : (
        <button
          onClick={() => setCollapsed(false)}
          style={{
            color: 'var(--accent-gold)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
          aria-label="Expand demo mode indicator"
        >
          <span>Demo Controls</span>
          <span style={{ fontSize: '10px', opacity: 0.7 }}>&larr;</span>
        </button>
      )}
    </aside>
  );
};

