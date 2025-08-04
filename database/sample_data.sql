-- ==========================================
-- SAMPLE DATA for WOW Marketplace
-- ==========================================

-- Insert sample sellers
INSERT INTO sellers (business_name, owner_name, email, phone, business_type, address, city, governorate, status, is_verified) VALUES
('متجر الجمال السوري', 'أحمد محمد', 'ahmed@beautystore.sy', '+963991234567', 'cosmetics', 'شارع الثورة، المزة', 'دمشق', 'دمشق', 'approved', true),
('إلكترونيات حلب', 'فاطمة علي', 'fatima@aleppotech.sy', '+963994567890', 'electronics', 'شارع الملك فيصل', 'حلب', 'حلب', 'approved', true),
('أزياء دمشق الحديثة', 'محمد خالد', 'mohammed@damascusfashion.sy', '+963997891234', 'fashion', 'المالكي، دمشق', 'دمشق', 'دمشق', 'pending', false);

-- Insert sample buyers
INSERT INTO buyers (first_name, last_name, phone, address, city, governorate) VALUES
('سارة', 'أحمد', '+963991111111', 'جرمانا، دمشق', 'دمشق', 'ريف دمشق'),
('محمد', 'علي', '+963992222222', 'الصالحية، دمشق', 'دمشق', 'دمشق'),
('ليلى', 'خالد', '+963993333333', 'العزيزية، حلب', 'حلب', 'حلب');

-- Insert sample products
INSERT INTO products (seller_id, name, brand, category, subcategory, price, description, color, size, stock, images) VALUES
(1, 'أحمر شفاه مات من لوريال', 'L''OREAL', 'cosmetics', 'lipstick', 825, 'أحمر شفاه ترطيبي مقاوم للماء يدوم طويلاً', 'أحمر غامق', '3.5g', 15, '{"/images/products/loreal-lipstick-red.jpg"}'),
(1, 'كريم مرطب من غارنييه', 'GARNIER', 'cosmetics', 'moisturizer', 650, 'كريم مرطب يومي للبشرة الحساسة والجافة', NULL, '50ml', 20, '{"/images/products/garnier-moisturizer.jpg"}'),
(2, 'هاتف سامسونغ غالاكسي', 'SAMSUNG', 'electronics', 'smartphone', 125000, 'هاتف ذكي بشاشة 6.1 انش وكاميرا 50 ميجابكسل', 'أسود', '128GB', 5, '{"/images/products/samsung-galaxy.jpg"}'),
(3, 'فستان صيفي أنيق', 'Local Brand', 'fashion', 'dress', 2500, 'فستان صيفي قطني مناسب للصيف', 'أزرق فاتح', 'M', 8, '{"/images/products/summer-dress.jpg"}');