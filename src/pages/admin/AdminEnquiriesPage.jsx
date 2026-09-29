import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, Clock, Mail, Phone } from 'lucide-react';
import { enquiryService } from '../../services/enquiryService';
import { useApp } from '../../context/AppContext';

export const AdminEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const { showToast } = useApp();

  const loadEnquiries = () => {
    setEnquiries(enquiryService.getAllEnquiries());
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleStatusChange = (id, newStatus, name) => {
    enquiryService.updateStatus(id, newStatus);
    loadEnquiries();
    showToast(`Updated enquiry status for ${name} to ${newStatus}`, 'info');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved': return 'badge-success';
      case 'Contacted': return 'badge-warning';
      default: return 'badge-sale';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', letterSpacing: '0.04em', margin: '0 0 4px' }}>Customer Concierge Enquiries</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Inquiries received from customer Contact page for bridal visits, custom sizing, and boutique care
          </p>
        </div>

        <span className="badge badge-sand" style={{ fontSize: '12px', padding: '6px 14px' }}>
          Total Inquiries: {enquiries.length}
        </span>
      </div>

      {/* Enquiries List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {enquiries.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '16px', margin: '0 0 4px' }}>{item.name}</h3>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span><Mail size={12} style={{ display: 'inline', marginRight: '4px' }} />{item.email}</span>
                  <span><Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />{item.phone}</span>
                  <span><Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />{item.date}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className={`badge ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>

                <select
                  value={item.status}
                  onChange={(e) => handleStatusChange(item.id, e.target.value, item.name)}
                  className="form-select"
                  style={{ width: 'auto', padding: '4px 8px', fontSize: '12px' }}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--surface-alt)', padding: '16px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border)', fontSize: '13px', lineHeight: 1.6, color: 'var(--text-espresso)' }}>
              "{item.message}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
