import React, { useState } from 'react';
import { Settings, Save, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminSettingsPage = () => {
  const { showToast } = useApp();

  const [settings, setSettings] = useState({
    boutiqueName: "Maison D'Or Heritage Atelier",
    tagline: 'Slow Luxury Handloom Sarees, Kurtis & Antique Adornments',
    currency: 'INR (₹)',
    gstNumber: '29AAACM1234F1Z8',
    phone: '+91 80 4123 7890',
    email: 'concierge@maisondorboutique.demo',
    flagshipAddress: 'Plot 14, Heritage Arcade, Lavelle Road, Bengaluru, Karnataka - 560001',
    visitingHours: 'Monday – Saturday: 10:30 AM – 8:00 PM',
    freeShippingThreshold: 1999,
    standardShippingFee: 150,
    instagram: '@maisondor_boutique',
    whatsapp: '+91 98765 43210',
  });

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Atelier settings updated successfully', 'success');
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
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
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', letterSpacing: '0.04em', margin: '0 0 4px' }}>Boutique Atelier Settings</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Operational store policies, shipping thresholds, tax GSTIN, and concierge contact profiles
          </p>
        </div>

        <button type="button" onClick={handleSave} className="btn btn-primary btn-sm">
          <Save size={14} /> SAVE ALL SETTINGS
        </button>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Section 1: Boutique Identity */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 16px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
            1. Boutique Identity & Legal Registration
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }} className="settings-grid">
            <div className="form-group">
              <label className="form-label">STORE NAME</label>
              <input
                type="text"
                className="form-input"
                value={settings.boutiqueName}
                onChange={(e) => setSettings({ ...settings, boutiqueName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">GSTIN / TAX IDENTIFICATION NUMBER</label>
              <input
                type="text"
                className="form-input"
                value={settings.gstNumber}
                onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">BRAND TAGLINE</label>
            <input
              type="text"
              className="form-input"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            />
          </div>
        </div>

        {/* Section 2: Contact & Flagship Address */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 16px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
            2. Concierge & Flagship Store
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="settings-grid">
            <div className="form-group">
              <label className="form-label">PRIMARY TELEPHONE</label>
              <input
                type="tel"
                className="form-input"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">CONCIERGE EMAIL</label>
              <input
                type="email"
                className="form-input"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">FLAGSHIP STORE PHYSICAL ADDRESS</label>
            <input
              type="text"
              className="form-input"
              value={settings.flagshipAddress}
              onChange={(e) => setSettings({ ...settings, flagshipAddress: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">VISITING & OPERATIONAL HOURS</label>
            <input
              type="text"
              className="form-input"
              value={settings.visitingHours}
              onChange={(e) => setSettings({ ...settings, visitingHours: e.target.value })}
            />
          </div>
        </div>

        {/* Section 3: Shipping Rules */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 16px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
            3. Shipping & Delivery Rules
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="settings-grid">
            <div className="form-group">
              <label className="form-label">FREE SHIPPING MINIMUM ORDER (₹)</label>
              <input
                type="number"
                className="form-input"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">STANDARD SHIPPING FEE (₹)</label>
              <input
                type="number"
                className="form-input"
                value={settings.standardShippingFee}
                onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Social Handles */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 16px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
            4. Social Channels
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="settings-grid">
            <div className="form-group">
              <label className="form-label">INSTAGRAM HANDLE</label>
              <input
                type="text"
                className="form-input"
                value={settings.instagram}
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">WHATSAPP CONCIERGE</label>
              <input
                type="tel"
                className="form-input"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="submit" className="btn btn-primary btn-lg">
            SAVE CONFIGURATION
          </button>
        </div>
      </form>

      <style>{`
        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
