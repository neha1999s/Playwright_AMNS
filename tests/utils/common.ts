const validateAndLog = async ({ locator, smessage, fmessage }) => {
    try {
      await locator.waitFor({ state: 'visible', timeout: 20000 }); // optional wait
      if (await locator.isVisible()) {
        console.log(`✅ ${smessage}`);
      } else {
        throw new Error(`❌ ${fmessage}`);
      }
    } catch (error) {
      throw new Error(`❌ ${fmessage}(Error: ${error.message})  ❌(Locator Notfound: ${locator})`);
    }
  };


  const approve_request = async ({ page, request_number }) => {
      await page.getByRole('link', { name: 'Approvals' }).click();
      await page.getByRole('textbox', { name: 'Search' }).fill(request_number);
      await page.getByRole('textbox', { name: 'Search' }).press("Enter");
      let count = 0;
      while(await page.getByRole('cell').filter({ hasText: /^$/ }).count()>2&&count<5){
        await page.waitForTimeout(2000);
        count++;
  
      }
      await page.getByRole('cell').filter({ hasText: /^$/ }).nth(1).click();
       
      var clickPromise ; 
      if (request_number.includes("PO/")) {
        clickPromise = page.getByRole('link', { name: '[PO/' }).first().click();
      } else if (request_number.includes("Auto")) {
        clickPromise = page.getByRole('link', { name: '[IR-' }).first().click();
      } 
      else if (request_number.includes("INV")) {
        clickPromise = page.getByRole('link', { name: '[INV' }).first().click();
      } 

  
      const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),               // Waits for new page
        clickPromise      // Action that triggers new tab
      ]);
      await newPage.getByRole('textbox', { name: 'Enter remarks' }).fill('Auto Approval');
      await newPage.getByRole('button', { name: 'Approve' }).click();
    
      await validateAndLog({
        locator: newPage.getByText('Approval request accepted'),
        smessage: "Request approved successfully :" + request_number,
        fmessage: "Request approval failed for request number: " + request_number
      });  
      await newPage.locator('div.avatar.ant-dropdown-trigger').hover();
      await newPage. getByRole('menuitem', { name: 'icon: logout Sign out' }).click();
  };

  export { validateAndLog,approve_request };
  