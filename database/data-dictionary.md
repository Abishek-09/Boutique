# Database Data Dictionary
## Maison D'Or Boutique Production Schema

This document details every table, column, data type, key constraint, and business rule for all 32 normalized tables in the MySQL schema.

---

### Table of Contents
1. [Authentication & Access](#1-authentication--access)
   - `roles`
   - `users`
   - `user_roles`
2. [Customers & Address Book](#2-customers--address-book)
   - `customers`
   - `customer_addresses`
3. [Catalog Hierarchy](#3-catalog-hierarchy)
   - `categories`
   - `collections`
   - `products`
   - `product_images`
4. [Product Attributes & Junctions](#4-product-attributes--junctions)
   - `sizes`
   - `product_sizes`
   - `colors`
   - `product_colors`
   - `tags`
   - `product_tags`
5. [Inventory & Stock Ledger](#5-inventory--stock-ledger)
   - `inventory`
   - `inventory_movements`
6. [Promotions & Coupons](#6-promotions--coupons)
   - `coupons`
7. [Orders & Invoicing Architecture](#7-orders--invoicing-architecture)
   - `orders`
   - `order_items`
   - `order_addresses`
   - `order_payments`
   - `shipments`
   - `order_status_history`
   - `order_coupons`
8. [Patron Feedback & Moderation](#8-patron-feedback--moderation)
   - `reviews`
9. [Customer Concierge Communication](#9-customer-concierge-communication)
   - `enquiries`
10. [Store Configuration](#10-store-configuration)
    - `store_settings`
11. [Homepage CMS](#11-homepage-cms)
    - `homepage_announcement`
    - `homepage_hero`
    - `homepage_promo_banner`

---

### 1. Authentication & Access

#### 1.1 `roles`
Defines system access roles for store administration and patrons.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `name` | VARCHAR(50) | NO | None | UNIQUE | Internal role identifier (`admin`, `store_manager`, `customer`) |
| `display_name` | VARCHAR(100) | NO | None | None | Human-readable role name (e.g., "Boutique Director & Store Manager") |
| `description` | VARCHAR(255) | YES | NULL | None | Detailed description of privileges |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Audit creation timestamp |
| `updated_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Audit modification timestamp |

#### 1.2 `users`
Administrative and customer authentication identities.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `email` | VARCHAR(191) | NO | None | UNIQUE | Login email address |
| `password_hash` | VARCHAR(255) | NO | None | None | Bcrypt/Argon2 cryptographic password hash |
| `name` | VARCHAR(100) | NO | None | None | Full name of account holder |
| `phone` | VARCHAR(20) | YES | NULL | None | Contact telephone |
| `is_active` | BOOLEAN | NO | TRUE | None | Account status flag |
| `last_login_at` | TIMESTAMP | YES | NULL | None | Last recorded login time |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Audit creation timestamp |
| `updated_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Audit modification timestamp |

#### 1.3 `user_roles`
Many-to-many junction assigning roles to user accounts.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `user_id` | BIGINT UNSIGNED | NO | None | PK, FK | References `users(id)` ON DELETE CASCADE |
| `role_id` | BIGINT UNSIGNED | NO | None | PK, FK | References `roles(id)` ON DELETE RESTRICT |

---

### 2. Customers & Address Book

#### 2.1 `customers`
Boutique patron profiles.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `user_id` | BIGINT UNSIGNED | YES | NULL | UNIQUE, FK | References `users(id)` ON DELETE SET NULL |
| `customer_code` | VARCHAR(50) | NO | None | UNIQUE | Business identifier (e.g., `CUST-001`) |
| `name` | VARCHAR(100) | NO | None | None | Full patron name |
| `email` | VARCHAR(191) | NO | None | UNIQUE | Patron contact email |
| `phone` | VARCHAR(30) | NO | None | None | Patron primary phone |
| `city` | VARCHAR(100) | YES | NULL | None | Primary patron directory city |
| `state` | VARCHAR(100) | YES | NULL | None | Primary patron directory state |
| `status` | ENUM | NO | 'active' | Values: `'active'`, `'inactive'`, `'blocked'` | Patron account status |
| `joined_date` | DATE | NO | None | None | Registration date |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Audit creation timestamp |
| `updated_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Audit modification timestamp |

*Note: `ordersCount` and `totalSpent` from frontend mock are explicitly derived via `COUNT(orders.id)` and `SUM(orders.final_total)`.*

#### 2.2 `customer_addresses`
Mutable address book for registered patrons.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `customer_id` | BIGINT UNSIGNED | NO | None | FK | References `customers(id)` ON DELETE CASCADE |
| `recipient_name` | VARCHAR(100) | NO | None | None | Recipient full name |
| `recipient_phone` | VARCHAR(30) | NO | None | None | Delivery contact phone |
| `address_line` | VARCHAR(255) | NO | None | None | Flat/House, Building, Street |
| `city` | VARCHAR(100) | NO | None | None | Delivery city |
| `state` | VARCHAR(100) | NO | None | None | Delivery state / province |
| `pincode` | VARCHAR(20) | NO | None | None | Postal PIN / ZIP code |
| `is_default` | BOOLEAN | NO | FALSE | None | Default delivery address indicator |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Audit creation timestamp |
| `updated_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Audit modification timestamp |

---

### 3. Catalog Hierarchy

#### 3.1 `categories`
Master product classification taxonomy.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `code` | VARCHAR(50) | NO | None | UNIQUE | Business identifier (e.g., `cat-sarees`) |
| `name` | VARCHAR(100) | NO | None | None | Category display title |
| `slug` | VARCHAR(100) | NO | None | UNIQUE | SEO URL slug |
| `description` | TEXT | YES | NULL | None | Curatorial narrative description |
| `image_url` | VARCHAR(500) | YES | NULL | None | Hero banner/thumbnail image URL |
| `is_active` | BOOLEAN | NO | TRUE | None | Active visibility status |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Audit creation timestamp |
| `updated_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Audit modification timestamp |

*Note: `itemCount` is derived via `COUNT(products.id) WHERE category_id = categories.id`.*

#### 3.2 `collections`
Curated thematic and seasonal atelier showcases.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `code` | VARCHAR(50) | NO | None | UNIQUE | Business identifier (e.g., `col-festive`) |
| `name` | VARCHAR(100) | NO | None | None | Collection showcase name |
| `slug` | VARCHAR(100) | NO | None | UNIQUE | SEO URL slug |
| `subtitle` | VARCHAR(255) | YES | NULL | None | Poetic collection subtitle |
| `banner_url` | VARCHAR(500) | YES | NULL | None | High-resolution banner image URL |
| `is_active` | BOOLEAN | NO | TRUE | None | Active visibility status |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Audit creation timestamp |
| `updated_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Audit modification timestamp |

*Note: `itemCount` is derived via `COUNT(products.id) WHERE collection_id = collections.id`.*

#### 3.3 `products`
Core catalog merchandise items.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `code` | VARCHAR(50) | NO | None | UNIQUE | External identifier (e.g., `prod-001`) |
| `name` | VARCHAR(255) | NO | None | None | Full product display title |
| `slug` | VARCHAR(255) | NO | None | UNIQUE | SEO URL slug |
| `sku` | VARCHAR(100) | NO | None | UNIQUE | Stock Keeping Unit |
| `category_id` | BIGINT UNSIGNED | NO | None | FK | References `categories(id)` ON DELETE RESTRICT |
| `collection_id` | BIGINT UNSIGNED | YES | NULL | FK | References `collections(id)` ON DELETE SET NULL |
| `description` | TEXT | YES | NULL | None | Detailed artisanal product description |
| `price` | DECIMAL(12,2) | NO | None | CHECK (`price` >= 0) | Standard retail list price in INR |
| `sale_price` | DECIMAL(12,2) | YES | NULL | CHECK (`sale_price` <= `price`) | Promotional sale price |
| `material` | VARCHAR(255) | YES | NULL | None | Fabric & weave composition |
| `care` | TEXT | YES | NULL | None | Garment care and preservation guidelines |
| `featured` | BOOLEAN | NO | FALSE | None | Featured on homepage flag |
| `new_arrival` | BOOLEAN | NO | FALSE | None | New arrival showcase flag |
| `best_seller` | BOOLEAN | NO | FALSE | None | Best seller badge flag |
| `status` | ENUM | NO | 'published' | Values: `'draft'`, `'published'`, `'archived'` | Catalog publishing status |
| `meta_title` | VARCHAR(255) | YES | NULL | None | SEO HTML `<title>` tag |
| `meta_description`| TEXT | YES | NULL | None | SEO meta description |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Audit creation timestamp |
| `updated_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Audit modification timestamp |

*Note: `rating` and `reviewsCount` are derived from `reviews` table (`AVG(rating)` and `COUNT(*)` where `status = 'approved'`).*

#### 3.4 `product_images`
Ordered media gallery for products.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `product_id` | BIGINT UNSIGNED | NO | None | FK | References `products(id)` ON DELETE CASCADE |
| `image_url` | VARCHAR(500) | NO | None | None | Asset URL (CDN or remote storage) |
| `alt_text` | VARCHAR(255) | YES | NULL | None | Accessibility image description |
| `display_order` | INT | NO | 0 | None | Sequence order for gallery display |
| `is_primary` | BOOLEAN | NO | FALSE | None | Primary card cover image flag |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Audit creation timestamp |

---

### 4. Product Attributes & Junctions

#### 4.1 `sizes`
Master size catalog.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `name` | VARCHAR(100) | NO | None | UNIQUE | Size title (e.g., `XS`, `Free Size (5.5m + 0.8m Blouse)`) |
| `code` | VARCHAR(30) | YES | NULL | None | Standard size shorthand code |
| `sort_order` | INT | NO | 0 | None | UI sorting order |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Audit creation timestamp |

#### 4.2 `product_sizes`
Junction mapping available sizes to products.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `product_id` | BIGINT UNSIGNED | NO | None | PK, FK | References `products(id)` ON DELETE CASCADE |
| `size_id` | BIGINT UNSIGNED | NO | None | PK, FK | References `sizes(id)` ON DELETE RESTRICT |

#### 4.3 `colors`
Master color palette catalog.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `name` | VARCHAR(100) | NO | None | UNIQUE | Color name (e.g., `Deep Crimson`, `Pistachio Sage`) |
| `hex_code` | VARCHAR(20) | YES | NULL | None | Hexadecimal CSS color value |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Audit creation timestamp |

#### 4.4 `product_colors`
Junction mapping available colors to products.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `product_id` | BIGINT UNSIGNED | NO | None | PK, FK | References `products(id)` ON DELETE CASCADE |
| `color_id` | BIGINT UNSIGNED | NO | None | PK, FK | References `colors(id)` ON DELETE RESTRICT |

#### 4.5 `tags`
Master taxonomy tags for search and filtering.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `name` | VARCHAR(50) | NO | None | UNIQUE | Tag keyword (e.g., `silk`, `festive`, `banarasi`) |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Audit creation timestamp |

#### 4.6 `product_tags`
Junction mapping tags to products.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `product_id` | BIGINT UNSIGNED | NO | None | PK, FK | References `products(id)` ON DELETE CASCADE |
| `tag_id` | BIGINT UNSIGNED | NO | None | PK, FK | References `tags(id)` ON DELETE CASCADE |

---

### 5. Inventory & Stock Ledger

#### 5.1 `inventory`
Real-time available stock state per product (1:1 with `products`).

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `product_id` | BIGINT UNSIGNED | NO | None | UNIQUE, FK | References `products(id)` ON DELETE RESTRICT |
| `quantity` | INT | NO | 0 | CHECK (`quantity` >= 0) | Current units physically available |
| `low_stock_threshold`| INT | NO | 3 | CHECK (`low_stock_threshold` >= 0) | Low inventory threshold for alert badges |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Audit creation timestamp |
| `updated_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Audit modification timestamp |

#### 5.2 `inventory_movements`
Immutable audit ledger of every inventory change.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `inventory_id` | BIGINT UNSIGNED | NO | None | FK | References `inventory(id)` ON DELETE RESTRICT |
| `movement_type` | ENUM | NO | None | Values: `'initial_stock'`, `'manual_adjustment'`, `'order_deduction'`, `'order_cancellation_restock'`, `'return_restock'` | Business reason for movement |
| `quantity_delta` | INT | NO | None | None | Change in stock (+/- integer) |
| `balance_after` | INT | NO | None | CHECK (`balance_after` >= 0) | Running stock balance after transaction |
| `reference_type` | VARCHAR(50) | YES | NULL | None | Originating entity (`order`, `manual_admin`) |
| `reference_id` | VARCHAR(100) | YES | NULL | None | Originating entity key (e.g., `BTQ-2026-001`) |
| `notes` | VARCHAR(255) | YES | NULL | None | Operator explanatory notes |
| `created_by` | BIGINT UNSIGNED | YES | NULL | FK | References `users(id)` ON DELETE SET NULL |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Immutable transaction timestamp |

---

### 6. Promotions & Coupons

#### 6.1 `coupons`
Voucher promotion definitions and discount engine parameters.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `code` | VARCHAR(50) | NO | None | UNIQUE | Promo code (e.g., `WELCOME10`, `LUXE500`) |
| `discount_type` | ENUM | NO | None | Values: `'percentage'`, `'flat'`, `'shipping'` | Mode of discount computation |
| `value` | DECIMAL(12,2) | NO | None | CHECK (`value` > 0) | Percentage rate or flat currency amount |
| `minimum_order_amount`| DECIMAL(12,2)| NO | 0.00 | CHECK (`minimum_order_amount` >= 0) | Minimum subtotal required |
| `description` | VARCHAR(255) | NO | None | None | Patron-facing promotional terms |
| `start_at` | DATETIME | NO | None | None | Validity start date |
| `end_at` | DATETIME | NO | None | None | Validity expiration date |
| `status` | ENUM | NO | 'active' | Values: `'active'`, `'paused'`, `'expired'` | Operational coupon status |
| `usage_limit` | INT UNSIGNED | YES | NULL | None | Maximum permitted global redemptions |
| `times_used` | INT UNSIGNED | NO | 0 | None | Total recorded redemptions |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Audit creation timestamp |
| `updated_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Audit modification timestamp |

---

### 7. Orders & Invoicing Architecture

#### 7.1 `orders`
Master sales order header.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `order_number` | VARCHAR(50) | NO | None | UNIQUE | Formatted customer-facing invoice number (e.g., `BTQ-2026-001`) |
| `customer_id` | BIGINT UNSIGNED | NO | None | FK | References `customers(id)` ON DELETE RESTRICT |
| `delivery_method` | ENUM | NO | 'standard' | Values: `'standard'`, `'express'` | Shipping service level |
| `status` | ENUM | NO | 'Placed' | Values: `'Placed'`, `'Confirmed'`, `'Processing'`, `'Shipped'`, `'Delivered'`, `'Cancelled'`, `'Return Requested'`, `'Returned'`, `'Refunded'` | Current fulfillment lifecycle status |
| `subtotal` | DECIMAL(12,2) | NO | None | CHECK (`subtotal` >= 0) | Raw sum of purchase item totals |
| `discount_amount`| DECIMAL(12,2)| NO | 0.00 | CHECK (`discount_amount` >= 0) | Total promotional discount applied |
| `shipping_amount`| DECIMAL(12,2)| NO | 0.00 | CHECK (`shipping_amount` >= 0) | Shipping charge |
| `tax_amount` | DECIMAL(12,2) | NO | 0.00 | CHECK (`tax_amount` >= 0) | Calculated GST tax (5%) |
| `final_total` | DECIMAL(12,2) | NO | None | CHECK (`final_total` >= 0) | Final payable amount |
| `order_date` | DATETIME | NO | None | None | Purchase timestamp |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Record creation timestamp |
| `updated_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Record modification timestamp |

#### 7.2 `order_items`
Line items with historical snapshots.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `order_id` | BIGINT UNSIGNED | NO | None | FK | References `orders(id)` ON DELETE RESTRICT |
| `product_id` | BIGINT UNSIGNED | NO | None | FK | References `products(id)` ON DELETE RESTRICT |
| `product_name_snapshot` | VARCHAR(255) | NO | None | None | Immutable snapshot of product title at purchase |
| `sku_snapshot` | VARCHAR(100) | NO | None | None | Immutable snapshot of product SKU at purchase |
| `selected_size` | VARCHAR(100) | NO | None | None | Size selected by patron |
| `selected_color` | VARCHAR(100) | NO | None | None | Color selected by patron |
| `unit_price` | DECIMAL(12,2) | NO | None | CHECK (`unit_price` >= 0) | Effective unit price charged at purchase |
| `quantity` | INT | NO | None | CHECK (`quantity` > 0) | Number of units purchased |
| `total_price` | DECIMAL(12,2) | NO | None | CHECK (`total_price` >= 0) | `unit_price * quantity` |
| `image_url_snapshot` | VARCHAR(500) | YES | NULL | None | Snapshot of product cover image URL |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Record creation timestamp |

#### 7.3 `order_addresses`
Immutable order-time shipping address snapshot.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `order_id` | BIGINT UNSIGNED | NO | None | UNIQUE, FK | References `orders(id)` ON DELETE RESTRICT |
| `recipient_name` | VARCHAR(100) | NO | None | None | Recipient name on package label |
| `recipient_phone`| VARCHAR(30) | NO | None | None | Recipient contact phone |
| `address_line` | VARCHAR(255) | NO | None | None | Street address |
| `city` | VARCHAR(100) | NO | None | None | City |
| `state` | VARCHAR(100) | NO | None | None | State |
| `pincode` | VARCHAR(20) | NO | None | None | PIN Code |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Record creation timestamp |

#### 7.4 `order_payments`
Payment transactions and gateway authorization records.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `order_id` | BIGINT UNSIGNED | NO | None | FK | References `orders(id)` ON DELETE RESTRICT |
| `payment_method` | VARCHAR(100) | NO | None | None | Payment channel (Credit Card, NetBanking, UPI, COD) |
| `payment_status` | ENUM | NO | None | Values: `'Pending'`, `'Authorized'`, `'Paid'`, `'Failed'`, `'Refunded'` | Payment settlement status |
| `transaction_id` | VARCHAR(100) | NO | None | UNIQUE | Gateway authorization or reference ID |
| `amount` | DECIMAL(12,2) | NO | None | CHECK (`amount` >= 0) | Amount captured |
| `paid_at` | DATETIME | YES | NULL | None | Timestamp when payment succeeded |
| `gateway_response`| TEXT | YES | NULL | None | Serialized gateway response (excluding card details) |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Record creation timestamp |
| `updated_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Record modification timestamp |

#### 7.5 `shipments`
Logistics carrier assignment and tracking details.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `order_id` | BIGINT UNSIGNED | NO | None | UNIQUE, FK | References `orders(id)` ON DELETE RESTRICT |
| `carrier_name` | VARCHAR(100) | NO | None | None | Courier partner (`BlueDart Express`, `DTDC`, `Delhivery`) |
| `tracking_number`| VARCHAR(100) | NO | None | None | Air Waybill (AWB) tracking number |
| `tracking_url` | VARCHAR(500) | YES | NULL | None | Direct courier tracking portal link |
| `shipping_date` | DATE | NO | None | None | Date parcel was dispatched |
| `expected_delivery`| VARCHAR(100)| YES | NULL | None | Delivery estimate promise |
| `dispatched_at` | DATETIME | YES | NULL | None | Exact dispatch timestamp |
| `delivered_at` | DATETIME | YES | NULL | None | Final delivery confirmation timestamp |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Record creation timestamp |
| `updated_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Record modification timestamp |

#### 7.6 `order_status_history`
Append-only log of order lifecycle transitions.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `order_id` | BIGINT UNSIGNED | NO | None | FK | References `orders(id)` ON DELETE RESTRICT |
| `status` | ENUM | NO | None | Values: `'Placed'`, `'Confirmed'`, `'Processing'`, `'Shipped'`, `'Delivered'`, `'Cancelled'`, `'Return Requested'`, `'Returned'`, `'Refunded'` | Milestone reached |
| `note` | TEXT | YES | NULL | None | Operational context or customer-facing remarks |
| `changed_by` | BIGINT UNSIGNED | YES | NULL | FK | References `users(id)` ON DELETE SET NULL |
| `changed_at` | DATETIME | NO | None | None | Milestone timestamp |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Audit record timestamp |

#### 7.7 `order_coupons`
Historical audit of promotional vouchers redeemed against orders.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `order_id` | BIGINT UNSIGNED | NO | None | FK | References `orders(id)` ON DELETE RESTRICT |
| `coupon_id` | BIGINT UNSIGNED | NO | None | FK | References `coupons(id)` ON DELETE RESTRICT |
| `coupon_code_snapshot` | VARCHAR(50) | NO | None | None | Code applied at time of purchase |
| `discount_type_snapshot`| ENUM | NO | None | Values: `'percentage'`, `'flat'`, `'shipping'` | Applied discount mechanism |
| `discount_value_snapshot`| DECIMAL(12,2)| NO | None | None | Applied rate or amount |
| `applied_discount_amount`| DECIMAL(12,2)| NO | None | CHECK (`applied_discount_amount` >= 0) | Exact currency reduction on invoice |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Record creation timestamp |

---

### 8. Patron Feedback & Moderation

#### 8.1 `reviews`
Verified buyer product reviews and moderation queue.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `product_id` | BIGINT UNSIGNED | NO | None | FK | References `products(id)` ON DELETE RESTRICT |
| `customer_id` | BIGINT UNSIGNED | NO | None | FK | References `customers(id)` ON DELETE RESTRICT |
| `order_id` | BIGINT UNSIGNED | YES | NULL | FK | References `orders(id)` ON DELETE SET NULL |
| `order_item_id` | BIGINT UNSIGNED | YES | NULL | FK, UNIQUE with `customer_id` | References `order_items(id)` ON DELETE SET NULL |
| `rating` | TINYINT UNSIGNED | NO | None | CHECK (`rating` >= 1 AND `rating` <= 5) | Star rating (1 to 5) |
| `title` | VARCHAR(255) | NO | None | None | Review headline |
| `comment` | TEXT | NO | None | None | Detailed testimonial body |
| `status` | ENUM | NO | 'pending' | Values: `'pending'`, `'approved'`, `'rejected'` | Moderation status |
| `is_verified_purchase` | BOOLEAN | NO | TRUE | None | Verified patron order badge flag |
| `submitted_at` | DATETIME | NO | None | None | Submission timestamp |
| `moderated_at` | DATETIME | YES | NULL | None | Approval/rejection timestamp |
| `moderated_by` | BIGINT UNSIGNED | YES | NULL | FK | References `users(id)` ON DELETE SET NULL |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Record creation timestamp |
| `updated_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Record modification timestamp |

---

### 9. Customer Concierge Communication

#### 9.1 `enquiries`
Concierge inquiries submitted from the boutique contact page.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Surrogate primary key |
| `customer_id` | BIGINT UNSIGNED | YES | NULL | FK | References `customers(id)` ON DELETE SET NULL |
| `contact_name` | VARCHAR(100) | NO | None | None | Inquirer contact name |
| `contact_email`| VARCHAR(191) | NO | None | None | Inquirer email address |
| `contact_phone`| VARCHAR(30) | NO | None | None | Inquirer telephone |
| `message` | TEXT | NO | None | None | Inquirer custom tailoring/bridal query |
| `status` | ENUM | NO | 'New' | Values: `'New'`, `'Contacted'`, `'Resolved'` | Concierge resolution state |
| `submitted_at` | DATETIME | NO | None | None | Inquiry timestamp |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Record creation timestamp |
| `updated_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Record modification timestamp |

---

### 10. Store Configuration

#### 10.1 `store_settings`
Singleton operational configuration for the boutique atelier.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Singleton row primary key (`id = 1`) |
| `boutique_name` | VARCHAR(150) | NO | None | None | Legal business name (`Maison D'Or Heritage Atelier`) |
| `tagline` | VARCHAR(255) | YES | NULL | None | Brand marketing tagline |
| `currency_code` | VARCHAR(10) | NO | 'INR' | None | ISO 4217 currency code |
| `currency_symbol` | VARCHAR(5) | NO | '₹' | None | Currency display symbol |
| `gst_number` | VARCHAR(30) | NO | None | None | Tax GSTIN identifier |
| `phone` | VARCHAR(50) | NO | None | None | Concierge telephone |
| `email` | VARCHAR(191) | NO | None | None | Concierge support email |
| `flagship_address` | TEXT | NO | None | None | Physical atelier flagship location |
| `visiting_hours` | VARCHAR(255) | NO | None | None | Store visiting schedule |
| `free_shipping_threshold` | DECIMAL(12,2) | NO | 1999.00 | CHECK (`free_shipping_threshold` >= 0) | Minimum order subtotal for free delivery |
| `standard_shipping_fee` | DECIMAL(12,2) | NO | 150.00 | CHECK (`standard_shipping_fee` >= 0) | Standard shipping cost below threshold |
| `instagram_handle` | VARCHAR(100) | YES | NULL | None | Official Instagram handle |
| `whatsapp_number` | VARCHAR(30) | YES | NULL | None | Official WhatsApp concierge number |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Record creation timestamp |
| `updated_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Record modification timestamp |

---

### 11. Homepage CMS

#### 11.1 `homepage_announcement`
Top announcement strip CMS.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Primary key |
| `text` | VARCHAR(255) | NO | None | None | Announcement banner copy |
| `is_enabled` | BOOLEAN | NO | TRUE | None | Active visibility toggle |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Audit creation timestamp |
| `updated_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Audit modification timestamp |

#### 11.2 `homepage_hero`
Main storefront campaign hero showcase.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Primary key |
| `title` | VARCHAR(255) | NO | None | None | Main hero banner headline |
| `subtitle` | TEXT | YES | NULL | None | Hero introductory narrative copy |
| `image_url` | VARCHAR(500) | NO | None | None | Background hero photography URL |
| `primary_btn_text` | VARCHAR(100) | NO | None | None | Primary CTA button label |
| `primary_btn_link` | VARCHAR(255) | NO | None | None | Primary CTA target route |
| `secondary_btn_text` | VARCHAR(100) | YES | NULL | None | Secondary CTA button label |
| `secondary_btn_link` | VARCHAR(255) | YES | NULL | None | Secondary CTA target route |
| `status` | ENUM | NO | 'published' | Values: `'draft'`, `'published'` | Publishing state |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Audit creation timestamp |
| `updated_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Audit modification timestamp |

#### 11.3 `homepage_promo_banner`
Mid-page featured campaign banner.

| Column | Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | Primary key |
| `badge` | VARCHAR(100) | YES | NULL | None | Eyebrow campaign chip text |
| `title` | VARCHAR(255) | NO | None | None | Promotion headline |
| `subtitle` | TEXT | YES | NULL | None | Promotional campaign description |
| `image_url` | VARCHAR(500) | NO | None | None | Campaign banner photography URL |
| `button_text` | VARCHAR(100) | NO | None | None | CTA button label |
| `button_link` | VARCHAR(255) | NO | None | None | CTA destination route |
| `status` | ENUM | NO | 'published' | Values: `'draft'`, `'published'` | Publishing state |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | None | Audit creation timestamp |
| `updated_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Audit modification timestamp |
