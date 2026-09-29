import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { ProductCard } from '../../components/product/ProductCard';
import { CATEGORIES } from '../../data/categories';
import { productService } from '../../services/productService';
import { cmsService } from '../../services/cmsService';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [cms, setCms] = useState(() => cmsService.getHomepageContent());
  const navigate = useNavigate();

  useEffect(() => {
    setFeaturedProducts(productService.getFeaturedProducts().slice(0, 8));
    setNewArrivals(productService.getNewArrivals().slice(0, 4));
    setCms(cmsService.getHomepageContent());
  }, []);

  const hero = cms?.hero;
  const promo = cms?.promoBanner;
  const story = cms?.brandStory;
  const testimonials = cms?.testimonials || [];
  const socialGallery = cms?.socialGallery || [];
  const storeInfo = cms?.storeInfo;

  return (
    <div className="homepage">
      {/* 1. Hero Section - Editorial Haute Luxury */}
      <section
        style={{
          position: 'relative',
          minHeight: '88vh',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--text-espresso)',
          overflow: 'hidden',
        }}
      >
        {/* Background Image with Radial Vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 65% 35%, rgba(197, 160, 89, 0.12) 0%, rgba(28, 25, 23, 0.4) 40%, rgba(28, 25, 23, 0.88) 85%), linear-gradient(to right, rgba(28, 25, 23, 0.94) 0%, rgba(88, 17, 26, 0.65) 45%, rgba(28, 25, 23, 0.35) 100%), url(${hero?.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 25%',
          }}
        />

        <div className="container hero-container" style={{ position: 'relative', zIndex: 2, padding: '90px 20px' }}>
          <div style={{ maxWidth: '660px', color: '#FFFFFF' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'var(--accent-gold)',
                marginBottom: '20px',
                fontWeight: 600,
                borderBottom: '1px solid rgba(197, 160, 89, 0.35)',
                paddingBottom: '4px',
              }}
            >
              <Sparkles size={13} strokeWidth={1.4} />
              <span>AUTUMN / WINTER ATELIER RELEASE</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(40px, 6vw, 70px)',
                lineHeight: 1.1,
                color: '#FFFFFF',
                marginBottom: '24px',
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                letterSpacing: '-0.01em',
              }}
            >
              {hero?.title || 'Elegance in Every Detail'}
            </h1>

            <p
              style={{
                fontSize: '17px',
                color: 'rgba(251, 249, 245, 0.88)',
                lineHeight: 1.7,
                marginBottom: '40px',
                fontWeight: 300,
                maxWidth: '560px',
              }}
            >
              {hero?.subtitle || 'Discover our latest boutique collection of handwoven heritage sarees, contemporary tunics, and artisanal adornments.'}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <Link to={hero?.primaryBtnLink || '/shop'} className="btn btn-primary btn-lg">
                <span>{hero?.primaryBtnText || 'EXPLORE COLLECTION'}</span>
                <ArrowRight size={15} strokeWidth={1.4} />
              </Link>
              <Link
                to={hero?.secondaryBtnLink || '/new-arrivals'}
                className="btn btn-lg"
                style={{
                  backgroundColor: 'rgba(28, 25, 23, 0.45)',
                  backdropFilter: 'blur(10px)',
                  color: 'var(--bg-base)',
                  border: '1px solid rgba(197, 160, 89, 0.55)',
                  transition: 'var(--transition-smooth)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-gold)';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.borderColor = 'var(--accent-gold)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(197, 160, 89, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(28, 25, 23, 0.45)';
                  e.currentTarget.style.color = 'var(--bg-base)';
                  e.currentTarget.style.borderColor = 'rgba(197, 160, 89, 0.55)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {hero?.secondaryBtnText || 'THE NEW ARRIVALS'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '24px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
              textAlign: 'center',
            }}
            className="trust-grid"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <Sparkles size={20} color="var(--primary)" />
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: 'var(--text-espresso)' }}>Handloom Certified</p>
                <p style={{ margin: 0, fontSize: '12px' }}>100% Authentic Silk & Linen</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <Truck size={20} color="var(--primary)" />
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: 'var(--text-espresso)' }}>Express Delivery</p>
                <p style={{ margin: 0, fontSize: '12px' }}>Complimentary above ₹1,999</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <ShieldCheck size={20} color="var(--primary)" />
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: 'var(--text-espresso)' }}>Bespoke Finishing</p>
                <p style={{ margin: 0, fontSize: '12px' }}>Custom blouse stitching</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <RefreshCw size={20} color="var(--primary)" />
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: 'var(--text-espresso)' }}>Hassle-Free Returns</p>
                <p style={{ margin: 0, fontSize: '12px' }}>7-day exchange window</p>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .hero-container {
              padding: 48px 16px !important;
            }
          }
          @media (max-width: 900px) {
            .trust-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
          }
          @media (max-width: 500px) {
            .trust-grid { grid-template-columns: 1fr !important; text-align: left !important; }
          }
        `}</style>
      </section>

      {/* 2. Featured Categories */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-base)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
              Curated Ateliers
            </span>
            <h2 style={{ fontSize: '38px', marginTop: '8px', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>
              Shop by Category
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
              Explore heritage weaves, artisanal dresses, tailored kurtis, and timeless adornments.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '16px',
            }}
            className="category-grid"
          >
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  transition: 'var(--transition-smooth)',
                  position: 'relative',
                }}
                className="category-card"
              >
                <div style={{ width: '100%', height: '230px', overflow: 'hidden' }}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </div>
                <div style={{ padding: '16px', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                  <h3 style={{ fontSize: '15px', margin: 0, color: 'var(--text-espresso)', fontFamily: 'var(--font-serif)', fontWeight: 600 }}>
                    {cat.name}
                  </h3>
                  <span style={{ fontSize: '10.5px', color: 'var(--accent-gold)', marginTop: '4px', display: 'block', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                    View Atelier &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <style>{`
            .category-card:hover {
              transform: translateY(-4px);
              box-shadow: 0 12px 28px rgba(28, 25, 23, 0.08);
              border-color: var(--accent-gold);
            }
            .category-card:hover img {
              transform: scale(1.05);
            }
            @media (max-width: 1024px) {
              .category-grid { grid-template-columns: repeat(3, 1fr) !important; }
            }
            @media (max-width: 640px) {
              .category-grid { grid-template-columns: repeat(2, 1fr) !important; }
            }
          `}</style>
        </div>
      </section>

      {/* 3. Featured Products */}
      <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
                Signature Creations
              </span>
              <h2 style={{ fontSize: '38px', marginTop: '8px', fontFamily: 'var(--font-display)' }}>
                Featured Masterpieces
              </h2>
            </div>
            <Link to="/shop" className="btn btn-outline btn-sm">
              <span>EXPLORE ALL PIECES</span> <ArrowRight size={13} strokeWidth={1.4} />
            </Link>
          </div>

          <div className="grid-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Promotional Campaign Banner */}
      {promo && (
        <section
          style={{
            position: 'relative',
            backgroundColor: 'var(--text-espresso)',
            padding: '95px 0',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(to right, rgba(28, 25, 23, 0.94) 0%, rgba(88, 17, 26, 0.72) 50%, rgba(28, 25, 23, 0.4) 100%), url(${promo.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ maxWidth: '580px', color: '#FFFFFF' }}>
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(88, 17, 26, 0.85)',
                  border: '1px solid rgba(197, 160, 89, 0.45)',
                  color: 'var(--accent-gold)',
                  padding: '5px 14px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginBottom: '18px',
                }}
              >
                {promo.badge || 'Limited Festive Release'}
              </span>

              <h2
                style={{
                  fontSize: 'clamp(34px, 4.5vw, 52px)',
                  color: '#FFFFFF',
                  marginBottom: '18px',
                  lineHeight: 1.15,
                  fontFamily: 'var(--font-display)',
                }}
              >
                {promo.title}
              </h2>

              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(251, 249, 245, 0.88)',
                  lineHeight: 1.7,
                  marginBottom: '34px',
                  fontWeight: 300,
                }}
              >
                {promo.subtitle}
              </p>

              <Link to={promo.buttonLink || '/collections/festive'} className="btn btn-primary btn-lg">
                <span>{promo.buttonText || 'EXPLORE COLLECTION'}</span> <ArrowRight size={15} strokeWidth={1.4} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 5. New Arrivals Showcase */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-base)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
                Just Arrived at Atelier
              </span>
              <h2 style={{ fontSize: '38px', marginTop: '8px', fontFamily: 'var(--font-display)' }}>
                New Arrivals
              </h2>
            </div>
            <Link to="/new-arrivals" className="btn btn-outline btn-sm">
              <span>VIEW ALL NEW ARRIVALS</span> <ArrowRight size={13} strokeWidth={1.4} />
            </Link>
          </div>

          <div className="grid-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Brand Story Section */}
      {story && (
        <section style={{ padding: '95px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.1fr 1fr',
                gap: '64px',
                alignItems: 'center',
              }}
              className="brand-story-grid"
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={story.image}
                  alt="Atelier Craftsmanship"
                  style={{
                    width: '100%',
                    height: '500px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-xs)',
                    boxShadow: '0 16px 36px rgba(28, 25, 23, 0.1)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-20px',
                    right: '-20px',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--accent-gold)',
                    padding: '24px',
                    borderRadius: 'var(--radius-xs)',
                    maxWidth: '220px',
                    boxShadow: '0 12px 32px rgba(28, 25, 23, 0.12)',
                  }}
                  className="story-badge"
                >
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--primary)', fontWeight: 700, display: 'block' }}>
                    100%
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-espresso)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    Authentic Handloom Weaving
                  </span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
                  {story.eyebrow || 'Our Heritage Philosophy'}
                </span>
                <h2 style={{ fontSize: '40px', margin: '10px 0 22px', lineHeight: 1.2, fontFamily: 'var(--font-display)' }}>
                  {story.title}
                </h2>
                <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: '32px', fontWeight: 300 }}>
                  {story.description}
                </p>
                <Link to={story.buttonLink || '/about'} className="btn btn-outline">
                  <span>{story.buttonText || 'READ OUR STORY'}</span> <ArrowRight size={14} strokeWidth={1.4} />
                </Link>
              </div>
            </div>

            <style>{`
              @media (max-width: 900px) {
                .brand-story-grid {
                  grid-template-columns: 1fr !important;
                  gap: 40px !important;
                }
                .story-badge {
                  display: none;
                }
              }
            `}</style>
          </div>
        </section>
      )}

      {/* 7. Patron Testimonials */}
      <section style={{ padding: '85px 0', backgroundColor: 'var(--surface-alt)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
              Client Reflections
            </span>
            <h2 style={{ fontSize: '38px', marginTop: '8px', fontFamily: 'var(--font-display)' }}>
              Words from Our Patrons
            </h2>
          </div>

          <div className="grid-3">
            {testimonials.map((t) => (
              <div key={t.id} className="patron-review-card">
                <div className="patron-stars" style={{ display: 'flex', color: 'var(--accent-gold)', marginBottom: '16px' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="var(--accent-gold)" stroke="var(--accent-gold)" />
                  ))}
                </div>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-espresso)', fontStyle: 'italic', marginBottom: '20px', flex: 1 }}>
                  "{t.quote}"
                </p>
                <div>
                  <h4 style={{ fontSize: '15px', margin: 0, color: 'var(--text-espresso)' }}>{t.author}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>{t.location} • Verified Buyer</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Instagram Social Gallery */}
      <section style={{ padding: '70px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
              Follow The Journey
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginTop: '4px' }}>
              @maisondor_boutique
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '12px',
            }}
            className="insta-grid"
          >
            {socialGallery.map((item) => (
              <div
                key={item.id}
                style={{
                  width: '100%',
                  paddingTop: '100%',
                  position: 'relative',
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  backgroundColor: 'var(--surface-sand)',
                }}
              >
                <img
                  src={item.image}
                  alt="Instagram gallery"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </div>
            ))}
          </div>

          <style>{`
            @media (max-width: 900px) {
              .insta-grid { grid-template-columns: repeat(3, 1fr) !important; }
            }
            @media (max-width: 480px) {
              .insta-grid { grid-template-columns: repeat(2, 1fr) !important; }
            }
          `}</style>
        </div>
      </section>

      {/* 9. Store Information Banner */}
      {storeInfo && (
        <section style={{ padding: '50px 0', backgroundColor: 'var(--bg-base)', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '24px',
                backgroundColor: '#FFFFFF',
                padding: '32px 40px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--primary)', fontWeight: 600 }}>
                  Private Atelier Visits
                </span>
                <h3 style={{ fontSize: '24px', margin: '4px 0 8px' }}>
                  Visit Our Bengaluru Flagship Store
                </h3>
                <p style={{ fontSize: '14px', margin: 0, maxWidth: '520px' }}>
                  {storeInfo.address} • {storeInfo.hours}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Link to="/contact" className="btn btn-primary btn-sm">
                  SCHEDULE PRIVATE VISIT
                </Link>
                <a href={`tel:${storeInfo.phone}`} className="btn btn-outline btn-sm">
                  CALL CONCIERGE
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
