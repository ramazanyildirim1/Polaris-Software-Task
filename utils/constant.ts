export class Constants {
  static readonly ADMIN_EMAIL = "admin@practicesoftwaretesting.com";
  static readonly ADMIN_PASSWORD = "welcome01";
  static readonly ADMIN_WRONG_PASSWORD = "welcome02";
 
  static readonly PAYMENT_METHOD = {
    BANK_TRANSFER: "bank-transfer",
    CASH_ON_DELIVERY: "cash-on-delivery",
    CREDIT_CARD: "credit-card",
  };
 
  static readonly PRODUCTS = {
    M4_NUTS: "M4 Nuts",
  };
 
  static readonly UK_BILLING_ADDRESS = {
    city: "London",
    country: "United Kingdom",
    postCode: "SW1A 2AA",
    state: "Greater London",
    street: "10 Downing Street",
  };
}