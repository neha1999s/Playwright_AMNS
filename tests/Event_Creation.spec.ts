import { test  , expect} from "./setupBlocks/global.setup";
import { clientLogin, vendorLogin} from "./setupBlocks/login.setup";
import { TEST_TIMEOUT } from "./setupBlocks/constant";
import {   convertToAuction , convertToCBDAuction , price_cap_Client, qa_event_type_Auction , publish_event_with_blank_title, pr_tech_RFQ_API, pr_tech_RFQ_By_UI, pr_tech_auction ,qa_event_vendorwise ,  qa_event_lineitem, surrogate_bid_tech,surrogate_bid_RFQ , counter_offer , best_offers, cancelAuctionDraft} from "./utils/Client";
import { eventCreation_details , rates , lineGST , delivery , mandatoryglobalFields , priceCap , counteroffer } from "./utils/Client_Page_data";
import { inlinefieldsLessThanPCap, inlineFieldsMoreThanPCap , mandatoryGlobalFields} from "./utils/Vendor_Page_data";
import { fetch_prs , eventCreationAPI , vendorBidAPI , submissionTimeExpireAPI} from "./utils/FlowCover_API";

test.beforeEach(async () => {
  test.info().setTimeout(TEST_TIMEOUT);
});

test.describe("Event login & Creation Flow, @Smoke ,@Regression", () => {

  test("Create Event with PR (Tech and Auction) @TC001 , @Regression ", async ({ clientPage  }) => {
    await clientLogin({ page: clientPage });
    await clientPage.getByRole('menuitem', { name: 'Purchase Requisitions' }).click();
    await pr_tech_auction({ page: clientPage  , eventCreation_detail: eventCreation_details });
  });

  test("Event Creation Vendor Wise Evaluation @TC002 , @Regression ", async ({ clientPage  }) => {
    await clientLogin({ page: clientPage });
    await clientPage.getByRole('menuitem', { name: 'Purchase Requisitions' }).click();
    await pr_tech_RFQ_By_UI({ page: clientPage });
    await qa_event_vendorwise({ page: clientPage , eventCreation_detail: eventCreation_details  });
  });

  test("Event Creation line item wise with event type RFQ @TC003 ,@Regression ", async ({ clientPage  }) => {
    await clientLogin({ page: clientPage });
    await clientPage.getByRole('menuitem', { name: 'Purchase Requisitions' }).click();
    await pr_tech_RFQ_By_UI({ page: clientPage });
    await qa_event_lineitem ({ page: clientPage , eventCreation_detail: eventCreation_details  });
  });
   
  test("Event Creation line item wise with event type Auction @TC004 , @Regression ", async ({ clientPage  }) => {
    await clientLogin({ page: clientPage });
    await clientPage.getByRole('menuitem', { name: 'Purchase Requisitions' }).click();
    await pr_tech_RFQ_By_UI({ page: clientPage });
    await qa_event_type_Auction({ page: clientPage , eventCreation_detail: eventCreation_details  });
  });

  test("Publish event with blank title @TC005 , @Regression ", async ({ clientPage  }) => {
    await clientLogin({ page: clientPage });
    await clientPage.getByRole('menuitem', { name: 'Purchase Requisitions' }).click();
    await pr_tech_RFQ_By_UI({ page: clientPage });
    await publish_event_with_blank_title({ page: clientPage , eventCreation_detail: eventCreation_details  });
  });

  test("Surrogate Bid in Tech @TC006  , @Regression", async ({ clientPage  }) => {
    await clientLogin({ page: clientPage });
    await clientPage.getByRole('menuitem', { name: 'Events' }).click();
    await surrogate_bid_tech({ page:clientPage });
  });

  test("Surrogate Bid in RFQ @TC007 , @Regression", async ({ clientPage  }) => {
    await clientLogin({ page: clientPage });
    await clientPage.getByRole('menuitem', { name: 'Events' }).click();
    await surrogate_bid_RFQ({ page:clientPage , rate:rates , linegst:lineGST , deliverytime:delivery  , mandatoryglobalfield:mandatoryglobalFields});
  });

  test("Price cap set before vendor bid in RFQ @TC008 , @Regression ", async ({ clientPage  }) => {
    await clientLogin({ page: clientPage });
    await clientPage.getByRole('menuitem', { name: 'Events' }).click();
    await price_cap_Client({ page:clientPage  , p_cap: priceCap});
  });
  
  test(" Sent Counter offer from Client Side @TC009 , @Regression", async ({ clientPage   }) => {
    await clientLogin({ page: clientPage });
    await clientPage.getByRole('menuitem', { name: 'Events' }).click();
    await counter_offer({ page:clientPage , countOffer :counteroffer});
  });

  test("Sent Best Offer from Client Side @TC0010, @Regression", async ({ clientPage  }) => {  
    await clientLogin({ page: clientPage });
    await clientPage.getByRole('menuitem', { name: 'Events' }).click(); 
    await best_offers({ page: clientPage });
  });

  test(" Convert to Auction Client Side @TC0011 , @Regression", async ({ clientPage }) => { 
    await clientLogin({ page: clientPage });
    await clientPage.getByRole('menuitem', { name: 'Events' }).click(); 
    await convertToAuction({ page: clientPage });
  });

  // test(" Convert to CBD Auction Client Side @TC0012 , @Regression", async ({ clientPage }) => {
  //   await clientLogin({ page: clientPage });
  //   await clientPage.getByRole('menuitem', { name: 'Events' }).click();
  //   await convertToCBDAuction({ page: clientPage });
  // });

    test(" Cancel Draft Auction Client Side @TC0013 , @Regression", async ({ clientPage }) => {
    await clientLogin({ page: clientPage });
    await clientPage.getByRole('menuitem', { name: 'Events' }).click();
    await cancelAuctionDraft({ page: clientPage });
  });

});


