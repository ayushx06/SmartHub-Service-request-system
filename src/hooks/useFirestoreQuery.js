import { onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function useFirestoreQuery(queryRef, deps = []) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(Boolean(queryRef));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!queryRef) {
      setItems([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot) => {
        setItems(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
        setError('');
        setLoading(false);
      },
      (firestoreError) => {
        console.error(firestoreError);
        setError(firestoreError.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, deps);

  return { error, items, loading };
}
