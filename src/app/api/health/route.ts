import { NextResponse } from "next/server";

/**
 * Szybki test połączenia (Postman, monitoring) — nie ujawnia wersji zależności w produkcji
 * (można później dodać wersję tylko dla zalogowanego admina).
 */
export function GET() {
  return NextResponse.json({ status: "ok" as const });
}
