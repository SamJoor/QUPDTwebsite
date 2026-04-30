import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function getFileKind(path?: string | null) {
  if (!path) return "unknown";
  const lower = path.toLowerCase();

  if (
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".png") ||
    lower.endsWith(".webp")
  ) {
    return "image";
  }

  if (lower.endsWith(".pdf")) {
    return "pdf";
  }

  return "other";
}

export default async function AdminLegacyReviewPage() {
  const supabase = getSupabaseAdmin();

  const { data: submissions, error } = await supabase
    .from("legacy_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="p-8">
        <p className="text-red-700">
          Failed to load legacy submissions: {error.message}
        </p>
      </main>
    );
  }

  const submissionsWithPreview = await Promise.all(
    (submissions || []).map(async (item) => {
      let previewUrl: string | null = item.file_url || null;

      if (!previewUrl && item.storage_bucket && item.storage_path) {
        const signed = await supabase.storage
          .from(item.storage_bucket)
          .createSignedUrl(item.storage_path, 60 * 60);

        previewUrl = signed.data?.signedUrl || null;
      }

      return {
        ...item,
        previewUrl,
        fileKind: getFileKind(item.storage_path || item.file_url),
      };
    })
  );

  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="surface mb-8 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">
            Admin Module
          </p>
          <h1 className="mt-4 text-4xl">Legacy review queue</h1>
          <p className="mt-4 max-w-3xl text-fraternity-slate">
            Review submitted memories and artifacts. Approved submissions stay queued until the
            submitter&apos;s chosen release date, then the memory is emailed back to them
            automatically.
          </p>
        </div>

        <div className="grid gap-6">
          {submissionsWithPreview.length ? (
            submissionsWithPreview.map((item) => (
              <div key={item.id} className="surface p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <h2 className="text-2xl">{item.title}</h2>
                    <p className="text-sm text-fraternity-slate">
                      <strong>{item.full_name}</strong> · {item.email}
                    </p>
                    <p className="text-sm text-fraternity-slate">
                      {item.graduation_term} {item.graduation_year} · status:{" "}
                      <strong>{item.status}</strong>
                    </p>
                    <p className="text-sm text-fraternity-slate">
                      Requested release date: {new Date(item.release_at).toLocaleDateString()}
                    </p>

                    {item.previewUrl ? (
                      <a
                        href={item.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex text-sm font-medium text-fraternity-burgundy underline"
                      >
                        Open attachment
                      </a>
                    ) : null}
                  </div>

                  <div className="flex gap-3">
                    {item.status === "submitted" ? (
                      <>
                        <form
                          action={`/api/admin/legacy-review/${item.id}/approve`}
                          method="post"
                        >
                          <button className="rounded-full bg-emerald-600 px-5 py-2.5 font-medium text-white">
                            Approve
                          </button>
                        </form>

                        <form
                          action={`/api/admin/legacy-review/${item.id}/decline`}
                          method="post"
                        >
                          <button className="rounded-full bg-red-700 px-5 py-2.5 font-medium text-white">
                            Decline
                          </button>
                        </form>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-white/70 p-4">
                  <p className="whitespace-pre-wrap text-fraternity-charcoal">
                    {item.memory_body}
                  </p>
                </div>

                {item.previewUrl ? (
                  <div className="mt-5 rounded-2xl border border-fraternity-charcoal/10 bg-white/70 p-4">
                    <p className="mb-3 text-sm font-semibold text-fraternity-charcoal">
                      Attachment preview
                    </p>

                    {item.fileKind === "image" ? (
                      <img
                        src={item.previewUrl}
                        alt={item.title}
                        className="max-h-[28rem] w-full rounded-2xl object-contain ring-1 ring-black/5"
                      />
                    ) : item.fileKind === "pdf" ? (
                      <iframe
                        src={item.previewUrl}
                        title={`Preview of ${item.title}`}
                        className="h-[36rem] w-full rounded-2xl ring-1 ring-black/5"
                      />
                    ) : (
                      <div className="rounded-2xl bg-fraternity-cream p-4 text-sm text-fraternity-slate">
                        This attachment type does not support inline preview. Use the "Open
                        attachment" link above.
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="surface p-8">
              <p className="text-fraternity-slate">No submissions yet.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
