import { Page, Locator, expect } from "@playwright/test";
import BasePage from "././basePage";

export default class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;
  readonly passwordInput: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByTestId("email");
    this.loginButton = page.getByTestId("login-submit");
    this.loginErrorMessage = page.getByTestId("login-error");
    this.passwordInput = page.getByTestId("password");
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.waitFor({ state: "visible", timeout: 15000 });
    await this.typeText(this.emailInput, email);
    await this.passwordInput.waitFor({ state: "visible", timeout: 15000 });
    await this.typeText(this.passwordInput, password);
    await this.loginButton.waitFor({ state: "visible", timeout: 15000 });
    await this.clickElement(this.loginButton);
  }

  async verifyLoginErrorMessage(expectedMessage: string): Promise<void> {
    await this.expectVisible(this.loginErrorMessage);
    const actualMessage = await this.getElementText(this.loginErrorMessage);
    await expect(actualMessage).toBe(expectedMessage);
  }

  async verifyLoginSuccessful(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard/);
  }
}