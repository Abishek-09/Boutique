import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye, Truck, ArrowRight, Package, IndianRupee, CheckCircle2, Clock } from 'lucide-react';
import { orderService } from '../../services/orderService';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadOrders = () => {
    setOrders(orderService.getAllOrders());
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const statuses = ['All', 'Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.summary?.total || o.total || 0), 0);

  const inFulfillmentCount = orders.filter((o) =>
    ['processing', 'shipped', 'confirmed'].includes(o.status?.toLowerCase())
  ).length;

  const deliveredCount = orders.filter((o) => o.status?.toLowerCase() === 'delivered').length;
  const fulfillmentRate = orders.length
    ? Math.round((deliveredCount / orders.length) * 100)
    : 100;

  const orderKpis = [
    {
      label: 'TOTAL ORDERS',
      value: orders.length,
      context: `${deliveredCount} delivered safely`,
      icon: <Package size={15} />,
      highlightColor: 'var(--text-espresso)',
    },
    {
      label: 'GROSS REVENUE',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      context: 'Active atelier revenue',
      icon: <IndianRupee size={15} />,
      highlightColor: '#2D8A4E',
    },
    {
      label: 'IN FULFILLMENT',
      value: inFulfillmentCount,
      context: 'BlueDart couriers active',
      icon: <Truck size={15} />,
      highlightColor: 'var(--primary)',
    },
    {
      label: 'DELIVERY RATE',
      value: `${fulfillmentRate}%`,
      context: '0 fulfillment disputes',
      icon: <CheckCircle2 size={15} />,
      highlightColor: '#2D8A4E',
    },
  ];

  const filtered = orders.filter((o) => {
    const matchesFilter =
      activeFilter === 'all' || o.status.toLowerCase() === activeFilter.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q) ||
      (o.shippingInfo && o.shippingInfo.trackingNumber.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered': return 'badge-success';
      case 'Shipped': return 'badge-sale';
      case 'Processing':
      case 'Confirmed': return 'badge-warning';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-sand';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', letterSpacing: '0.04em', margin: '0 0 4px' }}>Customer Orders & Fulfillment</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Inspect client orders, advance fulfillment stages, and input courier waybills
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge badge-sand" style={{ fontSize: '12px', padding: '6px 14px' }}>
            Total Orders: {orders.length}
          </span>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
        }}
        className="kpi-cards-grid"
      >
        {orderKpis.map((kpi, idx) => (
          <div
            key={idx}
            className="admin-card-hover"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '20px 22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {kpi.label}
              </span>
              <div className="admin-card-icon" style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)' }}>
                {kpi.icon}
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--text-espresso)', lineHeight: 1.1, marginBottom: '6px' }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: '12px', color: kpi.highlightColor || 'var(--text-light)', fontWeight: 500 }}>
              {kpi.context}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs & Search */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Status Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {statuses.map((st) => {
            const count =
              st === 'All'
                ? orders.length
                : orders.filter((o) => o.status.toLowerCase() === st.toLowerCase()).length;
            const isSelected = activeFilter === st.toLowerCase();

            return (
              <button
                key={st}
                onClick={() => setActiveFilter(st.toLowerCase())}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected ? 'var(--text-espresso)' : 'var(--surface-alt)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-espresso)',
                  border: '1px solid var(--border)',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '450px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search order number, customer name, AWB..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingRight: '36px', fontSize: '13px' }}
          />
          <Search size={16} style={{ position: 'absolute', right: '12px', top: '13px', color: 'var(--text-light)' }} />
        </div>
      </div>

      {/* Orders Table Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--surface-alt)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px 16px' }}>Order Ref</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Customer</th>
                <th style={{ padding: '12px 16px' }}>Items & Garments</th>
                <th style={{ padding: '12px 16px' }}>Payment</th>
                <th style={{ padding: '12px 16px' }}>Total Amount</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Courier Info</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No orders matching selected criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((ord) => (
                  <tr key={ord.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)' }}>
                      <Link to={`/admin/orders/${ord.orderNumber}`} style={{ color: 'var(--primary)' }}>
                        {ord.orderNumber}
                      </Link>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                      {new Date(ord.orderDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <strong style={{ display: 'block', color: 'var(--text-espresso)' }}>
                        {ord.customer.name}
                      </strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                        {ord.shippingAddress.city}, {ord.shippingAddress.state}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {ord.items.slice(0, 2).map((item, i) => (
                          <img
                            key={i}
                            src={item.image}
                            alt={item.name}
                            title={item.name}
                            style={{ width: '32px', height: '42px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                          />
                        ))}
                        <span style={{ fontSize: '12px' }}>
                          {ord.items.length} item{ord.items.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: ord.payment.status === 'Paid' ? 'var(--success-bg)' : 'var(--warning-bg)',
                          color: ord.payment.status === 'Paid' ? 'var(--success)' : 'var(--warning)',
                          borderColor: ord.payment.status === 'Paid' ? 'rgba(27, 94, 58, 0.25)' : 'rgba(180, 105, 14, 0.25)',
                          fontSize: '10.5px',
                        }}
                      >
                        <span className="badge-dot" />
                        {ord.payment.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>
                      ₹{ord.pricing.total.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${getStatusBadgeClass(ord.status)}`}>
                        <span className="badge-dot" />
                        {ord.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '12px' }}>
                      {ord.shippingInfo ? (
                        <div>
                          <strong style={{ color: 'var(--text-espresso)' }}>{ord.shippingInfo.courierName}</strong>
                          <span style={{ display: 'block', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                            {ord.shippingInfo.trackingNumber}
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>Not dispatched</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <Link
                        to={`/admin/orders/${ord.orderNumber}`}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '5px 12px', fontSize: '11px' }}
                      >
                        Manage & Ship <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
