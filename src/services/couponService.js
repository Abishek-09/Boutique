import { INITIAL_COUPONS } from '../data/coupons';

const STORAGE_KEY = 'maison_coupons_list';

const loadCoupons = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COUPONS));
  return INITIAL_COUPONS;
};

const saveCoupons = (coupons) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
};

export const couponService = {
  getAllCoupons: () => {
    return loadCoupons();
  },

  createCoupon: (couponData) => {
    const coupons = loadCoupons();
    const newCoupon = {
      id: `coup-${Date.now().toString().slice(-4)}`,
      code: couponData.code.toUpperCase().trim(),
      type: couponData.type || 'percentage',
      value: Number(couponData.value),
      minOrder: Number(couponData.minOrder) || 0,
      description: couponData.description || '',
      startDate: couponData.startDate || new Date().toISOString().split('T')[0],
      endDate: couponData.endDate || '2026-12-31',
      status: couponData.status || 'active',
    };
    coupons.unshift(newCoupon);
    saveCoupons(coupons);
    return newCoupon;
  },

  updateCoupon: (id, updates) => {
    const coupons = loadCoupons();
    const index = coupons.findIndex((c) => c.id === id);
    if (index > -1) {
      coupons[index] = { ...coupons[index], ...updates };
      saveCoupons(coupons);
      return coupons[index];
    }
    return null;
  },

  toggleCouponStatus: (id) => {
    const coupons = loadCoupons();
    const index = coupons.findIndex((c) => c.id === id);
    if (index > -1) {
      coupons[index].status = coupons[index].status === 'active' ? 'paused' : 'active';
      saveCoupons(coupons);
      return coupons[index];
    }
    return null;
  },

  deleteCoupon: (id) => {
    const coupons = loadCoupons();
    const filtered = coupons.filter((c) => c.id !== id);
    saveCoupons(filtered);
    return true;
  },
};
