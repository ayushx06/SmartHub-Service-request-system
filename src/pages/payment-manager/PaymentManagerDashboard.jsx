import {
  CheckCircle,
  Clock,
  DollarSign,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { collection, orderBy, query } from 'firebase/firestore';
import { useMemo } from 'react';

import StatCard from '../../components/StatCard.jsx';
import useFirestoreQuery from '../../hooks/useFirestoreQuery.js';
import { db } from '../../firebase.js';

export default function PaymentManagerDashboard() {
  const transactionsQuery = useMemo(
    () =>
      query(
        collection(db, 'transactions'),
        orderBy('createdAt', 'desc')
      ),
    []
  );

  const { items: transactions, loading } =
    useFirestoreQuery(
      transactionsQuery,
      []
    );

  const pending = transactions.filter(
    (transaction) =>
      transaction.status?.toLowerCase() === 'pending'
  );

  const completed = transactions.filter(
    (transaction) =>
      transaction.status?.toLowerCase() === 'completed'
  );

  const failed = transactions.filter(
    (transaction) =>
      transaction.status?.toLowerCase() === 'failed'
  );

  const refunded = transactions.filter(
    (transaction) =>
      transaction.status?.toLowerCase() === 'refunded'
  );

  const revenue = completed.reduce(
    (sum, transaction) =>
      sum + Number(transaction.totalAmount || 0),
    0
  );

  const commission = completed.reduce(
    (sum, transaction) =>
      sum + Number(transaction.commissionAmount || 0),
    0
  );

  return (
    <section className="space-y-6">
      <div>
        <h1 className="page-title">
          Payment Manager Dashboard
        </h1>

        <p className="muted mt-1">
          Overview of SmartHub payment activity.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">
          Loading payment information...
        </p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={Clock}
              label="Needs Verification"
              value={pending.length}
              change="Action required"
            />

            <StatCard
              icon={CheckCircle}
              label="Completed Payments"
              value={completed.length}
              change="Verified"
            />

            <StatCard
              icon={XCircle}
              label="Failed Payments"
              value={failed.length}
              change="Rejected"
            />

            <StatCard
              icon={RotateCcw}
              label="Refunded Payments"
              value={refunded.length}
              change="Processed"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="panel p-5">
              <div className="flex items-center gap-3">
                <DollarSign className="h-6 w-6" />

                <div>
                  <p className="text-sm text-slate-500">
                    Completed Revenue
                  </p>

                  <p className="text-2xl font-bold">
                    ${revenue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="panel p-5">
              <div className="flex items-center gap-3">
                <DollarSign className="h-6 w-6" />

                <div>
                  <p className="text-sm text-slate-500">
                    Admin Commission
                  </p>

                  <p className="text-2xl font-bold">
                    ${commission.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}