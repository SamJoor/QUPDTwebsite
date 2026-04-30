import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { importAdminAlumni } from "@/lib/actions/admin-persist";
import { parseCsv } from "@/lib/utils/csv";
import { normalizeAlumniImportRecord } from "@/lib/imports/alumni";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await requireSession("admin");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = (await request.formData()) as any;

  const getString = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };

  let csvText = getString("csvText");
  const fileValue = formData.get("file");
  const file =
    fileValue &&
    typeof fileValue === "object" &&
    "text" in fileValue
      ? (fileValue as File)
      : null;

  if (!csvText && file) {
    csvText = await file.text();
  }

  if (!csvText.trim()) {
    return NextResponse.json(
      { error: "Provide a CSV file or pasted CSV text." },
      { status: 400 }
    );
  }

  const records = parseCsv(csvText);
  if (!records.length) {
    return NextResponse.json(
      { error: "No CSV rows were found." },
      { status: 400 }
    );
  }

  const normalized = [];

  for (const record of records) {
    const parsed = normalizeAlumniImportRecord(record);

    if (!parsed.data) {
      return NextResponse.json(
        {
          error: parsed.error || "Invalid CSV row.",
        },
        { status: 400 }
      );
    }

    normalized.push(parsed.data);
  }

  const result = await importAdminAlumni(normalized);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    message: `Imported ${result.count ?? normalized.length} alumni records successfully.`,
  });
}
