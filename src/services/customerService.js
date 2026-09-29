import { INITIAL_CUSTOMERS } from '../data/customers';

const STORAGE_KEY = 'maison_customers';

const loadCustomers = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
  return INITIAL_CUSTOMERS;
};

export const customerService = {
  getAllCustomers: () => {
    return loadCustomers();
  },

  getCustomerById: (id) => {
    const customers = loadCustomers();
    return customers.find((c) => c.id === id) || null;
  },

  updateCustomer: (id, updates) => {
    const customers = loadCustomers();
    const index = customers.findIndex((c) => c.id === id);
    if (index > -1) {
      customers[index] = { ...customers[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
      return customers[index];
    }
    return null;
  },
};
