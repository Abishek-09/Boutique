import React, { useState, useEffect } from 'react';
import { Tag, Plus, ToggleLeft, ToggleRight, Trash2, CheckCircle2, Percent, ShoppingBag, Sparkles, IndianRupee } from 'lucide-react';
import { couponService } from '../../services/couponService';
import { useApp } from '../../context/AppContext';

export const AdminOffersPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const { showToast } = useApp();

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage',
    value: 10,
    minOrder: 999,
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    status: 'active',
  });

  const loadCoupons = () => {
    setCoupons(couponService.getAllCoupons());
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const activeCount = coupons.filter((c) => c.status === 'active').length;
  const percentageOffers = coupons.filter((c) => c.type === 'percentage').map((c) => c.value);
  const maxSavings = percentageOffers.length ? Math.max(...percentageOffers) : 20;
  const avgMinOrder = coupons.length
    ? Math.round(coupons.reduce((sum, c) => sum + (c.minOrder || 0), 0) / coupons.length)
    : 999;

  const offerKpis = [
    {
      label: 'ACTIVE VOUCHERS',
      value: activeCount,
      context: 'Live in customer cart checkout',
      icon: <Tag size={15} />,
      highlightColor: '#2D8A4E',
    },
    {
      label: 'MAX SAVINGS',
      value: `${maxSavings}% OFF`,
      context: 'Festive campaign codes',
      icon: <Percent size={15} />,
      highlightColor: 'var(--primary)',
    },
    {
      label: 'AVG QUALIFYING CART',
      value: `₹${avgMinOrder.toLocaleString('en-IN')}`,
      context: 'Min spend for discount',
      icon: <ShoppingBag size={15} />,
      highlightColor: 'var(--text-espresso)',
    },
    {
      label: 'TOTAL CAMPAIGNS',
      value: coupons.length,
      context: 'Valid through 2026 atelier season',
      icon: <Sparkles size={15} />,
      highlightColor: 'var(--accent-gold)',
    },
  ];

  const handleToggleStatus = (id, code) => {
    couponService.toggleCouponStatus(id);
    loadCoupons();
    showToast(`Toggled status for coupon ${code}`, 'info');
  };

  const handleDelete = (id, code) => {
    if (window.confirm(`Delete coupon ${code}?`)) {
      couponService.deleteCoupon(id);
      loadCoupons();
      showToast(`Coupon ${code} deleted`, 'info');
    }
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) {
      showToast('Coupon code is required', 'error');
      return;
    }

    couponService.createCoupon(newCoupon);
    setShowAddForm(false);
    setNewCoupon({
      code: '',
      type: 'percentage',
      value: 10,
      minOrder: 999,
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      status: 'active',
    });
    loadCoupons();
    showToast(`Created coupon ${newCoupon.code.toUpperCase()}! Available in customer cart.`, 'success');
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
          <h1 style={{ fontSize: '24px', margin: '0 0 4px' }}>Coupons & Promotional Vouchers</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Configure festive discount codes and percentage vouchers recognized by customer cart & checkout
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary btn-sm"
        >
          <Plus size={15} /> {showAddForm ? 'CANCEL' : 'CREATE NEW COUPON'}
        </button>
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
        {offerKpis.map((kpi, idx) => (
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

      {/* Add Coupon Accordion */}
      {showAddForm && (
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 16px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
            New Promotional Coupon
          </h3>

          <form onSubmit={handleCreateCoupon}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }} className="coupon-inputs">
              <div className="form-group">
                <label className="form-label">COUPON CODE (UPPERCASE) *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. LUXURY20"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">DISCOUNT TYPE</label>
                <select
                  className="form-select"
                  value={newCoupon.type}
                  onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                >
                  <option value="percentage">Percentage (%) Off</option>
                  <option value="flat">Flat Amount (₹) Off</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">DISCOUNT VALUE ({newCoupon.type === 'percentage' ? '%' : '₹'})</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={newCoupon.value}
                  onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }} className="coupon-inputs">
              <div className="form-group">
                <label className="form-label">MINIMUM ORDER AMOUNT (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={newCoupon.minOrder}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">START DATE</label>
                <input
                  type="date"
                  className="form-input"
                  value={newCoupon.startDate}
                  onChange={(e) => setNewCoupon({ ...newCoupon, startDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">EXPIRY DATE</label>
                <input
                  type="date"
                  className="form-input"
                  value={newCoupon.endDate}
                  onChange={(e) => setNewCoupon({ ...newCoupon, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">DESCRIPTION (SEEN BY CUSTOMER IN SUMMARY)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 20% seasonal discount on pure silk orders above ₹3,000"
                value={newCoupon.description}
                onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-ghost btn-sm">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                SAVE & ACTIVATE COUPON
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--surface-alt)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px 16px' }}>Code</th>
                <th style={{ padding: '12px 16px' }}>Discount Type</th>
                <th style={{ padding: '12px 16px' }}>Value</th>
                <th style={{ padding: '12px 16px' }}>Min Order Req</th>
                <th style={{ padding: '12px 16px' }}>Validity Window</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <strong style={{ fontSize: '14px', fontFamily: 'monospace', color: 'var(--primary)' }}>
                      {c.code}
                    </strong>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>
                      {c.description}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textTransform: 'capitalize' }}>
                    {c.type}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                    {c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    ₹{c.minOrder?.toLocaleString('en-IN') || 0}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {c.startDate} to {c.endDate}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: c.status === 'active' ? 'var(--success-bg)' : 'var(--surface-alt)',
                        color: c.status === 'active' ? 'var(--success)' : 'var(--text-muted)',
                      }}
                    >
                      {c.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => handleToggleStatus(c.id, c.code)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: c.status === 'active' ? 'var(--success)' : 'var(--text-light)',
                          padding: '4px',
                        }}
                        title="Toggle Status"
                      >
                        {c.status === 'active' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.code)}
                        style={{ color: 'var(--danger)', padding: '4px' }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .coupon-inputs {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
