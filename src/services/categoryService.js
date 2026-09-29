import { CATEGORIES } from '../data/categories';

const STORAGE_KEY = 'maison_categories_list';

const loadCategories = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parsing categories from localStorage', e);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(CATEGORIES));
  return CATEGORIES;
};

const saveCategories = (categories) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
};

export const categoryService = {
  getAllCategories: () => {
    return loadCategories();
  },

  getCategoryById: (id) => {
    const categories = loadCategories();
    return categories.find((c) => c.id === id) || null;
  },

  getCategoryBySlug: (slug) => {
    const categories = loadCategories();
    return categories.find((c) => c.slug === slug) || null;
  },

  createCategory: (data) => {
    const categories = loadCategories();
    const slug = (data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || `cat-${Date.now()}`;
    
    const newCategory = {
      id: `cat-${slug}-${Date.now().toString().slice(-4)}`,
      name: data.name.trim(),
      slug: slug,
      description: data.description?.trim() || '',
      image: data.image?.trim() || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
      itemCount: Number(data.itemCount) || 0,
    };

    categories.push(newCategory);
    saveCategories(categories);
    return newCategory;
  },

  updateCategory: (id, updates) => {
    const categories = loadCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index > -1) {
      categories[index] = { ...categories[index], ...updates };
      saveCategories(categories);
      return categories[index];
    }
    return null;
  },

  deleteCategory: (id) => {
    const categories = loadCategories();
    const filtered = categories.filter((c) => c.id !== id);
    saveCategories(filtered);
    return true;
  },
};
