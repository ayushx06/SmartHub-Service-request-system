import { addDoc, collection, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { CalendarCheck, MapPin, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Badge from '../../components/Badge.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import useFirestoreQuery from '../../hooks/useFirestoreQuery.js';
import { createBooking, readDocument } from '../../lib/firestore.js';
import { db } from '../../firebase.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ServiceDetails({ publicView = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [service, setService] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [review, setReview] = useState({ rating: '5', comment: '' });

  useEffect(() => {
    readDocument('services', id).then(setService).catch((loadError) => setError(loadError.message));
  }, [id]);

  const reviewsQuery = useMemo(() => query(collection(db, 'reviews'), where('serviceId', '==', id), orderBy('createdAt', 'desc')), [id]);
  const bookingsQuery = useMemo(() => (
    currentUser ? query(collection(db, 'bookings'), where('userId', '==', currentUser.uid), where('serviceId', '==', id), where('bookingStatus', '==', 'completed')) : null
  ), [currentUser, id]);
  const { items: reviews } = useFirestoreQuery(reviewsQuery, [id]);
  const { items: completedBookings } = useFirestoreQuery(bookingsQuery, [currentUser?.uid, id]);

  async function handleBooking(event) {
    event.preventDefault();
    if (!currentUser || !userProfile) {
      navigate('/login', { state: { from: `/services/${id}` } });
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await createBooking({ service, user: userProfile, paymentMethod });
      navigate('/user/bookings');
    } catch (bookingError) {
      setError(bookingError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function submitReview(event) {
    event.preventDefault();
    if (!completedBookings.length) return;

    await addDoc(collection(db, 'reviews'), {
      bookingId: completedBookings[0].id,
      serviceId: service.id,
      userId: userProfile.uid,
      providerId: service.providerId,
      rating: Number(review.rating),
      comment: review.comment,
      createdAt: serverTimestamp(),
    });
    setReview({ rating: '5', comment: '' });
  }

  if (!service) {
    return (
      <section className={publicView ? 'min-h-screen bg-slate-50 p-6' : 'p-6'}>
        {error ? <EmptyState title="Service not found" message={error} /> : <p className="muted">Loading service...</p>}
      </section>
    );
  }

  return (
    <section className={publicView ? 'min-h-screen bg-slate-50 px-4 py-8 sm:px-6' : 'px-4 py-6 sm:px-6'}>
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_360px]">
        <article className="panel overflow-hidden">
          <div className="grid gap-2 bg-slate-100 p-2 sm:grid-cols-2">
            {(service.imageUrls?.length ? service.imageUrls : ['/favicon.svg']).map((imageUrl) => (
              <img key={imageUrl} className="h-64 w-full rounded-lg object-cover" src={imageUrl} alt={service.title} />
            ))}
          </div>
          <div className="space-y-5 p-6">
            <div>
              <Badge>{service.status === 'active' ? 'Active' : service.status}</Badge>
              <h1 className="mt-3 text-3xl font-bold tracking-normal text-slate-950">{service.title}</h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-600"><MapPin className="h-4 w-4" />{service.location || 'Auckland'}</p>
            </div>
            <p className="text-slate-700">{service.description}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-brand-50 p-4"><p className="text-sm text-slate-500">Price</p><p className="text-2xl font-bold">${Number(service.price || 0).toFixed(2)}</p></div>
              <div className="rounded-lg bg-slate-50 p-4"><p className="text-sm text-slate-500">Category</p><p className="font-semibold">{service.categoryName}</p></div>
              <div className="rounded-lg bg-slate-50 p-4"><p className="text-sm text-slate-500">Provider</p><p className="font-semibold">{service.providerName}</p></div>
            </div>
          </div>
        </article>

        <aside className="space-y-5">
          <form onSubmit={handleBooking} className="panel space-y-4 p-5">
            <h2 className="text-lg font-semibold text-slate-950">Book this service</h2>
            <label className="block space-y-1 text-sm font-medium">
              <span>Payment method</span>
              <select className="input" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                <option>Cash</option>
                <option>Bank Transfer</option>
                <option>Online Payment Placeholder</option>
              </select>
            </label>
            {error && <p className="text-sm text-rose-700">{error}</p>}
            {currentUser ? (
              <button className="btn-primary w-full" disabled={submitting || userProfile?.role !== 'user'}>
                <CalendarCheck className="h-4 w-4" />
                {submitting ? 'Booking...' : 'Request booking'}
              </button>
            ) : (
              <Link className="btn-primary w-full" to="/login">Login to book/contact</Link>
            )}
          </form>

          <div className="panel space-y-4 p-5">
            <h2 className="text-lg font-semibold text-slate-950">Reviews</h2>
            {reviews.map((item) => (
              <div key={item.id} className="border-b border-slate-100 pb-3 last:border-0">
                <p className="flex items-center gap-1 font-semibold"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{item.rating}/5</p>
                <p className="mt-1 text-sm text-slate-600">{item.comment}</p>
              </div>
            ))}
            {!reviews.length && <p className="muted">No reviews yet.</p>}
            {completedBookings.length > 0 && (
              <form onSubmit={submitReview} className="space-y-3 border-t border-slate-100 pt-4">
                <select className="input" value={review.rating} onChange={(event) => setReview({ ...review, rating: event.target.value })}>
                  {[5, 4, 3, 2, 1].map((rating) => <option key={rating}>{rating}</option>)}
                </select>
                <textarea className="input min-h-20" placeholder="Leave a review" value={review.comment} onChange={(event) => setReview({ ...review, comment: event.target.value })} required />
                <button className="btn-muted w-full">Submit review</button>
              </form>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
