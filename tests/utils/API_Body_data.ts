import {  fetch_prs , eventCreationAPI , vendorBidAPI , sendCounterOfferAPI} from "./FlowCover_API";

export const payload1 = JSON.stringify({
        "item_uuid": "RGdkZ2M=",
        "item_type": "EventGroup",
        "intent_type": "trade_accept"
});
export const  payload2 = JSON.stringify({
      "item_uuid": tech_uuid,
      "item_type": "TradeRequest",
      "company_uuid": "ZFpRcA=="
  });
export const body = [payload1, payload2];