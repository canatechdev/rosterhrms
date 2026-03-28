create table zp (
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	district_id BIGINT REFERENCES districts(district_id) ON DELETE SET NULL,
	status INT NOT NULL DEFAULT 1,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
); 

CREATE TABLE districts (
	district_id BIGSERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	status INT NOT NULL DEFAULT 1
);
CREATE TABLE departments (
	department_id BIGSERIAL PRIMARY KEY,
	zp_id BIGINT REFERENCES zp(id) ON DELETE SET NULL,
	name VARCHAR(100) NOT NULL,
	status INT NOT NULL DEFAULT 1
);
CREATE TABLE roles (
	role_id BIGSERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	description TEXT
);
CREATE TABLE users (
	user_id BIGSERIAL PRIMARY KEY,
	email TEXT NOT NULL UNIQUE,
	phone VARCHAR(15),
	password TEXT NOT NULL,
	status INT NOT NULL DEFAULT 1,
	zp_id BIGINT REFERENCES zp(id),
	caste_id BIGINT REFERENCES castes(id) ON DELETE SET NULL,
	role_id BIGINT REFERENCES roles(role_id) ON DELETE SET NULL,
	is_verified BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE genders(
	gender_id BIGSERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	status INT NOT NULL DEFAULT 1
);
CREATE TABLE user_profile(
	profile_id BIGSERIAL PRIMARY KEY,
	user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	zp_id BIGINT REFERENCES zp(id) ON DELETE SET NULL,
	department_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
	post_id BIGINT REFERENCES posts(id) ON DELETE SET NULL,
	gender_id BIGINT REFERENCES genders(id) ON DELETE SET NULL,
	joining_date TIMESTAMP,
	retirement_date TIMESTAMP,
	status INT NOT NULL DEFAULT 1,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE permissions (
	permission_id BIGSERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL
);

CREATE TABLE role_permissions (
	role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
	permission_id BIGINT REFERENCES permissions(id) ON DELETE CASCADE,
	PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE castes (
	caste_id BIGSERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	full_name VARCHAR(100) NOT NULL,
	priority INT NOT NULL,
	status INT NOT NULL DEFAULT 1
);

CREATE TABLE posts (
	id BIGSERIAL PRIMARY KEY,
	department_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
	designation VARCHAR(255) NOT NULL,
	status INT NOT NULL DEFAULT 1,
	total_positions INT NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE post_reservations (
	id BIGSERIAL PRIMARY KEY,
	post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
	caste_id BIGINT REFERENCES castes(id) ON DELETE SET NULL,
	total_seats INT NOT NULL,
	filled_seats INT NOT NULL,
	UNIQUE(post_id, caste_id)
);

CREATE TABLE refresh_tokens(
	id BIGSERIAL PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	token TEXT NOT NULL,
	expires_at TIMESTAMP NOT NULL,
	created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE auth_otp(
	id UUID PRIMARY KEY,
	user_id TEXT GENERATED ALWAYS AS (email) STORED,
	email TEXT NOT NULL,
	otp_hash TEXT NOT NULL,
	attempts INT NOT NULL DEFAULT 0,
	expires_at TIMESTAMP NOT NULL DEFAULT NOW() + INTERVAL '10 minutes',
	created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- NOT FOR NOW
CREATE TABLE user_transfer (
	id BIGSERIAL PRIMARY KEY,
	user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
	from_zp_id BIGINT REFERENCES zp(id) ON DELETE SET NULL,
	to_zp_id BIGINT REFERENCES zp(id) ON DELETE SET NULL,
	from_post_reservation_id BIGINT REFERENCES post_reservations(id) ON DELETE SET NULL,
	to_post_reservation_id BIGINT REFERENCES post_reservations(id) ON DELETE SET NULL,
	transferred_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
	transfer_date TIMESTAMP DEFAULT NOW(),
	reason TEXT,
	status INT NOT NULL DEFAULT 1
);
