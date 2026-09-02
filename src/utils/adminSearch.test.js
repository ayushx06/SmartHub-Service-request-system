import { describe, expect, it } from 'vitest';
import {
  filterBookings,
  filterCategories,
  filterServices,
  filterUsers,
} from './adminSearch.js';

describe('filterUsers', () => {
  const users = [
    { id: '1', fullName: 'Alice Ng', email: 'alice@example.com', phone: '021123456', role: 'customer', status: 'active' },
    { id: '2', fullName: 'Ben Smith', email: 'ben@example.com', phone: null, role: 'provider', status: 'approved' },
    { id: '3', email: 'admin@example.com', role: 'admin', status: 'disabled' },
  ];

  it('returns users matching a searchable field', () => {
    expect(filterUsers(users, 'provider')).toEqual([users[1]]);
  });

  it('excludes users that do not match', () => {
    expect(filterUsers(users, 'Alice')).not.toContain(users[1]);
  });

  it('matches case-insensitively and ignores surrounding whitespace', () => {
    expect(filterUsers(users, '  ALICE@EXAMPLE.COM  ')).toEqual([users[0]]);
  });

  it('returns all users for blank search', () => {
    expect(filterUsers(users, '   ')).toBe(users);
  });

  it('handles null and missing user fields', () => {
    expect(() => filterUsers(users, 'admin')).not.toThrow();
    expect(filterUsers(users, 'admin')).toEqual([users[2]]);
  });
});

describe('filterServices', () => {
  const services = [
    { id: '1', title: 'House Cleaning', providerName: 'Tidy Co', categoryName: 'Home', location: 'Auckland', status: 'active' },
    { id: '2', title: 'Math Tutoring', providerName: 'Sam Lee', categoryName: 'Education', location: 'Wellington', status: 'paused' },
    { id: '3', title: null, providerName: 'Fix It', status: 'removed' },
  ];

  it('matches service title, provider, category, location, and status', () => {
    expect(filterServices(services, 'education')).toEqual([services[1]]);
    expect(filterServices(services, 'fix it')).toEqual([services[2]]);
  });

  it('is case-insensitive and trims search input', () => {
    expect(filterServices(services, '  AUCKLAND ')).toEqual([services[0]]);
  });

  it('returns all services for blank search', () => {
    expect(filterServices(services, '')).toBe(services);
  });

  it('returns no records when none match', () => {
    expect(filterServices(services, 'plumbing')).toEqual([]);
  });

  it('handles null and missing service fields', () => {
    expect(() => filterServices(services, 'removed')).not.toThrow();
    expect(filterServices(services, 'removed')).toEqual([services[2]]);
  });
});

describe('filterBookings', () => {
  const bookings = [
    { id: 'BK-100', serviceTitle: 'Garden Care', userName: 'Mia Chen', paymentMethod: 'card', bookingStatus: 'confirmed', userId: 'USER-1', serviceId: 'SERVICE-1' },
    { id: 'BK-200', serviceTitle: 'Dog Walking', userName: 'Noah King', paymentMethod: 'cash', bookingStatus: 'pending', userId: 'USER-2', serviceId: 'SERVICE-2' },
    { id: 'BK-300', serviceTitle: null, userName: null, paymentMethod: null, bookingStatus: 'cancelled' },
  ];

  it('matches booking display fields', () => {
    expect(filterBookings(bookings, 'Mia Chen')).toEqual([bookings[0]]);
    expect(filterBookings(bookings, 'cash')).toEqual([bookings[1]]);
  });

  it('matches booking and related record IDs', () => {
    expect(filterBookings(bookings, 'bk-200')).toEqual([bookings[1]]);
    expect(filterBookings(bookings, 'service-1')).toEqual([bookings[0]]);
  });

  it('is case-insensitive and trims search input', () => {
    expect(filterBookings(bookings, '  GARDEN CARE  ')).toEqual([bookings[0]]);
  });

  it('returns all bookings for blank search', () => {
    expect(filterBookings(bookings, '\t')).toBe(bookings);
  });

  it('handles null and missing booking fields', () => {
    expect(() => filterBookings(bookings, 'cancelled')).not.toThrow();
    expect(filterBookings(bookings, 'cancelled')).toEqual([bookings[2]]);
  });
});

describe('filterCategories', () => {
  const categories = [
    { id: '1', name: 'Home Services', description: 'Help around the house' },
    { id: '2', name: 'Tutoring', description: 'Learn a new subject' },
    { id: '3', name: 'Other', description: null },
    { id: '4' },
  ];

  it('matches category names and descriptions', () => {
    expect(filterCategories(categories, 'house')).toEqual([categories[0]]);
    expect(filterCategories(categories, 'subject')).toEqual([categories[1]]);
  });

  it('excludes non-matching categories', () => {
    expect(filterCategories(categories, 'tutoring')).not.toContain(categories[0]);
  });

  it('is case-insensitive and trims search input', () => {
    expect(filterCategories(categories, '  HOME SERVICES ')).toEqual([categories[0]]);
  });

  it('returns all categories for blank search', () => {
    expect(filterCategories(categories, '')).toBe(categories);
  });

  it('handles null and missing category fields', () => {
    expect(() => filterCategories(categories, 'other')).not.toThrow();
    expect(filterCategories(categories, 'other')).toEqual([categories[2]]);
  });
});
