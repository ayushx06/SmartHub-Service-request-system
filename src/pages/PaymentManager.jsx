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
import { collection, doc, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';

import StatCard from '../components/StatCard.jsx';
import useFirestoreQuery from '../hooks/useFirestoreQuery.js';
import { db } from '../firebase.js';

export default function PaymentManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

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

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const search = searchQuery.toLowerCase();

      const transactionId = transaction.id?.toLowerCase() || '';
      const userId = transaction.userId?.toLowerCase() || '';
      const bookingId = transaction.bookingId?.toLowerCase() || '';

      const matchesSearch =
        transactionId.includes(search) ||
        userId.includes(search) ||
        bookingId.includes(search);

      const matchesStatus =
        statusFilter === 'All' ||
        transaction.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchQuery, statusFilter]);

  const completedPayments = transactions.filter(
    (transaction) => transaction.status?.toLowerCase() === 'completed'
  );

  const pendingPayments = transactions.filter(
    (transaction) => transaction.status?.toLowerCase() === 'pending'
  );

  const failedPayments = transactions.filter(
    (transaction) => transaction.status?.toLowerCase() === 'failed'
  );

  const refundedPayments = transactions.filter(
    (transaction) => transaction.status?.toLowerCase() === 'refunded'
  );

  const totalRevenue = completedPayments.reduce(
    (sum, transaction) =>
      sum + Number(transaction.totalAmount || 0),
    0
  );

  const totalCommission = completedPayments.reduce(
    (sum, transaction) =>
      sum + Number(transaction.commissionAmount || 0),
    0
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

  async function updateTransactionStatus(id, newStatus) {
    try {
      setActionLoading(true);

      const transactionRef = doc(db, 'transactions', id);

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
      console.error('Error updating transaction:', error);
      alert('Unable to update the payment status.');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <section className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="page-title">Payment Management</h1>

        <p className="muted mt-1">
          Manage transactions, verify payments, handle refunds and view
          financial reports.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          change="Completed"
        />

        <StatCard
          icon={CheckCircle}
          label="Completed Payments"
          value={completedPayments.length}
          change="Completed"
        />

        <StatCard
          icon={Clock}
          label="Pending Payments"
          value={pendingPayments.length}
          change="Review"
        />

        <StatCard
          icon={XCircle}
          label="Failed Payments"
          value={failedPayments.length}
          change="Failed"
        />

      </div>

      {/* Transactions */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <div className="border-b border-slate-200 p-5 dark:border-slate-800">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-lg font-semibold">
                Transactions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review and manage payment transactions from Firestore.
              </p>
            </div>

            {/* Search and filter */}
            <div className="flex flex-col gap-3 sm:flex-row">

              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">

                <Search className="h-4 w-4 text-slate-400" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Search transaction..."
                  className="w-full bg-transparent text-sm outline-none sm:w-52"
                />

              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>

            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-slate-50 dark:bg-slate-800">

              <tr>
                <th className="p-4 text-left">Transaction</th>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Payment Method</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Action</th>
              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center text-slate-500"
                  >
                    Loading transactions...
                  </td>
                </tr>

              ) : filteredTransactions.length > 0 ? (

                filteredTransactions.map((transaction) => (

                  <tr
                    key={transaction.id}
                    className="border-t border-slate-100 dark:border-slate-800"
                  >

                    <td className="p-4 font-medium">
                      {transaction.id}
                    </td>

                    <td className="p-4">
                      {transaction.userId
                        ? `${transaction.userId.slice(0, 8)}...`
                        : 'N/A'}
                    </td>

                    <td className="p-4">
                      ${Number(transaction.totalAmount || 0).toFixed(2)}
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
                      {formatDate(transaction.createdAt)}
                    </td>

                    <td className="p-4">

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedTransaction(transaction)
                        }
                        className="font-medium text-brand-600 hover:text-brand-700 hover:underline dark:text-brand-300"
                      >
                        View
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center text-sm text-slate-500"
                  >
                    No transactions found.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* Payment Functions */}
      <div className="grid gap-4 md:grid-cols-3">

        {/* Verify */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <CheckCircle className="mb-3 h-6 w-6" />

          <h2 className="font-semibold">
            Verify Payments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review pending payments and verify transactions.
          </p>

          <p className="mt-4 text-sm font-medium">
            {pendingPayments.length} payment
            {pendingPayments.length !== 1 ? 's' : ''} waiting for review
          </p>

        </div>

        {/* Refunds */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <RotateCcw className="mb-3 h-6 w-6" />

          <h2 className="font-semibold">
            Refunds
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review and manage refunded transactions.
          </p>

          <p className="mt-4 text-sm font-medium">
            {refundedPayments.length} refunded transaction
            {refundedPayments.length !== 1 ? 's' : ''}
          </p>

        </div>

        {/* Reports */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <DollarSign className="mb-3 h-6 w-6" />

          <h2 className="font-semibold">
            Financial Reports
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            View revenue, commissions and payment statistics.
          </p>

          <div className="mt-4 space-y-1 text-sm">
            <p>
              Revenue:{' '}
              <span className="font-semibold">
                ${totalRevenue.toFixed(2)}
              </span>
            </p>

            <p>
              Commission:{' '}
              <span className="font-semibold">
                ${totalCommission.toFixed(2)}
              </span>
            </p>
          </div>

        </div>

      </div>

      {/* Transaction Modal */}
      {selectedTransaction && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl dark:bg-slate-900">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">

              <div>

                <h2 className="text-lg font-semibold">
                  Transaction Details
                </h2>

                <p className="text-sm text-slate-500">
                  Review payment information and manage its status.
                </p>

              </div>

              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close transaction details"
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
                    Commission
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
                    Date
                  </p>

                  <p className="mt-1 font-medium">
                    {formatDate(selectedTransaction.createdAt)}
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

            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 p-5 dark:border-slate-800">

              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                className="btn-muted"
                disabled={actionLoading}
              >
                Close
              </button>

              {selectedTransaction.status?.toLowerCase() === 'pending' && (
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
                    {actionLoading ? 'Updating...' : 'Reject Payment'}
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
                    {actionLoading ? 'Updating...' : 'Verify Payment'}
                  </button>
                </>
              )}

              {selectedTransaction.status?.toLowerCase() === 'completed' && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() =>
                    updateTransactionStatus(
                      selectedTransaction.id,
                      'refunded'
                    )
                  }
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Processing...' : 'Refund Payment'}
                </button>
              )}

            </div>

          </div>

        </div>

      )}

    </section>
  );
}