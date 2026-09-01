import {
  CheckCircle,
  Clock,
  DollarSign,
  RotateCcw,
  Search,
  X,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import StatCard from '../components/StatCard.jsx';
import useFirestoreQuery from '../hooks/useFirestoreQuery.js';
import { db } from '../firebase.js';

export default function PaymentManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  // Get all transactions from Firestore
  const transactionsQuery = useMemo(
    () =>
      query(
        collection(db, 'transactions'),
        orderBy('createdAt', 'desc')
      ),
    []
  );

  const { items: transactions, loading } = useFirestoreQuery(
    transactionsQuery,
    []
  );

  // Transaction status groups
  const pendingPayments = transactions.filter(
    (transaction) =>
      transaction.status?.toLowerCase() === 'pending'
  );

  const completedPayments = transactions.filter(
    (transaction) =>
      transaction.status?.toLowerCase() === 'completed'
  );

  const failedPayments = transactions.filter(
    (transaction) =>
      transaction.status?.toLowerCase() === 'failed'
  );

  const refundedPayments = transactions.filter(
    (transaction) =>
      transaction.status?.toLowerCase() === 'refunded'
  );

  // Financial calculations
  const completedRevenue = completedPayments.reduce(
    (sum, transaction) =>
      sum + Number(transaction.totalAmount || 0),
    0
  );

  const totalCommission = completedPayments.reduce(
    (sum, transaction) =>
      sum + Number(transaction.commissionAmount || 0),
    0
  );

  const providerEarnings = completedPayments.reduce(
    (sum, transaction) =>
      sum + Number(transaction.providerAmount || 0),
    0
  );

  const refundedAmount = refundedPayments.reduce(
    (sum, transaction) =>
      sum + Number(transaction.totalAmount || 0),
    0
  );

  // Search and filter
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const search = searchQuery.toLowerCase();

      const transactionId =
        transaction.id?.toLowerCase() || '';

      const userId =
        transaction.userId?.toLowerCase() || '';

      const bookingId =
        transaction.bookingId?.toLowerCase() || '';

      const matchesSearch =
        transactionId.includes(search) ||
        userId.includes(search) ||
        bookingId.includes(search);

      const matchesStatus =
        statusFilter === 'All' ||
        transaction.status?.toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchQuery, statusFilter]);

  // Format Firestore timestamp
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

  // Status badge styles
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

  // Update payment status
  async function updateTransactionStatus(id, newStatus) {
    try {
      setActionLoading(true);

      const transactionRef = doc(
        db,
        'transactions',
        id
      );

      await updateDoc(transactionRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

      setSelectedTransaction((currentTransaction) =>
        currentTransaction?.id === id
          ? {
              ...currentTransaction,
              status: newStatus,
            }
          : currentTransaction
      );
    } catch (error) {
      console.error(
        'Error updating transaction:',
        error
      );

      alert(
        'Unable to update the payment status.'
      );
    } finally {
      setActionLoading(false);
    }
  }

  // Process refund
  async function handleRefund() {
    if (!selectedTransaction) {
      return;
    }

    if (!refundReason.trim()) {
      alert(
        'Please provide a reason for the refund.'
      );
      return;
    }

    try {
      setActionLoading(true);

      const transactionRef = doc(
        db,
        'transactions',
        selectedTransaction.id
      );

      await updateDoc(transactionRef, {
        status: 'refunded',
        refundReason: refundReason.trim(),
        refundedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

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

      alert(
        'Unable to process the refund.'
      );
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <section className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="page-title">
          Payment Management
        </h1>

        <p className="muted mt-1">
          Review, verify and manage SmartHub payment
          transactions.
        </p>
      </div>

      {/* Admin Overview */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          icon={Clock}
          label="Needs Verification"
          value={pendingPayments.length}
          change="Action required"
        />

        <StatCard
          icon={CheckCircle}
          label="Completed Payments"
          value={completedPayments.length}
          change="Verified"
        />

        <StatCard
          icon={XCircle}
          label="Failed Payments"
          value={failedPayments.length}
          change="Rejected"
        />

        <StatCard
          icon={RotateCcw}
          label="Refunded Payments"
          value={refundedPayments.length}
          change="Processed"
        />

      </div>

      {/* Payments Requiring Verification */}
      <div className="overflow-hidden rounded-xl border border-yellow-200 bg-white shadow-sm dark:border-yellow-900 dark:bg-slate-900">

        <div className="border-b border-yellow-100 bg-yellow-50 p-5 dark:border-yellow-900 dark:bg-yellow-950/30">

          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900">
              <Clock className="h-5 w-5 text-yellow-700 dark:text-yellow-300" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Payments Requiring Verification
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                These payments require administrator review
                before they can be completed.
              </p>
            </div>

          </div>
        </div>

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
                  Payment Method
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
                    colSpan="5"
                    className="p-8 text-center text-slate-500"
                  >
                    Loading payments...
                  </td>
                </tr>

              ) : pendingPayments.length > 0 ? (

                pendingPayments.map((transaction) => (

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
                        {transaction.bookingId || 'N/A'}
                      </p>

                    </td>

                    <td className="p-4 font-medium">
                      $
                      {Number(
                        transaction.totalAmount || 0
                      ).toFixed(2)}
                    </td>

                    <td className="p-4">
                      {transaction.paymentMethod || 'N/A'}
                    </td>

                    <td className="p-4">
                      {formatDate(
                        transaction.createdAt
                      )}
                    </td>

                    <td className="p-4">

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedTransaction(
                            transaction
                          )
                        }
                        className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-medium text-white hover:bg-brand-700"
                      >
                        Review Payment
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center"
                  >

                    <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-500" />

                    <p className="font-medium">
                      No payments require verification
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      All pending payments have been reviewed.
                    </p>

                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* Transaction History */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <div className="border-b border-slate-200 p-5 dark:border-slate-800">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-lg font-semibold">
                Transaction History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                View and search all payment transactions.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">

                <Search className="h-4 w-4 text-slate-400" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(
                      event.target.value
                    )
                  }
                  placeholder="Search transactions..."
                  className="w-full bg-transparent text-sm outline-none sm:w-52"
                />

              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
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

              {filteredTransactions.length > 0 ? (

                filteredTransactions.map(
                  (transaction) => (

                    <tr
                      key={transaction.id}
                      className="border-t border-slate-100 dark:border-slate-800"
                    >

                      <td className="p-4 font-medium">
                        {transaction.id}
                      </td>

                      <td className="p-4">
                        $
                        {Number(
                          transaction.totalAmount || 0
                        ).toFixed(2)}
                      </td>

                      <td className="p-4">
                        {transaction.paymentMethod || 'N/A'}
                      </td>

                      <td className="p-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                            transaction.status
                          )}`}
                        >
                          {transaction.status || 'Unknown'}
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
                          onClick={() =>
                            setSelectedTransaction(
                              transaction
                            )
                          }
                          className="font-medium text-brand-600 hover:underline dark:text-brand-300"
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  )
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

      {/* Financial Summary */}
      <div>

        <h2 className="mb-4 text-lg font-semibold">
          Financial Summary
        </h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <DollarSign className="mb-3 h-6 w-6" />

            <p className="text-sm text-slate-500">
              Completed Revenue
            </p>

            <p className="mt-1 text-2xl font-bold">
              ${completedRevenue.toFixed(2)}
            </p>

          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <DollarSign className="mb-3 h-6 w-6" />

            <p className="text-sm text-slate-500">
              Admin Commission
            </p>

            <p className="mt-1 text-2xl font-bold">
              ${totalCommission.toFixed(2)}
            </p>

          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <DollarSign className="mb-3 h-6 w-6" />

            <p className="text-sm text-slate-500">
              Provider Earnings
            </p>

            <p className="mt-1 text-2xl font-bold">
              ${providerEarnings.toFixed(2)}
            </p>

          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <RotateCcw className="mb-3 h-6 w-6" />

            <p className="text-sm text-slate-500">
              Refunded Amount
            </p>

            <p className="mt-1 text-2xl font-bold">
              ${refundedAmount.toFixed(2)}
            </p>

          </div>

        </div>

      </div>

      {/* Payment Review Modal */}
      {selectedTransaction && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl dark:bg-slate-900">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">

              <div>

                <h2 className="text-lg font-semibold">
                  Payment Review
                </h2>

                <p className="text-sm text-slate-500">
                  Review transaction details before taking
                  action.
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
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Modal Content */}
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
                    {selectedTransaction.status}
                  </span>

                </div>

                <div>

                  <p className="text-xs uppercase text-slate-500">
                    Total Amount
                  </p>

                  <p className="mt-1 font-medium">
                    $
                    {Number(
                      selectedTransaction.totalAmount || 0
                    ).toFixed(2)}
                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase text-slate-500">
                    Payment Method
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedTransaction.paymentMethod || 'N/A'}
                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase text-slate-500">
                    Provider Amount
                  </p>

                  <p className="mt-1 font-medium">
                    $
                    {Number(
                      selectedTransaction.providerAmount || 0
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
                      selectedTransaction.commissionAmount || 0
                    ).toFixed(2)}
                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase text-slate-500">
                    Commission Rate
                  </p>

                  <p className="mt-1 font-medium">
                    {Number(
                      selectedTransaction.commissionRate || 0
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
                  {selectedTransaction.bookingId || 'N/A'}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase text-slate-500">
                  User ID
                </p>

                <p className="mt-1 break-all text-sm font-medium">
                  {selectedTransaction.userId || 'N/A'}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase text-slate-500">
                  Provider ID
                </p>

                <p className="mt-1 break-all text-sm font-medium">
                  {selectedTransaction.providerId || 'N/A'}
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

                </div>
              )}

            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 p-5 dark:border-slate-800">

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

              {/* Pending actions */}
              {selectedTransaction.status?.toLowerCase() ===
                'pending' && (
                <>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() =>
                      updateTransactionStatus(
                        selectedTransaction.id,
                        'failed'
                      )
                    }
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950"
                  >
                    {actionLoading
                      ? 'Updating...'
                      : 'Reject Payment'}
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() =>
                      updateTransactionStatus(
                        selectedTransaction.id,
                        'completed'
                      )
                    }
                    className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
                  >
                    {actionLoading
                      ? 'Updating...'
                      : 'Verify Payment'}
                  </button>
                </>
              )}

              {/* Refund action */}
              {selectedTransaction.status?.toLowerCase() ===
                'completed' && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() =>
                    setShowRefundModal(true)
                  }
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

            {/* Refund Header */}
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
                }}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                disabled={actionLoading}
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Refund Details */}
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
                      selectedTransaction.totalAmount || 0
                    ).toFixed(2)}
                  </span>

                </div>

              </div>

              {/* Reason */}
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
                    setRefundReason(
                      event.target.value
                    )
                  }
                  placeholder="Enter the reason for this refund..."
                  rows="4"
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800"
                />

              </div>

              {/* Warning */}
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-300">

                Please make sure the refund is authorised
                before confirming this action.

              </div>

            </div>

            {/* Refund Actions */}
            <div className="flex justify-end gap-3 border-t border-slate-200 p-5 dark:border-slate-800">

              <button
                type="button"
                onClick={() => {
                  setShowRefundModal(false);
                  setRefundReason('');
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