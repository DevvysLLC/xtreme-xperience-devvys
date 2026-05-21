# map cart discounts to lineItems:
- review src/components/global-cart/components/item
- review src/components/core-rocketrez-price
- review json, ensure discounts are accurately rendered
  - if discountAmount > 0
    - render the subTotal instead of price
    - render the price as compareAtPrice
```json
[
  {
    "id": 1365,
    "productId": 35,
    "type": "Retail",
    "scheduleId": null,
    "rateId": null,
    "rateType": null,
    "quantity": 1,
    "price": 87,
    "discountAmount": 25,
    "subTotal": 62,
    "taxTotal": 0,
    "discounts": [
      {
        "couponId": 6,
        "amount": 25
      }
    ]
  }
]
```
