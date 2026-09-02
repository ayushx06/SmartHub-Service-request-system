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
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase.js';

export const commissionRate = 0.1;

export function collectionQuery(name, constraints = []) {
  return query(collection(db, name), ...constraints);
}

export function activeServicesQuery() {
  return query(collection(db, 'services'), where('status', '==', 'active'), orderBy('createdAt', 'desc'));
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

export function logAdminAction({ batch, admin, action, targetType, targetId, targetName, reason, previousValue, newValue }) {
  const auditRef = doc(collection(db, 'adminAuditLogs'));
  const auditData = {
    adminId: admin?.currentUser?.uid || admin?.userProfile?.uid || '',
    adminName: admin?.userProfile?.fullName || admin?.currentUser?.displayName || 'Admin',
    adminEmail: admin?.currentUser?.email || admin?.userProfile?.email || '',
    action,
    targetType,
    targetId,
    targetName: targetName || '',
    reason,
    previousValue: previousValue ?? null,
    newValue: newValue ?? null,
    createdAt: serverTimestamp(),
  };

  if (batch) {
    batch.set(auditRef, auditData);
    return auditRef;
  }

  return addDoc(collection(db, 'adminAuditLogs'), auditData);
}

export async function approveProvider(provider, admin, reason) {
  const batch = writeBatch(db);
  const updatedAt = serverTimestamp();
  batch.update(doc(db, 'users', provider.id), { status: 'approved', updatedAt });
  batch.update(doc(db, 'providers', provider.id), { verificationStatus: 'approved', adminNote: '', updatedAt });
  logAdminAction({
    batch,
    admin,
    action: 'PROVIDER_APPROVED',
    targetType: 'provider',
    targetId: provider.id,
    targetName: provider.businessName || provider.ownerName,
    reason,
    previousValue: provider.verificationStatus,
    newValue: 'approved',
  });
  await batch.commit();
}

export async function rejectProvider(provider, admin, adminNote) {
  const batch = writeBatch(db);
  const updatedAt = serverTimestamp();
  batch.update(doc(db, 'users', provider.id), { status: 'rejected', updatedAt });
  batch.update(doc(db, 'providers', provider.id), { verificationStatus: 'rejected', adminNote, updatedAt });
  logAdminAction({
    batch,
    admin,
    action: 'PROVIDER_REJECTED',
    targetType: 'provider',
    targetId: provider.id,
    targetName: provider.businessName || provider.ownerName,
    reason: adminNote,
    previousValue: provider.verificationStatus,
    newValue: 'rejected',
  });
  await batch.commit();
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
