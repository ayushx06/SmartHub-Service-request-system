import { MapPin, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ServiceCard({ service, toPrefix = '/services' }) {
  const image = service.imageUrls?.[0] || '/favicon.svg';

  return (
    <article className="panel overflow-hidden">
      <div className="aspect-[4/3] bg-slate-100">
        <img className="h-full w-full object-cover" src={image} alt={service.title} />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-normal text-brand-700">{service.categoryName || 'Service'}</p>
            <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-slate-950">{service.title}</h3>
          </div>
          <p className="shrink-0 text-lg font-bold text-slate-950">${Number(service.price || 0).toFixed(0)}</p>
        </div>
        <p className="line-clamp-2 text-sm text-slate-600">{service.description}</p>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{service.location || 'Auckland'}</span>
          <span className="inline-flex items-center gap-1"><Tag className="h-3.5 w-3.5" />{service.providerName || 'Verified provider'}</span>
        </div>
        <Link className="btn-primary w-full" to={`${toPrefix}/${service.id}`}>View details</Link>
      </div>
    </article>
  );
}
