-- =============================================================================
-- Migration 005: Create Reviews, Enquiries, Settings, and Homepage CMS
-- =============================================================================

CREATE TABLE reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    customer_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NULL,
    order_item_id BIGINT UNSIGNED NULL,
    rating TINYINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    is_verified_purchase BOOLEAN NOT NULL DEFAULT TRUE,
    submitted_at DATETIME NOT NULL,
    moderated_at DATETIME NULL,
    moderated_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_reviews_item_cust UNIQUE (order_item_id, customer_id),
    CONSTRAINT chk_reviews_rating CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT fk_rev_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_rev_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_rev_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_rev_item FOREIGN KEY (order_item_id) REFERENCES order_items (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_rev_moderator FOREIGN KEY (moderated_by) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_rev_prod_status (product_id, status, rating),
    INDEX idx_rev_cust_date (customer_id, submitted_at DESC),
    INDEX idx_rev_status_date (status, submitted_at ASC),
    INDEX idx_rev_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE enquiries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT UNSIGNED NULL,
    contact_name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(191) NOT NULL,
    contact_phone VARCHAR(30) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('New', 'Contacted', 'Resolved') NOT NULL DEFAULT 'New',
    submitted_at DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_enquiries_cust FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_enq_status_date (status, submitted_at DESC),
    INDEX idx_enq_cust (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE store_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    boutique_name VARCHAR(150) NOT NULL,
    tagline VARCHAR(255) NULL,
    currency_code VARCHAR(10) NOT NULL DEFAULT 'INR',
    currency_symbol VARCHAR(5) NOT NULL DEFAULT '₹',
    gst_number VARCHAR(30) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(191) NOT NULL,
    flagship_address TEXT NOT NULL,
    visiting_hours VARCHAR(255) NOT NULL,
    free_shipping_threshold DECIMAL(12,2) NOT NULL DEFAULT 1999.00,
    standard_shipping_fee DECIMAL(12,2) NOT NULL DEFAULT 150.00,
    instagram_handle VARCHAR(100) NULL,
    whatsapp_number VARCHAR(30) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_ss_free_ship CHECK (free_shipping_threshold >= 0.00),
    CONSTRAINT chk_ss_std_ship CHECK (standard_shipping_fee >= 0.00)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE homepage_announcement (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE homepage_hero (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT NULL,
    image_url VARCHAR(500) NOT NULL,
    primary_btn_text VARCHAR(100) NOT NULL,
    primary_btn_link VARCHAR(255) NOT NULL,
    secondary_btn_text VARCHAR(100) NULL,
    secondary_btn_link VARCHAR(255) NULL,
    status ENUM('draft', 'published') NOT NULL DEFAULT 'published',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE homepage_promo_banner (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    badge VARCHAR(100) NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT NULL,
    image_url VARCHAR(500) NOT NULL,
    button_text VARCHAR(100) NOT NULL,
    button_link VARCHAR(255) NOT NULL,
    status ENUM('draft', 'published') NOT NULL DEFAULT 'published',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
