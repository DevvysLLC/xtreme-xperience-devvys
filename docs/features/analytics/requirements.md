# Page View Event
```javascript
dataLayer.push({
  event: 'page_view', // String
  page_location: window.location.href, // String
  page_referrer: document.referrer, // String
  page_title: document.title // String
});
```
# View Item Event (This will fire on the tracks pages or the supercar pages)
```javascript
dataLayer.push({
  event: 'view_item', // String
  ecommerce: {
    currency: 'Currency Code', // String
    value: 'Product Price', // Number
    items: [ // Array
      {
        item_name: 'Product Name', // String
        item_id: 'Product ID', // String
        price: 'Product Price', // Number
        item_brand: 'Brand Name', // String
        item_category: 'Category Name', // String
        item_variant: 'Variant Name', // String
        quantity: 1 // Number
      }
    ]
  }
});
```

# Add to Cart Event
```javascript
dataLayer.push({
  event: 'add_to_cart', // String
  ecommerce: {
    currency: 'Currency Code', // String
    value: 'Product Price', // Number
    items: [ // Array
      {
        item_name: 'Product Name', // String
        item_id: 'Product ID', // String
        price: 'Product Price', // Number
        item_brand: 'Brand Name', // String
        item_category: 'Category Name', // String
        item_variant: 'Variant Name', // String
        quantity: 1 // Number
      }
    ]
  }
});
```

# Begin Checkout Event
```javascript
dataLayer.push({
  event: 'begin_checkout', // String
  ecommerce: {
    currency: 'Currency Code', // String
    value: 'Total Cart Value', // Number
    items: [ // Array
      {
        item_name: 'Product Name', // String
        item_id: 'Product ID', // String
        price: 'Product Price', // Number
        item_brand: 'Brand Name', // String
        item_category: 'Category Name', // String
        item_variant: 'Variant Name', // String
        quantity: 1 // Number
      }
    ]
  }
});
```


# Add Shipping Info Event
```javascript
dataLayer.push({
  event: 'add_shipping_info', // String
  ecommerce: {
    currency: 'Currency Code', // String
    value: 'Total Value', // Number
    shipping_tier: 'Shipping Method', // String (e.g., 'Standard', 'Express')
    items: [ // Array
      {
        item_name: 'Product Name', // String
        item_id: 'Product ID', // String
        price: 'Product Price', // Number
        item_brand: 'Brand Name', // String
        item_category: 'Category Name', // String
        item_variant: 'Variant Name', // String
        quantity: 1 // Number
      }
    ]
  },
  user_data: {
    user_id: 'User ID', // String
    email: 'User Email', // String
    phone: 'User Phone Number', // String (optional)
    name: 'User Name', // String (optional)
    zip_code: 'User Zip Code', // String (optional)
    address: 'User Address' // String (optional)
  }
});
```
# Add Payment Info Event
``` javascript
dataLayer.push({
  event: 'add_payment_info', // String
  ecommerce: {
    currency: 'Currency Code', // String
    value: 'Total Value', // Number
    payment_type: 'Payment Method', // String (e.g., 'Credit Card', 'PayPal')
    items: [ // Array
      {
        item_name: 'Product Name', // String
        item_id: 'Product ID', // String
        price: 'Product Price', // Number
        item_brand: 'Brand Name', // String
        item_category: 'Category Name', // String
        item_variant: 'Variant Name', // String
        quantity: 1 // Number
      }
    ]
  },
  user_data: {
    user_id: 'User ID', // String
    email: 'User Email', // String
    phone: 'User Phone Number', // String (optional)
    name: 'User Name', // String (optional)
    zip_code: 'User Zip Code' // String (optional)
  }
});
```

# Purchase Event
``` javascript
dataLayer.push({
  event: 'purchase', // String
  ecommerce: {
    transaction_id: 'Transaction ID', // String
    affiliation: 'Store Name', // String
    value: 'Total Value', // Number
    currency: 'Currency Code', // String
    tax: 'Tax Amount', // Number
    shipping: 'Shipping Cost', // Number
    coupon: 'Coupon Code', // String
    items: [ // Array
      {
        item_name: 'Product Name', // String
        item_id: 'Product ID', // String
        price: 'Product Price', // Number
        item_brand: 'Brand Name', // String
        item_category: 'Category Name', // String
        item_variant: 'Variant Name', // String
        quantity: 1 // Number
      }
    ]
  },
  user_data: {
    user_id: 'User ID', // String
    email: 'User Email', // String
    phone: 'User Phone Number', // String (optional)
    name: 'User Name', // String (optional)
    zip_code: 'User Zip Code', // String (optional)
    address: 'User Address' // String (optional)
  }
});
```