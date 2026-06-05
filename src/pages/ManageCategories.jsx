import { addDoc, collection, doc, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import useFirestoreQuery from '../hooks/useFirestoreQuery.js';
import { removeDocument } from '../lib/firestore.js';
import { db } from '../firebase.js';

export default function ManageCategories() {
  const categoriesQuery = useMemo(() => query(collection(db, 'categories'), orderBy('name')), []);
  const { items: categories } = useFirestoreQuery(categoriesQuery, []);
  const [form, setForm] = useState({ name: '', description: '' });

  async function handleSubmit(event) {
    event.preventDefault();
    await addDoc(collection(db, 'categories'), {
      name: form.name,
      description: form.description,
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    setForm({ name: '', description: '' });
  }

  async function updateCategory(category, values) {
    await updateDoc(doc(db, 'categories', category.id), { ...values, updatedAt: serverTimestamp() });
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <form onSubmit={handleSubmit} className="panel h-fit space-y-4 p-5">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="muted mt-1">Create, edit, deactivate, or delete marketplace categories.</p>
        </div>
        <input className="input" required placeholder="Category name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <textarea className="input min-h-24" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        <button className="btn-primary w-full"><Plus className="h-4 w-4" />Create category</button>
      </form>

      <div className="space-y-3">
        {categories.map((category) => (
          <article key={category.id} className="panel grid gap-3 p-4 lg:grid-cols-[1fr_180px]">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <input className="input max-w-md font-semibold" value={category.name} onChange={(event) => updateCategory(category, { name: event.target.value })} />
                <Badge>{category.active ? 'Active' : 'Paused'}</Badge>
              </div>
              <textarea className="input min-h-20" value={category.description || ''} onChange={(event) => updateCategory(category, { description: event.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <button className="btn-muted" onClick={() => updateCategory(category, { active: !category.active })}>{category.active ? 'Deactivate' : 'Activate'}</button>
              <button className="btn-muted text-rose-700" onClick={() => removeDocument('categories', category.id)}>Delete</button>
            </div>
          </article>
        ))}
        {!categories.length && <EmptyState title="No categories" message="Create categories before providers post services." />}
      </div>
    </section>
  );
}
