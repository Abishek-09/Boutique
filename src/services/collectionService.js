import { COLLECTIONS } from '../data/collections';
import { productService } from './productService';

const STORAGE_KEY = 'maison_collections_list';

const loadCollections = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parsing collections from localStorage', e);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(COLLECTIONS));
  return COLLECTIONS;
};

const saveCollections = (collections) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
};

export const collectionService = {
  getAllCollections: () => {
    const list = loadCollections();
    const allProducts = productService.getAllProducts();
    // Compute accurate dynamic item counts based on current product associations
    return list.map((col) => {
      const assignedCount = allProducts.filter((p) => p.collection === col.slug).length;
      return {
        ...col,
        itemCount: assignedCount > 0 ? assignedCount : (col.itemCount || 0),
      };
    });
  },

  getCollectionById: (id) => {
    const collections = collectionService.getAllCollections();
    return collections.find((c) => c.id === id) || null;
  },

  getCollectionBySlug: (slug) => {
    const collections = collectionService.getAllCollections();
    return collections.find((c) => c.slug === slug) || null;
  },

  createCollection: ({ name, subtitle, banner, productIds = [] }) => {
    const collections = loadCollections();
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `col-${Date.now()}`;

    const newCollection = {
      id: `col-${slug}-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      slug: slug,
      subtitle: subtitle?.trim() || '',
      banner: banner?.trim() || 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1200&auto=format&fit=crop&q=80',
      itemCount: productIds.length,
    };

    collections.unshift(newCollection);
    saveCollections(collections);

    // Assign selected products to this new collection
    if (productIds.length > 0) {
      collectionService.assignProducts(slug, productIds);
    }

    return newCollection;
  },

  updateCollection: (id, updates, productIds = null) => {
    const collections = loadCollections();
    const index = collections.findIndex((c) => c.id === id);
    if (index > -1) {
      const existing = collections[index];
      const updated = { ...existing, ...updates };
      collections[index] = updated;
      saveCollections(collections);

      if (productIds !== null) {
        collectionService.assignProducts(updated.slug, productIds);
      }

      return updated;
    }
    return null;
  },

  assignProducts: (collectionSlug, selectedProductIds) => {
    const allProducts = productService.getAllProducts();
    const selectedSet = new Set(selectedProductIds);

    allProducts.forEach((prod) => {
      if (selectedSet.has(prod.id)) {
        if (prod.collection !== collectionSlug) {
          productService.updateProduct(prod.id, { collection: collectionSlug });
        }
      } else if (prod.collection === collectionSlug) {
        // Unassign product from this collection if unchecked
        productService.updateProduct(prod.id, { collection: '' });
      }
    });
  },

  deleteCollection: (id) => {
    const collections = loadCollections();
    const target = collections.find((c) => c.id === id);
    if (target) {
      // Unassign products from this collection
      const allProducts = productService.getAllProducts();
      allProducts.forEach((p) => {
        if (p.collection === target.slug) {
          productService.updateProduct(p.id, { collection: '' });
        }
      });
      const filtered = collections.filter((c) => c.id !== id);
      saveCollections(filtered);
      return true;
    }
    return false;
  },
};
