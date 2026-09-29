import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck } from 'lucide-react';
import { enquiryService } from '../../services/enquiryService';
import { useApp } from '../../context/AppContext';

export const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      enquiryService.submitEnquiry({ name, email, phone, message });
      setIsSubmitting(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      showToast('Thank you. Your enquiry has been received.', 'success');
    }, 600);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '85vh', padding: '50px 0 100px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          <Link to="/" style={{ textDecoration: 'underline' }}>Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Atelier Concierge</span>
        </div>

        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px' }}>
          <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
            RESERVE & INQUIRE
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', letterSpacing: '0.04em', margin: '6px 0 12px' }}>Customer Concierge</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
            Schedule a private appointment at our Bengaluru boutique or inquire about custom handloom weaving.
          </p>
        </div>

        {/* 2-Column Split: Info + Contact Form */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1.5fr',
            gap: '36px',
          }}
          className="contact-split"
        >
          {/* Left: Atelier Info Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <div>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--primary)', fontWeight: 700 }}>
                FLAGSHIP BOUTIQUE
              </span>
              <h3 style={{ fontSize: '20px', margin: '4px 0 16px' }}>Maison D’Or Atelier</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Flagship Address</strong>
                    <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                      Plot 14, Heritage Arcade, Lavelle Road, Bengaluru, Karnataka - 560001
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Phone size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Direct Telephones</strong>
                    <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                      +91 80 4123 7890 / +91 98765 43210
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Mail size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Email Concierge</strong>
                    <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                      concierge@maisondorboutique.demo
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Clock size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Visiting Hours</strong>
                    <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                      Mon – Sat: 10:30 AM – 8:00 PM<br />
                      Sunday: 11:00 AM – 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div
              style={{
                width: '100%',
                height: '140px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--surface-sand)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: 'var(--text-muted)',
                textAlign: 'center',
                padding: '16px',
              }}
            >
              <div>
                <MapPin size={24} color="var(--accent-gold)" style={{ margin: '0 auto 6px' }} />
                <span>Interactive Atelier Map (Bengaluru Central)</span>
              </div>
            </div>
          </div>

          {/* Right: Interactive Inquiry Form */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '36px',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', margin: '0 0 6px' }}>Send Us an Atelier Message</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Our personal styling team responds to bridal queries and custom sizing within 24 hours.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">YOUR FULL NAME *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Radhika Menon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row">
                <div className="form-group">
                  <label className="form-label">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">PHONE NUMBER</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 98765 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">HOW CAN OUR CONCIERGE ASSIST YOU? *</label>
                <textarea
                  required
                  rows={4}
                  className="form-textarea"
                  placeholder="Please describe the occasion, specific saree weave, blouse measurement assistance, or store visit timing..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={isSubmitting}
                style={{ marginTop: '12px' }}
              >
                <Send size={16} /> {isSubmitting ? 'Submitting Inquiry...' : 'SEND MESSAGE TO CONCIERGE'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .contact-split {
            grid-template-columns: 1fr !important;
          }
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
