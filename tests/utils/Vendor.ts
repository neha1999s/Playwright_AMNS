import { validateAndLog } from "./common";
import { test } from "../setupBlocks/global.setup";
import { fetch_prs , eventCreationAPI , vendorBidAPI , sendCounterOfferAPI , priceCapBeforeBid} from "./FlowCover_API";

const vendor_bid_tech = async ({ page }) => {
  const [ RFX_id , title ] = await eventCreationAPI();
  await page.waitForTimeout(2000);
  if (!RFX_id  || !title) throw new Error('Missing RFX ID or title');
  await page.getByRole('textbox', { name: 'Search title or Ref-Id' }).fill(RFX_id );
  await page.getByLabel('icon: search').locator('svg').dblclick();
  await page.getByText(title).first().click();
  await page.getByRole('button', { name: 'I will participate' }).click();
  await page.getByRole('tab', { name: 'Technical Stage' }).click();
  await page.waitForTimeout(2000);
  await page.locator('span').filter({ hasText: 'Don’t miss out on' }).locator('a').click();
  // Quick Fill (done twice)
  for (let i = 0; i < 2; i++) {
    await page.getByText('Quick Fill').nth(i).dblclick();
    await page.getByRole('menuitem', { name: 'Same as Requested' }).click();
  }
  await page.getByRole('button', { name: 'Submit' }).first().click();
  await validateAndLog({
    locator: page.getByRole('tab', { name: 'Technical Stage Submitted' }),
    smessage: "Technical Stage Submitted successfully ",
    fmessage:  "Technical Stage Submission failed" 
}) 
}

const vendor_bid_tech_priceCap = async ({ page }) => {
  const [ RFX_id , title ] = await priceCapBeforeBid();
  await page.waitForTimeout(2000);
  if (!RFX_id  || !title) throw new Error('Missing RFX ID or title');
  await page.getByRole('textbox', { name: 'Search title or Ref-Id' }).fill(RFX_id );
  await page.getByLabel('icon: search').locator('svg').dblclick();
  await page.getByText(title).first().click();
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'I will participate' }).click();
  await page.getByRole('tab', { name: 'Technical Stage' }).click();
  await page.waitForTimeout(2000);
  await page.locator('span').filter({ hasText: 'Don’t miss out on' }).locator('a').click();
  // Quick Fill (done twice)
  for (let i = 0; i < 2; i++) {
    await page.getByText('Quick Fill').nth(i).dblclick();
    await page.getByRole('menuitem', { name: 'Same as Requested' }).click();
  }
  await page.getByRole('button', { name: 'Submit' }).first().click();
  await validateAndLog({
    locator: page.getByRole('tab', { name: 'Technical Stage Submitted' }),
    smessage: "Technical Stage Submitted successfully ",
    fmessage:  "Technical Stage Submission failed" 
}) 
}

const vendor_bid_rfq_less_than_Pricecap = async ({ page ,inlinefield , mandatoryGlobalField  }) => {
  await page.getByRole('tab', { name: 'RFQ' }).click();
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
  // click correct cell
  await page.locator(`.rdg-row >> nth=${rowIndex} >> div:nth-child(${colIndex})`).click();
  if(!(await page.locator('input[type="text"]').isVisible)){
    await page.locator(`.rdg-row >> nth=${rowIndex} >> div:nth-child(${colIndex})`).dblclick();
  }
 
  // Fill the value
  await page.locator('input[type="text"]').fill(value);
  await page.locator('input[type="text"]').press("Enter");
}

for (let [field, config] of Object.entries(mandatoryGlobalField )) {
  const row = page.getByRole("row", { name: field, exact: true });
  await page.waitForTimeout(2000);

  if (config.type === "dropdown") {
    let retries = 0;
    while (!(await page.getByRole("option").first().isVisible()) && retries < 3) {
      await row.getByRole("gridcell").nth(1).click();
      await page.waitForTimeout(500);
      retries++;
    }

    if (config.value === "first") {
      await page.getByRole("option").first().click();
      await page.waitForTimeout(2000);
    } else {
      await page.getByRole("option", { name: config.value }).first().click();
      await page.waitForTimeout(2000);
    }
  }
  else if (config.type === "text") {
    await row.getByRole("gridcell").nth(1).click();
    await page.waitForTimeout(2000);
    await page.locator('input[type="text"]').fill(config.value);
  }
  else if (config.type === "date") {
    await row.getByRole("gridcell").nth(1).click();
    await page.waitForTimeout(2000);
    await page.getByRole("gridcell", { name: "icon: calendar" }).click();
    await page.locator("div").filter({ hasText: new RegExp(`^${config.value}$`) }).click();
  }
}
  let a= 0;
    while (await page.getByRole('button', { name: 'Submit Quote' }).first().isVisible() && a < 2) {
      await page.getByRole('button', { name: 'Submit Quote' }).first().click();
      await page.waitForTimeout(2000);
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
  await page.getByRole('radio', { name: 'Indian Rupees (INR)' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(1000);
  // inline 
for (let i = 0; i < inlineField.length; i++) {
  // scroll before every 2-row batch
  if (i % 2 === 0) {
    await page.locator('div[role="grid"]').first().hover();
    await page.mouse.wheel(300, 0);
    await page.waitForTimeout(800);
  }

  const [colIndex, rowIndex, value] = inlineField[i];
  // click correct cell
  await page.locator(`.rdg-row >> nth=${rowIndex} >> div:nth-child(${colIndex})`).click();
  if(!(await page.locator('input[type="text"]').isVisible)){
    await page.locator(`.rdg-row >> nth=${rowIndex} >> div:nth-child(${colIndex})`).dblclick();
  }

  // Fill the value
  await page.locator('input[type="text"]').fill(value);
  await page.locator('input[type="text"]').press("Enter");
}

for (let [field, config] of Object.entries(mandatoryGlobalField)) {
  const row = page.getByRole("row", { name: field, exact: true });
  await page.waitForTimeout(3000);

  if (config.type === "dropdown") {
    let retries = 0;
    while (!(await page.getByRole("option").first().isVisible()) && retries < 3) {
      await row.getByRole("gridcell").nth(1).click();
      await page.waitForTimeout(500);
      retries++;
    }

    if (config.value === "first") {
      await page.getByRole("option").first().click();
    } else {
      await page.getByRole("option", { name: config.value }).first().click();
      await page.waitForTimeout(2000);
    }
  }
  else if (config.type === "text") {
      await row.getByRole("gridcell").nth(1).click();
      await page.waitForTimeout(2000);
      await page.locator('input[type="text"]').fill(config.value);
      await page.waitForTimeout(2000);
  }
  else if (config.type === "date") {
    await row.getByRole("gridcell").nth(1).click();
    await page.waitForTimeout(2000);
    await page.getByRole("gridcell", { name: "icon: calendar" }).click();
    await page.locator("div").filter({ hasText: new RegExp(`^${config.value}$`) }).click();
  }
}
  let a= 0;
    while (await page.getByRole('button', { name: 'Submit Quote' }).first().isVisible() && a < 2) {
      await page.getByRole('button', { name: 'Submit Quote' }).first().dblclick();
      await page.waitForTimeout(2000);
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
  var [ RFX_id , title ] = await eventCreationAPI();
  await page.waitForTimeout(3000);
  if (!RFX_id  || !title) throw new Error('Missing RFX ID or title');
  await page.getByRole('textbox', { name: 'Search title or Ref-Id' }).fill(RFX_id );
  await page.getByLabel('icon: search').locator('svg').dblclick();
  await page.getByText(title).first().click();
 await page.getByRole('button', { name: 'I will participate' }).click();
 await page.waitForTimeout(3000);
  await page.getByRole('tab', { name: 'Technical Stage' }).click();
  await page.waitForTimeout(2000);
  await page.locator('span').filter({ hasText: 'Don’t miss out on' }).locator('a').click();
  // Quick Fill (done twice)
  for (let i = 0; i < 2; i++) {
    await page.getByText('Quick Fill').nth(i).dblclick();
      if (i === 0) {
    await page.getByRole('menuitem', { name: 'Same as Requested' }).click();
  } else {
    await page.getByRole('menuitem', { name: 'Regret Item' }).click();
  }}
  await page.getByRole('button', { name: 'Submit' }).first().click();
  await validateAndLog({
    locator: page.getByRole('tab', { name: 'Technical Stage Submitted' }),
    smessage: "Technical Stage Submitted successfully ",
    fmessage:  "Technical Stage Submission failed" 
}) 
}

const vendor_bid_rfq = async ({ page  , inlinefieldrfq , mandatoryGlobalField}) => {
  await page.getByRole('tab', { name: 'RFQ' }).click();
  await page.getByRole('radio', { name: 'Indian Rupees (INR)' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(1000);
  // inline 
for (let i = 0; i < inlinefieldrfq.length; i++) {
  // scroll before every 2-row batch
  if (i % 2 === 0) {
    await page.locator('div[role="grid"]').first().hover();
    await page.mouse.wheel(300, 0);
    await page.waitForTimeout(800);
  }

  const [colIndex, rowIndex, value] = inlinefieldrfq[i];
  // click correct cell
  await page.locator(`.rdg-row >> nth=${rowIndex} >> div:nth-child(${colIndex})`).dblclick();
  if(!(await page.locator('input[type="text"]').isVisible)){
    await page.locator(`.rdg-row >> nth=${rowIndex} >> div:nth-child(${colIndex})`).dblclick();
  }
  // Fill the value
  await page.locator('input[type="text"]').fill(value);
  await page.locator('input[type="text"]').press("Enter");
}

for (let [field, config] of Object.entries(mandatoryGlobalField)) {
  const row = page.getByRole("row", { name: field, exact: true });
  await page.waitForTimeout(2000);

  if (config.type === "dropdown") {
    let retries = 0;
    while (!(await page.getByRole("option").first().isVisible()) && retries < 3) {
      await row.getByRole("gridcell").nth(1).click();
      await page.waitForTimeout(500);
      retries++;
    }

    if (config.value === "first") {
      await page.getByRole("option").first().click();
      await page.waitForTimeout(2000);
    } else {
      await page.getByRole("option", { name: config.value }).first().click();
      await page.waitForTimeout(2000);
    }
  }
  else if (config.type === "text") {
      await row.getByRole("gridcell").nth(1).click();
      await page.waitForTimeout(2000);
      await page.locator('input[type="text"]').fill(config.value);
  }
  else if (config.type === "date") {
    await row.getByRole("gridcell").nth(1).click();
    await page.waitForTimeout(2000);
    await page.getByRole("gridcell", { name: "icon: calendar" }).click();
    await page.locator("div").filter({ hasText: new RegExp(`^${config.value}$`) }).click();
  }
}
  let a= 0;
    while (await page.getByRole('button', { name: 'Submit Quote' }).first().isVisible() && a < 2) {
      await page.getByRole('button', { name: 'Submit Quote' }).first().click();
      await page.waitForTimeout(1000);
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
  await page.getByRole('radio', { name: 'Indian Rupees (INR)' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(1000);
  // inline 
for (let i = 0; i < inline_non_regrets.length; i++) {
  // scroll before every 2-row batch
  if (i % 1 === 0) {
    await page.locator('div[role="grid"]').first().hover();
    await page.mouse.wheel(300, 0);
    await page.waitForTimeout(800);
  }

  const [colIndex, rowIndex, value] = inline_non_regrets[i];
  // click correct cell
  await page.locator(`.rdg-row >> nth=${rowIndex} >> div:nth-child(${colIndex})`).click();
  if(!(await page.locator('input[type="text"]').isVisible)){
    await page.locator(`.rdg-row >> nth=${rowIndex} >> div:nth-child(${colIndex})`).dblclick();
  }

  // Fill the value
  await page.locator('input[type="text"]').fill(value);
  await page.locator('input[type="text"]').press("Enter");
}

for (let [field, config] of Object.entries(mandatoryGlobalField)) {
  const row = page.getByRole("row", { name: field, exact: true });
  await page.waitForTimeout(3000);

  if (config.type === "dropdown") {
    let retries = 0;
    while (!(await page.getByRole("option").first().isVisible()) && retries < 3) {
      await row.getByRole("gridcell").nth(1).click();
      await page.waitForTimeout(1000);
      retries++;
    }

    if (config.value === "first") {
      await page.getByRole("option").first().click();
      await page.waitForTimeout(2000);
    } else {
      await page.getByRole("option", { name: config.value }).first().click();
      await page.waitForTimeout(2000);
    }
  }
  else if (config.type === "text") {
      await row.getByRole("gridcell").nth(1).click();
      await page.waitForTimeout(2000);
      await page.locator('input[type="text"]').fill(config.value);
      await page.locator('input[type="text"]').press("Enter");
  }
  else if (config.type === "date") {
    await row.getByRole("gridcell").nth(1).click();
    await page.waitForTimeout(2000);
    await page.getByRole("gridcell", { name: "icon: calendar" }).click();
    await page.locator("div").filter({ hasText: new RegExp(`^${config.value}$`) }).click();
  }
}
  let a= 0;
    while (await page.getByRole('button', { name: 'Submit Quote' }).first().isVisible() && a < 2) {
      await page.getByRole('button', { name: 'Submit Quote' }).first().click();
      await page.waitForTimeout(1000);
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
  await page.waitForTimeout(2000);
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
  await page.waitForTimeout(2000);
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
  await page.waitForTimeout(2000);
  await page.getByRole('tab', { name: 'RFQ' }).click();
  await page.getByRole('button', { name: 'Decline' }).click();
  await page.getByRole('button', { name: 'Modify counter offer' }).click();
  await page.getByRole('gridcell', { name: '₹ 20 /KG icon: arrow-right ₹' }).click();
  await page.locator('input[type="text"]').fill(counterofferVendorbid.C_offerModify);
  await page.locator('input[type="text"]').press("Enter");
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Place Modified Bid' }).first().dblclick();
  await page.getByRole('textbox', { name: 'Add a remark for declining' }).fill(counterofferVendorbid.C_offerRemark);
  await page.getByLabel('Want to negotiate on the').getByRole('button', { name: 'Place Modified Bid' }).click();
  await page.waitForTimeout(2000);
  await validateAndLog({
    locator: page.locator('div').filter({ hasText: 'Bid revised successfully!' }).nth(3),
    smessage: "Revised Counter offer  bid sent to Vendor successfully ",
    fmessage:  "Revised Counter offer bid sending to Vendor failed" 
  })
}

const best_offer_vendor = async ({ page }) => {
  await page.getByRole('textbox', { name: 'Search title or Ref-Id' }).press("Enter");
  // locator('div:nth-child(3) > div > .styles_stageTitle__IUGUn').first()
  await page.locator('.styles_stageTitle__IUGUn').first().click();
  await page.getByRole('tab', { name: 'RFQ' }).click();
  // await page.getByRole('gridcell', { name: '₹ 20 /NO' }).click();
  // await page.locator('input[type="text"]').fill("15");
  await page.getByRole('gridcell', { name: '₹ 30 /NO' }).dblclick();
  // await page.locator('input[type="text"]').clear();
  await page.locator('input[type="text"]').fill("25");
  await page.locator('input[type="text"]').press("Enter");
  await page.getByRole('button', { name: 'Revise Quote' }).first().click();
}

export {  vendor_bid_rfq_less_than_Pricecap,vendor_bid_rfq_more_than_Pricecap , vendor_bid_tech_priceCap , vendor_bid_tech_regret , vendor_bid_tech , vendor_bid_rfq , test , counter_offer_vendor1 , counter_offer_vendor2 , counter_offer_vendor3 , best_offer_vendor, vendor_bid_rfq_non_regret };