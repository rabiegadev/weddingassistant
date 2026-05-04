import { runWeeklyFreePlannerResetAll } from "@/lib/planner/run-weekly-free-reset";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Tygodniowy reset danych planera dla kont na planie darmowym.
 * Ochrona: `Authorization: Bearer ${CRON_SECRET}` (np. Vercel Cron).
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const r = await runWeeklyFreePlannerResetAll();
  return NextResponse.json({ ok: true, ...r });
}
