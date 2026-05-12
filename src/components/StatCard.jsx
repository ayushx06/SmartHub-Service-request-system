import { ArrowUpRight } from 'lucide-react';

export default function StatCard({ label, value, change, icon: Icon }) {
  return (
    <div className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-brand-50 p-2 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
          <Icon className="h-5 w-5" />
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <ArrowUpRight className="h-3.5 w-3.5" />
          {change}
        </span>
      </div>
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
