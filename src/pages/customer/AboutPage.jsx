import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '85vh', padding: '50px 0 100px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Header Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          <Link to="/" style={{ textDecoration: 'underline' }}>Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>The Brand Story</span>
        </div>

        {/* Hero Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: '50px 40px',
            marginBottom: '40px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
            OUR ATELIER HERITAGE
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4.5vw, 48px)', letterSpacing: '0.04em', margin: '8px 0 16px' }}>
            Weaving Poetry into Pure Silk
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', maxWidth: '720px', margin: '0 auto', lineHeight: 1.8 }}>
            Maison D'Or was established with a singular devotion: to preserve and elevate India’s royal handloom traditions into timeless contemporary heirlooms for discerning modern women across the globe.
          </p>
        </div>

        {/* Story Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: '40px',
            marginBottom: '40px',
            alignItems: 'center',
          }}
          className="about-split"
        >
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&auto=format&fit=crop&q=80"
            alt="Handloom Weaving"
            style={{ width: '100%', height: '380px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
          />
          <div>
            <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
              OUR PHILOSOPHY & ROOTS
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: '6px 0 16px' }}>Slow Handloom, Enduring Grace</h2>
            <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: '14px' }}>
              In an age of rapid mechanical replication, we honor patience. A single Banarasi Katan silk saree or hand-block modal kurti takes anywhere from three weeks to four months of master weaver devotion on wooden pit looms.
            </p>
            <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-muted)' }}>
              We partner directly with traditional weaver cooperatives in Varanasi, Chanderi, Kanchipuram, and Jaipur, ensuring fair remuneration, dignity of heritage craft, and complete yarn traceability.
            </p>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginBottom: '40px',
          }}
          className="pillars-grid"
        >
          <div className="about-pillar-card">
            <div className="pillar-accent-line" />
            <div className="pillar-icon-box">
              <Sparkles size={24} color="var(--primary)" />
            </div>
            <h3 className="pillar-title">Silk Mark Certified</h3>
            <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--text-muted)', margin: 0 }}>
              Every thread of silk is rigorously certified for 100% natural mulberry purity with authentic gold-tested zari brocade.
            </p>
          </div>

          <div className="about-pillar-card">
            <div className="pillar-accent-line" />
            <div className="pillar-icon-box">
              <Heart size={24} color="var(--primary)" />
            </div>
            <h3 className="pillar-title">Artisan Welfare</h3>
            <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--text-muted)', margin: 0 }}>
              Over 65% of garment proceeds directly sustain weaver families, healthcare initiatives, and loom restoration projects.
            </p>
          </div>

          <div className="about-pillar-card">
            <div className="pillar-accent-line" />
            <div className="pillar-icon-box">
              <Award size={24} color="var(--primary)" />
            </div>
            <h3 className="pillar-title">Bespoke Fit Service</h3>
            <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--text-muted)', margin: 0 }}>
              Our Bengaluru atelier provides custom blouse stitching, fall/pico finish, and personal bridal consultation.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            backgroundColor: 'var(--text-espresso)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '48px 40px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '28px', color: '#FFFFFF', margin: '0 0 12px' }}>
            Experience the Atelier Collection
          </h2>
          <p style={{ color: 'var(--accent-sand)', fontSize: '15px', maxWidth: '500px', margin: '0 auto 28px' }}>
            Step into our catalog and find the next heirloom piece for your family wardrobe.
          </p>
          <Link to="/shop" className="btn btn-primary btn-lg">
            SHOP THE HEIRLOOM COLLECTION <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <style>{`
        .about-pillar-card {
          background-color: #FFFFFF;
          padding: 34px 26px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          position: relative;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 8px rgba(74, 65, 60, 0.04);
          cursor: pointer;
        }
        .pillar-accent-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--accent-sand), var(--primary));
          opacity: 0;
          transform: scaleX(0);
          transform-origin: left;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pillar-icon-box {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background-color: var(--surface-alt);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(197, 160, 89, 0.25);
        }
        .pillar-title {
          font-size: 19px;
          margin: 0 0 10px;
          color: var(--text-espresso);
          transition: color 0.3s ease;
        }
        .about-pillar-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 18px 36px rgba(28, 25, 23, 0.08);
          border-color: var(--accent-gold);
        }
        .about-pillar-card:hover .pillar-accent-line {
          opacity: 1;
          transform: scaleX(1);
        }
        .about-pillar-card:hover .pillar-icon-box {
          transform: scale(1.12) rotate(6deg);
          background-color: #FFFFFF;
          box-shadow: 0 6px 16px rgba(88, 17, 26, 0.18);
          border-color: var(--accent-gold);
        }
        .about-pillar-card:hover .pillar-title {
          color: var(--primary);
        }
        @media (max-width: 800px) {
          .about-split {
            grid-template-columns: 1fr !important;
          }
          .pillars-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
