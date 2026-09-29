import { INITIAL_HOMEPAGE_CMS } from '../data/homepage';

const STORAGE_KEY = 'maison_cms_homepage';

const loadCMS = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_HOMEPAGE_CMS));
  return INITIAL_HOMEPAGE_CMS;
};

export const cmsService = {
  getHomepageContent: () => {
    return loadCMS();
  },

  updateHeroBanner: (updates) => {
    const cms = loadCMS();
    cms.hero = { ...cms.hero, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cms));
    return cms.hero;
  },

  updatePromoBanner: (updates) => {
    const cms = loadCMS();
    cms.promoBanner = { ...cms.promoBanner, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cms));
    return cms.promoBanner;
  },

  updateAnnouncement: (text, enabled = true) => {
    const cms = loadCMS();
    cms.announcement = { text, enabled };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cms));
    return cms.announcement;
  },

  updateStoreInfo: (updates) => {
    const cms = loadCMS();
    cms.storeInfo = { ...cms.storeInfo, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cms));
    return cms.storeInfo;
  },
};
