import { collection, orderBy, query, where } from 'firebase/firestore';
import { BriefcaseBusiness, CalendarCheck, DollarSign, ShieldCheck, Users } from 'lucide-react';
import { useMemo } from 'react';
import StatCard from '../components/StatCard.jsx';
import useFirestoreQuery from '../hooks/useFirestoreQuery.js';
import { db } from '../firebase.js';

export default function Dashboard() {
  const usersQuery = useMemo(() => query(collection(db, 'users'), orderBy('createdAt', 'desc')), []);
  const providersQuery = useMemo(() => query(collection(db, 'providers'), orderBy('createdAt', 'desc')), []);
  const pendingProvidersQuery = useMemo(() => query(collection(db, 'providers'), where('verificationStatus', '==', 'pending')), []);
  const servicesQuery = useMemo(() => query(collection(db, 'services'), orderBy('createdAt', 'desc')), []);
  const bookingsQuery = useMemo(() => query(collection(db, 'bookings'), orderBy('createdAt', 'desc')), []);
  const transactionsQuery = useMemo(() => query(collection(db, 'transactions'), orderBy('createdAt', 'desc')), []);

  const { items: users } = useFirestoreQuery(usersQuery, []);
  const { items: providers } = useFirestoreQuery(providersQuery, []);
  const { items: pendingProviders } = useFirestoreQuery(pendingProvidersQuery, []);
  const { items: services } = useFirestoreQuery(servicesQuery, []);
  const { items: bookings } = useFirestoreQuery(bookingsQuery, []);
  const { items: transactions } = useFirestoreQuery(transactionsQuery, []);
  const commission = transactions.reduce((sum, transaction) => sum + Number(transaction.commissionAmount || 0), 0);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="page-title">Admin dashboard</h1>
        <p className="muted mt-1">Live SmartHub system overview from Firestore.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Users} label="Total users" value={users.length} change="Live" />
        <StatCard icon={ShieldCheck} label="Providers" value={providers.length} change="All" />
        <StatCard icon={ShieldCheck} label="Pending provider requests" value={pendingProviders.length} change="Review" />
        <StatCard icon={BriefcaseBusiness} label="Services" value={services.length} change="Posted" />
        <StatCard icon={CalendarCheck} label="Bookings" value={bookings.length} change="All" />
        <StatCard icon={DollarSign} label="Total commission" value={`$${commission.toFixed(2)}`} change="10%" />
      </div>
    </section>
  );
}
