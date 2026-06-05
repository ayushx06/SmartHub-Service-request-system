import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebase.js';

export const commissionRate = 0.1;

export function collectionQuery(name, constraints = []) {
  return query(collection(db, name), ...constraints);
}

export function activeServicesQuery() {
  return query(collection(db, 'services'), where('status', '==', 'active'), orderBy('createdAt', 'desc'));
}

export async function uploadServiceImages(providerId, files) {
  const uploads = Array.from(files || []).map(async (file) => {
    const path = `services/${providerId}/${Date.now()}-${file.name}`;
    const snapshot = await uploadBytes(ref(storage, path), file);
    return getDownloadURL(snapshot.ref);
  });

  return Promise.all(uploads);
}

export async function createBooking({ service, user, paymentMethod }) {
  const price = Number(service.price || 0);
  const commissionAmount = Number((price * commissionRate).toFixed(2));
  const providerEarning = Number((price - commissionAmount).toFixed(2));

  const bookingRef = await addDoc(collection(db, 'bookings'), {
    userId: user.uid,
    userName: user.fullName || user.email,
    providerId: service.providerId,
    serviceId: service.id,
    serviceTitle: service.title,
    servicePrice: price,
    commissionRate,
    commissionAmount,
    providerEarning,
    paymentMethod,
    bookingStatus: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await addDoc(collection(db, 'transactions'), {
    bookingId: bookingRef.id,
    userId: user.uid,
    providerId: service.providerId,
    totalAmount: price,
    commissionRate,
    commissionAmount,
    providerAmount: providerEarning,
    paymentMethod,
    status: 'pending',
    createdAt: serverTimestamp(),
  });

  return bookingRef.id;
}

export async function approveProvider(uid) {
  await Promise.all([
    updateDoc(doc(db, 'users', uid), { status: 'approved', updatedAt: serverTimestamp() }),
    updateDoc(doc(db, 'providers', uid), { verificationStatus: 'approved', adminNote: '', updatedAt: serverTimestamp() }),
  ]);
}

export async function rejectProvider(uid, adminNote = '') {
  await Promise.all([
    updateDoc(doc(db, 'users', uid), { status: 'rejected', updatedAt: serverTimestamp() }),
    updateDoc(doc(db, 'providers', uid), { verificationStatus: 'rejected', adminNote, updatedAt: serverTimestamp() }),
  ]);
}

export async function setBookingStatus(booking, status) {
  await updateDoc(doc(db, 'bookings', booking.id), {
    bookingStatus: status,
    updatedAt: serverTimestamp(),
  });

  if (status === 'completed') {
    await Promise.all([
      updateDoc(doc(db, 'providers', booking.providerId), {
        totalEarnings: increment(Number(booking.providerEarning || 0)),
        totalCommissionPaid: increment(Number(booking.commissionAmount || 0)),
        updatedAt: serverTimestamp(),
      }),
      addDoc(collection(db, 'notifications'), {
        userId: booking.userId,
        title: 'Booking completed',
        message: `${booking.serviceTitle} has been marked as completed.`,
        read: false,
        createdAt: serverTimestamp(),
      }),
    ]);
  }
}

export async function readDocument(collectionName, id) {
  const snapshot = await getDoc(doc(db, collectionName, id));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function removeDocument(collectionName, id) {
  await deleteDoc(doc(db, collectionName, id));
}
