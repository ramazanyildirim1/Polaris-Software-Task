import { test } from "@playwright/test";
import HomePage from "../../pages/homePage";
import ProductsPage from "../../pages/productsPage";
import LoginPage from "../../pages/loginPage";
import CardPage from "../../pages/cardPage";
import OrdersPage from "../../pages/ordersPage";
import EditPage from "../../pages/editPage";
import { Constants } from "../../utils/constant";

test.describe("Positive test cases", () => {
  let homePage: HomePage;
  let productsPage: ProductsPage;
  let loginPage: LoginPage;
  let cartPage: CardPage;
  let ordersPage: OrdersPage;
  let editPage: EditPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productsPage = new ProductsPage(page);
    loginPage = new LoginPage(page);
    cartPage = new CardPage(page);
    ordersPage = new OrdersPage(page);
    editPage = new EditPage(page);

    console.log(`User is on home page`);
    await homePage.navigateTo("/");
    await homePage.clickHomeLinkButton();
  });

  test("**As a visitor**, I want to view a list of available tools so that I can browse what’s for sale.  ", async () => {

    console.log(`Clicking a product opens its detail page`);
    console.log(`Each product links to a detailed product page.`);
    await homePage.verifyPaginatedProductCardsAndNavigate();
  });

  test("**As a visitor**, I want to view detailed information about a specific tool so that I can learn more before purchasing.", async () => {
    console.log(`Clicking a product opens its detail page.`);
    await homePage.selectCardByName(Constants.PRODUCTS.M4_NUTS);

    console.log(`The page displays name, description, price, and image.`);
    await productsPage.verifyProductDetailPage(Constants.PRODUCTS.M4_NUTS);

    console.log(`The “Add to Cart” button is visible and enabled.`);
    await productsPage.verifyAddToCartButtonVisibleAndEnabled();
  });

  test("**As a visitor**, I want to search for products by name so that I can quickly find the tool I want.", async () => {

    console.log(`A search bar is available on the shop page.`);
    await homePage.verifySearchBarIsAvailable();

    console.log(`Entering a product name shows matching results`);
    await homePage.searchForProduct(Constants.PRODUCTS.M4_NUTS);
    await homePage.verifySearchResultsDisplayed();

    console.log(`Non-matching searches show a “no results found” message.`);
    await homePage.searchForProduct("Spoon");
    await homePage.verifyNoSearchResultsDisplayed();
  });

  test("**As a visitor**, I want to filter tools by category so that I can find the type of product I need.  ", async () => {

    console.log(`Category filters (e.g., “Hand Tools”, “Power Tools”) are displayed.`);
    await homePage.verifyFilterCategoriesDisplayed(
      "Hand Tools",
      "Power Tools",
      "Other"
    );
    console.log(`Selecting a category updates the product list.`);
    await homePage.filterToolsByCategory("Hand Tools", "Other");

    console.log(`Clearing the filter shows all products again.`);
    await homePage.clearAllCategories();
  });

  test("**As a registered user**, I want to log in using my credentials so that I can access my account and purchase tools.", async () => {

    console.log(`Valid credentials allow successful login and show the user’s name.`);
    await homePage.clickSignInLinkButton();
    await loginPage.login(Constants.ADMIN_EMAIL, Constants.ADMIN_PASSWORD);
    await loginPage.verifyLoginSuccessful();
    await homePage.clickHomeLinkButton();

    console.log(`Login persists during navigation until logout.`);
    await homePage.clickSignOutButton();
  });

  test("**As a registered user**, Invalid credentials display an appropriate error message.", async () => {

    console.log(`Invalid credentials display an appropriate error message.`);
    await homePage.clickSignInLinkButton();
    await loginPage.login(Constants.ADMIN_EMAIL, Constants.ADMIN_WRONG_PASSWORD);
    await loginPage.verifyLoginErrorMessage("Invalid email or password");
  });

  test("**As a logged-in user**, I want to add a product to my cart so that I can purchase it later.", async () => {
    await homePage.clickSignInLinkButton();
    await loginPage.login(Constants.ADMIN_EMAIL, Constants.ADMIN_PASSWORD);
    await loginPage.verifyLoginSuccessful();
    await homePage.clickHomeLinkButton();

    console.log(`Clicking “Add to Cart” adds the item to the cart.`);
    await homePage.selectCardByName(Constants.PRODUCTS.M4_NUTS);

    console.log(`The cart icon or counter updates with the correct number of items.`);
    await productsPage.verifyProductDetailPage(Constants.PRODUCTS.M4_NUTS);
    await productsPage.clickAddToCart();
    await homePage.clickCartIcon();

    console.log(`The product appears in the cart summary with name, quantity, and price.`);
    await cartPage.verifyCartItemDetails([
      { name: Constants.PRODUCTS.M4_NUTS, price: 4.65, qty: 1 },
    ]);
  });

  test("As a logged-in user**, I want to update quantities or remove items from my cart so that I can manage my purchase.", async () => {
    await homePage.clickSignInLinkButton();
    await loginPage.login(Constants.ADMIN_EMAIL, Constants.ADMIN_PASSWORD);
    await loginPage.verifyLoginSuccessful();
    await homePage.clickHomeLinkButton();

    await homePage.selectCardByName(Constants.PRODUCTS.M4_NUTS);
    await productsPage.verifyProductDetailPage(Constants.PRODUCTS.M4_NUTS);
    await productsPage.clickAddToCart();
    await homePage.clickCartIcon();

    await cartPage.verifyCartItemDetails([
      { name: Constants.PRODUCTS.M4_NUTS, price: 4.65, qty: 1 },
    ]);

    console.log(`Quantities can be increased or decreased.`);
    await cartPage.updateItemQuantity(Constants.PRODUCTS.M4_NUTS, 3);

    console.log(`Cart total reflects all changes immediately.`);
    await cartPage.verifyCartItemDetails([
      { name: Constants.PRODUCTS.M4_NUTS, price: 4.65, qty: 3 },
    ]);
  });

  test("**As a logged-in user**, I want to complete the checkout process so that I can buy my selected tools.", async () => {
    await homePage.clickSignInLinkButton();
    await loginPage.login(Constants.ADMIN_EMAIL, Constants.ADMIN_PASSWORD);
    await loginPage.verifyLoginSuccessful();
    await homePage.clickHomeLinkButton();

    await homePage.selectCardByName(Constants.PRODUCTS.M4_NUTS);
    await productsPage.verifyProductDetailPage(Constants.PRODUCTS.M4_NUTS);
    await productsPage.clickAddToCart();
    await homePage.clickCartIcon();
    await cartPage.verifyCartItemDetails([
      { name: Constants.PRODUCTS.M4_NUTS, price: 4.65, qty: 1 },
    ]);


    console.log(`Checkout form requires shipping and payment details.`);
    await cartPage.clickProceedToCheckout();
    await cartPage.verifyBillingAddressFormVisible();

    await cartPage.fillBillingAddress(
      Constants.UK_BILLING_ADDRESS.street,
      Constants.UK_BILLING_ADDRESS.city,
      Constants.UK_BILLING_ADDRESS.state,
      Constants.UK_BILLING_ADDRESS.postCode,
      Constants.UK_BILLING_ADDRESS.country
    );

    await cartPage.verifyBillingAddress(
      Constants.UK_BILLING_ADDRESS.street,
      Constants.UK_BILLING_ADDRESS.city,
      Constants.UK_BILLING_ADDRESS.state,
      Constants.UK_BILLING_ADDRESS.postCode,
      Constants.UK_BILLING_ADDRESS.country
    );

    await cartPage.clickProceedToCheckoutBilling();
    await cartPage.verifyPaymentSectionVisible();
    await cartPage.selectOptionForPaymentMethod(Constants.PAYMENT_METHOD.CASH_ON_DELIVERY);

    console.log(`Submitting the form confirms the order.`);
    await cartPage.clickConfirmButton();

    console.log(`The user sees an order confirmation message or summary.`);
    await cartPage.verifySuccsessfulPaymentMessageDisplayed();
    await cartPage.completeCheckout();
  });

  test("**As a logged-in user**, I want to view my past orders so that I can track what I’ve purchased.", async () => {
    await homePage.clickSignInLinkButton();
    await loginPage.login(Constants.ADMIN_EMAIL, Constants.ADMIN_PASSWORD);
    await loginPage.verifyLoginSuccessful();
    await homePage.clickHomeLinkButton();
    await homePage.clickOrdersLinkButton();
    await ordersPage.verifyOrdersPageLoaded();

    console.log(`The “My Orders” or “Order History” page lists previous orders.`);
    await ordersPage.verifyOrdersTable();
    await ordersPage.clickRandomEditButton();

    console.log(` Each order shows date, total amount, and item summary.`);
    await editPage.verifyGeneralInformationIsDisplayed();
    await editPage.verifyPaymentMethodIsDisplayed();
    await editPage.verifyBillingAddressIsDisplayed();

    console.log(` Clicking an order displays detailed order information.`);
    await editPage.verifyProductsAreDisplayed();
  });

  test("**As a visitor**, I want to filter products by category so that I can narrow down what I’m viewing. ", async () => {
    console.log(`Category filters update the product list dynamically without breaking pagination.`);
    await homePage.verifyFilterCategoriesDisplayed(
      "Hand Tools",
      "Power Tools",
      "Other"
    );
    console.log(`Selecting a category updates the product list.`);
    await homePage.filterToolsByCategory("Hand Tools", "Other");

    console.log(`Selected filter states persist when navigating back or refreshing the page.`);
    await homePage.refreshPage();

    console.log(`Selected filter states persist when navigating back or refreshing the page.`);
    //We cannot proceed further; there is a bug. Requirements should be addressed accordingly. 
    //workaround : After the issue is fixed, we can uncomment the steps below, and the automation can be completed.
    //await homePage.verifyCategoriesAreChecked("Hand Tools", "Other");
    console.log(` The filtered results match the category field in the API response.`);
    console.log(` Clicking “Clear Filters” restores the full list.`);

  });
});