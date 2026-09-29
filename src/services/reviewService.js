import { INITIAL_REVIEWS } from '../data/reviews';

const STORAGE_KEY = 'maison_reviews';

const loadReviews = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
  return INITIAL_REVIEWS;
};

const saveReviews = (reviews) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
};

export const reviewService = {
  getAllReviews: () => {
    return loadReviews();
  },

  getApprovedReviewsByProduct: (productId) => {
    const reviews = loadReviews();
    return reviews.filter((r) => r.productId === productId && r.status === 'approved');
  },

  getReviewsByStatus: (status) => {
    const reviews = loadReviews();
    if (!status || status === 'all') return reviews;
    return reviews.filter((r) => r.status === status);
  },

  submitReview: ({ productId, productName, customerName, rating, title, comment }) => {
    const reviews = loadReviews();
    const newReview = {
      id: `rev-${Date.now().toString().slice(-4)}`,
      productId,
      productName,
      customerName: customerName || 'Boutique Patron',
      rating: Number(rating) || 5,
      title,
      comment,
      date: new Date().toISOString().split('T')[0],
      status: 'pending', // Awaiting admin approval
      verifiedPurchase: true,
    };
    reviews.unshift(newReview);
    saveReviews(reviews);
    return newReview;
  },

  approveReview: (reviewId) => {
    const reviews = loadReviews();
    const index = reviews.findIndex((r) => r.id === reviewId);
    if (index > -1) {
      reviews[index].status = 'approved';
      saveReviews(reviews);
      return reviews[index];
    }
    return null;
  },

  rejectReview: (reviewId) => {
    const reviews = loadReviews();
    const index = reviews.findIndex((r) => r.id === reviewId);
    if (index > -1) {
      reviews[index].status = 'rejected';
      saveReviews(reviews);
      return reviews[index];
    }
    return null;
  },
};
