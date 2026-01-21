# Simple shopping cart project

This is a simple shopping cart base on Laravel, React and Inertia.

### Workflow

1. Anyone can brows products (/products) in index page, view each product in a single page (/products/{productSlug}),
   login or register
2. A user must be logged in to be able to add items to the his/her cart
3. After adding items to cart, the user can submit/finish the order (order status changes from "active" to "pending" )
4. An admin, in dashboard, can then convert user cart into "order", and update stock quantity (programmatically) and
   send email to the admin if a product is running low.
5. In every evening, a sales report is sent to the admin email

### Admin role code

admin role code is 10 (db column: "role" in users table)\
// check this enum for all roles:
> App\Data\UserRole

if user role is not admin, in dashboard, navigation items like "products","carts", "transactions won't be visible"
