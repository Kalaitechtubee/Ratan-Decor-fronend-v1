# Fixing Duplicate API Calls in OrderDetails

## Steps:
- [x] Add useRef import and guard to useEffect in OrderDetails.jsx to prevent StrictMode double-fetch.
- [x] Edit OrderDetails.jsx with the changes.
- [ ] Test: Navigate to order details page, check Network tab for single API call to /orders/{id}.
- [ ] Update TODO: Mark as complete and close issue.

# Fixing Multiple API Calls in Orders.jsx

## Steps:
- [x] Import useRef from 'react' in Orders.jsx.
- [x] Add useRef for abortController and isMounted in the component.
- [x] Update the fetchOrders function to use AbortController: Create signal, pass { signal } to axios.get, check !abortController.current.signal.aborted before setting state, and reset controller on new fetch.
- [x] Add useEffect cleanup: return () => { if (abortController.current) abortController.current.abort(); isMounted.current = false; }.
- [x] Edit Orders.jsx with these changes.
- [x] Test: Load the Orders page, check Network tab for single API call to /profile/orders on mount and only on pagination changes.
- [x] Update TODO: Mark steps as complete once verified.
