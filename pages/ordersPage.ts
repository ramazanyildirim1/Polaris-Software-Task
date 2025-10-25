import { Page, Locator, expect } from "@playwright/test";
import BasePage from "./basePage";

export default class OrdersPage extends BasePage {
  readonly ordersList: Locator;

  constructor(page: Page) {
    super(page);
    this.ordersList = page.getByRole("heading", {
      name: "Order",
      exact: true,
      level: 1,
    });
  }

  async clickRandomEditButton(): Promise<void> {
    await this.page.waitForLoadState("networkidle");

    const editButtons = this.page.locator("a.btn.btn-sm.btn-primary");
    const count = await editButtons.count();

    if (count === 0) {
      throw new Error("No Edit buttons found in the orders table.");
    }

    const randomIndex = Math.floor(Math.random() * count);
    await editButtons.nth(randomIndex).click();
  }

  async verifyOrdersPageLoaded(): Promise<void> {
    await this.isElementVisible(this.ordersList);
  }

  async verifyOrdersTable(): Promise<void> {
    const rows = this.page.locator("table.table-hover > tbody > tr");
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);

      const dateCell = row.locator("td").nth(2);
      const invoiceCell = row.locator("td").nth(0);
      const totalCell = row.locator("td").nth(4);

      await expect(invoiceCell).toBeVisible();
      await expect(await invoiceCell.textContent()).not.toBe("");

      await expect(dateCell).toBeVisible();
      await expect(await dateCell.textContent()).not.toBe("");

      await expect(totalCell).toBeVisible();
      await expect(await totalCell.textContent()).not.toBe("");
    }
  }
}