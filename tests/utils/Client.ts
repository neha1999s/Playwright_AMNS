
import { validateAndLog } from "./common";
import { test } from "../setupBlocks/global.setup";
import { fetch_prs , eventCreationAPI , vendorBidAPI , submissionTimeExpireAPI} from "./FlowCover_API";


const pr_tech_RFQ_API = async ({ page }) => {

  var latestPR = await fetch_prs();
  if (!latestPR) throw new Error('No PR retrieved from API');
 for (let i = 0; i < 2; i++) {
  const cell = page.getByRole('cell', { name: latestPR }).nth(i);
  const checkbox = page.getByRole('checkbox').nth(i + 1);

  if (await checkbox.isVisible()) {
    let retries = 0;
    while (!(await checkbox.isChecked()) && retries < 5) { 
      await checkbox.click();
      await page.waitForTimeout(500); 
      retries++;
    }

    if (await checkbox.isChecked()) {
      console.log(`✅ Checkbox at index ${i + 1} is checked`);
    } else {
      console.log(`❌ Failed to check checkbox at index ${i + 1}`);
    }
  }
}
 await page.getByRole('button', { name: 'icon: shopping-cart Purchase' }).click();
 await page.getByRole('button', { name: 'Create Project' }).click();
 await page.getByRole('menuitem', { name: 'Technical Stage' }).click();
 await page.getByRole('menuitem', { name: 'RFQ' }).click();
 await page.getByRole('button', { name: 'Create Project' }).click();

  await validateAndLog({
    locator: page.getByText('Title:Add AttachmentsAdd T&'),
    smessage: "Successfully redirected to project creation page"  ,
    fmessage:  "Failed in redirected to project creation page"
  })
}

const pr_selecting_by_UI = async ({ page }) => {
  await page.getByRole('checkbox').first().waitFor({ state: "visible", timeout: 50000 });
   for (let i = 0; i < 2; i++) {
  const checkbox = page.getByRole('checkbox').nth(i + 1);

  if (await checkbox.isVisible()) {
    let retries = 0;
    while (!(await checkbox.isChecked()) && retries < 5) { 
      await checkbox.click();
      await page.waitForTimeout(500); 
      retries++;
    }

    if (await checkbox.isChecked()) {
      console.log(`✅ Checkbox at index ${i + 1} is checked`);
    } else {
      console.log(`❌ Failed to check checkbox at index ${i + 1}`);
    }
  }
}
}

const pr_tech_RFQ_By_UI = async ({ page }) => {
 await page.getByRole('checkbox').first().waitFor({ state: "visible", timeout: 50000 });
 await pr_selecting_by_UI({ page });
 await page.getByRole('button', { name: 'icon: shopping-cart Purchase' }).click();
 await page.getByRole('button', { name: 'Create Project' }).click();
 await page.getByRole('menuitem', { name: 'Technical Stage' }).click();
 await page.getByRole('menuitem', { name: 'RFQ' }).click();
 await page.getByRole('button', { name: 'Create Project' }).click();

  await validateAndLog({
    locator: page.getByText('Title:Add AttachmentsAdd T&'),
    smessage: "Successfully redirected to project creation page"  ,
    fmessage:  "Failed in redirected to project creation page"
  })
}

const pr_tech_auction = async ({ page  , eventCreation_detail  }) => {
  const epochSeconds = Math.floor(Date.now() / 1000);
  let title = String("Auto_AMNS_" + epochSeconds);
  await pr_selecting_by_UI({ page });
//   var latestPR = await fetch_prs();
//   if (!latestPR) throw new Error('No RFX ID retrieved from API');
//  for (let i = 0; i < 2; i++) {
//   const cell = page.getByRole('cell', { name: latestPR }).nth(i);
//   const checkbox = page.getByRole('checkbox').nth(i + 1);

//   if (await cell.isVisible()) {
//     let retries = 0;
//     while (!(await checkbox.isChecked()) && retries < 5) { // max 5 retries
//       await checkbox.click();
//       await page.waitForTimeout(500); // small wait before re-checking
//       retries++;
//     }

//     if (await checkbox.isChecked()) {
//       console.log(`✅ Checkbox at index ${i + 1} is checked`);
//     } else {
//       console.log(`❌ Failed to check checkbox at index ${i + 1}`);
//     }
//   }
// }
 await page.getByRole('button', { name: 'icon: shopping-cart Purchase' }).click();
 await page.getByRole('button', { name: 'Create Project' }).click();
 await page.getByRole('menuitem', { name: 'Technical Stage' }).click();
 await page.getByRole('menuitem', { name: 'Auction' }).click();
 await page.getByRole('button', { name: 'Create Project' }).click();

 await page.getByRole('textbox', { name: 'Enter the title of the project' }).fill(title);
 await page.getByRole('tab', { name: 'Technical Stage' }).click();

 await page.getByRole('button', { name: 'Technical Stage icon: right' }).click();
 await page.getByRole('radio', { name: 'I\'ll do line-item wise' }).click();
 await page.getByRole('button', { name: 'Save' }).click();
 await page.getByRole('button', { name: 'Select Templates' }).click();
 const templateOption = page.getByRole('menuitem', { name: eventCreation_detail.tech_template });
 await templateOption.waitFor({ state: 'visible', timeout: 20000 });
 await templateOption.click();
 console.log("✅ Tech Template selected");
 
// Line item - add evaluator
let buttons = await page.getByRole("button", { name: "icon: plus Add Evaluator" }).all();
for (let i = 0; i < buttons.length; i++) {
  // Re-query button fresh each iteration
  const addEvaluatorBtn = page.getByRole("button", { name: "icon: plus Add Evaluator" }).first();
  const addEvaluatorBtn1 = page.getByRole("button", { name: "icon: plus Add Evaluator" });
  const evaluatorOption = page.getByRole("menuitem", { name: eventCreation_detail.evaluator });
  if (i === 0) {
    await addEvaluatorBtn.waitFor({ state: 'visible', timeout: 20000 }); 
    await addEvaluatorBtn.click();
    await evaluatorOption.dblclick(); 
  } 
  
  else if (i === 1) {
    await page.locator('[data-test-id="virtuoso-scroller"]').hover();
    await page.mouse.wheel(0,600);
    await page.waitForTimeout(800);
    await addEvaluatorBtn1.waitFor({ state: 'visible', timeout: 20000 });
    await page.waitForTimeout(1000);
    await addEvaluatorBtn1.click();
    await evaluatorOption.dblclick();
    break;
  }
}
 console.log("Evaluators added");

 await page.getByRole('tab', { name: 'Auction' }).click();
 await page.getByRole('button', { name: 'Formula Template' }).click();
 await page.getByRole('menuitem', { name: eventCreation_detail.rfq_template, exact: true }).click();
 await page.getByRole('button', { name: 'Yes' }).click();

  await page.getByRole('button', { name: 'Rank on line icon: right' }).click();
  await page. getByRole('checkbox').click();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  // Vendor search
 const vendorCombobox = page.getByRole('combobox').filter({ hasText: 'Search vendors you want to add' }).locator('div');
 await vendorCombobox.first().click();

// Type vendor name
 const searchInput = page.locator('div.ant-select-selection[role="combobox"] input.ant-select-search__field');
 await searchInput.fill(eventCreation_detail.search_vendor);

// Wait for dropdown option
 const vendorOption = page.getByRole("menuitem", { name: new RegExp(`Company - ${eventCreation_detail.search_vendor}`) });

 try {
   await vendorOption.waitFor({ state: 'visible', timeout: 5000 });
 } catch {
  // Retry if not visible
   await searchInput.clear();
   await searchInput.fill(eventCreation_detail.search_vendor);
   await vendorOption.waitFor({ state: 'visible', timeout: 20000 });
 }

// Select the vendor
await vendorOption.click();

 await page.getByRole('button', { name: 'Publish' }).click();
 await page.getByLabel(title).getByRole('button', { name: 'Publish' }).click();

 await validateAndLog({
    locator: page.locator('div').filter({ hasText: 'Project created successfully' }).nth(3),
    smessage: "Project created successfully with title: " + title,
    fmessage:  "Project creation failed" + title
  })
}

const qa_event_vendorwise = async ({ page  , eventCreation_detail}) => {
 const epochSeconds = Math.floor(Date.now() / 1000);
 let title = String("Auto_Event_" + epochSeconds);
 await page.getByRole('textbox', { name: 'Enter the title of the project' }).fill(title);
 await page.getByRole('tab', { name: 'Technical Stage' }).click();
  // Select Tech Template
await page.locator('div', { hasText: /^Select Template$/ }).first().click();
const templateOption = page.getByRole('menuitem', { name: eventCreation_detail.tech_template }).nth(0);;
await templateOption.waitFor({ state: 'visible', timeout: 20000 });
await templateOption.click();

console.log("✅ Tech Template selected");

// Line item - add evaluator
let buttons = await page.getByRole("button", { name: "icon: plus Add Evaluator" }).all();
for (let i = 0; i < buttons.length; i++) {
  // Re-query button fresh each iteration
  const addEvaluatorBtn = page.getByRole("button", { name: "icon: plus Add Evaluator" }).nth(0);
  const evaluatorOption = page.getByRole("menuitem", { name: eventCreation_detail.evaluator1 });
  let retries = 0; 
  while (!(await evaluatorOption.isVisible()) && retries < 5) { 
    await addEvaluatorBtn.waitFor({ state: 'visible', timeout: 20000 }); 
    await addEvaluatorBtn.click(); 
    retries++; 
}
  await evaluatorOption.waitFor({ state: 'visible', timeout: 30000 });
  await evaluatorOption.click();
}
 console.log("Evaluators added");

 await page.getByRole('tab', { name: 'RFQ' }).click();
 await page.getByRole('button', { name: 'Formula Template' }).click();
 await page.getByRole('menuitem', { name: eventCreation_detail.rfq_template, exact: true }).click();
 await page.getByRole('button', { name: 'Yes' }).click();
 console.log("RFQ Template selected");
  // Vendor search
 const vendorCombobox = page.getByRole('combobox').filter({ hasText: 'Search vendors you want to add' }).locator('div');
 await vendorCombobox.first().click();

// Type vendor name
 const searchInput = page.locator('div.ant-select-selection[role="combobox"] input.ant-select-search__field');
 await searchInput.fill(eventCreation_detail.search_vendor);

// Wait for dropdown option
 const vendorOption = page.getByRole("menuitem", { name: new RegExp(`Company - ${eventCreation_detail.search_vendor}`) });

 try {
   await vendorOption.waitFor({ state: 'visible', timeout: 5000 });
 } catch {
  // Retry if not visible
   await searchInput.clear();
   await searchInput.fill(eventCreation_detail.search_vendor);
   await vendorOption.waitFor({ state: 'visible', timeout: 20000 });
 }

// Select the vendor
await vendorOption.click();

 await page.getByRole('button', { name: 'Publish' }).click();
 await page.getByLabel(title).getByRole('button', { name: 'Publish' }).click();
 await validateAndLog({
    locator: page.locator('div').filter({ hasText: 'Project created successfully' }).nth(3),
    smessage: "Project created successfully with title: " + title,
    fmessage:  "Project creation failed" + title
  })
}


const qa_event_lineitem = async ({ page , eventCreation_detail}) => {
 const epochSeconds = Math.floor(Date.now() / 1000);
 let title = String("Auto_Event_" + epochSeconds);
 await page.getByRole('textbox', { name: 'Enter the title of the project' }).fill(title);
 await page.getByRole('tab', { name: 'Technical Stage' }).click();
 await page.getByRole('button', { name: 'Technical Stage icon: right' }).click();
 await page.getByRole('radio', { name: 'I\'ll do line-item wise' }).click();
 await page.getByRole('button', { name: 'Save' }).click();
 await page.getByRole('button', { name: 'Select Templates' }).click();
 const templateOption = page.getByRole('menuitem', { name: eventCreation_detail.tech_template });
 await templateOption.waitFor({ state: 'visible', timeout: 20000 });
 await templateOption.click();
 console.log("✅ Tech Template selected");

// Line item - add evaluator
let buttons = await page.getByRole("button", { name: "icon: plus Add Evaluator" }).all();
for (let i = 0; i < buttons.length; i++) {
  // Re-query button fresh each iteration
  const addEvaluatorBtn = page.getByRole("button", { name: "icon: plus Add Evaluator" }).first();
  const addEvaluatorBtn1 = page.getByRole("button", { name: "icon: plus Add Evaluator" });
  const evaluatorOption = page.getByRole("menuitem", { name: eventCreation_detail.evaluator });
  if (i === 0) {
    await addEvaluatorBtn.waitFor({ state: 'visible', timeout: 20000 }); 
    await addEvaluatorBtn.click();
    await evaluatorOption.dblclick(); 
  } 
  if (i === 1) {
    await page.locator('[data-test-id="virtuoso-scroller"]').hover();
    await page.mouse.wheel(0,600);
    await page.waitForTimeout(800);
    await addEvaluatorBtn1.waitFor({ state: 'visible', timeout: 20000 });
    await page.waitForTimeout(1000);
    await addEvaluatorBtn1.click();
    await evaluatorOption.dblclick();
    break;
  }

}
 console.log("Evaluators added");
 
 await page.getByRole('tab', { name: 'RFQ' }).click();
 await page.getByRole('button', { name: 'Formula Template' }).click();
 await page.getByRole('menuitem', { name: eventCreation_detail.rfq_template, exact: true }).click();
 await page.getByRole('button', { name: 'Yes' }).click();

  // Vendor search
 const vendorCombobox = page.getByRole('combobox').filter({ hasText: 'Search vendors you want to add' }).locator('div');
 await vendorCombobox.first().click();

// Type vendor name
 const searchInput = page.locator('div.ant-select-selection[role="combobox"] input.ant-select-search__field');
 await searchInput.fill(eventCreation_detail.search_vendor);

// Wait for dropdown option
 const vendorOption = page.getByRole("menuitem", { name: new RegExp(`Company - ${eventCreation_detail.search_vendor}`) });

 try {
   await vendorOption.waitFor({ state: 'visible', timeout: 5000 });
 } catch {
  // Retry if not visible
   await searchInput.clear();
   await searchInput.fill(eventCreation_detail.search_vendor);
   await vendorOption.waitFor({ state: 'visible', timeout: 20000 });
 }

// Select the vendor
await vendorOption.click();
await page.getByRole('button', { name: 'Publish' }).click(); 
await page.getByLabel(title).getByRole('button', { name: 'Publish' }).click();

 await validateAndLog({
    locator: page.locator('div').filter({ hasText: 'Project created successfully' }).nth(3),
    smessage: "Project created successfully with title: " + title,
    fmessage:  "Project creation failed" + title
  })
};

const qa_event_type_Auction = async ({ page  , eventCreation_detail}) => {
 const epochSeconds = Math.floor(Date.now() / 1000);
 let title = String("Auto_Event_" + epochSeconds);
 await page.getByRole('textbox', { name: 'Enter the title of the project' }).fill(title);
 await page.getByRole('tab', { name: 'Technical Stage' }).click();
 await page.getByRole('button', { name: 'Technical Stage icon: right' }).click();
 await page.getByRole('radio', { name: 'I\'ll do line-item wise' }).click();
 await page.getByRole('button', { name: 'Save' }).click();
 await page.getByRole('button', { name: 'Select Templates' }).click();
 const templateOption = page.getByRole('menuitem', { name: eventCreation_detail.tech_template });
 await templateOption.waitFor({ state: 'visible', timeout: 20000 });
 await templateOption.click();
 console.log("✅ Tech Template selected");

let buttons = await page.getByRole("button", { name: "icon: plus Add Evaluator" }).all();
for (let i = 0; i < buttons.length; i++) {
  // Re-query button fresh each iteration
  const addEvaluatorBtn = page.getByRole("button", { name: "icon: plus Add Evaluator" }).first();
  const addEvaluatorBtn1 = page.getByRole("button", { name: "icon: plus Add Evaluator" });
  const evaluatorOption = page.getByRole("menuitem", { name: eventCreation_detail.evaluator });
  if (i === 0) {
    await addEvaluatorBtn.waitFor({ state: 'visible', timeout: 20000 }); 
    await addEvaluatorBtn.click();
    await evaluatorOption.dblclick(); 
  } 
  if (i === 1) {
    await page.locator('[data-test-id="virtuoso-scroller"]').hover();
    await page.mouse.wheel(0,600);
    await page.waitForTimeout(800);
    await addEvaluatorBtn1.waitFor({ state: 'visible', timeout: 20000 });
    await page.waitForTimeout(1000);
    await addEvaluatorBtn1.click();
    await evaluatorOption.dblclick();
    break;
  }
}
 console.log("Evaluators added");
 
 await page.getByRole('tab', { name: 'RFQ' }).click();
 await page.getByRole('button', { name: 'RFQ icon: right' }).click();
 await page.getByRole('radio', { name: 'Auction' }).click();
 await page.getByRole('button', { name: 'Save' }).click();
//  Add Template
 await page.getByRole('button', { name: 'Formula Template' }).click();
 await page.getByRole('menuitem', { name: eventCreation_detail.rfq_template, exact: true }).click();
 await page.getByRole('button', { name: 'Yes' }).click();
  // Vendor search
 const vendorCombobox = page.getByRole('combobox').filter({ hasText: 'Search vendors you want to add' }).locator('div');
 await vendorCombobox.first().click();

// Type vendor name
 const searchInput = page.locator('div.ant-select-selection[role="combobox"] input.ant-select-search__field');
 await searchInput.fill(eventCreation_detail.search_vendor);

// Wait for dropdown option
 const vendorOption = page.getByRole("menuitem", { name: new RegExp(`Company - ${eventCreation_detail.search_vendor}`) });

 try {
   await vendorOption.waitFor({ state: 'visible', timeout: 5000 });
 } catch {
  // Retry if not visible
   await searchInput.clear();
   await searchInput.fill(eventCreation_detail.search_vendor);
   await vendorOption.waitFor({ state: 'visible', timeout: 20000 });
 }

// Select the vendor
 await vendorOption.click();
 await page.getByRole('button', { name: 'Publish' }).click(); 
 await page.getByLabel(title).getByRole('button', { name: 'Publish' }).dblclick();

 await validateAndLog({
    locator: page.locator('div').filter({ hasText: 'Project created successfully' }).nth(3),
    smessage: "Project created successfully with title: " + title,
    fmessage:  "Project creation failed" + title
  })
};

const publish_event_with_blank_title = async ({ page , eventCreation_detail }) => {

 await page.getByRole('tab', { name: 'Technical Stage' }).click();
 await page.getByRole('button', { name: 'Technical Stage icon: right' }).click();
 await page.getByRole('radio', { name: 'I\'ll do line-item wise' }).click();
 await page.getByRole('button', { name: 'Save' }).click();
 await page.getByRole('button', { name: 'Select Templates' }).click();
 const templateOption = page.getByRole('menuitem', { name: eventCreation_detail.tech_template });
 await templateOption.waitFor({ state: 'visible', timeout: 20000 });
 await templateOption.click();
 console.log("✅ Tech Template selected");

let buttons = await page.getByRole("button", { name: "icon: plus Add Evaluator" }).all();
for (let i = 0; i < buttons.length; i++) {
  // Re-query button fresh each iteration
  const addEvaluatorBtn = page.getByRole("button", { name: "icon: plus Add Evaluator" }).first();
  const addEvaluatorBtn1 = page.getByRole("button", { name: "icon: plus Add Evaluator" });
  const evaluatorOption = page.getByRole("menuitem", { name: eventCreation_detail.evaluator });
  if (i === 0) {
    await addEvaluatorBtn.waitFor({ state: 'visible', timeout: 20000 }); 
    await addEvaluatorBtn.click();
    await evaluatorOption.dblclick(); 
  } 
  if (i === 1) {
    await page.locator('[data-test-id="virtuoso-scroller"]').hover();
    await page.mouse.wheel(0,600);
    await page.waitForTimeout(800);
    await addEvaluatorBtn1.waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForTimeout(1000);
    await addEvaluatorBtn1.click();
    await evaluatorOption.dblclick();
    break;
  }
}
 console.log("Evaluators added");
 
 await page.getByRole('tab', { name: 'RFQ' }).click();
 await page.getByRole('button', { name: 'Formula Template' }).click();
 await page.getByRole('menuitem', { name: eventCreation_detail.rfq_template, exact: true }).click();
 await page.getByRole('button', { name: 'Yes' }).click();
 await page.waitForTimeout(2000);

  // Vendor search
 const vendorCombobox = page.getByRole('combobox').filter({ hasText: 'Search vendors you want to add' }).locator('div');
 await vendorCombobox.first().click();

// Type vendor name
 const searchInput = page.locator('div.ant-select-selection[role="combobox"] input.ant-select-search__field');
 await searchInput.fill(eventCreation_detail.search_vendor);

// Wait for dropdown option
 const vendorOption = page.getByRole("menuitem", { name: new RegExp(`Company - ${eventCreation_detail.search_vendor}`) });

 try {
   await vendorOption.waitFor({ state: 'visible', timeout: 5000 });
 } catch {
  // Retry if not visible
   await searchInput.clear();
   await searchInput.fill(eventCreation_detail.search_vendor);
   await vendorOption.waitFor({ state: 'visible', timeout: 20000 });
 }

// Select the vendor
await vendorOption.click();

 await page.getByRole('textbox', { name: 'Enter the title of the project' }).clear();
 await page.getByRole('button', { name: 'Publish' }).click();
 await page.getByLabel('Publish Event').getByRole('button', { name: 'Publish' }).click();

 await validateAndLog({
    locator: page.getByText('Please fill project title!'),
    smessage: "✅ Project creation required a title",
    fmessage:  "❌ Project created without title" 
  })
};

const surrogate_bid_tech = async ({ page }) => {
 // Search & open event
  var [ RFX_id , title ] = await eventCreationAPI();
  await page.waitForTimeout(2000);
  if (!RFX_id  || !title) throw new Error('Missing RFX ID or title');
  await page.getByRole('textbox', { name: 'Search Title' }).waitFor({ state: 'visible', timeout: 30000 });
  await page.getByRole('textbox', { name: 'Search Title' }).click();
  await page.getByRole('textbox', { name: 'Search Title' }).fill(RFX_id)
  await page.getByRole('textbox', { name: 'Search Title' }).press("Enter");
  await page.getByText(title).first().click();
// Surrogate Bid - Tech 
await page.getByRole('tab', { name: 'Technical Stage' }).click();
await page.getByRole('tab', { name: 'Participants' }).click();
await page.getByRole('listitem').filter({ hasText: 'Company - 312--168115Add Bid' }).getByRole('button').click()
  // Quick Fill (done twice)
  for (let i = 0; i < 2; i++) {
    await page.getByText('Quick Fill').nth(i).click();
    await page.getByRole('menuitem', { name: 'Same as Requested' }).click();
  }
await page.getByRole('button', { name: 'Submit' }).click();
}

const surrogate_bid_RFQ = async ({ page , rate , linegst , deliverytime , mandatoryglobalfield}) => {
  var [ RFX_id , title ] = await eventCreationAPI();
  await page.waitForTimeout(2000);
  if (!RFX_id  || !title) throw new Error('Missing RFX ID or title');
  await page.getByRole('textbox', { name: 'Search Title' }).click();
  await page.getByRole('textbox', { name: 'Search Title' }).fill(RFX_id);
  await page.getByRole('textbox', { name: 'Search Title' }).press("Enter");
  await page.getByText(title).first().click();
// inline
await page.getByRole('tab', { name: 'RFQ' }).click();
if (await page.getByRole('tab', { name: 'Participants' }).isVisible()) {
  console.log(` Participants is visible`);
  await page.waitForTimeout(1000);
} 
await page.getByRole('tab', { name: 'Participants' }).dblclick();
await page.getByRole('button', { name: 'icon: plus Add Bid' }).first().click();
// Fill Rates
  for (let i = 0; i <= 1; i++) {
    await page.locator('td:nth-child(7)').nth(i).dblclick();
    await page.getByRole('cell', { name: '₹ /KG' }).getByRole('textbox').fill(rate[i]);
  }
// fill line gst percentage
for (const lineGst of linegst) {
  const textbox = page.getByRole('cell', { name: '%' }).nth(lineGst.row).getByRole('textbox');
  let attempts = 0;
  while (!(await textbox.isVisible()) && attempts < 5) {
    await page.locator('td:nth-child(11)').nth(lineGst.row).dblclick();
    await page.waitForTimeout(300);
    attempts++;
  }
  await textbox.fill(lineGst.value);
}
// fill delivery Time
for (const line of deliverytime) {
  await page.locator('td:nth-child(13)').nth(line.cellIndex).dblclick();
  await page.getByRole('row', { name: line.rowName }).getByRole('textbox').fill(line.value);
}
// global
for (let [field, config] of Object.entries(mandatoryglobalfield)) {
  const row = page.getByRole("row", { name: field, exact: true });
  await page.waitForTimeout(1000);

  if (config.type === "dropdown") {
    let k = 0;
    while (!(await page.getByRole("option").first().isVisible()) && k < 3) {
      await row.locator("div").nth(1).click();
      await page.waitForTimeout(1000);
      k++;
    }
    if (config.value === "first") {
      await page.getByRole("option").first().click();
      await page.waitForTimeout(1000);
    } 
  }

  else if (config.type === "text") {
    if (config.selector === "input") {
      await row.locator("input").click();
      await page.waitForTimeout(1000);
      await row.locator("input").fill(config.value);
    } else {
      await row.locator("td").nth(1).click(); 
      await page.waitForTimeout(1000);
      await page.getByRole("tooltip").getByRole("textbox").fill(config.value);
    }
  }

  else if (config.type === "date") {
    await row.locator("svg").click();
    await page.waitForTimeout(1000);
    await page.locator("div").filter({ hasText: new RegExp(`^${config.value}$`) }).click();
  }
}
console.log("Mandatory Fields Filled");
// finally submit
 await page.getByRole('button', { name: 'Next' }).click();
 await page.getByRole('button', { name: 'Submit and Send' }).click();
  await validateAndLog({
    locator: page.locator('div').filter({ hasText: 'Bid placed on behalf of' }).nth(3),
    smessage: "Technical Stage Submitted successfully ",
    fmessage:  "Technical Stage Submission failed" 
}) 
};

const price_cap_Client = async ({ page  , p_cap}) => {
   // Search & open event
  var [ RFX_id , title ] = await eventCreationAPI();
  await page.waitForTimeout(2000);
  if (!RFX_id  || !title) throw new Error('Missing RFX ID or title');
  await page.getByRole('textbox', { name: 'Search Title' }).click();
  await page.getByRole('textbox', { name: 'Search Title' }).fill(RFX_id);
  await page.getByRole('textbox', { name: 'Search Title' }).press("Enter");
  await page.getByText(title).first().click();
  // inline
  await page.getByRole('tab', { name: 'RFQ' }).click();
  if (await page.getByRole('tab', { name: 'Participants' }).isVisible()) {
  console.log(` Participants is visible`);
  await page.waitForTimeout(3000);
  } 
 await page.getByRole('tab', { name: 'Participants' }).dblclick();
 await page.getByRole('button', { name: 'icon: plus Add Price Cap' }).nth(1).click();
 await page.getByRole('spinbutton').first().click();
 await page.getByRole('spinbutton').first().fill( p_cap.pricecap);
 await page.getByRole('spinbutton').nth(1).click();
 await page.getByRole('spinbutton').nth(1).fill( p_cap.pricecap);
 await page.getByRole('button', { name: 'OK' }).click();
  await validateAndLog({
    locator: page.locator('div').filter({ hasText: 'Price Cap added successfully!' }).nth(3),
    smessage: "Technical Stage Submitted successfully ",
    fmessage:  "Technical Stage Submission failed" 
}) 
}

const counter_offer = async ({ page  , countOffer}) => {
 // Search & open event
  var [ RFX_id , title ] =  await vendorBidAPI();;
  await page.waitForTimeout(2000);
  if (!RFX_id  || !title) throw new Error('Missing RFX ID or title');
  await page.getByRole('textbox', { name: 'Search Title' }).click();
  await page.getByRole('textbox', { name: 'Search Title' }).fill(RFX_id)
  await page.getByRole('textbox', { name: 'Search Title' }).press("Enter");
  await page.getByText(title).first().click();
  await page.getByRole('tab', { name: 'RFQ' }).click();
  await page.locator('div[role="grid"]').first().hover();
  await page.mouse.wheel(1200, 0); 
  await page.waitForTimeout(2000);
  if (await page.getByRole('button', { name: 'Counter Offer' }).isVisible()) {
    await page.getByRole('button', { name: 'Counter Offer' }).click();
    await page.waitForTimeout(2000);
  }
  let a= 0;
    while (await page.getByRole('cell', { name: '₹ 20 /KG' }).nth(0).isVisible() && a < 2) {
      await page.getByRole('cell', { name: '₹ 20 /KG' }).nth(0).dblclick();
      await page.waitForTimeout(1000);
  a++;
  }
  await page.getByRole('cell', { name: '₹ 20 /KG' }).getByRole('textbox').fill(countOffer.C_offer);
  await page.getByRole('button', { name: 'Send Counter Offer' }).click();
  
   await validateAndLog({
    locator: page.locator('div').filter({ hasText: 'Counter offer sent to supplier' }).nth(3),
    smessage: "Counter offer sent to Vendor successfully ",
    fmessage:  "Counter offer sending to Vendor failed" 
  })
}

const best_offers = async ({ page }) => {
 // Search & open event
  var [ RFX_id , title ] = await submissionTimeExpireAPI();
  await page.waitForTimeout(2000);
  if (!RFX_id  || !title) throw new Error('Missing RFX ID or title');
  await page.getByRole('textbox', { name: 'Search Title' }).click();
  await page.getByRole('textbox', { name: 'Search Title' }).fill(RFX_id)
  await page.getByRole('textbox', { name: 'Search Title' }).press("Enter");
  await page.getByText(title).first().click();
  await page.getByRole('tab', { name: 'RFQ' }).waitFor({ state: "visible", timeout: 10000 });
  await page.getByRole('tab', { name: 'RFQ' }).click();
  await page.getByRole('button', { name: 'icon: setting Settings icon:' }).click();
  await page.getByRole('menuitem', { name: 'Request Best Offers' }).click();
  await page.getByRole('button', { name: 'Send Request' }).click();
  await page.waitForTimeout(1000);
}

const convertToAuction = async ({ page }) => {
 // Search & open event
  var [ RFX_id , title ] =  await vendorBidAPI();
  await page.waitForTimeout(2000);
  if (!RFX_id  || !title) throw new Error('Missing RFX ID or title');
  await page.getByRole('textbox', { name: 'Search Title' }).click();
  await page.getByRole('textbox', { name: 'Search Title' }).fill(RFX_id)
  await page.getByRole('textbox', { name: 'Search Title' }).press("Enter");
  await page.getByText(title).first().click();
  await page.getByRole('tab', { name: 'RFQ' }).click();
  await page.getByRole('button', { name: 'icon: setting Settings icon:' }).click();
  await page.getByRole('menuitem', { name: 'Convert to Auction' }).click();
  // wait for new tab and overwrite page
  [page] = await Promise.all([
  page.context().waitForEvent("page"),
  page.getByRole('button', { name: 'Continue' }).click()
  ]);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Rank on line icon: right' }).click();
  await page.getByRole('checkbox', { name: 'Enable Cost Breakdown Mode' }).click();
  await page.locator('span').filter({ hasText: 'Dynamic Event Extension' }).getByLabel('').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'Send to Auction team' }).click();
  await page.getByRole('button', { name: 'Send to Auction Team', exact: true }).click();
  await page.waitForTimeout(1000);
    await validateAndLog({
    locator: page.locator('div').filter({ hasText: 'RFQ sent to Auction Team' }).nth(3),
    smessage: "RFQ sent to Auction Team successfully ",
    fmessage:  "RFQ sent to Auction Team failed" 
}) 

}

const convertToCBDAuction = async ({ page }) => {
 // Search & open event
  var [ RFX_id , title ] =  await vendorBidAPI();;
  await page.waitForTimeout(2000);
  if (!RFX_id  || !title) throw new Error('Missing RFX ID or title');
  await page.getByRole('textbox', { name: 'Search Title' }).click();
  await page.getByRole('textbox', { name: 'Search Title' }).fill(RFX_id)
  await page.getByRole('textbox', { name: 'Search Title' }).press("Enter");
  await page.getByText(title).first().click();
  await page.getByRole('tab', { name: 'RFQ' }).click();
  await page.getByRole('button', { name: 'icon: setting Settings icon:' }).click();
  await page.getByRole('menuitem', { name: 'Convert to Auction' }).click();
  // wait for new tab and overwrite page
  [page] = await Promise.all([
  page.context().waitForEvent("page"),
  page.getByRole('button', { name: 'Continue' }).click()
  ]);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Rank on line icon: right' }).click();
  await page.locator('span').filter({ hasText: 'Dynamic Event Extension' }).getByLabel('').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'Send to Auction team' }).click();
  await page.getByRole('button', { name: 'Send to Auction Team', exact: true }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'Send to Auction Team', exact: true }).click();
  await page.waitForTimeout(500);
    await validateAndLog({
    locator: page.locator('div').filter({ hasText: 'RFQ sent to Auction Team' }).nth(3),
    smessage: "RFQ sent to Auction Team successfully ",
    fmessage:  "RFQ sent to Auction Team failed" 
})
}

const split_lot = async ({ page }) => {
  // Search & open event
  await page.getByRole('textbox', { name: 'Search Title' }).press("Enter");
  await page.getByRole('link', { name: 'first_name-102 last_name-102' }).first().click();
  await page.getByRole('tab', { name: 'RFQ' }).click();
  await page.getByRole('button', { name: 'icon: setting Settings icon:' }).click();
  
}
export { convertToAuction ,convertToCBDAuction ,counter_offer, best_offers , price_cap_Client , qa_event_type_Auction , publish_event_with_blank_title, pr_tech_RFQ_API,pr_tech_RFQ_By_UI, pr_tech_auction , surrogate_bid_tech, surrogate_bid_RFQ, qa_event_vendorwise , qa_event_lineitem, test ,split_lot  };
