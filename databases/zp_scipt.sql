BEGIN;
	CREATE TABLE districts (
		district_id BIGSERIAL PRIMARY KEY,
		name VARCHAR(100) NOT NULL,
		name_mr VARCHAR(200),
		status INT NOT NULL DEFAULT 1
	);
	alter table districts add column name_mr VARCHAR(200);
	
	CREATE TABLE genders(
		gender_id BIGSERIAL PRIMARY KEY,
		name VARCHAR(50) NOT NULL,
		name_mr VARCHAR(200),
		status INT NOT NULL DEFAULT 1
	);
	CREATE TABLE roles (
		role_id BIGSERIAL PRIMARY KEY,
		name VARCHAR(100) NOT NULL,
		description TEXT
	);
	CREATE TABLE castes (
		caste_id BIGSERIAL PRIMARY KEY,
		name VARCHAR(100) NOT NULL,
		name_mr VARCHAR(200),
		full_name VARCHAR(100) NOT NULL,
		full_name_mr VARCHAR(200),
		status INT NOT NULL DEFAULT 1,
		priority INT NOT NULL,
		status INT NOT NULL DEFAULT 1
	);
	alter table castes add column full_name_mr TEXT;
	alter table castes add column name_mr VARCHAR(200);

	create table zp (
		zp_id BIGSERIAL PRIMARY KEY,
		name VARCHAR(100) NOT NULL,
		name_mr VARCHAR(200),
		district_id BIGINT REFERENCES districts(district_id) ON DELETE SET NULL,
		status INT NOT NULL DEFAULT 1,
		created_at TIMESTAMP DEFAULT NOW(),
		updated_at TIMESTAMP DEFAULT NOW()
	); 
	CREATE TABLE departments (
		department_id BIGSERIAL PRIMARY KEY,
		zp_id BIGINT REFERENCES zp(zp_id) ON DELETE SET NULL,
		name VARCHAR(100) NOT NULL,
		status INT NOT NULL DEFAULT 1
	);
	CREATE TABLE users (
		user_id BIGSERIAL PRIMARY KEY,
		email TEXT NOT NULL UNIQUE,
		phone VARCHAR(15),
		password TEXT NOT NULL,
		status INT NOT NULL DEFAULT 1,
		zp_id BIGINT REFERENCES zp(zp_id),
		caste_id BIGINT REFERENCES castes(caste_id) ON DELETE SET NULL,
		role_id BIGINT REFERENCES roles(role_id) ON DELETE SET NULL,
		is_verified BOOLEAN DEFAULT FALSE,
		created_at TIMESTAMP DEFAULT NOW(),
		updated_at TIMESTAMP DEFAULT NOW()
	);
	CREATE TABLE posts (
		post_id BIGSERIAL PRIMARY KEY,
		department_id BIGINT REFERENCES departments(department_id) ON DELETE SET NULL,
		designation VARCHAR(255) NOT NULL,
		status INT NOT NULL DEFAULT 1,
		total_positions INT NOT NULL,
		created_at TIMESTAMP DEFAULT NOW(),
		updated_at TIMESTAMP DEFAULT NOW()
	);
	CREATE TABLE user_profile(
		profile_id BIGSERIAL PRIMARY KEY,
		user_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
		first_name VARCHAR(50),
		last_name VARCHAR(50),
		zp_id BIGINT REFERENCES zp(zp_id) ON DELETE SET NULL,
		department_id BIGINT REFERENCES departments(department_id) ON DELETE SET NULL,
		post_id BIGINT REFERENCES posts(post_id) ON DELETE SET NULL,
		gender_id BIGINT REFERENCES genders(gender_id) ON DELETE SET NULL,
		joining_date TIMESTAMP,
		retirement_date TIMESTAMP,
		status INT NOT NULL DEFAULT 1,
		created_by BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
		created_at TIMESTAMP DEFAULT NOW(),
		updated_at TIMESTAMP DEFAULT NOW(),
		current_vacancy_id BIGINT REFERENCES vacancies(vacancy_id) ON DELETE SET NULL
	);

	CREATE TABLE permissions (
		permission_id BIGSERIAL PRIMARY KEY,
		name VARCHAR(100) NOT NULL
	);

	CREATE TABLE role_permissions (
		role_id BIGINT REFERENCES roles(role_id) ON DELETE CASCADE,
		permission_id BIGINT REFERENCES permissions(permission_id) ON DELETE CASCADE,
		PRIMARY KEY (role_id, permission_id)
	);


	CREATE TABLE post_reservations (
		post_reservation_id BIGSERIAL PRIMARY KEY,
		post_id BIGINT REFERENCES posts(post_id) ON DELETE CASCADE,
		caste_id BIGINT REFERENCES castes(caste_id) ON DELETE SET NULL,
		caste_seats INT NOT NULL,
		UNIQUE(post_id, caste_id)
	);

	-- CREATE TABLE reservation_points (
	-- 	id BIGSERIAL PRIMARY KEY,
	-- 	caste_id BIGINT NOT NULL REFERENCES castes(caste_id) ON DELETE CASCADE,
	-- 	point INT NOT NULL,
	-- 	UNIQUE (point)
	-- );
	CREATE TABLE refresh_tokens(
		token_id BIGSERIAL PRIMARY KEY,
		user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		token TEXT NOT NULL,
		expires_at TIMESTAMP NOT NULL,
		created_at TIMESTAMP DEFAULT NOW()
	);
	-- CREATE TABLE auth_otp(
	-- 	otp_id UUID PRIMARY KEY,
	-- 	user_id TEXT GENERATED ALWAYS AS (email) STORED,
	-- 	email TEXT NOT NULL,
	-- 	otp_hash TEXT NOT NULL,
	-- 	attempts INT NOT NULL DEFAULT 0,
	-- 	expires_at TIMESTAMP NOT NULL DEFAULT NOW() + INTERVAL '10 minutes',
	-- 	created_at TIMESTAMP NOT NULL DEFAULT NOW()
	-- );
COMMIT;
-- -- NOT FOR NOW
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
-- NOT FOR NOW
CREATE TABLE user_transfer (
	user_transfer_id BIGSERIAL PRIMARY KEY,
	user_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
	from_zp_id BIGINT REFERENCES zp(zp_id) ON DELETE SET NULL,
	to_zp_id BIGINT REFERENCES zp(zp_id) ON DELETE SET NULL,
	from_post_reservation_id BIGINT REFERENCES post_reservations(post_id) ON DELETE SET NULL,
	to_post_reservation_id BIGINT REFERENCES post_reservations(post_id) ON DELETE SET NULL,
	transferred_by BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
	transfer_date TIMESTAMP DEFAULT NOW(),
	reason TEXT,
	status INT NOT NULL DEFAULT 1
);

CREATE TABLE cadre (
    cadre_id SERIAL PRIMARY KEY,
    zp_id INT NOT NULL,
    department_id INT NOT NULL,
    cadre_name VARCHAR(100) NOT NULL,
    description TEXT,
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);
alter table cadre add column description_mr TEXT;
alter table cadre add column cadre_name_mr VARCHAR(200);

CREATE TABLE cadre_posts (
    cadre_post_id SERIAL PRIMARY KEY,
    cadre_id INT NOT NULL,
    post_id INT REFERENCES posts(post_id),  
    level_order INT,
    total_posts INT,
    filled_posts INT DEFAULT 0,
    cycle_size INT DEFAULT 100,
	zp_id INT NOT NULL,
    status INT DEFAULT 1
);

CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    zp_id INT NOT NULL,  
    department_id INT,
    designation VARCHAR(100),
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE roster_template (
    template_id SERIAL PRIMARY KEY,
    point_no INT,
    caste_id INT,
    cycle_size INT DEFAULT 100
);

CREATE TABLE roster_points (
    roster_id SERIAL PRIMARY KEY,
    cadre_post_id INT REFERENCES cadre_posts(cadre_post_id),
    point_no INT,
    caste_id INT REFERENCES castes(caste_id),
    cycle_no INT DEFAULT 1,
    is_filled BOOLEAN DEFAULT FALSE,
    vacancy_id INT,
    created_at TIMESTAMP DEFAULT NOW(),
    status INT DEFAULT 1,
    zp_id INT
);

CREATE TABLE vacancies (
    vacancy_id SERIAL PRIMARY KEY,
    cadre_post_id INT REFERENCES cadre_posts(cadre_post_id),
    roster_point INT,
    caste_id INT REFERENCES castes(caste_id),
    status VARCHAR(50), -- OPEN / FILLED
    created_at TIMESTAMP DEFAULT NOW(),
	user_id INT,
    zp_id INT
);
CREATE UNIQUE INDEX unique_active_user_vacancy
ON vacancies(user_id)
WHERE status = 'FILLED';


CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    action VARCHAR(100),
    cadre_post_id INT,
    vacancy_id INT,
    created_at TIMESTAMP DEFAULT NOW(),
    zp_id INT
);

 CREATE TABLE employee_movements (
    movement_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    movement_type VARCHAR(20), 
    from_zp INT,
    to_zp INT,
    from_post_id INT,
    to_post_id INT,
    from_vacancy_id INT,
    to_vacancy_id INT,
    reason TEXT,
    effective_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW()
);
