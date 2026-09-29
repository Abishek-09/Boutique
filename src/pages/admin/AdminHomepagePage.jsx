import React, { useState, useEffect } from 'react';
import { Home, Save, Eye, Sparkles, Check } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import { useApp } from '../../context/AppContext';

export const AdminHomepagePage = () => {
  const [cms, setCms] = useState(() => cmsService.getHomepageContent());
  const { showToast } = useApp();

  // Announcement
  const [announcementText, setAnnouncementText] = useState(cms.announcement?.text || '');
  const [announcementEnabled, setAnnouncementEnabled] = useState(cms.announcement?.enabled ?? true);

  // Hero Banner
  const [heroTitle, setHeroTitle] = useState(cms.hero?.title || '');
  const [heroSubtitle, setHeroSubtitle] = useState(cms.hero?.subtitle || '');
  const [heroImage, setHeroImage] = useState(cms.hero?.image || '');
  const [heroBtnText, setHeroBtnText] = useState(cms.hero?.primaryBtnText || '');
  const [heroBtnLink, setHeroBtnLink] = useState(cms.hero?.primaryBtnLink || '');

  // Promo Banner
  const [promoTitle, setPromoTitle] = useState(cms.promoBanner?.title || '');
  const [promoSubtitle, setPromoSubtitle] = useState(cms.promoBanner?.subtitle || '');
  const [promoImage, setPromoImage] = useState(cms.promoBanner?.image || '');
  const [promoBtnText, setPromoBtnText] = useState(cms.promoBanner?.buttonText || '');
  const [promoBtnLink, setPromoBtnLink] = useState(cms.promoBanner?.buttonLink || '');

  const handleSaveCMS = (e) => {
    e.preventDefault();

    cmsService.updateAnnouncement(announcementText, announcementEnabled);
    cmsService.updateHeroBanner({
      title: heroTitle,
      subtitle: heroSubtitle,
      image: heroImage,
      primaryBtnText: heroBtnText,
      primaryBtnLink: heroBtnLink,
    });
    cmsService.updatePromoBanner({
      title: promoTitle,
      subtitle: promoSubtitle,
      image: promoImage,
      buttonText: promoBtnText,
      buttonLink: promoBtnLink,
    });

    showToast('Homepage content updated successfully!', 'success');
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', letterSpacing: '0.04em', margin: '0 0 4px' }}>Storefront Homepage CMS</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Edit hero campaign titles, announcement bar announcements, and promotional banners
          </p>
        </div>

        <button type="button" onClick={handleSaveCMS} className="btn btn-primary btn-sm">
          <Save size={14} /> SAVE ALL CHANGES
        </button>
      </div>

      <form onSubmit={handleSaveCMS} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Announcement Bar Settings */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 16px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
            Top Announcement Bar
          </h3>

          <div className="form-group">
            <label className="form-label">ANNOUNCEMENT TEXT</label>
            <input
              type="text"
              className="form-input"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={announcementEnabled}
              onChange={(e) => setAnnouncementEnabled(e.target.checked)}
              style={{ accentColor: 'var(--primary)' }}
            />
            <span>Enable Announcement Bar on Storefront</span>
          </label>
        </div>

        {/* Hero Section Banner */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 16px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
            Hero Main Campaign Banner
          </h3>

          <div className="form-group">
            <label className="form-label">MAIN HERO HEADING</label>
            <input
              type="text"
              className="form-input"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">SUBTITLE COPY</label>
            <textarea
              rows={2}
              className="form-textarea"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">BACKGROUND IMAGE URL</label>
            <input
              type="text"
              className="form-input"
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">PRIMARY BUTTON TEXT</label>
              <input
                type="text"
                className="form-input"
                value={heroBtnText}
                onChange={(e) => setHeroBtnText(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">PRIMARY BUTTON LINK</label>
              <input
                type="text"
                className="form-input"
                value={heroBtnLink}
                onChange={(e) => setHeroBtnLink(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Promotional Banner */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 16px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
            Middle Promotional Campaign
          </h3>

          <div className="form-group">
            <label className="form-label">CAMPAIGN TITLE</label>
            <input
              type="text"
              className="form-input"
              value={promoTitle}
              onChange={(e) => setPromoTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">CAMPAIGN SUBTITLE</label>
            <textarea
              rows={2}
              className="form-textarea"
              value={promoSubtitle}
              onChange={(e) => setPromoSubtitle(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">BANNER IMAGE URL</label>
              <input
                type="text"
                className="form-input"
                value={promoImage}
                onChange={(e) => setPromoImage(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">CTA BUTTON TEXT</label>
              <input
                type="text"
                className="form-input"
                value={promoBtnText}
                onChange={(e) => setPromoBtnText(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">CTA LINK</label>
              <input
                type="text"
                className="form-input"
                value={promoBtnLink}
                onChange={(e) => setPromoBtnLink(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="submit" className="btn btn-primary btn-lg">
            <Save size={16} /> SAVE HOMEPAGE CONTENT
          </button>
        </div>
      </form>
    </div>
  );
};
