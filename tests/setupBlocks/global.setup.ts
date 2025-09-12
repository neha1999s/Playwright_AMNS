import { test as baseTest ,expect , Page , BrowserContext} from "@playwright/test";
import { USERS, ACTIVE_BACKEND, UserRole } from "./constant";
import { vendorLogin } from "./login.setup";

// Used to prevent Exception raise from API calls in case of try-catch blocks
let shouldThrowError = true;

const addIntercept = async (page) => {
  // Intercept all responses
  page.on("response", async (response) => {
    const status = response.status();
    if (status >= 400) {
      // Log the error response for debugging
      console.error(
        `API request failed with status ${status}: ${response.url()}`
      );
      try {
        if (!(response.status() >= 500)) {
          const responseBody = await response.text();
          console.log(responseBody);
        }
      } catch (error) {
        console.error("Failed to read response body:", error);
      }
      // Fail the test if shouldThrowError is true
      if (shouldThrowError) {
        throw new Error(`API request failed with status ${status}`);
      }
    }
  });
};

const test = baseTest.extend<{
  clientPage: any;
  vendorPage: any;
}>({
  clientPage: async ({ page }, use) => {
    const config = USERS( "client");

    const context = await page.context();
    for (const p of context.pages()) await p.close();

    const clientPage = await context.newPage();
    await clientPage.goto(config.FRONT_END, { timeout: 60000 });

    await clientPage.evaluate((backendInstance) => {
      localStorage.setItem(
        "procol_current_selected_api",
        `https://${backendInstance}.ag-ri.in/api`
      );
    }, config.BACKEND_INSTANCE);

    await clientPage.reload();
    await use(clientPage);
  },

  vendorPage: async ({ page }, use) => {
    const config = USERS( "vendor");

    const context = await page.context();
    for (const p of context.pages()) await p.close();

    const vendorPage = await context.newPage();
    await vendorPage.goto(config.FRONT_END, { timeout: 80000, waitUntil: "domcontentloaded"});
    console.log("Navigated to:", config.FRONT_END);

    await vendorPage.evaluate((backendInstance) => {
      localStorage.setItem(
        "procol_current_selected_api",
        `https://${backendInstance}.ag-ri.in/api`
      );
    }, config.BACKEND_INSTANCE);

    await vendorPage.reload({ waitUntil: "domcontentloaded", timeout: 20000 });
    await use(vendorPage);
  },
});

export default test;

const setShouldThrowError = (value) => {
  shouldThrowError = value;
};

const Validate = async (Page,locaator,sucess_message,erro_message) => {

  try {
    await Page.getByText(locaator).waitFor({ timeout: 20000 });
    if (await Page.getByText(locaator).isVisible()) {

        console.log("✅ "+sucess_message);
    } else {
        throw new Error("❌ "+erro_message);
    }
} catch (error) {
    throw new Error("❌ "+erro_message);
}
}


export { test, expect, setShouldThrowError ,Validate};
