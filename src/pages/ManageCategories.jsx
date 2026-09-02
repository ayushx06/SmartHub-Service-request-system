import { addDoc, collection, doc, orderBy, query, serverTimestamp, updateDoc, writeBatch } from 'firebase/firestore';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import useFirestoreQuery from '../hooks/useFirestoreQuery.js';
import { logAdminAction } from '../lib/firestore.js';
import { db } from '../firebase.js';
import { useAuth } from '../context/AuthContext.jsx';
import { filterCategories } from '../utils/adminSearch.js';

export default function ManageCategories() {
  const { searchQuery = '' } = useOutletContext();
  const { currentUser, userProfile } = useAuth();
  const categoriesQuery = useMemo(() => query(collection(db, 'categories'), orderBy('name')), []);
  const { items: categories } = useFirestoreQuery(categoriesQuery, []);
  const [form, setForm] = useState({ name: '', description: '' });
  const filteredCategories = useMemo(() => filterCategories(categories, searchQuery), [categories, searchQuery]);

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

  async function deleteCategory(category) {
    const reason = window.prompt('Reason for deleting this category:')?.trim();
    if (!reason) return;

    try {
      const batch = writeBatch(db);
      batch.delete(doc(db, 'categories', category.id));
      logAdminAction({
        batch,
        admin: { currentUser, userProfile },
        action: 'CATEGORY_DELETED',
        targetType: 'category',
        targetId: category.id,
        targetName: category.name,
        reason,
        previousValue: { name: category.name || '', description: category.description || '', active: category.active ?? null },
        newValue: 'deleted',
      });
      await batch.commit();
    } catch (error) {
      console.error('Failed to delete category:', error);
      window.alert('The category could not be deleted. Please try again.');
    }
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
        {filteredCategories.map((category) => (
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
              <button className="btn-muted text-rose-700" onClick={() => deleteCategory(category)}>Delete</button>
            </div>
          </article>
        ))}
        {!categories.length && <EmptyState title="No categories" message="Create categories before providers post services." />}
        {!!categories.length && !filteredCategories.length && <EmptyState title="No categories match your search" message="Try a different category name or description." />}
      </div>
    </section>
  );
}
