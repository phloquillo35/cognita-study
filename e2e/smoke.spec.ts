import { test, expect } from "@playwright/test";

test("home has h1", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1").first()).toBeVisible({ timeout: 15000 });
  await expect(page.locator("h1").first()).toContainText(/carrera|Cognita|potenciada/i);
});

test("flashcards has flip or add", async ({ page }) => {
  await page.goto("/flashcards");
  // h1 Flashcards + at least one button/card action
  await expect(page.getByRole("heading", { name: /flashcards/i }).first()).toBeVisible({ timeout: 15000 });
  // check for add/create/flip affordance
  const addOrFlip = page.locator("button, [data-testid='flip']").first();
  await expect(addOrFlip).toBeVisible({ timeout: 10000 });
});

test("notes has search", async ({ page }) => {
  await page.goto("/notes");
  await expect(page.getByPlaceholder("Buscar notas...")).toBeVisible({ timeout: 15000 });
});

test("tutor has input", async ({ page }) => {
  await page.goto("/tutor");
  await expect(page.getByPlaceholder("Escribí tu pregunta...")).toBeVisible({ timeout: 15000 });
});

test("calendar has grid", async ({ page }) => {
  await page.goto("/calendar");
  await expect(page.getByText("Lun").first()).toBeVisible({ timeout: 15000 });
  // grid with 7 columns
  await expect(page.locator("div.grid.grid-cols-7").first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole("button", { name: /exportar/i }).first()).toBeVisible({ timeout: 10000 });
});
