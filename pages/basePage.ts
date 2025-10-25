import { Locator, Page, expect } from "@playwright/test";

export default class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // -------- Navigations --------

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  // -------- Actions --------

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getURL(): Promise<string> {
    return this.page.url();
  }

  async getElementText(locator: Locator): Promise<string> {
    await expect(locator).toBeVisible();
    const text = await locator.textContent();
    return (text ?? "").trim();
  }

  async clickElement(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible({ timeout: 5000 });
    await expect(locator).toBeEnabled({ timeout: 5000 });
    await locator.click();
  }

  async typeText(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  async selectOption(
    selectLocator: Locator,
    optionValue: string
  ): Promise<void> {
    await selectLocator.selectOption(optionValue);
    expect(await selectLocator.inputValue()).toBe(optionValue);
  }

  // -------- State checks (booleans) --------
  async isElementVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async isElementEnabled(locator: Locator): Promise<boolean> {
    return locator.isEnabled();
  }

  async isElementEditable(locator: Locator): Promise<boolean> {
    return locator.isEditable();
  }

  // -------- Assertions --------

  async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }
}