-- =============================================================================
-- SEED DATA: Maison D'Or Boutique Atelier
-- Derived and Transformed from Existing Frontend Mock Datasets
-- All Primary Keys use BIGINT UNSIGNED AUTO_INCREMENT
-- Frontend codes (prod-001, cat-sarees, CUST-001) stored as business identifiers
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- -----------------------------------------------------------------------------
-- 1. AUTHENTICATION & ACCESS CONTROL
-- -----------------------------------------------------------------------------
INSERT INTO roles (id, name, display_name, description) VALUES
(1, 'admin', 'Boutique Director & Store Manager', 'Full managerial access to atelier operations, inventory, and storefront CMS'),
(2, 'customer', 'Atelier Patron', 'Storefront purchasing, order tracking, address book, and verified reviews');

INSERT INTO users (id, email, password_hash, name, phone, is_active) VALUES
(1, 'admin@boutique.demo', '$2y$12$LQv3c1yqSNdGY0y3f9a7ZeO1QpYvBvM1Tq8r9U6K1u2y3z4a5b6c', 'Aaradhya Sharma', '+91 80 4123 7890', TRUE),
(2, 'ananya.verma@example.com', '$2y$12$LQv3c1yqSNdGY0y3f9a7ZeO1QpYvBvM1Tq8r9U6K1u2y3z4a5b6c', 'Ananya Verma', '+91 98765 43210', TRUE);

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),
(2, 2);

-- -----------------------------------------------------------------------------
-- 2. CUSTOMERS & ADDRESS BOOK
-- -----------------------------------------------------------------------------
INSERT INTO customers (id, user_id, customer_code, name, email, phone, city, state, status, joined_date) VALUES
(1, 2, 'CUST-001', 'Ananya Verma', 'ananya.verma@example.com', '+91 98765 43210', 'Bengaluru', 'Karnataka', 'active', '2025-11-14'),
(2, NULL, 'CUST-002', 'Priyanka Sen', 'priyanka.sen@example.com', '+91 98112 34567', 'Kolkata', 'West Bengal', 'active', '2025-08-20'),
(3, NULL, 'CUST-003', 'Divya Nambiar', 'divya.nambiar@example.com', '+91 97456 12389', 'Kochi', 'Kerala', 'active', '2026-01-08'),
(4, NULL, 'CUST-004', 'Meenakshi Iyer', 'meenakshi.iyer@example.com', '+91 99201 88765', 'Mumbai', 'Maharashtra', 'active', '2025-09-12'),
(5, NULL, 'CUST-005', 'Simran Kaur', 'simran.kaur@example.com', '+91 98722 54321', 'Chandigarh', 'Punjab', 'active', '2026-02-18'),
(6, NULL, 'CUST-006', 'Radhika Kulkarni', 'radhika.kulkarni@example.com', '+91 94230 76543', 'Pune', 'Maharashtra', 'active', '2025-12-05'),
(7, NULL, 'CUST-007', 'Tanvi Agarwal', 'tanvi.agarwal@example.com', '+91 98390 11223', 'Lucknow', 'Uttar Pradesh', 'active', '2025-10-29'),
(8, NULL, 'CUST-008', 'Suhasini Reddy', 'suhasini.reddy@example.com', '+91 98480 99887', 'Hyderabad', 'Telangana', 'active', '2025-07-15');

INSERT INTO customer_addresses (id, customer_id, recipient_name, recipient_phone, address_line, city, state, pincode, is_default) VALUES
(1, 1, 'Ananya Verma', '+91 98765 43210', 'Flat 402, Lotus Residency, MG Road', 'Bengaluru', 'Karnataka', '560001', TRUE),
(2, 2, 'Priyanka Sen', '+91 98112 34567', '12B Southern Avenue, Ballygunge', 'Kolkata', 'West Bengal', '700029', TRUE),
(3, 3, 'Divya Nambiar', '+91 97456 12389', 'Panampilly Nagar, 4th Cross', 'Kochi', 'Kerala', '682036', TRUE),
(4, 4, 'Meenakshi Iyer', '+91 99201 88765', '603 Ocean View, Bandra West', 'Mumbai', 'Maharashtra', '400050', TRUE),
(5, 5, 'Simran Kaur', '+91 98722 54321', 'House 52, Sector 8B', 'Chandigarh', 'Punjab', '160009', TRUE),
(6, 6, 'Radhika Kulkarni', '+91 94230 76543', 'B-14, Mayur Colony, Kothrud', 'Pune', 'Maharashtra', '411038', TRUE),
(7, 7, 'Tanvi Agarwal', '+91 98390 11223', '34 Hazratganj, Park Road', 'Lucknow', 'Uttar Pradesh', '226001', TRUE),
(8, 8, 'Suhasini Reddy', '+91 98480 99887', 'Villa 8, Jubilee Hills, Road 36', 'Hyderabad', 'Telangana', '500033', TRUE);

-- -----------------------------------------------------------------------------
-- 3. CATALOG TAXONOMY
-- -----------------------------------------------------------------------------
INSERT INTO categories (id, code, name, slug, description, image_url, is_active) VALUES
(1, 'cat-sarees', 'Sarees', 'sarees', 'Handwoven Banarasi, Kanjeevaram, Organza & Chanderi sarees crafted by master weavers.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80', TRUE),
(2, 'cat-dresses', 'Dresses', 'dresses', 'Contemporary Indo-Western silhouettes, tiered maxi dresses & artisanal anarkalis.', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80', TRUE),
(3, 'cat-kurtis', 'Kurtis & Sets', 'kurtis', 'Breathable pure cotton, silk blend co-ord tunics and embroidered festive kurti sets.', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80', TRUE),
(4, 'cat-jewellery', 'Jewellery', 'jewellery', 'Heritage Kundan neckpieces, polki earrings, and antique temple brass adornments.', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80', TRUE),
(5, 'cat-accessories', 'Accessories', 'accessories', 'Hand-embroidered zardozi potlis, silk dupattas, and handcrafted brocade clutches.', 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80', TRUE);

INSERT INTO collections (id, code, name, slug, subtitle, banner_url, is_active) VALUES
(1, 'col-festive', 'Festive Heritage', 'festive', 'Timeless heirlooms woven with pure zari and royal grace', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1200&auto=format&fit=crop&q=80', TRUE),
(2, 'col-summer', 'Summer Pastel Atelier', 'summer-pastel', 'Breezy organza, soft linens, and soothing earthy palettes', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80', TRUE),
(3, 'col-banarasi', 'Royal Banarasi Silk', 'royal-banarasi', 'Intricate kadwa weaves direct from Varanasi artisanal looms', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop&q=80', TRUE),
(4, 'col-contemporary', 'Handloom Minimalist', 'minimalist', 'Modern silhouettes honoring traditional Indian weaving arts', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80', TRUE);

-- -----------------------------------------------------------------------------
-- 4. MASTER SIZES, COLORS & TAGS
-- -----------------------------------------------------------------------------
INSERT INTO sizes (id, name, code, sort_order) VALUES
(1, 'Free Size (5.5m + 0.8m Blouse)', 'FS-SAR', 1),
(2, 'XS', 'XS', 2),
(3, 'S', 'S', 3),
(4, 'M', 'M', 4),
(5, 'L', 'L', 5),
(6, 'XL', 'XL', 6),
(7, 'Adjustable Dori', 'ADJ', 7),
(8, 'Free Size', 'FS', 8),
(9, 'One Size', 'OS', 9),
(10, 'Standard Pierced', 'STD', 10);

INSERT INTO colors (id, name, hex_code) VALUES
(1, 'Deep Crimson', '#8B1E2D'),
(2, 'Rust Amber', '#B75D34'),
(3, 'Pistachio Sage', '#9EA98C'),
(4, 'Blush Cream', '#F2E8DC'),
(5, 'Earthy Terracotta', '#C46D4E'),
(6, 'Sand Taupe', '#C2B6A5'),
(7, 'Antique Gold with Emerald Beads', '#D4AF37'),
(8, 'Deep Emerald', '#0F52BA'),
(9, 'Powder Rose', '#E8C5C8'),
(10, 'Mustard Ochre', '#D49B28'),
(11, 'Wine Velvet', '#5A1827'),
(12, 'Mango Yellow with Magenta', '#F4B400'),
(13, 'Oxidized Antique Silver', '#A8A9AD'),
(14, 'Lilac Mist', '#C8A2C8'),
(15, 'Lustrous Ivory', '#FFFFF0');

INSERT INTO tags (id, name) VALUES
(1, 'silk'), (2, 'festive'), (3, 'banarasi'), (4, 'handcrafted'),
(5, 'chanderi'), (6, 'summer'), (7, 'pastel'), (8, 'linen'),
(9, 'minimalist'), (10, 'kundan'), (11, 'jewellery'), (12, 'georgette'),
(13, 'organza'), (14, 'ajrakh'), (15, 'potli'), (16, 'kanjeevaram'),
(17, 'earrings'), (18, 'tissue');

-- -----------------------------------------------------------------------------
-- 5. PRODUCTS
-- -----------------------------------------------------------------------------
INSERT INTO products (id, code, name, slug, sku, category_id, collection_id, description, price, sale_price, material, care, featured, new_arrival, best_seller, status, meta_title, meta_description) VALUES
(1, 'prod-001', 'Kashi Crimson Pure Katan Silk Saree', 'kashi-crimson-pure-katan-silk-saree', 'SAR-KAT-001', 1, 3, 'An exquisite handwoven masterpiece crafted in Varanasi with pure Katan silk and authentic gold-tested zari brocade. Features intricate floral jaal motifs and an opulent pallu perfect for bridal celebrations and royal festivities.', 4499.00, 3899.00, '100% Pure Mulberry Katan Silk with Zari', 'Dry clean only. Store wrapped in pure muslin cloth.', TRUE, FALSE, TRUE, 'published', 'Kashi Crimson Pure Katan Silk Saree | Maison D''Or Atelier', 'Authentic handwoven Varanasi silk saree with gold zari brocade.'),
(2, 'prod-002', 'Avani Pistachio Chanderi Silk Kurti Set', 'avani-pistachio-chanderi-silk-kurti-set', 'KUR-CHA-002', 3, 2, 'Delicate pastel green Chanderi tunic detailed with handcrafted gota patti embroidery on the neckline, paired with tailored straight cigarette pants and a feather-light scalloped organza dupatta.', 3299.00, 2899.00, 'Chanderi Silk with Cotton Silk Lining', 'Gentle hand wash with mild detergent or dry clean.', TRUE, TRUE, FALSE, 'published', 'Avani Pistachio Chanderi Silk Kurti Set | Maison D''Or', 'Pastel green Chanderi tunic with handcrafted gota patti embroidery.'),
(3, 'prod-003', 'Sitara Terracotta Handloom Linen Anarkali', 'sitara-terracotta-handloom-linen-anarkali', 'DRS-LIN-003', 2, 4, 'A contemporary floor-sweeping silhouette tailored from organic handspun linen in earthy terracotta tones. Features subtle pintucks, functional wooden buttons, and concealed side pockets.', 3799.00, 3299.00, '100% Handloom Organic Linen', 'Hand wash separately in cold water. Iron damp.', TRUE, TRUE, TRUE, 'published', 'Sitara Terracotta Handloom Linen Anarkali | Maison D''Or', 'Contemporary floor-sweeping silhouette tailored from organic handspun linen.'),
(4, 'prod-004', 'Noor Handcrafted Kundan & Pearl Choker', 'noor-handcrafted-kundan-pearl-choker', 'JEW-KUN-004', 4, 1, 'Regal heritage choker handcrafted by master artisans in Jaipur. Set with uncut faux polki kundan stones, green tourmaline beads, and clusters of cultured freshwater seed pearls.', 2499.00, 2199.00, 'Brass alloy with 22k micron gold plating, Kundan & Pearls', 'Store in airtight zip pouch away from perfume and moisture.', TRUE, FALSE, TRUE, 'published', 'Noor Handcrafted Kundan & Pearl Choker | Maison D''Or', 'Regal heritage choker handcrafted with uncut polki kundan stones.'),
(5, 'prod-005', 'Zareen Emerald Green Banarasi Georgette Saree', 'zareen-emerald-green-banarasi-georgette-saree', 'SAR-GEO-005', 1, 3, 'Lightweight and diaphanous pure georgette saree intricately handwoven with delicate antique silver resham and cutwork florals. Drapes effortlessly and flatters every silhouette.', 4899.00, 4299.00, 'Pure Viscose Georgette with Antique Silver Zari', 'Dry clean only. Roll fold to protect delicate zari work.', TRUE, FALSE, FALSE, 'published', 'Zareen Emerald Green Banarasi Georgette Saree | Maison D''Or', 'Pure georgette saree handwoven with delicate antique silver resham.'),
(6, 'prod-006', 'Gulzar Organza Embroidered Tiered Maxi Dress', 'gulzar-organza-embroidered-tiered-maxi-dress', 'DRS-ORG-006', 2, 2, 'Romantic tiered luxury maxi dress made from sheer powder rose organza with tone-on-tone French knot botanical motifs, featuring flared elbow-length bell sleeves and a tonal butter-crepe slip.', 3499.00, 2999.00, 'Organza Outer with Pure Malmal Cotton Lining', 'Dry clean recommended to preserve floral threadwork.', FALSE, TRUE, FALSE, 'published', 'Gulzar Organza Embroidered Tiered Maxi Dress | Maison D''Or', 'Tiered luxury maxi dress in powder rose organza with botanical motifs.'),
(7, 'prod-007', 'Meera Mustard Ajrakh Modal Silk Kurti', 'meera-mustard-ajrakh-modal-silk-kurti', 'KUR-AJR-007', 3, 4, 'Artisanal modal silk tunic handcrafted with authentic 14-stage Kutch block-printed Ajrakh patterns using organic natural pomegranate rind and indigo dyes. Cut in an effortless straight silhouette.', 2199.00, 1899.00, 'Lustrous Eco Modal Silk', 'Gentle cold hand wash using pH neutral detergent.', FALSE, FALSE, TRUE, 'published', 'Meera Mustard Ajrakh Modal Silk Kurti | Maison D''Or', 'Artisanal modal silk tunic with authentic Kutch Ajrakh block prints.'),
(8, 'prod-008', 'Zardozi Handcrafted Velvet Potli Bag', 'zardozi-handcrafted-velvet-potli-bag', 'ACC-POT-008', 5, 1, 'Plush micro-velvet evening pouch intricately laden with metallic dabka, seed beads, and gold sequins, finished with braided silk drawstring cords and ornate freshwater pearl tassels.', 1699.00, 1399.00, 'Royal Micro-Velvet with Satin Inner Lining', 'Spot clean with dry cloth. Store in cotton pouch.', TRUE, FALSE, TRUE, 'published', 'Zardozi Handcrafted Velvet Potli Bag | Maison D''Or', 'Plush micro-velvet evening pouch with metallic dabka and pearls.'),
(9, 'prod-009', 'Bhavya Raw Mango Yellow Kanjeevaram Silk Saree', 'bhavya-raw-mango-yellow-kanjeevaram-silk-saree', 'SAR-KAN-009', 1, 1, 'Authentic heirloom handloom Kanjivaram silk saree directly from Tamil Nadu master weavers. Features a vibrant mango-yellow body with contrast magenta korvai borders and solid gold zari peacock motifs.', 5299.00, 4499.00, '100% Pure Mulberry Silk with Silk Mark Certification', 'Dry clean only. Air out every 6 months away from direct sunlight.', FALSE, TRUE, TRUE, 'published', 'Bhavya Raw Mango Yellow Kanjeevaram Silk Saree | Maison D''Or', 'Authentic heirloom handloom Kanjivaram silk saree with peacock motifs.'),
(10, 'prod-010', 'Chandrika Silver Filigree Chandbali Earrings', 'chandrika-silver-filigree-chandbali-earrings', 'JEW-CHA-010', 4, 1, 'Ethereal crescent chandbali earrings shaped with Cuttack Tarakasi silver filigree work. Handcrafted from fine oxidized brass alloy with dancing miniature seed pearls.', 1899.00, 1599.00, 'Oxidized Silver-tone Brass Alloy with Pearls', 'Wipe with soft chamois cloth. Avoid exposure to water & humidity.', FALSE, FALSE, FALSE, 'published', 'Chandrika Silver Filigree Chandbali Earrings | Maison D''Or', 'Crescent chandbali earrings shaped with Cuttack silver filigree work.'),
(11, 'prod-011', 'Ruhani Lilac Hand-painted Organza Saree', 'ruhani-lilac-hand-painted-organza-saree', 'SAR-ORG-011', 1, 2, 'Airy lilac organza saree adorned with delicate hand-painted watercolor peonies and gilded metallic edges, accompanied by an unstitched raw silk blouse piece.', 3899.00, 3499.00, 'Pure Silk Organza', 'Dry clean only. Do not iron directly on hand-painted surfaces.', FALSE, TRUE, FALSE, 'published', 'Ruhani Lilac Hand-painted Organza Saree | Maison D''Or', 'Airy lilac organza saree adorned with hand-painted watercolor peonies.'),
(12, 'prod-012', 'Ira Ivory Tissue Silk Saree with Rosegold Zari', 'ira-ivory-tissue-silk-saree-rosegold-zari', 'SAR-TIS-012', 1, 1, 'Modern royal sophistication. A luminous ivory tissue silk saree woven with rare blush-rosegold metallic zari threads that catch every ray of ambient light with mesmerizing grandeur.', 4199.00, 3699.00, 'Tissue Silk with Electroplated Rosegold Weave', 'Dry clean only. Store flat without heavy creasing.', TRUE, FALSE, TRUE, 'published', 'Ira Ivory Tissue Silk Saree with Rosegold Zari | Maison D''Or', 'Luminous ivory tissue silk saree woven with blush-rosegold zari.');

-- -----------------------------------------------------------------------------
-- 6. PRODUCT ATTRIBUTES JUNCTIONS & IMAGES
-- -----------------------------------------------------------------------------
-- Product Sizes
INSERT INTO product_sizes (product_id, size_id) VALUES
(1, 1),
(2, 2), (2, 3), (2, 4), (2, 5), (2, 6),
(3, 3), (3, 4), (3, 5), (3, 6),
(4, 7),
(5, 8),
(6, 3), (6, 4), (6, 5),
(7, 3), (7, 4), (7, 5), (7, 6),
(8, 9),
(9, 8),
(10, 10),
(11, 8),
(12, 8);

-- Product Colors
INSERT INTO product_colors (product_id, color_id) VALUES
(1, 1), (1, 2),
(2, 3), (2, 4),
(3, 5), (3, 6),
(4, 7),
(5, 8),
(6, 9),
(7, 10),
(8, 11),
(9, 12),
(10, 13),
(11, 14),
(12, 15);

-- Product Tags
INSERT INTO product_tags (product_id, tag_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 5), (2, 6), (2, 7),
(3, 8), (3, 9),
(4, 10), (4, 11),
(5, 12), (5, 3),
(6, 13), (6, 7),
(7, 14), (7, 1),
(8, 15), (8, 2),
(9, 16), (9, 1),
(10, 17), (10, 11),
(11, 13), (11, 7),
(12, 18), (12, 2);

-- Product Images
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=80', 'Kashi Crimson Pure Katan Silk Saree Drape', 1, TRUE),
(1, 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1000&auto=format&fit=crop&q=80', 'Kashi Crimson Zari Detail', 2, FALSE),
(2, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1000&auto=format&fit=crop&q=80', 'Avani Pistachio Chanderi Silk Kurti Set Front', 1, TRUE),
(2, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&auto=format&fit=crop&q=80', 'Avani Pistachio Kurti Neckline Detail', 2, FALSE),
(3, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop&q=80', 'Sitara Terracotta Handloom Linen Anarkali', 1, TRUE),
(3, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80', 'Sitara Terracotta Full Silhouette', 2, FALSE),
(4, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1000&auto=format&fit=crop&q=80', 'Noor Handcrafted Kundan & Pearl Choker', 1, TRUE),
(4, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000&auto=format&fit=crop&q=80', 'Noor Choker Setting Detail', 2, FALSE),
(5, 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1000&auto=format&fit=crop&q=80', 'Zareen Emerald Green Banarasi Georgette Saree', 1, TRUE),
(6, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&auto=format&fit=crop&q=80', 'Gulzar Organza Embroidered Tiered Maxi Dress', 1, TRUE),
(7, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1000&auto=format&fit=crop&q=80', 'Meera Mustard Ajrakh Modal Silk Kurti', 1, TRUE),
(8, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1000&auto=format&fit=crop&q=80', 'Zardozi Handcrafted Velvet Potli Bag', 1, TRUE),
(9, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=80', 'Bhavya Raw Mango Yellow Kanjeevaram Silk Saree', 1, TRUE),
(10, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1000&auto=format&fit=crop&q=80', 'Chandrika Silver Filigree Chandbali Earrings', 1, TRUE),
(11, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80', 'Ruhani Lilac Hand-painted Organza Saree', 1, TRUE),
(12, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=80', 'Ira Ivory Tissue Silk Saree with Rosegold Zari', 1, TRUE);

-- -----------------------------------------------------------------------------
-- 7. INVENTORY & STOCK LEDGER
-- -----------------------------------------------------------------------------
INSERT INTO inventory (id, product_id, quantity, low_stock_threshold) VALUES
(1, 1, 8, 3),
(2, 2, 12, 3),
(3, 3, 6, 3),
(4, 4, 9, 3),
(5, 5, 5, 3),
(6, 6, 11, 3),
(7, 7, 7, 3),
(8, 8, 14, 3),
(9, 9, 4, 3),
(10, 10, 8, 3),
(11, 11, 5, 3),
(12, 12, 6, 3);

INSERT INTO inventory_movements (inventory_id, movement_type, quantity_delta, balance_after, reference_type, reference_id, notes, created_by) VALUES
(1, 'initial_stock', 8, 8, 'initialization', 'INIT', 'Initial stock entry from Varanasi loom consignment', 1),
(2, 'initial_stock', 12, 12, 'initialization', 'INIT', 'Initial inventory entry', 1),
(3, 'initial_stock', 6, 6, 'initialization', 'INIT', 'Initial inventory entry', 1),
(4, 'initial_stock', 9, 9, 'initialization', 'INIT', 'Initial inventory entry', 1),
(5, 'initial_stock', 5, 5, 'initialization', 'INIT', 'Initial inventory entry', 1),
(6, 'initial_stock', 11, 11, 'initialization', 'INIT', 'Initial inventory entry', 1),
(7, 'initial_stock', 7, 7, 'initialization', 'INIT', 'Initial inventory entry', 1),
(8, 'initial_stock', 14, 14, 'initialization', 'INIT', 'Initial inventory entry', 1),
(9, 'initial_stock', 4, 4, 'initialization', 'INIT', 'Initial inventory entry', 1),
(10, 'initial_stock', 8, 8, 'initialization', 'INIT', 'Initial inventory entry', 1),
(11, 'initial_stock', 5, 5, 'initialization', 'INIT', 'Initial inventory entry', 1),
(12, 'initial_stock', 6, 6, 'initialization', 'INIT', 'Initial inventory entry', 1);

-- -----------------------------------------------------------------------------
-- 8. PROMOTIONS & COUPONS
-- -----------------------------------------------------------------------------
INSERT INTO coupons (id, code, discount_type, value, minimum_order_amount, description, start_at, end_at, status) VALUES
(1, 'WELCOME10', 'percentage', 10.00, 999.00, '10% discount on first boutique order (Min. ₹999)', '2026-01-01 00:00:00', '2026-12-31 23:59:59', 'active'),
(2, 'FESTIVE15', 'percentage', 15.00, 2499.00, '15% festive discount for royal celebration orders (Min. ₹2,499)', '2026-03-01 00:00:00', '2026-05-31 23:59:59', 'active'),
(3, 'LUXE500', 'flat', 500.00, 3999.00, 'Flat ₹500 off on pure silk and luxury collections (Min. ₹3,999)', '2026-02-01 00:00:00', '2026-06-30 23:59:59', 'active'),
(4, 'BOUTIQUE20', 'percentage', 20.00, 5000.00, 'Exclusive 20% off for boutique patrons (Min. ₹5,000)', '2026-03-15 00:00:00', '2026-04-15 23:59:59', 'active'),
(5, 'FREESHIP', 'shipping', 150.00, 499.00, 'Complimentary shipping voucher on all orders above ₹499', '2026-01-01 00:00:00', '2026-12-31 23:59:59', 'paused');

-- -----------------------------------------------------------------------------
-- 9. ORDERS & INVOICING
-- -----------------------------------------------------------------------------
INSERT INTO orders (id, order_number, customer_id, delivery_method, status, subtotal, discount_amount, shipping_amount, tax_amount, final_total, order_date) VALUES
(1, 'BTQ-2026-001', 1, 'express', 'Delivered', 3899.00, 390.00, 0.00, 175.00, 3684.00, '2026-03-10 11:30:00'),
(2, 'BTQ-2026-002', 1, 'standard', 'Shipped', 2199.00, 0.00, 0.00, 110.00, 2309.00, '2026-03-18 15:20:00'),
(3, 'BTQ-2026-003', 2, 'standard', 'Processing', 4298.00, 429.00, 0.00, 193.00, 4062.00, '2026-03-21 09:15:00'),
(4, 'BTQ-2026-004', 4, 'express', 'Confirmed', 4299.00, 0.00, 0.00, 215.00, 4514.00, '2026-03-22 08:00:00'),
(5, 'BTQ-2026-005', 7, 'standard', 'Placed', 3299.00, 330.00, 0.00, 148.00, 3117.00, '2026-03-22 12:15:00'),
(6, 'BTQ-2026-006', 8, 'standard', 'Delivered', 4499.00, 0.00, 0.00, 225.00, 4724.00, '2026-03-01 10:00:00'),
(7, 'BTQ-2026-007', 3, 'standard', 'Shipped', 1899.00, 0.00, 150.00, 95.00, 2144.00, '2026-03-19 14:10:00'),
(8, 'BTQ-2026-008', 5, 'standard', 'Cancelled', 2999.00, 0.00, 0.00, 150.00, 3149.00, '2026-02-25 16:00:00'),
(9, 'BTQ-2026-009', 6, 'express', 'Processing', 3198.00, 0.00, 0.00, 160.00, 3358.00, '2026-03-21 18:30:00'),
(10, 'BTQ-2026-010', 2, 'standard', 'Delivered', 3699.00, 370.00, 0.00, 166.00, 3495.00, '2026-02-14 11:00:00');

-- Order Items
INSERT INTO order_items (id, order_id, product_id, product_name_snapshot, sku_snapshot, selected_size, selected_color, unit_price, quantity, total_price, image_url_snapshot) VALUES
(1, 1, 1, 'Kashi Crimson Pure Katan Silk Saree', 'SAR-KAT-001', 'Free Size', 'Deep Crimson', 3899.00, 1, 3899.00, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'),
(2, 2, 4, 'Noor Handcrafted Kundan & Pearl Choker', 'JEW-KUN-004', 'Adjustable Dori', 'Antique Gold with Emerald Beads', 2199.00, 1, 2199.00, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80'),
(3, 3, 2, 'Avani Pistachio Chanderi Silk Kurti Set', 'KUR-CHA-002', 'M', 'Pistachio Sage', 2899.00, 1, 2899.00, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80'),
(4, 3, 8, 'Zardozi Handcrafted Velvet Potli Bag', 'ACC-POT-008', 'One Size', 'Wine Velvet', 1399.00, 1, 1399.00, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'),
(5, 4, 5, 'Zareen Emerald Green Banarasi Georgette Saree', 'SAR-GEO-005', 'Free Size', 'Deep Emerald', 4299.00, 1, 4299.00, 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80'),
(6, 5, 3, 'Sitara Terracotta Handloom Linen Anarkali', 'DRS-LIN-003', 'M', 'Earthy Terracotta', 3299.00, 1, 3299.00, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80'),
(7, 6, 9, 'Bhavya Raw Mango Yellow Kanjeevaram Silk Saree', 'SAR-KAN-009', 'Free Size', 'Mango Yellow with Magenta', 4499.00, 1, 4499.00, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'),
(8, 7, 7, 'Meera Mustard Ajrakh Modal Silk Kurti', 'KUR-AJR-007', 'L', 'Mustard Ochre', 1899.00, 1, 1899.00, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80'),
(9, 8, 6, 'Gulzar Organza Embroidered Tiered Maxi Dress', 'DRS-ORG-006', 'S', 'Powder Rose', 2999.00, 1, 2999.00, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80'),
(10, 9, 10, 'Chandrika Silver Filigree Chandbali Earrings', 'JEW-CHA-010', 'Standard Pierced', 'Oxidized Antique Silver', 1599.00, 2, 3198.00, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80'),
(11, 10, 12, 'Ira Ivory Tissue Silk Saree with Rosegold Zari', 'SAR-TIS-012', 'Free Size', 'Lustrous Ivory', 3699.00, 1, 3699.00, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80');

-- Order Addresses
INSERT INTO order_addresses (id, order_id, recipient_name, recipient_phone, address_line, city, state, pincode) VALUES
(1, 1, 'Ananya Verma', '+91 98765 43210', 'Flat 402, Lotus Residency, MG Road', 'Bengaluru', 'Karnataka', '560001'),
(2, 2, 'Ananya Verma', '+91 98765 43210', 'Flat 402, Lotus Residency, MG Road', 'Bengaluru', 'Karnataka', '560001'),
(3, 3, 'Priyanka Sen', '+91 98112 34567', '12B Southern Avenue, Ballygunge', 'Kolkata', 'West Bengal', '700029'),
(4, 4, 'Meenakshi Iyer', '+91 99201 88765', '603 Ocean View, Bandra West', 'Mumbai', 'Maharashtra', '400050'),
(5, 5, 'Tanvi Agarwal', '+91 98390 11223', '34 Hazratganj, Park Road', 'Lucknow', 'Uttar Pradesh', '226001'),
(6, 6, 'Suhasini Reddy', '+91 98480 99887', 'Villa 8, Jubilee Hills, Road 36', 'Hyderabad', 'Telangana', '500033'),
(7, 7, 'Divya Nambiar', '+91 97456 12389', 'Panampilly Nagar, 4th Cross', 'Kochi', 'Kerala', '682036'),
(8, 8, 'Simran Kaur', '+91 98722 54321', 'House 52, Sector 8B', 'Chandigarh', 'Punjab', '160009'),
(9, 9, 'Radhika Kulkarni', '+91 94230 76543', 'B-14, Mayur Colony, Kothrud', 'Pune', 'Maharashtra', '411038'),
(10, 10, 'Priyanka Sen', '+91 98112 34567', '12B Southern Avenue, Ballygunge', 'Kolkata', 'West Bengal', '700029');

-- Order Payments
INSERT INTO order_payments (id, order_id, payment_method, payment_status, transaction_id, amount, paid_at, gateway_response) VALUES
(1, 1, 'Online Demo Payment (Credit Card)', 'Paid', 'TXN-984218', 3684.00, '2026-03-10 11:30:00', '{"status":"CAPTURED","auth_code":"AUTH9842"}'),
(2, 2, 'Online Demo Payment (UPI / NetBanking)', 'Paid', 'TXN-984420', 2309.00, '2026-03-18 15:20:00', '{"status":"CAPTURED","vpa":"ananya@okhdfcbank"}'),
(3, 3, 'Cash on Delivery', 'Pending', 'COD-1033', 4062.00, NULL, '{"method":"COD","instruction":"Collect cash upon doorstep delivery"}'),
(4, 4, 'Online Demo Payment (Credit Card)', 'Paid', 'TXN-985112', 4514.00, '2026-03-22 08:00:00', '{"status":"CAPTURED"}'),
(5, 5, 'Online Demo Payment (UPI)', 'Paid', 'TXN-985671', 3117.00, '2026-03-22 12:15:00', '{"status":"CAPTURED"}'),
(6, 6, 'Online Demo Payment (NetBanking)', 'Paid', 'TXN-983100', 4724.00, '2026-03-01 10:00:00', '{"status":"CAPTURED"}'),
(7, 7, 'Online Demo Payment (Credit Card)', 'Paid', 'TXN-984881', 2144.00, '2026-03-19 14:10:00', '{"status":"CAPTURED"}'),
(8, 8, 'Online Demo Payment (Credit Card)', 'Refunded', 'TXN-981122', 3149.00, '2026-02-25 16:00:00', '{"status":"REFUNDED","refund_id":"REF-2201"}'),
(9, 9, 'Online Demo Payment (UPI)', 'Paid', 'TXN-985444', 3358.00, '2026-03-21 18:30:00', '{"status":"CAPTURED"}'),
(10, 10, 'Online Demo Payment (Credit Card)', 'Paid', 'TXN-982900', 3495.00, '2026-02-14 11:00:00', '{"status":"CAPTURED"}');

-- Shipments
INSERT INTO shipments (id, order_id, carrier_name, tracking_number, tracking_url, shipping_date, expected_delivery, dispatched_at, delivered_at) VALUES
(1, 1, 'BlueDart Express', 'BD123456789', 'https://www.bluedart.com/tracking/BD123456789', '2026-03-12', '2026-03-15', '2026-03-12 16:20:00', '2026-03-14 14:45:00'),
(2, 2, 'BlueDart Express', 'BD778899123', 'https://www.bluedart.com/tracking/BD778899123', '2026-03-20', '2026-03-24', '2026-03-20 17:10:00', NULL),
(3, 6, 'DTDC Courier', 'DTDC99881122', 'https://www.dtdc.in/tracking/DTDC99881122', '2026-03-02', '2026-03-06', '2026-03-02 16:00:00', '2026-03-05 13:20:00'),
(4, 7, 'Delhivery Surface', 'DEL554433221', 'https://www.delhivery.com/track/DEL554433221', '2026-03-21', '2026-03-25', '2026-03-21 15:45:00', NULL),
(5, 10, 'BlueDart Express', 'BD443322110', 'https://www.bluedart.com/tracking/BD443322110', '2026-02-16', '2026-02-20', '2026-02-16 14:00:00', '2026-02-19 13:15:00');

-- Order Status History
INSERT INTO order_status_history (order_id, status, note, changed_by, changed_at) VALUES
(1, 'Placed', 'Order placed by customer', NULL, '2026-03-10 11:30:00'),
(1, 'Confirmed', 'Payment verified and confirmed by boutique', 1, '2026-03-10 13:15:00'),
(1, 'Processing', 'Handcrafted inspection & signature packaging', 1, '2026-03-11 10:00:00'),
(1, 'Shipped', 'Dispatched via BlueDart Express', 1, '2026-03-12 16:20:00'),
(1, 'Delivered', 'Delivered to resident at Bangalore', NULL, '2026-03-14 14:45:00'),
(2, 'Placed', 'Order placed by customer', NULL, '2026-03-18 15:20:00'),
(2, 'Confirmed', 'Order confirmed', 1, '2026-03-18 16:00:00'),
(2, 'Processing', 'Quality check and packing', 1, '2026-03-19 11:30:00'),
(2, 'Shipped', 'Handed over to courier partner', 1, '2026-03-20 17:10:00'),
(3, 'Placed', 'Order placed via Cash on Delivery', NULL, '2026-03-21 09:15:00'),
(3, 'Confirmed', 'Customer verified over call', 1, '2026-03-21 10:45:00'),
(3, 'Processing', 'Under stitching finishing check', 1, '2026-03-21 14:00:00'),
(4, 'Placed', 'Order placed by customer', NULL, '2026-03-22 08:00:00'),
(4, 'Confirmed', 'Confirmed for artisanal packaging', 1, '2026-03-22 08:45:00'),
(5, 'Placed', 'Order placed by customer', NULL, '2026-03-22 12:15:00'),
(6, 'Placed', 'Order placed', NULL, '2026-03-01 10:00:00'),
(6, 'Confirmed', 'Order confirmed', 1, '2026-03-01 11:30:00'),
(6, 'Processing', 'Prepared for dispatch', 1, '2026-03-02 09:15:00'),
(6, 'Shipped', 'Dispatched via DTDC', 1, '2026-03-02 16:00:00'),
(6, 'Delivered', 'Delivered to recipient', NULL, '2026-03-05 13:20:00'),
(7, 'Placed', 'Order placed', NULL, '2026-03-19 14:10:00'),
(7, 'Confirmed', 'Order confirmed', 1, '2026-03-19 15:30:00'),
(7, 'Processing', 'Packed', 1, '2026-03-20 10:00:00'),
(7, 'Shipped', 'Dispatched with Delhivery', 1, '2026-03-21 15:45:00'),
(8, 'Placed', 'Order placed', NULL, '2026-02-25 16:00:00'),
(8, 'Cancelled', 'Cancelled on customer request before dispatch. Refund processed.', 1, '2026-02-26 10:00:00'),
(9, 'Placed', 'Order placed', NULL, '2026-03-21 18:30:00'),
(9, 'Confirmed', 'Confirmed', 1, '2026-03-21 19:15:00'),
(9, 'Processing', 'Jewellery polishing and gift box packing', 1, '2026-03-22 09:30:00'),
(10, 'Placed', 'Order placed', NULL, '2026-02-14 11:00:00'),
(10, 'Confirmed', 'Confirmed', 1, '2026-02-14 13:00:00'),
(10, 'Processing', 'Dispatched', 1, '2026-02-15 10:00:00'),
(10, 'Shipped', 'Shipped via BlueDart', 1, '2026-02-16 14:00:00'),
(10, 'Delivered', 'Delivered', NULL, '2026-02-19 13:15:00');

-- Order Coupons
INSERT INTO order_coupons (order_id, coupon_id, coupon_code_snapshot, discount_type_snapshot, discount_value_snapshot, applied_discount_amount) VALUES
(1, 1, 'WELCOME10', 'percentage', 10.00, 390.00),
(3, 1, 'WELCOME10', 'percentage', 10.00, 429.00),
(5, 1, 'WELCOME10', 'percentage', 10.00, 330.00),
(10, 1, 'WELCOME10', 'percentage', 10.00, 370.00);

-- -----------------------------------------------------------------------------
-- 10. REVIEWS & CUSTOMER FEEDBACK
-- -----------------------------------------------------------------------------
INSERT INTO reviews (id, product_id, customer_id, order_id, order_item_id, rating, title, comment, status, is_verified_purchase, submitted_at, moderated_at, moderated_by) VALUES
(1, 1, 1, 1, 1, 5, 'Breathtaking drape & royal luster!', 'Wore this for my brother’s sangeet in Bengaluru. The silk weight is authentic and the gold zari shimmered subtly under evening lights without being garish. Truly heirloom quality.', 'approved', TRUE, '2026-03-15 10:30:00', '2026-03-15 14:00:00', 1),
(2, 2, 2, NULL, NULL, 5, 'Superb fitting and soothing color', 'The organza dupatta with scalloped borders elevates this simple kurti into a luxury statement. Got multiple compliments at work.', 'approved', TRUE, '2026-03-12 11:15:00', '2026-03-12 15:30:00', 1),
(3, 4, 8, NULL, NULL, 5, 'Exquisite craftsmanship!', 'The kundan setting looks indistinguishable from real polki jewellery. Packaged in a velvet pouch with a certificate of authenticity.', 'approved', TRUE, '2026-03-08 09:45:00', '2026-03-08 12:00:00', 1),
(4, 3, 7, NULL, NULL, 4, 'Very comfortable pure linen', 'Love the pockets and the natural earthy hue. Requires light steam ironing after washing, but drapes wonderfully.', 'approved', TRUE, '2026-03-02 16:20:00', '2026-03-02 18:00:00', 1),
(5, 8, 4, NULL, NULL, 5, 'Deep rich wine shade with fine zardozi', 'Fits iPhone 15 Pro along with lipstick and compact easily. The pearl tassels add an ethereal touch.', 'approved', TRUE, '2026-02-28 14:00:00', '2026-02-28 17:10:00', 1),
(6, 7, 3, NULL, NULL, 5, 'Softest modal silk fabric', 'The vegetable dyes smell fresh and organic. Highly recommended for daytime festive gatherings.', 'approved', TRUE, '2026-02-20 13:10:00', '2026-02-20 16:00:00', 1),
(7, 5, 1, 4, 5, 5, 'Pending Review Demo: Mesmerizing green shade', 'Submitting this review from recent purchase. The fall of the georgette is so effortless and light.', 'pending', TRUE, '2026-03-21 16:00:00', NULL, NULL),
(8, 10, 6, 9, 10, 4, 'Pending Review Demo: Delicate silver filigree work', 'Artisanal touch is evident. Slightly delicate dori, but gorgeous design.', 'pending', TRUE, '2026-03-22 10:00:00', NULL, NULL);

-- -----------------------------------------------------------------------------
-- 11. CONCIERGE INQUIRIES
-- -----------------------------------------------------------------------------
INSERT INTO enquiries (id, customer_id, contact_name, contact_email, contact_phone, message, status, submitted_at) VALUES
(1, NULL, 'Kavita Chawla', 'kavita.chawla@example.com', '+91 98200 45678', 'Inquiring about custom blouse stitching measurements and expedited delivery for Kashi Crimson Silk Saree before April 10.', 'New', '2026-03-21 16:30:00'),
(2, NULL, 'Archana Menon', 'archana.menon@example.com', '+91 98471 22334', 'Do you offer international shipping to Singapore for bridesmaid bridal sets?', 'Contacted', '2026-03-20 11:15:00'),
(3, NULL, 'Shalini Gupta', 'shalini.gupta@example.com', '+91 99100 88990', 'Can I book a private bridal consultation appointment at your Bengaluru atelier this weekend?', 'Resolved', '2026-03-18 14:00:00');

-- -----------------------------------------------------------------------------
-- 12. STORE CONFIGURATION
-- -----------------------------------------------------------------------------
INSERT INTO store_settings (id, boutique_name, tagline, currency_code, currency_symbol, gst_number, phone, email, flagship_address, visiting_hours, free_shipping_threshold, standard_shipping_fee, instagram_handle, whatsapp_number) VALUES
(1, 'Maison D''Or Heritage Atelier', 'Slow Luxury Handloom Sarees, Kurtis & Antique Adornments', 'INR', '₹', '29AAACM1234F1Z8', '+91 80 4123 7890', 'concierge@maisondorboutique.demo', 'Plot 14, Heritage Arcade, Lavelle Road, Bengaluru, Karnataka - 560001', 'Monday – Saturday: 10:30 AM – 8:00 PM', 1999.00, 150.00, '@maisondor_boutique', '+91 98765 43210');

-- -----------------------------------------------------------------------------
-- 13. HOMEPAGE CMS
-- -----------------------------------------------------------------------------
INSERT INTO homepage_announcement (id, text, is_enabled) VALUES
(1, 'Complimentary shipping on orders above ₹1,999 • Artisanal packaging with handwritten notes', TRUE);

INSERT INTO homepage_hero (id, title, subtitle, image_url, primary_btn_text, primary_btn_link, secondary_btn_text, secondary_btn_link, status) VALUES
(1, 'Elegance in Every Detail', 'Discover our latest boutique collection of handwoven heritage sarees, contemporary tunics, and artisanal adornments.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&auto=format&fit=crop&q=85', 'SHOP COLLECTION', '/shop', 'EXPLORE NEW ARRIVALS', '/new-arrivals', 'published');

INSERT INTO homepage_promo_banner (id, badge, title, subtitle, image_url, button_text, button_link, status) VALUES
(1, 'Limited Festive Release', 'Royal Banarasi Silk Edition', 'Hand-dyed mulberry yarns, Kadwa zari borders, and timeless ceremonial silhouettes.', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1600&auto=format&fit=crop&q=85', 'EXPLORE COLLECTION', '/collections/festive', 'published');

SET FOREIGN_KEY_CHECKS = 1;
