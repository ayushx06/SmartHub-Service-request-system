import { Search, Trash2, UserX } from 'lucide-react';
import { useMemo, useState } from 'react';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { users as userData } from '../data/mockData.js';

export default function Users() {
  const [users, setUsers] = useState(userData);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('All');

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesQuery = `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase());
      const matchesRole = role === 'All' || user.role === role;
      return matchesQuery && matchesRole;
    });
  }, [users, query, role]);

  function toggleBlock(id) {
    setUsers((current) => current.map((user) => (user.id === id ? { ...user, status: user.status === 'Blocked' ? 'Active' : 'Blocked' } : user)));
  }

  function deleteUser(id) {
    setUsers((current) => current.filter((user) => user.id !== id));
  }

  return (
    <div className="space-y-6">
      <PageHeader title="User Management" description="View customers and providers, filter accounts, and manage access." />

      <div className="panel p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input className="input pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or email" />
          </label>
          <select className="input" value={role} onChange={(event) => setRole(event.target.value)}>
            <option>All</option>
            <option>Customer</option>
            <option>Provider</option>
          </select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Joined</th>
                  <th className="px-5 py-3">Bookings</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <td className="px-5 py-4">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-slate-500">{user.email}</p>
                    </td>
                    <td className="px-5 py-4">{user.role}</td>
                    <td className="px-5 py-4">{user.joined}</td>
                    <td className="px-5 py-4">{user.bookings}</td>
                    <td className="px-5 py-4"><Badge>{user.status}</Badge></td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button className="btn-muted" onClick={() => toggleBlock(user.id)}><UserX className="h-4 w-4" />{user.status === 'Blocked' ? 'Unblock' : 'Block'}</button>
                        <button className="btn-muted text-rose-600" onClick={() => deleteUser(user.id)}><Trash2 className="h-4 w-4" />Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
