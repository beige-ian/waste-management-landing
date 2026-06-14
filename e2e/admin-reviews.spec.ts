import { test, expect } from "@playwright/test";

test.describe("후기 검수 어드민", () => {
  test("보류 탭은 전체 카운트를 유지하면서 보류 건만 보여준다", async ({ page }) => {
    await page.goto("/admin/reviews");

    await expect(page.getByText("대형폐기물 제출 후기")).toBeVisible();
    await expect(page.getByText("전체 제출").locator("..")).toContainText("10건");

    await page.getByRole("button", { name: /보류\s+1/ }).click();

    await expect(page.locator("article")).toHaveCount(1);
    await expect(page.getByText("AI 추가 확인 권장")).toBeVisible();
    await page.screenshot({
      path: "output/playwright/admin-reviews-live-preflight-webkit.png",
      fullPage: true,
    });
  });

  test("인증 실패는 빈 목록이 아니라 로그인 필요 상태로 보여준다", async ({ page }) => {
    await page.route("**/api/admin/review-submissions?**", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: "인증이 필요합니다" }),
      });
    });

    await page.goto("/admin/reviews");

    await expect(page.getByText("관리자 로그인이 필요합니다")).toBeVisible();
    await expect(page.getByText("제출된 후기가 없습니다")).not.toBeVisible();
    await page.screenshot({
      path: "output/playwright/admin-reviews-auth-error-webkit.png",
      fullPage: true,
    });
  });
});
