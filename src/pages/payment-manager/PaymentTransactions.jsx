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
  orderBy,
  query,
} from 'firebase/firestore';

import useFirestoreQuery from '../../hooks/useFirestoreQuery.js';
import { db } from '../../firebase.js';

export default function PaymentTransactions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTransaction, setSelectedTransaction] =
    useState(null);

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
                            onClick={() =>
                              setSelectedTransaction(
                                transaction
                              )
                            }
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

              {selectedTransaction.refundReason && (
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
                  <p className="text-xs uppercase text-slate-500">
                    Refund Reason
                  </p>

                  <p className="mt-1 text-sm">
                    {selectedTransaction.refundReason}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-slate-200 p-5 dark:border-slate-800">
              <button
                type="button"
                onClick={() =>
                  setSelectedTransaction(null)
                }
                className="btn-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}