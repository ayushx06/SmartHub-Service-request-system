import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  DollarSign,
  RefreshCcw,
  XCircle,
} from 'lucide-react';
import { db } from '../../firebase.js';

function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatDate(timestamp) {
  if (!timestamp?.toDate) return 'N/A';

  return timestamp.toDate().toLocaleDateString();
}

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-950">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-slate-500">
              {description}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-brand-50 p-3 text-brand-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function PaymentReports() {
  const [transactions, setTransactions] = useState([]);
  const [reportPeriod, setReportPeriod] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTransactions() {
      try {
        setLoading(true);
        setError('');

        const transactionsQuery = query(
          collection(db, 'transactions'),
          orderBy('createdAt', 'desc'),
        );

        const snapshot = await getDocs(transactionsQuery);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTransactions(data);
      } catch (loadError) {
        console.error('Failed to load financial reports:', loadError);
        setError('Unable to load financial report data.');
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, []);

  const reportTransactions = useMemo(() => {
    const now = new Date();

    return transactions.filter((transaction) => {
      if (reportPeriod === 'all') {
        return true;
      }

      if (!transaction.createdAt?.toDate) {
        return false;
      }

      const transactionDate = transaction.createdAt.toDate();

      if (reportPeriod === 'month') {
        return (
          transactionDate.getFullYear() === now.getFullYear() &&
          transactionDate.getMonth() === now.getMonth()
        );
      }

      if (reportPeriod === 'year') {
        return transactionDate.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [transactions, reportPeriod]);

  const reportData = useMemo(() => {
    const completed = reportTransactions.filter(
      (transaction) => transaction.status === 'completed',
    );

    const pending = reportTransactions.filter(
      (transaction) => transaction.status === 'pending',
    );

    const failed = reportTransactions.filter(
      (transaction) => transaction.status === 'failed',
    );

    const refunded = reportTransactions.filter(
      (transaction) => transaction.status === 'refunded',
    );

    const revenue = completed.reduce(
      (total, transaction) =>
        total + Number(transaction.totalAmount || 0),
      0,
    );

    const commission = completed.reduce(
      (total, transaction) =>
        total + Number(transaction.commissionAmount || 0),
      0,
    );

    const providerEarnings = completed.reduce(
      (total, transaction) =>
        total + Number(transaction.providerAmount || 0),
      0,
    );

    const refundedAmount = refunded.reduce(
      (total, transaction) =>
        total + Number(transaction.totalAmount || 0),
      0,
    );

    return {
      completed,
      pending,
      failed,
      refunded,
      revenue,
      commission,
      providerEarnings,
      refundedAmount,
    };
  }, [reportTransactions]);

  if (loading) {
    return (
      <section>
        <h1 className="page-title">
          Financial Reports
        </h1>

        <p className="muted mt-1">
          Review SmartHub financial performance.
        </p>

        <div className="panel mt-6 p-6 text-sm text-slate-600">
          Loading financial report data...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h1 className="page-title">
          Financial Reports
        </h1>

        <p className="muted mt-1">
          Review SmartHub financial performance.
        </p>

        <div className="mt-6 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="page-title">
            Financial Reports
          </h1>

          <p className="muted mt-1">
            Review SmartHub financial performance.
          </p>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          <span className="mb-1 block">
            Report period
          </span>

          <select
            className="input min-w-44"
            value={reportPeriod}
            onChange={(event) =>
              setReportPeriod(event.target.value)
            }
          >
            <option value="all">
              All time
            </option>

            <option value="month">
              This month
            </option>

            <option value="year">
              This year
            </option>
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Completed Revenue"
          value={formatCurrency(reportData.revenue)}
          icon={DollarSign}
          description={`${reportData.completed.length} completed payments`}
        />

        <StatCard
          title="Admin Commission"
          value={formatCurrency(reportData.commission)}
          icon={BarChart3}
          description="Commission earned by SmartHub"
        />

        <StatCard
          title="Provider Earnings"
          value={formatCurrency(reportData.providerEarnings)}
          icon={CheckCircle2}
          description="Amount paid to providers"
        />

        <StatCard
          title="Refunded Amount"
          value={formatCurrency(reportData.refundedAmount)}
          icon={RefreshCcw}
          description={`${reportData.refunded.length} refunded payments`}
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard
          title="Pending Payments"
          value={reportData.pending.length}
          icon={Clock3}
          description="Waiting for verification"
        />

        <StatCard
          title="Failed Payments"
          value={reportData.failed.length}
          icon={XCircle}
          description="Payments that were rejected"
        />

        <StatCard
          title="Total Transactions"
          value={reportTransactions.length}
          icon={BarChart3}
          description="Transactions in selected period"
        />
      </div>

      <div className="panel mt-6 overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-950">
            Report Summary
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Financial overview for the selected period.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left">
                <th className="px-5 py-3 font-semibold text-slate-600">
                  Metric
                </th>

                <th className="px-5 py-3 font-semibold text-slate-600">
                  Value
                </th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3 text-slate-600">
                  Completed revenue
                </td>

                <td className="px-5 py-3 font-semibold text-slate-950">
                  {formatCurrency(reportData.revenue)}
                </td>
              </tr>

              <tr className="border-b border-slate-100">
                <td className="px-5 py-3 text-slate-600">
                  Admin commission
                </td>

                <td className="px-5 py-3 font-semibold text-slate-950">
                  {formatCurrency(reportData.commission)}
                </td>
              </tr>

              <tr className="border-b border-slate-100">
                <td className="px-5 py-3 text-slate-600">
                  Provider earnings
                </td>

                <td className="px-5 py-3 font-semibold text-slate-950">
                  {formatCurrency(reportData.providerEarnings)}
                </td>
              </tr>

              <tr>
                <td className="px-5 py-3 text-slate-600">
                  Refunded amount
                </td>

                <td className="px-5 py-3 font-semibold text-slate-950">
                  {formatCurrency(reportData.refundedAmount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel mt-6 overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-950">
            Transaction Breakdown
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Transactions included in this report.
          </p>
        </div>

        {reportTransactions.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            No transactions found for this period.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">
                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Transaction
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Amount
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Status
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {reportTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-5 py-3 font-medium text-slate-950">
                      {transaction.id}
                    </td>

                    <td className="px-5 py-3 text-slate-600">
                      {formatCurrency(transaction.totalAmount)}
                    </td>

                    <td className="px-5 py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700">
                        {transaction.status || 'unknown'}
                      </span>
                    </td>

                    <td className="px-5 py-3 text-slate-600">
                      {formatDate(transaction.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}