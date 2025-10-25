import { Page, Locator, expect } from "@playwright/test";
import BasePage from "./basePage";

export default class EditPage extends BasePage {
    readonly cityInput: Locator;
    readonly countryInput: Locator;
    readonly invoiceDateInput: Locator;
    readonly invoiceNumberInput: Locator;
    readonly invoiceTotalInput: Locator;
    readonly paymentMethod: Locator;
    readonly postalCodeInput: Locator;
    readonly stateInput: Locator;
    readonly streetInput: Locator;

    constructor(page: Page) {
        super(page);
        this.cityInput = page.getByTestId("city");
        this.countryInput = page.getByTestId("country");
        this.invoiceDateInput = page.getByTestId("invoice-date");
        this.invoiceNumberInput = page.getByTestId("invoice-number");
        this.invoiceTotalInput = page.getByTestId("invoice-total");
        this.paymentMethod = page.getByTestId("payment-method");
        this.postalCodeInput = page.getByTestId("postal_code");
        this.stateInput = page.getByTestId("state");
        this.streetInput = page.getByTestId("street");
    }

    async verifyBillingAddressIsDisplayed(): Promise<void> {
        await this.expectVisible(this.streetInput);
        await expect(await this.streetInput.inputValue()).not.toBe("");

        await this.expectVisible(this.postalCodeInput);
        await expect(await this.postalCodeInput.inputValue()).not.toBe("");

        await this.expectVisible(this.cityInput);
        await expect(await this.cityInput.inputValue()).not.toBe("");

        await this.expectVisible(this.stateInput);
        await expect(await this.stateInput.inputValue()).not.toBe("");

        await this.expectVisible(this.countryInput);
        await expect(await this.countryInput.inputValue()).not.toBe("");
    }

    async verifyGeneralInformationIsDisplayed(): Promise<void> {
        await this.expectVisible(this.invoiceNumberInput);
        await expect(await this.invoiceNumberInput.inputValue()).not.toBe("");

        await this.expectVisible(this.invoiceDateInput);
        await expect(await this.invoiceDateInput.inputValue()).not.toBe("");

        await this.expectVisible(this.invoiceTotalInput);
        await expect(await this.invoiceTotalInput.inputValue()).not.toBe("");
    }

    async verifyPaymentMethodIsDisplayed(): Promise<void> {
        await expect(this.paymentMethod).toBeVisible();
        await expect(await this.paymentMethod.inputValue()).not.toBe("");
    }

    async verifyProductsAreDisplayed(): Promise<void> {
        const productRows = this.page.locator(
            "table.table.table-hover > tbody > tr"
        );
        const rowCount = await productRows.count();

        expect(rowCount).toBeGreaterThan(0);

        for (let i = 0; i < rowCount; i++) {
            const row = productRows.nth(i);
            const priceCell = row.locator("td").nth(2);
            const productNameCell = row.locator("td").nth(1);
            const quantityCell = row.locator("td").nth(0);
            const totalCell = row.locator("td").nth(3);

            await this.expectVisible(quantityCell);
            await expect(await quantityCell.textContent()).not.toBe("");

            await this.expectVisible(productNameCell);
            await expect(await productNameCell.textContent()).not.toBe("");

            await this.expectVisible(priceCell);
            await expect(await priceCell.textContent()).not.toBe("");

            await this.expectVisible(totalCell);
            await expect(await totalCell.textContent()).not.toBe("");
        }
    }
}