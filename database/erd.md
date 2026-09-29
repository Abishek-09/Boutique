# Entity Relationship Diagram (ERD)
## Maison D'Or Boutique Atelier

This document provides both the visual **Mermaid ER Diagram** and the **Text Relationship Map** detailing primary keys (PK), foreign keys (FK), cardinalities, and junction tables across the 32 normalized schema entities.

---

### 1. Mermaid Entity-Relationship Diagram

```mermaid
erDiagram
    %% ==========================================
    %% AUTHENTICATION & ACCESS
    %% ==========================================
    users ||--o{ user_roles : "assigned"
    roles ||--o{ user_roles : "defines"
    users ||--o| customers : "authenticates"
    users ||--o{ inventory_movements : "logs"
    users ||--o{ order_status_history : "transitions"
    users ||--o{ reviews : "moderates"

    %% ==========================================
    %% PATRONS & ADDRESSES
    %% ==========================================
    customers ||--o{ customer_addresses : "maintains"
    customers ||--o{ orders : "places"
    customers ||--o{ reviews : "writes"
    customers ||--o{ enquiries : "submits"

    %% ==========================================
    %% CATALOG & ATTRIBUTES
    %% ==========================================
    categories ||--o{ products : "classifies"
    collections ||--o{ products : "features"
    products ||--o{ product_images : "contains"
    products ||--o{ product_sizes : "has"
    sizes ||--o{ product_sizes : "specifies"
    products ||--o{ product_colors : "has"
    colors ||--o{ product_colors : "specifies"
    products ||--o{ product_tags : "has"
    tags ||--o{ product_tags : "specifies"

    %% ==========================================
    %% INVENTORY
    %% ==========================================
    products ||--|| inventory : "tracks"
    inventory ||--o{ inventory_movements : "records"

    %% ==========================================
    %% ORDERS & INVOICING
    %% ==========================================
    orders ||--|{ order_items : "contains"
    products ||--o{ order_items : "purchased_in"
    orders ||--|| order_addresses : "delivers_to"
    orders ||--|{ order_payments : "funded_by"
    orders ||--o| shipments : "dispatched_via"
    orders ||--|{ order_status_history : "tracks"
    orders ||--o{ order_coupons : "applies"
    coupons ||--o{ order_coupons : "redeemed_in"

    %% ==========================================
    %% REVIEWS & FEEDBACK
    %% ==========================================
    products ||--o{ reviews : "evaluated_in"
    orders ||--o{ reviews : "verified_by"
    order_items ||--o| reviews : "targets"

    %% ==========================================
    %% ENTITY DEFINITIONS
    %% ==========================================
    users {
        bigint_unsigned id PK
        varchar_191 email UK
        varchar_255 password_hash
        varchar_100 name
        varchar_20 phone
        boolean is_active
        timestamp last_login_at
    }

    roles {
        bigint_unsigned id PK
        varchar_50 name UK
        varchar_100 display_name
        varchar_255 description
    }

    user_roles {
        bigint_unsigned user_id PK_FK
        bigint_unsigned role_id PK_FK
    }

    customers {
        bigint_unsigned id PK
        bigint_unsigned user_id FK
        varchar_50 customer_code UK
        varchar_100 name
        varchar_191 email UK
        varchar_30 phone
        varchar_100 city
        varchar_100 state
        enum status
        date joined_date
    }

    customer_addresses {
        bigint_unsigned id PK
        bigint_unsigned customer_id FK
        varchar_100 recipient_name
        varchar_30 recipient_phone
        varchar_255 address_line
        varchar_100 city
        varchar_100 state
        varchar_20 pincode
        boolean is_default
    }

    categories {
        bigint_unsigned id PK
        varchar_50 code UK
        varchar_100 name
        varchar_100 slug UK
        text description
        varchar_500 image_url
        boolean is_active
    }

    collections {
        bigint_unsigned id PK
        varchar_50 code UK
        varchar_100 name
        varchar_100 slug UK
        varchar_255 subtitle
        varchar_500 banner_url
        boolean is_active
    }

    products {
        bigint_unsigned id PK
        varchar_50 code UK
        varchar_255 name
        varchar_255 slug UK
        varchar_100 sku UK
        bigint_unsigned category_id FK
        bigint_unsigned collection_id FK
        text description
        decimal price
        decimal sale_price
        varchar_255 material
        text care
        boolean featured
        boolean new_arrival
        boolean best_seller
        enum status
        varchar_255 meta_title
        text meta_description
    }

    product_images {
        bigint_unsigned id PK
        bigint_unsigned product_id FK
        varchar_500 image_url
        varchar_255 alt_text
        int display_order
        boolean is_primary
    }

    sizes {
        bigint_unsigned id PK
        varchar_100 name UK
        varchar_30 code
        int sort_order
    }

    product_sizes {
        bigint_unsigned product_id PK_FK
        bigint_unsigned size_id PK_FK
    }

    colors {
        bigint_unsigned id PK
        varchar_100 name UK
        varchar_20 hex_code
    }

    product_colors {
        bigint_unsigned product_id PK_FK
        bigint_unsigned color_id PK_FK
    }

    tags {
        bigint_unsigned id PK
        varchar_50 name UK
    }

    product_tags {
        bigint_unsigned product_id PK_FK
        bigint_unsigned tag_id PK_FK
    }

    inventory {
        bigint_unsigned id PK
        bigint_unsigned product_id UK_FK
        int quantity
        int low_stock_threshold
    }

    inventory_movements {
        bigint_unsigned id PK
        bigint_unsigned inventory_id FK
        enum movement_type
        int quantity_delta
        int balance_after
        varchar_50 reference_type
        varchar_100 reference_id
        varchar_255 notes
        bigint_unsigned created_by FK
    }

    coupons {
        bigint_unsigned id PK
        varchar_50 code UK
        enum discount_type
        decimal value
        decimal minimum_order_amount
        varchar_255 description
        datetime start_at
        datetime end_at
        enum status
        int_unsigned usage_limit
        int_unsigned times_used
    }

    orders {
        bigint_unsigned id PK
        varchar_50 order_number UK
        bigint_unsigned customer_id FK
        enum delivery_method
        enum status
        decimal subtotal
        decimal discount_amount
        decimal shipping_amount
        decimal tax_amount
        decimal final_total
        datetime order_date
    }

    order_items {
        bigint_unsigned id PK
        bigint_unsigned order_id FK
        bigint_unsigned product_id FK
        varchar_255 product_name_snapshot
        varchar_100 sku_snapshot
        varchar_100 selected_size
        varchar_100 selected_color
        decimal unit_price
        int quantity
        decimal total_price
        varchar_500 image_url_snapshot
    }

    order_addresses {
        bigint_unsigned id PK
        bigint_unsigned order_id UK_FK
        varchar_100 recipient_name
        varchar_30 recipient_phone
        varchar_255 address_line
        varchar_100 city
        varchar_100 state
        varchar_20 pincode
    }

    order_payments {
        bigint_unsigned id PK
        bigint_unsigned order_id FK
        varchar_100 payment_method
        enum payment_status
        varchar_100 transaction_id UK
        decimal amount
        datetime paid_at
        text gateway_response
    }

    shipments {
        bigint_unsigned id PK
        bigint_unsigned order_id UK_FK
        varchar_100 carrier_name
        varchar_100 tracking_number
        varchar_500 tracking_url
        date shipping_date
        varchar_100 expected_delivery
        datetime dispatched_at
        datetime delivered_at
    }

    order_status_history {
        bigint_unsigned id PK
        bigint_unsigned order_id FK
        enum status
        text note
        bigint_unsigned changed_by FK
        datetime changed_at
    }

    order_coupons {
        bigint_unsigned id PK
        bigint_unsigned order_id FK
        bigint_unsigned coupon_id FK
        varchar_50 coupon_code_snapshot
        enum discount_type_snapshot
        decimal discount_value_snapshot
        decimal applied_discount_amount
    }

    reviews {
        bigint_unsigned id PK
        bigint_unsigned product_id FK
        bigint_unsigned customer_id FK
        bigint_unsigned order_id FK
        bigint_unsigned order_item_id FK
        tinyint_unsigned rating
        varchar_255 title
        text comment
        enum status
        boolean is_verified_purchase
        datetime submitted_at
        datetime moderated_at
        bigint_unsigned moderated_by FK
    }

    enquiries {
        bigint_unsigned id PK
        bigint_unsigned customer_id FK
        varchar_100 contact_name
        varchar_191 contact_email
        varchar_30 contact_phone
        text message
        enum status
        datetime submitted_at
    }

    store_settings {
        bigint_unsigned id PK
        varchar_150 boutique_name
        varchar_255 tagline
        varchar_10 currency_code
        varchar_5 currency_symbol
        varchar_30 gst_number
        varchar_50 phone
        varchar_191 email
        text flagship_address
        varchar_255 visiting_hours
        decimal free_shipping_threshold
        decimal standard_shipping_fee
        varchar_100 instagram_handle
        varchar_30 whatsapp_number
    }

    homepage_announcement {
        bigint_unsigned id PK
        varchar_255 text
        boolean is_enabled
    }

    homepage_hero {
        bigint_unsigned id PK
        varchar_255 title
        text subtitle
        varchar_500 image_url
        varchar_100 primary_btn_text
        varchar_255 primary_btn_link
        varchar_100 secondary_btn_text
        varchar_255 secondary_btn_link
        enum status
    }

    homepage_promo_banner {
        bigint_unsigned id PK
        varchar_100 badge
        varchar_255 title
        text subtitle
        varchar_500 image_url
        varchar_100 button_text
        varchar_255 button_link
        enum status
    }
```

---

### 2. Cardinality & Junction Summary

* **One-to-One Relationships (1:1)**:
  * `products ||--|| inventory` (Surrogate PK with `product_id UNIQUE FK`)
  * `orders ||--|| order_addresses` (Surrogate PK with `order_id UNIQUE FK`)
  * `orders ||--o| shipments` (Surrogate PK with `order_id UNIQUE FK`, optional before dispatch)
* **One-to-Many Relationships (1:N)**:
  * `customers ||--o{ customer_addresses`
  * `customers ||--o{ orders`
  * `categories ||--o{ products`
  * `collections ||--o{ products` (Optional collection)
  * `products ||--o{ product_images`
  * `inventory ||--o{ inventory_movements`
  * `orders ||--|{ order_items`
  * `orders ||--|{ order_payments`
  * `orders ||--|{ order_status_history`
  * `orders ||--o{ order_coupons`
  * `coupons ||--o{ order_coupons`
  * `products ||--o{ reviews`
  * `customers ||--o{ reviews`
  * `customers ||--o{ enquiries` (Optional customer)
* **Many-to-Many Relationships (N:M Junctions)**:
  * `users }o--o{ roles` via junction `user_roles (user_id, role_id)`
  * `products }o--o{ sizes` via junction `product_sizes (product_id, size_id)`
  * `products }o--o{ colors` via junction `product_colors (product_id, color_id)`
  * `products }o--o{ tags` via junction `product_tags (product_id, tag_id)`
