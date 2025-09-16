import { test as setup, expect , test , Page} from "@playwright/test";
import { ACTIVE_BACKEND, USERS , UserRole }from "./constant";



const closeVendorPopup = async (page) => {
  try {
    await page
      .locator("span")
      .filter({ hasText: "Don’t miss out on" })
      .locator("a")
      .click();
  } catch (error) {
    console.error("No pop-up shown on vendor side refresh/new login");
  }
};

const clientVsModules = {
  buyer: [
    "Home",
    "Events",
    "Purchase Orders",
    "Purchase Requisitions",
    "Approvals",
    "Vendors",
  ],
  auctioneer: ["Events", "Vendors"],
  planner: ["Home", "Events", "Approvals", "Purchase Requisitions"], // TODO - add negative test for planner that rfq auction should not be visible
};


// Client login & Vendor login

export const clientLogin = async ({ page }) => {
  const config = USERS( "client");

  if (config.LOGIN_METHOD === "phone") {
    await page.getByRole('textbox', { name: 'phone' }).fill(config.USER_MOBILE);
    await page.getByRole('textbox', { name: 'phone' }).press("Enter");
    await page.getByRole('textbox', { name: 'password' }).fill(config.OTP);
    await page.getByRole('textbox', { name: 'password' }).press("Enter");
  }
  return page;
};

export const vendorLogin = async ({ page }) => {
  const config = USERS( "vendor");

  if (config.LOGIN_METHOD === "phone") {
    // QA vendor login via phone
    await page.getByRole('textbox', { name: 'phone' }).fill(config.USER_MOBILE);
    await page.getByRole('textbox', { name: 'phone' }).press("Enter");
    await page.getByRole('textbox', { name: 'Enter Your OTP' }).fill(config.OTP);
    await page.getByRole('textbox', { name: 'Enter Your OTP' }).press("Enter");
  }
  //  else if (config.LOGIN_METHOD === "email") {
  //   // RIL vendor login via email
  //   await page.getByRole("button", { name: "Continue with email" }).click();
  //   await page.getByPlaceholder("Enter your email address").fill(config.EMAIL!);
  //   await page.getByRole("button", { name: "Send OTP" }).click();
  //   await page.getByRole('textbox', { name: 'Enter Your OTP' }).fill(config.OTP);
  //   await page.getByRole('textbox', { name: 'Enter Your OTP' }).press("Enter");
  // }
   else {
    throw new Error("Unsupported login method for vendor");
  }

  return page;
};

export const clientLogout = async (page) => {
  await page.locator(".ant-avatar").first().click();
  await page.getByRole("menuitem", { name: "Sign out" }).click();
  await page.waitForNavigation();
  console.log("Client logged out");
};
