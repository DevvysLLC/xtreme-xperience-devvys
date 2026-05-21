## cart totals mismatch
### Expectation
- line item id: 1741 subtotal should be
  - price + houseServiceChargeTotal
  - 459 + 12.5 = 471.50
  - actual subtotal is 431.5

### add items payload
```json
{
    "lineItems": [
        {
            "id": 489,
            "type": "Event",
            "quantity": 1,
            "scheduleId": 260867,
            "rateId": 1,
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
    "id": "5eebf4b6-4dbf-41f6-9f50-9673702c80f7",
    "orderId": null,
    "status": "Active",
    "currency": "US Dollars",
    "createdDate": "2026-02-19T15:03:34+00:00",
    "expiryDate": "2026-02-19T15:21:19.8827471+00:00",
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
        "sortOrder": 29
      }
    ],
    "taxes": [],
    "contacts": [],
    "metadata": null,
    "formResponseIds": null,
    "coupons": [],
    "lineItems": [
      {
        "id": 1741,
        "productId": 489,
        "type": "Event",
        "scheduleId": 260867,
        "rateId": 1,
        "rateType": "Participant",
        "quantity": 1,
        "price": 459,
        "discountAmount": 0,
        "subTotal": 431.5,
        "taxTotal": 0,
        "houseServiceChargeTotal": 12.5,
        "houseServiceCharges": [
          {
            "id": 15,
            "name": "Maintenance & Service Fee (T1)",
            "amount": 12.5,
            "sortOrder": 29
          }
        ],
        "taxes": [],
        "discounts": []
      },
      {
        "id": 1742,
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
