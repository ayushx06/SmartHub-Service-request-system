import {
  CheckCircle,
  Clock,
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
  writeBatch,
} from 'firebase/firestore';

import useFirestoreQuery from '../../hooks/useFirestoreQuery.js';
import { db } from '../../firebase.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function PaymentVerification() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const { currentUser, userProfile } = useAuth();

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

  const pendingPayments = transactions.filter(
    (transaction) =>
      transaction.status?.toLowerCase() === 'pending'
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
      setActionError('');

      if (!currentUser || !userProfile) {
        setActionError(
          'Unable to verify your account. Please log in again.'
        );
        return;
      }

      const transactionRef = doc(
        db,
        'transactions',
        id
      );

      const auditLogRef = doc(
        collection(db, 'adminAuditLogs')
      );

      const action =
        newStatus === 'completed'
          ? 'VERIFY_PAYMENT'
          : 'REJECT_PAYMENT';

      const batch = writeBatch(db);

      // Update the payment transaction
      batch.update(transactionRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

      // Create an immutable audit log
      batch.set(auditLogRef, {
        userId: currentUser.uid,
        userRole: userProfile.role,
        action,
        transactionId: id,
        timestamp: serverTimestamp(),
      });

      // Both operations succeed or fail together
      await batch.commit();

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
        'Error updating transaction or creating audit log:',
        error
      );

      if (error.code === 'permission-denied') {
        setActionError(
          'You do not have permission to update this payment.'
        );
      } else {
        setActionError(
          'Unable to update the payment status. Please try again.'
        );
      }
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">
          Payment Verification
        </h1>

        <p className="muted mt-1">
          Review pending payments and verify or reject
          transactions.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="panel p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-950">
              <Clock className="h-5 w-5 text-yellow-700 dark:text-yellow-300" />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Pending Verification
              </p>

              <p className="mt-1 text-2xl font-bold">
                {pendingPayments.length}
              </p>
            </div>
          </div>
        </div>

        <div className="panel p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-950">
              <CheckCircle className="h-5 w-5 text-green-700 dark:text-green-300" />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Verification Required
              </p>

              <p className="mt-1 text-2xl font-bold">
                {pendingPayments.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Payments */}
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
                        onClick={() => {
                          setActionError('');
                          setSelectedTransaction(transaction);
                        }}
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
                      All pending payments have been
                      reviewed.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl dark:bg-slate-900">
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
                onClick={() => {
                  setActionError('');
                  setSelectedTransaction(null);
                }}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                disabled={actionLoading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {actionError && (
                <div
                  role="alert"
                  className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                >
                  {actionError}
                </div>
              )}

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

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 p-5 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setActionError('');
                  setSelectedTransaction(null);
                }}
                className="btn-muted"
                disabled={actionLoading}
              >
                Close
              </button>

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
            </div>
          </div>
        </div>
      )}
    </section>
  );
}