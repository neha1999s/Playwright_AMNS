export const inlinefieldsLessThanPCap: [number, number, string][] = [
  [7, 0, "20"], //row , box ,rate1
  [7, 1, "30"], //row , box , rate2
  [8, 0, "3"],  //row , box , linegst1
  [8, 1, "3"],  //row , box , linegst2
  [8, 0, "2"],  //row , box , deliverytime1
  [8, 1, "2"],  //row , box , deliverytime2
];

export const mandatoryGlobalFields = {
  "Incoterms*": { type: "dropdown", value: "ASW-At suppliers works" },
  "Destination for Incoterms*": { type: "text", value: "Pune" }, 
  "Vendor Category*": { type: "dropdown", value: "Service Provider" },
  "Warranty Terms*": { type: "dropdown", value: "12 months from Supply and 18" },
  "Payment Terms*": { type: "dropdown", value: "AB09 - 90% Delivery 30 Days," },
  "Validity of Quotation*": { type: "date", value: "Today" },
};


export const inlineFieldsMoreThanPCap: [number, number, string][] = [
  [7, 0, "50"],
  [7, 1, "60"],
  [8, 0, "3"],
  [8, 1, "3"],
  [8, 0, "2"],
  [8, 1, "2"],
];

export const inlinefields: [number, number, string][] = [
  [7, 0, "20"],
  [7, 1, "30"],
  [7, 0, "3"],
  [7, 1, "3"],
  [8, 0, "2"],
  [8, 1, "2"],
];

 export const inline_non_regret: [number, number, string][] = [
  [7, 0, "20"],
  [9, 0, "3"],
  [11, 0, "2"],
];

export const counterofferVendor = {
    C_offerRemark :"abc",
    C_offerModify :"10"

}