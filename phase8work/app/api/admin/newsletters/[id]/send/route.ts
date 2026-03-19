import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: Request,
  context: RouteContext
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Newsletter id is required." },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      newsletterId: id,
      error:
        "Newsletter sending is not fully configured yet for this environment.",
    },
    { status: 501 }
  );
}