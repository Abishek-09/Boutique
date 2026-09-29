import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Truck, ShieldCheck, RefreshCw, ArrowRight, Check, Share2 } from 'lucide-react';
import { productService } from '../../services/productService';
import { reviewService } from '../../services/reviewService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/product/ProductCard';
import { ImageMagnifier } from '../../components/common/ImageMagnifier';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useApp();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const item = productService.getProductById(id) || productService.getProductBySlug(id);
    if (item) {
      setProduct(item);
      setSelectedImage(item.images?.[0] || '');
      setSelectedSize(item.sizes?.[0] || 'Free Size');
      setSelectedColor(item.colors?.[0] || 'Standard');
      setQuantity(1);

      // Load approved reviews
      setReviews(reviewService.getApprovedReviewsByProduct(item.id));

      // Load related products
      setRelatedProducts(productService.getRelatedProducts(item.id, item.category, 4));
    }
  }, [id]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <p style={{ margin: '12px 0 24px' }}>The handcrafted piece you are looking for may be archived or unavailable.</p>
        <Link to="/shop" className="btn btn-primary btn-sm">
          Return to Atelier Catalog
        </Link>
      </div>
    );
  }

  const inWish = isInWishlist(product.id);
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Product link copied to clipboard', 'info');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '28px' }}>
          <Link to="/" style={{ textDecoration: 'underline' }}>Home</Link>
          <span>/</span>
          <Link to="/shop" style={{ textDecoration: 'underline' }}>Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} style={{ textDecoration: 'underline', textTransform: 'capitalize' }}>
            {product.category}
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Main Product Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: '36px',
            marginBottom: '48px',
          }}
          className="product-detail-grid"
        >
          {/* Left: Image Gallery */}
          <div>
            <ImageMagnifier
              src={selectedImage}
              alt={product.name}
              images={product.images || []}
              hasDiscount={hasDiscount}
              discountPercent={discountPercent}
            />

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '6px', WebkitOverflowScrolling: 'touch' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: '76px',
                      height: '96px',
                      flexShrink: 0,
                      borderRadius: 'var(--radius-xs)',
                      overflow: 'hidden',
                      border: selectedImage === img ? '1.5px solid var(--accent-gold)' : '1px solid var(--border)',
                      padding: 0,
                      transition: 'border-color 0.2s ease',
                    }}
                  >
                    <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
                  {product.category} &bull; {product.collection?.replace('-', ' ')}
                </span>
                <span style={{ fontSize: '11.5px', color: 'var(--text-light)', marginLeft: '14px', letterSpacing: '0.04em' }}>
                  SKU: {product.sku}
                </span>
              </div>
              <button
                onClick={handleShare}
                style={{ padding: '6px', color: 'var(--text-muted)', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                title="Share product"
                aria-label="Share product"
              >
                <Share2 size={17} strokeWidth={1.3} />
              </button>
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '34px', lineHeight: 1.2, marginBottom: '16px', fontWeight: 600 }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', color: 'var(--accent-gold)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    fill={i < Math.floor(product.rating) ? 'var(--accent-gold)' : 'none'}
                    stroke="var(--accent-gold)"
                  />
                ))}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-espresso)' }}>{product.rating}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                ({reviews.length} customer review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>

            {/* Pricing */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '14px',
                padding: '18px 22px',
                backgroundColor: 'var(--surface-alt)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xs)',
                marginBottom: '22px',
              }}
            >
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '30px', fontWeight: 600, color: 'var(--text-espresso)', letterSpacing: '0.01em' }}>
                ₹{(product.salePrice || product.price).toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span style={{ fontSize: '17px', textDecoration: 'line-through', color: 'var(--text-light)', fontFamily: 'var(--font-serif)' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
              <span style={{ fontSize: '11.5px', color: 'var(--success)', fontWeight: 600, marginLeft: 'auto', letterSpacing: '0.04em' }}>
                Inclusive of 5% Handloom GST
              </span>
            </div>

            <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: 'var(--text-muted)', marginBottom: '24px', fontWeight: 300 }}>
              {product.description}
            </p>

            {/* Fabric Highlight Box */}
            <div
              style={{
                padding: '14px 18px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: '#FFFFFF',
                marginBottom: '24px',
                fontSize: '13px',
              }}
            >
              <span style={{ fontWeight: 600, color: 'var(--text-espresso)', letterSpacing: '0.04em' }}>Material & Craft: </span>
              <span style={{ color: 'var(--text-muted)' }}>{product.material}</span>
            </div>

            {/* Variant 1: Size */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label className="form-label" style={{ fontSize: '11px', margin: 0 }}>SELECT SIZE / DRAPE</label>
                  <button
                    onClick={() => setActiveTab('sizeGuide')}
                    style={{ fontSize: '12px', color: 'var(--accent-gold)', textDecoration: 'underline', fontWeight: 500 }}
                  >
                    Size Guide
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      style={{
                        padding: '8px 16px',
                        fontSize: '13px',
                        borderRadius: 'var(--radius-xs)',
                        border: selectedSize === sz ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                        backgroundColor: selectedSize === sz ? 'var(--primary-light)' : '#FFFFFF',
                        color: selectedSize === sz ? 'var(--primary)' : 'var(--text-espresso)',
                        fontWeight: selectedSize === sz ? 600 : 400,
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variant 2: Color */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontSize: '12px', marginBottom: '8px' }}>
                  COLOR SHADE: <strong style={{ color: 'var(--primary)' }}>{selectedColor}</strong>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.colors.map((clr) => (
                    <button
                      key={clr}
                      onClick={() => setSelectedColor(clr)}
                      style={{
                        padding: '6px 14px',
                        fontSize: '13px',
                        borderRadius: 'var(--radius-full)',
                        border: selectedColor === clr ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                        backgroundColor: selectedColor === clr ? 'var(--surface-sand)' : '#FFFFFF',
                        fontWeight: selectedColor === clr ? 600 : 400,
                      }}
                    >
                      {clr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock indicator */}
            <div style={{ marginBottom: '20px' }}>
              {product.stock > 0 ? (
                <span style={{ fontSize: '13px', color: product.stock <= 3 ? 'var(--warning)' : 'var(--success)', fontWeight: 600 }}>
                  ● {product.stock <= 3 ? `Limited boutique edition: Only ${product.stock} pieces left` : 'In Stock • Ready for dispatch within 24 hours'}
                </span>
              ) : (
                <span style={{ fontSize: '13px', color: 'var(--danger)', fontWeight: 600 }}>
                  ● Out of Stock (Contact concierge for bespoke reweaving)
                </span>
              )}
            </div>

            {/* Quantity Stepper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <span className="form-label" style={{ margin: 0, fontSize: '12px' }}>QUANTITY</span>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '8px 14px', color: 'var(--text-espresso)' }}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span style={{ fontSize: '14px', fontWeight: 600, padding: '0 12px' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 5, quantity + 1))}
                  style={{ padding: '8px 14px', color: 'var(--text-espresso)' }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs: ADD TO CART, BUY NOW, WISHLIST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1 }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingBag size={18} />
                  {product.stock === 0 ? 'CURRENTLY OUT OF STOCK' : 'ADD TO BAG'}
                </button>

                <button
                  type="button"
                  className="btn btn-sand"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  style={{ padding: '0 20px' }}
                  title="Wishlist toggle"
                  aria-label="Wishlist toggle"
                >
                  <Heart size={20} fill={inWish ? 'var(--primary)' : 'none'} color={inWish ? 'var(--primary)' : 'var(--text-espresso)'} />
                </button>
              </div>

              <button
                className="btn btn-dark btn-block"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                BUY NOW WITH 1-CLICK CHECKOUT →
              </button>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: '36px',
            marginBottom: '60px',
          }}
        >
          {/* Tab Navigation */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              borderBottom: '1px solid var(--border)',
              paddingBottom: '12px',
              marginBottom: '28px',
              overflowX: 'auto',
            }}
          >
            {[
              { id: 'description', label: 'Craft & Description' },
              { id: 'fabricCare', label: 'Fabric & Care' },
              { id: 'sizeGuide', label: 'Size & Drape Guide' },
              { id: 'delivery', label: 'Delivery & Returns' },
              { id: 'reviews', label: `Patron Reviews (${reviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  fontSize: '14px',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                  borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                  paddingBottom: '10px',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          {activeTab === 'description' && (
            <div style={{ maxWidth: '800px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Heirloom Craftsmanship</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.8, marginBottom: '16px' }}>
                {product.description}
              </p>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-muted)' }}>
                Every Maison D’Or garment is handwoven using ancestral weaving traditions. Slight variations in the slub texture, zari sheen, and color saturation are hallmark signatures of authentic handcrafted artistry, distinguishing it from mass industrial replication.
              </p>
            </div>
          )}

          {activeTab === 'fabricCare' && (
            <div style={{ maxWidth: '800px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Material Specifications & Care</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={{ padding: '16px', backgroundColor: 'var(--surface-sand)', borderRadius: 'var(--radius-xs)' }}>
                  <strong>Fabric Composition</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '14px' }}>{product.material}</p>
                </div>
                <div style={{ padding: '16px', backgroundColor: 'var(--surface-sand)', borderRadius: 'var(--radius-xs)' }}>
                  <strong>Artisan Care Guide</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '14px' }}>{product.care}</p>
                </div>
              </div>
              <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: 1.8, color: 'var(--text-muted)' }}>
                <li>Do not spray perfumes or deodorants directly onto metallic zari threads.</li>
                <li>Store silk garments rolled in unbleached white muslin fabric inside cedar wardrobes.</li>
                <li>Iron on low heat setting using an iron cloth overlay.</li>
              </ul>
            </div>
          )}

          {activeTab === 'sizeGuide' && (
            <div style={{ maxWidth: '800px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Size & Measurements Reference (Inches)</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--surface-sand)', borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '12px' }}>Size</th>
                    <th style={{ padding: '12px' }}>Bust</th>
                    <th style={{ padding: '12px' }}>Waist</th>
                    <th style={{ padding: '12px' }}>Hip</th>
                    <th style={{ padding: '12px' }}>Length</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>XS</td>
                    <td style={{ padding: '12px' }}>32 - 34</td>
                    <td style={{ padding: '12px' }}>26 - 28</td>
                    <td style={{ padding: '12px' }}>36 - 38</td>
                    <td style={{ padding: '12px' }}>46</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>S</td>
                    <td style={{ padding: '12px' }}>34 - 36</td>
                    <td style={{ padding: '12px' }}>28 - 30</td>
                    <td style={{ padding: '12px' }}>38 - 40</td>
                    <td style={{ padding: '12px' }}>46</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>M</td>
                    <td style={{ padding: '12px' }}>36 - 38</td>
                    <td style={{ padding: '12px' }}>30 - 32</td>
                    <td style={{ padding: '12px' }}>40 - 42</td>
                    <td style={{ padding: '12px' }}>47</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>L</td>
                    <td style={{ padding: '12px' }}>38 - 40</td>
                    <td style={{ padding: '12px' }}>32 - 34</td>
                    <td style={{ padding: '12px' }}>42 - 44</td>
                    <td style={{ padding: '12px' }}>47</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>XL</td>
                    <td style={{ padding: '12px' }}>40 - 42</td>
                    <td style={{ padding: '12px' }}>34 - 36</td>
                    <td style={{ padding: '12px' }}>44 - 46</td>
                    <td style={{ padding: '12px' }}>48</td>
                  </tr>
                </tbody>
              </table>
              <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '12px' }}>
                * Sarees are standard 5.5 meters length with an additional 0.8 meter unstitched blouse piece included.
              </p>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div style={{ maxWidth: '800px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Complimentary Boutique Shipping</h3>
              <p style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>
                All orders above <strong>₹1,999</strong> are dispatched via insured express air courier (BlueDart / DTDC). Orders are hand-inspected, wrapped in archival tissue, scented with sandalwood botanical mist, and packaged in our signature keepsake box.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <h4 style={{ fontSize: '15px', margin: '0 0 6px' }}>Delivery Timelines</h4>
                  <ul style={{ paddingLeft: '18px', fontSize: '13px', lineHeight: 1.8, color: 'var(--text-muted)' }}>
                    <li>Metro Cities: 2 – 3 business days</li>
                    <li>Rest of India: 3 – 5 business days</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', margin: '0 0 6px' }}>Exchanges & Returns</h4>
                  <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--text-muted)' }}>
                    We offer a seamless 7-day return and exchange policy on unworn garments with original tags intact.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', margin: 0 }}>Verified Customer Reviews</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                    Showing approved feedback from verified atelier patrons.
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor: 'var(--surface-sand)',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '12px',
                    color: 'var(--text-espresso)',
                  }}
                >
                  ℹ️ Reviews can be submitted from your <strong>My Orders</strong> page once your order is Delivered.
                </div>
              </div>

              {reviews.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <p>No approved reviews yet for this particular piece. Be the first to share your experience!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      style={{
                        padding: '20px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--surface-alt)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 600, fontSize: '14px' }}>{rev.customerName}</span>
                          {rev.verifiedPurchase && (
                            <span className="badge badge-success" style={{ fontSize: '10px' }}>
                              ✓ Verified Buyer
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>{rev.date}</span>
                      </div>

                      <div style={{ display: 'flex', color: 'var(--primary)', marginBottom: '8px' }}>
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="var(--primary)" stroke="var(--primary)" />
                        ))}
                      </div>

                      <h4 style={{ fontSize: '15px', marginBottom: '6px' }}>{rev.title}</h4>
                      <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-muted)', margin: 0 }}>
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <div style={{ marginBottom: '28px' }}>
              <span style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
                Complete The Ensemble
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginTop: '4px' }}>Related Atelier Creations</h2>
            </div>

            <div className="grid-4">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Luxury Mobile Sticky Bottom Action Bar */}
      <div className="mobile-sticky-bottom-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <img
            src={product.images?.[0]}
            alt={product.name}
            style={{ width: '40px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-xs)', flexShrink: 0 }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-espresso)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
              {product.name}
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary)' }}>
              ₹{(product.salePrice || product.price).toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          style={{ padding: '10px 16px', fontSize: '12px', flexShrink: 0 }}
        >
          <ShoppingBag size={14} />
          {product.stock === 0 ? 'SOLD OUT' : 'ADD TO BAG'}
        </button>
      </div>

      <style>{`
        .mobile-sticky-bottom-bar {
          display: none;
        }
        @media (max-width: 900px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
            padding: 20px 16px !important;
            gap: 28px !important;
          }
        }
        @media (max-width: 768px) {
          .mobile-sticky-bottom-bar {
            display: flex !important;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #FFFFFF;
            border-top: 1px solid var(--border);
            padding: 10px 16px;
            z-index: 950;
            box-shadow: 0 -4px 16px rgba(28, 25, 23, 0.08);
            justify-content: space-between;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};
