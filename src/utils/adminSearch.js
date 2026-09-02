function filterByFields(records, searchQuery, fields) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (!normalizedQuery) return records;

  return records.filter((record) => fields.some((field) =>
    String(record?.[field] ?? '').toLowerCase().includes(normalizedQuery)));
}

export function filterUsers(users, searchQuery) {
  return filterByFields(users, searchQuery, ['fullName', 'email', 'phone', 'role', 'status']);
}

export function filterServices(services, searchQuery) {
  return filterByFields(services, searchQuery, ['title', 'providerName', 'categoryName', 'location', 'status']);
}

export function filterBookings(bookings, searchQuery) {
  return filterByFields(bookings, searchQuery, [
    'serviceTitle',
    'userName',
    'paymentMethod',
    'bookingStatus',
    'id',
    'userId',
    'serviceId',
  ]);
}

export function filterCategories(categories, searchQuery) {
  return filterByFields(categories, searchQuery, ['name', 'description']);
}
