# Database Normalization Audit (1NF, 2NF, 3NF, BCNF)
## Maison D'Or Boutique Atelier

This document provides a formal normalization audit of the 32 database entities, validating functional dependencies (FDs), candidate keys, normal form satisfaction up to Boyce-Codd Normal Form (BCNF), and delineating intentional historical snapshots from undesirable data anomalies.

---

### 1. Normalization Foundations & Definitions

* **First Normal Form (1NF)**: Each table represents a relation with no repeating groups, no arrays, no comma-separated values, and every column contains only atomic (indivisible) values. A primary key uniquely identifies each tuple.
* **Second Normal Form (2NF)**: The relation is in 1NF, and every non-prime attribute is fully functionally dependent on the entire primary key (no partial key dependencies). This is automatically satisfied for tables with single-column surrogate primary keys.
* **Third Normal Form (3NF)**: The relation is in 2NF, and no non-prime attribute is transitively dependent on the primary key (no $X \rightarrow Y \rightarrow Z$ where $Y$ is not a superkey).
* **Boyce-Codd Normal Form (BCNF)**: For every non-trivial functional dependency $X \rightarrow Y$, $X$ must be a superkey.

---

### 2. Entity-by-Entity Normalization Audit

#### 2.1 Authentication Domain

##### `roles`
* **Candidate Keys**: `{id}`, `{name}`
* **Primary Key**: `id`
* **Alternate Keys**: `name`
* **Functional Dependencies**:
  * `id -> {name, display_name, description, created_at, updated_at}`
  * `name -> {id, display_name, description, created_at, updated_at}`
* **Normalization Analysis**:
  * **1NF**: All columns are atomic strings or timestamps.
  * **2NF**: Single-column PK; no partial dependencies.
  * **3NF**: No transitive dependencies. `display_name` and `description` depend directly on `id` and `name`.
  * **BCNF**: Both determinants (`id`, `name`) are candidate keys.
* **Design Decision**: Kept separate from `users` to support multiple roles and granular privilege expansion.

##### `users`
* **Candidate Keys**: `{id}`, `{email}`
* **Primary Key**: `id`
* **Alternate Keys**: `email`
* **Functional Dependencies**:
  * `id -> {email, password_hash, name, phone, is_active, last_login_at, created_at, updated_at}`
  * `email -> {id, password_hash, name, phone, is_active, last_login_at, created_at, updated_at}`
* **Normalization Analysis**:
  * **1NF / 2NF / 3NF / BCNF**: Satisfied. Every determinant is a superkey.
* **Design Decision**: Separates credentials and user identity from domain-specific patron profiles (`customers`).

##### `user_roles`
* **Candidate Keys**: `{user_id, role_id}`
* **Primary Key**: `(user_id, role_id)`
* **Foreign Keys**: `user_id -> users.id`, `role_id -> roles.id`
* **Functional Dependencies**:
  * `{user_id, role_id} -> {}` (pure all-key relationship)
* **Normalization Analysis**:
  * **1NF / 2NF / 3NF / BCNF**: Pure all-key junction relation. Satisfies BCNF trivially.

---

#### 2.2 Customer Domain

##### `customers`
* **Candidate Keys**: `{id}`, `{customer_code}`, `{email}`, `{user_id}` (when not null)
* **Primary Key**: `id`
* **Alternate Keys**: `customer_code`, `email`
* **Foreign Keys**: `user_id -> users.id`
* **Functional Dependencies**:
  * `id -> {user_id, customer_code, name, email, phone, city, state, status, joined_date, created_at, updated_at}`
  * `customer_code -> {id, ...}`
  * `email -> {id, ...}`
* **Normalization Analysis**:
  * **1NF**: Atomic scalar values.
  * **2NF / 3NF / BCNF**: Satisfied. All determinants are candidate keys.
  * **Derived Elimination**: Frontend attributes `ordersCount` and `totalSpent` are intentionally excluded from stored columns to avoid update anomalies and transitive dependencies.

##### `customer_addresses`
* **Candidate Keys**: `{id}`
* **Primary Key**: `id`
* **Foreign Keys**: `customer_id -> customers.id`
* **Functional Dependencies**:
  * `id -> {customer_id, recipient_name, recipient_phone, address_line, city, state, pincode, is_default, created_at, updated_at}`
* **Normalization Analysis**:
  * **1NF**: Address lines, city, state, and pincode are broken into separate atomic columns.
  * **2NF / 3NF / BCNF**: All non-key attributes depend strictly on `id`.
* **Design Decision**: Normalizes customer addresses into a 1:N relation rather than storing multiple address columns in `customers`.

---

#### 2.3 Catalog & Attribute Domain

##### `categories`
* **Candidate Keys**: `{id}`, `{code}`, `{slug}`
* **Primary Key**: `id`
* **Alternate Keys**: `code`, `slug`
* **Functional Dependencies**:
  * `id -> {code, name, slug, description, image_url, is_active, created_at, updated_at}`
  * `slug -> {id, ...}`
  * `code -> {id, ...}`
* **Normalization Analysis**:
  * **1NF / 2NF / 3NF / BCNF**: Every determinant is a candidate key.
  * **Derived Elimination**: Frontend `itemCount` is excluded. Calculated via `COUNT(products.id)`.

##### `collections`
* **Candidate Keys**: `{id}`, `{code}`, `{slug}`
* **Primary Key**: `id`
* **Alternate Keys**: `code`, `slug`
* **Functional Dependencies**:
  * `id -> {code, name, slug, subtitle, banner_url, is_active, created_at, updated_at}`
  * `slug -> {id, ...}`
  * `code -> {id, ...}`
* **Normalization Analysis**:
  * **1NF / 2NF / 3NF / BCNF**: Every determinant is a candidate key.
  * **Derived Elimination**: Frontend `itemCount` is excluded. Calculated via `COUNT(products.id)`.

##### `products`
* **Candidate Keys**: `{id}`, `{code}`, `{slug}`, `{sku}`
* **Primary Key**: `id`
* **Alternate Keys**: `code`, `slug`, `sku`
* **Foreign Keys**:
  * `category_id -> categories.id`
  * `collection_id -> collections.id`
* **Functional Dependencies**:
  * `id -> {code, name, slug, sku, category_id, collection_id, description, price, sale_price, material, care, featured, new_arrival, best_seller, status, meta_title, meta_description, created_at, updated_at}`
  * `sku -> {id, ...}`
  * `slug -> {id, ...}`
* **Normalization Analysis**:
  * **1NF**: Product arrays from frontend (`images[]`, `sizes[]`, `colors[]`, `tags[]`) are completely removed and decomposed into dedicated child and junction tables (`product_images`, `product_sizes`, `product_colors`, `product_tags`).
  * **2NF / 3NF / BCNF**: All non-prime attributes functionally depend on the product identifier. No transitive dependencies between non-keys.
  * **Derived Elimination**: `rating` and `reviewsCount` are derived from the `reviews` table and excluded from stored columns.

##### Attribute Master Tables (`sizes`, `colors`, `tags`)
* **Candidate Keys**: `{id}`, `{name}`
* **Primary Key**: `id`
* **Alternate Keys**: `name`
* **Functional Dependencies**:
  * `id -> {name, created_at, ...}`
  * `name -> {id, created_at, ...}`
* **Normalization Analysis**:
  * **1NF / 2NF / 3NF / BCNF**: Perfect 3NF/BCNF masters. Eliminates spelling variations, enables global renames, and permits faceted catalog filtering.

##### Attribute Junction Tables (`product_sizes`, `product_colors`, `product_tags`)
* **Candidate Keys**: Composite PK `(product_id, <attribute>_id)`
* **Primary Keys**: Composite PKs
* **Functional Dependencies**: All-key relations.
* **Normalization Analysis**:
  * Fully satisfy BCNF. Replaces multi-valued repeating groups with normalized binary relations.

##### `product_images`
* **Candidate Keys**: `{id}`
* **Primary Key**: `id`
* **Foreign Keys**: `product_id -> products.id`
* **Functional Dependencies**:
  * `id -> {product_id, image_url, alt_text, display_order, is_primary, created_at}`
* **Normalization Analysis**:
  * Eliminates JSON image URL arrays from the product entity. Enables arbitrary ordering and primary image designation without table alteration.

---

#### 2.4 Inventory Domain

##### `inventory`
* **Candidate Keys**: `{id}`, `{product_id}`
* **Primary Key**: `id`
* **Alternate Keys**: `product_id` (1:1 with products)
* **Foreign Keys**: `product_id -> products.id`
* **Functional Dependencies**:
  * `id -> {product_id, quantity, low_stock_threshold, created_at, updated_at}`
  * `product_id -> {id, quantity, low_stock_threshold, created_at, updated_at}`
* **Normalization Analysis**:
  * **3NF / BCNF**: Separates volatile stock level mutations from static product master data, eliminating write contention on catalog browsing tables.

##### `inventory_movements`
* **Candidate Keys**: `{id}`
* **Primary Key**: `id`
* **Foreign Keys**:
  * `inventory_id -> inventory.id`
  * `created_by -> users.id`
* **Functional Dependencies**:
  * `id -> {inventory_id, movement_type, quantity_delta, balance_after, reference_type, reference_id, notes, created_by, created_at}`
* **Normalization Analysis**:
  * **1NF / 2NF / 3NF / BCNF**: Immutable transactional log. `balance_after` is an audited point-in-time state snapshot preventing ledger recalculation overhead.

---

#### 2.5 Promotions Domain

##### `coupons`
* **Candidate Keys**: `{id}`, `{code}`
* **Primary Key**: `id`
* **Alternate Keys**: `code`
* **Functional Dependencies**:
  * `id -> {code, discount_type, value, minimum_order_amount, description, start_at, end_at, status, usage_limit, times_used, created_at, updated_at}`
  * `code -> {id, ...}`
* **Normalization Analysis**:
  * **1NF / 2NF / 3NF / BCNF**: Every determinant is a candidate key.

---

#### 2.6 Orders & Fulfillment Domain

##### `orders`
* **Candidate Keys**: `{id}`, `{order_number}`
* **Primary Key**: `id`
* **Alternate Keys**: `order_number`
* **Foreign Keys**: `customer_id -> customers.id`
* **Functional Dependencies**:
  * `id -> {order_number, customer_id, delivery_method, status, subtotal, discount_amount, shipping_amount, tax_amount, final_total, order_date, created_at, updated_at}`
  * `order_number -> {id, ...}`
* **Normalization Analysis**:
  * **1NF**: Items, payments, addresses, shipments, and status milestones are decomposed into separate tables.
  * **2NF / 3NF / BCNF**: Financial summary columns (`subtotal`, `final_total`) are stored invoices of an immutable legal transaction.

##### `order_items` (Intentional Snapshot)
* **Candidate Keys**: `{id}`
* **Primary Key**: `id`
* **Foreign Keys**:
  * `order_id -> orders.id`
  * `product_id -> products.id`
* **Functional Dependencies**:
  * `id -> {order_id, product_id, product_name_snapshot, sku_snapshot, selected_size, selected_color, unit_price, quantity, total_price, image_url_snapshot, created_at}`
* **Normalization vs. Intentional Snapshot Justification**:
  * In a theoretical non-temporal database, `product_name_snapshot` and `sku_snapshot` might appear transitively dependent on `product_id`.
  * **Crucial Architectural Rule**: An ecommerce order is a legally binding historical transaction. If a product title, price, or SKU is updated in the catalog six months later, the historical order invoice must **never** change. Therefore, `product_name_snapshot`, `sku_snapshot`, `unit_price`, and `image_url_snapshot` are **point-in-time immutable transactional attributes of the order line itself**, functionally dependent on `order_items.id`. This satisfies 3NF under temporal entity modeling.

##### `order_addresses` (Intentional Snapshot)
* **Candidate Keys**: `{id}`, `{order_id}`
* **Primary Key**: `id`
* **Alternate Keys**: `order_id` (1:1 with orders)
* **Foreign Keys**: `order_id -> orders.id`
* **Functional Dependencies**:
  * `id -> {order_id, recipient_name, recipient_phone, address_line, city, state, pincode, created_at}`
* **Normalization vs. Intentional Snapshot Justification**:
  * Customer addresses in `customer_addresses` are mutable (the patron may edit their address next week). The delivery destination for a dispatched package must remain permanently fixed as shipped. Storing the address snapshot per order is legally required and satisfies 3NF for historical fulfillment.

##### `order_payments`
* **Candidate Keys**: `{id}`, `{transaction_id}`
* **Primary Key**: `id`
* **Alternate Keys**: `transaction_id`
* **Foreign Keys**: `order_id -> orders.id`
* **Functional Dependencies**:
  * `id -> {order_id, payment_method, payment_status, transaction_id, amount, paid_at, gateway_response, created_at, updated_at}`
* **Normalization Analysis**:
  * Normalized payment transactions into a dedicated entity, supporting multiple partial payments or refund transactions.

##### `shipments`
* **Candidate Keys**: `{id}`, `{order_id}`
* **Primary Key**: `id`
* **Alternate Keys**: `order_id` (1:1 in initial phase; easily upgradable to 1:N for split shipments)
* **Foreign Keys**: `order_id -> orders.id`
* **Functional Dependencies**:
  * `id -> {order_id, carrier_name, tracking_number, tracking_url, shipping_date, expected_delivery, dispatched_at, delivered_at, created_at, updated_at}`
* **Normalization Analysis**:
  * Normalizes courier logistics away from order master records.

##### `order_status_history`
* **Candidate Keys**: `{id}`
* **Primary Key**: `id`
* **Foreign Keys**:
  * `order_id -> orders.id`
  * `changed_by -> users.id`
* **Functional Dependencies**:
  * `id -> {order_id, status, note, changed_by, changed_at, created_at}`
* **Normalization Analysis**:
  * Append-only transition ledger. Fully in BCNF.

##### `order_coupons` (Intentional Snapshot)
* **Candidate Keys**: `{id}`, `{order_id, coupon_id}`
* **Primary Key**: `id`
* **Foreign Keys**:
  * `order_id -> orders.id`
  * `coupon_id -> coupons.id`
* **Functional Dependencies**:
  * `id -> {order_id, coupon_id, coupon_code_snapshot, discount_type_snapshot, discount_value_snapshot, applied_discount_amount, created_at}`
* **Normalization vs. Intentional Snapshot Justification**:
  * Preserves the exact voucher discount rate and calculated deduction at purchase time, even if the coupon terms are subsequently modified or expired.

---

#### 2.7 Reviews, Enquiries & CMS Domain

##### `reviews`
* **Candidate Keys**: `{id}`, `{order_item_id, customer_id}` (for verified item reviews)
* **Primary Key**: `id`
* **Foreign Keys**:
  * `product_id -> products.id`
  * `customer_id -> customers.id`
  * `order_id -> orders.id`
  * `order_item_id -> order_items.id`
  * `moderated_by -> users.id`
* **Functional Dependencies**:
  * `id -> {product_id, customer_id, order_id, order_item_id, rating, title, comment, status, is_verified_purchase, submitted_at, moderated_at, moderated_by, created_at, updated_at}`
* **Normalization Analysis**:
  * Completely removes raw customer/product strings from master relations. Links directly to normalized customer, product, and order item entities.

##### `enquiries`
* **Candidate Keys**: `{id}`
* **Primary Key**: `id`
* **Foreign Keys**: `customer_id -> customers.id` (nullable)
* **Functional Dependencies**:
  * `id -> {customer_id, contact_name, contact_email, contact_phone, message, status, submitted_at, created_at, updated_at}`
* **Normalization Analysis**:
  * Supports anonymous inquiries without violating referential integrity, while linking registered patrons where available.

##### `store_settings`, `homepage_announcement`, `homepage_hero`, `homepage_promo_banner`
* **Candidate Keys**: `{id}`
* **Primary Key**: `id`
* **Normalization Analysis**:
  * Strictly typed relational columns. Replaces fragile key-value EAV antipatterns (`settings(key, value)`) with compile-time verified columns.
