import { url } from 'inspector';
import{ACTIVE_BACKEND, USERS}from '../setupBlocks/constant'
import{login} from "./Client_login";
import{login2} from "./Vendor_login";
import { test, expect } from '@playwright/test';

const BASE_URL=`https://${ACTIVE_BACKEND}.ag-ri.in/api/`;

export async function clearfilter() {
  const fetch = (await import('node-fetch')).default;
  const headers = await login(USERS.intake_member, USERS.OTP);// Add necessary content type
  let data;
  for (let i = 1; i <= 4; i++) {
    switch (i) {
      case 1:
        data = {
          applied_filters: {},
          item_type: "IntakeRequest",
          index: 0
        };
        break;

      case 2:
        data = {
          applied_order_by: [],
          item_type: "IntakeRequest",
          index: 0
        };
        break;

      case 3:
        data = {
          applied_group: ['default'],
          item_type: "IntakeRequest",
          index: 0
        };
        break;

      case 4:
        data = {
          columns: {
            identifier: { order: 0, hidden: false },
            ref_id: { order: 1, hidden: false },
            title: { order: 2, hidden: false },
            user_identifier: { order: 3, hidden: false },
            requester_name: { order: 4, hidden: false },
            status: { order: 8, hidden: false },
            intake_request_conditions: { order: 9, hidden: false },
            created_at: { order: 10002, hidden: false },
            updated_at: { order: 10003, hidden: false }
          },
          item_type: "IntakeRequest",
          index: 0
        };
        break;
    }

    const response = await fetch(`${BASE_URL}/user_preferences`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`❌ API RESET FAILED at step ${i} — Status: ${response.status}, Body: ${body}`);
    }
  }
}

// PR search
export async function fetch_prs() {
 // var headers = await login(USERS.intake_member,USERS.OTP);
  const clientUser = USERS("client");
  const headers = await login(clientUser.USER_MOBILE, clientUser.OTP);
  const url =
    `${BASE_URL}/purchase_requests?page=9`;
  const fetch = (await import('node-fetch')).default;
   try {
    const res = await fetch(url, { method: 'GET', headers });
    if (res.status !== 200) {
      throw new Error(`HTTP ${res.status} – ${res.statusText}`);
    }
    const data = await res.json();
    var pr_no = data.purchase_requests[0].data.prNo;
    console.log('Success:', pr_no);
    return pr_no;
  } catch (err) {
    console.error('PR Fetch failed:', err);
  }
  }
  
export async function eventCreationAPI () {
  const clientUser = USERS("client");
  const headers = await login(clientUser.USER_MOBILE, clientUser.OTP);
  const url = `${BASE_URL}products/search?query=ab`;      // GET call

  // Get call for search products
  try {
    // First: Perform GET request
    const res = await fetch(url, { method: 'GET', headers });
    if (res.status !== 200)  {
      throw new Error(`GET request failed: HTTP ${res.status} – ${res.statusText}`);
    }
    const data = await res.json();
    const product1 = data.products[0].uuid;
    const product2 = data.products[1].uuid;

    console.log('Product1_uuid', product1);
    console.log('Product2_uuid', product2);

    // Post call 1 - on clicking on create event
    const url1 = `${BASE_URL}event_groups`;  // POST call
    const payload = JSON.stringify({
    "status": "draft",
    "line_items": [
        {
            "product_uuid": "Y1hEWk4=",
            "quantity": {
                "unitSymbol": "KG",
                "value": 20
            },
            "product_quality_uuid": "Z2REWlg="
        },
        {
            "product_uuid": "a2NEWlo=",
            "quantity": {
                "unitSymbol": "KG",
                "value": 20
            },
            "product_quality_uuid": "WmtEWmM="
        }
    ]
});

    const response1 = await fetch(url1, {
      method: 'POST',
      headers,
      body: payload
    });
    
    if (response1.status !== 200) {
      throw new Error(`POST request failed: HTTP ${response1.status} – ${response1.statusText}`);
    }
    const data1 = await response1.json();
    const event_uuid  = data1.uuid;
    console.log('Event_uuid', event_uuid);

    // Post call 2 getting after publish event (for tech)
    const url2 = `${BASE_URL}trade/template_input?template_name=trade&additional_fields=order_details`;  //Post call
     const payload1 = JSON.stringify({
    "forms": [
        {
            "order": 1,
            "name": "Material Name 00c3f2e8-0761-4310-9136-6358c3e03d57",
            "description": "",
            "config": {
                "type": "table"
            },
            "event_group_line_item_uuid": "TmtOWlhR",
            "page_response_headers": [
                {
                    "key_attribute": "k0FOQ",
                    "name": "Description",
                    "description": "Material Description ",
                    "input_type": "multiline_text",
                    "configuration": {
                        "field_type": "participant",
                        "is_required": true
                    },
                    "widget_type": "default"
                },
                {
                    "key_attribute": "4klql",
                    "name": "Delivery Date",
                    "description": "To ensure project timeline compatibility",
                    "input_type": "multiline_text",
                    "configuration": {
                        "field_type": "participant",
                        "is_required": false
                    },
                    "widget_type": "default"
                },
                {
                    "key_attribute": "EmAuh",
                    "name": "Payment Terms",
                    "description": "To understand financial commitments",
                    "input_type": "multiline_text",
                    "configuration": {
                        "field_type": "participant",
                        "is_required": false
                    },
                    "widget_type": "default"
                },
                {
                    "key_attribute": "92s52",
                    "name": "Quality Assurance Measures",
                    "description": "To evaluate service/product quality",
                    "input_type": "multiline_text",
                    "configuration": {
                        "field_type": "participant",
                        "is_required": false
                    },
                    "widget_type": "default"
                }
            ],
            "page_headers": [],
            "evaluators": [
                {
                    "shared_with_uuid": "Z1prWA==",
                    "shared_with_type": "User"
                }
            ]
        },
        {
            "order": 2,
            "name": "Material Name 00d721ff-7350-44ee-ab78-1e8c370a7c00",
            "description": "",
            "config": {
                "type": "table"
            },
            "event_group_line_item_uuid": "TmtRWlhR",
            "page_response_headers": [
                {
                    "key_attribute": "y2uoJ",
                    "name": "Description",
                    "description": "Material Description ",
                    "input_type": "multiline_text",
                    "configuration": {
                        "field_type": "participant",
                        "is_required": true
                    },
                    "widget_type": "default"
                },
                {
                    "key_attribute": "4klql",
                    "name": "Delivery Date",
                    "description": "To ensure project timeline compatibility",
                    "input_type": "multiline_text",
                    "configuration": {
                        "field_type": "participant",
                        "is_required": false
                    },
                    "widget_type": "default"
                },
                {
                    "key_attribute": "EmAuh",
                    "name": "Payment Terms",
                    "description": "To understand financial commitments",
                    "input_type": "multiline_text",
                    "configuration": {
                        "field_type": "participant",
                        "is_required": false
                    },
                    "widget_type": "default"
                },
                {
                    "key_attribute": "92s52",
                    "name": "Quality Assurance Measures",
                    "description": "To evaluate service/product quality",
                    "input_type": "multiline_text",
                    "configuration": {
                        "field_type": "participant",
                        "is_required": false
                    },
                    "widget_type": "default"
                }
            ],
            "page_headers": [],
            "evaluators": [
                {
                    "shared_with_uuid": "Z1prWA==",
                    "shared_with_type": "User"
                }
            ]
        }
    ],
    "configurations": {
        "fast_bidding_mode_enabled": false,
        "stage_no": 1,
        "event_group_uuid": event_uuid,
        "staggered": false,
        "is_tnc_mandatory": false,
        "currency_configuration": null,
        "is_english_auction_enabled": false,
        "is_alternate_bidding_allowed": false,
        "rfx_mode": "rfp",
        "auction_closing_mode": "line_item_based",
        "rfp_evaluation_mode": "line_item_based",
        "pickup_schedules": false,
        "bid_start_time": 1756657298,
        "bid_end_time": 1756659098,
        "extra_closing_time": 1756660898,
        "title": "Technical Stage ",
        "terms_and_conditions": [],
        "attachments": [
            {
                "type": "t_and_c",
                "value": []
            }
        ],
        "template_uuid": "Z2tkTg==",
        "savings_configuration": null,
        "bulk_price": null,
        "time_extension_value": null,
        "last_n_minutes_for_time_extension": null,
        "rank_limit_for_time_extension": null,
        "dynamic_closing_time_strategy": "price_based",
        "price_difference": null,
        "time_difference": null,
        "end_price": 0,
        "is_auction_on_base_price": true,
        "closing_mode": "single",
        "is_basket_auction": false
    },
    "tabs": [],
    "status": "draft",
    "audience_company_uuids": [
        "ZFpRcA==",
        "UVpRRA=="
    ],
    "creation_flow_type": "quick_flow",
    "use_rfq_quotes_as_bids": false

});

    const response2 = await fetch(url2, {
      method: 'POST',
      headers,
      body: payload1
    });
    
    if (res.status !== 200) {
      throw new Error(`POST request failed: HTTP ${response2.status} – ${response2.statusText}`);
    }
    const data2 = await response2.json();
    const tech_uuid  = data2.uuid;
    console.log('Tech_uuid', tech_uuid);

    // post call 3 getting after publish event (for RFQ)
    const url3 = `${BASE_URL}trade/template_input?template_name=trade&additional_fields=order_details`;  //Post call
    const payload2 = JSON.stringify({

    "widgets": {
        "global_price_components": [
            {
                "name": "Incoterms",
                "key_attribute": "amns_incoterms",
                "input_type": "dropdown",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": true,
                    "is_negotiable": true,
                    "dropdown_data": "/widget_data_mapping?type=amns_incoterms&trade_request_uuid={{trade_request_uuid}}",
                    "mode_type": "write",
                    "priority": 3,
                    "is_removable": false,
                    "options": []
                }
            },
            {
                "name": "Destination for Incoterms",
                "key_attribute": "delivery_for_incoterms_custom",
                "input_type": "string",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": true,
                    "is_negotiable": true,
                    "mode_type": "write",
                    "priority": 4,
                    "is_removable": false,
                    "options": []
                }
            },
            {
                "name": "Sum Total",
                "key_attribute": "sum_total",
                "input_type": "formula",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "show_in_original_currency": true,
                    "is_fast_bidding_widget": true,
                    "mode_type": "read",
                    "prefix": "₹",
                    "priority": 1,
                    "formula": "SUM(total_amount)",
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Basic Total",
                "key_attribute": "amns_basic_total",
                "input_type": "formula",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "show_in_original_currency": true,
                    "mode_type": "read",
                    "prefix": "₹",
                    "priority": 1,
                    "formula": "sum_total",
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Additional Charges",
                "key_attribute": "amns_additional_cost",
                "input_type": "number",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "is_negotiable": true,
                    "show_in_original_currency": true,
                    "mode_type": "write",
                    "validations": [
                        {
                            "error_message": "Additional Cost must be greater than 0",
                            "severity": 1,
                            "rule": "amns_additional_cost>=0"
                        }
                    ],
                    "freeze_widget": "primary",
                    "prefix": "₹",
                    "priority": 0,
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "FOB/CIF/CFR Charges",
                "key_attribute": "fob_cif_cfr_charges",
                "input_type": "number",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "is_negotiable": true,
                    "show_in_original_currency": true,
                    "mode_type": "write",
                    "prefix": "₹",
                    "priority": 4,
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Packaging and Forwarding Percentage",
                "key_attribute": "amns_packaging_and_forwarding_percentage",
                "input_type": "number",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "is_negotiable": true,
                    "mode_type": "write",
                    "validations": [
                        {
                            "error_message": "Packaging and Forwarding must be greater than 0",
                            "severity": 1,
                            "rule": "amns_packaging_and_forwarding_percentage>=0"
                        }
                    ],
                    "suffix": "%",
                    "priority": 13,
                    "is_removable": false,
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Packaging and Forwarding Amount",
                "key_attribute": "amns_packaging_and_forwarding",
                "input_type": "formula",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "is_negotiable": false,
                    "show_in_original_currency": true,
                    "mode_type": "read",
                    "freeze_widget": "primary",
                    "prefix": "₹",
                    "priority": 4,
                    "formula": "(sum_total+amns_additional_cost)*amns_packaging_and_forwarding_percentage/100",
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Total in Foreign Currency",
                "key_attribute": "amns_total_in_currency",
                "input_type": "formula",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "show_in_original_currency": true,
                    "mode_type": "read",
                    "prefix": "₹",
                    "priority": 5,
                    "formula": "sum_total+amns_additional_cost+amns_packaging_and_forwarding+fob_cif_cfr_charges",
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Total in INR Currency",
                "key_attribute": "amns_total_in_inr_currency",
                "input_type": "formula",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "show_in_original_currency": false,
                    "mode_type": "read",
                    "prefix": "₹",
                    "priority": 6,
                    "formula": "amns_total_in_currency",
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Vendor Category",
                "key_attribute": "amns_vendor_category",
                "input_type": "dropdown",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": true,
                    "is_negotiable": false,
                    "dropdown_data": "/widget_data_mapping?type=amns_vendor_category&trade_request_uuid={{trade_request_uuid}}",
                    "mode_type": "write",
                    "priority": 16,
                    "is_removable": false,
                    "options": []
                }
            },
            {
                "name": "Overseas Freight",
                "key_attribute": "amns_overseas_freight",
                "input_type": "number",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "is_negotiable": false,
                    "is_buyer_editable": true,
                    "mode_type": "write",
                    "validations": [
                        {
                            "error_message": "Overseas Freight must be greater than 0",
                            "severity": 1,
                            "rule": "amns_overseas_freight>=0"
                        }
                    ],
                    "freeze_widget": "primary",
                    "prefix": "₹",
                    "priority": 5,
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Insurance Amount",
                "key_attribute": "amns_insurance_amount",
                "input_type": "percent_and_amount",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "is_buyer_editable": true,
                    "mode_type": "write",
                    "prefix": "₹",
                    "priority": 6,
                    "formula": "(sum_total+amns_additional_cost+amns_packaging_and_forwarding+amns_overseas_freight+fob_cif_cfr_charges)/100",
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Customs Duty Percentage",
                "key_attribute": "amns_custom_duty_percentage",
                "input_type": "number",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "is_buyer_editable": true,
                    "mode_type": "write",
                    "validations": [
                        {
                            "error_message": "Customs Duty Percentage must be greater than 0",
                            "severity": 1,
                            "rule": "amns_custom_duty_percentage>=0"
                        }
                    ],
                    "suffix": "%",
                    "priority": 13,
                    "is_removable": false,
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Customs Duty Amount",
                "key_attribute": "amns_custom_duty_amount",
                "input_type": "formula",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "mode_type": "read",
                    "prefix": "₹",
                    "priority": 13,
                    "formula": "(sum_total+amns_additional_cost+amns_packaging_and_forwarding+amns_overseas_freight+amns_insurance_amount+fob_cif_cfr_charges)*amns_custom_duty_percentage/100",
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Cess on Overall Duty Percent",
                "key_attribute": "amns_cess_percentage",
                "input_type": "number",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "is_buyer_editable": true,
                    "mode_type": "write",
                    "validations": [
                        {
                            "error_message": "Cess on Overall Duty Percent must be greater than 0",
                            "severity": 1,
                            "rule": "amns_cess_percentage>=0"
                        }
                    ],
                    "suffix": "%",
                    "priority": 14,
                    "is_removable": false,
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Cess on Overall Duty Amount",
                "key_attribute": "amns_cess_amount",
                "input_type": "formula",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "mode_type": "read",
                    "prefix": "₹",
                    "priority": 14,
                    "formula": "amns_cess_percentage*amns_custom_duty_amount/100",
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Global GST Percentage",
                "key_attribute": "amns_gst_percentage",
                "input_type": "number",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "is_negotiable": false,
                    "mode_type": "hidden",
                    "validations": [
                        {
                            "error_message": "Global GST Percentage must be greater than 0",
                            "severity": 1,
                            "rule": "amns_gst_percentage>=0"
                        }
                    ],
                    "suffix": "%",
                    "priority": 6,
                    "is_removable": false,
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "GST amount",
                "key_attribute": "amns_gst_amount",
                "input_type": "formula",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "is_negotiable": false,
                    "show_in_original_currency": false,
                    "mode_type": "read",
                    "prefix": "₹",
                    "priority": 6,
                    "formula": "amns_gst_percentage*(sum_total)/100+0.18*(amns_additional_cost+amns_packaging_and_forwarding+amns_overseas_freight+amns_insurance_amount+amns_custom_duty_amount+amns_cess_amount+fob_cif_cfr_charges)+SUM(line_gst_amount)",
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Transit Insurance amount",
                "key_attribute": "transit_insurance_amount",
                "input_type": "number",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "is_negotiable": false,
                    "show_in_original_currency": true,
                    "mode_type": "read",
                    "validations": [
                        {
                            "error_message": "Transit Insurance amount must be greater than 0",
                            "severity": 1,
                            "rule": "transit_insurance_amount>=0"
                        }
                    ],
                    "prefix": "₹",
                    "priority": 17,
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Incoming Domestic Freight",
                "key_attribute": "incoming_domestic_freight_custom",
                "input_type": "percent_and_amount",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "is_negotiable": false,
                    "show_in_original_currency": false,
                    "is_buyer_editable": true,
                    "mode_type": "write",
                    "freeze_widget": "primary",
                    "prefix": "₹",
                    "priority": 7,
                    "formula": "(sum_total+amns_additional_cost)/100",
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Outgoing Domestic Freight",
                "key_attribute": "outgoing_domestic_freight_custom",
                "input_type": "percent_and_amount",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "is_negotiable": false,
                    "show_in_original_currency": false,
                    "is_buyer_editable": true,
                    "mode_type": "write",
                    "validations": [
                        {
                            "error_message": "Outgoing Domestic Freight must be greater than 0",
                            "severity": 1,
                            "rule": "outgoing_domestic_freight_custom>=0"
                        }
                    ],
                    "freeze_widget": "primary",
                    "prefix": "₹",
                    "priority": 8,
                    "formula": "(sum_total+amns_additional_cost)/100",
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Fix Loading Factor",
                "key_attribute": "fix_loading_factor_custom",
                "input_type": "number",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "is_negotiable": false,
                    "is_buyer_editable": true,
                    "mode_type": "write",
                    "validations": [
                        {
                            "error_message": "Amount must be greater than 0",
                            "severity": 1,
                            "rule": "fix_loading_factor_custom>=0"
                        }
                    ],
                    "freeze_widget": "primary",
                    "prefix": "₹",
                    "priority": 9,
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Variable Loading Percentage",
                "key_attribute": "amns_variable_loading_percentage",
                "input_type": "number",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "is_buyer_editable": true,
                    "mode_type": "write",
                    "validations": [
                        {
                            "error_message": "Variable Loading Percentage must be greater than 0",
                            "severity": 1,
                            "rule": "amns_variable_loading_percentage>=0"
                        }
                    ],
                    "suffix": "%",
                    "priority": 13,
                    "is_removable": false,
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "AMNS Variable Loading Amount",
                "key_attribute": "amns_variable_loading_amount",
                "input_type": "formula",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "is_negotiable": false,
                    "mode_type": "read",
                    "prefix": "₹",
                    "priority": 8,
                    "formula": "(sum_total+amns_additional_cost+amns_packaging_and_forwarding+amns_overseas_freight+amns_insurance_amount+fix_loading_factor_custom+amns_custom_duty_amount+amns_cess_amount+amns_gst_amount+fob_cif_cfr_charges)*amns_variable_loading_percentage/100",
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "CHA Charges",
                "key_attribute": "cha_charges",
                "input_type": "percent_and_amount",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "show_in_original_currency": false,
                    "is_buyer_editable": true,
                    "mode_type": "write",
                    "prefix": "₹",
                    "priority": 9,
                    "formula": "(sum_total+amns_additional_cost)/100",
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Port Handling Charges",
                "key_attribute": "port_handling_charges",
                "input_type": "percent_and_amount",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "show_in_original_currency": false,
                    "is_buyer_editable": true,
                    "mode_type": "write",
                    "prefix": "₹",
                    "priority": 10,
                    "formula": "(sum_total+amns_additional_cost)/100",
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Warranty Terms",
                "key_attribute": "warranty_terms",
                "input_type": "dropdown",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": true,
                    "is_negotiable": true,
                    "dropdown_data": "/widget_data_mapping?type=warranty_terms&trade_request_uuid={{trade_request_uuid}}",
                    "mode_type": "write",
                    "priority": 11,
                    "is_removable": false,
                    "options": []
                }
            },
            {
                "name": "Payment Terms",
                "key_attribute": "amns_payment_terms",
                "input_type": "dropdown",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": true,
                    "is_negotiable": true,
                    "dropdown_data": "/widget_data_mapping?type=amns_payment_terms&trade_request_uuid={{trade_request_uuid}}",
                    "mode_type": "write",
                    "priority": 12,
                    "is_removable": false,
                    "options": []
                }
            },
            {
                "name": "Finance Cost Loading Factor",
                "key_attribute": "finance_cost_loading_factor_custom",
                "input_type": "percent_and_amount",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "is_negotiable": false,
                    "show_in_original_currency": false,
                    "is_buyer_editable": true,
                    "mode_type": "write",
                    "freeze_widget": "primary",
                    "prefix": "₹",
                    "priority": 28,
                    "formula": "(sum_total+amns_additional_cost+amns_packaging_and_forwarding+fob_cif_cfr_charges+amns_variable_loading_amount+fix_loading_factor_custom+amns_overseas_freight+amns_insurance_amount+amns_custom_duty_amount+amns_cess_amount+incoming_domestic_freight_custom+outgoing_domestic_freight_custom+port_handling_charges+cha_charges+amns_gst_amount)/100",
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Performance Bank Guarantee",
                "key_attribute": "amns_performance_bank_guarantee",
                "input_type": "string",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "is_negotiable": true,
                    "mode_type": "write",
                    "priority": 13,
                    "is_removable": false,
                    "options": []
                }
            },
            {
                "name": "Advance Bank Guarantee",
                "key_attribute": "amns_advanced_bank_guarantee",
                "input_type": "string",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "is_negotiable": true,
                    "mode_type": "write",
                    "priority": 14,
                    "is_removable": false,
                    "options": []
                }
            },
            {
                "name": "Validity of Quotation",
                "default_value": "",
                "key_attribute": "validity_of_quotation_custom",
                "input_type": "date",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": true,
                    "is_negotiable": true,
                    "mode_type": "write",
                    "priority": 36,
                    "is_removable": false,
                    "options": []
                }
            },
            {
                "name": "LD Clause",
                "key_attribute": "amns_ld_clause",
                "input_type": "dropdown",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "is_negotiable": false,
                    "dropdown_data": "/widget_data_mapping?type=amns_ld_clause&trade_request_uuid={{trade_request_uuid}}",
                    "mode_type": "write",
                    "priority": 15,
                    "is_removable": false,
                    "options": []
                }
            },
            {
                "name": "Total Evaluated Price",
                "key_attribute": "amns_total_evaluated_price",
                "input_type": "formula",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "mode_type": "read",
                    "prefix": "₹",
                    "priority": 16,
                    "formula": "(sum_total+amns_additional_cost+amns_packaging_and_forwarding+fob_cif_cfr_charges+amns_variable_loading_amount+fix_loading_factor_custom+amns_overseas_freight+amns_insurance_amount+amns_custom_duty_amount+amns_cess_amount+incoming_domestic_freight_custom+outgoing_domestic_freight_custom+port_handling_charges+cha_charges+finance_cost_loading_factor_custom+amns_gst_amount)",
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Less GST",
                "key_attribute": "amns_less_gst",
                "input_type": "formula",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "show_in_original_currency": false,
                    "mode_type": "read",
                    "prefix": "₹",
                    "priority": 17,
                    "formula": "amns_gst_amount",
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Cost To AMNS",
                "key_attribute": "amns_cost_without_loading",
                "input_type": "formula",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "mode_type": "read",
                    "prefix": "₹",
                    "priority": 19,
                    "formula": "amns_total_evaluated_price-amns_less_gst-fix_loading_factor_custom",
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Cost To AMNS With Loading",
                "key_attribute": "amns_cost_to_amns",
                "input_type": "formula",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "mode_type": "read",
                    "prefix": "₹",
                    "priority": 19,
                    "formula": "amns_total_evaluated_price-amns_less_gst",
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Overall Total",
                "key_attribute": "overall_total",
                "input_type": "formula",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "show_in_original_currency": true,
                    "mode_type": "read",
                    "prefix": "₹",
                    "priority": 30,
                    "formula": "sum_total+amns_additional_cost+amns_packaging_and_forwarding+fob_cif_cfr_charges",
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": [],
                    "dont_add_to_gross_total": true
                }
            },
            {
                "name": "Attachment",
                "key_attribute": "participant_attachment",
                "input_type": "attachment",
                "widget_type": "default",
                "validation": {},
                "configuration": {
                    "field_type": "participant",
                    "is_required": false,
                    "is_negotiable": false,
                    "mode_type": "write",
                    "priority": 31,
                    "is_removable": false,
                    "input_group": "attachment",
                    "options": []
                }
            },
            {
                "name": "Gross Total",
                "input_type": "formula",
                "key_attribute": "gross_total",
                "nanoid": "ohVnBUc7BdasdWkW0dasd9T3z87JP",
                "widget_type": "default",
                "configuration": {
                    "field_type": "participant",
                    "show_in_original_currency": true,
                    "mode_type": "hidden",
                    "precision": 2,
                    "priority": 30,
                    "prefix": "₹",
                    "input_group": "amount",
                    "is_removable": true,
                    "formula": "sum_total+amns_additional_cost+amns_packaging_and_forwarding+fob_cif_cfr_charges+amns_gst_amount",
                    "is_required": false,
                    "dont_add_to_gross_total": true
                }
            }
        ],
        "inline_components": [
            {
                "name": "Product",
                "key_attribute": "product",
                "input_type": "product",
                "widget_type": "default",
                "validation": {},
                "configuration": {
                    "field_type": "creator",
                    "is_required": true,
                    "dropdown_data": "/api/products",
                    "mode_type": "write",
                    "freeze_widget": "primary",
                    "priority": 0,
                    "is_removable": false,
                    "options": []
                }
            },
            {
                "name": "Delivery Location",
                "key_attribute": "buyer_hub",
                "input_type": "delivery_location",
                "widget_type": "default",
                "validation": {},
                "configuration": {
                    "field_type": "creator",
                    "is_required": true,
                    "mode_type": "write",
                    "priority": 1,
                    "is_removable": false,
                    "options": []
                }
            },
            {
                "name": "Quantity Requested",
                "key_attribute": "creator_quantity",
                "input_type": "quantity",
                "widget_type": "default",
                "validation": {},
                "configuration": {
                    "field_type": "creator",
                    "is_required": true,
                    "mode_type": "write",
                    "freeze_widget": "secondary",
                    "suffix": "KG",
                    "priority": 1,
                    "is_removable": false,
                    "input_group": "quantity",
                    "precision": 2,
                    "options": []
                }
            },
            {
                "name": "Quantity Offered",
                "key_attribute": "participant_quantity",
                "input_type": "quantity",
                "widget_type": "default",
                "validation": {},
                "configuration": {
                    "field_type": "participant",
                    "is_required": true,
                    "is_negotiable": true,
                    "mode_type": "write",
                    "freeze_widget": "secondary",
                    "suffix": "KG",
                    "priority": 1,
                    "is_removable": false,
                    "input_group": "quantity",
                    "precision": 2,
                    "options": []
                }
            },
            {
                "name": "Auction Intial Price",
                "key_attribute": "auction_inital_price",
                "input_type": "formula",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "mode_type": "hidden",
                    "prefix": "₹",
                    "suffix": "/KG",
                    "priority": 2,
                    "formula": "price",
                    "is_removable": true,
                    "input_group": "price",
                    "precision": 2,
                    "options": []
                }
            },
            {
                "name": "Rate",
                "key_attribute": "price",
                "input_type": "number",
                "widget_type": "default",
                "validation": {},
                "configuration": {
                    "field_type": "participant",
                    "is_required": true,
                    "is_negotiable": true,
                    "show_in_original_currency": true,
                    "mode_type": "write",
                    "freeze_widget": "primary",
                    "prefix": "₹",
                    "suffix": "/KG",
                    "priority": 2,
                    "is_removable": false,
                    "input_group": "price",
                    "precision": 2,
                    "options": []
                }
            },
            {
                "name": "Amount",
                "key_attribute": "total_amount",
                "input_type": "formula",
                "widget_type": "default",
                "validation": {},
                "configuration": {
                    "field_type": "participant",
                    "is_required": true,
                    "show_in_original_currency": true,
                    "mode_type": "read",
                    "prefix": "₹",
                    "priority": 2,
                    "formula": "price*participant_quantity",
                    "is_removable": false,
                    "input_group": "amount",
                    "precision": 2,
                    "options": []
                }
            },
            {
                "name": "Landed",
                "key_attribute": "landed_price",
                "input_type": "formula",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": true,
                    "mode_type": "read",
                    "prefix": "₹",
                    "suffix": "/KG",
                    "priority": 2,
                    "formula": "(price*amns_cost_without_loading)/amns_basic_total",
                    "is_removable": false,
                    "input_group": "price",
                    "precision": 2,
                    "options": []
                }
            },
            {
                "name": "Line GST Percentage",
                "key_attribute": "gst_percentage",
                "input_type": "number",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "mode_type": "write",
                    "freeze_widget": "primary",
                    "suffix": "%",
                    "priority": 5,
                    "is_removable": true,
                    "precision": 2,
                    "options": []
                }
            },
            {
                "name": "Line GST Amount",
                "key_attribute": "line_gst_amount",
                "input_type": "formula",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": false,
                    "mode_type": "read",
                    "freeze_widget": "primary",
                    "prefix": "₹",
                    "suffix": "%",
                    "priority": 5,
                    "formula": "total_amount*gst_percentage/100",
                    "is_removable": true,
                    "input_group": "amount",
                    "precision": 2,
                    "options": []
                }
            },
            {
                "name": "Delivery Time",
                "key_attribute": "delivery_time",
                "input_type": "string",
                "widget_type": "custom",
                "validation": {},
                "configuration": {
                    "is_replicable": true,
                    "field_type": "participant",
                    "is_required": true,
                    "is_negotiable": true,
                    "mode_type": "write",
                    "priority": 5,
                    "is_removable": false,
                    "options": []
                }
            },
            {
                "name": "Product Variant",
                "key_attribute": "variant",
                "input_type": "variant",
                "widget_type": "default",
                "validation": {},
                "configuration": {
                    "field_type": "creator",
                    "is_required": true,
                    "mode_type": "write",
                    "freeze_widget": "primary",
                    "priority": 0,
                    "is_removable": false,
                    "options": []
                }
            }
        ]
    },
    "data": [
        {
            "product": {
                "key": "product",
                "value": "Material Name 00c3f2e8-0761-4310-9136-6358c3e03d57",
                "uuid": "Y1hEWk4=",
                "product_code": "MATab316c1b-7406-4275-831c-f657390637ad",
                "event_group_line_item_uuid": "TmtOWlhR",
                "meta": {
                    "qualityParams": [
                        {
                            "name": "Description",
                            "value": "Material Description"
                        }
                    ],
                    "imageUrl": "https://s3.ap-south-1.amazonaws.com/agribid/commodities/Thumbnails/13535.jpg"
                },
                "configuration": {}
            },
            "buyer_hub": {
                "key": "buyer_hub",
                "value": "BuyerHub - 2245",
                "uuid": "WFhYcA==",
                "configuration": {}
            },
            "creator_quantity": {
                "key": "creator_quantity",
                "value": 20,
                "postfix": "KG",
                "configuration": {
                    "suffix": "KG"
                }
            },
            "participant_quantity": {
                "key": "participant_quantity",
                "postfix": "KG",
                "configuration": {
                    "suffix": "KG"
                }
            },
            "auction_inital_price": {
                "key": "auction_inital_price",
                "prefix": "₹",
                "postfix": "KG",
                "configuration": {
                    "prefix": "₹",
                    "suffix": "KG"
                }
            },
            "price": {
                "key": "price",
                "prefix": "₹",
                "postfix": "KG",
                "configuration": {
                    "prefix": "₹",
                    "suffix": "KG"
                }
            },
            "total_amount": {
                "key": "total_amount",
                "prefix": "₹",
                "configuration": {
                    "prefix": "₹"
                }
            },
            "landed_price": {
                "key": "landed_price",
                "prefix": "₹",
                "postfix": "KG",
                "configuration": {
                    "prefix": "₹",
                    "suffix": "KG"
                }
            },
            "gst_percentage": {
                "key": "gst_percentage",
                "postfix": "%",
                "configuration": {
                    "suffix": "%"
                }
            },
            "line_gst_amount": {
                "key": "line_gst_amount",
                "prefix": "₹",
                "postfix": "%",
                "configuration": {
                    "prefix": "₹",
                    "suffix": "%"
                }
            },
            "delivery_time": {
                "key": "delivery_time",
                "configuration": {}
            },
            "variant": {
                "uuid": "Z2REWlg=",
                "configuration": {}
            },
            "order": 1
        },
        {
            "product": {
                "key": "product",
                "value": "Material Name 00d721ff-7350-44ee-ab78-1e8c370a7c00",
                "uuid": "a2NEWlo=",
                "product_code": "MAT5ccc277c-9aa5-4f49-8adc-dc8f1b2ca46b",
                "event_group_line_item_uuid": "TmtRWlhR",
                "meta": {
                    "qualityParams": [
                        {
                            "name": "Description",
                            "value": "Material Description"
                        }
                    ],
                    "imageUrl": "https://s3.ap-south-1.amazonaws.com/agribid/commodities/Thumbnails/13370.jpg"
                },
                "configuration": {}
            },
            "buyer_hub": {
                "key": "buyer_hub",
                "value": "BuyerHub - 2245",
                "uuid": "WFhYcA==",
                "configuration": {}
            },
            "creator_quantity": {
                "key": "creator_quantity",
                "value": 20,
                "postfix": "KG",
                "configuration": {
                    "suffix": "KG"
                }
            },
            "participant_quantity": {
                "key": "participant_quantity",
                "postfix": "KG",
                "configuration": {
                    "suffix": "KG"
                }
            },
            "auction_inital_price": {
                "key": "auction_inital_price",
                "prefix": "₹",
                "postfix": "KG",
                "configuration": {
                    "prefix": "₹",
                    "suffix": "KG"
                }
            },
            "price": {
                "key": "price",
                "prefix": "₹",
                "postfix": "KG",
                "configuration": {
                    "prefix": "₹",
                    "suffix": "KG"
                }
            },
            "total_amount": {
                "key": "total_amount",
                "prefix": "₹",
                "configuration": {
                    "prefix": "₹"
                }
            },
            "landed_price": {
                "key": "landed_price",
                "prefix": "₹",
                "postfix": "KG",
                "configuration": {
                    "prefix": "₹",
                    "suffix": "KG"
                }
            },
            "gst_percentage": {
                "key": "gst_percentage",
                "postfix": "%",
                "configuration": {
                    "suffix": "%"
                }
            },
            "line_gst_amount": {
                "key": "line_gst_amount",
                "prefix": "₹",
                "postfix": "%",
                "configuration": {
                    "prefix": "₹",
                    "suffix": "%"
                }
            },
            "delivery_time": {
                "key": "delivery_time",
                "configuration": {}
            },
            "variant": {
                "uuid": "WmtEWmM=",
                "configuration": {}
            },
            "order": 2
        }
    ],
    "configurations": {
        "stage_no": 2,
        "event_group_uuid": event_uuid,
        "is_tnc_mandatory": false,
        "currency_configuration": {
            "base_currency": {
                "code": "INR",
                "global_tick_size": 0.02
            },
            "allowed_currencies": {
                "IDR": {
                    "name": "Indonesian Rupiah (IDR)",
                    "code": "IDR",
                    "rate_in_base": 0.0052,
                    "adjusted_precision": 0,
                    "original_adjusted_precision": -1,
                    "default_precision": 2,
                    "symbol": "Rp",
                    "number_system": "INTERNATIONAL",
                    "currency_label": "Rp"
                },
                "LKR": {
                    "name": "Sri Lankan Rupee (LKR)",
                    "code": "LKR",
                    "rate_in_base": 0.2898,
                    "adjusted_precision": 1,
                    "original_adjusted_precision": 1,
                    "default_precision": 2,
                    "symbol": "SL/Rs",
                    "number_system": "INTERNATIONAL",
                    "currency_label": "SL/Rs"
                },
                "JPY": {
                    "name": "Japanese Yen (JPY)",
                    "code": "JPY",
                    "rate_in_base": 0.5752,
                    "adjusted_precision": 1,
                    "original_adjusted_precision": 1,
                    "default_precision": 0,
                    "symbol": "¥",
                    "number_system": "INTERNATIONAL",
                    "currency_label": "¥"
                },
                "BDT": {
                    "name": "Bangladeshi Taka (BDT)",
                    "code": "BDT",
                    "rate_in_base": 0.7018,
                    "adjusted_precision": 1,
                    "original_adjusted_precision": 1,
                    "default_precision": 2,
                    "symbol": "৳",
                    "number_system": "INTERNATIONAL",
                    "currency_label": "৳"
                },
                "INR": {
                    "name": "Indian Rupees (INR)",
                    "code": "INR",
                    "rate_in_base": 1,
                    "adjusted_precision": 2,
                    "original_adjusted_precision": 2,
                    "default_precision": 2,
                    "symbol": "₹",
                    "number_system": "INDIAN",
                    "currency_label": "₹"
                },
                "EGP": {
                    "name": "Egyptian Pound (EGP)",
                    "code": "EGP",
                    "rate_in_base": 1.6889,
                    "adjusted_precision": 2,
                    "original_adjusted_precision": 2,
                    "default_precision": 2,
                    "symbol": "E£",
                    "number_system": "INTERNATIONAL",
                    "currency_label": "E£"
                },
                "HKD": {
                    "name": "Hong Kong Dollar (HKD)",
                    "code": "HKD",
                    "rate_in_base": 10.9349,
                    "adjusted_precision": 3,
                    "original_adjusted_precision": 3,
                    "default_precision": 2,
                    "symbol": "HK$",
                    "number_system": "INTERNATIONAL",
                    "currency_label": "HK$"
                },
                "CNY": {
                    "name": "Chinese Yuan (CNY)",
                    "code": "CNY",
                    "rate_in_base": 11.7545,
                    "adjusted_precision": 3,
                    "original_adjusted_precision": 3,
                    "default_precision": 2,
                    "symbol": "¥",
                    "number_system": "INTERNATIONAL",
                    "currency_label": "¥"
                },
                "SAR": {
                    "name": "Saudi Riyal (SAR)",
                    "code": "SAR",
                    "rate_in_base": 22.8541,
                    "adjusted_precision": 3,
                    "original_adjusted_precision": 3,
                    "default_precision": 2,
                    "symbol": "SAR",
                    "number_system": "INTERNATIONAL",
                    "currency_label": "SAR"
                },
                "AED": {
                    "name": "Dirham",
                    "code": "AED",
                    "rate_in_base": 23.2615,
                    "adjusted_precision": 3,
                    "original_adjusted_precision": 3,
                    "default_precision": 2,
                    "symbol": "د.إ",
                    "number_system": "INTERNATIONAL",
                    "currency_label": "د.إ"
                },
                "BGN": {
                    "name": "Bulgarian Lev (BGN)",
                    "code": "BGN",
                    "rate_in_base": 47.4338,
                    "adjusted_precision": 3,
                    "original_adjusted_precision": 3,
                    "default_precision": 2,
                    "symbol": "лв",
                    "number_system": "INTERNATIONAL",
                    "currency_label": "лв"
                },
                "AUD": {
                    "name": "Australian Dollar (AUD)",
                    "code": "AUD",
                    "rate_in_base": 53.326,
                    "adjusted_precision": 3,
                    "original_adjusted_precision": 3,
                    "default_precision": 2,
                    "symbol": "A$",
                    "number_system": "INTERNATIONAL",
                    "currency_label": "A$"
                },
                "CAD": {
                    "name": "Canadian Dollar (CAD)",
                    "code": "CAD",
                    "rate_in_base": 59.848,
                    "adjusted_precision": 3,
                    "original_adjusted_precision": 3,
                    "default_precision": 2,
                    "symbol": "C$",
                    "number_system": "INTERNATIONAL",
                    "currency_label": "C$"
                },
                "SGD": {
                    "name": "Singapore Dollar (SGD)",
                    "code": "SGD",
                    "rate_in_base": 63.2261,
                    "adjusted_precision": 3,
                    "original_adjusted_precision": 3,
                    "default_precision": 2,
                    "symbol": "SGD",
                    "number_system": "INTERNATIONAL",
                    "currency_label": "SGD"
                },
                "USD": {
                    "name": "United States Dollar (USD)",
                    "code": "USD",
                    "rate_in_base": 85.0859,
                    "adjusted_precision": 3,
                    "original_adjusted_precision": 3,
                    "default_precision": 2,
                    "symbol": "$",
                    "number_system": "INTERNATIONAL",
                    "currency_label": "$"
                },
                "EUR": {
                    "name": "Euro (EUR)",
                    "code": "EUR",
                    "rate_in_base": 92.8004,
                    "adjusted_precision": 3,
                    "original_adjusted_precision": 3,
                    "default_precision": 2,
                    "symbol": "€",
                    "number_system": "INTERNATIONAL",
                    "currency_label": "€"
                },
                "CHF": {
                    "name": "Swiss Franc (CHF)",
                    "code": "CHF",
                    "rate_in_base": 97.0148,
                    "adjusted_precision": 3,
                    "original_adjusted_precision": 3,
                    "default_precision": 2,
                    "symbol": "CHF",
                    "number_system": "INTERNATIONAL",
                    "currency_label": "CHF"
                },
                "GBP": {
                    "name": "Great Britain Pound (GBP)",
                    "code": "GBP",
                    "rate_in_base": 111.0086,
                    "adjusted_precision": 4,
                    "original_adjusted_precision": 4,
                    "default_precision": 2,
                    "symbol": "£",
                    "number_system": "INTERNATIONAL",
                    "currency_label": "£"
                }
            },
            "currency_mode": "multiple_currencies"
        },
        "is_english_auction_enabled": false,
        "is_alternate_bidding_allowed": false,
        "order_type": "buy",
        "rfx_mode": "rfq",
        "auction_closing_mode": "line_item_based",
        "rfp_evaluation_mode": "lot_based",
        "pickup_schedules": false,
        "bid_start_time": 1756657298,
        "bid_end_time": 1756659098,
        "extra_closing_time": 1788195098,
        "title": "RFQ ",
        "terms_and_conditions": [],
        "attachments": [
            {
                "type": "t_and_c",
                "value": []
            }
        ],
        "template_uuid": "TlpaZw==",
        "savings_configuration": null,
        "bulk_price": null,
        "time_extension_value": null,
        "last_n_minutes_for_time_extension": null,
        "rank_limit_for_time_extension": null,
        "dynamic_closing_time_strategy": "price_based",
        "price_difference": null,
        "time_difference": null,
        "end_price": 0,
        "is_auction_on_base_price": false,
        "closing_mode": "single",
        "is_basket_auction": false
    },
    "tabs": [],
    "status": "draft",
    "audience_company_uuids": [
        "ZFpRcA==",
        "UVpRRA=="
    ],
    "creation_flow_type": "quick_flow",
    "use_rfq_quotes_as_bids": false

});

    const response3 = await fetch(url3, {
      method: 'POST',
      headers,
      body: payload2
    });
    
    if (response3.status !== 200) {
      throw new Error(`POST request failed: HTTP ${response3.status} – ${response3.statusText}`);
    }
    const data3 = await response3.json();
    const rfq_uuid  = data3.uuid;
    console.log('RFQ_uuid', rfq_uuid);
    
    // Patch call getting after publish event 
    const url4 = `${BASE_URL}event_groups/${event_uuid}`; 

     const epochSeconds = Math.floor(Date.now() / 1000);
     let title = String("Auto_Event_Creation_" + epochSeconds); 
    const payload3 = JSON.stringify({
    
    "attachments": [],
    "title": title,
    "status": "active",
    "draft_trade_request_uuids": [
        tech_uuid,
        rfq_uuid
    ],
    "audience_company_uuids": [
        "ZFpRcA==",
        "UVpRRA=="
    ],
    "line_items": [],
    "terms_and_conditions": {
        "clauses": [],
        "attachments": [
            {
                "type": "t_and_c",
                "value": []
            }
        ]
    },
    "show_under_open_events": true
});

    const response4 = await fetch(url4, {
      method: 'PATCH',
      headers,
      body: payload3
    });
    
    if (response4.status !== 200) {
      throw new Error(`Patch request failed: HTTP ${response4.status} – ${response4.statusText}`);
    }
    const data4 = await response4.json();
    const RFX_id  = data4.ref_uuid;
    console.log('Event Creation Successful' , title , RFX_id  );

    return [RFX_id , title , event_uuid , rfq_uuid];
  } catch (err) {
    console.error('Error in fetch_eventCreation:', err);
    throw err; 
  }
}

export async function vendorBidAPI() {
   const vendorUser = USERS("vendor");
   const headers = await login2(vendorUser.USER_MOBILE, vendorUser.OTP);
   var [RFX_id , title , event_uuid]= await eventCreationAPI();
    const url1=`${BASE_URL}/event_groups/${event_uuid}`;// GET call
    try {
      // First: Perform GET request
      const response1 = await fetch(url1, { method: 'GET', headers });
      if (response1.status !== 200) {
        throw new Error(`GET request failed: HTTP ${response1.status} – ${response1.statusText}`);
      }
      const data = await response1.json();
      const tech_uuid = data.stages[0].uuid;
      const rfq_uuid = data.stages[1].uuid;

      console.log('tech_uuid', tech_uuid);
      console.log('rfq_uuid', rfq_uuid);

      const url2=`${BASE_URL}/user_intents`;      // POST call
      const payload1 = JSON.stringify({
        "item_uuid": "RGdkZ2M=",
        "item_type": "EventGroup",
        "intent_type": "trade_accept"
});
      const response2 = await fetch(url2, {
      method: 'POST',
      headers,
      body: payload1
    });
    if (response2.status !== 200) {
      throw new Error(`POST request failed: HTTP ${response2.status} – ${response2.statusText}`);
    }
    const url3=`${BASE_URL}/template_responses`;      // POST call
    const payload2 = JSON.stringify({
      "item_uuid": tech_uuid,
      "item_type": "TradeRequest",
      "company_uuid": "ZFpRcA=="
  });
    const response3 = await fetch(url3, {
    method: 'POST',
    headers,
    body: payload2
  });
    if (response3.status !== 200) {
    throw new Error(`POST request failed: HTTP ${response3.status} – ${response3.statusText}`);
  }
  const data1 = await response3.json();
  const quick_uuid = data1.uuid;

  console.log('quick_uuid', quick_uuid);

  const url4 = `${BASE_URL}/trade/${tech_uuid}?response_type=template&additional_fields=order_details`; // Get call

  const response4 = await fetch(url4, { method: 'GET', headers });

    if (response4.status !== 200) {
        throw new Error(`GET request failed: HTTP ${response4.status} – ${response4.statusText}`);
    }

    const data2 = await response4.json();
    var sheet_uuid = data2.layers[0].sheet_uuid;
    var page_uuid = data2.sheets.forms[0].page_uuids[0];
    var form_uuid = data2.sheets.forms[0].uuid;
    var key1 = data2.sheets.forms[0].page_response_headers[0].key_attribute;
    var key2 = data2.sheets.forms[0].page_response_headers[1].key_attribute;
    var key3 = data2.sheets.forms[0].page_response_headers[2].key_attribute;
    var key4 = data2.sheets.forms[0].page_response_headers[3].key_attribute;
    var page_uuid2 = data2.sheets.forms[1].page_uuids[0];
    var form_uuid2 =data2.sheets.forms[1].uuid;
    var key5 = data2.sheets.forms[1].page_response_headers[0].key_attribute;
    var key6= data2.sheets.forms[1].page_response_headers[1].key_attribute;
    var key7 = data2.sheets.forms[1].page_response_headers[2].key_attribute;
    var key8 = data2.sheets.forms[1].page_response_headers[3].key_attribute;

    console.log('sheet_uuid', sheet_uuid);
    console.log('page_uuid', page_uuid);
    console.log('form_uuid', form_uuid);
    console.log('key1', key1);
    console.log('key2', key2);
    console.log('key3', key3);
    console.log('key4', key4);
    console.log('page_uuid2', page_uuid2);
    console.log('form_uuid2', form_uuid2);
    console.log('key5', key5);
    console.log('key6', key6);
    console.log('key7', key7);
    console.log('key8', key8);

    const url5 = `${BASE_URL}/template_responses/${quick_uuid}/create_page_responses`; //PUT call
    const payload3 = JSON.stringify({
    "form_uuid": form_uuid,
    "page_uuids": [page_uuid],
    "page_responses": {
         [page_uuid]: [
            {
                "key_attribute": key1,
                "value": "Material Description "
            },
            {
                "key_attribute": key2,
                "value": "To ensure project timeline compatibility"
            },
            {
                "key_attribute": key3,
                "value": "To understand financial commitments"
            },
            {
                "key_attribute": key4,
                "value": "To evaluate service/product quality"
            }
        ]
    },
    "item_type": "TradeRequest",
    "item_uuid": tech_uuid 
  });
    const response5 = await fetch(url5, {
    method: 'PUT',
    headers,
    body: payload3
  });
    if (response5.status !== 200) {
    throw new Error(`PUT request failed: HTTP ${response5.status} – ${response5.statusText}`);
  }
  
  const url6 = `${BASE_URL}/template_responses/${quick_uuid}/create_page_responses`; //PUT call 2
  const payload4 = JSON.stringify({
    "form_uuid": form_uuid2,
    "page_uuids": [page_uuid2],
    "page_responses": {
        [page_uuid2]: [
            {
                "key_attribute": key5,
                "value": "Material Description "
            },
            {
                "key_attribute": key6,
                "value": "To ensure project timeline compatibility"
            },
            {
                "key_attribute": key7,
                "value": "To understand financial commitments"
            },
            {
                "key_attribute": key8,
                "value": "To evaluate service/product quality"
            }
        ]
    },
    "item_type": "TradeRequest",
    "item_uuid": tech_uuid

    });
   const response6 = await fetch(url6, {
    method: 'PUT',
    headers,
    body: payload4
  });
    if (response6.status !== 200) {
    throw new Error(`PUT request failed: HTTP ${response6.status} – ${response6.statusText}`);
  }

  const url7 = `${BASE_URL}/template_responses/${quick_uuid}`;  //PATCH Call

  const payload5 = JSON.stringify({
    "status": "active",
    "item_uuid": tech_uuid,
    "item_type": "TradeRequest",
    "company_uuid": "ZFpRcA=="
    });
   const response7 = await fetch(url7, {
    method: 'PATCH',
    headers,
    body: payload5
  });
    if (response7.status !== 200) {
    throw new Error(`PATCH request failed: HTTP ${response7.status} – ${response7.statusText}`);
  }

  const url8 = `${BASE_URL}/trade/${rfq_uuid}?response_type=template&additional_fields=order_details`;  //GET Call
  const response8 = await fetch(url8, { method: 'GET', headers });

    if (response8.status !== 200) {
        throw new Error(`GET request failed: HTTP ${response8.status} – ${response8.statusText}`);
    }

    const data3 = await response8.json();

    const varriant_uuid = data3.sheets.inline_components.data.default[0].variant.uuid;
    var prod_val = data3.sheets.inline_components.data.default[0].product.value;

    var prod_id = data3.sheets.inline_components.data.default[0].product.id;

    var prod_uuid = data3.sheets.inline_components.data.default[0].product.uuid;

    var line_item_no = data3.sheets.inline_components.data.default[0].producline_item_noo;

    var trade_product_id = data3.sheets.inline_components.data.default[0].product.trade_product_id;

    var trade_product_uuid = data3.sheets.inline_components.data.default[0].product.trade_ptrade_product_id;

    var product_code = data3.sheets.inline_components.data.default[0].product.product_code;

    var event_group_line_item_uuid=data3.sheets.inline_components.data.default[0].product.event_group_line_item_uuid;

    var trade_product_category_uuid=data3.sheets.inline_components.data.default[0].product.trade_product_category_uuid;

    var quantity =data3.sheets.inline_components.data.default[0].creator_quantity.value;

    var varriant_uuid2 = data3.sheets.inline_components.data.default[1].variant.uuid
    var prod_val2 = data3.sheets.inline_components.data.default[1].product.value;

    var prod_id2 = data3.sheets.inline_components.data.default[1].product.id;

    var prod_uuid2 = data3.sheets.inline_components.data.default[1].product.uuid;

    var line_item_no2 = data3.sheets.inline_components.data.default[1].product.line_item_no;
    var trade_product_id2 = data3.sheets.inline_components.data.default[1].product.trade_product_id;

    var trade_product_uuid2 = data3.sheets.inline_components.data.default[1].product.trade_product_uuid;

    var trade_product_category_uuid2 = data3.sheets.inline_components.data.default[1].product.trade_product_category_uuid;

    var product_code2 = data3.sheets.inline_components.data.default[1].product.product_code;

    var event_group_line_item_uuid2=data3.sheets.inline_components.data.default[1].product.event_group_line_item_uuid;

    var quantity2 =data3.sheets.inline_components.data.default[1].creator_quantitdata3;

    console.log('varriant_uuid', varriant_uuid);
    console.log('prod_val', prod_val);
    console.log('prod_id', prod_id);
    console.log('prod_uuid', prod_uuid);
    console.log('line_item_no', line_item_no);
    console.log('trade_product_id', trade_product_id);
    console.log('trade_product_uuid', trade_product_uuid);
    console.log('product_code', product_code);
    console.log('event_group_line_item_uuid', event_group_line_item_uuid);
    console.log('trade_product_category_uuid', trade_product_category_uuid);
    console.log('quantity', quantity);
    console.log('varriant_uuid2 , prod_val2 , prod_id2 , prod_uuid2', varriant_uuid2 , prod_val2 , prod_id2 , prod_uuid2);
    console.log('line_item_no2 ,trade_product_id2 , trade_product_uuid2', line_item_no2, trade_product_id2, trade_product_uuid2);
    console.log('trade_product_category_uuid2 , product_code2 , event_group_line_item_uuid2 , quantity2', trade_product_category_uuid2 , product_code2 , event_group_line_item_uuid2 , quantity2);

    const url9 = `${BASE_URL}/v1/bids`;  //POST Call
    const payload6 = JSON.stringify({
    "trade_request_uuid": rfq_uuid,
    "company_uuid": "ZFpRcA==",
    "currency_preference": {
        "name": "Indian Rupees (INR)",
        "code": "INR",
        "symbol": "₹",
        "rateInBase": 1,
        "adjustedPrecision": 2,
        "originalAdjustedPrecision": 2,
        "defaultPrecision": 2,
        "numberSystem": "INDIAN",
        "currencyLabel": "₹"
    }
    });
    const response9 = await fetch(url9, {
    method: 'POST',
    headers,
    body: payload6
  });
    if (response9.status !== 200) {
    throw new Error(`POST request failed: HTTP ${response9.status} – ${response9.statusText}`);
  }
  const data4 = await response9.json();
  const bid_uuid = data4.bid_uuid;
  console.log('bid_uuid' , bid_uuid);

    const url10 = `${BASE_URL}/v1/bids/${bid_uuid}/create_bid_products`;  //POST Call
    const payload7 = JSON.stringify({
    "company_uuid": "ZFpRcA==",
    "trade_request_uuid": rfq_uuid,
    "sheets": {
        "inline_components": {
            "data": {
                "ZFpRcA==": [
                    {
                        "action": {
                            "value": null,
                            "configuration": {
                                "mode_type": "hidden"
                            },
                            "key": "action"
                        },
                        "status": {
                            "key": "status"
                        },
                        "serial_number": {
                            "value": 1,
                            "key": "serial_number"
                        },
                        "creator_quantity": {
                            "value": quantity,
                            "configuration": {
                                "unit_type": "NO",
                                "suffix": "NO"
                            },
                            "key": "creator_quantity",
                            "postfix": "NO"
                        },
                        "participant_quantity": {
                            "value": quantity,
                            "validations": [
                                {
                                    "rule": "participant_quantity<=creator_quantity",
                                    "error_message": "Quantity must be less than or equal to 89 NO",
                                    "severity": 1
                                }
                            ],
                            "configuration": {
                                "unit_type": "NO",
                                "suffix": "NO"
                            },
                            "key": "participant_quantity",
                            "postfix": "NO"
                        },
                        "auction_inital_price": {
                            "validations": null,
                            "configuration": {
                                "unit_type": "NO",
                                "prefix": "₹",
                                "suffix": "/NO"
                            },
                            "key": "auction_inital_price",
                            "postfix": "/NO",
                            "prefix": "₹",
                            "value": 1,
                            "precision": 2
                        },
                        "price": {
                            "validations": [],
                            "configuration": {
                                "unit_type": "NO",
                                "prefix": "₹",
                                "suffix": "/NO"
                            },
                            "key": "price",
                            "postfix": "/NO",
                            "prefix": "₹",
                            "value": 20,
                            "precision": 2
                        },
                        "total_amount": {
                            "configuration": {
                                "prefix": "₹"
                            },
                            "key": "total_amount",
                            "prefix": "₹",
                            "value": 1000,
                            "precision": 2
                        },
                        "landed_price": {
                            "validations": null,
                            "configuration": {
                                "unit_type": "NO",
                                "prefix": "₹",
                                "suffix": "/NO"
                            },
                            "key": "landed_price",
                            "postfix": "/NO",
                            "prefix": "₹",
                            "value": 1,
                            "precision": 2
                        },
                        "gst_percentage": {
                            "validations": null,
                            "key": "gst_percentage",
                            "postfix": "%",
                            "isRequired": true,
                            "value": 3
                        },
                        "line_gst_amount": {
                            "validations": null,
                            "configuration": {
                                "prefix": "₹"
                            },
                            "key": "line_gst_amount",
                            "prefix": "₹",
                            "value": 0.89,
                            "precision": 2
                        },
                        "delivery_time": {
                            "validations": null,
                            "key": "delivery_time",
                            "value": "2"
                        },
                        "pr_number": {
                            "value": "82940764780",
                            "validations": null,
                            "key": "pr_number"
                        },
                        "material_code": {
                            "value": 2230518547,
                            "key": "material_code"
                        },
                        "item_no": {
                            "value": "0020",
                            "validations": null,
                            "key": "item_no"
                        },
                        "cha_charges": {},
                        "participant_attachment": {
                            "values": []
                        },
                        "product": {
                            "value": prod_val,
                            "id": prod_id,
                            "uuid": prod_uuid,
                            "line_item_no": line_item_no,
                            "trade_product_id": trade_product_id,
                            "trade_product_uuid": trade_product_uuid,
                            "trade_product_category_uuid": trade_product_category_uuid,
                            "unit_type": "NO",
                            "product_code": product_code,
                            "product_type": null,
                            "event_group_line_item_uuid": event_group_line_item_uuid,
                            "event_group_line_item_status": "active",
                            "qualities": [
                                {
                                    "name": "Cross-group disintermediate function",
                                    "value": "Cross-group disintermediate function"
                                }
                            ],
                            "image": "https://s3.ap-south-1.amazonaws.com/agribid/commodities/Thumbnails/4560.jpg",
                            "key": "product"
                        },
                        "variant": {
                            "uuid": "Z2REWlg=",
                            "value": "Default Variant",
                            "quality_params": [
                                {
                                    "name": "Cross-group disintermediate function",
                                    "value": "Cross-group disintermediate function"
                                }
                            ],
                            "status": "active",
                            "attachments": null,
                            "key": "variant"
                        },
                        "buyer_hub": {
                            "value": "BuyerHub - 2235",
                            "id": 2235,
                            "uuid": "WFhYYw==",
                            "key": "buyer_hub"
                        },
                        "meta_data": {
                            "symbol": "NO",
                            "postfix": "NO"
                        },
                        "best_price": {
                            "key": "best_price",
                            "value": null,
                            "prefix": "₹",
                            "precision": 2
                        },
                        "best_ranking_widget": {
                            "key": "best_ranking_widget",
                            "value": null,
                            "prefix": "₹",
                            "precision": 2
                        }
                    }
                ]
            }
        }
    }

    });
    const response10 = await fetch(url10, {
    method: 'POST',
    headers,
    body: payload7
   });
    if (response10.status !== 200) {
    throw new Error(`POST request failed: HTTP ${response10.status} – ${response10.statusText}`);
   }
  
    const url11 = `${BASE_URL}/v1/bids/${bid_uuid}/create_bid_products`;  //POST Call
    const payload8 = JSON.stringify({
        
    "company_uuid": "ZFpRcA==",
    "trade_request_uuid": rfq_uuid,
    "sheets": {
        "inline_components": {
            "data": {
                "ZFpRcA==": [
                    {
                        "action": {
                            "value": null,
                            "configuration": {
                                "mode_type": "hidden"
                            },
                            "key": "action"
                        },
                        "status": {
                            "value": null,
                            "key": "status"
                        },
                        "serial_number": {
                            "value": 2,
                            "key": "serial_number"
                        },
                        "creator_quantity": {
                            "value": quantity2,
                            "configuration": {
                                "unit_type": "NO",
                                "suffix": "NO"
                            },
                            "key": "creator_quantity",
                            "postfix": "NO"
                        },
                        "participant_quantity": {
                            "value": quantity2,
                            "validations": [
                                {
                                    "rule": "participant_quantity<=creator_quantity",
                                    "error_message": "Quantity must be less than or equal to 1 NO",
                                    "severity": 1
                                }
                            ],
                            "configuration": {
                                "unit_type": "NO",
                                "suffix": "NO"
                            },
                            "key": "participant_quantity",
                            "postfix": "NO"
                        },
                        "auction_inital_price": {
                            "validations": null,
                            "configuration": {
                                "unit_type": "NO",
                                "prefix": "₹",
                                "suffix": "/NO"
                            },
                            "key": "auction_inital_price",
                            "postfix": "/NO",
                            "prefix": "₹",
                            "value": 25,
                            "precision": 2
                        },
                        "price": {
                            "validations": [],
                            "configuration": {
                                "unit_type": "NO",
                                "prefix": "₹",
                                "suffix": "/NO"
                            },
                            "key": "price",
                            "postfix": "/NO",
                            "prefix": "₹",
                            "value": 30,
                            "precision": 2
                        },
                        "total_amount": {
                            "configuration": {
                                "prefix": "₹"
                            },
                            "key": "total_amount",
                            "prefix": "₹",
                            "value": 25,
                            "precision": 2
                        },
                        "landed_price": {
                            "validations": null,
                            "configuration": {
                                "unit_type": "NO",
                                "prefix": "₹",
                                "suffix": "/NO"
                            },
                            "key": "landed_price",
                            "postfix": "/NO",
                            "prefix": "₹",
                            "value": 25,
                            "precision": 2
                        },
                        "gst_percentage": {
                            "validations": null,
                            "key": "gst_percentage",
                            "postfix": "%",
                            "isRequired": true,
                            "value": 3
                        },
                        "line_gst_amount": {
                            "validations": null,
                            "configuration": {
                                "prefix": "₹"
                            },
                            "key": "line_gst_amount",
                            "prefix": "₹",
                            "value": 5,
                            "precision": 2
                        },
                        "delivery_time": {
                            "validations": null,
                            "key": "delivery_time",
                            "value": "2"
                        },
                        "pr_number": {
                            "value": "97140912480",
                            "validations": null,
                            "key": "pr_number"
                        },
                        "material_code": {
                            "value": 3935983988,
                            "key": "material_code"
                        },
                        "item_no": {
                            "value": "0010",
                            "validations": null,
                            "key": "item_no"
                        },
                        "cha_charges": {},
                        "participant_attachment": {
                            "values": []
                        },
                        "product": {
                            "value": prod_val2,
                            "id": prod_id2,
                            "uuid": prod_uuid2,
                            "line_item_no": line_item_no2,
                            "trade_product_id": trade_product_id2,
                            "trade_product_uuid": trade_product_uuid2,
                            "trade_product_category_uuid": trade_product_category_uuid2,
                            "unit_type": "NO",
                            "product_code": product_code,
                            "product_type": null,
                            "event_group_line_item_uuid": event_group_line_item_uuid2,
                            "event_group_line_item_status": "active",
                            "qualities": [
                                {
                                    "name": "Adaptive context-sensitive throughput",
                                    "value": "Adaptive context-sensitive throughput"
                                }
                            ],
                            "image": "https://s3.ap-south-1.amazonaws.com/agribid/commodities/Thumbnails/992.jpg",
                            "key": "product"
                        },
                        "variant": {
                            "uuid": "WmtEWmM=",
                            "value": "Default Variant",
                            "quality_params": [
                                {
                                    "name": "Adaptive context-sensitive throughput",
                                    "value": "Adaptive context-sensitive throughput"
                                }
                            ],
                            "status": "active",
                            "attachments": null,
                            "key": "variant"
                        },
                        "buyer_hub": {
                            "value": "BuyerHub - 2235",
                            "id": 2235,
                            "uuid": "WFhYYw==",
                            "key": "buyer_hub"
                        },
                        "meta_data": {
                            "symbol": "NO",
                            "postfix": "NO"
                        },
                        "best_price": {
                            "key": "best_price",
                            "value": null,
                            "prefix": "₹",
                            "precision": 2
                        },
                        "best_ranking_widget": {
                            "key": "best_ranking_widget",
                            "value": null,
                            "prefix": "₹",
                            "precision": 2
                        }
                    }
                ]
            }
        }
    }


            });
    const response11 = await fetch(url11, {
    method: 'POST',
    headers,
    body: payload8
   });
    if (response11.status !== 200) {
    throw new Error(`POST request failed: HTTP ${response11.status} – ${response11.statusText}`);
   };

  const url12 = `${BASE_URL}/v1/bids/${bid_uuid}`;  //PATCH Call

  const payload9 = JSON.stringify({
    "company_uuid": "ZFpRcA==",
    "trade_request_uuid": rfq_uuid,
    "currency_preference": {
        "code": "INR"
    },
    "sheets": {
        "global_price_components": {
            "global_data": {
                "ZFpRcA==": {
                    "amns_incoterms": {
                        "value": "ASW",
                        "uuid": "ZGNYZw=="
                    },
                    "delivery_for_incoterms_custom": {
                        "value": "k kj "
                    },
                    "sum_total": {
                        "value": "124"
                    },
                    "amns_basic_total": {
                        "value": "124"
                    },
                    "amns_additional_cost": {
                        "value": 5
                    },
                    "amns_packaging_and_forwarding_percentage": {
                        "value": 2
                    },
                    "amns_packaging_and_forwarding": {
                        "value": 0
                    },
                    "amns_vendor_category": {
                        "value": "Service Provider",
                        "uuid": "cFpnYw=="
                    },
                    "warranty_terms": {
                        "value": "12 months from Supply and 18 months from Installation\n\n",
                        "uuid": "ZE5naw=="
                    },
                    "amns_payment_terms": {
                        "value": "AB09",
                        "uuid": "cFFaWkQ="
                    },
                    "amns_performance_bank_guarantee": {},
                    "amns_advanced_bank_guarantee": {},
                    "validity_of_quotation_custom": {
                        "value": 1737028800
                    },
                    "amns_ld_clause": {},
                    "overall_total": {
                        "value": "124"
                    },
                    "participant_attachment": {
                        "values": []
                    },
                    "fob_cif_cfr_charges": {
                        "value": 0
                    },
                    "amns_total_in_currency": {
                        "value": "124"
                    },
                    "amns_total_in_inr_currency": {
                        "value": "124"
                    },
                    "amns_custom_duty_amount": {
                        "value": 0
                    },
                    "amns_cess_amount": {
                        "value": 0
                    },
                    "amns_gst_percentage": {},
                    "amns_gst_amount": {
                        "value": "5.99"
                    },
                    "transit_insurance_amount": {},
                    "amns_variable_loading_amount": {
                        "value": 0
                    },
                    "amns_total_evaluated_price": {
                        "value": "129.99"
                    },
                    "amns_less_gst": {
                        "value": "5.99"
                    },
                    "amns_cost_without_loading": {
                        "value": "124"
                    },
                    "amns_cost_to_amns": {
                        "value": "124"
                    },
                    "gross_total": {
                        "value": "129.99"
                    }
                }
            }
        }
    },
    "status": "active",
    "fast_bid_enabled": false

    });
   const response12 = await fetch(url12, {
    method: 'PATCH',
    headers,
    body: payload9
  });
    if (response12.status !== 200) {
    throw new Error(`PATCH request failed: HTTP ${response12.status} – ${response12.statusText}`);
  }

   return [RFX_id , title ,tech_uuid, rfq_uuid];
    } catch (err) {
    console.error('Error in fetch_eventCreation:', err);
    throw err; 
  }
}

export async function sendCounterOfferAPI(){
  var [RFX_id , title ,tech_uuid, rfq_uuid]  = await vendorBidAPI();
  const clientUser = USERS("client");
  const headers = await login(clientUser.USER_MOBILE, clientUser.OTP);
       
    const url=`${BASE_URL}v1/trade/${rfq_uuid}/schema?response_type=template&additional_fields=order_details`;// GET call
    try {

      const response = await fetch(url, { method: 'GET', headers });
      if (response.status !== 200) {
        throw new Error(`GET request failed: HTTP ${response.status} – ${response.statusText}`);
      }
      const data = await response.json();
      const sheet_uuid = data.layers[0].sheet_uuid;
      console.log("sheet_uuid", sheet_uuid);

      const url1=`${BASE_URL}v1/trade/${rfq_uuid}/quote_details/${sheet_uuid}`;// GET call
    
      const response1 = await fetch(url1, { method: 'GET', headers });
      if (response1.status !== 200) {
        throw new Error(`GET request failed: HTTP ${response1.status} – ${response1.statusText}`);
      }
    const data1 = await response1.json();
    var company_uuid= "ZFpRcA==";        

    var value= data1.inline_data[company_uuid][0].product.value;
    var id= data1.inline_data[company_uuid][0].product.id;
    var uuid=data1.inline_data[company_uuid][0].product.uuid;
    var trade_product_id= data1.inline_data[company_uuid][0].product.trade_product_id;
    var trade_product_uuid= data1.inline_data[company_uuid][0].product.trade_product_uuid;
    var trade_product_category_uuid= data1.inline_data[company_uuid][0].product.trade_product_category_uuid;
    var product_code= data1.inline_data[company_uuid][0].product.product_code;
    var event_group_line_item_uuid= data1.inline_data[company_uuid][0].product.event_group_line_item_uuid;
    var bid_trade_product_uuid= data1.inline_data[company_uuid][0].product.bid_trade_product_uuid;
    console.log("value , id ,uuid , trade_product_id , trade_product_uuid , trade_product_category_uuid , product_code , event_group_line_item_uuid , bid_trade_product_uuid", value , id , uuid, trade_product_id , trade_product_uuid , trade_product_category_uuid , product_code , event_group_line_item_uuid , bid_trade_product_uuid);

    var value2= data1.inline_data[company_uuid][1].product.value;
    var id2= data1.inline_data[company_uuid][1].product.id;
    var uuid2=data1.inline_data[company_uuid][1].product.uuid;
    var trade_product_id2= data1.inline_data[company_uuid][1].product.trade_product_id;
    var trade_product_uuid2= data1.inline_data[company_uuid][1].product.trade_product_uuid;
    var trade_product_category_uuid2= data1.inline_data[company_uuid][1].product.trade_product_category_uuid;
    var product_code2= data1.inline_data[company_uuid][1].product.product_code;
    var event_group_line_item_uuid2= data1.inline_data[company_uuid][1].product.event_group_line_item_uuid;
    var bid_trade_product_uuid2= data1.inline_data[company_uuid][1].product.bid_trade_product_uuid;

    console.log("value2", value2);
    console.log("id2", id2);
    console.log("uuid2", uuid2);
    console.log("trade_product_id2",trade_product_id2);
    console.log("trade_product_uuid2",trade_product_uuid2);
    console.log("trade_product_category_uuid2",trade_product_category_uuid2);
    console.log("product_code2", product_code2)
    console.log("event_group_line_item_uuid2",event_group_line_item_uuid2);
    console.log("bid_trade_product_uuid2",bid_trade_product_uuid2);
    
    const url2=`${BASE_URL}v1/trade/${rfq_uuid}/quote_details/${sheet_uuid}`;// GET call
    
    const response2 = await fetch(url2, { method: 'GET', headers });
    if (response2.status !== 200) {
        throw new Error(`GET request failed: HTTP ${response2.status} – ${response2.statusText}`);
      }
    const data2 = await response2.json();
    var landed1= data2.inline_data[company_uuid][0].landed_price.value;
    var landed2= data2.inline_data[company_uuid][1].landed_price.value;
    var line2_gst_percentage= Number(data2.inline_data[company_uuid][1].gst_percentage.value);
    var line2_gst_amount=Number(data2.inline_data[company_uuid][1].line_gst_amount.value);
    var delivery_time1= data2.inline_data[company_uuid][0].delivery_time.value;
    var delivery_time2= data2.inline_data[company_uuid][1].delivery_time.value;

    //global
    var sum_total= Number(data2.global_data[company_uuid].sum_total.value);
    var basic_total=Number(data2.global_data[company_uuid].amns_basic_total.value);
    var add_charge= Number(data2.global_data[company_uuid].amns_additional_cost.value);
    var total_foreign_currency= Number(data2.global_data[company_uuid].amns_total_in_currency.value);
    var total_inr_currency=Number(data2.global_data[company_uuid].amns_total_in_inr_currency.value);
    var packaging_and_forwarding_percentage =Number(data2.global_data[company_uuid].amns_packaging_and_forwarding_percentage.value);
    var packaging_and_forwarding_amount= Number(data2.global_data[company_uuid].amns_packaging_and_forwarding.value);
    var total_evaluated_price= data2.global_data[company_uuid].amns_total_evaluated_price.value;
    var overall_total= Number(data2.global_data[company_uuid].overall_total.value);

    const url3 =`${BASE_URL}additional_request/raise_additional_request`;// POST call
    const payload = JSON.stringify({

    "item_uuid": sheet_uuid,
    "item_type": "counter_offer_for_bid",
    "sheets": {
        "inline_components": {
            "data": [
                {
                    "action": {
                        "value": {
                            "label": "Choose"
                        },
                        "configuration": {
                            "mode_type": "hidden"
                        },
                        "readOnly": false,
                        "key": "action"
                    },
                    "status": {
                        "value": "active",
                        "anomaly_resolved": null,
                        "key": "status",
                        "inactive": false,
                        "type": "checkbox"
                    },
                    "serial_number": {
                        "value": 1,
                        "key": "serial_number"
                    },
                    "best_price": {
                        "values": null,
                        "value": "10.00",
                        "configuration": {
                            "unit_type": "NO",
                            "prefix": "₹",
                            "suffix": "/NO"
                        },
                        "key": "best_price",
                        "isBestBidder": false,
                        "postfix": "/NO",
                        "prefix": "₹",
                        "currencyCode": "INR",
                        "precision": 2
                    },
                    "creator_quantity": {
                        "value": "1",
                        "configuration": {
                            "unit_type": "NO",
                            "suffix": "NO"
                        },
                        "key": "creator_quantity",
                        "postfix": "NO"
                    },
                    "participant_quantity": {
                        "value": "1",
                        "validations": [],
                        "configuration": {
                            "unit_type": "NO",
                            "suffix": "NO"
                        },
                        "key": "participant_quantity",
                        "postfix": "NO"
                    },
                    "auction_inital_price": {
                        "validations": null,
                        "configuration": {
                            "unit_type": "NO",
                            "prefix": "₹",
                            "suffix": "/NO"
                        },
                        "value": "5.00",
                        "key": "auction_inital_price",
                        "postfix": "/NO",
                        "prefix": "₹",
                        "currencyCode": "INR",
                        "precision": 2
                    },
                    "price": {
                        "value": 7,
                        "last_valid_price": null,
                        "validations": [],
                        "savings": null,
                        "configuration": {
                            "unit_type": "NO",
                            "prefix": "₹",
                            "suffix": "/NO"
                        },
                        "savingVals": {
                            "historical_price": {
                                "savingsAmount": {
                                    "value": "426",
                                    "configuration": {
                                        "unit_type": "NO",
                                        "prefix": "₹",
                                        "suffix": "/NO"
                                    }
                                },
                                "savingsPercent": {
                                    "value": "97.71",
                                    "configuration": {
                                        "suffix": "%"
                                    }
                                }
                            },
                            "budget": {
                                "savingsAmount": {
                                    "value": "426",
                                    "configuration": {
                                        "unit_type": "NO",
                                        "prefix": "₹",
                                        "suffix": "/NO"
                                    }
                                },
                                "savingsPercent": {
                                    "value": "97.71",
                                    "configuration": {
                                        "suffix": "%"
                                    }
                                }
                            },
                            "tradeProductUuid": trade_product_uuid
                        },
                        "prevValue": 10,
                        "key": "price",
                        "postfix": "/NO",
                        "prefix": "₹",
                        "currencyCode": "INR",
                        "precision": 2
                    },
                    "total_amount": {
                        "configuration": {
                            "prefix": "₹"
                        },
                        "savings": null,
                        "key": "total_amount",
                        "prefix": "₹",
                        "value": "410.00",
                        "currencyCode": "INR",
                        "precision": 2
                    },
                    "landed_price": {
                        "validations": null,
                        "configuration": {
                            "unit_type": "NO",
                            "prefix": "₹",
                            "suffix": "/NO"
                        },
                        "value": "5.02",
                        "isBestScore": false,
                        "key": "landed_price",
                        "postfix": "/NO",
                        "prefix": "₹",
                        "currencyCode": "INR",
                        "precision": 2
                    },
                    "gst_percentage": {
                        "validations": null,
                        "value": "4",
                        "key": "gst_percentage",
                        "postfix": "%"
                    },
                    "line_gst_amount": {
                        "validations": null,
                        "configuration": {
                            "prefix": "₹"
                        },
                        "value": "32.80",
                        "key": "line_gst_amount",
                        "prefix": "₹",
                        "currencyCode": "INR",
                        "precision": 2
                    },
                    "delivery_time": {
                        "validations": null,
                        "value": "5",
                        "key": "delivery_time"
                    },
                    "pr_number": {
                        "value": "76279141596",
                        "validations": null,
                        "key": "pr_number"
                    },
                    "material_code": {
                        "value": 5008364764,
                        "key": "material_code"
                    },
                    "item_no": {
                        "value": "0010",
                        "validations": null,
                        "key": "item_no"
                    },
                    "cha_charges": {},
                    "participant_attachment": {
                        "values": []
                    },
                    "last_po_vendor_code": {
                        "value": "86j0kra6",
                        "configuration": {
                            "field_type": "creator",
                            "is_removable": false,
                            "is_required": true,
                            "is_negotiable": false,
                            "mode_type": "read",
                            "priority": 20
                        },
                        "key": "last_po_vendor_code"
                    },
                    "last_po_vendor_name": {
                        "value": null,
                        "configuration": {
                            "field_type": "creator",
                            "is_removable": false,
                            "is_required": true,
                            "is_negotiable": false,
                            "mode_type": "read",
                            "priority": 20
                        },
                        "key": "last_po_vendor_name"
                    },
                    "last_po_no": {
                        "value": "2391013615",
                        "configuration": {
                            "field_type": "creator",
                            "is_removable": false,
                            "is_required": true,
                            "is_negotiable": false,
                            "mode_type": "read",
                            "priority": 20
                        },
                        "key": "last_po_no"
                    },
                    "last_po_quantity": {
                        "value": "46.000 ",
                        "configuration": {
                            "field_type": "creator",
                            "is_removable": false,
                            "is_required": true,
                            "is_negotiable": false,
                            "mode_type": "read",
                            "priority": 20
                        },
                        "key": "last_po_quantity"
                    },
                    "last_po_price": {
                        "value": 436,
                        "configuration": {
                            "field_type": "creator",
                            "is_removable": false,
                            "is_required": true,
                            "is_negotiable": false,
                            "mode_type": "read",
                            "priority": 20,
                            "prefix": "MKD"
                        },
                        "key": "last_po_price",
                        "prefix": "MKD"
                    },
                    "last_po_created_at": {
                        "value": 0,
                        "configuration": {
                            "field_type": "creator",
                            "is_removable": false,
                            "is_required": true,
                            "is_negotiable": false,
                            "mode_type": "read",
                            "priority": 20
                        },
                        "key": "last_po_created_at"
                    },
                    "product": {
                        "value": value,
                        "id": id,
                        "uuid": uuid,
                        "line_item_no": "",
                        "trade_product_id": trade_product_id,
                        "trade_product_uuid": trade_product_uuid,
                        "trade_product_category_uuid": trade_product_category_uuid,
                        "unit_type": "NO",
                        "product_code": product_code,
                        "product_type": null,
                        "event_group_line_item_uuid": event_group_line_item_uuid,
                        "event_group_line_item_status": "active",
                        "bid_trade_product_uuid": bid_trade_product_uuid,
                        "key": "product",
                        "meta": {
                            "qualityParams": [
                                {
                                    "name": "Innovative motivating throughput",
                                    "value": "Innovative motivating throughput"
                                }
                            ],
                            "imageUrl": "https://s3.ap-south-1.amazonaws.com/agribid/commodities/Thumbnails/5728.jpg",
                            "productDescription": ""
                        }
                    },
                    "variant": {
                        "uuid": "TmdaZGM=",
                        "value": {
                            "key": "TmdaZGM=",
                            "label": "Default Variant",
                            "qualityParams": [
                                {
                                    "name": "Innovative motivating throughput",
                                    "value": "Innovative motivating throughput"
                                }
                            ]
                        },
                        "quality_params": [
                            {
                                "name": "Innovative motivating throughput",
                                "value": "Innovative motivating throughput"
                            }
                        ],
                        "status": "active",
                        "attachments": null,
                        "key": "variant",
                        "productUuid": "Z05aZGM="
                    },
                    "buyer_hub": {
                        "value": "BuyerHub - 2235",
                        "id": 2235,
                        "uuid": "WFhYYw==",
                        "address": "Hazira",
                        "location_code": "2010",
                        "key": "buyer_hub",
                        "meta": {
                            "address": "Hazira",
                            "location_code": "2010"
                        }
                    },
                    "meta_data": {
                        "symbol": "NO",
                        "postfix": "NO"
                    },
                    "savings_with_strategy": {
                        "savings": [
                            {
                                "savings_amount": {
                                    "value": "426",
                                    "configuration": {
                                        "unit_type": "NO",
                                        "prefix": "₹",
                                        "suffix": "/NO"
                                    }
                                },
                                "savings_percent": {
                                    "value": "97.71",
                                    "configuration": {
                                        "suffix": "%"
                                    }
                                },
                                "reference_on_key_attribute": "price",
                                "reference_strategy_key": "historical_price"
                            },
                            {
                                "savings_amount": {
                                    "value": "426",
                                    "configuration": {
                                        "unit_type": "NO",
                                        "prefix": "₹",
                                        "suffix": "/NO"
                                    }
                                },
                                "savings_percent": {
                                    "value": "97.71",
                                    "configuration": {
                                        "suffix": "%"
                                    }
                                },
                                "reference_on_key_attribute": "price",
                                "reference_strategy_key": "budget"
                            }
                        ]
                    },
                    "rank": {
                        "value": "2",
                        "key": "rank",
                        "isBestBidder": false
                    },
                    "best_ranking_widget": {
                        "key": "best_ranking_widget",
                        "value": "10.03",
                        "isBestBidder": false,
                        "postfix": "/NO",
                        "prefix": "₹",
                        "currencyCode": "INR",
                        "precision": 2
                    },
                    "historical_price": {
                        "value": 436,
                        "last_valid_price": null,
                        "validations": [],
                        "savings": null,
                        "configuration": {
                            "unit_type": "NO",
                            "prefix": "₹",
                            "suffix": "/NO"
                        },
                        "savingVals": {
                            "historical_price": {
                                "savingsAmount": {
                                    "value": "426",
                                    "configuration": {
                                        "unit_type": "NO",
                                        "prefix": "₹",
                                        "suffix": "/NO"
                                    }
                                },
                                "savingsPercent": {
                                    "value": "97.71",
                                    "configuration": {
                                        "suffix": "%"
                                    }
                                }
                            },
                            "budget": {
                                "savingsAmount": {
                                    "value": "426",
                                    "configuration": {
                                        "unit_type": "NO",
                                        "prefix": "₹",
                                        "suffix": "/NO"
                                    }
                                },
                                "savingsPercent": {
                                    "value": "97.71",
                                    "configuration": {
                                        "suffix": "%"
                                    }
                                }
                            },
                            "tradeProductUuid": trade_product_uuid
                        },
                        "key": "price",
                        "postfix": "/NO",
                        "prefix": "₹",
                        "currencyCode": "INR",
                        "precision": 2
                    }
                },
                {
                    "action": {
                        "value": {
                            "label": "Choose"
                        },
                        "configuration": {
                            "mode_type": "hidden"
                        },
                        "readOnly": false,
                        "key": "action"
                    },
                    "status": {
                        "value": "active",
                        "anomaly_resolved": null,
                        "key": "status",
                        "inactive": false,
                        "type": "checkbox"
                    },
                    "serial_number": {
                        "value": 2,
                        "key": "serial_number"
                    },
                    "best_price": {
                        "values": null,
                        "value": "10.00",
                        "configuration": {
                            "unit_type": "NO",
                            "prefix": "₹",
                            "suffix": "/NO"
                        },
                        "key": "best_price",
                        "isBestBidder": false,
                        "postfix": "/NO",
                        "prefix": "₹",
                        "currencyCode": "INR",
                        "precision": 2
                    },
                    "creator_quantity": {
                        "value": "1",
                        "configuration": {
                            "unit_type": "NO",
                            "suffix": "NO"
                        },
                        "key": "creator_quantity",
                        "postfix": "NO"
                    },
                    "participant_quantity": {
                        "value": "1",
                        "validations": [],
                        "configuration": {
                            "unit_type": "NO",
                            "suffix": "NO"
                        },
                        "key": "participant_quantity",
                        "postfix": "NO"
                    },
                    "auction_inital_price": {
                        "validations": null,
                        "configuration": {
                            "unit_type": "NO",
                            "prefix": "₹",
                            "suffix": "/NO"
                        },
                        "value": "5.00",
                        "key": "auction_inital_price",
                        "postfix": "/NO",
                        "prefix": "₹",
                        "currencyCode": "INR",
                        "precision": 2
                    },
                    "price": {
                        "value": 8,
                        "last_valid_price": null,
                        "validations": [],
                        "savings": null,
                        "configuration": {
                            "unit_type": "NO",
                            "prefix": "₹",
                            "suffix": "/NO"
                        },
                        "savingVals": {
                            "historical_price": {
                                "savingsAmount": {
                                    "value": "826",
                                    "configuration": {
                                        "unit_type": "NO",
                                        "prefix": "₹",
                                        "suffix": "/NO"
                                    }
                                },
                                "savingsPercent": {
                                    "value": "98.8",
                                    "configuration": {
                                        "suffix": "%"
                                    }
                                }
                            },
                            "budget": {
                                "savingsAmount": {
                                    "value": "826",
                                    "configuration": {
                                        "unit_type": "NO",
                                        "prefix": "₹",
                                        "suffix": "/NO"
                                    }
                                },
                                "savingsPercent": {
                                    "value": "98.8",
                                    "configuration": {
                                        "suffix": "%"
                                    }
                                }
                            },
                            "tradeProductUuid": trade_product_uuid2
                        },
                        "prevValue": 10,
                        "key": "price",
                        "postfix": "/NO",
                        "prefix": "₹",
                        "currencyCode": "INR",
                        "precision": 2
                    },
                    "total_amount": {
                        "configuration": {
                            "prefix": "₹"
                        },
                        "savings": null,
                        "key": "total_amount",
                        "prefix": "₹",
                        "value": "75.00",
                        "currencyCode": "INR",
                        "precision": 2
                    },
                    "landed_price": {
                        "validations": null,
                        "configuration": {
                            "unit_type": "NO",
                            "prefix": "₹",
                            "suffix": "/NO"
                        },
                        "value": "5.04",
                        "isBestScore": false,
                        "key": "landed_price",
                        "postfix": "/NO",
                        "prefix": "₹",
                        "currencyCode": "INR",
                        "precision": 2
                    },
                    "gst_percentage": {
                        "validations": null,
                        "value": "5",
                        "key": "gst_percentage",
                        "postfix": "%"
                    },
                    "line_gst_amount": {
                        "validations": null,
                        "configuration": {
                            "prefix": "₹"
                        },
                        "value": "7.50",
                        "key": "line_gst_amount",
                        "prefix": "₹",
                        "currencyCode": "INR",
                        "precision": 2
                    },
                    "delivery_time": {
                        "validations": null,
                        "value": "5",
                        "key": "delivery_time"
                    },
                    "pr_number": {
                        "value": "76279141596",
                        "validations": null,
                        "key": "pr_number"
                    },
                    "material_code": {
                        "value": 8814753945,
                        "key": "material_code"
                    },
                    "item_no": {
                        "value": "0020",
                        "validations": null,
                        "key": "item_no"
                    },
                    "cha_charges": {},
                    "participant_attachment": {
                        "values": []
                    },
                    "last_po_vendor_code": {
                        "value": "c7zy33cq",
                        "configuration": {
                            "field_type": "creator",
                            "is_removable": false,
                            "is_required": true,
                            "is_negotiable": false,
                            "mode_type": "read",
                            "priority": 20
                        },
                        "key": "last_po_vendor_code"
                    },
                    "last_po_vendor_name": {
                        "value": null,
                        "configuration": {
                            "field_type": "creator",
                            "is_removable": false,
                            "is_required": true,
                            "is_negotiable": false,
                            "mode_type": "read",
                            "priority": 20
                        },
                        "key": "last_po_vendor_name"
                    },
                    "last_po_no": {
                        "value": "6390898945",
                        "configuration": {
                            "field_type": "creator",
                            "is_removable": false,
                            "is_required": true,
                            "is_negotiable": false,
                            "mode_type": "read",
                            "priority": 20
                        },
                        "key": "last_po_no"
                    },
                    "last_po_quantity": {
                        "value": "11.000 ",
                        "configuration": {
                            "field_type": "creator",
                            "is_removable": false,
                            "is_required": true,
                            "is_negotiable": false,
                            "mode_type": "read",
                            "priority": 20
                        },
                        "key": "last_po_quantity"
                    },
                    "last_po_price": {
                        "value": 836,
                        "configuration": {
                            "field_type": "creator",
                            "is_removable": false,
                            "is_required": true,
                            "is_negotiable": false,
                            "mode_type": "read",
                            "priority": 20,
                            "prefix": "SYP"
                        },
                        "key": "last_po_price",
                        "prefix": "SYP"
                    },
                    "last_po_created_at": {
                        "value": 0,
                        "configuration": {
                            "field_type": "creator",
                            "is_removable": false,
                            "is_required": true,
                            "is_negotiable": false,
                            "mode_type": "read",
                            "priority": 20
                        },
                        "key": "last_po_created_at"
                    },
                    "product": {
                        "value": value2,
                        "id": id2,
                        "uuid": uuid2,
                        "line_item_no": "",
                        "trade_product_id": trade_product_id2,
                        "trade_product_uuid": trade_product_uuid2,
                        "trade_product_category_uuid": trade_product_category_uuid2,
                        "unit_type": "NO",
                        "product_code": product_code2,
                        "product_type": null,
                        "event_group_line_item_uuid": event_group_line_item_uuid2,
                        "event_group_line_item_status": "active",
                        "bid_trade_product_uuid": bid_trade_product_uuid2,
                        "key": "product",
                        "meta": {
                            "qualityParams": [
                                {
                                    "name": "Cross-group disintermediate function",
                                    "value": "Cross-group disintermediate function"
                                }
                            ],
                            "imageUrl": "https://s3.ap-south-1.amazonaws.com/agribid/commodities/Thumbnails/5729.jpg",
                            "productDescription": ""
                        }
                    },
                    "variant": {
                        "uuid": "TmtaZGM=",
                        "value": {
                            "key": "TmtaZGM=",
                            "label": "Default Variant",
                            "qualityParams": [
                                {
                                    "name": "Cross-group disintermediate function",
                                    "value": "Cross-group disintermediate function"
                                }
                            ]
                        },
                        "quality_params": [
                            {
                                "name": "Cross-group disintermediate function",
                                "value": "Cross-group disintermediate function"
                            }
                        ],
                        "status": "active",
                        "attachments": null,
                        "key": "variant",
                        "productUuid": "Z1FaZGM="
                    },
                    "buyer_hub": {
                        "value": "BuyerHub - 2235",
                        "id": 2235,
                        "uuid": "WFhYYw==",
                        "address": "Hazira",
                        "location_code": "2010",
                        "key": "buyer_hub",
                        "meta": {
                            "address": "Hazira",
                            "location_code": "2010"
                        }
                    },
                    "meta_data": {
                        "symbol": "NO",
                        "postfix": "NO"
                    },
                    "savings_with_strategy": {
                        "savings": [
                            {
                                "savings_amount": {
                                    "value": "826",
                                    "configuration": {
                                        "unit_type": "NO",
                                        "prefix": "₹",
                                        "suffix": "/NO"
                                    }
                                },
                                "savings_percent": {
                                    "value": "98.8",
                                    "configuration": {
                                        "suffix": "%"
                                    }
                                },
                                "reference_on_key_attribute": "price",
                                "reference_strategy_key": "historical_price"
                            },
                            {
                                "savings_amount": {
                                    "value": "826",
                                    "configuration": {
                                        "unit_type": "NO",
                                        "prefix": "₹",
                                        "suffix": "/NO"
                                    }
                                },
                                "savings_percent": {
                                    "value": "98.8",
                                    "configuration": {
                                        "suffix": "%"
                                    }
                                },
                                "reference_on_key_attribute": "price",
                                "reference_strategy_key": "budget"
                            }
                        ]
                    },
                    "rank": {
                        "value": "2",
                        "key": "rank",
                        "isBestBidder": false
                    },
                    "best_ranking_widget": {
                        "key": "best_ranking_widget",
                        "value": "10.03",
                        "isBestBidder": false,
                        "postfix": "/NO",
                        "prefix": "₹",
                        "currencyCode": "INR",
                        "precision": 2
                    },
                    "historical_price": {
                        "value": 836,
                        "last_valid_price": null,
                        "validations": [],
                        "savings": null,
                        "configuration": {
                            "unit_type": "NO",
                            "prefix": "₹",
                            "suffix": "/NO"
                        },
                        "savingVals": {
                            "historical_price": {
                                "savingsAmount": {
                                    "value": "826",
                                    "configuration": {
                                        "unit_type": "NO",
                                        "prefix": "₹",
                                        "suffix": "/NO"
                                    }
                                },
                                "savingsPercent": {
                                    "value": "98.8",
                                    "configuration": {
                                        "suffix": "%"
                                    }
                                }
                            },
                            "budget": {
                                "savingsAmount": {
                                    "value": "826",
                                    "configuration": {
                                        "unit_type": "NO",
                                        "prefix": "₹",
                                        "suffix": "/NO"
                                    }
                                },
                                "savingsPercent": {
                                    "value": "98.8",
                                    "configuration": {
                                        "suffix": "%"
                                    }
                                }
                            },
                            "tradeProductUuid": "WmtaWGM="
                        },
                        "key": "price",
                        "postfix": "/NO",
                        "prefix": "₹",
                        "currencyCode": "INR",
                        "precision": 2
                    }
                }
            ]
        },
        "global_price_components": {
            "global_data": {
                "amns_incoterms": {
                    "value": "ASW",
                    "uuid": "ZGNYZw=="
                },
                "delivery_for_incoterms_custom": {
                    "key": "delivery_for_incoterms_custom",
                    "label": "Destination for Incoterms",
                    "value": ",m zdflm sd",
                    "calculatedValue": ",m zdflm sd",
                    "displayCalculatedValue": ",m zdflm sd",
                    "type": "string",
                    "multiplier": 1,
                    "precision": 2,
                    "mode": "write"
                },
                "sum_total": {
                    "key": "sum_total",
                    "label": "Sum Total",
                    "value": "485.00",
                    "currencyCode": "INR",
                    "calculatedValue": 970,
                    "displayCalculatedValue": "₹ 970",
                    "type": "formula",
                    "expr": "SUM(total_amount)",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "read"
                },
                "amns_basic_total": {
                    "key": "amns_basic_total",
                    "label": "Basic Total",
                    "value": "485.00",
                    "currencyCode": "INR",
                    "calculatedValue": 970,
                    "displayCalculatedValue": "₹ 970",
                    "type": "formula",
                    "expr": "sum_total",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "read"
                },
                "amns_additional_cost": {
                    "key": "amns_additional_cost",
                    "label": "Additional Charges",
                    "currencyCode": "INR",
                    "type": "number",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "write"
                },
                "fob_cif_cfr_charges": {
                    "key": "fob_cif_cfr_charges",
                    "label": "FOB/CIF/CFR Charges",
                    "currencyCode": "INR",
                    "type": "number",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "write"
                },
                "amns_packaging_and_forwarding_percentage": {
                    "key": "amns_packaging_and_forwarding_percentage",
                    "label": "Packaging and Forwarding Percentage",
                    "calculatedValue": "",
                    "type": "number",
                    "multiplier": 1,
                    "precision": 2,
                    "postfix": "%",
                    "mode": "write"
                },
                "amns_packaging_and_forwarding": {
                    "key": "amns_packaging_and_forwarding",
                    "label": "Packaging and Forwarding Amount",
                    "value": "0.00",
                    "currencyCode": "INR",
                    "type": "formula",
                    "expr": "(sum_total+amns_additional_cost)*amns_packaging_and_forwarding_percentage/100",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "read"
                },
                "amns_total_in_currency": {
                    "key": "amns_total_in_currency",
                    "label": "Total in Foreign Currency",
                    "value": "485.00",
                    "currencyCode": "INR",
                    "calculatedValue": 970,
                    "displayCalculatedValue": "₹ 970",
                    "type": "formula",
                    "expr": "sum_total+amns_additional_cost+amns_packaging_and_forwarding+fob_cif_cfr_charges",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "read"
                },
                "amns_total_in_inr_currency": {
                    "key": "amns_total_in_inr_currency",
                    "label": "Total in INR Currency",
                    "value": "485.00",
                    "currencyCode": "INR",
                    "calculatedValue": 970,
                    "displayCalculatedValue": "₹ 970",
                    "type": "formula",
                    "expr": "amns_total_in_currency",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "read"
                },
                "amns_vendor_category": {
                    "value": "Service Provider",
                    "uuid": "cFpnYw=="
                },
                "amns_overseas_freight": {
                    "key": "amns_overseas_freight",
                    "label": "Overseas Freight",
                    "value": "0.00",
                    "currencyCode": "INR",
                    "type": "number",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "write"
                },
                "amns_insurance_amount": {
                    "key": "amns_insurance_amount",
                    "label": "Insurance Amount",
                    "value": "0.00",
                    "currencyCode": "INR",
                    "type": "percent_and_amount",
                    "expr": "(sum_total+amns_additional_cost+amns_packaging_and_forwarding+amns_overseas_freight+fob_cif_cfr_charges)/100",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "write",
                    "percentageValue": "0.00"
                },
                "amns_custom_duty_percentage": {
                    "key": "amns_custom_duty_percentage",
                    "label": "Customs Duty Percentage",
                    "calculatedValue": "",
                    "type": "number",
                    "multiplier": 1,
                    "precision": 2,
                    "postfix": "%",
                    "mode": "write"
                },
                "amns_custom_duty_amount": {
                    "key": "amns_custom_duty_amount",
                    "label": "Customs Duty Amount",
                    "value": "0.00",
                    "currencyCode": "INR",
                    "type": "formula",
                    "expr": "(sum_total+amns_additional_cost+amns_packaging_and_forwarding+amns_overseas_freight+amns_insurance_amount+fob_cif_cfr_charges)*amns_custom_duty_percentage/100",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "read"
                },
                "amns_cess_percentage": {
                    "key": "amns_cess_percentage",
                    "label": "Cess on Overall Duty Percent",
                    "calculatedValue": "",
                    "type": "number",
                    "multiplier": 1,
                    "precision": 2,
                    "postfix": "%",
                    "mode": "write"
                },
                "amns_cess_amount": {
                    "key": "amns_cess_amount",
                    "label": "Cess on Overall Duty Amount",
                    "value": "0.00",
                    "currencyCode": "INR",
                    "type": "formula",
                    "expr": "amns_cess_percentage*amns_custom_duty_amount/100",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "read"
                },
                "amns_gst_percentage": {
                    "key": "amns_gst_percentage",
                    "label": "Global GST Percentage",
                    "calculatedValue": "",
                    "type": "number",
                    "multiplier": 1,
                    "precision": 2,
                    "postfix": "%",
                    "mode": "hidden"
                },
                "amns_gst_amount": {
                    "key": "amns_gst_amount",
                    "label": "GST amount",
                    "value": "20.15",
                    "currencyCode": "INR",
                    "calculatedValue": 40.3,
                    "displayCalculatedValue": "₹ 40.3",
                    "type": "formula",
                    "expr": "amns_gst_percentage*(sum_total)/100+0.18*(amns_additional_cost+amns_packaging_and_forwarding+amns_overseas_freight+amns_insurance_amount+amns_custom_duty_amount+amns_cess_amount+fob_cif_cfr_charges)+SUM(line_gst_amount)",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "read"
                },
                "transit_insurance_amount": {
                    "key": "transit_insurance_amount",
                    "label": "Transit Insurance amount",
                    "currencyCode": "INR",
                    "type": "number",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "read"
                },
                "incoming_domestic_freight_custom": {
                    "key": "incoming_domestic_freight_custom",
                    "label": "Incoming Domestic Freight",
                    "value": "30.00",
                    "currencyCode": "INR",
                    "calculatedValue": 4,
                    "displayCalculatedValue": "₹ 4",
                    "type": "percent_and_amount",
                    "expr": "(sum_total+amns_additional_cost)/100",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "write",
                    "percentageValue": "0.82"
                },
                "outgoing_domestic_freight_custom": {
                    "key": "outgoing_domestic_freight_custom",
                    "label": "Outgoing Domestic Freight",
                    "value": "0.00",
                    "currencyCode": "INR",
                    "type": "percent_and_amount",
                    "expr": "(sum_total+amns_additional_cost)/100",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "write",
                    "percentageValue": "0.00"
                },
                "fix_loading_factor_custom": {
                    "key": "fix_loading_factor_custom",
                    "label": "Fix Loading Factor",
                    "currencyCode": "INR",
                    "type": "number",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "write"
                },
                "amns_variable_loading_percentage": {
                    "key": "amns_variable_loading_percentage",
                    "label": "Variable Loading Percentage",
                    "calculatedValue": "",
                    "type": "number",
                    "multiplier": 1,
                    "precision": 2,
                    "postfix": "%",
                    "mode": "write"
                },
                "amns_variable_loading_amount": {
                    "key": "amns_variable_loading_amount",
                    "label": "AMNS Variable Loading Amount",
                    "value": "0.00",
                    "currencyCode": "INR",
                    "type": "formula",
                    "expr": "(sum_total+amns_additional_cost+amns_packaging_and_forwarding+amns_overseas_freight+amns_insurance_amount+fix_loading_factor_custom+amns_custom_duty_amount+amns_cess_amount+amns_gst_amount+fob_cif_cfr_charges)*amns_variable_loading_percentage/100",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "read"
                },
                "cha_charges": {
                    "key": "cha_charges",
                    "label": "CHA Charges",
                    "value": "0.00",
                    "currencyCode": "INR",
                    "type": "percent_and_amount",
                    "expr": "(sum_total+amns_additional_cost)/100",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "write",
                    "percentageValue": "0.00"
                },
                "port_handling_charges": {
                    "key": "port_handling_charges",
                    "label": "Port Handling Charges",
                    "value": "0.00",
                    "currencyCode": "INR",
                    "type": "percent_and_amount",
                    "expr": "(sum_total+amns_additional_cost)/100",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "write",
                    "percentageValue": "0.00"
                },
                "warranty_terms": {
                    "value": "12 months from Supply and 18 months from Installation\n\n",
                    "uuid": "ZE5naw=="
                },
                "amns_payment_terms": {
                    "value": "AB09",
                    "uuid": "cFFaWkQ="
                },
                "finance_cost_loading_factor_custom": {
                    "key": "finance_cost_loading_factor_custom",
                    "label": "Finance Cost Loading Factor",
                    "value": "0.00",
                    "currencyCode": "INR",
                    "type": "percent_and_amount",
                    "expr": "(sum_total+amns_additional_cost+amns_packaging_and_forwarding+fob_cif_cfr_charges+amns_variable_loading_amount+fix_loading_factor_custom+amns_overseas_freight+amns_insurance_amount+amns_custom_duty_amount+amns_cess_amount+incoming_domestic_freight_custom+outgoing_domestic_freight_custom+port_handling_charges+cha_charges+amns_gst_amount)/100",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "write",
                    "percentageValue": "0.00"
                },
                "amns_performance_bank_guarantee": {
                    "key": "amns_performance_bank_guarantee",
                    "label": "Performance Bank Guarantee",
                    "calculatedValue": "",
                    "type": "string",
                    "multiplier": 1,
                    "precision": 2,
                    "mode": "write"
                },
                "amns_advanced_bank_guarantee": {
                    "key": "amns_advanced_bank_guarantee",
                    "label": "Advance Bank Guarantee",
                    "calculatedValue": "",
                    "type": "string",
                    "multiplier": 1,
                    "precision": 2,
                    "mode": "write"
                },
                "validity_of_quotation_custom": {
                    "key": "validity_of_quotation_custom",
                    "label": "Validity of Quotation",
                    "value": "1737892800",
                    "calculatedValue": "1737892800",
                    "displayCalculatedValue": "1737892800",
                    "type": "date",
                    "multiplier": 1,
                    "precision": 2,
                    "mode": "write"
                },
                "amns_ld_clause": {},
                "amns_total_evaluated_price": {
                    "key": "amns_total_evaluated_price",
                    "label": "Total Evaluated Price",
                    "value": "509.15",
                    "currencyCode": "INR",
                    "calculatedValue": 1014.3,
                    "displayCalculatedValue": "₹ 1014.3",
                    "type": "formula",
                    "expr": "(sum_total+amns_additional_cost+amns_packaging_and_forwarding+fob_cif_cfr_charges+amns_variable_loading_amount+fix_loading_factor_custom+amns_overseas_freight+amns_insurance_amount+amns_custom_duty_amount+amns_cess_amount+incoming_domestic_freight_custom+outgoing_domestic_freight_custom+port_handling_charges+cha_charges+finance_cost_loading_factor_custom+amns_gst_amount)",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "read"
                },
                "amns_less_gst": {
                    "key": "amns_less_gst",
                    "label": "Less GST",
                    "value": "20.15",
                    "currencyCode": "INR",
                    "calculatedValue": 40.3,
                    "displayCalculatedValue": "₹ 40.3",
                    "type": "formula",
                    "expr": "amns_gst_amount",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "read"
                },
                "amns_cost_without_loading": {
                    "key": "amns_cost_without_loading",
                    "label": "Cost To AMNS",
                    "value": "489.00",
                    "currencyCode": "INR",
                    "calculatedValue": 974,
                    "displayCalculatedValue": "₹ 974",
                    "type": "formula",
                    "expr": "amns_total_evaluated_price-amns_less_gst-fix_loading_factor_custom",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "read"
                },
                "amns_cost_to_amns": {
                    "key": "amns_cost_to_amns",
                    "label": "Cost To AMNS With Loading",
                    "value": "489.00",
                    "currencyCode": "INR",
                    "calculatedValue": 974,
                    "displayCalculatedValue": "₹ 974",
                    "type": "formula",
                    "expr": "amns_total_evaluated_price-amns_less_gst",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "read"
                },
                "overall_total": {
                    "key": "overall_total",
                    "label": "Overall Total",
                    "value": "485.00",
                    "currencyCode": "INR",
                    "calculatedValue": 970,
                    "displayCalculatedValue": "₹ 970",
                    "type": "formula",
                    "expr": "sum_total+amns_additional_cost+amns_packaging_and_forwarding+fob_cif_cfr_charges",
                    "prefix": "₹",
                    "multiplier": 1,
                    "group": "amount",
                    "precision": 2,
                    "mode": "read"
                },
                "participant_attachment": {
                    "key": "participant_attachment",
                    "label": "Attachment",
                    "value": [],
                    "type": "attachment",
                    "multiplier": 1,
                    "group": "attachment",
                    "precision": 2,
                    "mode": "write"
                }
            }
        }
    },
    "remarks": ""

    });
      const response3 = await fetch(url3, {
      method: 'POST',
      headers,
      body: payload
    });
    if (response3.status !== 200) {
      throw new Error(`POST request failed: HTTP ${response3.status} – ${response3.statusText}`);
    }
    // submission time 
    const end_time = Date.now(); // ms
    const bid_end_time = Math.floor(end_time / 1000); // seconds
    console.log("bid_end_time", bid_end_time);
    const final_bid_end_time = bid_end_time+6;
    console.log("final_bid_end_time" , final_bid_end_time)

    const payload1 = JSON.stringify({
      increase_auction_time: final_bid_end_time,
      extend_rfq_time: false
    });

    const url4 = `${BASE_URL}trade/${tech_uuid}`;

    const response4 = await fetch(url4, {
      method: 'PATCH',
      headers,
      body: payload1
    });

    if (response4.status !== 200) {
      throw new Error(`PATCH request failed: HTTP ${response4.status} – ${response4.statusText}`);
    }

    const payload2 = JSON.stringify({
      increase_auction_time: final_bid_end_time,
      extend_rfq_time: false
    });

    const url5 = `${BASE_URL}trade/${rfq_uuid}`;

    const response5 = await fetch(url5, {
      method: 'PATCH',
      headers,
      body: payload2
    });

    if (response5.status !== 200) {
      throw new Error(`PATCH request failed: HTTP ${response5.status} – ${response5.statusText}`);
    }

    return [RFX_id , title , rfq_uuid];
    } catch (err) {
    console.error('Error in fetch_eventCreation:', err);
    throw err; 
  }
}

export async function priceCapBeforeBid(){
  var [RFX_id , title , event_uuid , rfq_uuid]  = await eventCreationAPI();
  const clientUser = USERS("client");
  
  const headers = await login(clientUser.USER_MOBILE, clientUser.OTP);
  const url =
    `${BASE_URL}v1/trade/${rfq_uuid}/schema?response_type=template&additional_fields=order_details`; 
  const fetch = (await import('node-fetch')).default;
   try {

    const res = await fetch(url, { method: 'GET', headers });

    if (res.status !== 200)  {
      throw new Error(`GET request failed: HTTP ${res.status} – ${res.statusText}`);
    }
    const data = await res.json();
    const product1 = data.sheets.inline_components.data.default[0].product.trade_product_uuid;
    const product2 = data.sheets.inline_components.data.default[1].product.trade_product_uuid;

    console.log('Product1_uuid', product1);
    console.log('Product2_uuid', product2);

    const url1 =`${BASE_URL}trade/${rfq_uuid}/update_vendor_validations`; 
  
    const payload = JSON.stringify({
    "productwise_vendor_validations": {
        [product1]: {
            "ZFpRcA==": 40
        },
        [product2]: {
            "ZFpRcA==": 40
        }
    }
    })
    const response1 = await fetch(url1, {
    method: 'PATCH',
    headers,
    body: payload
  });
    if (response1.status !== 200) {
    throw new Error(`PATCH request failed: HTTP ${response1.status} – ${response1.statusText}`);
  }
  return [RFX_id , title];
  } catch (err) {
    console.error('Price cap Fetch failed:', err);
  }
}

export async function submissionTimeExpireAPI() {
  const [RFX_id, title,tech_uuid, rfq_uuid] = await vendorBidAPI();
  const clientUser = USERS("client");
  const headers = await login(clientUser.USER_MOBILE, clientUser.OTP);
  const fetch = (await import('node-fetch')).default;

  try {
    const end_time = Date.now(); // ms
    const bid_end_time = Math.floor(end_time / 1000); // seconds
    console.log("bid_end_time", bid_end_time);
    const final_bid_end_time = bid_end_time+4;
    console.log("final_bid_end_time" , final_bid_end_time)

    const payload = JSON.stringify({
      increase_auction_time: final_bid_end_time,
      extend_rfq_time: false
    });

    const url = `${BASE_URL}trade/${tech_uuid}`;

    const response1 = await fetch(url, {
      method: 'PATCH',
      headers,
      body: payload
    });

    if (response1.status !== 200) {
      throw new Error(`PATCH request failed: HTTP ${response1.status} – ${response1.statusText}`);
    }

    const payload1 = JSON.stringify({
      increase_auction_time: final_bid_end_time,
      extend_rfq_time: false
    });

    const url1 = `${BASE_URL}trade/${rfq_uuid}`;

    const response2 = await fetch(url1, {
      method: 'PATCH',
      headers,
      body: payload1
    });

    if (response2.status !== 200) {
      throw new Error(`PATCH request failed: HTTP ${response2.status} – ${response2.statusText}`);
    }
    return [RFX_id, title,tech_uuid, rfq_uuid]
  } catch (err) {
    console.error('submissionTimeExpireAPI failed:', err);
    throw err; 
  }
}

export async function bestOfferAPI() {
  const [RFX_id, title,tech_uuid, rfq_uuid] = await submissionTimeExpireAPI();
  const clientUser = USERS("client");
  const headers = await login(clientUser.USER_MOBILE, clientUser.OTP);
  const fetch = (await import('node-fetch')).default;
  const url = `${BASE_URL}trade/${rfq_uuid}`;

  try {
    // Get current time in milliseconds
    let now = Date.now();
    // Add 20 minutes (20* 60 * 1000 milliseconds)
    let futureTime = Math.floor((now + 20 * 60 * 1000) / 1000); // Convert to seconds
    console.log("Future timestamp (now + 20 mins):", futureTime);

    const payload = JSON.stringify({
    "end_time": futureTime,
    "end_time_applicable_vendor_uuids": [
        "ZFpRcA=="
    ],
    "end_time_type": "request_for_best_price",
    "remarks": ""
});

    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: payload
    });

    if (response.status !== 200) {
      throw new Error(`PATCH request failed: HTTP ${response.status} – ${response.statusText}`);
    }
    return [RFX_id, title]
  } catch (err) {
    console.error('submissionTimeExpireAPI failed:', err);
    throw err; 
  }
}









