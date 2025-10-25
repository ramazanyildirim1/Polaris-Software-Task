import { expect, Page, Locator } from "@playwright/test";
import BasePage from "./basePage";

export default class CardPage extends BasePage {
  readonly billingAddressForm: Locator;
  readonly cityInput: Locator;
  readonly confirmButton: Locator;
  readonly countryInput: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly itemQuantities: Locator;
  readonly itemTotalPrice: Locator;
  readonly orderConfirmationMessage: Locator;
  readonly paymentMethod: Locator;
  readonly paymentSection: Locator;
  readonly paymentSuccessMessage: Locator;
  readonly postCodeInput: Locator;
  readonly proceedCheckoutButton: Locator;
  readonly proceedCheckoutButtonBilling: Locator;
  readonly proceedCheckoutButtonSignIn: Locator;
  readonly stateInput: Locator;
  readonly streetAddressInput: Locator;

  constructor(page: Page) {
    super(page);
    this.billingAddressForm = page.getByRole("heading", {
      name: "Billing Address",
      exact: true,
      level: 3,
    });
    this.cityInput = page.getByTestId("city");
    this.confirmButton = page.getByTestId("finish");
    this.countryInput = page.getByTestId("country");
    this.itemNames = page.getByTestId("product-title");
    this.itemPrices = page.getByTestId("product-price");
    this.itemQuantities = page.getByTestId("product-quantity");
    this.itemTotalPrice = page.getByTestId("line-price");
    this.orderConfirmationMessage = page.getByText("Thanks for your order!");
    this.paymentMethod = page.getByTestId("payment-method");
    this.paymentSection = page.getByRole("heading", {
      name: "Payment",
      exact: true,
      level: 3,
    });
    this.paymentSuccessMessage = page.getByTestId("payment-success-message");
    this.postCodeInput = page.getByTestId("postal_code");
    this.proceedCheckoutButton = page.getByTestId("proceed-1");
    this.proceedCheckoutButtonBilling = page.getByTestId("proceed-3");
    this.proceedCheckoutButtonSignIn = page.getByTestId("proceed-2");
    this.stateInput = page.getByTestId("state");
    this.streetAddressInput = page.getByTestId("street");
  }

  async clickConfirmButton(): Promise<void> {
    await this.clickElement(this.confirmButton);
  }

  async clickProceedToCheckout(): Promise<void> {
    await this.clickElement(this.proceedCheckoutButton);
    await this.clickElement(this.proceedCheckoutButtonSignIn);
  }

  async clickProceedToCheckoutBilling(): Promise<void> {
    await this.clickElement(this.proceedCheckoutButtonBilling);
  }

  async completeCheckout(): Promise<void> {
    await this.clickConfirmButton();
    await this.expectVisible(this.orderConfirmationMessage);
  }

  async fillBillingAddress(
    street: string,
    city: string,
    state: string,
    postCode: string,
    country: string
  ): Promise<void> {
    const modifierKey = process.platform === "darwin" ? "Meta" : "Control";

    await this.streetAddressInput.click();
    await this.streetAddressInput.press(`${modifierKey}+a`);
    await this.streetAddressInput.fill(street);

    await this.cityInput.click();
    await this.cityInput.press(`${modifierKey}+a`);
    await this.cityInput.fill(city);

    await this.stateInput.fill(state);
    await this.postCodeInput.fill(postCode);

    await this.countryInput.click();
    await this.countryInput.press(`${modifierKey}+a`);
    await this.countryInput.fill(country);
  }

  async selectOptionForPaymentMethod(optionValue: string): Promise<void> {
    await this.selectOption(this.paymentMethod, optionValue);
  }

  async updateItemQuantity(itemName: string, newQuantity: number) {
    const count = await this.itemNames.count();
    let targetIndex = -1;
    for (let i = 0; i < count; i++) {
      const name = (await this.itemNames.nth(i).textContent())?.trim();
      if (name?.toLowerCase() === itemName.toLowerCase()) {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex === -1) {
      throw new Error(
        `Product "${itemName}" not found in cart for quantity update`
      );
    }

    const qtyInput = this.itemQuantities.nth(targetIndex);

    await qtyInput.waitFor({ state: "visible", timeout: 10000 });
    await expect(qtyInput).toBeEditable({ timeout: 10000 });

    await qtyInput.click();
    const modifierKey = process.platform === "darwin" ? "Meta" : "Control";
    await qtyInput.press(`${modifierKey}+a`);
    await qtyInput.type(String(newQuantity));
    await qtyInput.press("Enter");

    expect(await qtyInput.inputValue()).toBe(String(newQuantity));
  }

  async verifyBillingAddress(
    street: string,
    city: string,
    state: string,
    postCode: string,
    country: string
  ): Promise<void> {
    expect(await this.streetAddressInput.inputValue()).toBe(street);
    expect(await this.cityInput.inputValue()).toBe(city);
    expect(await this.stateInput.inputValue()).toBe(state);
    expect(await this.postCodeInput.inputValue()).toBe(postCode);
    expect(await this.countryInput.inputValue()).toBe(country);
  }

  async verifyBillingAddressFormVisible(): Promise<void> {
    await this.expectVisible(this.billingAddressForm);
  }

  async verifyCartItemDetails(
    expectedItems: { name: string; price: number; qty: number }[]
  ): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForSelector('[data-test="product-title"]', {
      timeout: 10000,
    });

    for (const expected of expectedItems) {
      const count = await this.itemNames.count();
      let foundIndex = -1;

      for (let i = 0; i < count; i++) {
        const itemName = (await this.itemNames.nth(i).textContent())?.trim();
        if (itemName?.toLowerCase() === expected.name.toLowerCase()) {
          foundIndex = i;
          break;
        }
      }

      expect(foundIndex).toBeGreaterThanOrEqual(0);

      await this.page.waitForTimeout(500);
      await this.page.reload();

      const name = (await this.itemNames.nth(foundIndex).textContent())?.trim();
      const priceText = (
        await this.itemPrices.nth(foundIndex).textContent()
      )?.trim();
      const qtyValue = await this.itemQuantities.nth(foundIndex).inputValue();
      const linePriceText = (
        await this.itemTotalPrice.nth(foundIndex).textContent()
      )?.trim();

      const price = parseFloat(priceText?.replace(/[^0-9.]/g, "") || "0");
      const qty = Number(qtyValue);
      const linePrice = parseFloat(
        linePriceText?.replace(/[^0-9.]/g, "") || "0"
      );

      const expectedTotal = price * qty;

      expect(name).toBe(expected.name);
      expect(price).toBeCloseTo(expected.price, 2);
      expect(qty).toBe(expected.qty);
      expect(linePrice).toBeCloseTo(expectedTotal, 2);

      console.log(`Verified "${name}" - $${price} × ${qty} = $${linePrice}`);
    }
  }

  async verifyPaymentSectionVisible(): Promise<void> {
    await this.expectVisible(this.paymentSection);
  }

  async verifySuccsessfulPaymentMessageDisplayed(): Promise<void> {
    await this.expectVisible(this.paymentSuccessMessage);
  }
}