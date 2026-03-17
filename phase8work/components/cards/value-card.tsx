export function ValueCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="surface p-8">
      <h3 className="text-2xl">{title}</h3>
      <p className="mt-4">{description}</p>
    </div>
  );
}
