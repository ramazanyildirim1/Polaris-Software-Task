Project Overview

This repository contains automated test cases for the demo website:
https://with-bugs.practicesoftwaretesting.com/ and https://with-bugs.practicesoftwaretesting.com/

The purpose of this framework is to validate end-to-end user scenarios such as viewing products, searching, filtering, logging in, adding items to the cart, and completing checkout.
All bugs discovered during testing are listed below.

Framework Setup
Prerequisites

Node.js v18+

npm (comes with Node)

Visual Studio Code (recommended)

1. Install Dependencies

Clone the repository and install all required packages:

git clone <my-repo-url>
cd practice-software-testing
npm install

2. Install Playwright Browsers
npx playwright install

3. Run Tests for https://practicesoftwaretesting.com/ :SITE_VERSION= main npx playwright test
4. Run Tests for https://with-bugs.practicesoftwaretesting.com/ :SITE_VERSION= buggy npx playwright test

To run in headless mode (for CI/CD):

npx playwright test

npx playwright show-report

Project Structure
POLARIS SOFTWARE TASK/
├── node_modules/         
├── pages/
│   ├── basePage.ts
│   ├── cardPage.ts
│   ├── editpage.ts
│   ├── homePage.ts
│   ├── loginPage.ts
│   ├── ordersPage.ts
│   └── productsPage.ts
├── tests/
│   └── testCases.spec.ts
├── utils/
│   ├── constant.ts
│   └── env.config.ts
├── package.json
├── playwright.config.ts
└── README.md

import { defineConfig, devices } from '@playwright/test';

const baseUrl =  process.env.SITE_VERSION === 'buggy'    ? 'https://with-bugs.practicesoftwaretesting.com'    : 'https://practicesoftwaretesting.com';
export default defineConfig({
  testDir: './tests',
  reporter: 'html',
  use: {
    baseURL: baseUrl,
    testIdAttribute: 'data-test',
  },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
});

Practice Software Testing – Bug Report

Test Environment: https://with-bugs.practicesoftwaretesting.com/

Overview

This report summarizes all major functional bugs discovered during exploratory and automated testing of the Practice Software Testing (with-bugs) environment.
The goal of testing was to validate key user flows such as browsing products, viewing details, searching, filtering, logging in, managing a cart, and checking out.

During testing, a critical routing issue was observed — clicking the Home button redirects users to the Contact page across multiple areas of the website.
This issue causes most of the functional scenarios to fail.

| #  | Test Scenario                    | Expected Behavior                            | Actual Behavior             | Status   |
| -- | -------------------------------- | -------------------------------------------- | --------------------------- | -------- |
| 1  | **Visitor views tools list**     | Homepage should show available tools         | Homepage opens Contact page | Failed   |
| 2  | **View tool details**            | All products should display on Products page | Not all products appear     | Failed   |
| 3  | **Search product by name**       | Product should appear in search results      | Search fails for some items | Failed   |
| 4  | **Filter by category (visitor)** | Category checkbox filters products           | Category checkbox missing   | Failed   |
| 5A | **Registered user login**        | Login should redirect to dashboard           | Homepage opens Contact page | Failed   |
| 5B | **Invalid credentials**          | Should display proper error message          | Works as expected           | Passed   |
| 6  | **Add to cart**                  | Product added successfully                   | Homepage opens Contact page | Failed   |
| 7  | **Update / remove items**        | Items should update or delete in cart        | Homepage opens Contact page | Failed   |
| 8  | **Checkout**                     | User should complete order successfully      | Homepage opens Contact page | Failed   |
| 9  | **View past orders**             | Previous orders should be displayed          | Homepage opens Contact page | Failed   |
| 10 | **Category filter**              | Filter checkboxes available                  | Not visible                 | Failed   |


Key Observations

Major navigation issue: Clicking “Home” always opens the Contact page.

Category filter feature is not available, blocking related test cases.

Search functionality fails for some existing products.

Product page does not list all items as expected.

Core e-commerce actions (add to cart, checkout, order history) are inaccessible due to routing failure.


Author 

Tester: Ramazan Yildirim
Framework: Playwright + TypeScript
Date: October 2025
Website Tested: Practice Software Testing (with-bugs)
