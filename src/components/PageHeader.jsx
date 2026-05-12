export default function PageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="muted mt-1">{description}</p>
      </div>
      {action}
    </div>
  );
}
