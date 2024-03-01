import { query } from "@/lib/db";

export async function GET(request: Request) {
  // from get Request
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  return new Response("Not implemented", { status: 501 });
}
