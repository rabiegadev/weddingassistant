import { test, expect } from "@playwright/test";

test("strona główna ładuje tytuł", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Weddingassistant/i);
});

test("api health odpowiada ok", async ({ request }) => {
  const r = await request.get("/api/health");
  expect(r.ok()).toBeTruthy();
  const j = (await r.json()) as { status: string };
  expect(j.status).toBe("ok");
});
