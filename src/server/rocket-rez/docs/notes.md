## If I want to get all available times to drive a Lambo in Chicago for the next event, how do I get that?

1.  **GET Products**
    - (this returns all their products and events that exist in the Rocket Rez platform for Xtreme Xperience)
    - That returns the 3 events set up in Chicago in 2026 (they are labeled ‘Autobahn Country Club’)
    - Event ID’s 477,478,479
    - _Note_ - There’s no ‘location’ tagged to the events. But Xtreme Xperience usually includes the name of the location in the name of the product.
    - _Note_ - I’m only able to determine that the events are in the future based on the name of the event including ‘2026’

2.  **GET Event schedules** (passing in the event ID[s] returned in step 1)
    - This will return the event schedules for the events gathered in step 1
    - You’ll notice that nested in the schedules array there are seat types for the various cars and prices that Xtreme Xperience has set up. This includes seat types for the Lambo:

```json
{
  "id": 3704,
  "name": "Lamborghini ",
  "capacity": 2,
  "reserved": 0,
  "available": 2,
  "color": "Black",
  "rates": [
    {
      "id": 3,
      "name": "Lamborghini Huracán | Online Price",
      "category": "Prebook",
      "rateTypes": [
        {
          "type": "Participant",
          "defaultPrice": 439.0,
          "overridePrice": null,
          "dynamicPrice": null,
          "remainingQuantity": null
        }
      ]
    },
    {
      "id": 24,
      "name": "NA - Lamborghini Huracán | Podium Package | Online Price ",
      "category": "Podium Package ",
      "rateTypes": [
        {
          "type": "Participant",
          "defaultPrice": 0.0,
          "overridePrice": null,
          "dynamicPrice": null,
          "remainingQuantity": null
        }
      ]
    },
    {
      "id": 32,
      "name": "NA - Lamborghini Huracán | Italian Legends |  Online Price ",
      "category": "Italian Legends",
      "rateTypes": [
        {
          "type": "Participant",
          "defaultPrice": 0.0,
          "overridePrice": null,
          "dynamicPrice": null,
          "remainingQuantity": null
        }
      ]
    },
    {
      "id": 39,
      "name": "NA - Drive the Fleet | Lamborghini Huracán | Online Price",
      "category": "Prebook",
      "rateTypes": [
        {
          "type": "Participant",
          "defaultPrice": 0.0,
          "overridePrice": null,
          "dynamicPrice": null,
          "remainingQuantity": null
        }
      ]
    },
    {
      "id": 93,
      "name": "Lamborghini Huracán | At-Track",
      "category": "At-Track",
      "rateTypes": [
        {
          "type": "Participant",
          "defaultPrice": 439.0,
          "overridePrice": null,
          "dynamicPrice": null,
          "remainingQuantity": null
        }
      ]
    },
    {
      "id": 225,
      "name": "Lamborghini Huracán | Third Party Price",
      "category": "Prebook",
      "rateTypes": [
        {
          "type": "Participant",
          "defaultPrice": 508.0,
          "overridePrice": null,
          "dynamicPrice": null,
          "remainingQuantity": null
        }
      ]
    },
    {
      "id": 235,
      "name": "Lamborghini Huracán | Podium Package | Third Party Price ",
      "category": "Podium Package ",
      "rateTypes": [
        {
          "type": "Participant",
          "defaultPrice": 0.0,
          "overridePrice": null,
          "dynamicPrice": null,
          "remainingQuantity": null
        }
      ]
    },
    {
      "id": 237,
      "name": "Lamborghini Huracán | Italian Legends |  Third Party Price ",
      "category": "Italian Legends",
      "rateTypes": [
        {
          "type": "Participant",
          "defaultPrice": 0.0,
          "overridePrice": null,
          "dynamicPrice": null,
          "remainingQuantity": null
        }
      ]
    },
    {
      "id": 280,
      "name": "Lamborghini Huracán Ride Along | Online Price",
      "category": "Prebook",
      "rateTypes": [
        {
          "type": "Participant",
          "defaultPrice": 199.0,
          "overridePrice": null,
          "dynamicPrice": null,
          "remainingQuantity": null
        }
      ]
    }
  ]
}
```

- _Note_: You’ll need to repeat this step, for each event in Chicago to pull all available times to drive a Lambo in Chicago.

## If I want to get all available times to drive a Lambo regardless of location, how do I get that?

In short you’ll need to pull all events using the GET Products endpoint. Then check the event schedules for each of those events using the GET event schedules end point.

1.  **GET Products**
2.  Record all event ID’s
3.  **GET Event schedules** (for each event ID returned in step 1)
4.  Search for the next schedule which contains a ‘seat type’ for the Lambo

## If I want to get all available cars in Chicago next Saturday, regardless of time, how do I get that? Same question but for all days of the event?

Basically the same as the last question, you’ll need to pull every event, search for the events in Chicago. Then pull the schedule for every event in Chicago. This will return each day of the event that has cars available, including next Saturday.

You can pass the date range into the GET event schedules endpoint in order to filter for just Saturday or the whole event.

## If I want to get all cars available on a particular weekend in the south east region, how do I get that?

1.  **GET products** for (all events)
2.  Make note of the ones located in the south east region
3.  **GET event schedules** for all of those events for a particular weekend

## Cars Selection Example

```
{
    "currencyCode": "USD",
    "rates": [
        {
            "id": 190,
            "name": "Ferrari 296 GTB",
            "summary": "<div style=\"font-family: Arial, sans-serif; font-size:10pt; line-height:1.3;\"><div>Starting at <span style=\"color: rgb(119, 119, 119); font-family: Arial, sans-serif; font-size: 13.3333px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration: line-through; display: inline !important; float: none;\">$589</span> <span style=\"color:#d14841; font-weight:700;\">$489</span></div></div>",
            "image": {
                "imageUrl": "https://secure.rocket-rez.com/RocketAssets/asset/86/9/False/True/d0b50aa0-3d99-4113-b233-6eedc4da6abe.png",
                "sortOrder": 0
            },
            "prices": [
                {
                    "ratePriceTypeId": 1,
                    "ratePriceTypeName": "Participant",
                    "price": 589.00000000
                }
            ],
            "minimumQuantity": 1,
            "sortOrder": 1,
            "isSoldOut": false,
            "hasInsufficientAvailability": false,
            "isAvailable": true
        },
        {
            "id": 3,
            "name": "Lamborghini Huracán",
            "summary": "<div style=\"font-family: Arial, sans-serif; font-size:10pt; line-height:1.3;\"><div>Starting at <span style=\"color: rgb(119, 119, 119); font-family: Arial, sans-serif; font-size: 13.3333px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration: line-through; display: inline !important; float: none;\">$479</span> <span style=\"color:#d14841; font-weight:700;\">$379</span></div></div>",
            "image": {
                "imageUrl": "https://secure.rocket-rez.com/RocketAssets/asset/86/9/False/True/3d9d8c21-fef4-4cf9-b030-4cc9532ed362.png",
                "sortOrder": 0
            },
            "prices": [
                {
                    "ratePriceTypeId": 1,
                    "ratePriceTypeName": "Participant",
                    "price": 479.00000000
                }
            ],
            "minimumQuantity": 1,
            "sortOrder": 2,
            "isSoldOut": false,
            "hasInsufficientAvailability": false,
            "isAvailable": true
        },
        {
            "id": 1,
            "name": "Ferrari 488 GTB",
            "summary": "<div style=\"font-family: Arial, sans-serif; font-size:10pt; line-height:1.3;\"><div>Starting at <span style=\"color: rgb(119, 119, 119); font-family: Arial, sans-serif; font-size: 13.3333px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration: line-through; display: inline !important; float: none;\">$479</span> <span style=\"color:#d14841; font-weight:700;\">$379</span></div></div>",
            "image": {
                "imageUrl": "https://secure.rocket-rez.com/RocketAssets/asset/86/9/False/True/7821b3b6-9ed6-4a11-b138-654acf690e24.png",
                "sortOrder": 0
            },
            "prices": [
                {
                    "ratePriceTypeId": 1,
                    "ratePriceTypeName": "Participant",
                    "price": 479.00000000
                }
            ],
            "minimumQuantity": 1,
            "sortOrder": 3,
            "isSoldOut": false,
            "hasInsufficientAvailability": false,
            "isAvailable": true
        },
        {
            "id": 219,
            "name": "Porsche 911 GT3",
            "summary": "<div style=\"font-family: Arial, sans-serif; font-size:10pt; line-height:1.3;\"><div>Starting at <span style=\"color: rgb(119, 119, 119); font-family: Arial, sans-serif; font-size: 13.3333px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration: line-through; display: inline !important; float: none;\">$479</span> <span style=\"color:#d14841; font-weight:700;\">$379</span></div></div>",
            "image": {
                "imageUrl": "https://secure.rocket-rez.com/RocketAssets/asset/86/9/False/True/35d12ebf-2d26-4678-94ec-6f035cb6a2de.png",
                "sortOrder": 0
            },
            "prices": [
                {
                    "ratePriceTypeId": 1,
                    "ratePriceTypeName": "Participant",
                    "price": 479.00000000
                }
            ],
            "minimumQuantity": 1,
            "sortOrder": 4,
            "isSoldOut": false,
            "hasInsufficientAvailability": false,
            "isAvailable": true
        },
        {
            "id": 212,
            "name": "Porsche 718 Cayman GT4 RS",
            "summary": "<div style=\"font-family: Arial, sans-serif; font-size:10pt; line-height:1.3;\"><div>Starting at <span style=\"color: rgb(119, 119, 119); font-family: Arial, sans-serif; font-size: 13.3333px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration: line-through; display: inline !important; float: none;\">$389</span> <span style=\"color:#d14841; font-weight:700;\">$289</span></div></div>",
            "image": {
                "imageUrl": "https://secure.rocket-rez.com/RocketAssets/asset/86/9/False/True/9c485a6d-9575-4239-8b26-87d637423352.png",
                "sortOrder": 0
            },
            "prices": [
                {
                    "ratePriceTypeId": 1,
                    "ratePriceTypeName": "Participant",
                    "price": 389.00000000
                }
            ],
            "minimumQuantity": 1,
            "sortOrder": 5,
            "isSoldOut": false,
            "hasInsufficientAvailability": false,
            "isAvailable": true
        },
        {
            "id": 169,
            "name": "Nissan GT-R Premium",
            "summary": "<div style=\"font-family: Arial, sans-serif; font-size:10pt; line-height:1.3;\"><div>Starting at <span style=\"color: rgb(119, 119, 119); font-family: Arial, sans-serif; font-size: 13.3333px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration: line-through; display: inline !important; float: none;\">$339</span> <span style=\"color:#d14841; font-weight:700;\">$239</span></div></div>",
            "image": {
                "imageUrl": "https://secure.rocket-rez.com/RocketAssets/asset/86/9/False/True/0acab931-f4ef-48cd-9d4a-ef64447dec61.png",
                "sortOrder": 0
            },
            "prices": [
                {
                    "ratePriceTypeId": 1,
                    "ratePriceTypeName": "Participant",
                    "price": 339.00000000
                }
            ],
            "minimumQuantity": 1,
            "sortOrder": 6,
            "isSoldOut": false,
            "hasInsufficientAvailability": false,
            "isAvailable": true
        },
        {
            "id": 277,
            "name": "Corvette Z06",
            "summary": "<div style=\"font-family: Arial, sans-serif; font-size:10pt; line-height:1.3;\"><div>Starting at <span style=\"color: rgb(119, 119, 119); font-family: Arial, sans-serif; font-size: 13.3333px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration: line-through; display: inline !important; float: none;\">$389</span> <span style=\"color:#d14841; font-weight:700;\">$289</span></div></div>",
            "image": {
                "imageUrl": "https://secure.rocket-rez.com/RocketAssets/asset/86/9/False/True/aabeeea3-d17c-4a17-9742-a88bd9b3166f.png",
                "sortOrder": 0
            },
            "prices": [
                {
                    "ratePriceTypeId": 1,
                    "ratePriceTypeName": "Participant",
                    "price": 389.00000000
                }
            ],
            "minimumQuantity": 1,
            "sortOrder": 7,
            "isSoldOut": false,
            "hasInsufficientAvailability": false,
            "isAvailable": true
        },
        {
            "id": 17,
            "name": "Charger Hellcat Ride-Along ",
            "summary": "<div style=\"overflow:visible;\"><!-- Header (matches compact style) --><p style=\"display:flex;flex-wrap:wrap;align-items:baseline;gap:3px;line-height:1.05;margin:0 0 4px;max-width:100%;color:#000;\"><span style=\"font-size:clamp(10px,3.0vw,16px);\">Starting at</span> <span style=\"display:inline-flex;white-space:nowrap;font-size:clamp(14px,3.6vw,18px);\">&nbsp;<strong fr-original-style=\"color:#d14841;\" style=\"color: rgb(209, 72, 65); font-weight: 700;\">$79</strong>&nbsp;</span></p><!-- Descriptor --><p style=\"margin:0;line-height:1.15;color:#000;font-size:clamp(8px,2.4vw,10px);white-space:normal;overflow-wrap:anywhere;\">Ride with a pro driver. Seats up to 3.</p></div>",
            "image": {
                "imageUrl": "https://secure.rocket-rez.com/RocketAssets/asset/86/9/False/True/5b96de4a-fc1f-4c67-9428-41bfed0cf3e1.jpg",
                "sortOrder": 0
            },
            "prices": [
                {
                    "ratePriceTypeId": 1,
                    "ratePriceTypeName": "Participant",
                    "price": 79.00000000
                }
            ],
            "minimumQuantity": 1,
            "sortOrder": 8,
            "isSoldOut": false,
            "hasInsufficientAvailability": false,
            "isAvailable": true
        },
        {
            "id": 280,
            "name": "Lamborghini Huracán Ride-Along",
            "summary": "<div style=\"overflow:visible;\"><!-- Header (matches new compact style) --><p style=\"display:flex;flex-wrap:wrap;align-items:baseline;gap:3px;line-height:1.05;margin:0 0 4px;max-width:100%;color:#000;\"><span style=\"font-size:clamp(10px,3.0vw,16px);\">Starting at</span> <span style=\"display:inline-flex;white-space:nowrap;font-size:clamp(14px,3.6vw,18px);\">&nbsp;<strong fr-original-style=\"color:#d14841;\" style=\"color: rgb(209, 72, 65); font-weight: 700;\">$199</strong>&nbsp;</span></p><!-- Short descriptor (same microcopy style as other cards) --><p style=\"margin:0;line-height:1.15;color:#000;font-size:clamp(8px,2.4vw,10px);white-space:normal;overflow-wrap:anywhere;\">Ride with a pro driver</p></div>",
            "image": {
                "imageUrl": "https://secure.rocket-rez.com/RocketAssets/asset/86/9/False/True/6127e3c2-5b64-4855-8b97-5c7023a32ba0.jpg",
                "sortOrder": 0
            },
            "prices": [
                {
                    "ratePriceTypeId": 1,
                    "ratePriceTypeName": "Participant",
                    "price": 259.00000000
                }
            ],
            "minimumQuantity": 1,
            "sortOrder": 9,
            "isSoldOut": false,
            "hasInsufficientAvailability": false,
            "isAvailable": true
        },
        {
            "id": 281,
            "name": "Ferrari 488 GTB Ride-Along",
            "summary": "<div style=\"overflow:visible;\"><!-- Header (matches new compact style) --><p style=\"display:flex;flex-wrap:wrap;align-items:baseline;gap:3px;line-height:1.05;margin:0 0 4px;max-width:100%;color:#000;\"><span style=\"font-size:clamp(10px,3.0vw,16px);\">Starting at</span> <span style=\"display:inline-flex;white-space:nowrap;font-size:clamp(14px,3.6vw,18px);\">&nbsp;<strong fr-original-style=\"color:#d14841;\" style=\"color: rgb(209, 72, 65); font-weight: 700;\">$199</strong>&nbsp;</span></p><!-- Short descriptor (same microcopy style as other cards) --><p style=\"margin:0;line-height:1.15;color:#000;font-size:clamp(8px,2.4vw,10px);white-space:normal;overflow-wrap:anywhere;\">Ride with a pro driver</p></div>",
            "image": {
                "imageUrl": "https://secure.rocket-rez.com/RocketAssets/asset/86/9/False/True/ddbcbaf2-6af2-4c2c-b44b-26fbc7d28cc5.jpg",
                "sortOrder": 0
            },
            "prices": [
                {
                    "ratePriceTypeId": 1,
                    "ratePriceTypeName": "Participant",
                    "price": 259.00000000
                }
            ],
            "minimumQuantity": 1,
            "sortOrder": 10,
            "isSoldOut": false,
            "hasInsufficientAvailability": false,
            "isAvailable": true
        },
        {
            "id": 282,
            "name": "Porsche 911 GT3 (992) Ride-Along",
            "summary": "<div style=\"overflow:visible;\"><!-- Header (matches new compact style) --><p style=\"display:flex;flex-wrap:wrap;align-items:baseline;gap:3px;line-height:1.05;margin:0 0 4px;max-width:100%;color:#000;\"><span style=\"font-size:clamp(10px,3.0vw,16px);\">Starting at</span> <span style=\"display:inline-flex;white-space:nowrap;font-size:clamp(14px,3.6vw,18px);\">&nbsp;<strong style=\"color:#d14841;\">$199</strong>&nbsp;</span></p><!-- Short descriptor (same microcopy style as other cards) --><p style=\"margin:0;line-height:1.15;color:#000;font-size:clamp(8px,2.4vw,10px);white-space:normal;overflow-wrap:anywhere;\">Ride with a pro driver</p></div>",
            "image": {
                "imageUrl": "https://secure.rocket-rez.com/RocketAssets/asset/86/9/False/True/b21c7c8e-c3f8-47c2-8450-290caa38cefa.png",
                "sortOrder": 0
            },
            "prices": [
                {
                    "ratePriceTypeId": 1,
                    "ratePriceTypeName": "Participant",
                    "price": 259.00000000
                }
            ],
            "minimumQuantity": 1,
            "sortOrder": 11,
            "isSoldOut": false,
            "hasInsufficientAvailability": false,
            "isAvailable": true
        },
        {
            "id": 256,
            "name": "Track Attack Package",
            "summary": "<div style=\"font-family: Arial, sans-serif; font-size:10pt; line-height:1.3;\"><div>Starting at <span style=\"color: rgb(119, 119, 119); font-family: Arial, sans-serif; font-size: 13.3333px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration: line-through; display: inline !important; float: none;\">$778</span> <span style=\"color:#d14841; font-weight:700;\">$545</span></div></div>",
            "image": {
                "imageUrl": "https://secure.rocket-rez.com/RocketAssets/asset/86/9/False/True/ec167604-2387-4526-9576-89dca2f9f736.png",
                "sortOrder": 0
            },
            "prices": [
                {
                    "ratePriceTypeId": 1,
                    "ratePriceTypeName": "Participant",
                    "price": 778.00000000
                }
            ],
            "minimumQuantity": 1,
            "sortOrder": 12,
            "isSoldOut": false,
            "hasInsufficientAvailability": false,
            "isAvailable": true
        },
        {
            "id": 222,
            "name": "Porsche GT Package",
            "summary": "<div style=\"font-family: Arial, sans-serif; font-size:10pt; line-height:1.3;\"><div>Starting at <span style=\"color: rgb(119, 119, 119); font-family: Arial, sans-serif; font-size: 13.3333px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration: line-through; display: inline !important; float: none;\">$868</span> <span style=\"color:#d14841; font-weight:700;\">$608</span></div></div>",
            "image": {
                "imageUrl": "https://secure.rocket-rez.com/RocketAssets/asset/86/9/False/True/964c5d94-b51e-4bc3-aaad-33f8a0c1f0a6.png",
                "sortOrder": 0
            },
            "prices": [
                {
                    "ratePriceTypeId": 1,
                    "ratePriceTypeName": "Participant",
                    "price": 868.00000000
                }
            ],
            "minimumQuantity": 1,
            "sortOrder": 13,
            "isSoldOut": false,
            "hasInsufficientAvailability": false,
            "isAvailable": true
        },
        {
            "id": 31,
            "name": "Italian Legends Package",
            "summary": "<div style=\"font-family: Arial, sans-serif; font-size:10pt; line-height:1.3;\"><div>Starting at <span style=\"color: rgb(119, 119, 119); font-family: Arial, sans-serif; font-size: 13.3333px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration: line-through; display: inline !important; float: none;\">$958</span> <span style=\"color:#d14841; font-weight:700;\">$671</span></div></div>",
            "image": {
                "imageUrl": "https://secure.rocket-rez.com/RocketAssets/asset/86/9/False/True/9e9dadd5-2139-4360-8839-0af4281fd0d5.png",
                "sortOrder": 0
            },
            "prices": [
                {
                    "ratePriceTypeId": 1,
                    "ratePriceTypeName": "Participant",
                    "price": 958.00000000
                }
            ],
            "minimumQuantity": 1,
            "sortOrder": 14,
            "isSoldOut": false,
            "hasInsufficientAvailability": false,
            "isAvailable": true
        },
        {
            "id": 302,
            "name": "Podium Package",
            "summary": "<div style=\"font-family: Arial, sans-serif; font-size:10pt; line-height:1.3;\"><div>Starting at <span style=\"color: rgb(119, 119, 119); font-family: Arial, sans-serif; font-size: 13.3333px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration: line-through; display: inline !important; float: none;\">$1437</span> <span style=\"color:#d14841; font-weight:700;\">$1006</span></div></div>",
            "image": {
                "imageUrl": "https://secure.rocket-rez.com/RocketAssets/asset/86/9/False/True/880c1629-e74d-4d51-8733-f4f33b50f129.png",
                "sortOrder": 0
            },
            "prices": [
                {
                    "ratePriceTypeId": 1,
                    "ratePriceTypeName": "Participant",
                    "price": 1437.00000000
                }
            ],
            "minimumQuantity": 1,
            "sortOrder": 15,
            "isSoldOut": false,
            "hasInsufficientAvailability": false,
            "isAvailable": true
        },
        {
            "id": 213,
            "name": "Drive the Fleet ",
            "summary": "<div style=\"font-family: Arial, sans-serif; font-size:10pt; line-height:1.3;\"><div>Starting at <span style=\"color: rgb(119, 119, 119); font-family: Arial, sans-serif; font-size: 13.3333px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration: line-through; display: inline !important; float: none;\">$3580</span> <span style=\"color:#d14841; font-weight:700;\">$2506</span></div></div>",
            "image": {
                "imageUrl": "https://secure.rocket-rez.com/RocketAssets/asset/86/9/False/True/114152e0-7a42-43b5-8460-75ecd847f079.png",
                "sortOrder": 0
            },
            "prices": [
                {
                    "ratePriceTypeId": 1,
                    "ratePriceTypeName": "Participant",
                    "price": 3580.00000000
                }
            ],
            "minimumQuantity": 1,
            "sortOrder": 17,
            "isSoldOut": false,
            "hasInsufficientAvailability": false,
            "isAvailable": true
        },
        {
            "id": 334,
            "name": "Apex Package",
            "summary": "<div style=\"font-family: Arial, sans-serif; font-size:10pt; line-height:1.3;\"><div>Starting at <span style=\"color: rgb(119, 119, 119); font-family: Arial, sans-serif; font-size: 13.3333px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration: line-through; display: inline !important; float: none;\">$2415</span> <span style=\"color:#d14841; font-weight:700;\">$1691</span></div></div>",
            "image": {
                "imageUrl": "https://secure.rocket-rez.com/RocketAssets/asset/86/9/False/True/b43892f5-c6a9-4516-b9c4-03e00d69ea06.png",
                "sortOrder": 0
            },
            "prices": [
                {
                    "ratePriceTypeId": 1,
                    "ratePriceTypeName": "Participant",
                    "price": 2415.00000000
                }
            ],
            "minimumQuantity": 1,
            "sortOrder": 16,
            "isSoldOut": false,
            "hasInsufficientAvailability": false,
            "isAvailable": true
        }
    ]
}
```

## Date Selection Example:

```
{
    "date": "2026-12-17T00:00:00",
    "minimumDate": "2026-12-17T00:00:00",
    "maximumDate": "2026-12-20T00:00:00",
    "nextSearchRangeStartDate": "2026-12-20T00:00:00",
    "itemName": "2026 Sonoma Raceway #2",
    "availableDates": [
        {
            "date": "2026-12-17T00:00:00",
            "availability": 0,
            "dateBasePrice": 589
        },
        {
            "date": "2026-12-18T00:00:00",
            "availability": 0,
            "dateBasePrice": 599
        },
        {
            "date": "2026-12-19T00:00:00",
            "availability": 0,
            "dateBasePrice": 599
        },
        {
            "date": "2026-12-20T00:00:00",
            "availability": 0,
            "dateBasePrice": 599
        }
    ],
    "showEndTimes": false,
    "showTourNames": false
}
```
