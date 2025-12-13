# Cart Quantity Fix TODO

## Issue
When adding a product to the cart for guest users, it adds a new entry each time instead of increasing the quantity if the product is already in the cart.

## Tasks
- [x] Modify addToCart in CartContext.jsx for guest users to check if product exists and increment quantity
- [x] Modify addToCart in cartApi.js for guest users to check if product exists and increment quantity
- [x] Ensure consistent product ID usage across cart items
- [x] Test the fix to ensure quantity increases without adding duplicate entries
