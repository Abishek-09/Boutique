import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CustomerFooter = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useApp();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      showToast('Thank you for subscribing to our private atelier journal.', 'success');
      setEmail('');
    }
  };

  return (
    <footer style={{ backgroundColor: 'var(--text-espresso)', color: 'var(--bg-base)', paddingTop: '64px', paddingBottom: '32px' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr 1.3fr',
            gap: '40px',
            marginBottom: '48px',
          }}
          className="footer-grid"
        >
          {/* Column 1: Brand Atelier */}
          <div>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '24px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#FFFFFF',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              MAISON D'OR
            </span>
            <span
              style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.24em',
                color: 'var(--accent-sand)',
                display: 'block',
                marginBottom: '16px',
                fontWeight: 600,
              }}
            >
              HERITAGE ATELIER & BOUTIQUE
            </span>
            <p style={{ color: 'var(--accent-sand)', fontSize: '13px', lineHeight: 1.7, marginBottom: '20px' }}>
              Handcrafted Indian luxury celebrating ancestral weaving arts, pure silks, and refined slow fashion. Designed in Bengaluru, woven across heritage clusters.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={15} color="var(--accent-sand)" />
                <span>Lavelle Road, Bengaluru, Karnataka - 560001</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} color="var(--accent-sand)" />
                <span>+91 80 4123 7890</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} color="var(--accent-sand)" />
                <span>concierge@maisondorboutique.demo</span>
              </div>
            </div>
          </div>

          {/* Column 2: Collections & Shop */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '15px', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '20px' }}>
              Shop Categories
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <Link to="/shop?category=sarees" style={{ color: 'var(--accent-sand)' }}>Banarasi & Pure Silk Sarees</Link>
              <Link to="/shop?category=kurtis" style={{ color: 'var(--accent-sand)' }}>Chanderi & Handloom Kurtis</Link>
              <Link to="/shop?category=dresses" style={{ color: 'var(--accent-sand)' }}>Indo-Western & Maxi Dresses</Link>
              <Link to="/shop?category=jewellery" style={{ color: 'var(--accent-sand)' }}>Kundan & Temple Jewellery</Link>
              <Link to="/shop?category=accessories" style={{ color: 'var(--accent-sand)' }}>Zardozi Potlis & Shawls</Link>
              <Link to="/offers" style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>✦ Special Offers & Vouchers</Link>
              <Link to="/new-arrivals" style={{ color: '#FFFFFF', fontWeight: 600 }}>✦ View New Arrivals</Link>
            </div>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '15px', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '20px' }}>
              Boutique Care
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <Link to="/account/orders" style={{ color: 'var(--accent-sand)' }}>Track Your Order</Link>
              <Link to="/contact" style={{ color: 'var(--accent-sand)' }}>Customer Concierge</Link>
              <Link to="/about" style={{ color: 'var(--accent-sand)' }}>The Brand Story</Link>
              <Link to="/wishlist" style={{ color: 'var(--accent-sand)' }}>Saved Wishlist</Link>
              <Link to="/account" style={{ color: 'var(--accent-sand)' }}>My Account</Link>
              <Link to="/admin" style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>Staff Admin Portal (/admin)</Link>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '15px', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Private Atelier Journal
            </h4>
            <p style={{ color: 'var(--accent-sand)', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
              Receive exclusive invitations to private trunk shows and early previews of limited heirloom drops.
            </p>
            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="email"
                required
                className="form-input"
                placeholder="Your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'rgba(197, 160, 89, 0.4)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                }}
              />
              <button type="submit" className="btn btn-primary btn-sm btn-block">
                SUBSCRIBE TO ATELIER <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(197, 160, 89, 0.25)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '12px',
            color: 'var(--accent-sand)',
          }}
        >
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} Maison D'Or Atelier. All rights reserved. Handcrafted in India.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/about" style={{ color: 'var(--accent-sand)' }}>Philosophy</Link>
            <Link to="/contact" style={{ color: 'var(--accent-sand)' }}>Store Locator</Link>
            <Link to="/contact" style={{ color: 'var(--accent-sand)' }}>Complimentary Delivery & Returns</Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};
