import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, ArrowRight, Eye, Phone, Mail, MapPin, IndianRupee, ShoppingBag, Crown } from 'lucide-react';
import { customerService } from '../../services/customerService';

export const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setCustomers(customerService.getAllCustomers());
  }, []);

  const totalSpentAll = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const totalOrdersAll = customers.reduce((sum, c) => sum + (c.ordersCount || 0), 0);
  const avgLtv = customers.length ? Math.round(totalSpentAll / customers.length) : 0;

  const customerKpis = [
    {
      label: 'REGISTERED CLIENTS',
      value: customers.length,
      context: 'High-intent bridal patrons',
      icon: <Users size={15} />,
      highlightColor: 'var(--text-espresso)',
    },
    {
      label: 'LIFETIME CLIENT SPEND',
      value: `₹${totalSpentAll.toLocaleString('en-IN')}`,
      context: 'Total cumulative revenue',
      icon: <IndianRupee size={15} />,
      highlightColor: '#2D8A4E',
    },
    {
      label: 'ORDERS COMPLETED',
      value: totalOrdersAll,
      context: 'Across all profiles',
      icon: <ShoppingBag size={15} />,
      highlightColor: 'var(--text-espresso)',
    },
    {
      label: 'AVERAGE CLIENT LTV',
      value: `₹${avgLtv.toLocaleString('en-IN')}`,
      context: 'Per patron account',
      icon: <Crown size={15} />,
      highlightColor: 'var(--primary)',
    },
  ];

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 style={{ fontSize: '24px', margin: '0 0 4px' }}>Client Directory & Profiles</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Review registered boutique clients, purchase frequency, lifetime value, and loyalty tiers
          </p>
        </div>

        <span className="badge badge-sand" style={{ fontSize: '12px', padding: '6px 14px' }}>
          {customers.length} Registered Patrons
        </span>
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
        {customerKpis.map((kpi, idx) => (
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

      {/* Search Toolbar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ position: 'relative', maxWidth: '400px', width: '100%' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by patron name, email, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingRight: '36px', fontSize: '13px' }}
          />
          <Search size={16} style={{ position: 'absolute', right: '12px', top: '13px', color: 'var(--text-light)' }} />
        </div>
      </div>

      {/* Table Card */}
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
                <th style={{ padding: '12px 16px' }}>Client Name</th>
                <th style={{ padding: '12px 16px' }}>Email</th>
                <th style={{ padding: '12px 16px' }}>Phone</th>
                <th style={{ padding: '12px 16px' }}>Location</th>
                <th style={{ padding: '12px 16px' }}>Orders Placed</th>
                <th style={{ padding: '12px 16px' }}>Total Spent</th>
                <th style={{ padding: '12px 16px' }}>Patron Since</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr key={client.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--surface-alt)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          color: 'var(--primary)',
                          fontFamily: 'var(--font-serif)',
                        }}
                      >
                        {client.name.charAt(0)}
                      </div>
                      <Link
                        to={`/admin/customers/${client.id}`}
                        style={{ fontWeight: 600, color: 'var(--text-espresso)' }}
                      >
                        {client.name}
                      </Link>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                    {client.email}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                    {client.phone}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {client.city}, {client.state}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                    {client.ordersCount}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)' }}>
                    ₹{client.totalSpent.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-light)' }}>
                    {new Date(client.joinedDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <Link
                      to={`/admin/customers/${client.id}`}
                      className="btn btn-sand btn-sm"
                      style={{ padding: '5px 12px', fontSize: '11px' }}
                    >
                      View Profile <ArrowRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
