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

test("strona główna — nagłówek hero widoczny (mobile)", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "tylko projekt mobile");
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Twoje wsparcie przedweselne online/i })
  ).toBeVisible();
  await expect(page.getByText("Weddingassistant", { exact: false }).first()).toBeVisible();
});
