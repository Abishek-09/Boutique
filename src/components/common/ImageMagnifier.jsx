import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn, ZoomOut, RotateCcw, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';

export const ImageMagnifier = ({
  src,
  alt = 'Product image',
  images = [],
  hasDiscount = false,
  discountPercent = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Lock background scroll when Lightbox is open
  useScrollLock(isLightboxOpen);

  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const containerRef = useRef(null);

  // Synchronize lightbox index when active src changes
  useEffect(() => {
    if (images && images.length > 0) {
      const idx = images.indexOf(src);
      if (idx !== -1) setLightboxIndex(idx);
    }
  }, [src, images]);

  // Handle keyboard events in Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
        setLightboxZoom(1);
      } else if (e.key === 'ArrowRight' && images.length > 1) {
        setLightboxIndex((prev) => (prev + 1) % images.length);
        setLightboxZoom(1);
      } else if (e.key === 'ArrowLeft' && images.length > 1) {
        setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
        setLightboxZoom(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, images]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomOrigin({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setZoomOrigin({ x: 50, y: 50 });
  };

  const handleOpenLightbox = (e) => {
    e.stopPropagation();
    setIsLightboxOpen(true);
    setLightboxZoom(1);
  };

  const activeImage = images.length > 0 ? images[lightboxIndex] : src;

  return (
    <>
      {/* Main Interactive Zoom Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleOpenLightbox}
        className="image-magnifier-container"
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '125%', // 4:5 luxury fashion aspect ratio
          backgroundColor: 'var(--surface-sand)',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          marginBottom: '16px',
          border: '1px solid var(--border)',
          cursor: 'zoom-in',
          userSelect: 'none',
        }}
        title="Click to view full screen high resolution"
      >
        {/* Magnified Image */}
        <img
          src={src}
          alt={alt}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
            transform: isHovered ? 'scale(2.25)' : 'scale(1)',
            transition: isHovered
              ? 'transform 0.08s ease-out'
              : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform-origin 0.35s ease',
            pointerEvents: 'none',
          }}
        />

        {/* Sale Discount Badge */}
        {hasDiscount && (
          <span
            className="badge badge-sale"
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              zIndex: 3,
              pointerEvents: 'none',
            }}
          >
            {discountPercent}% OFF
          </span>
        )}

        {/* Expand to Lightbox Trigger Icon (Top Right) */}
        <button
          type="button"
          onClick={handleOpenLightbox}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            color: 'var(--text-espresso)',
            transition: 'var(--transition)',
          }}
          title="Open full-screen gallery"
          aria-label="Expand image"
        >
          <Maximize2 size={16} />
        </button>

        {/* Luxury Inspection Hint Pill */}
        <div
          style={{
            position: 'absolute',
            bottom: '14px',
            right: '14px',
            zIndex: 3,
            backgroundColor: 'rgba(74, 65, 60, 0.82)',
            backdropFilter: 'blur(6px)',
            color: '#FFFFFF',
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '11px',
            letterSpacing: '0.04em',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            pointerEvents: 'none',
            opacity: isHovered ? 0 : 1,
            transition: 'opacity 0.25s ease',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <ZoomIn size={13} color="var(--accent-sand)" />
          <span>Hover to zoom & inspect weave</span>
        </div>
      </div>

      {/* Full-Screen High-Resolution Lightbox Modal */}
      {isLightboxOpen && createPortal(
        <div
          className="modal-overlay"
          onClick={() => {
            setIsLightboxOpen(false);
            setLightboxZoom(1);
          }}
          style={{
            backgroundColor: 'rgba(30, 25, 22, 0.94)',
            backdropFilter: 'blur(8px)',
            padding: '16px',
            zIndex: 2000,
          }}
        >
          {/* Lightbox Toolbar Header */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: '60px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 2010,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Zoom Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setLightboxZoom((prev) => Math.min(prev + 0.5, 3.5))}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                title="Zoom in"
              >
                <ZoomIn size={15} /> <span>Zoom In</span>
              </button>

              <button
                type="button"
                onClick={() => setLightboxZoom((prev) => Math.max(prev - 0.5, 1))}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                title="Zoom out"
              >
                <ZoomOut size={15} /> <span>Zoom Out</span>
              </button>

              <button
                type="button"
                onClick={() => setLightboxZoom(1)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                title="Reset zoom"
              >
                <RotateCcw size={14} /> <span>Reset ({Math.round(lightboxZoom * 100)}%)</span>
              </button>
            </div>

            {/* Title & Close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ color: 'var(--accent-sand)', fontSize: '13px', display: 'none' }} className="hide-on-mobile">
                {alt} {images.length > 1 ? `(${lightboxIndex + 1} of ${images.length})` : ''}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsLightboxOpen(false);
                  setLightboxZoom(1);
                }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Close full-screen image"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Lightbox Main Viewport */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              height: 'calc(100vh - 150px)',
              marginTop: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Prev Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
                  setLightboxZoom(1);
                }}
                style={{
                  position: 'absolute',
                  left: '16px',
                  zIndex: 2020,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
                aria-label="Previous angle"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* High-Resolution Zoomed Photo */}
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: lightboxZoom > 1 ? 'grab' : 'default',
              }}
            >
              <img
                src={activeImage}
                alt={alt}
                style={{
                  maxWidth: '90%',
                  maxHeight: '88%',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-xs)',
                  transform: `scale(${lightboxZoom})`,
                  transition: 'transform 0.25s ease',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                }}
              />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  setLightboxIndex((prev) => (prev + 1) % images.length);
                  setLightboxZoom(1);
                }}
                style={{
                  position: 'absolute',
                  right: '16px',
                  zIndex: 2020,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
                aria-label="Next angle"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Lightbox Thumbnails Strip (Bottom) */}
          {images.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '80px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '0 20px',
                zIndex: 2010,
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                overflowX: 'auto',
              }}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setLightboxIndex(idx);
                    setLightboxZoom(1);
                  }}
                  style={{
                    width: '46px',
                    height: '58px',
                    borderRadius: 'var(--radius-xs)',
                    overflow: 'hidden',
                    border: idx === lightboxIndex ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.3)',
                    opacity: idx === lightboxIndex ? 1 : 0.6,
                    padding: 0,
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
};
