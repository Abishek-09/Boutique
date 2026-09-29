-- =============================================================================
-- Migration 003: Create Inventory Ledger & Promotions Entities
-- =============================================================================

CREATE TABLE inventory (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    low_stock_threshold INT NOT NULL DEFAULT 3,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_inventory_prod UNIQUE (product_id),
    CONSTRAINT chk_inv_qty CHECK (quantity >= 0),
    CONSTRAINT chk_inv_threshold CHECK (low_stock_threshold >= 0),
    CONSTRAINT fk_inv_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_inv_low_stock (quantity, low_stock_threshold)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE inventory_movements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    inventory_id BIGINT UNSIGNED NOT NULL,
    movement_type ENUM('initial_stock', 'manual_adjustment', 'order_deduction', 'order_cancellation_restock', 'return_restock') NOT NULL,
    quantity_delta INT NOT NULL,
    balance_after INT NOT NULL,
    reference_type VARCHAR(50) NULL,
    reference_id VARCHAR(100) NULL,
    notes VARCHAR(255) NULL,
    created_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_im_balance CHECK (balance_after >= 0),
    CONSTRAINT fk_im_inventory FOREIGN KEY (inventory_id) REFERENCES inventory (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_im_user FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_im_inventory_date (inventory_id, created_at),
    INDEX idx_im_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE coupons (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    discount_type ENUM('percentage', 'flat', 'shipping') NOT NULL,
    value DECIMAL(12,2) NOT NULL,
    minimum_order_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    description VARCHAR(255) NOT NULL,
    start_at DATETIME NOT NULL,
    end_at DATETIME NOT NULL,
    status ENUM('active', 'paused', 'expired') NOT NULL DEFAULT 'active',
    usage_limit INT UNSIGNED NULL,
    times_used INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_coupons_code UNIQUE (code),
    CONSTRAINT chk_coupons_value CHECK (value > 0.00),
    CONSTRAINT chk_coupons_min CHECK (minimum_order_amount >= 0.00),
    CONSTRAINT chk_coupons_dates CHECK (end_at >= start_at),
    INDEX idx_coupons_active (status, start_at, end_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
