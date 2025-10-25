import { Page, Locator, expect } from "@playwright/test";
import BasePage from "././basePage";

export default class HomePage extends BasePage {
  readonly allProducts: Locator;
  readonly cartIcon: Locator;
  readonly homeLinkButton: Locator;
  readonly noResultsText: Locator;
  readonly ordersLinkButton: Locator;
  readonly searchBar: Locator;
  readonly searchResultsText: Locator;
  readonly signInLinkButton: Locator;
  readonly signOutButton: Locator;
  readonly userName: Locator;

  constructor(page: Page) {
    super(page);
    this.allProducts = page.getByTestId(/^product-/);
    this.cartIcon = page.getByTestId("nav-cart");
    this.homeLinkButton = page.getByTestId("nav-home");
    this.noResultsText = page.getByTestId("no-results");
    this.ordersLinkButton = page.getByTestId("nav-admin-orders");
    this.searchBar = page.getByTestId("search-query");
    this.searchResultsText = page.getByTestId("search-caption");
    this.signInLinkButton = page.getByTestId("nav-sign-in");
    this.signOutButton = page.getByTestId("nav-sign-out");
    this.userName = page.getByTestId("nav-menu");
  }

  async clearAllCategories(): Promise<void> {
    const labels = await this.page
      .locator('label:has(input[type="checkbox"])')
      .allTextContents();
    for (const label of labels) {
      const categoryCheckbox = this.page.getByLabel(label.trim(), {
        exact: true,
      });
      if (await categoryCheckbox.isChecked()) {
        await categoryCheckbox.uncheck();
      }
    }
  }

  async clickCartIcon(): Promise<void> {
    await this.expectVisible(this.cartIcon);
    await Promise.all([
      this.cartIcon.click(),
      this.page.waitForLoadState("networkidle"),
      await expect(this.page).toHaveURL(
        "https://practicesoftwaretesting.com/checkout"
      ),
    ]);
  }

  async clickHomeLinkButton(): Promise<void> {
    await this.clickElement(this.homeLinkButton);
  }

  async clickOrdersLinkButton(): Promise<void> {
    await this.clickElement(this.userName);
    await this.clickElement(this.ordersLinkButton);
  }

  async clickSignInLinkButton(): Promise<void> {
    await this.clickElement(this.signInLinkButton);
  }

  async clickSignOutButton(): Promise<void> {
    await this.clickElement(this.userName);
    await this.clickElement(this.signOutButton);
  }

  async filterToolsByCategory(...categories: string[]): Promise<void> {
    for (const category of categories) {
      const categoryCheckbox = this.page.getByLabel(category, { exact: true });
      await categoryCheckbox.check();
      await expect(categoryCheckbox).toBeChecked();
    }
  }

  async verifyCategoriesAreChecked(...categories: string[]): Promise<void> {
  for (const category of categories) {
    const categoryCheckbox = this.page.getByLabel(category, { exact: true });
    await expect(categoryCheckbox).toBeChecked({
    });
    console.log(`Category "${category}" is checked`);
  }
}

  async searchForProduct(productName: string): Promise<void> {
    await this.typeText(this.searchBar, productName);
    await this.page.keyboard.press("Enter");
    await this.page.waitForLoadState("networkidle");
  }

  async selectCardByName(productName: string): Promise<void> {
    const totalPages = 5;
    const pagination = this.page.locator("ul.pagination");
    const allProducts = this.page.getByTestId(/^product-/);

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      await allProducts.first().waitFor({ state: "visible", timeout: 10000 });
      const count = await allProducts.count();

      for (let i = 0; i < count; i++) {
        const card = allProducts.nth(i);
        const nameLocator = card.locator('[data-test="product-name"]');
        const hasName = await nameLocator.count();

        if (hasName === 0) {
          continue;
        }

        const nameText = (await nameLocator.textContent())?.trim() || "";
        console.log(`   → Checking product: "${nameText}"`);

        if (nameText.toLowerCase() === productName.trim().toLowerCase()) {
          console.log(` Found "${productName}" on Page ${pageNum}`);
          await card.scrollIntoViewIfNeeded();
          await card.click({ timeout: 5000 });
          await expect(this.page).toHaveURL(/\/product\//);
          return;
        }
      }

      if (pageNum < totalPages) {
        const nextPageNum = String(pageNum + 1);
        console.log(` Going to next page (${nextPageNum})...`);
        const nextButton = pagination.locator(`text=${nextPageNum}`);
        await expect(nextButton).toBeVisible({ timeout: 5000 });

        const firstBefore = await allProducts
          .first()
          .locator('[data-test="product-name"]')
          .textContent();
        await nextButton.click();
        await this.page.waitForFunction((prevText) => {
          const el = document.querySelector('[data-test="product-name"]');
          return el && el.textContent?.trim() !== prevText?.trim();
        }, firstBefore);
        await this.page.waitForLoadState("networkidle");
      }
    }

    throw new Error(`Product with name "${productName}" not found on any page`);
  }

  async verifyAllProductsVisible(): Promise<void> {
    const num = await this.allProducts.count();
    for (let i = 0; i < num; i++) {
      const card = this.allProducts.nth(i);
      await expect(card).toBeVisible();
    }
  }

  async verifyFilterCategoriesDisplayed(
    ...categories: string[]
  ): Promise<void> {
    for (const category of categories) {
      const categoryLocator = this.page.getByLabel(category, { exact: true });
      await this.expectVisible(categoryLocator);
    }
  }

  async verifyNoSearchResultsDisplayed(): Promise<void> {
    await this.expectVisible(this.noResultsText);
  }

  async verifyProductDetailPage(expectedName: string): Promise<void> {
    console.log(`Verifying product detail page for "${expectedName}"...`);
    await expect(this.page).toHaveURL(/\/product\//, { timeout: 15000 });
    const nameLocator = this.page.locator('[data-test="product-name"]');
    await expect(nameLocator).toBeVisible({ timeout: 10000 });
    const actualText = (await nameLocator.textContent())?.trim() || "";
    console.log(`Found product name: "${actualText}"`);
    await expect(nameLocator).toHaveText(new RegExp(expectedName, "i"));
    console.log("Product detail page verified successfully!");
  }

  async verifyPaginatedProductCardsAndNavigate(): Promise<void> {
    const totalPages = 5;
    const pagination = this.page.locator("ul.pagination");
    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      await this.page.evaluate(() => window.scrollTo(0, 0));
      await this.verifyAllProductsVisible();

      if (currentPage < totalPages) {
        await this.page.evaluate(() =>
          window.scrollTo(0, document.body.scrollHeight)
        );
        const nextPageNum = String(currentPage + 1);
        await pagination.getByText(nextPageNum, { exact: true }).click();
        await this.page.waitForLoadState();
      } else if (currentPage === totalPages) {
        await this.allProducts.first().click();
        await expect(this.page).toHaveURL(/\/product\//);
      }
    }
  }

  async verifySearchBarIsAvailable(): Promise<void> {
    await this.isElementEditable(this.searchBar);
    await this.isElementVisible(this.searchBar);
  }

  async verifySearchResultsDisplayed(): Promise<void> {
    await this.expectVisible(this.searchResultsText);
  }
  async refreshPage(): Promise<void> {
    await this.page.reload();
  }
}