import React from 'react';
import { Outlet } from 'react-router-dom';
import { CustomerHeader } from '../components/layout/CustomerHeader';
import { CustomerFooter } from '../components/layout/CustomerFooter';
import { CartDrawer } from '../components/cart/CartDrawer';
import { DemoBadge } from '../components/common/DemoBadge';

export const CustomerLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CustomerHeader />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <CustomerFooter />
      <CartDrawer />
      <DemoBadge />
    </div>
  );
};
