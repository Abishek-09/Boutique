# Database Relationships & Referential Integrity Rules
## Maison D'Or Boutique Atelier

This document specifies every foreign key relationship, cardinality, cascade/restrict action, and the architectural justification for referential integrity across the 32 normalized tables.

---

### 1. Referential Integrity Philosophy

In production ecommerce databases, **blindly cascading deletes is a catastrophic anti-pattern**. 
* **Financial, Tax, and Order Records**: Invoices, payments, order line items, shipments, and status milestones must **never** be cascade-deleted. If a product or customer is retired, historical records must be protected via `ON DELETE RESTRICT`.
* **Master Deactivations vs. Deletions**: In production, products, categories, collections, and customers are soft-deactivated via status flags (`status = 'archived'`), not hard-deleted via `DELETE FROM`. The foreign key `ON DELETE RESTRICT` rule enforces this invariant at the database engine level.
* **Child Gallery & Junction Tables**: Dependent child records that have no independent lifecycle without their parent (such as `product_images`, `product_sizes`, `product_colors`, and `user_roles`) safely utilize `ON DELETE CASCADE`.

---

### 2. Comprehensive Relationship Registry

| # | Parent Table | Child Table | Foreign Key Column | Cardinality | ON DELETE | ON UPDATE | Rationale |
| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `users` | `user_roles` | `user_id` | 1 : N | `CASCADE` | `CASCADE` | Removing a user safely clears their role memberships. |
| 2 | `roles` | `user_roles` | `role_id` | 1 : N | `RESTRICT` | `CASCADE` | Cannot delete a role that is actively assigned to users. |
| 3 | `users` | `customers` | `user_id` | 1 : 1 (opt) | `SET NULL` | `CASCADE` | Customer record persists even if the user auth account is disabled. |
| 4 | `customers` | `customer_addresses` | `customer_id` | 1 : N | `CASCADE` | `CASCADE` | Addresses belong to the patron's address book. |
| 5 | `categories` | `products` | `category_id` | 1 : N | `RESTRICT` | `CASCADE` | Cannot delete a category containing live catalog products. |
| 6 | `collections` | `products` | `collection_id` | 1 : N (opt) | `SET NULL` | `CASCADE` | Deleting a seasonal collection disassociates products without destroying them. |
| 7 | `products` | `product_images` | `product_id` | 1 : N | `CASCADE` | `CASCADE` | Images belong exclusively to the parent product. |
| 8 | `products` | `product_sizes` | `product_id` | 1 : N | `CASCADE` | `CASCADE` | Junction table membership belongs to product. |
| 9 | `sizes` | `product_sizes` | `size_id` | 1 : N | `RESTRICT` | `CASCADE` | Cannot delete a master size assigned to active products. |
| 10 | `products` | `product_colors` | `product_id` | 1 : N | `CASCADE` | `CASCADE` | Junction table membership belongs to product. |
| 11 | `colors` | `product_colors` | `color_id` | 1 : N | `RESTRICT` | `CASCADE` | Cannot delete a master color assigned to active products. |
| 12 | `products` | `product_tags` | `product_id` | 1 : N | `CASCADE` | `CASCADE` | Junction table membership belongs to product. |
| 13 | `tags` | `product_tags` | `tag_id` | 1 : N | `CASCADE` | `CASCADE` | Deleting an ad-hoc tag cleans up its product assignments. |
| 14 | `products` | `inventory` | `product_id` | 1 : 1 | `RESTRICT` | `CASCADE` | Cannot delete a product while physical inventory state exists. |
| 15 | `inventory` | `inventory_movements` | `inventory_id` | 1 : N | `RESTRICT` | `CASCADE` | Inventory ledger is an immutable audit log; deletion strictly forbidden. |
| 16 | `users` | `inventory_movements` | `created_by` | 1 : N (opt) | `SET NULL` | `CASCADE` | Preserves audit trail if administrative staff profile is archived. |
| 17 | `customers` | `orders` | `customer_id` | 1 : N | `RESTRICT` | `CASCADE` | Cannot delete a customer with settled legal order transactions. |
| 18 | `orders` | `order_items` | `order_id` | 1 : N | `RESTRICT` | `CASCADE` | Invoiced order lines must never be cascade deleted. |
| 19 | `products` | `order_items` | `product_id` | 1 : N | `RESTRICT` | `CASCADE` | Catalog products cannot be deleted if historical orders reference them. |
| 20 | `orders` | `order_addresses` | `order_id` | 1 : 1 | `RESTRICT` | `CASCADE` | Shipping address invoice snapshot must not be deleted. |
| 21 | `orders` | `order_payments` | `order_id` | 1 : N | `RESTRICT` | `CASCADE` | Financial transaction audit trail must remain immutable. |
| 22 | `orders` | `shipments` | `order_id` | 1 : 1 | `RESTRICT` | `CASCADE` | Logistics dispatch record must not be deleted. |
| 23 | `orders` | `order_status_history` | `order_id` | 1 : N | `RESTRICT` | `CASCADE` | Milestone history log must not be cascade deleted. |
| 24 | `users` | `order_status_history` | `changed_by` | 1 : N (opt) | `SET NULL` | `CASCADE` | Preserves order transition history if staff account is deleted. |
| 25 | `orders` | `order_coupons` | `order_id` | 1 : N | `RESTRICT` | `CASCADE` | Promotional tax invoice record must be preserved. |
| 26 | `coupons` | `order_coupons` | `coupon_id` | 1 : N | `RESTRICT` | `CASCADE` | Cannot delete a coupon that was redeemed on past orders. |
| 27 | `products` | `reviews` | `product_id` | 1 : N | `RESTRICT` | `CASCADE` | Patron testimonials cannot be accidentally wiped. |
| 28 | `customers` | `reviews` | `customer_id` | 1 : N | `RESTRICT` | `CASCADE` | Patron reviews remain preserved under author account. |
| 29 | `orders` | `reviews` | `order_id` | 1 : N (opt) | `SET NULL` | `CASCADE` | Retains review text even if order archive is decoupled. |
| 30 | `order_items` | `reviews` | `order_item_id` | 1 : 1 (opt) | `SET NULL` | `CASCADE` | Retains review text if line item reference is decoupled. |
| 31 | `users` | `reviews` | `moderated_by` | 1 : N (opt) | `SET NULL` | `CASCADE` | Preserves approval state if moderating admin user is removed. |
| 32 | `customers` | `enquiries` | `customer_id` | 1 : N (opt) | `SET NULL` | `CASCADE` | Preserves concierge messages even if patron profile is removed. |

---

### 3. Text Relationship Map

```text
[users] 
   ├──< (1:N) [user_roles] >── (N:1) [roles]
   ├─── (1:1 opt) ───> [customers]
   ├─── (1:N opt) ───> [inventory_movements] (created_by)
   ├─── (1:N opt) ───> [order_status_history] (changed_by)
   └─── (1:N opt) ───> [reviews] (moderated_by)

[customers]
   ├──< (1:N) [customer_addresses]
   ├──< (1:N) [orders]
   ├──< (1:N) [reviews]
   └──< (1:N opt) [enquiries]

[categories]
   └──< (1:N) [products]

[collections]
   └──< (1:N opt) [products]

[products]
   ├──< (1:N) [product_images]
   ├──< (1:N) [product_sizes] >── (N:1) [sizes]
   ├──< (1:N) [product_colors] >── (N:1) [colors]
   ├──< (1:N) [product_tags] >── (N:1) [tags]
   ├─── (1:1) ───> [inventory]
   ├──< (1:N) [order_items]
   └──< (1:N) [reviews]

[inventory]
   └──< (1:N) [inventory_movements]

[coupons]
   └──< (1:N) [order_coupons]

[orders]
   ├──< (1:N) [order_items]
   ├─── (1:1) ───> [order_addresses]
   ├──< (1:N) [order_payments]
   ├─── (1:1) ───> [shipments]
   ├──< (1:N) [order_status_history]
   ├──< (1:N) [order_coupons]
   └──< (1:N opt) [reviews]

[order_items]
   └──< (1:1 opt) [reviews]

[store_settings] (Singleton)

[homepage_announcement] (Singleton/Config)

[homepage_hero] (CMS)

[homepage_promo_banner] (CMS)
```
