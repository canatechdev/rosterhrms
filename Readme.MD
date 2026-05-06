

-- NOT FOR NOW
-- CREATE TABLE user_transfer (
-- 	user_transfer_id BIGSERIAL PRIMARY KEY,
-- 	user_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
-- 	from_zp_id BIGINT REFERENCES zp(zp_id) ON DELETE SET NULL,
-- 	to_zp_id BIGINT REFERENCES zp(zp_id) ON DELETE SET NULL,
-- 	from_post_reservation_id BIGINT REFERENCES post_reservations(post_id) ON DELETE SET NULL,
-- 	to_post_reservation_id BIGINT REFERENCES post_reservations(post_id) ON DELETE SET NULL,
-- 	transferred_by BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
-- 	transfer_date TIMESTAMP DEFAULT NOW(),
-- 	reason TEXT,
-- 	status INT NOT NULL DEFAULT 1
-- );







-- CREATE TABLE roster_template (
--     template_id SERIAL PRIMARY KEY,
--     point_no INT,
--     caste_id INT,
--     cycle_size INT DEFAULT 100
-- );

-- CREATE TABLE roster_points (
--     roster_id SERIAL PRIMARY KEY,
--     cadre_post_id INT REFERENCES cadre_posts(cadre_post_id),
--     point_no INT,
--     caste_id INT REFERENCES castes(caste_id),
--     cycle_no INT DEFAULT 1,
--     is_filled BOOLEAN DEFAULT FALSE,
--     vacancy_id INT,
--     created_at TIMESTAMP DEFAULT NOW(),
--     status INT DEFAULT 1,
--     zp_id INT
-- );

-- CREATE TABLE vacancies (
--     vacancy_id SERIAL PRIMARY KEY,
--     cadre_post_id INT REFERENCES cadre_posts(cadre_post_id),
--     roster_point INT,
--     caste_id INT REFERENCES castes(caste_id),
--     status VARCHAR(50), -- OPEN / FILLED
--     created_at TIMESTAMP DEFAULT NOW(),
-- 	user_id INT,
--     zp_id INT
-- );
-- CREATE UNIQUE INDEX unique_active_user_vacancy
-- ON vacancies(user_id)
-- WHERE status = 'FILLED';


-- CREATE TABLE audit_logs (
--     log_id SERIAL PRIMARY KEY,
--     action VARCHAR(100),
--     cadre_post_id INT,
--     vacancy_id INT,
--     created_at TIMESTAMP DEFAULT NOW(),
--     zp_id INT
-- );

--  CREATE TABLE employee_movements (
--     movement_id SERIAL PRIMARY KEY,
--     user_id INT NOT NULL,
--     movement_type VARCHAR(20), 
--     from_zp INT,
--     to_zp INT,
--     from_post_id INT,
--     to_post_id INT,
--     from_vacancy_id INT,
--     to_vacancy_id INT,
--     reason TEXT,
--     effective_date DATE DEFAULT CURRENT_DATE,
--     created_at TIMESTAMP DEFAULT NOW()
-- );