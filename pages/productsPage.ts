import { Page, Locator, expect } from "@playwright/test";
import BasePage from "././basePage";

export default class ProductsPage extends BasePage {
    readonly addToCartButton: Locator;
    readonly cartCounter: Locator;
    readonly productName: Locator;

    constructor(page: Page) {
        super(page);
        this.addToCartButton = page.getByTestId("add-to-cart");
        this.productName = page.getByTestId("product-name");
        this.cartCounter = page.locator('[data-test="cart-count"]');
    }

    async verifyAddToCartButtonVisibleAndEnabled(): Promise<void> {
        await this.isElementVisible(this.addToCartButton);
        await this.isElementEnabled(this.addToCartButton);
    }

    async verifyCartCount(expectedCount: number): Promise<void> {
        console.log(`Verifying cart count = ${expectedCount}`);
        await expect(this.cartCounter).toHaveText(String(expectedCount));
    }

    async verifyProductDetailPage(expectedName: string): Promise<void> {
        console.log(`Verifying product detail page for "${expectedName}"...`);
        await expect(this.page).toHaveURL(/\/product\//, { timeout: 15000 });
        const nameLocator = this.page.locator('[data-test="product-name"]');
        await expect(nameLocator).toBeVisible({ timeout: 10000 });
        const actualText = (await nameLocator.textContent())?.trim() || "";
        console.log(` Found product name: "${actualText}"`);
        await expect(nameLocator).toHaveText(new RegExp(expectedName, "i"));
        console.log("Product detail page verified successfully!");
    }

    async clickAddToCart(): Promise<void> {
        console.log(' Clicking "Add to Cart" button..');
        await this.addToCartButton.click();
        console.log("Product added to cart.");
    }
}