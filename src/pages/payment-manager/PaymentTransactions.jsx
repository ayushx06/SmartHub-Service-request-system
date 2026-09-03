import {
  CheckCircle,
  Clock,
  Eye,
  RotateCcw,
  Search,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';

import useFirestoreQuery from '../../hooks/useFirestoreQuery.js';
import { db } from '../../firebase.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function PaymentTransactions() {
  const { currentUser, userProfile } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTransaction, setSelectedTransaction] =
    useState(null);

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const transactionsQuery = useMemo(
    () =>
      query(
        collection(db, 'transactions'),
        orderBy('createdAt', 'desc')
      ),
    []
  );

  const {
    items: transactions,
    loading,
  } = useFirestoreQuery(
    transactionsQuery,
    []
  );

  function formatDate(timestamp) {
    if (!timestamp) {
      return 'N/A';
    }

    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('en-NZ', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }

    return 'N/A';
  }

  function getStatusClass(status) {
    const normalizedStatus = status?.toLowerCase();

    if (normalizedStatus === 'completed') {
      return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
    }

    if (normalizedStatus === 'pending') {
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
    }

    if (normalizedStatus === 'refunded') {
      return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
    }

    return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
  }

  function getStatusIcon(status) {
    const normalizedStatus = status?.toLowerCase();

    if (normalizedStatus === 'completed') {
      return CheckCircle;
    }

    if (normalizedStatus === 'pending') {
      return Clock;
    }

    if (normalizedStatus === 'refunded') {
      return RotateCcw;
    }

    return XCircle;
  }

  async function handleRefund() {
    if (!selectedTransaction) {
      return;
    }

    if (
      selectedTransaction.status?.toLowerCase() !==
      'completed'
    ) {
      setActionError(
        'Only completed payments can be refunded.'
      );
      return;
    }

    if (!refundReason.trim()) {
      setActionError(
        'Please provide a reason for the refund.'
      );
      return;
    }

    if (!currentUser || !userProfile) {
      setActionError(
        'Unable to verify your account. Please log in again.'
      );
      return;
    }

    try {
      setActionLoading(true);
      setActionError('');

      const transactionRef = doc(
        db,
        'transactions',
        selectedTransaction.id
      );

      const auditLogRef = doc(
        collection(db, 'adminAuditLogs')
      );

      const batch = writeBatch(db);

      batch.update(transactionRef, {
        status: 'refunded',
        refundReason: refundReason.trim(),
        refundedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      batch.set(auditLogRef, {
        userId: currentUser.uid,
        userRole: userProfile.role,
        action: 'REFUND_PAYMENT',
        transactionId: selectedTransaction.id,
        timestamp: serverTimestamp(),
      });

      await batch.commit();

      setSelectedTransaction((currentTransaction) =>
        currentTransaction
          ? {
              ...currentTransaction,
              status: 'refunded',
              refundReason: refundReason.trim(),
            }
          : currentTransaction
      );

      setRefundReason('');
      setShowRefundModal(false);
    } catch (error) {
      console.error(
        'Error processing refund:',
        error
      );

      if (error.code === 'permission-denied') {
        setActionError(
          'You do not have permission to process this refund.'
        );
      } else {
        setActionError(
          'Unable to process the refund. Please try again.'
        );
      }
    } finally {
      setActionLoading(false);
    }
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const search = searchQuery.toLowerCase();

      const transactionId =
        transaction.id?.toLowerCase() || '';

      const userId =
        transaction.userId?.toLowerCase() || '';

      const bookingId =
        transaction.bookingId?.toLowerCase() || '';

      const providerId =
        transaction.providerId?.toLowerCase() || '';

      const matchesSearch =
        transactionId.includes(search) ||
        userId.includes(search) ||
        bookingId.includes(search) ||
        providerId.includes(search);

      const matchesStatus =
        statusFilter === 'All' ||
        transaction.status?.toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [
    transactions,
    searchQuery,
    statusFilter,
  ]);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">
          Transaction History
        </h1>

        <p className="muted mt-1">
          View and search all SmartHub payment transactions.
        </p>
      </div>

      {/* Filters */}
      <div className="panel p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              All Transactions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredTransactions.length} transaction
              {filteredTransactions.length !== 1
                ? 's'
                : ''}{' '}
              found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
              <Search className="h-4 w-4 text-slate-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search transactions..."
                className="w-full bg-transparent text-sm outline-none sm:w-56"
              />
            </div>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="All">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="failed">
                Failed
              </option>

              <option value="refunded">
                Refunded
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="p-4 text-left">
                  Transaction
                </th>

                <th className="p-4 text-left">
                  Amount
                </th>

                <th className="p-4 text-left">
                  Method
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-slate-500"
                  >
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map(
                  (transaction) => {
                    const StatusIcon =
                      getStatusIcon(
                        transaction.status
                      );

                    return (
                      <tr
                        key={transaction.id}
                        className="border-t border-slate-100 dark:border-slate-800"
                      >
                        <td className="p-4">
                          <p className="font-semibold">
                            {transaction.id}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Booking{' '}
                            {transaction.bookingId ||
                              'N/A'}
                          </p>
                        </td>

                        <td className="p-4 font-medium">
                          $
                          {Number(
                            transaction.totalAmount ||
                              0
                          ).toFixed(2)}
                        </td>

                        <td className="p-4">
                          {transaction.paymentMethod ||
                            'N/A'}
                        </td>

                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                              transaction.status
                            )}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />

                            {transaction.status ||
                              'Unknown'}
                          </span>
                        </td>

                        <td className="p-4">
                          {formatDate(
                            transaction.createdAt
                          )}
                        </td>

                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTransaction(
                                transaction
                              );
                              setActionError('');
                            }}
                            className="inline-flex items-center gap-1.5 font-medium text-brand-600 hover:underline dark:text-brand-300"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-slate-500"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-semibold">
                  Transaction Details
                </h2>

                <p className="text-sm text-slate-500">
                  Payment transaction information.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedTransaction(null)
                }
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                disabled={actionLoading}
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase text-slate-500">
                    Transaction ID
                  </p>

                  <p className="mt-1 break-all text-sm font-medium">
                    {selectedTransaction.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-500">
                    Status
                  </p>

                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                      selectedTransaction.status
                    )}`}
                  >
                    {selectedTransaction.status ||
                      'Unknown'}
                  </span>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-500">
                    Total Amount
                  </p>

                  <p className="mt-1 font-medium">
                    $
                    {Number(
                      selectedTransaction.totalAmount ||
                        0
                    ).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-500">
                    Payment Method
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedTransaction.paymentMethod ||
                      'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-500">
                    Provider Amount
                  </p>

                  <p className="mt-1 font-medium">
                    $
                    {Number(
                      selectedTransaction.providerAmount ||
                        0
                    ).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-500">
                    Admin Commission
                  </p>

                  <p className="mt-1 font-medium">
                    $
                    {Number(
                      selectedTransaction.commissionAmount ||
                        0
                    ).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-500">
                    Commission Rate
                  </p>

                  <p className="mt-1 font-medium">
                    {Number(
                      selectedTransaction.commissionRate ||
                        0
                    ) * 100}
                    %
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-500">
                    Created
                  </p>

                  <p className="mt-1 font-medium">
                    {formatDate(
                      selectedTransaction.createdAt
                    )}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">
                  Booking ID
                </p>

                <p className="mt-1 break-all text-sm font-medium">
                  {selectedTransaction.bookingId ||
                    'N/A'}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">
                  User ID
                </p>

                <p className="mt-1 break-all text-sm font-medium">
                  {selectedTransaction.userId ||
                    'N/A'}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">
                  Provider ID
                </p>

                <p className="mt-1 break-all text-sm font-medium">
                  {selectedTransaction.providerId ||
                    'N/A'}
                </p>
              </div>

              {selectedTransaction.status?.toLowerCase() ===
                'refunded' && (
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
                  <p className="text-xs uppercase text-slate-500">
                    Refund Reason
                  </p>

                  <p className="mt-1 text-sm">
                    {selectedTransaction.refundReason ||
                      'No reason provided'}
                  </p>

                  {selectedTransaction.refundedAt && (
                    <p className="mt-2 text-xs text-slate-500">
                      Refunded on:{' '}
                      {formatDate(
                        selectedTransaction.refundedAt
                      )}
                    </p>
                  )}
                </div>
              )}

              {actionError && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {actionError}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 p-5 dark:border-slate-800">
              <button
                type="button"
                onClick={() =>
                  setSelectedTransaction(null)
                }
                className="btn-muted"
                disabled={actionLoading}
              >
                Close
              </button>

              {selectedTransaction.status?.toLowerCase() ===
                'completed' && (
                <button
                  type="button"
                  onClick={() => {
                    setActionError('');
                    setRefundReason('');
                    setShowRefundModal(true);
                  }}
                  disabled={actionLoading}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
                >
                  Refund Payment
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Refund Confirmation Modal */}
      {showRefundModal && selectedTransaction && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-semibold">
                  Confirm Refund
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  This action will mark the payment as refunded.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowRefundModal(false);
                  setRefundReason('');
                  setActionError('');
                }}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                disabled={actionLoading}
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">
                    Transaction
                  </span>

                  <span className="max-w-[200px] truncate text-sm font-medium">
                    {selectedTransaction.id}
                  </span>
                </div>

                <div className="mt-3 flex justify-between">
                  <span className="text-sm text-slate-500">
                    Refund Amount
                  </span>

                  <span className="text-lg font-semibold">
                    $
                    {Number(
                      selectedTransaction.totalAmount ||
                        0
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="refundReason"
                  className="mb-2 block text-sm font-medium"
                >
                  Refund Reason
                </label>

                <textarea
                  id="refundReason"
                  value={refundReason}
                  onChange={(event) =>
                    setRefundReason(event.target.value)
                  }
                  placeholder="Enter the reason for this refund..."
                  rows="4"
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              {actionError && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {actionError}
                </p>
              )}

              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-300">
                Please make sure the refund is authorised
                before confirming this action.
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 p-5 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setShowRefundModal(false);
                  setRefundReason('');
                  setActionError('');
                }}
                className="btn-muted"
                disabled={actionLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleRefund}
                disabled={
                  actionLoading ||
                  !refundReason.trim()
                }
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading
                  ? 'Processing...'
                  : 'Confirm Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}