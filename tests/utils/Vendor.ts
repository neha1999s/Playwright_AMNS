import { validateAndLog } from "./common";
import { test , expect } from "../setupBlocks/global.setup";
import { fetch_prs , eventCreationAPI , vendorBidAPI , sendCounterOfferAPI , priceCapBeforeBid , bestOfferAPI} from "./FlowCover_API";

const vendor_bid_tech = async ({ page }) => {
  const [RFX_id, title] = await eventCreationAPI();
  if (!RFX_id || !title) throw new Error('Missing RFX ID or title');

  // Search and open event
  await page.getByRole('textbox', { name: 'Search title or Ref-Id' }).fill(RFX_id);
  await page.getByLabel('icon: search').locator('svg').dblclick();
  await page.getByText(title).first().click();
  await page.getByRole('button', { name: 'I will participate' }).click();
  await page.getByRole('tab', { name: 'Technical Stage' }).waitFor({ state: "visible", timeout: 10000 });
  await page.getByRole('tab', { name: 'Technical Stage' }).click();
  await page.waitForTimeout(2000);

 //  Quick Fill (done twice)
 for (let i = 0; i < 2; i++) {
  // let count = 0;

  // while (!(await page.getByText('Same as RequestedRegret Item').isVisible()) && count < 7) {
    await page.getByText('Quick Fill').nth(i).click();  
    await page.waitForTimeout(500);
  //   count++;
  // }
  
  try {
    await page.getByRole('menuitem', { name: 'Same as Requested' }).waitFor({ state: 'visible', timeout: 3000 });
    await page.getByRole('menuitem', { name: 'Same as Requested' }).click();
    await page.waitForTimeout(1000);
  }
  catch{
    console.log("Menu item 'Same as Requested' not found");
    await page.getByText('Quick Fill').nth(1).click();
    await page.getByRole('menuitem', { name: 'Same as Requested' }).click();
  }
  await page.waitForTimeout(1000);
}
  await page.getByRole('button', { name: 'Submit' }).nth(1).dblclick();
  await page.waitForTimeout(500);

await validateAndLog({
  locator: page.getByRole('tab', { name: 'Technical Stage Submitted' }),
  smessage: "Technical Stage Submitted successfully ",
  fmessage: "Technical Stage Submission failed",
});

};

const vendor_bid_tech_priceCap = async ({ page }) => {
  const [ RFX_id , title ] = await priceCapBeforeBid();
  if (!RFX_id  || !title) throw new Error('Missing RFX ID or title');
  await page.getByRole('textbox', { name: 'Search title or Ref-Id' }).fill(RFX_id );
  await page.getByLabel('icon: search').locator('svg').dblclick();
  await page.getByText(title).first().click();
  await page.getByRole('button', { name: 'I will participate' }).click();
  await page.getByRole('tab', { name: 'Technical Stage' }).waitFor({ state: "visible", timeout: 10000 });
  await page.getByRole('tab', { name: 'Technical Stage' }).click();
  await page.waitForTimeout(2000);
 //  Quick Fill (done twice)
 for (let i = 0; i < 2; i++) {
  // let count = 0;

  // while (!(await page.getByText('Same as RequestedRegret Item').isVisible()) && count < 7) {
    await page.getByText('Quick Fill').nth(i).click();  
    await page.waitForTimeout(500);
  //   count++;
  // }
  
  try {
    await page.getByRole('menuitem', { name: 'Same as Requested' }).waitFor({ state: 'visible', timeout: 3000 });
    await page.getByRole('menuitem', { name: 'Same as Requested' }).click();
    await page.waitForTimeout(1000);
  }
  catch{
    console.log("Menu item 'Same as Requested' not found");
    await page.getByText('Quick Fill').nth(1).click();
    await page.getByRole('menuitem', { name: 'Same as Requested' }).click();
  }
  await page.waitForTimeout(1000);
}

// let a = 0;
// while (!(await page.getByText('Response submitted').isVisible()) && a < 2) {
    await page.getByRole('button', { name: 'Submit' }).nth(1).dblclick();
    await page.waitForTimeout(500);
//   a++;
// }
  // if (await page.getByRole('button', { name: 'Submit' }).nth(1).isDisabled()) {
  //   await page.getByText('Quick Fill').first().click();
  //   await page.getByRole('menuitem', { name: 'Same as Requested' }).dblclick();
  //   await page.getByText('Quick Fill').nth(1).click();
  //   await page.getByRole('menuitem', { name: 'Same as Requested' }).dblclick();
  // }
await validateAndLog({
  locator: page.getByRole('tab', { name: 'Technical Stage Submitted' }),
  smessage: "Technical Stage Submitted successfully ",
  fmessage: "Technical Stage Submission failed",
});
};

const vendor_bid_rfq_less_than_Pricecap = async ({ page ,inlinefield , mandatoryGlobalField  }) => {
  await page.getByRole('tab', { name: 'RFQ' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('radio', { name: 'Indian Rupees (INR)' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(1000);
  // inline 
  for (let i = 0; i < inlinefield.length; i++) {
  // scroll before every 2-row batch
  if (i % 2 === 0) {
    await page.locator('div[role="grid"]').first().hover();
    await page.mouse.wheel(300, 0);
    await page.waitForTimeout(800);
  }
  const [colIndex, rowIndex, value] = inlinefield[i];
  const cell = page.locator(`div[role="gridcell"][aria-colindex="${colIndex}"]`).nth(rowIndex);
  const input = page.locator('input[type="text"]');

  await cell.click();
  if (!(await input.isVisible())) {
    await cell.dblclick();
  }
  await input.fill(value);
  await input.press("Enter");
}
// global
for (let [field, config] of Object.entries(mandatoryGlobalField)) {
  const row = page.getByRole("row", { name: field, exact: true });

  if (config.type === "dropdown") {
    let retries = 0;
    const optionLocator = config.value === "first"
      ? page.getByRole("option").first()
      : page.getByRole("option", { name: config.value }).first();

    // Retry opening dropdown until option is visible
    while (!(await optionLocator.isVisible()) && retries < 3) {
      await row.getByRole("gridcell").nth(1).click();
      await optionLocator.waitFor({ state: "visible", timeout: 10000 }).catch(() => {});
      retries++;
    }

    await optionLocator.click();

  } else if (config.type === "text") {
    const input = page.locator('input[type="text"]');

    await row.getByRole("gridcell").nth(1).click();
    await input.waitFor({ state: "visible", timeout: 10000 });
    await input.fill(config.value);
    await input.press("Enter");

  } else if (config.type === "date") {
    await row.getByRole("gridcell").nth(1).click();
    await page.getByRole("gridcell", { name: "icon: calendar" }).click();

    const dateCell = page.locator("div").filter({ hasText: new RegExp(`^${config.value}$`) });
    await dateCell.waitFor({ state: "visible", timeout: 10000 });
    await dateCell.click();
  }
}
let a= 0;
    while (await page.getByRole('button', { name: 'Submit Quote' }).first().isEnabled() && a < 2) {
      await page.getByRole('button', { name: 'Submit Quote' }).first().click();
  a++;
  }
   await validateAndLog({
    locator: page.getByRole('tab', { name: 'RFQ Submitted' }),
    smessage: "RFQ Submitted successfully ",
    fmessage:  "RFQ Submission failed" 
  })
};

const vendor_bid_rfq_more_than_Pricecap = async ({ page  , inlineField , mandatoryGlobalField}) => {
  await page.getByRole('tab', { name: 'RFQ' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('radio', { name: 'Indian Rupees (INR)' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  // inline 
  for (let i = 0; i < inlineField.length; i++) {
  // scroll before every 2-row batch
  if (i % 2 === 0) {
    await page.locator('div[role="grid"]').first().hover();
    await page.mouse.wheel(300, 0);
    await page.waitForTimeout(800);
  }
  const [colIndex, rowIndex, value] = inlineField[i];
  const cell = page.locator(`div[role="gridcell"][aria-colindex="${colIndex}"]`).nth(rowIndex);
  const input = page.locator('input[type="text"]');

  await cell.click();
  if (!(await input.isVisible())) {
    await cell.dblclick();
  }
  await input.fill(value);
  await input.press("Enter");
}
// global
for (let [field, config] of Object.entries(mandatoryGlobalField)) {
  const row = page.getByRole("row", { name: field, exact: true });

  if (config.type === "dropdown") {
    let retries = 0;
    const optionLocator = config.value === "first"
      ? page.getByRole("option").first()
      : page.getByRole("option", { name: config.value }).first();

    // Retry opening dropdown until option is visible
    while (!(await optionLocator.isVisible()) && retries < 3) {
      await row.getByRole("gridcell").nth(1).click();
      await optionLocator.waitFor({ state: "visible", timeout: 10000 }).catch(() => {});
      retries++;
    }
    await optionLocator.click();

  } else if (config.type === "text") {
    const input = page.locator('input[type="text"]');

    await row.getByRole("gridcell").nth(1).click();
    await input.waitFor({ state: "visible", timeout: 10000 });
    await input.fill(config.value);
    await input.press("Enter");

  } else if (config.type === "date") {
    await row.getByRole("gridcell").nth(1).click();
    await page.getByRole("gridcell", { name: "icon: calendar" }).click();

    const dateCell = page.locator("div").filter({ hasText: new RegExp(`^${config.value}$`) });
    await dateCell.waitFor({ state: "visible", timeout: 10000 });
    await dateCell.click();
  }
}
  let a= 0;
    while (await page.getByRole('button', { name: 'Submit Quote' }).first().isVisible() && a < 2) {
      await page.getByRole('button', { name: 'Submit Quote' }).first().click();
  a++;
  }
  const tooltip1 = page.getByRole('tooltip', { name: 'Net Price should be less than' });
  const tooltip2 = page.getByText('Please enter valid responses');

  await page.getByRole('gridcell', { name: '₹ 50 /KG' }).hover();
  if (await tooltip1.isVisible() || await tooltip2.isVisible()) {
  console.log('✅ Net Price is more than Price cap - Vendor Bid is not submitted ');
  } else {
  throw new Error('❌ Net Price is more than Price cap - Vendor Bid is  submitted  ');
   }
};

const vendor_bid_tech_regret = async ({ page }) => {
  const [RFX_id, title] = await eventCreationAPI();
  await page.waitForTimeout(3000);
  if (!RFX_id || !title) throw new Error("Missing RFX ID or title");

  // Search Event
  await page.getByRole("textbox", { name: "Search title or Ref-Id" }).fill(RFX_id);
  await page.getByLabel("icon: search").locator("svg").dblclick();
  await page.getByText(title).first().click();
  await page.waitForTimeout(3000);
  await page.getByRole("button", { name: "I will participate" }).click();
  await page.getByRole("tab", { name: "Technical Stage" }).click();
  await page.waitForTimeout(2000);
   //  Quick Fill (done twice)
 for (let i = 0; i < 2; i++) {
  // let count = 0;

  // while (!(await page.getByText('Same as RequestedRegret Item').isVisible()) && count < 5) {
    await page.getByText('Quick Fill').nth(i).click();  
    await page.waitForTimeout(500);
  //   count++;
  // }
  try {
  if (i === 0) {
    await page.getByRole('menuitem', { name: 'Same as Requested' }).waitFor({ state: 'visible', timeout: 3000 });
    await page.getByRole('menuitem', { name: 'Same as Requested' }).dblclick();
  } else if (i === 1) {
    await page.getByRole('menuitem', { name: 'Regret Item' }).waitFor({ state: 'visible', timeout: 3000 });
    await page.getByRole('menuitem', { name: 'Regret Item' }).dblclick();
  }
} catch {
  console.log(`⚠️ Retry: Dropdown not found for index ${i}`);
  await page.getByText('Quick Fill').nth(i).click();

  if (i === 0 && await page.getByText('Same as Requested').isVisible()) {
    await page.getByRole('menuitem', { name: 'Same as Requested' }).dblclick();
  } else if (i === 1 && await page.getByText('Regret Item').isVisible()) {
    await page.getByRole('menuitem', { name: 'Regret Item' }).dblclick();
  }
}
}
  await page.getByRole('button', { name: 'Submit' }).nth(1).dblclick();
  await page.waitForTimeout(500);

  await validateAndLog({
    locator: page.getByRole("tab", { name: "Technical Stage Submitted" }),
    smessage: "✅ Technical Stage Submitted successfully",
    fmessage: "❌ Technical Stage Submission failed",
  });
};


const vendor_bid_rfq = async ({ page  , inlinefieldrfq , mandatoryGlobalField}) => {
  await page.getByRole('tab', { name: 'RFQ' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('radio', { name: 'Indian Rupees (INR)' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.locator('div[role="grid"]').first().waitFor({ state: "visible", timeout: 10000 });
  // inline 
for (let i = 0; i < inlinefieldrfq.length; i++) {
  // scroll before every 2-row batch
  if (i % 2 === 0) {
    await page.locator('div[role="grid"]').first().hover();
    await page.mouse.wheel(300, 0);
    await page.waitForTimeout(800);
  }
  const [colIndex, rowIndex, value] = inlinefieldrfq[i];
  const cell = page.locator(`div[role="gridcell"][aria-colindex="${colIndex}"]`).nth(rowIndex);
  const input = page.locator('input[type="text"]');

  await cell.click();
  if (!(await input.isVisible())) {
    await cell.dblclick();
  }
  await input.fill(value);
  await input.press("Enter");
}
for (let [field, config] of Object.entries(mandatoryGlobalField)) {
  const row = page.getByRole("row", { name: field, exact: true });

  if (config.type === "dropdown") {
    let retries = 0;
    const optionLocator = config.value === "first"
      ? page.getByRole("option").first()
      : page.getByRole("option", { name: config.value }).first();
    // Retry opening dropdown until option is visible
    while (!(await optionLocator.isVisible()) && retries < 3) {
      await row.getByRole("gridcell").nth(1).click();
      await optionLocator.waitFor({ state: "visible", timeout: 10000 }).catch(() => {});
      retries++;
    }
    await optionLocator.click();

  } else if (config.type === "text") {
    const input = page.locator('input[type="text"]');

    await row.getByRole("gridcell").nth(1).click();
    await input.waitFor({ state: "visible", timeout: 10000 });
    await input.fill(config.value);
    await input.press("Enter");

  } else if (config.type === "date") {
    await row.getByRole("gridcell").nth(1).click();
    await page.getByRole("gridcell", { name: "icon: calendar" }).click();

    const dateCell = page.locator("div").filter({ hasText: new RegExp(`^${config.value}$`) });
    await dateCell.waitFor({ state: "visible", timeout: 10000 });
    await dateCell.click();
  }
}
  let a= 0;
    while (await page.getByRole('button', { name: 'Submit Quote' }).nth(1).isVisible() && a < 3) {
      await page.getByRole('button', { name: 'Submit Quote' }).nth(1).click();
  a++;
  }
   await validateAndLog({
    locator: page.getByRole('tab', { name: 'RFQ Submitted' }),
    smessage: "RFQ Submitted successfully ",
    fmessage:  "RFQ Submission failed" 
  })
};

const vendor_bid_rfq_non_regret = async ({ page  , inline_non_regrets , mandatoryGlobalField}) => {
  await page.getByRole('tab', { name: 'RFQ' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('radio', { name: 'Indian Rupees (INR)' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(2000);

  await page.locator('div[role="grid"]').first().waitFor({ state: "visible", timeout: 10000 });

for (let i = 0; i < inline_non_regrets.length; i++) {
  // scroll before every 2-row batch
  if (i % 1 === 0) {
    await page.locator('div[role="grid"]').first().hover();
    await page.mouse.wheel(300, 0);
    await page.waitForTimeout(800);
  }
  const [colIndex, rowIndex, value] = inline_non_regrets[i];
  const cell = page.locator(`div[role="gridcell"][aria-colindex="${colIndex}"]`).nth(rowIndex);
  const input = page.locator('input[type="text"]');

  await cell.click();
  if (!(await input.isVisible())) {
    await cell.dblclick();
  }
  await input.fill(value);
  await input.press("Enter");
}

for (let [field, config] of Object.entries(mandatoryGlobalField)) {
  const row = page.getByRole("row", { name: field, exact: true });

  if (config.type === "dropdown") {
    let retries = 0;
    const optionLocator = config.value === "first"
      ? page.getByRole("option").first()
      : page.getByRole("option", { name: config.value }).first();

    // Retry opening dropdown until option is visible
    while (!(await optionLocator.isVisible()) && retries < 3) {
      await row.getByRole("gridcell").nth(1).click();
      await optionLocator.waitFor({ state: "visible", timeout: 10000 }).catch(() => {});
      retries++;
    }

    await optionLocator.click();

  } else if (config.type === "text") {
    const input = page.locator('input[type="text"]');

    await row.getByRole("gridcell").nth(1).click();
    await input.waitFor({ state: "visible", timeout: 10000 });
    await input.fill(config.value);
    await input.press("Enter");

  } else if (config.type === "date") {
    await row.getByRole("gridcell").nth(1).click();
    await page.getByRole("gridcell", { name: "icon: calendar" }).click();

    const dateCell = page.locator("div").filter({ hasText: new RegExp(`^${config.value}$`) });
    await dateCell.waitFor({ state: "visible", timeout: 10000 });
    await dateCell.click();
  }
}
let a= 0;
    while (await page.getByRole('button', { name: 'Submit Quote' }).first().isEnabled() && a < 2) {
      await page.getByRole('button', { name: 'Submit Quote' }).first().waitFor({ state: "visible", timeout: 20000 });
      await page.getByRole('button', { name: 'Submit Quote' }).first().dblclick();    
  a++;
  }
   await validateAndLog({
    locator: page.getByRole('tab', { name: 'RFQ Submitted' }),
    smessage: "RFQ Submitted successfully ",
    fmessage:  "RFQ Submission failed" 
  })
};

const counter_offer_vendor1 = async ({ page}) => {
// Accept counter offer
  var [ RFX_id , title ] =  await sendCounterOfferAPI();
  await page.waitForTimeout(2000);
  if (!RFX_id  || !title) throw new Error('Missing RFX ID or title');
  await page.getByRole('textbox', { name: 'Search Title' }).click();
  await page.getByRole('textbox', { name: 'Search title or Ref-Id' }).fill(RFX_id );
  await page.getByLabel('icon: search').locator('svg').dblclick();
  await page.getByText(title).first().click();
  await page.getByRole('tab', { name: 'RFQ' }).waitFor({ state: "visible", timeout: 10000 });
  await page.getByRole('tab', { name: 'RFQ' }).click();
  await page.getByRole('button', { name: 'Accept Offer' }).click();

  await validateAndLog({
    locator: page.locator('div').filter({ hasText: 'Counter Offer resolved' }).nth(3),
    smessage: "Counter offer accept by Vendor successfully ",
    fmessage:  "Counter offer accept failed" 
  })
  
}

const counter_offer_vendor2 = async ({ page , counterofferVendorbid}) => {
// Decline counter offer
  var [ RFX_id , title ] =  await sendCounterOfferAPI();
  await page.waitForTimeout(2000);
  if (!RFX_id  || !title) throw new Error('Missing RFX ID or title');
  await page.getByRole('textbox', { name: 'Search Title' }).click();
  await page.getByRole('textbox', { name: 'Search title or Ref-Id' }).fill(RFX_id );
  await page.getByLabel('icon: search').locator('svg').dblclick();
  await page.getByText(title).first().click();
  await page.getByRole('tab', { name: 'RFQ' }).waitFor({ state: "visible", timeout: 10000 });
  await page.getByRole('tab', { name: 'RFQ' }).click();
  await page.getByRole('button', { name: 'Decline' }).click();
  await page.getByRole('textbox', { name: 'Add a remark for declining' }).fill(counterofferVendorbid.C_offerRemark);
  await page.getByLabel('Declining the counter offer').getByRole('button', { name: 'Decline' }).click();

    await validateAndLog({
    locator: page.locator('div').filter({ hasText: 'Counter Offer resolved' }).nth(3),
    smessage: "Counter offer decline by Vendor successfully ",
    fmessage:  "Counter offer decline failed" 
  })

}

const counter_offer_vendor3 = async ({ page , counterofferVendorbid}) => {
// Modify counter offer
  var [ RFX_id , title ] =  await sendCounterOfferAPI();
  await page.waitForTimeout(2000);
  if (!RFX_id  || !title) throw new Error('Missing RFX ID or title');
  await page.getByRole('textbox', { name: 'Search Title' }).click();
  await page.getByRole('textbox', { name: 'Search title or Ref-Id' }).fill(RFX_id );
  await page.getByLabel('icon: search').locator('svg').dblclick();
  await page.getByText(title).first().click();
  await page.getByRole('tab', { name: 'RFQ' }).waitFor({ state: "visible", timeout: 10000 });
  await page.getByRole('tab', { name: 'RFQ' }).click();
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Decline' }).click();
  await page.getByRole('button', { name: 'Modify counter offer' }).click();
  await page.getByRole('gridcell', { name: '₹ 20 /KG icon: arrow-right ₹' }).click();
  await page.locator('input[type="text"]').fill(counterofferVendorbid.C_offerModify);
  await page.locator('input[type="text"]').press("Enter");
  await page.getByRole('button', { name: 'Place Modified Bid' }).first().waitFor({ state: "visible", timeout: 5000 });
  await page.getByRole('button', { name: 'Place Modified Bid' }).first().dblclick();
  await page.getByRole('textbox', { name: 'Add a remark for declining' }).fill(counterofferVendorbid.C_offerRemark);
  await page.getByLabel('Want to negotiate on the').getByRole('button', { name: 'Place Modified Bid' }).dblclick();
  // In case of 'Bid not found' error, retry once
  if (await page.getByText('Bid not found').isVisible()) {
  await page.reload();
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Decline' }).click();
  await page.getByRole('button', { name: 'Modify counter offer' }).click();
  await page.getByRole('gridcell', { name: '₹ 20 /KG icon: arrow-right ₹' }).click();
  await page.locator('input[type="text"]').fill(counterofferVendorbid.C_offerModify);
  await page.locator('input[type="text"]').press("Enter");
  await page.getByRole('button', { name: 'Place Modified Bid' }).first().waitFor({ state: "visible", timeout: 10000 });
  await page.getByRole('button', { name: 'Place Modified Bid' }).first().dblclick();
  await page.getByRole('textbox', { name: 'Add a remark for declining' }).fill(counterofferVendorbid.C_offerRemark);
  await page.getByLabel('Want to negotiate on the').getByRole('button', { name: 'Place Modified Bid' }).click();
  }else{
  await validateAndLog({
    locator: page.locator('div').filter({ hasText: 'Bid revised successfully!' }).nth(3),
    smessage: "Revised Counter offer  bid sent to Vendor successfully ",
    fmessage:  "Revised Counter offer bid sending to Vendor failed" 
  })}
}

const lessThanBest_offer_vendor = async ({ page }) => {
  var [ RFX_id , title ] =  await bestOfferAPI();
  await page.waitForTimeout(2000);
  if (!RFX_id  || !title) throw new Error('Missing RFX ID or title');
  await page.getByRole('textbox', { name: 'Search Title' }).click();
  await page.getByRole('textbox', { name: 'Search title or Ref-Id' }).fill(RFX_id );
  await page.getByLabel('icon: search').locator('svg').dblclick();
  await page.getByText(title).first().click();
  await page.getByRole('tab', { name: 'RFQ' }).click();
  await page.waitForTimeout(3000);
  await page.getByRole('gridcell', { name: '₹ 30 /KG' }).dblclick();
  await page.locator('input[type="text"]').fill("25");
  await page.locator('input[type="text"]').press("Enter");
  await page.getByRole('button', { name: 'Revise Quote' }).first().waitFor({ state: "visible", timeout: 5000 });
  await page.getByRole('button', { name: 'Revise Quote' }).first().dblclick();
  // In case of 'Bid not found' error, retry once
if (await page.getByText('Bid not found').isVisible()) {
  console.log("⚠️ Bid not found detected. Retrying...");
  await page.reload();
  await page.waitForTimeout(3000);
  await page.getByRole('gridcell', { name: '₹ 30 /KG' }).dblclick();
  await page.locator('input[type="text"]').fill("25");
  await page.locator('input[type="text"]').press("Enter");
  await page.getByRole('button', { name: 'Revise Quote' }).first().click();
  }else{
    await validateAndLog({
    locator: page.getByText('Bid revised successfully!'),
    smessage: "Best offer  bid sent to Vendor successfully ",
    fmessage:  "Best offer bid sending to Vendor failed" 
  })}
}

const morethanBest_offer_vendor = async ({ page }) => {
  var [ RFX_id , title ] =  await bestOfferAPI();
  await page.waitForTimeout(2000);
  if (!RFX_id  || !title) throw new Error('Missing RFX ID or title');
  await page.getByRole('textbox', { name: 'Search Title' }).click();
  await page.getByRole('textbox', { name: 'Search title or Ref-Id' }).fill(RFX_id );
  await page.getByLabel('icon: search').locator('svg').dblclick();
  await page.getByText(title).first().click();
  await page.getByRole('tab', { name: 'RFQ' }).waitFor({ state: "visible", timeout: 10000 });
  await page.getByRole('tab', { name: 'RFQ' }).click();
  await page.getByRole('gridcell', { name: '₹ 30 /KG' }).dblclick();
  await page.locator('input[type="text"]').fill("45");
  await page.locator('input[type="text"]').press("Enter");
  await page.getByRole('button', { name: 'Revise Quote' }).first().click();

  const tooltip1 = page.getByRole('tooltip', { name: 'You cannot increase price' });
  const tooltip2 = page.getByText('Please enter valid responses');

  await page.getByRole('gridcell', { name: '₹ 45 /KG' }).hover();
  if (await tooltip1.isVisible() || await tooltip2.isVisible()) {
  console.log('✅ Best Offer Price is more than Price cap - Vendor Bid is not submitted ');
  } else {
  throw new Error('❌ Best Offer Price is more than Price cap - Vendor Bid is  submitted  ');
   }
}

export {  morethanBest_offer_vendor , vendor_bid_rfq_less_than_Pricecap,vendor_bid_rfq_more_than_Pricecap , vendor_bid_tech_priceCap , vendor_bid_tech_regret , vendor_bid_tech , vendor_bid_rfq , test , counter_offer_vendor1 , counter_offer_vendor2 , counter_offer_vendor3 , lessThanBest_offer_vendor, vendor_bid_rfq_non_regret };
