import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const AdminLoginPage = () => {
  const { loginAdmin, logoutAdmin } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Whenever opening the admin page, require fresh login
  useEffect(() => {
    logoutAdmin();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const res = loginAdmin(email, password);
    if (res.success) {
      showToast('Welcome to Maison D’Or Atelier Management', 'success');
      navigate('/admin/dashboard');
    } else {
      setError(res.message);
    }
  };

  const handleAutoFill = () => {
    setEmail('admin@boutique.demo');
    setPassword('admin123');
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: 'var(--text-espresso)',
            color: '#FFFFFF',
            padding: '36px 32px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#FFFFFF',
              display: 'block',
            }}
          >
            MAISON D'OR
          </span>
          <span
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--accent-sand)',
              display: 'block',
              marginTop: '4px',
              fontWeight: 600,
            }}
          >
            ATELIER MANAGEMENT SYSTEM
          </span>
          <p style={{ fontSize: '13px', color: 'var(--accent-sand)', margin: '14px 0 0' }}>
            Restricted staff access for inventory, order fulfillment, and client concierge.
          </p>
        </div>

        {/* Demo Credentials Helper Box */}
        <div
          style={{
            margin: '24px 24px 0',
            padding: '14px 18px',
            backgroundColor: 'var(--surface-alt)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '12px' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
              <strong>Demo Credentials:</strong>
            </span>
            <span style={{ color: 'var(--text-espresso)', fontFamily: 'monospace' }}>
              admin@boutique.demo / admin123
            </span>
          </div>
          <button
            type="button"
            onClick={handleAutoFill}
            className="btn btn-sand btn-sm"
            style={{ fontSize: '11px', padding: '4px 10px' }}
          >
            <Sparkles size={12} color="var(--primary)" /> Autofill
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ padding: '24px' }}>
          {error && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: 'var(--danger-bg)',
                color: 'var(--danger)',
                borderRadius: 'var(--radius-xs)',
                fontSize: '12px',
                marginBottom: '16px',
              }}
            >
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">STAFF EMAIL ADDRESS</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="form-input"
                placeholder="admin@boutique.demo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail size={16} style={{ position: 'absolute', right: '12px', top: '14px', color: 'var(--text-light)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock size={16} style={{ position: 'absolute', right: '12px', top: '14px', color: 'var(--text-light)' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '20px' }}>
            ENTER ADMIN DASHBOARD <ArrowRight size={16} />
          </button>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/" style={{ fontSize: '13px', color: 'var(--accent-gold)', textDecoration: 'underline' }}>
              ← Return to Customer Storefront
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
