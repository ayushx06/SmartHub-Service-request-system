import { DollarSign, CheckCircle, Clock, XCircle, RotateCcw } from 'lucide-react';
import StatCard from '../components/StatCard.jsx';

export default function PaymentManager() {
  const transactions = [
    {
      id: 'TX001',
      customer: 'Juan',
      amount: 150,
      status: 'Completed',
      date: '18 Aug 2026',
    },
    {
      id: 'TX002',
      customer: 'Ayush',
      amount: 80,
      status: 'Pending',
      date: '18 Aug 2026',
    },
    {
      id: 'TX003',
      customer: 'Mandeep',
      amount: 200,
      status: 'Failed',
      date: '17 Aug 2026',
    },
  ];

  const getStatusClass = (status) => {
    if (status === 'Completed') {
      return 'text-green-600 bg-green-100';
    }

    if (status === 'Pending') {
      return 'text-yellow-600 bg-yellow-100';
    }

    return 'text-red-600 bg-red-100';
  };

  return (
    <section className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="page-title">Payment Management</h1>
        <p className="muted mt-1">
          Manage transactions, verify payments, handle refunds and view financial reports.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value="$430.00"
          change="Live"
        />

        <StatCard
          icon={CheckCircle}
          label="Completed Payments"
          value="1"
          change="Completed"
        />

        <StatCard
          icon={Clock}
          label="Pending Payments"
          value="1"
          change="Review"
        />

        <StatCard
          icon={XCircle}
          label="Failed Payments"
          value="1"
          change="Failed"
        />

      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">

        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            Recent Transactions
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Review and manage recent payment transactions.
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">Transaction</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Action</th>
              </tr>
            </thead>

            <tbody>

              {transactions.map((transaction) => (

                <tr
                  key={transaction.id}
                  className="border-t border-gray-100"
                >

                  <td className="p-4 font-medium">
                    {transaction.id}
                  </td>

                  <td className="p-4">
                    {transaction.customer}
                  </td>

                  <td className="p-4">
                    ${transaction.amount.toFixed(2)}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </span>

                  </td>

                  <td className="p-4">
                    {transaction.date}
                  </td>

                  <td className="p-4">

                    <button className="text-blue-600 hover:underline">
                      View
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Payment Functions */}
      <div className="grid gap-4 md:grid-cols-3">

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">

          <CheckCircle className="mb-3" />

          <h2 className="font-semibold">
            Verify Payments
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Review pending payments and verify completed transactions.
          </p>

          <button className="mt-4 text-blue-600 hover:underline">
            Review Payments
          </button>

        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">

          <RotateCcw className="mb-3" />

          <h2 className="font-semibold">
            Refunds
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Review refund requests and manage refunded transactions.
          </p>

          <button className="mt-4 text-blue-600 hover:underline">
            Manage Refunds
          </button>

        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">

          <DollarSign className="mb-3" />

          <h2 className="font-semibold">
            Financial Reports
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            View revenue, commissions and payment statistics.
          </p>

          <button className="mt-4 text-blue-600 hover:underline">
            View Reports
          </button>

        </div>

      </div>

    </section>
  );
}