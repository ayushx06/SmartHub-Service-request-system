export function filterTransactions(transactions, search = '', status = 'All') {
  const normalizedSearch = search.trim().toLowerCase();
  const normalizedStatus = status.toLowerCase();

  return transactions.filter((transaction) => {
    const transactionId = transaction.id?.toLowerCase() || '';
    const userId = transaction.userId?.toLowerCase() || '';
    const bookingId = transaction.bookingId?.toLowerCase() || '';
    const providerId = transaction.providerId?.toLowerCase() || '';

    const matchesSearch =
      transactionId.includes(normalizedSearch) ||
      userId.includes(normalizedSearch) ||
      bookingId.includes(normalizedSearch) ||
      providerId.includes(normalizedSearch);

    const matchesStatus =
      status === 'All' ||
      transaction.status?.toLowerCase() === normalizedStatus;

    return matchesSearch && matchesStatus;
  });
}

export function canRefundTransaction(transaction) {
  return transaction?.status?.toLowerCase() === 'completed';
}

export function validateRefundReason(reason) {
  return Boolean(reason?.trim());
}