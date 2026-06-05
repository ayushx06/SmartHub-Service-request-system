import { collection, orderBy, query, where } from 'firebase/firestore';
import { DollarSign, HandCoins, Receipt } from 'lucide-react';
import { useMemo } from 'react';
import StatCard from '../components/StatCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import useFirestoreQuery from '../hooks/useFirestoreQuery.js';
import { useAuth } from '../context/AuthContext.jsx';
import { db } from '../firebase.js';

export default function Earnings({ providerView = false }) {
  const { userProfile } = useAuth();
  const transactionsQuery = useMemo(() => {
    const constraints = providerView
      ? [where('providerId', '==', userProfile.uid), orderBy('createdAt', 'desc')]
      : [orderBy('createdAt', 'desc')];
    return query(collection(db, 'transactions'), ...constraints);
  }, [providerView, userProfile.uid]);
  const { items: transactions } = useFirestoreQuery(transactionsQuery, [providerView, userProfile.uid]);
  const total = transactions.reduce((sum, item) => sum + Number(item.totalAmount || 0), 0);
  const commission = transactions.reduce((sum, item) => sum + Number(item.commissionAmount || 0), 0);
  const providerAmount = transactions.reduce((sum, item) => sum + Number(item.providerAmount || 0), 0);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="page-title">{providerView ? 'Earnings' : 'Earnings and commissions'}</h1>
        <p className="muted mt-1">10% admin commission is calculated when customers book services.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={Receipt} label="Total booking amount" value={`$${total.toFixed(2)}`} change="Gross" />
        <StatCard icon={HandCoins} label="Admin commission" value={`$${commission.toFixed(2)}`} change="10%" />
        <StatCard icon={DollarSign} label="Provider net earning" value={`$${providerAmount.toFixed(2)}`} change="90%" />
      </div>

      <div className="panel overflow-hidden">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="grid gap-3 border-b border-slate-100 p-5 last:border-0 md:grid-cols-4">
            <p className="font-semibold text-slate-950">Booking {transaction.bookingId}</p>
            <p>Total ${Number(transaction.totalAmount || 0).toFixed(2)}</p>
            <p>Commission ${Number(transaction.commissionAmount || 0).toFixed(2)}</p>
            <p>Provider ${Number(transaction.providerAmount || 0).toFixed(2)}</p>
          </div>
        ))}
        {!transactions.length && <div className="p-5"><EmptyState title="No transactions" message="Transactions are created when customers book services." /></div>}
      </div>
    </section>
  );
}
