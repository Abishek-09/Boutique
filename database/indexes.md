# Database Indexing Strategy & Execution Plan
## Maison D'Or Boutique Atelier

This document formalizes the production indexing strategy for the 32 normalized tables in MySQL. It details every B-Tree index, index type, column composition, and the specific query workloads and execution plans it optimizes.

---

### 1. Indexing Principles & MySQL InnoDB Architecture

1. **Clustered Index on Primary Key**: In MySQL InnoDB, table data is physically organized along the Primary Key B-Tree. All 32 tables utilize compact `BIGINT UNSIGNED AUTO_INCREMENT` surrogate primary keys, minimizing secondary index leaf node footprint.
2. **Mandatory Foreign Key Indexing**: In high-concurrency relational databases, unindexed foreign key columns cause severe performance degradation and metadata/row locks during updates or deletes on parent tables. Every FK column is explicitly indexed.
3. **Redundancy Elimination**: MySQL uses leftmost prefix matching. If an existing `UNIQUE` constraint or composite index already has column `X` as its leading key, a redundant single-column index on `X` is **intentionally omitted**.
4. **Covering & Filtering Indexes**: Multi-column composite indexes are introduced specifically where frontend pages perform filtered sort operations (e.g. catalog filtering by category + status, reviews filtered by product + approval status).

---

### 2. Comprehensive Index Matrix

| Table | Index Name | Type | Column(s) | Workload & Optimization Justification |
| :--- | :--- | :--- | :--- | :--- |
| `users` | `uk_users_email` | UNIQUE | `(email)` | O(log N) lookup during admin/patron authentication login. |
| `user_roles` | `idx_ur_role_id` | INDEX | `(role_id)` | Optimizes reverse lookup: finding all users assigned to a specific role. Leading `user_id` is covered by the composite PK. |
| `customers` | `uk_customers_code` | UNIQUE | `(customer_code)` | Fast lookup by business code (`CUST-001`) in customer directory. |
| `customers` | `uk_customers_email`| UNIQUE | `(email)` | Fast lookup by patron email during checkout or account search. |
| `customers` | `uk_customers_user` | UNIQUE | `(user_id)` | 1:1 join between authenticated `users` and `customers` profile. |
| `customer_addresses`| `idx_ca_customer` | INDEX | `(customer_id, is_default)` | Rapid retrieval of patron address book and default address. |
| `categories` | `uk_categories_code`| UNIQUE | `(code)` | Lookup by category code (`cat-sarees`). |
| `categories` | `uk_categories_slug`| UNIQUE | `(slug)` | Critical for storefront routing (`/shop?category=sarees`). |
| `collections` | `uk_collections_code`| UNIQUE | `(code)` | Lookup by collection code (`col-festive`). |
| `collections` | `uk_collections_slug`| UNIQUE | `(slug)` | Critical for collection detail routing (`/collections/festive`). |
| `products` | `uk_products_sku` | UNIQUE | `(sku)` | Fast lookup during admin inventory search, order processing, and barcode scanning. |
| `products` | `uk_products_slug` | UNIQUE | `(slug)` | Critical for storefront product detail page routing (`/product/:slug`). |
| `products` | `idx_prod_cat_status`| INDEX | `(category_id, status)` | High-frequency catalog browsing query: `WHERE category_id = ? AND status = 'published'`. |
| `products` | `idx_prod_col_status`| INDEX | `(collection_id, status)` | High-frequency collection showcase query: `WHERE collection_id = ? AND status = 'published'`. |
| `products` | `idx_prod_status_feat`| INDEX | `(status, featured, new_arrival, best_seller)` | Powers homepage merchandising queries (New Arrivals carousel, Featured grid, Best Seller badges). |
| `product_images` | `idx_pi_prod_order` | INDEX | `(product_id, display_order)`| Optimizes loading gallery thumbnails ordered by sequence on product pages. |
| `sizes` | `uk_sizes_name` | UNIQUE | `(name)` | Master size deduplication and lookup. |
| `product_sizes` | `idx_ps_size_prod` | INDEX | `(size_id, product_id)` | Reverse lookup: finding all products available in size 'M' or 'Free Size'. (Forward join covered by PK). |
| `colors` | `uk_colors_name` | UNIQUE | `(name)` | Master color deduplication and lookup. |
| `product_colors`| `idx_pc_color_prod`| INDEX | `(color_id, product_id)`| Reverse lookup: finding all products available in 'Deep Crimson'. (Forward join covered by PK). |
| `tags` | `uk_tags_name` | UNIQUE | `(name)` | Master tag deduplication. |
| `product_tags` | `idx_pt_tag_prod` | INDEX | `(tag_id, product_id)` | Faceted tag search: finding all products tagged with 'banarasi' or 'silk'. (Forward join covered by PK). |
| `inventory` | `uk_inventory_prod`| UNIQUE | `(product_id)` | 1:1 join between catalog product and live stock record. |
| `inventory` | `idx_inv_low_stock` | INDEX | `(quantity, low_stock_threshold)`| Accelerates Admin Dashboard alert: `WHERE quantity <= low_stock_threshold`. |
| `inventory_movements`| `idx_im_inventory_date`| INDEX | `(inventory_id, created_at)` | Fetches chronological stock ledger history for a product. |
| `inventory_movements`| `idx_im_created_by`| INDEX | `(created_by)` | Audit trail query: tracks stock adjustments made by specific staff members. |
| `coupons` | `uk_coupons_code` | UNIQUE | `(code)` | Immediate coupon validation during cart checkout (`applyCoupon('WELCOME10')`). |
| `coupons` | `idx_coupons_active`| INDEX | `(status, start_at, end_at)`| Optimizes coupon validation: checking if code is currently active and within date range. |
| `orders` | `uk_orders_num` | UNIQUE | `(order_number)` | Customer lookup and order success routing (`/order-success/BTQ-2026-001`). |
| `orders` | `idx_orders_customer_date`| INDEX | `(customer_id, order_date DESC)`| Powers "My Orders" customer portal page: sorts patron orders by date descending. |
| `orders` | `idx_orders_status_date`| INDEX | `(status, created_at DESC)` | Powers Admin Orders management page filtering by fulfillment status (`Placed`, `Processing`, etc.). |
| `orders` | `idx_orders_created`| INDEX | `(created_at)` | Powers Admin Dashboard weekly sales chart aggregation (`GROUP BY DATE(created_at)`). |
| `order_items` | `idx_oi_order` | INDEX | `(order_id)` | High-frequency join: loading all invoice line items for an order. |
| `order_items` | `idx_oi_product` | INDEX | `(product_id)` | Product sales analytics: finding total units sold for a product. |
| `order_addresses`| `uk_oa_order` | UNIQUE | `(order_id)` | 1:1 join loading delivery snapshot for shipping label and invoice. |
| `order_payments`| `uk_op_txn` | UNIQUE | `(transaction_id)` | Fast lookup and reconciliation of bank/gateway transaction reference IDs. |
| `order_payments`| `idx_op_order_status`| INDEX | `(order_id, payment_status)`| Verifies payment capture status before order dispatch. |
| `shipments` | `uk_shipments_order`| UNIQUE | `(order_id)` | 1:1 join loading tracking details for customer and courier modals. |
| `shipments` | `idx_shipments_tracking`| INDEX | `(tracking_number)` | Courier webhook or manual AWB tracking search. |
| `order_status_history`| `idx_osh_order_date`| INDEX | `(order_id, changed_at ASC)`| Loads sequential timeline milestones in order detail modal. |
| `order_status_history`| `idx_osh_changed_by`| INDEX | `(changed_by)` | Staff performance auditing. |
| `order_coupons` | `uk_oc_redemption` | UNIQUE | `(order_id, coupon_id)`| Enforces single redemption per order; covers `order_id` queries. |
| `order_coupons` | `idx_oc_coupon` | INDEX | `(coupon_id)` | Analyzes aggregate redemption frequency across all orders for a specific coupon. |
| `reviews` | `idx_rev_prod_status`| INDEX | `(product_id, status, rating)`| Powers Product Detail Page review section: `WHERE product_id = ? AND status = 'approved'`. Also calculates average rating. |
| `reviews` | `idx_rev_cust_date`| INDEX | `(customer_id, submitted_at DESC)`| Powers Customer Account reviews tab and admin patron detail page. |
| `reviews` | `idx_rev_status_date`| INDEX | `(status, submitted_at ASC)`| Powers Admin Reviews moderation queue tabs (`pending`, `approved`, `rejected`). |
| `reviews` | `uk_reviews_item_cust`| UNIQUE | `(order_item_id, customer_id)`| Enforces single review per purchased order item. |
| `reviews` | `idx_rev_order` | INDEX | `(order_id)` | Links reviews to originating order. |
| `enquiries` | `idx_enq_status_date`| INDEX | `(status, submitted_at DESC)`| Powers Admin Concierge Inquiries page filtering by status (`New`, `Contacted`, `Resolved`). |
| `enquiries` | `idx_enq_cust` | INDEX | `(customer_id)` | Concierge history lookup for a patron. |

---

### 3. Query Execution Plan Proofs

#### Scenario A: Storefront Product Detail Page
```sql
-- 1. Fetch core product
SELECT * FROM products WHERE slug = 'kashi-crimson-pure-katan-silk-saree';
-- Uses uk_products_slug (Const ref, 1 row)

-- 2. Fetch images
SELECT * FROM product_images WHERE product_id = 1 ORDER BY display_order ASC;
-- Uses idx_pi_prod_order (Ref, index scan, eliminates filesort)

-- 3. Fetch sizes and colors
SELECT s.name FROM sizes s JOIN product_sizes ps ON s.id = ps.size_id WHERE ps.product_id = 1;
SELECT c.name, c.hex_code FROM colors c JOIN product_colors pc ON c.id = pc.color_id WHERE pc.product_id = 1;
-- Uses composite PKs pk_product_sizes and pk_product_colors (Index scan)

-- 4. Calculate approved rating aggregate
SELECT AVG(rating) AS avg_rating, COUNT(*) AS total_reviews 
FROM reviews 
WHERE product_id = 1 AND status = 'approved';
-- Uses idx_rev_prod_status (Covering index range scan, zero table lookups)
```

#### Scenario B: Admin Order Detail & Fulfillment Transition
```sql
-- 1. Fetch Order and Line Items
SELECT * FROM orders WHERE order_number = 'BTQ-2026-001';
-- Uses uk_orders_num (Const ref, 1 row)

SELECT * FROM order_items WHERE order_id = 1;
-- Uses idx_oi_order (Ref, exact index match)

-- 2. Fetch Timeline History
SELECT * FROM order_status_history WHERE order_id = 1 ORDER BY changed_at ASC;
-- Uses idx_osh_order_date (Ref, no filesort)
```
