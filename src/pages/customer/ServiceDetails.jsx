
import {
  addDoc,
  collection,
  orderBy,
  query,
  serverTimestamp,
  where
} from 'firebase/firestore';

import {
  CalendarCheck,
  MapPin,
  Star
} from 'lucide-react';

import {
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  Link,
  useNavigate,
  useParams
} from 'react-router-dom';

import Badge from '../../components/Badge.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import useFirestoreQuery from '../../hooks/useFirestoreQuery.js';

import {
  createBooking,
  readDocument
} from '../../lib/firestore.js';

import { db } from '../../firebase.js';
import { useAuth } from '../../context/AuthContext.jsx';


// ========================================
// US-04: INPUT SANITIZATION
// ========================================

function sanitizeInput(input) {
  return String(input)
    .trim()
    .replace(/[\x00-\x1F\x7F]/g, ' ');
}


// ========================================
// US-04: REVIEW VALIDATION
// ========================================

function validateReview(comment) {
  const cleanComment = sanitizeInput(comment);

  if (!cleanComment) {
    return 'Please enter your review.';
  }

  if (cleanComment.length > 500) {
    return 'Review cannot exceed 500 characters.';
  }

  // Reject HTML-like input
  if (/[<>]/.test(cleanComment)) {
    return 'HTML tags or angle brackets are not allowed.';
  }

  return '';
}


// ========================================
// US-04: PAYMENT METHOD VALIDATION
// ========================================

const allowedPaymentMethods = [
  'Cash',
  'Bank Transfer',
  'Online Payment Placeholder'
];


export default function ServiceDetails({
  publicView = false
}) {

  const { id } = useParams();

  const navigate = useNavigate();

  const {
    currentUser,
    userProfile
  } = useAuth();

  const [service, setService] = useState(null);

  const [paymentMethod, setPaymentMethod] =
    useState('Cash');

  const [error, setError] = useState('');

  const [submitting, setSubmitting] =
    useState(false);

  const [review, setReview] = useState({
    rating: '5',
    comment: ''
  });

  // Security messages
  const [reviewError, setReviewError] =
    useState('');

  const [reviewSuccess, setReviewSuccess] =
    useState('');

  const [reviewSubmitting, setReviewSubmitting] =
    useState(false);


  // ========================================
  // LOAD SERVICE
  // ========================================

  useEffect(() => {

    readDocument('services', id)
      .then(setService)
      .catch((loadError) =>
        setError(loadError.message)
      );

  }, [id]);


  // ========================================
  // LOAD REVIEWS
  // ========================================

  const reviewsQuery = useMemo(() =>

    query(
      collection(db, 'reviews'),
      where('serviceId', '==', id),
      orderBy('createdAt', 'desc')
    ),

    [id]
  );


  // ========================================
  // LOAD COMPLETED BOOKINGS
  // ========================================

  const bookingsQuery = useMemo(() => (

    currentUser

      ? query(
          collection(db, 'bookings'),

          where('userId', '==', currentUser.uid),

          where('serviceId', '==', id),

          where('bookingStatus', '==', 'completed')
        )

      : null

  ), [currentUser, id]);


  const {
    items: reviews
  } = useFirestoreQuery(reviewsQuery, [id]);


  const {
    items: completedBookings
  } = useFirestoreQuery(
    bookingsQuery,
    [currentUser?.uid, id]
  );


  // ========================================
  // BOOKING FUNCTION
  // ========================================

  async function handleBooking(event) {

    event.preventDefault();

    if (!currentUser || !userProfile) {

      navigate('/login', {
        state: {
          from: `/services/${id}`
        }
      });

      return;
    }

    setError('');


    // SECURITY: Check payment method
    if (!allowedPaymentMethods.includes(paymentMethod)) {

      setError('Invalid payment method selected.');

      return;
    }


    // SECURITY: Check user role
    if (userProfile.role !== 'user') {

      setError('Only customers can book services.');

      return;
    }


    setSubmitting(true);

    try {

      // Keep original booking functionality
      await createBooking({
        service,
        user: userProfile,
        paymentMethod
      });

      navigate('/user/bookings');

    } catch (bookingError) {

      setError(bookingError.message);

    } finally {

      setSubmitting(false);

    }
  }


  // ========================================
  // US-04: SECURE REVIEW SUBMISSION
  // ========================================

  async function submitReview(event) {

    event.preventDefault();

    setReviewError('');
    setReviewSuccess('');


    // Check authentication
    if (!currentUser || !userProfile) {

      setReviewError('Please log in to submit a review.');

      return;
    }


    // Check user role
    if (userProfile.role !== 'user') {

      setReviewError('Only customers can submit reviews.');

      return;
    }


    // Check completed bookings
    if (!completedBookings.length) {

      setReviewError(
        'You must complete a booking before reviewing.'
      );

      return;
    }


    // Sanitize customer input
    const cleanComment = sanitizeInput(review.comment);


    // Validate review
    const validationError =
      validateReview(review.comment);

    if (validationError) {

      setReviewError(validationError);

      return;
    }


    // Validate rating
    const rating = Number(review.rating);

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {

      setReviewError('Please select a valid rating.');

      return;
    }


    setReviewSubmitting(true);

    try {

      // Save sanitized review
      await addDoc(collection(db, 'reviews'), {

        bookingId: completedBookings[0].id,

        serviceId: service.id,

        userId: currentUser.uid,

        providerId: service.providerId,

        rating,

        comment: cleanComment,

        createdAt: serverTimestamp()

      });


      setReview({
        rating: '5',
        comment: ''
      });

      setReviewSuccess(
        'Review submitted successfully!'
      );

    } catch (submitError) {

      console.error(
        'Review submission failed:',
        submitError
      );

      setReviewError(
        'Could not submit your review. Please try again.'
      );

    } finally {

      setReviewSubmitting(false);

    }
  }


  // ========================================
  // LOADING SCREEN
  // ========================================

  if (!service) {

    return (

      <section
        className={
          publicView
            ? 'min-h-screen bg-slate-50 p-6'
            : 'p-6'
        }
      >

        {error

          ? (
            <EmptyState
              title="Service not found"
              message={error}
            />
          )

          : (
            <p className="muted">
              Loading service...
            </p>
          )

        }

      </section>

    );
  }


  // ========================================
  // MAIN PAGE
  // ========================================

  return (

    <section
      className={
        publicView

          ? 'min-h-screen bg-slate-50 px-4 py-8 sm:px-6'

          : 'px-4 py-6 sm:px-6'
      }
    >

      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_360px]">

        {/* SERVICE DETAILS */}

        <article className="panel overflow-hidden">

          <div className="grid gap-2 bg-slate-100 p-2 sm:grid-cols-2">

            {(
              service.imageUrls?.length

                ? service.imageUrls

                : ['/favicon.svg']

            ).map((imageUrl) => (

              <img
                key={imageUrl}
                className="h-64 w-full rounded-lg object-cover"
                src={imageUrl}
                alt={service.title}
              />

            ))}

          </div>


          <div className="space-y-5 p-6">

            <div>

              <Badge>
                {
                  service.status === 'active'
                    ? 'Active'
                    : service.status
                }
              </Badge>

              <h1 className="mt-3 text-3xl font-bold tracking-normal text-slate-950">

                {service.title}

              </h1>

              <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">

                <MapPin className="h-4 w-4" />

                {service.location || 'Auckland'}

              </p>

            </div>


            <p className="text-slate-700">

              {service.description}

            </p>


            <div className="grid gap-3 sm:grid-cols-3">

              <div className="rounded-lg bg-brand-50 p-4">

                <p className="text-sm text-slate-500">
                  Price
                </p>

                <p className="text-2xl font-bold">

                  ${Number(service.price || 0).toFixed(2)}

                </p>

              </div>


              <div className="rounded-lg bg-slate-50 p-4">

                <p className="text-sm text-slate-500">
                  Category
                </p>

                <p className="font-semibold">

                  {service.categoryName}

                </p>

              </div>


              <div className="rounded-lg bg-slate-50 p-4">

                <p className="text-sm text-slate-500">
                  Provider
                </p>

                <p className="font-semibold">

                  {service.providerName}

                </p>

              </div>

            </div>

          </div>

        </article>


        {/* RIGHT SIDE */}

        <aside className="space-y-5">


          {/* BOOKING FORM */}

          <form
            onSubmit={handleBooking}
            className="panel space-y-4 p-5"
          >

            <h2 className="text-lg font-semibold text-slate-950">

              Book this service

            </h2>


            <label className="block space-y-1 text-sm font-medium">

              <span>
                Payment method
              </span>

              <select
                className="input"
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(event.target.value)
                }
              >

                <option>Cash</option>

                <option>Bank Transfer</option>

                <option>
                  Online Payment Placeholder
                </option>

              </select>

            </label>


            {error && (

              <p
                role="alert"
                className="text-sm text-rose-700"
              >

                {error}

              </p>

            )}


            {currentUser

              ? (

                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={
                    submitting ||
                    userProfile?.role !== 'user'
                  }
                >

                  <CalendarCheck className="h-4 w-4" />

                  {
                    submitting
                      ? 'Booking...'
                      : 'Request booking'
                  }

                </button>

              )

              : (

                <Link
                  className="btn-primary w-full"
                  to="/login"
                >

                  Login to book/contact

                </Link>

              )

            }

          </form>


          {/* REVIEWS */}

          <div className="panel space-y-4 p-5">

            <h2 className="text-lg font-semibold text-slate-950">

              Reviews

            </h2>


            {reviews.map((item) => (

              <div
                key={item.id}
                className="border-b border-slate-100 pb-3 last:border-0"
              >

                <p className="flex items-center gap-1 font-semibold">

                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />

                  {item.rating}/5

                </p>


                <p className="mt-1 text-sm text-slate-600">

                  {item.comment}

                </p>

              </div>

            ))}


            {!reviews.length && (

              <p className="muted">

                No reviews yet.

              </p>

            )}


            {/* REVIEW FORM */}

            {completedBookings.length > 0 && (

              <form
                onSubmit={submitReview}
                className="space-y-3 border-t border-slate-100 pt-4"
                noValidate
              >

                <h3 className="font-semibold text-slate-900">

                  Leave a review

                </h3>


                <label className="block space-y-1 text-sm font-medium">

                  <span>
                    Your rating
                  </span>

                  <select
                    className="input"
                    value={review.rating}
                    onChange={(event) =>

                      setReview({
                        ...review,
                        rating: event.target.value
                      })

                    }
                  >

                    {[5, 4, 3, 2, 1].map((rating) => (

                      <option key={rating}>

                        {rating}

                      </option>

                    ))}

                  </select>

                </label>


                <label className="block space-y-1 text-sm font-medium">

                  <span>
                    Your review
                  </span>

                  <textarea
                    className="input min-h-20"
                    placeholder="Leave a review"
                    value={review.comment}
                    maxLength={501}
                    onChange={(event) =>

                      setReview({
                        ...review,
                        comment: event.target.value
                      })

                    }
                  />

                </label>


                <p className="text-xs text-slate-500">

                  Maximum 500 characters.

                </p>


                {/* VALIDATION ERROR */}

                {reviewError && (

                  <p
                    role="alert"
                    className="rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-700"
                  >

                    {reviewError}

                  </p>

                )}


                {/* SUCCESS MESSAGE */}

                {reviewSuccess && (

                  <p className="rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700">

                    {reviewSuccess}

                  </p>

                )}


                <button
                  type="submit"
                  className="btn-muted w-full"
                  disabled={reviewSubmitting}
                >

                  {
                    reviewSubmitting
                      ? 'Submitting...'
                      : 'Submit review'
                  }

                </button>

              </form>

            )}

          </div>

        </aside>

      </div>

    </section>

  );
}
