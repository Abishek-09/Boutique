import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Star, Sparkles } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { orderService } from '../../services/orderService';
import { useApp } from '../../context/AppContext';
import { useScrollLock } from '../../hooks/useScrollLock';

export const ReviewModal = ({ order, product, onClose, onSuccess }) => {
  useScrollLock(true);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) {
      showToast('Please provide a review title and comment', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // 1. Submit review to reviewService (pending state for admin moderation)
      reviewService.submitReview({
        productId: product.productId || product.id,
        productName: product.name,
        customerName: order.customer.name,
        rating,
        title,
        comment,
      });

      // 2. Mark order as reviewed
      orderService.markReviewSubmitted(order.id);

      setIsSubmitting(false);
      showToast('Review submitted for admin approval.', 'success');
      onSuccess?.();
      onClose();
    }, 600);
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '520px', padding: '32px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-gold)', fontWeight: 600 }}>
              VERIFIED PATRON FEEDBACK
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', margin: '4px 0 0' }}>Write an Atelier Review</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-espresso)', opacity: 0.7 }} aria-label="Close review modal">
            <X size={20} />
          </button>
        </div>

        {/* Product Reference */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            padding: '12px',
            backgroundColor: 'var(--surface-alt)',
            borderRadius: 'var(--radius-xs)',
            marginBottom: '24px',
          }}
        >
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '44px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
            />
          )}
          <div>
            <h4 style={{ fontSize: '13px', margin: 0 }}>{product.name}</h4>
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
              Order: {order.orderNumber} • Delivered
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Star Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ marginBottom: '8px' }}>RATING</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{ padding: '4px', cursor: 'pointer' }}
                >
                  <Star
                    size={26}
                    fill={(hoverRating || rating) >= star ? 'var(--primary)' : 'none'}
                    stroke="var(--primary)"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">REVIEW HEADLINE</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Heirloom quality drape, magnificent zari luster!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Comment */}
          <div className="form-group">
            <label className="form-label">YOUR EXPERIENCE & CRAFT APPRECIATION</label>
            <textarea
              required
              rows={4}
              className="form-textarea"
              placeholder="Share details about the fabric feel, occasion worn, fit, and packaging..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div style={{ padding: '10px 14px', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-xs)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            ℹ️ To maintain editorial excellence, patron reviews are moderated by boutique curation staff before appearing publicly on the product showcase.
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting Review...' : 'SUBMIT REVIEW FOR APPROVAL'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
