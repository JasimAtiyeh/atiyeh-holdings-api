## TODO:

- Test all users routes - Done
- Test all houses routes
- Test all leases routes
- Test all tickets routes
- Add functionality to add and remove leases, tenants, and maintenance tickets from houses
- Return instance of user/house/lease/ticket when creating and updating from DB
- Figure out a better way to do the routing
  - Defining get requests for `:houseId` `:leaseId` `:ticketId` in the same router will overright some of the routes. ex: a request to `/houses/:houseId` will be the route that is always hit regardless if you are trying to hit `:leaseId` or `:ticketId` because `:houseId` is defined first
- Impelment tests

## Upcoming features:

- Maintenance Tickets
-
