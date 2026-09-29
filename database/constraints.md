# Database Constraints & Business Invariants Specification
## Maison D'Or Boutique Atelier

This document formalizes all integrity constraints implemented across the 32 normalized tables, including Primary Keys (PK), Foreign Keys (FK), Unique Business Identifiers (UNIQUE), Mandatory Value Rules (NOT NULL), Domain Integrity Invariants (CHECK), and Safe Fallbacks (DEFAULT).

---

### 1. Integrity Constraint Categories

1. **Entity Integrity (PK)**: Every table enforces a surrogate 64-bit unsigned primary key (`id BIGINT UNSIGNED AUTO_INCREMENT`), ensuring deterministic row identification, stable joins, and optimal clustered B-Tree indexing.
2. **Referential Integrity (FK)**: Explicit foreign keys with restrictive actions on financial/historical relations (`ON DELETE RESTRICT`) prevent dangling references, orphan invoices, and accidental cascading wipes.
3. **Domain & Value Invariants (CHECK)**: Enforces business logic inside the database engine so that erroneous client payloads or script errors cannot violate core accounting principles (e.g., negative stock, prices, or invalid review scores).
4. **Natural Business Uniqueness (UNIQUE)**: Guarantees that public identifiers (SKU, slugs, order numbers, transaction IDs, promo codes) cannot collide.

---

### 2. Table-by-Table Constraint Matrix

#### 2.1 Authentication & Patron Domain

| Table | Constraint Name | Constraint Type | Column(s) / Expression | Business Justification |
| :--- | :--- | :--- | :--- | :--- |
| `roles` | `pk_roles` | PRIMARY KEY | `(id)` | Surrogate table key |
| `roles` | `uk_roles_name` | UNIQUE | `(name)` | Role names (`admin`, `customer`) must be unique |
| `users` | `pk_users` | PRIMARY KEY | `(id)` | Surrogate table key |
| `users` | `uk_users_email` | UNIQUE | `(email)` | Login email must be unique across all accounts |
| `user_roles` | `pk_user_roles` | PRIMARY KEY | `(user_id, role_id)` | Prevents duplicate role assignments |
| `user_roles` | `fk_ur_user` | FOREIGN KEY | `user_id -> users(id) ON DELETE CASCADE` | Cleans up role mapping if user is dropped |
| `user_roles` | `fk_ur_role` | FOREIGN KEY | `role_id -> roles(id) ON DELETE RESTRICT` | Prevents deleting active system roles |
| `customers` | `pk_customers` | PRIMARY KEY | `(id)` | Surrogate table key |
| `customers` | `uk_customers_code` | UNIQUE | `(customer_code)` | Business identifier (e.g., `CUST-001`) cannot collide |
| `customers` | `uk_customers_email` | UNIQUE | `(email)` | Patron email must be unique |
| `customers` | `uk_customers_user` | UNIQUE | `(user_id)` | A user account can map to at most one patron profile |
| `customers` | `fk_customers_user` | FOREIGN KEY | `user_id -> users(id) ON DELETE SET NULL` | Decouples authentication without deleting patron history |
| `customer_addresses`| `pk_customer_addresses`| PRIMARY KEY | `(id)` | Surrogate table key |
| `customer_addresses`| `fk_ca_customer` | FOREIGN KEY | `customer_id -> customers(id) ON DELETE CASCADE`| Cleans up address book entries if patron is deleted |

---

#### 2.2 Catalog & Product Attributes Domain

| Table | Constraint Name | Constraint Type | Column(s) / Expression | Business Justification |
| :--- | :--- | :--- | :--- | :--- |
| `categories` | `pk_categories` | PRIMARY KEY | `(id)` | Surrogate table key |
| `categories` | `uk_categories_code` | UNIQUE | `(code)` | Category code (e.g., `cat-sarees`) must be unique |
| `categories` | `uk_categories_slug` | UNIQUE | `(slug)` | SEO URL slug must be globally unique |
| `collections` | `pk_collections` | PRIMARY KEY | `(id)` | Surrogate table key |
| `collections` | `uk_collections_code`| UNIQUE | `(code)` | Collection code (e.g., `col-festive`) must be unique |
| `collections` | `uk_collections_slug`| UNIQUE | `(slug)` | SEO URL slug must be globally unique |
| `products` | `pk_products` | PRIMARY KEY | `(id)` | Surrogate table key |
| `products` | `uk_products_code` | UNIQUE | `(code)` | External identifier (`prod-001`) must be unique |
| `products` | `uk_products_sku` | UNIQUE | `(sku)` | Stock Keeping Unit must be globally unique |
| `products` | `uk_products_slug` | UNIQUE | `(slug)` | Product SEO URL slug must be globally unique |
| `products` | `chk_products_price` | CHECK | `price >= 0.00` | Negative product price is impossible |
| `products` | `chk_products_sale` | CHECK | `sale_price IS NULL OR (sale_price >= 0.00 AND sale_price <= price)` | Sale price cannot be negative or exceed regular price |
| `products` | `fk_prod_category` | FOREIGN KEY | `category_id -> categories(id) ON DELETE RESTRICT`| Category must exist; cannot delete category with products |
| `products` | `fk_prod_collection`| FOREIGN KEY | `collection_id -> collections(id) ON DELETE SET NULL`| Removing collection disassociates product safely |
| `product_images`| `pk_product_images` | PRIMARY KEY | `(id)` | Surrogate table key |
| `product_images`| `fk_pi_product` | FOREIGN KEY | `product_id -> products(id) ON DELETE CASCADE`| Deleting product deletes its gallery |
| `sizes` | `pk_sizes` | PRIMARY KEY | `(id)` | Surrogate table key |
| `sizes` | `uk_sizes_name` | UNIQUE | `(name)` | Master size name must be unique |
| `product_sizes`| `pk_product_sizes` | PRIMARY KEY | `(product_id, size_id)` | Prevents duplicate size assignments to same product |
| `product_sizes`| `fk_ps_product` | FOREIGN KEY | `product_id -> products(id) ON DELETE CASCADE`| Cleans up size mapping if product is deleted |
| `product_sizes`| `fk_ps_size` | FOREIGN KEY | `size_id -> sizes(id) ON DELETE RESTRICT` | Cannot delete master size assigned to active products |
| `colors` | `pk_colors` | PRIMARY KEY | `(id)` | Surrogate table key |
| `colors` | `uk_colors_name` | UNIQUE | `(name)` | Master color name must be unique |
| `product_colors`| `pk_product_colors`| PRIMARY KEY | `(product_id, color_id)` | Prevents duplicate color assignments to same product |
| `product_colors`| `fk_pc_product` | FOREIGN KEY | `product_id -> products(id) ON DELETE CASCADE`| Cleans up color mapping if product is deleted |
| `product_colors`| `fk_pc_color` | FOREIGN KEY | `color_id -> colors(id) ON DELETE RESTRICT` | Cannot delete master color assigned to active products |
| `tags` | `pk_tags` | PRIMARY KEY | `(id)` | Surrogate table key |
| `tags` | `uk_tags_name` | UNIQUE | `(name)` | Tag keyword must be unique |
| `product_tags` | `pk_product_tags` | PRIMARY KEY | `(product_id, tag_id)` | Prevents duplicate tag assignments to same product |
| `product_tags` | `fk_pt_product` | FOREIGN KEY | `product_id -> products(id) ON DELETE CASCADE`| Cleans up tag mapping if product is deleted |
| `product_tags` | `fk_pt_tag` | FOREIGN KEY | `tag_id -> tags(id) ON DELETE CASCADE` | Removing a tag cleans up its assignments |

---

#### 2.3 Inventory Ledger Domain

| Table | Constraint Name | Constraint Type | Column(s) / Expression | Business Justification |
| :--- | :--- | :--- | :--- | :--- |
| `inventory` | `pk_inventory` | PRIMARY KEY | `(id)` | Surrogate table key |
| `inventory` | `uk_inventory_product`| UNIQUE | `(product_id)` | 1:1 relationship with products |
| `inventory` | `chk_inv_qty` | CHECK | `quantity >= 0` | Negative stock quantities are strictly prohibited |
| `inventory` | `chk_inv_threshold`| CHECK | `low_stock_threshold >= 0` | Threshold must be non-negative |
| `inventory` | `fk_inv_product` | FOREIGN KEY | `product_id -> products(id) ON DELETE RESTRICT`| Cannot delete product while physical stock record exists |
| `inventory_movements`| `pk_inv_movements`| PRIMARY KEY | `(id)` | Surrogate table key |
| `inventory_movements`| `chk_im_balance` | CHECK | `balance_after >= 0` | Balance after transaction can never be negative |
| `inventory_movements`| `fk_im_inventory`| FOREIGN KEY | `inventory_id -> inventory(id) ON DELETE RESTRICT`| Ledger is immutable; cannot drop inventory with history |
| `inventory_movements`| `fk_im_user` | FOREIGN KEY | `created_by -> users(id) ON DELETE SET NULL` | Preserves audit trail if operator user is deleted |

---

#### 2.4 Promotions & Offers Domain

| Table | Constraint Name | Constraint Type | Column(s) / Expression | Business Justification |
| :--- | :--- | :--- | :--- | :--- |
| `coupons` | `pk_coupons` | PRIMARY KEY | `(id)` | Surrogate table key |
| `coupons` | `uk_coupons_code` | UNIQUE | `(code)` | Promo code must be unique |
| `coupons` | `chk_coupons_value`| CHECK | `value > 0.00` | Discount value must be strictly positive |
| `coupons` | `chk_coupons_min` | CHECK | `minimum_order_amount >= 0.00` | Minimum order amount cannot be negative |
| `coupons` | `chk_coupons_dates`| CHECK | `end_at >= start_at` | Expiration date must be on or after start date |

---

#### 2.5 Orders & Financial Invoicing Domain

| Table | Constraint Name | Constraint Type | Column(s) / Expression | Business Justification |
| :--- | :--- | :--- | :--- | :--- |
| `orders` | `pk_orders` | PRIMARY KEY | `(id)` | Surrogate table key |
| `orders` | `uk_orders_num` | UNIQUE | `(order_number)` | Invoice number (e.g., `BTQ-2026-001`) must be unique |
| `orders` | `chk_orders_subtotal`| CHECK | `subtotal >= 0.00` | Subtotal cannot be negative |
| `orders` | `chk_orders_discount`| CHECK | `discount_amount >= 0.00`| Discount cannot be negative |
| `orders` | `chk_orders_shipping`| CHECK | `shipping_amount >= 0.00`| Shipping charge cannot be negative |
| `orders` | `chk_orders_tax` | CHECK | `tax_amount >= 0.00` | Tax amount cannot be negative |
| `orders` | `chk_orders_total` | CHECK | `final_total >= 0.00` | Grand total cannot be negative |
| `orders` | `fk_orders_customer` | FOREIGN KEY | `customer_id -> customers(id) ON DELETE RESTRICT`| Cannot delete customer with settled orders |
| `order_items` | `pk_order_items` | PRIMARY KEY | `(id)` | Surrogate table key |
| `order_items` | `chk_oi_quantity` | CHECK | `quantity > 0` | Must purchase at least 1 unit |
| `order_items` | `chk_oi_unit_price` | CHECK | `unit_price >= 0.00` | Unit price cannot be negative |
| `order_items` | `chk_oi_total_price`| CHECK | `total_price >= 0.00` | Total price cannot be negative |
| `order_items` | `fk_oi_order` | FOREIGN KEY | `order_id -> orders(id) ON DELETE RESTRICT` | Order lines cannot be cascade deleted |
| `order_items` | `fk_oi_product` | FOREIGN KEY | `product_id -> products(id) ON DELETE RESTRICT` | Catalog product cannot be deleted if sold in orders |
| `order_addresses`| `pk_order_addresses`| PRIMARY KEY | `(id)` | Surrogate table key |
| `order_addresses`| `uk_oa_order` | UNIQUE | `(order_id)` | 1:1 relationship with orders |
| `order_addresses`| `fk_oa_order` | FOREIGN KEY | `order_id -> orders(id) ON DELETE RESTRICT` | Shipping snapshot cannot be dropped |
| `order_payments`| `pk_order_payments` | PRIMARY KEY | `(id)` | Surrogate table key |
| `order_payments`| `uk_op_txn` | UNIQUE | `(transaction_id)` | Transaction reference ID must be unique |
| `order_payments`| `chk_op_amount` | CHECK | `amount >= 0.00` | Payment amount cannot be negative |
| `order_payments`| `fk_op_order` | FOREIGN KEY | `order_id -> orders(id) ON DELETE RESTRICT` | Invoiced payment records must be preserved |
| `shipments` | `pk_shipments` | PRIMARY KEY | `(id)` | Surrogate table key |
| `shipments` | `uk_shipments_order` | UNIQUE | `(order_id)` | 1:1 relationship with orders |
| `shipments` | `fk_shipments_order` | FOREIGN KEY | `order_id -> orders(id) ON DELETE RESTRICT` | Logistics records cannot be cascade dropped |
| `order_status_history`| `pk_osh` | PRIMARY KEY | `(id)` | Surrogate table key |
| `order_status_history`| `fk_osh_order` | FOREIGN KEY | `order_id -> orders(id) ON DELETE RESTRICT` | Milestone audit log cannot be dropped |
| `order_status_history`| `fk_osh_user` | FOREIGN KEY | `changed_by -> users(id) ON DELETE SET NULL` | Preserves milestone if user profile is deleted |
| `order_coupons`| `pk_order_coupons` | PRIMARY KEY | `(id)` | Surrogate table key |
| `order_coupons`| `uk_oc_redemption` | UNIQUE | `(order_id, coupon_id)` | A specific coupon cannot be applied twice to same order |
| `order_coupons`| `chk_oc_discount` | CHECK | `applied_discount_amount >= 0.00` | Applied discount amount cannot be negative |
| `order_coupons`| `fk_oc_order` | FOREIGN KEY | `order_id -> orders(id) ON DELETE RESTRICT` | Preserves promotional invoice record |
| `order_coupons`| `fk_oc_coupon` | FOREIGN KEY | `coupon_id -> coupons(id) ON DELETE RESTRICT` | Cannot delete coupon that was redeemed on orders |

---

#### 2.6 Reviews, Inquiries & Store Configuration Domain

| Table | Constraint Name | Constraint Type | Column(s) / Expression | Business Justification |
| :--- | :--- | :--- | :--- | :--- |
| `reviews` | `pk_reviews` | PRIMARY KEY | `(id)` | Surrogate table key |
| `reviews` | `uk_reviews_item_cust`| UNIQUE | `(order_item_id, customer_id)` | Patron cannot review the exact same purchased order item twice |
| `reviews` | `chk_reviews_rating` | CHECK | `rating >= 1 AND rating <= 5` | Star ratings must fall in standard range [1, 5] |
| `reviews` | `fk_rev_product` | FOREIGN KEY | `product_id -> products(id) ON DELETE RESTRICT` | Product cannot be deleted if customer reviews exist |
| `reviews` | `fk_rev_customer` | FOREIGN KEY | `customer_id -> customers(id) ON DELETE RESTRICT`| Customer cannot be deleted if testimonials exist |
| `reviews` | `fk_rev_order` | FOREIGN KEY | `order_id -> orders(id) ON DELETE SET NULL` | Retains review text even if order is decoupled |
| `reviews` | `fk_rev_item` | FOREIGN KEY | `order_item_id -> order_items(id) ON DELETE SET NULL`| Retains review text if line item reference is decoupled |
| `reviews` | `fk_rev_moderator` | FOREIGN KEY | `moderated_by -> users(id) ON DELETE SET NULL` | Retains moderation state if admin account deleted |
| `enquiries` | `pk_enquiries` | PRIMARY KEY | `(id)` | Surrogate table key |
| `enquiries` | `fk_enquiries_cust` | FOREIGN KEY | `customer_id -> customers(id) ON DELETE SET NULL`| Concierge records preserved if patron account is removed |
| `store_settings`| `pk_store_settings` | PRIMARY KEY | `(id)` | Singleton row identifier (`id = 1`) |
| `store_settings`| `chk_ss_free_ship` | CHECK | `free_shipping_threshold >= 0.00` | Free shipping threshold cannot be negative |
| `store_settings`| `chk_ss_std_ship` | CHECK | `standard_shipping_fee >= 0.00` | Standard shipping fee cannot be negative |
| `homepage_announcement`| `pk_hp_ann` | PRIMARY KEY | `(id)` | Primary key |
| `homepage_hero` | `pk_hp_hero` | PRIMARY KEY | `(id)` | Primary key |
| `homepage_promo_banner`| `pk_hp_promo` | PRIMARY KEY | `(id)` | Primary key |
