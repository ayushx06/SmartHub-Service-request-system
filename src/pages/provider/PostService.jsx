import { addDoc, collection, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { UploadCloud } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFirestoreQuery from '../../hooks/useFirestoreQuery.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { db } from '../../firebase.js';

export default function PostService() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const categoriesQuery = useMemo(() => query(collection(db, 'categories'), where('active', '==', true), orderBy('name')), []);
  const { items: categories } = useFirestoreQuery(categoriesQuery, []);
  const [form, setForm] = useState({ title: '', description: '', categoryId: '', price: '', location: '', imageUrl: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const imageUrl = form.imageUrl.trim();

    if (imageUrl && !imageUrl.startsWith('http')) {
      setError('Please enter a valid image URL.');
      return;
    }

    setSubmitting(true);

    try {
      const category = categories.find((item) => item.id === form.categoryId);
      await addDoc(collection(db, 'services'), {
        providerId: userProfile.uid,
        providerName: userProfile.businessName || userProfile.fullName,
        title: form.title,
        description: form.description,
        categoryId: form.categoryId,
        categoryName: category?.name || '',
        price: Number(form.price),
        location: form.location,
        imageUrls: imageUrl ? [imageUrl] : [],
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      navigate('/provider/services');
    } catch (postError) {
      setError(postError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="page-title">Post service</h1>
        <p className="muted mt-1">Approved providers can publish services with image URLs.</p>
      </div>

      <form onSubmit={handleSubmit} className="panel max-w-3xl space-y-5 p-6">
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <label className="block space-y-1 text-sm font-medium">
          <span>Service title</span>
          <input className="input" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        </label>
        <label className="block space-y-1 text-sm font-medium">
          <span>Description</span>
          <textarea className="input min-h-32" required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block space-y-1 text-sm font-medium">
            <span>Category</span>
            <select className="input" required value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}>
              <option value="">Select category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          <label className="block space-y-1 text-sm font-medium">
            <span>Price</span>
            <input className="input" type="number" min="0" step="0.01" required value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
          </label>
          <label className="block space-y-1 text-sm font-medium">
            <span>Location</span>
            <input className="input" required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
          </label>
        </div>
        <label className="block space-y-1 text-sm font-medium">
          <span>Image URL</span>
          <input className="input" placeholder="Paste Cloudinary image URL here" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
        </label>
        {form.imageUrl.trim() ? (
          <img className="h-40 w-full rounded-lg object-cover" src={form.imageUrl.trim()} alt="Service preview" />
        ) : (
          <div className="flex h-40 items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500">Image preview</div>
        )}
        <button className="btn-primary" disabled={submitting}>
          <UploadCloud className="h-4 w-4" />
          {submitting ? 'Publishing...' : 'Publish service'}
        </button>
      </form>
    </section>
  );
}
