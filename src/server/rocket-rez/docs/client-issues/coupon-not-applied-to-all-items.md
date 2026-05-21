## coupon not applied to all cart line items
### Expectation
- "xxinternalzero" is applied to all line items in the cart
- Cart total is zero

### add items payload
```json
{
    "lineItems": [
        {
            "id": 489,
            "type": "Event",
            "quantity": 1,
            "scheduleId": 260827,
            "rateId": 3,
            "rateType": "Participant"
        },
        {
            "id": 55,
            "type": "Retail",
            "quantity": 1
        }
    ]
}
```

### add items response

```json
{
  "data": {
    "id": "75681de0-c967-4b3f-95ec-dcdeeca10ae8",
    "orderId": null,
    "status": "Active",
    "currency": "US Dollars",
    "createdDate": "2026-02-19T14:23:39+00:00",
    "expiryDate": "2026-02-19T14:48:56.5365089+00:00",
    "discountTotal": 0,
    "subTotal": 458,
    "variableFeeTotal": 8.7,
    "taxTotal": 0,
    "total": 479.2,
    "houseServiceCharges": [
      {
        "id": 15,
        "name": "Maintenance & Service Fee (T1)",
        "amount": 12.5,
        "sortOrder": 16
      }
    ],
    "taxes": [],
    "contacts": [],
    "metadata": null,
    "formResponseIds": null,
    "coupons": [],
    "lineItems": [
      {
        "id": 1735,
        "productId": 489,
        "type": "Event",
        "scheduleId": 260827,
        "rateId": 3,
        "rateType": "Participant",
        "quantity": 1,
        "price": 419,
        "discountAmount": 0,
        "subTotal": 431.5,
        "taxTotal": 0,
        "houseServiceChargeTotal": 12.5,
        "houseServiceCharges": [
          {
            "id": 15,
            "name": "Maintenance & Service Fee (T1)",
            "amount": 12.5,
            "sortOrder": 16
          }
        ],
        "taxes": [],
        "discounts": []
      },
      {
        "id": 1736,
        "productId": 55,
        "type": "Retail",
        "scheduleId": null,
        "rateId": null,
        "rateType": null,
        "quantity": 1,
        "price": 39,
        "discountAmount": 0,
        "subTotal": 39,
        "taxTotal": 0,
        "houseServiceChargeTotal": 0,
        "houseServiceCharges": [],
        "taxes": [],
        "discounts": []
      }
    ]
  },
  "statusCode": "OK",
  "rawContent": null,
  "errorMessage": null
}
```

### add coupon payload

```json
{
  "code": "xxinternalzero"
}
```

### add coupon response

```json
{
  "data": {
    "id": "75681de0-c967-4b3f-95ec-dcdeeca10ae8",
    "orderId": null,
    "status": "Active",
    "currency": "US Dollars",
    "createdDate": "2026-02-19T14:23:39+00:00",
    "expiryDate": "2026-02-19T14:53:35.1694903+00:00",
    "discountTotal": 39,
    "subTotal": 419,
    "variableFeeTotal": 7.98,
    "taxTotal": 0,
    "total": 439.48,
    "houseServiceCharges": [
      {
        "id": 15,
        "name": "Maintenance & Service Fee (T1)",
        "amount": 12.5,
        "sortOrder": 16
      }
    ],
    "taxes": [],
    "contacts": [],
    "metadata": null,
    "formResponseIds": null,
    "coupons": [
      {
        "id": 25,
        "code": "xxinternalzero",
        "serial": null,
        "description": "for the marketing department testing",
        "scope": "PerItem",
        "type": "Percentage",
        "value": 100,
        "total": 39,
        "lineItemDiscounts": [
          {
            "lineItemId": 1736,
            "discountAmount": 39
          }
        ]
      }
    ],
    "lineItems": [
      {
        "id": 1735,
        "productId": 489,
        "type": "Event",
        "scheduleId": 260827,
        "rateId": 3,
        "rateType": "Participant",
        "quantity": 1,
        "price": 419,
        "discountAmount": 0,
        "subTotal": 431.5,
        "taxTotal": 0,
        "houseServiceChargeTotal": 12.5,
        "houseServiceCharges": [
          {
            "id": 15,
            "name": "Maintenance & Service Fee (T1)",
            "amount": 12.5,
            "sortOrder": 16
          }
        ],
        "taxes": [],
        "discounts": []
      },
      {
        "id": 1736,
        "productId": 55,
        "type": "Retail",
        "scheduleId": null,
        "rateId": null,
        "rateType": null,
        "quantity": 1,
        "price": 39,
        "discountAmount": 39,
        "subTotal": 0,
        "taxTotal": 0,
        "houseServiceChargeTotal": 0,
        "houseServiceCharges": [],
        "taxes": [],
        "discounts": [
          {
            "couponId": 25,
            "amount": 39
          }
        ]
      }
    ]
  },
  "statusCode": "OK",
  "rawContent": null,
  "errorMessage": null
}
```
