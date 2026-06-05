import { collection, orderBy, query, where } from 'firebase/firestore';
import { BriefcaseBusiness, CalendarCheck, DollarSign, PlusCircle } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/StatCard.jsx';
import useFirestoreQuery from '../../hooks/useFirestoreQuery.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { db } from '../../firebase.js';

export default function ProviderDashboard() {
  const { userProfile } = useAuth();
  const servicesQuery = useMemo(() => query(collection(db, 'services'), where('providerId', '==', userProfile.uid), orderBy('createdAt', 'desc')), [userProfile.uid]);
  const bookingsQuery = useMemo(() => query(collection(db, 'bookings'), where('providerId', '==', userProfile.uid), orderBy('createdAt', 'desc')), [userProfile.uid]);
  const { items: services } = useFirestoreQuery(servicesQuery, [userProfile.uid]);
  const { items: bookings } = useFirestoreQuery(bookingsQuery, [userProfile.uid]);
  const completed = bookings.filter((booking) => booking.bookingStatus === 'completed');
  const gross = completed.reduce((sum, booking) => sum + Number(booking.servicePrice || 0), 0);
  const net = completed.reduce((sum, booking) => sum + Number(booking.providerEarning || 0), 0);

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="page-title">{userProfile.businessName || 'Provider dashboard'}</h1>
          <p className="muted mt-1">Manage services, bookings, and Auckland marketplace earnings.</p>
        </div>
        <Link className="btn-primary" to="/provider/services/new"><PlusCircle className="h-4 w-4" />Post service</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={BriefcaseBusiness} label="Posted services" value={services.length} change="Live" />
        <StatCard icon={CalendarCheck} label="Bookings" value={bookings.length} change="All" />
        <StatCard icon={DollarSign} label="Gross bookings" value={`$${gross.toFixed(2)}`} change="Done" />
        <StatCard icon={DollarSign} label="Net earnings" value={`$${net.toFixed(2)}`} change="90%" />
      </div>
    </section>
  );
}
