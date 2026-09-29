import { INITIAL_PRODUCTS } from '../data/products';
import { COLLECTIONS } from '../data/collections';
import { couponService } from './couponService';

const STORAGE_KEY = 'maison_products';

const loadProducts = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse products from localStorage', e);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
};

const saveProducts = (products) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const productService = {
  getAllProducts: () => {
    return loadProducts();
  },

  getProductById: (id) => {
    const products = loadProducts();
    return products.find((p) => p.id === id) || null;
  },

  getProductBySlug: (slug) => {
    const products = loadProducts();
    return products.find((p) => p.slug === slug) || null;
  },

  getFeaturedProducts: () => {
    const products = loadProducts();
    return products.filter((p) => p.featured && p.status === 'published');
  },

  getNewArrivals: (searchQuery) => {
    const products = loadProducts();
    let list = products.filter((p) => p.newArrival && p.status === 'published');
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.collection?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          (p.colors && p.colors.some((c) => c.toLowerCase().includes(q)))
      );
    }
    return list;
  },

  getSearchCountsBySection: (searchQuery) => {
    if (!searchQuery || !searchQuery.trim()) {
      return { newArrivals: 0, collections: 0, offers: 0, allShop: 0 };
    }
    const q = searchQuery.toLowerCase().trim();
    const products = loadProducts().filter((p) => p.status === 'published');
    const matches = products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.collection?.toLowerCase().includes(q) ||
        p.material?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        (p.colors && p.colors.some((c) => c.toLowerCase().includes(q)))
    );
    return {
      allShop: matches.length,
      newArrivals: matches.filter((p) => p.newArrival).length,
      collections: matches.filter((p) => p.collection && p.collection !== 'none').length,
      offers: matches.filter((p) => p.salePrice && p.salePrice < p.price).length,
    };
  },

  getSearchSuggestions: (query, currentScope = 'all', extraParams = {}) => {
    if (!query || query.trim().length < 2) {
      return {
        query: '',
        currentScope,
        inScopeMatches: [],
        inScopeTotal: 0,
        matchingCollections: [],
        matchingVouchers: [],
        otherSectionMatches: [],
        otherSectionTotal: 0,
        totalAnywhere: 0,
      };
    }

    const q = query.toLowerCase().trim();
    const products = loadProducts().filter((p) => p.status === 'published');

    const matchesProduct = (p) =>
      p.name?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.collection?.toLowerCase().includes(q) ||
      p.material?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      (p.colors && p.colors.some((c) => c.toLowerCase().includes(q)));

    const allMatches = products.filter(matchesProduct);

    // Matching Collections Capsules
    const matchingCollections = COLLECTIONS.filter(
      (col) =>
        col.name.toLowerCase().includes(q) ||
        col.subtitle.toLowerCase().includes(q) ||
        col.slug.toLowerCase().includes(q)
    );

    // Matching Vouchers
    const allCoupons = couponService.getAllCoupons ? couponService.getAllCoupons() : [];
    const matchingVouchers = allCoupons
      .filter((c) => c.status === 'active')
      .filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          String(c.value).includes(q)
      );

    let inScopeMatches = [];
    let otherSectionMatches = [];

    if (currentScope === 'new-arrivals') {
      inScopeMatches = allMatches.filter((p) => p.newArrival);
      otherSectionMatches = allMatches.filter((p) => !p.newArrival);
    } else if (currentScope === 'offers') {
      inScopeMatches = allMatches.filter((p) => p.salePrice && p.salePrice < p.price);
      otherSectionMatches = allMatches.filter((p) => !(p.salePrice && p.salePrice < p.price));
    } else if (currentScope === 'collections') {
      if (extraParams.collectionSlug) {
        inScopeMatches = allMatches.filter((p) => p.collection === extraParams.collectionSlug);
        otherSectionMatches = allMatches.filter((p) => p.collection !== extraParams.collectionSlug);
      } else {
        inScopeMatches = allMatches.filter((p) => p.collection && p.collection !== 'none');
        otherSectionMatches = allMatches.filter((p) => !p.collection || p.collection === 'none');
      }
    } else {
      // 'shop' or 'all'
      inScopeMatches = allMatches;
      otherSectionMatches = [];
    }

    // Tag out of scope matches with which section they belong to
    const taggedOtherSection = otherSectionMatches.map((p) => {
      let sectionTag = 'Boutique Catalog';
      let sectionLink = `/product/${p.id}`;
      if (p.newArrival) {
        sectionTag = 'New Arrivals';
      } else if (p.salePrice && p.salePrice < p.price) {
        sectionTag = 'Offers';
      } else if (p.collection && p.collection !== 'none') {
        sectionTag = 'Collections';
      }
      return {
        ...p,
        sectionTag,
        sectionLink,
      };
    });

    return {
      query,
      currentScope,
      inScopeMatches: inScopeMatches.slice(0, 5),
      inScopeTotal: inScopeMatches.length,
      matchingCollections: matchingCollections.slice(0, 3),
      matchingVouchers: matchingVouchers.slice(0, 2),
      otherSectionMatches: taggedOtherSection.slice(0, 5),
      otherSectionTotal: otherSectionMatches.length,
      totalAnywhere: allMatches.length + matchingCollections.length + matchingVouchers.length,
    };
  },

  getRelatedProducts: (currentProductId, category, limit = 4) => {
    const products = loadProducts();
    return products
      .filter((p) => p.id !== currentProductId && p.category === category && p.status === 'published')
      .slice(0, limit);
  },

  filterProducts: ({ category, collection, minPrice, maxPrice, size, color, inStockOnly, sortBy, searchQuery }) => {
    let list = loadProducts().filter((p) => p.status === 'published');

    if (category && category !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (collection && collection !== 'all') {
      list = list.filter((p) => p.collection.toLowerCase() === collection.toLowerCase());
    }

    if (minPrice !== undefined && minPrice !== null) {
      list = list.filter((p) => (p.salePrice || p.price) >= minPrice);
    }

    if (maxPrice !== undefined && maxPrice !== null) {
      list = list.filter((p) => (p.salePrice || p.price) <= maxPrice);
    }

    if (size && size !== 'all') {
      list = list.filter((p) => p.sizes && p.sizes.some((s) => s.toLowerCase().includes(size.toLowerCase())));
    }

    if (color && color !== 'all') {
      list = list.filter((p) => p.colors && p.colors.some((c) => c.toLowerCase().includes(color.toLowerCase())));
    }

    if (inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      list.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  },

  createProduct: (productData) => {
    const products = loadProducts();
    const newId = `prod-${Date.now().toString().slice(-4)}`;
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const newProduct = {
      ...productData,
      id: newId,
      slug: slug || `product-${newId}`,
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
    };
    products.unshift(newProduct);
    saveProducts(products);
    return newProduct;
  },

  updateProduct: (id, updates) => {
    const products = loadProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index > -1) {
      products[index] = { ...products[index], ...updates };
      saveProducts(products);
      return products[index];
    }
    return null;
  },

  updateStock: (id, newStock) => {
    const products = loadProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index > -1) {
      products[index].stock = Math.max(0, parseInt(newStock, 10) || 0);
      saveProducts(products);
      return products[index];
    }
    return null;
  },

  toggleStatus: (id) => {
    const products = loadProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index > -1) {
      products[index].status = products[index].status === 'published' ? 'draft' : 'published';
      saveProducts(products);
      return products[index];
    }
    return null;
  },

  deleteProduct: (id) => {
    const products = loadProducts();
    const filtered = products.filter((p) => p.id !== id);
    saveProducts(filtered);
    return true;
  },
};
