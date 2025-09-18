import { test } from "./setupBlocks/global.setup";
import { clientLogin, vendorLogin} from "./setupBlocks/login.setup";
import { TEST_TIMEOUT } from "./setupBlocks/constant";
import {  vendor_bid_tech,vendor_bid_tech_regret , vendor_bid_rfq,  counter_offer_vendor1, counter_offer_vendor2 , counter_offer_vendor3 , lessThanBest_offer_vendor,morethanBest_offer_vendor , vendor_bid_rfq_non_regret } from "./utils/Vendor";
import {  fetch_prs , eventCreationAPI , vendorBidAPI , sendCounterOfferAPI, priceCapBeforeBid , bestOfferAPI} from "./utils/FlowCover_API";
import { vendor_bid_rfq_more_than_Pricecap ,vendor_bid_tech_priceCap ,vendor_bid_rfq_less_than_Pricecap } from "./utils/Vendor";
import { inlinefields  , mandatoryGlobalFields , inline_non_regret , counterofferVendor , inlinefieldsLessThanPCap, inlineFieldsMoreThanPCap } from "./utils/Vendor_Page_data";

test.beforeEach(async () => {
  test.info().setTimeout(TEST_TIMEOUT);
});

test.describe("Vendor Login & Flow, @Smoke , @Regression", () => {

  // test("Vendor Bid  @TC0014 , @Regression ", async ({ vendorPage }) => {
  //   await vendorLogin({ page: vendorPage });
  //   await vendor_bid_tech({ page: vendorPage });
  //   await vendor_bid_rfq({ page: vendorPage  , inlinefieldrfq:inlinefields  ,mandatoryGlobalField : mandatoryGlobalFields});
  // });
   
  // test("Vendor line item regret @TC0015, @Regression ", async ({ vendorPage }) => {
  //   await vendorLogin({ page: vendorPage });
  //   await vendor_bid_tech_regret({ page: vendorPage });
  //   await vendor_bid_rfq_non_regret({ page: vendorPage  , inline_non_regrets:inline_non_regret ,mandatoryGlobalField : mandatoryGlobalFields});
  // });
   
  //  test("Vendor Side price less than price cap @TC0016, @Regression ", async ({ vendorPage }) => { 
  //   await vendorLogin({ page: vendorPage });
  //   await vendor_bid_tech_priceCap({ page: vendorPage });
  //   await vendor_bid_rfq_less_than_Pricecap({ page: vendorPage , inlinefield:inlinefieldsLessThanPCap  ,mandatoryGlobalField : mandatoryGlobalFields });
  // });

  //   test("Vendor Side price more than price cap @TC0017, @Regression", async ({ vendorPage }) => { 
  //   await vendorLogin({ page: vendorPage });
  //   await vendor_bid_tech_priceCap({ page: vendorPage });
  //   await vendor_bid_rfq_more_than_Pricecap({ page: vendorPage , inlineField:inlineFieldsMoreThanPCap ,mandatoryGlobalField : mandatoryGlobalFields});
  // });

  test("Counter offer Accept Vendor Side @TC0018,  @Regression", async ({ vendorPage }) => {
    await vendorLogin({ page: vendorPage });
    await counter_offer_vendor1({ page: vendorPage });
  });

  test("Counter offer Decline Vendor Side @TC0019,  @Regression", async ({ vendorPage }) => {
    await vendorLogin({ page: vendorPage });
    await counter_offer_vendor2({ page: vendorPage, counterofferVendorbid:counterofferVendor });
  });

  test("Counter offer Modify Vendor Side @TC0020,  @Regression", async ({ vendorPage }) => {
    await vendorLogin({ page: vendorPage });
    await counter_offer_vendor3({ page: vendorPage, counterofferVendorbid: counterofferVendor});
  });

  test("Best offer (Less than rate) Vendor Side @TC0021, @Smoke , @Regression", async ({ vendorPage }) => { 
    await vendorLogin({ page: vendorPage });
    await lessThanBest_offer_vendor({ page: vendorPage });
  });
  
  test("Best offer (More than rate) Vendor Side @TC0022, @Smoke , @Regression", async ({ vendorPage }) => { 
    await vendorLogin({ page: vendorPage });
    await morethanBest_offer_vendor({ page: vendorPage });
  });

});
