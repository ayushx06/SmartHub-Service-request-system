import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No records found', message = 'Try changing your search or filters.' }) {
  return (
    <div className="panel flex min-h-52 flex-col items-center justify-center p-8 text-center">
      <Inbox className="h-10 w-10 text-slate-400" aria-hidden="true" />
      <h3 className="mt-3 text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
