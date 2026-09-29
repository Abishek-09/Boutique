import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle, XCircle, Clock, Eye, AlertCircle } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { useApp } from '../../context/AppContext';

export const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const { showToast } = useApp();

  const loadReviews = () => {
    setReviews(reviewService.getAllReviews());
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleApprove = (id, productName) => {
    reviewService.approveReview(id);
    loadReviews();
    showToast(`Review for "${productName}" approved! Now visible on product showcase.`, 'success');
  };

  const handleReject = (id, productName) => {
    reviewService.rejectReview(id);
    loadReviews();
    showToast(`Review for "${productName}" rejected.`, 'info');
  };

  const filtered = reviews.filter((r) => r.status === activeTab);

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const approvedCount = reviews.filter((r) => r.status === 'approved').length;
  const rejectedCount = reviews.filter((r) => r.status === 'rejected').length;

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
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', letterSpacing: '0.04em', margin: '0 0 4px' }}>Patron Reviews Moderation</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Moderate verified customer testimonials before publishing onto luxury product pages
          </p>
        </div>

        {pendingCount > 0 && (
          <span className="badge badge-warning" style={{ fontSize: '12px', padding: '6px 14px' }}>
            <Clock size={14} /> {pendingCount} Pending Moderation
          </span>
        )}
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          padding: '16px 24px',
          display: 'flex',
          gap: '12px',
        }}
      >
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-full)',
            fontSize: '13px',
            fontWeight: activeTab === 'pending' ? 700 : 500,
            backgroundColor: activeTab === 'pending' ? 'var(--text-espresso)' : 'var(--surface-alt)',
            color: activeTab === 'pending' ? '#FFFFFF' : 'var(--text-espresso)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
          }}
        >
          Pending Moderation ({pendingCount})
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-full)',
            fontSize: '13px',
            fontWeight: activeTab === 'approved' ? 700 : 500,
            backgroundColor: activeTab === 'approved' ? 'var(--text-espresso)' : 'var(--surface-alt)',
            color: activeTab === 'approved' ? '#FFFFFF' : 'var(--text-espresso)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
          }}
        >
          Approved & Published ({approvedCount})
        </button>

        <button
          onClick={() => setActiveTab('rejected')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-full)',
            fontSize: '13px',
            fontWeight: activeTab === 'rejected' ? 700 : 500,
            backgroundColor: activeTab === 'rejected' ? 'var(--text-espresso)' : 'var(--surface-alt)',
            color: activeTab === 'rejected' ? '#FFFFFF' : 'var(--text-espresso)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
          }}
        >
          Rejected ({rejectedCount})
        </button>
      </div>

      {/* Review Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '60px 20px',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <p style={{ fontSize: '15px' }}>No reviews currently in "{activeTab}" status.</p>
          </div>
        ) : (
          filtered.map((rev) => (
            <div
              key={rev.id}
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
                  <span style={{ fontSize: '12px', color: 'var(--text-light)', display: 'block', marginBottom: '2px' }}>
                    Product Piece:
                  </span>
                  <Link
                    to={`/product/${rev.productId}`}
                    target="_blank"
                    style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    {rev.productName} <Eye size={14} />
                  </Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{rev.date}</span>
                  <span
                    className="badge"
                    style={{
                      backgroundColor:
                        rev.status === 'approved'
                          ? 'var(--success-bg)'
                          : rev.status === 'pending'
                          ? 'var(--warning-bg)'
                          : 'var(--danger-bg)',
                      color:
                        rev.status === 'approved'
                          ? 'var(--success)'
                          : rev.status === 'pending'
                          ? 'var(--warning)'
                          : 'var(--danger)',
                    }}
                  >
                    {rev.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Patron & Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{rev.customerName}</span>
                <span style={{ color: 'var(--border-strong)' }}>•</span>
                <div style={{ display: 'flex', color: 'var(--primary)' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < rev.rating ? 'var(--primary)' : 'none'}
                      stroke="var(--primary)"
                    />
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div style={{ backgroundColor: 'var(--surface-alt)', padding: '16px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: '14px', margin: '0 0 6px', color: 'var(--text-espresso)' }}>
                  "{rev.title}"
                </h4>
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-muted)', margin: 0 }}>
                  {rev.comment}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
                {rev.status !== 'approved' && (
                  <button
                    onClick={() => handleApprove(rev.id, rev.productName)}
                    className="btn btn-sm btn-approve-review"
                  >
                    <CheckCircle size={14} /> APPROVE & PUBLISH TO PRODUCT
                  </button>
                )}

                {rev.status !== 'rejected' && (
                  <button
                    onClick={() => handleReject(rev.id, rev.productName)}
                    className="btn btn-outline btn-sm"
                    style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                  >
                    <XCircle size={14} /> REJECT REVIEW
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
