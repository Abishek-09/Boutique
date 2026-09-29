const STORAGE_KEY = 'maison_enquiries';

const INITIAL_ENQUIRIES = [
  {
    id: 'enq-001',
    name: 'Kavita Chawla',
    email: 'kavita.chawla@example.com',
    phone: '+91 98200 45678',
    message: 'Inquiring about custom blouse stitching measurements and expedited delivery for Kashi Crimson Silk Saree before April 10.',
    date: '2026-03-21 04:30 PM',
    status: 'New',
  },
  {
    id: 'enq-002',
    name: 'Archana Menon',
    email: 'archana.menon@example.com',
    phone: '+91 98471 22334',
    message: 'Do you offer international shipping to Singapore for bridesmaid bridal sets?',
    date: '2026-03-20 11:15 AM',
    status: 'Contacted',
  },
  {
    id: 'enq-003',
    name: 'Shalini Gupta',
    email: 'shalini.gupta@example.com',
    phone: '+91 99100 88990',
    message: 'Can I book a private bridal consultation appointment at your Bengaluru atelier this weekend?',
    date: '2026-03-18 02:00 PM',
    status: 'Resolved',
  },
];

const loadEnquiries = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ENQUIRIES));
  return INITIAL_ENQUIRIES;
};

const saveEnquiries = (enquiries) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(enquiries));
};

export const enquiryService = {
  getAllEnquiries: () => {
    return loadEnquiries();
  },

  submitEnquiry: ({ name, email, phone, message }) => {
    const enquiries = loadEnquiries();
    const now = new Date();
    const newEnquiry = {
      id: `enq-${Date.now().toString().slice(-4)}`,
      name,
      email,
      phone,
      message,
      date: now.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'New',
    };
    enquiries.unshift(newEnquiry);
    saveEnquiries(enquiries);
    return newEnquiry;
  },

  updateStatus: (id, newStatus) => {
    const enquiries = loadEnquiries();
    const index = enquiries.findIndex((e) => e.id === id);
    if (index > -1) {
      enquiries[index].status = newStatus;
      saveEnquiries(enquiries);
      return enquiries[index];
    }
    return null;
  },
};
