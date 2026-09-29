import { INITIAL_ORDERS } from '../data/orders';
import { productService } from './productService';

const STORAGE_KEY = 'maison_orders';

const loadOrders = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse orders from localStorage', e);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
  return INITIAL_ORDERS;
};

const saveOrders = (orders) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

export const orderService = {
  getAllOrders: () => {
    return loadOrders();
  },

  getOrderById: (id) => {
    const orders = loadOrders();
    return orders.find((o) => o.id === id || o.orderNumber === id) || null;
  },

  getCustomerOrders: (customerEmailOrId) => {
    const orders = loadOrders();
    return orders.filter(
      (o) =>
        o.customer?.email?.toLowerCase() === customerEmailOrId?.toLowerCase() ||
        o.customer?.id === customerEmailOrId
    );
  },

  createOrder: ({ customer, items, shippingAddress, pricing, paymentMethod }) => {
    const orders = loadOrders();
    const sequence = orders.length + 1;
    const orderNum = `BTQ-2026-${String(sequence).padStart(3, '0')}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newOrder = {
      id: orderNum,
      orderNumber: orderNum,
      customer: {
        id: customer.id || 'CUST-GUEST',
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
      shippingAddress: {
        name: shippingAddress.name,
        phone: shippingAddress.phone,
        addressLine: shippingAddress.addressLine,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
      },
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        sku: item.sku || 'BTQ-ITEM',
        size: item.size,
        color: item.color,
        price: item.salePrice || item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      pricing: {
        subtotal: pricing.subtotal,
        discount: pricing.discountAmount || 0,
        shipping: pricing.shippingFee || 0,
        tax: pricing.taxAmount || 0,
        total: pricing.total,
      },
      payment: {
        method: paymentMethod || 'Online Demo Payment',
        status: paymentMethod?.includes('Cash') ? 'Pending' : 'Paid',
        transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      },
      status: 'Placed',
      orderDate: now.toISOString(),
      timeline: [
        {
          status: 'Placed',
          date: formattedDate,
          note: 'Order successfully placed by client',
        },
      ],
      shippingInfo: null,
      reviewGiven: false,
    };

    // Deduct stock in productService for realism
    items.forEach((item) => {
      const prod = productService.getProductById(item.productId);
      if (prod) {
        productService.updateStock(item.productId, Math.max(0, prod.stock - item.quantity));
      }
    });

    orders.unshift(newOrder);
    saveOrders(orders);
    return newOrder;
  },

  updateOrderStatus: (orderId, newStatus, customNote = null) => {
    const orders = loadOrders();
    const index = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
    if (index > -1) {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      orders[index].status = newStatus;
      const defaultNote = `Status updated to ${newStatus} by boutique administration.`;
      orders[index].timeline.push({
        status: newStatus,
        date: formattedDate,
        note: customNote || defaultNote,
      });

      saveOrders(orders);
      return orders[index];
    }
    return null;
  },

  updateCourierDetails: (orderId, shippingData) => {
    const orders = loadOrders();
    const index = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
    if (index > -1) {
      orders[index].shippingInfo = {
        courierName: shippingData.courierName || 'BlueDart Express',
        trackingNumber: shippingData.trackingNumber || `BD${Math.floor(100000000 + Math.random() * 900000000)}`,
        trackingUrl:
          shippingData.trackingUrl ||
          `https://www.bluedart.com/tracking/${shippingData.trackingNumber || 'BD123456789'}`,
        shippingDate: shippingData.shippingDate || new Date().toISOString().split('T')[0],
        expectedDelivery: shippingData.expectedDelivery || 'Within 3-4 business days',
      };

      // Automatically advance status to Shipped if currently Placed/Confirmed/Processing
      if (['Placed', 'Confirmed', 'Processing'].includes(orders[index].status)) {
        orders[index].status = 'Shipped';
        const now = new Date();
        orders[index].timeline.push({
          status: 'Shipped',
          date: now.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          note: `Dispatched via ${orders[index].shippingInfo.courierName} (AWB: ${orders[index].shippingInfo.trackingNumber})`,
        });
      }

      saveOrders(orders);
      return orders[index];
    }
    return null;
  },

  markReviewSubmitted: (orderId) => {
    const orders = loadOrders();
    const index = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
    if (index > -1) {
      orders[index].reviewGiven = true;
      saveOrders(orders);
      return orders[index];
    }
    return null;
  },
};
