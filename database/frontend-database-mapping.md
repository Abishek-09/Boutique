# Complete Frontend-to-Database Mapping Specification
## Maison D'Or Boutique Atelier

This document maps **every persistence-related field** found across all React pages, modals, forms, context providers, and data files directly to its corresponding MySQL normalized table and column.

---

### 1. Product Management Forms
**Source Files**: `ProductFormModal.jsx`, `AdminProductFormPage.jsx`, `products.js`

| Frontend Form Field / Object Key | Frontend UI Control / Representation | Database Table | Database Column | Transformation / Architectural Note |
| :--- | :--- | :--- | :--- | :--- |
| `name` | Text Input ("PRODUCT TITLE") | `products` | `name` | Trimmed string |
| `slug` | Text Input / Auto-generated from name | `products` | `slug` | Lowercase URL-safe string, UNIQUE |
| `sku` | Text Input ("SKU") | `products` | `sku` | Uppercase formatted identifier, UNIQUE |
| `category` | Select Dropdown ("PRIMARY CATEGORY") | `products` | `category_id` | Resolved from `categories.slug -> categories.id` |
| `collection` | Select Dropdown ("COLLECTION SHOWCASE") | `products` | `collection_id` | Resolved from `collections.slug -> collections.id` |
| `description` | Textarea ("CURATORIAL DESCRIPTION") | `products` | `description` | Long text narrative |
| `price` | Number Input ("STANDARD RETAIL PRICE") | `products` | `price` | `DECIMAL(12,2)` |
| `salePrice` | Number Input ("SPECIAL OFFER / SALE PRICE") | `products` | `sale_price` | `DECIMAL(12,2)` (NULL if no discount) |
| `material` | Text Input ("FABRIC & WEAVE COMPOSITION")| `products` | `material` | Composition string |
| `care` | Textarea ("GARMENT PRESERVATION & CARE")| `products` | `care` | Care instructions |
| `images` | Textarea (newline separated URLs) | `product_images` | `image_url` | 1NF: Split by `\n` into child rows |
| `images` (first entry) | First entry in array / primary image | `product_images` | `is_primary` | Set `is_primary = TRUE` for index 0 |
| `images` (ordering) | Array index position | `product_images` | `display_order` | Integer `0, 1, 2...` |
| `sizes` | Text Input / Preset Chips (CSV) | `product_sizes`, `sizes` | `product_sizes.size_id`, `sizes.name` | 1NF: Split CSV, map or insert into `sizes`, link via `product_sizes` |
| `colors` | Text Input / Preset Chips (CSV) | `product_colors`, `colors` | `product_colors.color_id`, `colors.name` | 1NF: Split CSV, map or insert into `colors`, link via `product_colors` |
| `tags` | Text Input (CSV) | `product_tags`, `tags` | `product_tags.tag_id`, `tags.name` | 1NF: Split CSV, map or insert into `tags`, link via `product_tags` |
| `stock` | Number Input ("PHYSICAL PIECES AVAILABLE")| `inventory` | `quantity` | Normalized into 1:1 `inventory` table |
| `featured` | Checkbox ("Feature on Boutique Homepage") | `products` | `featured` | Boolean `TRUE/FALSE` |
| `newArrival` | Checkbox ("Mark as New Arrival") | `products` | `new_arrival` | Boolean `TRUE/FALSE` |
| `bestSeller` | Checkbox ("Flag as Best Seller") | `products` | `best_seller` | Boolean `TRUE/FALSE` |
| `status` | Radio Buttons (`published`, `draft`, `archived`) | `products` | `status` | ENUM(`'draft'`, `'published'`, `'archived'`) |
| `metaTitle` | Text Input ("SEO META TITLE") | `products` | `meta_title` | Page title tag string |
| `metaDescription`| Textarea ("SEO META DESCRIPTION") | `products` | `meta_description` | Meta description snippet |
| `rating` | Read-only Star Badge | *(Derived View)* | *(Computed)* | `AVG(reviews.rating) WHERE product_id = ? AND status = 'approved'` |
| `reviewsCount` | Read-only Counter | *(Derived View)* | *(Computed)* | `COUNT(reviews.id) WHERE product_id = ? AND status = 'approved'` |

---

### 2. Inventory & Stock Control
**Source Files**: `AdminInventoryPage.jsx`, `productService.js`

| Frontend Form Field / Action | Frontend UI Control | Database Table | Database Column | Transformation / Architectural Note |
| :--- | :--- | :--- | :--- | :--- |
| `product.stock` | Editable Number Input ("Stock Qty") | `inventory` | `quantity` | Current physical inventory balance |
| Stock Adjustment Action | "+ / -" Step Buttons / Save Stock | `inventory_movements` | `quantity_delta` | Signed integer change (+5, -2) |
| Post-adjustment Balance | Computed display in UI | `inventory_movements` | `balance_after` | Point-in-time audited balance |
| Adjustment Reason | System implicit | `inventory_movements` | `movement_type` | `'manual_adjustment'` |
| Operator Reference | Session admin user | `inventory_movements` | `created_by` | References `users.id` |
| Low Stock Warning Badge | Rendered when `stock <= 3` | `inventory` | `low_stock_threshold` | Default integer `3` |

---

### 3. Category Management
**Source Files**: `AdminCategoriesPage.jsx`, `categoryService.js`, `categories.js`

| Frontend Field | Frontend UI Control | Database Table | Database Column | Transformation / Architectural Note |
| :--- | :--- | :--- | :--- | :--- |
| `name` | Text Input ("Category Name") | `categories` | `name` | Category title |
| `slug` | Text Input ("Slug") | `categories` | `slug` | Unique URL path |
| `description` | Textarea ("Description") | `categories` | `description` | Category narrative |
| `image` | Preset Selection / URL Input | `categories` | `image_url` | Category banner URL |
| `itemCount` | Display Count Badge | *(Derived View)* | *(Computed)* | `COUNT(products.id) WHERE category_id = categories.id` |

---

### 4. Collection Management
**Source Files**: `AdminCollectionsPage.jsx`, `collectionService.js`, `collections.js`

| Frontend Field | Frontend UI Control | Database Table | Database Column | Transformation / Architectural Note |
| :--- | :--- | :--- | :--- | :--- |
| `name` | Text Input ("Collection Title") | `collections` | `name` | Collection showcase title |
| `slug` | Text Input ("Slug") | `collections` | `slug` | Unique URL path |
| `subtitle` | Text Input ("Subtitle / Theme") | `collections` | `subtitle` | Poetic tagline |
| `banner` | Text Input / Preset ("Banner Image URL") | `collections` | `banner_url` | High-res showcase banner |
| `selectedProductIds` | Multi-select Checkboxes ("Assign Products")| `products` | `collection_id` | Updates `products.collection_id = collections.id` |
| `itemCount` | Display Count Badge | *(Derived View)* | *(Computed)* | `COUNT(products.id) WHERE collection_id = collections.id` |

---

### 5. Checkout & Customer Address
**Source Files**: `CheckoutPage.jsx`, `AccountPage.jsx`, `orderService.js`

| Frontend Form Field | UI Step / Context | Database Table | Database Column | Transformation / Architectural Note |
| :--- | :--- | :--- | :--- | :--- |
| `formData.name` | Step 1: Customer Contact | `order_addresses` | `recipient_name` | Shipping label name |
| `formData.email` | Step 1: Customer Contact | `orders` -> `customers` | `customers.email` | Maps/resolves to customer profile |
| `formData.phone` | Step 1: Customer Contact | `order_addresses` | `recipient_phone` | Delivery contact phone snapshot |
| `formData.addressLine` | Step 2: Shipping Destination | `order_addresses` | `address_line` | Delivery address line snapshot |
| `formData.city` | Step 2: Shipping Destination | `order_addresses` | `city` | Delivery city snapshot |
| `formData.state` | Step 2: Shipping Destination | `order_addresses` | `state` | Delivery state snapshot |
| `formData.pincode` | Step 2: Shipping Destination | `order_addresses` | `pincode` | Delivery PIN code snapshot |
| `formData.deliveryMethod`| Step 3: Delivery Options | `orders` | `delivery_method` | ENUM(`'standard'`, `'express'`) |
| Saved Addresses Book | Account -> Saved Addresses | `customer_addresses` | `address_line`, `city`, `state`, `pincode` | Mutable customer profile addresses |
| Default Address Toggle | Checkbox ("Set as default") | `customer_addresses` | `is_default` | Boolean flag |

---

### 6. Orders, Line Items & Invoicing
**Source Files**: `CheckoutPage.jsx`, `orders.js`, `orderService.js`, `OrderDetailPage.jsx`

| Frontend Object Key | Frontend Representation | Database Table | Database Column | Transformation / Architectural Note |
| :--- | :--- | :--- | :--- | :--- |
| `orderNumber` | String (e.g., `BTQ-2026-001`) | `orders` | `order_number` | Formatted business identifier, UNIQUE |
| `customer.id` | String (`CUST-001`) | `orders` | `customer_id` | References `customers.id` via lookup |
| `pricing.subtotal` | Calculated Cart Subtotal | `orders` | `subtotal` | `DECIMAL(12,2)` |
| `pricing.discountAmount`| Applied Coupon Deduction | `orders` | `discount_amount` | `DECIMAL(12,2)` |
| `pricing.shippingFee` | Calculated Delivery Fee | `orders` | `shipping_amount` | `DECIMAL(12,2)` |
| `pricing.taxAmount` | 5% Estimated GST | `orders` | `tax_amount` | `DECIMAL(12,2)` |
| `pricing.total` | Final Grand Total | `orders` | `final_total` | `DECIMAL(12,2)` |
| `status` | Lifecycle Status Badge | `orders` | `status` | ENUM lifecycle value |
| `orderDate` | ISO Datetime String | `orders` | `order_date` | Purchase timestamp |
| `items[].productId` | Cart Item Reference | `order_items` | `product_id` | References `products.id` |
| `items[].name` | Product Title Snapshot | `order_items` | `product_name_snapshot` | Point-in-time product title |
| `items[].sku` | Product SKU Snapshot | `order_items` | `sku_snapshot` | Point-in-time SKU |
| `items[].size` | Selected Size Option | `order_items` | `selected_size` | Selected size snapshot |
| `items[].color` | Selected Color Option | `order_items` | `selected_color` | Selected color snapshot |
| `items[].price` | Effective Price Charged | `order_items` | `unit_price` | Unit sale price at purchase |
| `items[].quantity` | Unit Count Purchased | `order_items` | `quantity` | Positive integer |
| `items[].price * qty` | Computed Line Subtotal | `order_items` | `total_price` | `unit_price * quantity` |
| `items[].image` | Product Thumbnail URL | `order_items` | `image_url_snapshot` | Cover photo snapshot |

---

### 7. Payment Processing & Gateway
**Source Files**: `PaymentDemoModal.jsx`, `CheckoutPage.jsx`, `orders.js`

| Frontend Form Field / State | UI Control | Database Table | Database Column | Transformation / Architectural Note |
| :--- | :--- | :--- | :--- | :--- |
| `paymentMethod` | Radio Selection in Checkout | `order_payments` | `payment_method` | Text name of payment method |
| `payment.status` | State Indicator (`Paid`, `Pending`) | `order_payments` | `payment_status` | ENUM(`'Pending'`, `'Authorized'`, `'Paid'`, `'Failed'`, `'Refunded'`) |
| `transactionId` | Generated/Gateway Reference | `order_payments` | `transaction_id` | Unique transaction reference |
| `amount` | Amount Payable Display | `order_payments` | `amount` | `DECIMAL(12,2)` matching `final_total` |
| Payment Timestamp | Success Callback Timestamp | `order_payments` | `paid_at` | Settlement datetime |
| Card Details (`cardNumber`, `cardCvv`) | Modal Test Inputs | *(NONE - OMITTED)*| *(NONE - OMITTED)* | **PCI-DSS Compliance Rule**: Raw card numbers and CVV codes are NEVER persisted |

---

### 8. Shipping & Courier Logistics
**Source Files**: `AdminOrderDetailPage.jsx`, `CourierTrackingModal.jsx`, `orders.js`

| Frontend Form Field | UI Control | Database Table | Database Column | Transformation / Architectural Note |
| :--- | :--- | :--- | :--- | :--- |
| `courierName` | Select Dropdown / Input | `shipments` | `carrier_name` | Partner name (`BlueDart Express`, `DTDC`) |
| `trackingNumber` | Text Input ("AWB / Tracking No") | `shipments` | `tracking_number` | Courier AWB tracking number |
| `trackingUrl` | Text Input ("Tracking URL") | `shipments` | `tracking_url` | Direct tracking hyperlink |
| `shippingDate` | Date Input ("Dispatch Date") | `shipments` | `shipping_date` | Date parcel dispatched |
| `expectedDelivery` | Text Input ("Expected Delivery") | `shipments` | `expected_delivery` | Estimated delivery timeframe |
| `timeline` (Dispatched Event) | Auto-logged on shipment entry | `shipments` | `dispatched_at` | Exact dispatch timestamp |

---

### 9. Order Status Lifecycle History
**Source Files**: `AdminOrderDetailPage.jsx`, `orders.js`, `orderService.js`

| Frontend Field | UI Control / Source | Database Table | Database Column | Transformation / Architectural Note |
| :--- | :--- | :--- | :--- | :--- |
| `newStatus` | Select Dropdown ("Update Order Status") | `order_status_history` | `status` | ENUM milestone reached |
| `statusNote` | Text Input ("Custom Status Note") | `order_status_history` | `note` | Staff audit notes |
| Change Timestamp | Current Datetime | `order_status_history` | `changed_at` | Transition datetime |
| Staff Identifier | Logged-in Admin Session | `order_status_history` | `changed_by` | References `users.id` |

---

### 10. Coupons & Discount Redemptions
**Source Files**: `AdminOffersPage.jsx`, `couponService.js`, `coupons.js`, `CartContext.jsx`

| Frontend Form Field | UI Control | Database Table | Database Column | Transformation / Architectural Note |
| :--- | :--- | :--- | :--- | :--- |
| `code` | Text Input ("Coupon Promo Code") | `coupons` | `code` | Uppercase promo string, UNIQUE |
| `type` | Select Dropdown (`percentage`, `flat`, `shipping`) | `coupons` | `discount_type` | ENUM discount method |
| `value` | Number Input ("Discount Value") | `coupons` | `value` | `DECIMAL(12,2)` |
| `minOrder` | Number Input ("Minimum Order Amount") | `coupons` | `minimum_order_amount`| `DECIMAL(12,2)` qualification floor |
| `description` | Textarea ("Terms & Description") | `coupons` | `description` | Patron-facing description |
| `startDate` | Date Input ("Valid From") | `coupons` | `start_at` | Validity beginning datetime |
| `endDate` | Date Input ("Valid Until") | `coupons` | `end_at` | Expiration datetime |
| `status` | Toggle Switch (`active`, `paused`) | `coupons` | `status` | ENUM(`'active'`, `'paused'`, `'expired'`) |
| Applied Coupon Snapshot | Checkout / Order Creation | `order_coupons` | `coupon_id` | References `coupons.id` |
| Applied Code Snapshot | Order Creation | `order_coupons` | `coupon_code_snapshot` | Code text snapshot |
| Applied Deduction | Calculated `discountAmount` | `order_coupons` | `applied_discount_amount`| Exact currency reduction on invoice |

---

### 11. Customer Reviews & Moderation
**Source Files**: `ReviewModal.jsx`, `AdminReviewsPage.jsx`, `reviewService.js`, `reviews.js`

| Frontend Field | UI Control | Database Table | Database Column | Transformation / Architectural Note |
| :--- | :--- | :--- | :--- | :--- |
| `product.productId` | Product Context in Modal | `reviews` | `product_id` | References `products.id` |
| `order.customer.id` | Patron Context in Modal | `reviews` | `customer_id` | References `customers.id` |
| `order.id` | Order Context in Modal | `reviews` | `order_id` | References `orders.id` |
| Item Context | Purchased Order Line Item | `reviews` | `order_item_id` | References `order_items.id` |
| `rating` | Interactive Star Selector (1-5) | `reviews` | `rating` | `TINYINT UNSIGNED` CHECK (1 to 5) |
| `title` | Text Input ("Review Title") | `reviews` | `title` | Review headline |
| `comment` | Textarea ("Detailed Feedback") | `reviews` | `comment` | Review text narrative |
| `status` | Moderation Tabs (`pending`, `approved`, `rejected`) | `reviews` | `status` | ENUM moderation status |
| `verifiedPurchase` | Verified Buyer Badge | `reviews` | `is_verified_purchase` | Boolean flag |
| `date` | Submission Date | `reviews` | `submitted_at` | Submission timestamp |
| Admin Approval Action | "Approve" Button in Admin Reviews | `reviews` | `moderated_at`, `moderated_by` | Records moderator user and timestamp |

---

### 12. Concierge Inquiries
**Source Files**: `ContactPage.jsx`, `AdminEnquiriesPage.jsx`, `enquiryService.js`

| Frontend Field | UI Control | Database Table | Database Column | Transformation / Architectural Note |
| :--- | :--- | :--- | :--- | :--- |
| `name` | Text Input ("Full Name") | `enquiries` | `contact_name` | Inquirer name |
| `email` | Text Input ("Email Address") | `enquiries` | `contact_email` | Inquirer email |
| `phone` | Text Input ("Phone Number") | `enquiries` | `contact_phone` | Inquirer phone |
| `message` | Textarea ("Inquiry Message") | `enquiries` | `message` | Inquiry text body |
| `status` | Select Dropdown (`New`, `Contacted`, `Resolved`) | `enquiries` | `status` | ENUM resolution status |
| `date` | Submission Date | `enquiries` | `submitted_at` | Submission timestamp |
| Logged-in Patron | Auth Context (if authenticated) | `enquiries` | `customer_id` | References `customers.id` (NULL if guest) |

---

### 13. Atelier Settings Configuration
**Source Files**: `AdminSettingsPage.jsx`

| Frontend Field | UI Control | Database Table | Database Column | Transformation / Architectural Note |
| :--- | :--- | :--- | :--- | :--- |
| `boutiqueName` | Text Input ("STORE NAME") | `store_settings` | `boutique_name` | Atelier brand name |
| `tagline` | Text Input ("BRAND TAGLINE") | `store_settings` | `tagline` | Brand tagline |
| `gstNumber` / `gstin` | Text Input ("GSTIN / TAX IDENTIFICATION") | `store_settings` | `gst_number` | **Fixes Frontend Inconsistency**: maps both keys to `gst_number` |
| `phone` | Text Input ("PRIMARY TELEPHONE") | `store_settings` | `phone` | Atelier telephone |
| `email` | Text Input ("CONCIERGE EMAIL") | `store_settings` | `email` | Concierge email |
| `flagshipAddress` | Text Input ("FLAGSHIP STORE ADDRESS") | `store_settings` | `flagship_address` | Physical boutique address |
| `visitingHours` | Text Input ("VISITING HOURS") | `store_settings` | `visiting_hours` | Operational hours |
| `freeShippingThreshold`| Number Input ("FREE SHIPPING MIN ORDER")| `store_settings` | `free_shipping_threshold`| `DECIMAL(12,2)` |
| `standardShippingFee` | Number Input ("STANDARD SHIPPING FEE") | `store_settings` | `standard_shipping_fee` | `DECIMAL(12,2)` |
| `instagram` | Text Input ("INSTAGRAM HANDLE") | `store_settings` | `instagram_handle` | Social Instagram handle |
| `whatsapp` | Text Input ("WHATSAPP CONCIERGE") | `store_settings` | `whatsapp_number` | Concierge WhatsApp contact |

---

### 14. Homepage Storefront CMS
**Source Files**: `AdminHomepagePage.jsx`, `cmsService.js`, `homepage.js`

| Frontend Field | UI Control / Section | Database Table | Database Column | Transformation / Architectural Note |
| :--- | :--- | :--- | :--- | :--- |
| `announcementText` | Text Input ("ANNOUNCEMENT TEXT") | `homepage_announcement`| `text` | Header announcement banner copy |
| `announcementEnabled`| Checkbox ("Enable Announcement Bar") | `homepage_announcement`| `is_enabled` | Visibility toggle |
| `heroTitle` | Text Input ("MAIN HERO HEADING") | `homepage_hero` | `title` | Hero main heading |
| `heroSubtitle` | Textarea ("SUBTITLE COPY") | `homepage_hero` | `subtitle` | Hero narrative copy |
| `heroImage` | Text Input ("BACKGROUND IMAGE URL") | `homepage_hero` | `image_url` | High-res background image |
| `heroBtnText` | Text Input ("PRIMARY BUTTON TEXT") | `homepage_hero` | `primary_btn_text` | Primary CTA button label |
| `heroBtnLink` | Text Input ("PRIMARY BUTTON LINK") | `homepage_hero` | `primary_btn_link` | Primary CTA target route |
| `promoTitle` | Text Input ("CAMPAIGN TITLE") | `homepage_promo_banner`| `title` | Middle promo campaign headline |
| `promoSubtitle` | Textarea ("CAMPAIGN SUBTITLE") | `homepage_promo_banner`| `subtitle` | Promo description narrative |
| `promoImage` | Text Input ("BANNER IMAGE URL") | `homepage_promo_banner`| `image_url` | Promo banner photo URL |
| `promoBtnText` | Text Input ("CTA BUTTON TEXT") | `homepage_promo_banner`| `button_text` | Promo CTA button label |
| `promoBtnLink` | Text Input ("CTA LINK") | `homepage_promo_banner`| `button_link` | Promo CTA target route |
