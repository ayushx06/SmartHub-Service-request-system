import { describe, expect, it } from 'vitest';
import {
  filterTransactions,
  canRefundTransaction,
  validateRefundReason,
} from './paymentManager.js';

describe('filterTransactions', () => {
  const transactions = [
    {
      id: 'TX-100',
      userId: 'USER-001',
      bookingId: 'BOOK-100',
      providerId: 'PROVIDER-001',
      status: 'completed',
    },
    {
      id: 'TX-200',
      userId: 'USER-002',
      bookingId: 'BOOK-200',
      providerId: 'PROVIDER-002',
      status: 'pending',
    },
    {
      id: 'TX-300',
      userId: 'USER-003',
      bookingId: 'BOOK-300',
      providerId: 'PROVIDER-003',
      status: 'refunded',
    },
  ];

  it('finds a transaction by transaction ID', () => {
    expect(filterTransactions(transactions, 'TX-100')).toEqual([
      transactions[0],
    ]);
  });

  it('finds a transaction by user ID', () => {
    expect(filterTransactions(transactions, 'USER-002')).toEqual([
      transactions[1],
    ]);
  });

  it('finds a transaction by booking ID', () => {
    expect(filterTransactions(transactions, 'BOOK-300')).toEqual([
      transactions[2],
    ]);
  });

  it('finds a transaction by provider ID', () => {
    expect(filterTransactions(transactions, 'PROVIDER-001')).toEqual([
      transactions[0],
    ]);
  });

  it('filters transactions by status', () => {
    expect(filterTransactions(transactions, '', 'completed')).toEqual([
      transactions[0],
    ]);
  });

  it('matches search text case-insensitively', () => {
    expect(filterTransactions(transactions, '  tx-100  ')).toEqual([
      transactions[0],
    ]);
  });

  it('returns all transactions when search and status are not restricted', () => {
    expect(filterTransactions(transactions)).toEqual(transactions);
  });

  it('returns an empty array when no transaction matches', () => {
    expect(filterTransactions(transactions, 'TX-999')).toEqual([]);
  });
});

describe('canRefundTransaction', () => {
  it('allows refunds for completed transactions', () => {
    expect(
      canRefundTransaction({ status: 'completed' })
    ).toBe(true);
  });

  it('does not allow refunds for refunded transactions', () => {
    expect(
      canRefundTransaction({ status: 'refunded' })
    ).toBe(false);
  });

  it('does not allow refunds for pending transactions', () => {
    expect(
      canRefundTransaction({ status: 'pending' })
    ).toBe(false);
  });

  it('does not allow refunds for failed transactions', () => {
    expect(
      canRefundTransaction({ status: 'failed' })
    ).toBe(false);
  });
});

describe('validateRefundReason', () => {
  it('accepts a valid refund reason', () => {
    expect(
      validateRefundReason('Customer requested a refund')
    ).toBe(true);
  });

  it('rejects an empty refund reason', () => {
    expect(validateRefundReason('')).toBe(false);
  });

  it('rejects a refund reason containing only spaces', () => {
    expect(validateRefundReason('   ')).toBe(false);
  });

  it('handles a missing refund reason', () => {
    expect(validateRefundReason()).toBe(false);
  });
});