// Centralized mock data keeps each page simple while the app is still frontend-only.
// Replace these arrays with API responses later when the backend is ready.
export const stats = [
  { label: 'Total Users', value: '12,842', change: '+12.4%', trend: 'up' },
  { label: 'Service Providers', value: '1,284', change: '+8.1%', trend: 'up' },
  { label: 'Total Bookings', value: '38,219', change: '+15.8%', trend: 'up' },
  { label: 'Total Revenue', value: '$284,920', change: '+10.2%', trend: 'up' },
];

export const users = [
  { id: 1, name: 'Ava Mitchell', email: 'ava@example.com', role: 'Customer', status: 'Active', joined: '2026-04-02', bookings: 12 },
  { id: 2, name: 'Noah Wilson', email: 'noah@example.com', role: 'Provider', status: 'Active', joined: '2026-03-18', bookings: 38 },
  { id: 3, name: 'Mia Chen', email: 'mia@example.com', role: 'Customer', status: 'Blocked', joined: '2026-02-21', bookings: 4 },
  { id: 4, name: 'Liam Patel', email: 'liam@example.com', role: 'Provider', status: 'Active', joined: '2026-01-10', bookings: 55 },
  { id: 5, name: 'Sophia Garcia', email: 'sophia@example.com', role: 'Customer', status: 'Active', joined: '2026-04-23', bookings: 9 },
  { id: 6, name: 'Ethan Brown', email: 'ethan@example.com', role: 'Provider', status: 'Blocked', joined: '2025-12-12', bookings: 17 },
];

export const providerRequests = [
  { id: 101, name: 'Oliver Stone', service: 'Plumbing', city: 'Auckland', experience: '6 years', status: 'Pending', documents: ['ID Proof', 'Trade License'] },
  { id: 102, name: 'Grace Lee', service: 'Electrical', city: 'Wellington', experience: '4 years', status: 'Pending', documents: ['ID Proof', 'Certification'] },
  { id: 103, name: 'Henry Adams', service: 'Cleaning', city: 'Christchurch', experience: '3 years', status: 'Approved', documents: ['ID Proof', 'Insurance'] },
  { id: 104, name: 'Ella Clark', service: 'Gardening', city: 'Hamilton', experience: '5 years', status: 'Rejected', documents: ['ID Proof'] },
];

export const bookings = [
  { id: 'BK-1048', customer: 'Ava Mitchell', provider: 'Liam Patel', service: 'Appliance Repair', amount: 120, status: 'Completed', date: '2026-05-12', address: '12 Queen Street' },
  { id: 'BK-1049', customer: 'Sophia Garcia', provider: 'Noah Wilson', service: 'Home Cleaning', amount: 85, status: 'In Progress', date: '2026-05-13', address: '8 Lake Road' },
  { id: 'BK-1050', customer: 'Mia Chen', provider: 'Ethan Brown', service: 'Gardening', amount: 65, status: 'Pending', date: '2026-05-15', address: '22 Hill Lane' },
  { id: 'BK-1051', customer: 'Noah Wilson', provider: 'Grace Lee', service: 'Electrical', amount: 210, status: 'Cancelled', date: '2026-05-10', address: '4 Station Road' },
  { id: 'BK-1052', customer: 'Oliver Stone', provider: 'Liam Patel', service: 'Plumbing', amount: 140, status: 'Completed', date: '2026-05-09', address: '77 Park Ave' },
];

export const complaints = [
  { id: 'CP-301', customer: 'Mia Chen', subject: 'Provider arrived late', status: 'Open', priority: 'Medium', note: '' },
  { id: 'CP-302', customer: 'Ava Mitchell', subject: 'Invoice mismatch', status: 'In Review', priority: 'High', note: 'Checking payment logs.' },
  { id: 'CP-303', customer: 'Sophia Garcia', subject: 'Service quality concern', status: 'Resolved', priority: 'Low', note: 'Refund coupon issued.' },
];

export const recentActivities = [
  'Grace Lee submitted provider verification documents.',
  'Booking BK-1048 was marked completed.',
  'Mia Chen was blocked after policy review.',
  'Complaint CP-302 moved to In Review.',
  'Revenue payout batch was generated.',
];

export const bookingAnalytics = [
  { month: 'Jan', bookings: 2500, revenue: 18500, users: 620 },
  { month: 'Feb', bookings: 3100, revenue: 22400, users: 760 },
  { month: 'Mar', bookings: 4200, revenue: 31800, users: 940 },
  { month: 'Apr', bookings: 4600, revenue: 35200, users: 1120 },
  { month: 'May', bookings: 5200, revenue: 40900, users: 1340 },
  { month: 'Jun', bookings: 6100, revenue: 46800, users: 1510 },
];

export const categoryStats = [
  { name: 'Cleaning', value: 32 },
  { name: 'Plumbing', value: 24 },
  { name: 'Electrical', value: 18 },
  { name: 'Gardening', value: 14 },
  { name: 'Repair', value: 12 },
];
