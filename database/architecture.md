# Production MySQL Database Architecture Specification
## Maison D'Or Boutique Atelier (Boutique-Static-Site-main)

---

### 1. Executive Summary & Design Principles

This document defines the production relational database architecture for the **Maison D'Or Boutique** luxury ecommerce platform, reverse-engineered and strictly derived from the existing React/Vite storefront and administration frontend.

The database is designed according to enterprise standards developed over 15+ years of high-volume MySQL production experience. It adheres to the following core tenets:

1. **Strict Normalization (1NF, 2NF, 3NF, BCNF)**: Zero comma-separated values, zero unindexed JSON arrays representing relationships, zero repeated attribute groups, and complete elimination of transitive/partial functional dependencies.
2. **Auditability & Financial Immutability**: Historical financial and fulfillment snapshots (`order_items`, `order_addresses`, `order_coupons`, `order_payments`) are strictly preserved. Future changes to catalog products or customer profile addresses will **never** alter settled historical invoices or delivery records.
3. **No Phantom Derived Master Data**: Fields displayed in the frontend such as `rating`, `reviewsCount`, `itemCount`, `ordersCount`, `totalSpent`, and `reviewGiven` are calculated via relational queries or materialized reporting views, never stored as unverified mutable master flags.
4. **Resilient Primary & Foreign Keys**: Synthetic surrogate `BIGINT UNSIGNED AUTO_INCREMENT` keys for internal stability and performant B-Tree clustering, with natural business identifiers (`SKU`, `order_number`, `coupon_code`, `slug`, `email`) strictly guarded by `UNIQUE` indexes.
5. **Zero-Trust Constraint Enforcement**: Database-level `CHECK` constraints, strict `ENUM` definitions, foreign key integrity rules (`RESTRICT`, `CASCADE`, `SET NULL`), and non-nullable guarantees ensure the database cannot be corrupted by client-side bugs or incomplete payload submissions.

---

### 2. High-Level Entity Catalog (32 Tables)

The database schema comprises **32 normalized tables**, structured across 11 functional domains:

| Domain | Entities | Count |
| :--- | :--- | :--- |
| **Authentication & Access** | `roles`, `users`, `user_roles` | 3 |
| **Patron / Customers** | `customers`, `customer_addresses` | 2 |
| **Catalog Hierarchy** | `categories`, `collections`, `products`, `product_images` | 4 |
| **Product Attributes (Normalized)** | `sizes`, `product_sizes`, `colors`, `product_colors`, `tags`, `product_tags` | 6 |
| **Inventory & Stock Tracking** | `inventory`, `inventory_movements` | 2 |
| **Promotions & Offers** | `coupons` | 1 |
| **Order Processing & Invoicing** | `orders`, `order_items`, `order_addresses`, `order_payments`, `shipments`, `order_status_history`, `order_coupons` | 7 |
| **Feedback & Moderation** | `reviews` | 1 |
| **Customer Concierge** | `enquiries` | 1 |
| **Atelier Configuration** | `store_settings` | 1 |
| **Homepage CMS** | `homepage_announcement`, `homepage_hero`, `homepage_promo_banner` | 3 |
| **Total** | | **32** |

---

### 3. Storage Engine, Character Set, and Global Parameters

* **Storage Engine**: `InnoDB` for full ACID transaction compliance, row-level locking, and foreign key enforcement.
* **Character Set & Collation**:
  * Default Character Set: `utf8mb4`
  * Default Collation: `utf8mb4_unicode_ci` (or `utf8mb4_0900_ai_ci` in MySQL 8.0+)
  * *Rationale*: Full support for multi-byte Unicode characters, emojis, regional Indian textile names, currency symbols (`₹`), and internationalized address strings.
* **SQL Mode (Production Requirement)**:
  ```sql
  SET GLOBAL sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION,ONLY_FULL_GROUP_BY';
  ```
* **Timezone Standard**: All temporal audit columns (`created_at`, `updated_at`, `submitted_at`, `dispatched_at`) use `DATETIME` or `TIMESTAMP` stored in UTC. Local time display (`Asia/Kolkata`, IST +05:30) is performed at the application presentation layer.

---

### 4. Technical Analysis of Frontend-to-Database Architectural Gaps

During comprehensive inspection of the existing React frontend, several critical design discrepancies and bugs were identified. The database architecture addresses these as follows:

#### 4.1 GSTIN / GST Number Inconsistency
* **Frontend Finding**: In [AdminSettingsPage.jsx](file:///d:/Boutique/src/pages/admin/AdminSettingsPage.jsx#L78-L82), the state initializes with `gstNumber: '29AAACM1234F1Z8'`. However, the `<input>` control renders `value={settings.gstNumber}` while its `onChange` event mutates `settings.gstin`.
* **Database Resolution**: The authoritative relational column is defined as `store_settings.gst_number VARCHAR(30) NOT NULL`. The backend serialization layer must map both incoming `gstin` and `gstNumber` keys to this authoritative column.

#### 4.2 Order-Level vs. Item-Level Review Tracking (`reviewGiven`)
* **Frontend Finding**: In [orderService.js](file:///d:/Boutique/src/services/orderService.js#L184-L192) and [ReviewModal.jsx](file:///d:/Boutique/src/components/order/ReviewModal.jsx#L38-L40), submitting a review calls `orderService.markReviewSubmitted(order.id)`, setting a boolean `reviewGiven: true` on the entire order object. However, a luxury order can contain multiple distinct items (e.g. Saree + Jewellery + Bag).
* **Database Resolution**: `reviewGiven` is eliminated as a database column. The `reviews` table establishes granular relationships:
  * `reviews.order_id -> orders.id`
  * `reviews.order_item_id -> order_items.id`
  * `reviews.product_id -> products.id`
  * `reviews.customer_id -> customers.id`
  A database `UNIQUE(order_item_id, customer_id)` constraint guarantees that a customer can only submit one review per purchased item.

#### 4.3 Free-Text/Slug Foreign Keys vs. Relational Identifiers
* **Frontend Finding**: Products in [products.js](file:///d:/Boutique/src/data/products.js) store category and collection as raw slug strings: `category: 'sarees'`, `collection: 'royal-banarasi'`.
* **Database Resolution**: Normalized foreign keys:
  * `products.category_id -> categories.id` (MANDATORY, `ON DELETE RESTRICT`)
  * `products.collection_id -> collections.id` (NULLABLE, `ON DELETE SET NULL`)
  Slugs remain unique search identifiers on master tables, while relational joins utilize high-efficiency 64-bit integer keys.

#### 4.4 Multi-Valued Attributes (Sizes, Colors, Tags, Images)
* **Frontend Finding**: The frontend product object represents sizes, colors, and tags as arrays or comma-delimited strings (`sizes: ['XS', 'S']`, `tags: 'silk, festive'`).
* **Database Resolution**: 1NF compliance via dedicated junction and child tables:
  * `product_sizes` junction referencing `sizes` master
  * `product_colors` junction referencing `colors` master
  * `product_tags` junction referencing `tags` master
  * `product_images` child table with ordering and primary flags

#### 4.5 Inventory Direct Mutation vs. Immutable Ledger
* **Frontend Finding**: The frontend directly increments/decrements `product.stock`.
* **Database Resolution**:
  * `inventory` table (1:1 with `products`) stores current state (`quantity`, `low_stock_threshold`).
  * `inventory_movements` ledger records every stock delta (`initial_stock`, `manual_adjustment`, `order_deduction`, `order_cancellation_restock`, `return_restock`) with balance audits.

#### 4.6 First-Order Promotional Logic Discrepancy
* **Frontend Finding**: In [coupons.js](file:///d:/Boutique/src/data/coupons.js#L8) and [CartContext.jsx](file:///d:/Boutique/src/context/CartContext.jsx#L15), coupon `WELCOME10` claims: *"10% discount on first boutique order (Min. ₹999)"*. However, the code in [CartContext.jsx](file:///d:/Boutique/src/context/CartContext.jsx#L145) only validates `subtotal >= minOrder`.
* **Database Resolution**: `coupons` defines the core rule engine attributes (`minimum_order_amount`, `discount_type`, `value`). The backend API uses the relational structure `COUNT(orders.id) WHERE customer_id = ?` to verify actual first-order eligibility.

#### 4.7 Simulated Frontend Entities (Tracking Checkpoints, Dashboard Sales)
* **Frontend Finding**:
  * [CourierTrackingModal.jsx](file:///d:/Boutique/src/components/order/CourierTrackingModal.jsx#L15-L51) uses hardcoded mock checkpoints.
  * [AdminDashboardPage.jsx](file:///d:/Boutique/src/pages/admin/AdminDashboardPage.jsx#L18-L53) uses hardcoded arrays for `WEEKLY_SALES_DATA` and `CATEGORY_DISTRIBUTION`.
* **Database Resolution**:
  * `shipments` stores real integration metadata (`carrier_name`, `tracking_number`, `tracking_url`, `shipping_date`, `expected_delivery`). Checkpoint events will come from courier webhooks in future phases.
  * Dashboard metrics will be aggregated via SQL grouping queries (`SUM(pricing.total) GROUP BY DATE(order_date)`) rather than static mock tables.

#### 4.8 Static Content Classification
* **Frontend Finding**: The frontend [homepage.js](file:///d:/Boutique/src/data/homepage.js) includes `brandStory`, `testimonials`, and `socialGallery`. However, [AdminHomepagePage.jsx](file:///d:/Boutique/src/pages/admin/AdminHomepagePage.jsx) only exposes forms to edit the Announcement bar, Hero banner, and Promo banner.
* **Database Resolution**:
  * Persistent CMS tables are created strictly for the admin-editable sections: `homepage_announcement`, `homepage_hero`, `homepage_promo_banner`.
  * `brandStory`, `testimonials`, and `socialGallery` are classified as **CURRENT STATIC FRONTEND CONTENT**. They do not warrant speculative database tables until CMS editorial requirements are defined.

---

### 5. Implementation Roadmap

The physical database artifacts will be implemented in strict sequential dependency order:
1. `architecture.md` (Design Specification & Audit)
2. `data-dictionary.md` (Table and Column Specifications)
3. `normalization.md` (1NF/2NF/3NF/BCNF Audit)
4. `relationships.md` (Integrity Rules & Referential Actions)
5. `erd.md` (Mermaid ERD & Text Diagram)
6. `frontend-database-mapping.md` (Every UI Field Mapped to Column)
7. `constraints.md` (Validation Rules & Business Invariants)
8. `indexes.md` (Indexing Rationale & Execution Plan)
9. `schema.sql` (Complete DDL)
10. `seed.sql` (Transformed Seed Data from Frontend Mocks)
11. `migrations/` (Version-controlled migrations)
