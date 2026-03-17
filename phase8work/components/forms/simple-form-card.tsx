export function SimpleFormCard({ title, description, fields }: { title: string; description: string; fields: string[] }) {
  return (
    <div className="surface p-6">
      <h3 className="text-2xl">{title}</h3>
      <p className="mt-3">{description}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field} className="rounded-2xl border border-black/5 bg-fraternity-cream px-4 py-3 text-sm text-fraternity-slate">
            {field}
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm text-fraternity-slate">This starter includes the UI layout and route scaffolding. You can wire this form to Supabase or a provider next.</p>
    </div>
  );
}
