BEGIN;

	-- ─────────────────────────────────────────
	-- LOOKUP / MASTER TABLES
	-- ─────────────────────────────────────────

	CREATE TABLE enum_master (
		enum_id    BIGINT,
		name      VARCHAR(100) NOT NULL,  -- e.g. "married", "unmarried", "widow"
		master_name  VARCHAR(100) NOT NULL,  -- e.g. "marital_status"
		sort_index INT NOT NULL DEFAULT 1,
		is_active     BOOLEAN NOT NULL DEFAULT TRUE,
		PRIMARY KEY (enum_id, master_name)
	);

	CREATE TABLE districts (
		district_id BIGSERIAL PRIMARY KEY,
		name VARCHAR(100) NOT NULL UNIQUE,
		name_mr VARCHAR(200),
		status INT NOT NULL DEFAULT 1
	);

	CREATE TABLE zp (
		zp_id BIGSERIAL PRIMARY KEY,
		district_id BIGINT REFERENCES districts(district_id) ON DELETE SET NULL,
		name VARCHAR(100) NOT NULL,
		name_mr VARCHAR(200),
		status INT NOT NULL DEFAULT 1,
		created_at TIMESTAMP DEFAULT NOW(),
		updated_at TIMESTAMP DEFAULT NOW()
	); 

	CREATE TABLE genders (
		gender_id BIGSERIAL PRIMARY KEY,
		name VARCHAR(50) NOT NULL,
		name_mr VARCHAR(200),
		status INT NOT NULL DEFAULT 1
	);

	CREATE TABLE castes (
		caste_id  BIGSERIAL PRIMARY KEY,
		name      VARCHAR(100) NOT NULL,  -- SC, ST, OBC etc (code)
		full_name VARCHAR(200) NOT NULL,  -- full Marathi name
		full_name_mr VARCHAR(200),
		priority  INT NOT NULL,
		status    INT NOT NULL DEFAULT 1
	);

	-- ─────────────────────────────────────────
	-- ACCESS CONTROL
	-- ─────────────────────────────────────────

	CREATE TABLE roles (
		role_id     BIGSERIAL PRIMARY KEY,
		name        VARCHAR(100) NOT NULL, -- super_admin, zp_admin, dept_head, employee
		description TEXT
	);

	CREATE TABLE permissions (
		permission_id BIGSERIAL PRIMARY KEY UNIQUE,
		name          VARCHAR(100) NOT NULL
	);

	CREATE TABLE role_permissions (
		role_id       BIGINT REFERENCES roles(role_id) ON DELETE CASCADE,
		permission_id BIGINT REFERENCES permissions(permission_id) ON DELETE CASCADE,
		PRIMARY KEY (role_id, permission_id)
	);

	-- ─────────────────────────────────────────
	-- ORG STRUCTURE
	-- ─────────────────────────────────────────

	CREATE TABLE departments (
		department_id BIGSERIAL PRIMARY KEY,
		zp_id         BIGINT REFERENCES zp(zp_id) ON DELETE SET NULL,
		name          VARCHAR(100) NOT NULL,
		code		  VARCHAR(20) NOT NULL UNIQUE,
		name_mr       VARCHAR(200),
		status        INT NOT NULL DEFAULT 1,
		UNIQUE(zp_id, name)
	);

	CREATE TABLE posts (
		post_id         BIGSERIAL PRIMARY KEY,
		department_id   BIGINT REFERENCES departments(department_id) ON DELETE SET NULL,
		designation     VARCHAR(255) NOT NULL,
		designation_mr  VARCHAR(255),
		total_positions INT NOT NULL DEFAULT 0,
		status          INT NOT NULL DEFAULT 1,
		created_at      TIMESTAMP DEFAULT NOW(),
		updated_at      TIMESTAMP DEFAULT NOW()
	);

	-- Cadre: named service group (e.g. "Accounts Cadre", "Engineering Cadre")
	CREATE TABLE cadres (
    	cadre_id SERIAL PRIMARY KEY,
    	zp_id INT NOT NULL,
    	department_id INT NOT NULL,
    	cadre_name VARCHAR(100) NOT NULL,
		cadre_name_mr VARCHAR(200),
    	description TEXT,
		description_mr TEXT,
		cadre_group   CHAR(1) NOT NULL,  -- A, B, C, D
    	status INT DEFAULT 1,
    	created_at TIMESTAMP DEFAULT NOW()
	);

	-- Post levels within a cadre with promotion order
	CREATE TABLE cadre_posts (
		cadre_post_id       BIGSERIAL PRIMARY KEY,
		cadre_id            BIGINT NOT NULL REFERENCES cadres(cadre_id) ON DELETE CASCADE,
		post_id             BIGINT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
		level_order         INT NOT NULL,    -- 1=entry, 2=first promotion...
		total_posts 		INT NOT NULL DEFAULT 0,
		filled_posts        INT NOT NULL DEFAULT 0,
		cycle_size INT DEFAULT 100,
		zp_id INT NOT NULL,
		status              INT DEFAULT 1
	);

	-- ─────────────────────────────────────────
	-- CORE AUTH
	-- ─────────────────────────────────────────

	CREATE TABLE users (
		user_id     BIGSERIAL PRIMARY KEY,
		email       TEXT NOT NULL UNIQUE,
		phone       VARCHAR(15),
		password    TEXT NOT NULL,
		role_id     BIGINT REFERENCES roles(role_id) ON DELETE SET NULL,
		zp_id       BIGINT REFERENCES zp(zp_id) ON DELETE SET NULL,
		is_verified BOOLEAN DEFAULT FALSE,
		status      INT NOT NULL DEFAULT 1,
		created_at  TIMESTAMP DEFAULT NOW(),
		updated_at  TIMESTAMP DEFAULT NOW()
	);

	CREATE TABLE refresh_tokens (
		token_id   BIGSERIAL PRIMARY KEY,
		user_id    BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		token      TEXT NOT NULL,
		expires_at TIMESTAMP NOT NULL,
		created_at TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 1-6: PERSONAL INFO + PHOTO
	-- ─────────────────────────────────────────

	CREATE TABLE employee_profiles (
		profile_id                  BIGSERIAL PRIMARY KEY,
		user_id                     BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		employee_id					TEXT, -- FOR NOW TEXT LATER BIGINT OR VARCHAR
		-- Identity (Section 1)
		salutation                  VARCHAR(20),         -- Mr, Mrs, Dr, Er, Prof, Ms, Smt, N/A
		first_name                  VARCHAR(100),
		first_name_mr               VARCHAR(100),
		middle_name                 VARCHAR(100),        -- father's / husband's name
		middle_name_mr              VARCHAR(100),
		last_name                   VARCHAR(100),
		last_name_mr                VARCHAR(100),
		full_name_marathi           TEXT,                -- with mother's name
		father_full_name            VARCHAR(150),
		mother_full_name            VARCHAR(150),
		name_changed                BOOLEAN DEFAULT FALSE,
		previous_name               VARCHAR(150),
		blood_group                 VARCHAR(5),          -- A+, B-, AB+, O- etc
		gender_id                   BIGINT REFERENCES genders(gender_id) ON DELETE SET NULL,
		dob                         DATE,
		pan_number                  VARCHAR(20),
		aadhar_number               VARCHAR(20) UNIQUE,
		govt_email                  VARCHAR(150),
		religion                    VARCHAR(50),         -- Hindu, Muslim, Buddhist etc (English code)
		caste_id                    BIGINT REFERENCES castes(caste_id) ON DELETE SET NULL,
		caste_validity_cert         VARCHAR(100),
		caste_validity_date         DATE,
		mother_tongue               VARCHAR(50),

		-- Section 2: First appointment type
		first_appointment_type      VARCHAR(100),        -- direct/promotion/compassionate/etc
		cadre_service_name          VARCHAR(100),        -- संवर्गातील सेवा
		dept_entry_exam_date        DATE,                -- सेवा प्रवेशात्तर परीक्षा दिनांक

		-- Section 3: Service dates & identifiers
		govt_service_joining_date   DATE,
		current_office_joining_date DATE,
		retirement_date             DATE,
		sevarth_number              VARCHAR(50),
		shaalarth_number            VARCHAR(50),
		height_cm                   SMALLINT,
		identification_mark         TEXT,

		-- Section 4: Misc flags & financial IDs
		is_ex_serviceman            BOOLEAN DEFAULT FALSE,
		has_domicile_cert           BOOLEAN DEFAULT FALSE,
		spouse_in_service           BOOLEAN DEFAULT FALSE,
		spouse_service_type         VARCHAR(50),         -- govt / semi-govt
		spouse_office_type          VARCHAR(100),
		spouse_office_details       VARCHAR(200),        -- office name, taluka, district
		spouse_employee_no          VARCHAR(50),
		has_pran                    BOOLEAN DEFAULT FALSE,
		pran_number                 VARCHAR(30),
		gpf_number                  VARCHAR(30),
		ppo_number                  VARCHAR(30),
		ppo_date                    DATE,

		-- Section 5: Marital status
		marital_status              VARCHAR(30),         -- married/unmarried/widow/widower/devadasi

		-- Section 6: Photo & signature
		photo_url                   TEXT,
		signature_url               TEXT,

		-- Posting (derived but stored for quick access)
		department_id               BIGINT REFERENCES departments(department_id) ON DELETE SET NULL,
		post_id                     BIGINT REFERENCES posts(post_id) ON DELETE SET NULL,
		joining_date                DATE,

		current_step                INTEGER DEFAULT 1,
		current_section				INTEGER DEFAULT 1,
		created_by                  BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
		created_at                  TIMESTAMP DEFAULT NOW(),
		updated_at                  TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 5: DOCUMENT UPLOADS
	-- ─────────────────────────────────────────

	
	-- training_doc | REMOVED
	CREATE TABLE employee_documents (
		doc_id      BIGSERIAL PRIMARY KEY,
		user_id     BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		doc_type    VARCHAR(80) NOT NULL,
		-- marriage_cert | birth_cert | aadhar | pan | caste_validity | gazette_name_change
		-- appointment_order | probation_cert | permanency_cert | service_book
		-- character_antecedents | constitution_oath | home_village_decl | medical_cert
		-- small_family_pledge | undertaking | group_insurance | disability_cert
		-- computer_exam_cert | marathi_typing_cert | english_typing_cert
		-- marathi_lang_cert | hindi_lang_cert | increment_order | asset_liability
		-- dept_exam_cert | competitive_exam_cert | suspension_order
		-- court_order | service_book_verification | advance_cert | absent_cert
		-- overpayment_cert | nps_family_pension_option | medical_reimbursement_option

		file_url    TEXT NOT NULL,
		uploaded_at TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 7: EDUCATION (one-to-many)
	-- ─────────────────────────────────────────

	CREATE TABLE employee_education (
		edu_id        BIGSERIAL PRIMARY KEY,
		user_id       BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		edu_type      VARCHAR(50),    -- illiterate/pre_primary/primary/secondary/higher_secondary/graduate/postgraduate
		institution   VARCHAR(200),
		qualification VARCHAR(200),
		pass_year     SMALLINT,
		obtained_at   VARCHAR(20),    -- at_joining / after_joining
		cert_url      TEXT,
		created_at    TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 8: FIRST APPOINTMENT
	-- ─────────────────────────────────────────

	CREATE TABLE employee_appointment (
		appointment_id          BIGSERIAL PRIMARY KEY,
		user_id                 BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		appointment_route       VARCHAR(100),  -- direct/promotion/compassionate/10pct_gp/ladpage/competition_exam etc
		social_reservation      VARCHAR(50),   -- SC/ST/OBC/open/EWS/SEBC etc
		parallel_reservation    VARCHAR(80),   -- women/sports/ex-serviceman/orphan/disabled/none etc
		order_number            VARCHAR(100),
		order_date              DATE,
		is_district_transfer    BOOLEAN DEFAULT FALSE,
		posting_location_type   VARCHAR(30),   -- HQ / panchayat_samiti
		panchayat_samiti        VARCHAR(100),
		dept_level              VARCHAR(100),  -- HQ_dept/PS_office/GP_office/PHC/school/anganwadi/vet_clinic/PHC_subcenter
		office_name             VARCHAR(200),
		post_name               VARCHAR(100),
		post_group              CHAR(1),       -- A/B/C/D
		joining_date            DATE,
		pay_commission          SMALLINT,      -- 1 to 7
		pay_scale               VARCHAR(50),
		grade_pay               NUMERIC(10,2),
		basic_pay               NUMERIC(10,2),
		appointment_category    VARCHAR(50),   -- caste category at time of appointment
		medical_done            BOOLEAN DEFAULT FALSE,
		medical_date            DATE,
		assets_submitted        BOOLEAN DEFAULT FALSE,
		assets_submitted_date   DATE,
		appointment_order_cert	TEXT,
		created_at              TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 9: SERVICE STATUS (probation → permanent)
	-- ─────────────────────────────────────────

	CREATE TABLE employee_service_status (
		status_id               BIGSERIAL PRIMARY KEY,
		user_id                 BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		employment_type         VARCHAR(30),   -- permanent / contractual
		status_date             DATE,
		probation_applicable    BOOLEAN DEFAULT FALSE,
		probation_start_date    DATE,
		probation_end_date      DATE,
		probation_completed     BOOLEAN DEFAULT FALSE,
		probation_order_date    DATE,
		probation_order_number  VARCHAR(100),
		has_permanency_cert     BOOLEAN DEFAULT FALSE,
		permanency_cert_date    DATE,
		permanent_from_date     DATE,
		permanent_post_name     VARCHAR(100),
		probation_cert			TEXT,
		permanent_benefit_cert	TEXT,
		created_at              TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 10: ACP BENEFITS (10yr / 20yr / 30yr)
	-- ─────────────────────────────────────────

	CREATE TABLE employee_acp_benefits (
		acp_id          BIGSERIAL PRIMARY KEY,
		user_id         BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		benefit_no      SMALLINT NOT NULL,  -- 1, 2, 3
		years_required  SMALLINT,           -- 10/12, 20/24, 30
		service_completion_date DATE,
		benefit_received        BOOLEAN DEFAULT FALSE,
		benefit_date            DATE,
		due_date                DATE,
		order_date              DATE,
		order_number            VARCHAR(100),
		-- Section 10 also has: Chattopadhyay & Nivadshreeni non-functional pay scale
		chattopadhyay_granted   BOOLEAN DEFAULT FALSE,
		chattopadhyay_order_no  VARCHAR(100),
		chattopadhyay_order_date DATE,
		nivadshreeni_granted    BOOLEAN DEFAULT FALSE,
		nivadshreeni_order_no   VARCHAR(100),
		nivadshreeni_order_date DATE,
		UNIQUE(user_id, benefit_no)
	);

	-- ─────────────────────────────────────────
	-- SECTION 11: PAY COMMISSION (one-to-many)
	-- ─────────────────────────────────────────

	CREATE TABLE employee_pay_commission (
		pay_commission_id   BIGSERIAL PRIMARY KEY,
		user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		pay_commission      SMALLINT NOT NULL,   -- 1 to 7
		band_pay_level      VARCHAR(50),
		grade_pay_matrix    VARCHAR(50),
		pay_in_band         NUMERIC(10,2),
		commission_date     DATE,
		effective_date      DATE,
		current_basic_pay   NUMERIC(10,2),
		created_at          TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 11 (second): INCREMENT DETAILS (one-to-many)
	-- ─────────────────────────────────────────

	CREATE TABLE employee_increments (
		increment_id        BIGSERIAL PRIMARY KEY,
		user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		increment_year      SMALLINT NOT NULL,
		increment_amount    NUMERIC(10,2),
		increment_date      DATE,
		effective_date      DATE,
		is_advance          BOOLEAN DEFAULT FALSE,
		created_at          TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 12: ALLOWANCES (DA, HRA, TA, OTA etc)
	-- ─────────────────────────────────────────

	CREATE TABLE employee_allowances (
		allowance_id    BIGSERIAL PRIMARY KEY,
		user_id         BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		allowance_type  VARCHAR(30) NOT NULL,  -- DA / HRA / TA / OTA
		effective_from  DATE,
		effective_to    DATE,
		amount          NUMERIC(10,2),
		created_at      TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 13: OTHER PAY SCHEMES
	-- ─────────────────────────────────────────

	CREATE TABLE employee_pay_schemes (
		scheme_id       BIGSERIAL PRIMARY KEY,
		user_id         BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		is_applicable   BOOLEAN DEFAULT FALSE,
		scheme_type     VARCHAR(100),
		approved_date   DATE,
		revised_pay     NUMERIC(10,2),
		effective_date  DATE,
		created_at      TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 14: SERVICE BOOK
	-- ─────────────────────────────────────────

	CREATE TABLE employee_service_book (
		service_book_id         BIGSERIAL PRIMARY KEY,
		user_id                 BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		duplicate_received      BOOLEAN DEFAULT FALSE,
		is_updated              BOOLEAN DEFAULT FALSE,
		service_book_cert		TEXT,
		created_at              TIMESTAMP DEFAULT NOW()
		-- file_url stored in employee_documents with doc_type='service_book'
	);

	-- ─────────────────────────────────────────
	-- SECTIONS 14-15: ADDRESSES
	-- ─────────────────────────────────────────

	CREATE TABLE employee_addresses (
		address_id          BIGSERIAL PRIMARY KEY,
		user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		address_type        INT NOT NULL DEFAULT 1,  -- permanent / current
		address_line        TEXT,
		post_office         VARCHAR(100),
		city                VARCHAR(100),
		district            VARCHAR(100),
		taluka              VARCHAR(100),
		pin_code            VARCHAR(10),
		mobile              VARCHAR(15),
		std_code            VARCHAR(10),
		phone_number        VARCHAR(15),
		-- current address extras (Section 15)
		is_govt_residence   BOOLEAN DEFAULT FALSE,
		residing_since      DATE,
		created_at          TIMESTAMP DEFAULT NOW(),
		UNIQUE(user_id, address_type)
	);

	-- ─────────────────────────────────────────
	-- SECTION 16: EMERGENCY CONTACT
	-- ─────────────────────────────────────────

	CREATE TABLE employee_emergency_contacts (
		contact_id          BIGSERIAL PRIMARY KEY,
		user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		contact_name        VARCHAR(150),
		relation            VARCHAR(50),
		mobile              VARCHAR(15) UNIQUE,
		alt_contact_name    VARCHAR(150),
		alt_mobile          VARCHAR(15),
		std_code            VARCHAR(10),
		phone_number        VARCHAR(15),
		home_std_code       VARCHAR(10),
		home_phone_number   VARCHAR(15),
		residing_since      DATE,
		created_at          TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 17: FAMILY MEMBERS (one-to-many)
	-- ─────────────────────────────────────────

	CREATE TABLE employee_family (
		family_id   BIGSERIAL PRIMARY KEY,
		user_id     BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		salutation  VARCHAR(20),
		first_name  VARCHAR(100),
		middle_name VARCHAR(100),
		last_name   VARCHAR(100),
		dob         DATE,
		relation    VARCHAR(50),   -- spouse/son/daughter/father/mother etc
		created_at  TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 18: NOMINATIONS (GPF, GIS, pension etc)
	-- ─────────────────────────────────────────

	CREATE TABLE employee_nominations (
		nomination_id           BIGSERIAL PRIMARY KEY,
		user_id                 BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		nomination_type         VARCHAR(80) NOT NULL,
		-- group_insurance | gpf | pension | death_gratuity | dcps_nps | accident_insurance | family_pension
		nominee_name            VARCHAR(150),
		relation_to_employee    VARCHAR(50),
		nominee_age             SMALLINT,
		share_percentage        NUMERIC(5,2),   -- e.g. 78.00 for 78/100
		contingency_event       TEXT,           -- घटना घडल्यामुळे नामनिर्देशन विधिअग्राह्य
		alternate_nominee_name  VARCHAR(150),
		alternate_nominee_relation VARCHAR(50),
		alternate_nominee_address TEXT,
		created_at              TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 19: TRANSFERS (one-to-many)
	-- ─────────────────────────────────────────

	CREATE TABLE employee_transfers (
		transfer_id             BIGSERIAL PRIMARY KEY,
		user_id                 BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		transfer_type           VARCHAR(50),
		-- spouse_joining | inter_district | seniority | adjustment | administrative | request | deputation
		transfer_category       VARCHAR(50),
		order_date              DATE,
		is_current_posting      BOOLEAN DEFAULT FALSE,
		is_district_transfer    BOOLEAN DEFAULT FALSE,
		posting_location_type   VARCHAR(30),
		panchayat_samiti        VARCHAR(100),
		dept_level              VARCHAR(100),
		office_name             VARCHAR(200),
		post_name               VARCHAR(100),
		is_gazetted             BOOLEAN DEFAULT FALSE,
		joining_date            DATE,
		end_date                DATE,
		created_at              TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 20: PROMOTIONS (one-to-many)
	-- ─────────────────────────────────────────

	CREATE TABLE employee_promotions (
		promotion_id            BIGSERIAL PRIMARY KEY,
		user_id                 BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		promotion_type          VARCHAR(100),
		promotion_category      VARCHAR(50),
		order_date              DATE,
		is_current_posting      BOOLEAN DEFAULT FALSE,
		is_district_transfer    BOOLEAN DEFAULT FALSE,
		posting_location_type   VARCHAR(30),
		panchayat_samiti        VARCHAR(100),
		dept_level              VARCHAR(100),
		office_name             VARCHAR(200),
		post_name               VARCHAR(100),
		is_gazetted             BOOLEAN DEFAULT FALSE,
		joining_date            DATE,
		end_date                DATE,
		created_at              TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 20 (second): SERVICE EXTENSION & INCREMENT HOLD
	-- ─────────────────────────────────────────

	CREATE TABLE employee_service_extensions (
		extension_id        BIGSERIAL PRIMARY KEY,
		user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		extension_granted   BOOLEAN DEFAULT FALSE,
		extension_order_no  VARCHAR(100),
		extension_order_date DATE,
		increment_withheld  BOOLEAN DEFAULT FALSE,
		withheld_from       DATE,
		withheld_to         DATE,
		withheld_order_date DATE,
		withheld_order_no   VARCHAR(100),
		withheld_order_cert	TEXT,
		created_at          TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 21: TRAINING (one-to-many)
	-- ─────────────────────────────────────────

	CREATE TABLE employee_training (
		training_id     BIGSERIAL PRIMARY KEY,
		user_id         BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		course_name     VARCHAR(200),
		institution     VARCHAR(200),
		coordinator     VARCHAR(150),
		start_date      DATE,
		end_date        DATE,
		training_type   VARCHAR(50),  -- refresher / foundational / in_service
		cert_url 	  	TEXT,
		created_at      TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 22: DEPARTMENTAL EXAMS (one-to-many)
	-- ─────────────────────────────────────────

	CREATE TABLE employee_dept_exams (
		dept_exam_id    BIGSERIAL PRIMARY KEY,
		user_id         BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		exam_name       VARCHAR(200) UNIQUE,
		-- service_entry_exam | maharashtra_accounts_clerk | MFS | professional_test
		-- sub_accountant | multipurpose_health_worker | health_attendant | local_self_govt_dept
		status          VARCHAR(20),   -- not_appeared / passed / failed
		pass_date       DATE,
		attempt_number  SMALLINT,
		created_at      TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 23: COMPETITIVE EXAMS (one-to-many)
	-- ─────────────────────────────────────────

	CREATE TABLE employee_competitive_exams (
		comp_exam_id    BIGSERIAL PRIMARY KEY,
		user_id         BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		exam_name       VARCHAR(200),
		status          VARCHAR(20),   -- not_appeared / passed / failed
		pass_date       DATE,
		attempt_number  SMALLINT,
		created_at      TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 24: ASSET & LIABILITY (one-to-many per year)
	-- ─────────────────────────────────────────

	CREATE TABLE employee_asset_liability (
		asset_id        BIGSERIAL PRIMARY KEY,
		user_id         BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		year            SMALLINT NOT NULL,
		submitted       BOOLEAN DEFAULT FALSE,
		submitted_date  DATE,
		created_at      TIMESTAMP DEFAULT NOW(),
		asset_liability_cert	TEXT
	);

	-- ─────────────────────────────────────────
	-- SECTION 25: OTHER EXAMS (computer, typing, language)
	-- ─────────────────────────────────────────

	CREATE TABLE employee_other_exams (
		other_exam_id           BIGSERIAL PRIMARY KEY,
		user_id                 BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

		-- Computer exam
		computer_passed         BOOLEAN DEFAULT FALSE,
		computer_exempted       VARCHAR(10),   -- yes / no / na
		computer_pass_date      DATE,
		computer_exempt_date    DATE,
		computer_institution    VARCHAR(200),
		computer_cert_no        VARCHAR(100),

		-- Marathi typing
		marathi_typing_passed   BOOLEAN DEFAULT FALSE,
		marathi_typing_exempted VARCHAR(10),
		marathi_typing_wpm      SMALLINT,
		marathi_typing_pass_date DATE,
		marathi_typing_exempt_date DATE,
		marathi_typing_institution VARCHAR(200),
		marathi_typing_cert_no  VARCHAR(100),

		-- English typing
		english_typing_passed   BOOLEAN DEFAULT FALSE,
		english_typing_exempted VARCHAR(10),
		english_typing_wpm      SMALLINT,
		english_typing_pass_date DATE,
		english_typing_exempt_date DATE,
		english_typing_institution VARCHAR(200),
		english_typing_cert_no  VARCHAR(100),

		-- Increment withheld for typing failure
		increment_withheld_typing BOOLEAN DEFAULT FALSE,
		recovery_done           BOOLEAN DEFAULT FALSE,

		-- Marathi language exam
		marathi_lang_passed     BOOLEAN DEFAULT FALSE,
		marathi_lang_exempted   VARCHAR(10),
		marathi_lang_pass_date  DATE,
		marathi_lang_exempt_date DATE,

		-- Hindi language exam
		hindi_lang_passed       BOOLEAN DEFAULT FALSE,
		hindi_lang_exempted     VARCHAR(10),
		hindi_lang_pass_date    DATE,
		hindi_lang_exempt_date  DATE,

		created_at              TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 25 (second): DISABILITY INFO
	-- ─────────────────────────────────────────

	CREATE TABLE employee_disability (
		disability_id           BIGSERIAL PRIMARY KEY,
		user_id                 BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		is_disabled             BOOLEAN DEFAULT FALSE,
		examiner_name           VARCHAR(150),
		has_udid                BOOLEAN DEFAULT FALSE,
		udid_number             VARCHAR(50),
		disability_type         VARCHAR(100),
		-- blindness/low_vision/hearing/speech/locomotors/mental_illness/learning/cerebral_palsy
		-- autism/multiple/leprosy/dwarfism/intellectual/muscular/neurological/multiple_sclerosis
		-- thalassemia/hemophilia/sickle_cell/acid_attack/parkinsons
		disability_percentage   SMALLINT,
		exam_date               DATE,
		is_permanent            BOOLEAN DEFAULT FALSE,
		temp_from               DATE,
		temp_to                 DATE,
		transport_allowance     BOOLEAN DEFAULT FALSE,
		profession_tax_exempt   BOOLEAN DEFAULT FALSE,
		equipment_provided      BOOLEAN DEFAULT FALSE,
		equipment_name          VARCHAR(200),
		cert_date               DATE,
		disability_cert			TEXT,
		created_at              TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 26: APPOINTMENT CERTIFICATES
	-- (stored as documents, flag row here for status tracking)
	-- ─────────────────────────────────────────

	CREATE TABLE employee_appointment_certs (
		cert_status_id              BIGSERIAL PRIMARY KEY,
		user_id                     BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		-- all boolean flags for whether each cert has been uploaded
		character_antecedents       TEXT,
		constitution_oath           TEXT,
		home_village_decl           TEXT,
		medical_cert                TEXT,
		small_family_pledge         TEXT,
		undertaking                 TEXT,
		medical_reimbursement_option TEXT,  -- for women after marriage
		nps_family_pension_option   TEXT,
		created_at                  TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 27: GROUP INSURANCE (one-to-many per year)
	-- ─────────────────────────────────────────

	CREATE TABLE employee_group_insurance (
		insurance_id    BIGSERIAL PRIMARY KEY,
		user_id         BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		year            SMALLINT NOT NULL,
		entry_date      DATE,
		amount          NUMERIC(10,2),
		group_insurance_cert	TEXT,
		created_at      TIMESTAMP DEFAULT NOW()
		-- scan in employee_documents with doc_type='group_insurance'
	);

	-- ─────────────────────────────────────────
	-- SECTION 28: UNAUTHORIZED ABSENCE
	-- ─────────────────────────────────────────

	CREATE TABLE employee_unauthorized_absence (
		absence_id      BIGSERIAL PRIMARY KEY,
		user_id         BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		from_date       DATE,
		to_date         DATE,
		action_taken    TEXT,
		absence_cert	TEXT,
		created_at      TIMESTAMP DEFAULT NOW()
		-- cert in employee_documents with doc_type='absent_cert'
	);

	-- ─────────────────────────────────────────
	-- SECTION 29: OVERPAYMENT RECOVERY
	-- ─────────────────────────────────────────

	CREATE TABLE employee_overpayment (
		overpayment_id  BIGSERIAL PRIMARY KEY,
		user_id         BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		recovery_done   BOOLEAN DEFAULT FALSE,
		from_date       DATE,
		to_date         DATE,
		amount          NUMERIC(10,2),
		reason          TEXT,
		cert_number     VARCHAR(100),
		cert_date       DATE,
		created_at      TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 30: DEPARTMENTAL INQUIRY
	-- ─────────────────────────────────────────

	CREATE TABLE employee_dept_inquiry (
		inquiry_id              BIGSERIAL PRIMARY KEY,
		user_id                 BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		inquiry_active          BOOLEAN DEFAULT FALSE,
		inquiry_from            DATE,
		final_decision          TEXT,
		decision_details        TEXT,
		disciplinary_start_date DATE,
		inquiry_officer_date    DATE,
		penalty_order_number    VARCHAR(100),
		penalty_type            VARCHAR(100),
		penalty_order_date      DATE,
		penalty_order_cert		TEXT,
		created_at              TIMESTAMP DEFAULT NOW()
		-- order scan in employee_documents with doc_type='dept_inquiry_order'
	);

	-- ─────────────────────────────────────────
	-- SECTION 31: SUSPENSION
	-- ─────────────────────────────────────────

	CREATE TABLE employee_suspension (
		suspension_id               BIGSERIAL PRIMARY KEY,
		user_id                     BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		was_suspended               BOOLEAN DEFAULT FALSE,
		suspension_date             DATE,
		suspension_duration         VARCHAR(50),  -- years/months/days
		suspension_reason           TEXT,
		criminal_case_filed         BOOLEAN DEFAULT FALSE,
		subsistence_allowance_pct   SMALLINT,
		disciplinary_action_date    DATE,
		inquiry_officer_date        DATE,
		reinstatement_order_date    DATE,
		reinstatement_joining_date  DATE,
		suspension_period_decision  TEXT,
		order_number                VARCHAR(100),
		order_date                  DATE,
		order_cert					TEXT,
		created_at                  TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 32: COURT CASES
	-- ─────────────────────────────────────────

	CREATE TABLE employee_court_cases (
		case_id         BIGSERIAL PRIMARY KEY,
		user_id         BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		case_active     BOOLEAN DEFAULT FALSE,
		court_name      VARCHAR(200),
		order_number    VARCHAR(100),
		order_date      DATE,
		order_cert		TEXT,
		created_at      TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 33: SERVICE BOOK VERIFICATION (one-to-many)
	-- ─────────────────────────────────────────

	CREATE TABLE employee_service_book_verification (
		verification_id     BIGSERIAL PRIMARY KEY,
		user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		verification_type   VARCHAR(100),
		verification_date   DATE,
		verification_cert	TEXT,
		created_at          TIMESTAMP DEFAULT NOW()
		-- scan in employee_documents with doc_type='service_book_verification'
	);

	-- ─────────────────────────────────────────
	-- SECTION 34: MEDICAL / SPECIAL CONDITIONS
	-- ─────────────────────────────────────────

	CREATE TABLE employee_special_conditions (
		condition_id                BIGSERIAL PRIMARY KEY,
		user_id                     BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		has_brain_thalassemia_child BOOLEAN DEFAULT FALSE,
		has_chromosomal_disorder_child BOOLEAN DEFAULT FALSE,
		has_paralysis               BOOLEAN DEFAULT FALSE,
		has_mentally_disabled_child BOOLEAN DEFAULT FALSE,
		has_kidney_dialysis         BOOLEAN DEFAULT FALSE,
		has_cancer                  BOOLEAN DEFAULT FALSE,
		is_veteran_spouse_widow     BOOLEAN DEFAULT FALSE,
		is_abandoned_divorced_woman BOOLEAN DEFAULT FALSE,
		other_conditions            TEXT,
		created_at                  TIMESTAMP DEFAULT NOW()
	);

	-- ─────────────────────────────────────────
	-- SECTION 35: ADVANCES (one-to-many)
	-- ─────────────────────────────────────────

	CREATE TABLE employee_advances (
		advance_id          BIGSERIAL PRIMARY KEY,
		user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		advance_type        VARCHAR(80) NOT NULL,
		-- salary | house_building | vehicle | computer | travel_ltc
		-- marriage | medical | education | calamity | festival_misc
		advance_details     TEXT,
		amount              NUMERIC(12,2),
		fully_repaid        BOOLEAN DEFAULT FALSE,
		repaid_cert_no      VARCHAR(100),
		repaid_cert_date    DATE,
		created_at          TIMESTAMP DEFAULT NOW()
		-- cert/order in employee_documents with doc_type='advance_cert'
	);

	-- ─────────────────────────────────────────
	-- SEED DATA using prerequisites.sql
	-- ─────────────────────────────────────────	

	-- offices 
	CREATE TABLE offices (
    office_id SERIAL PRIMARY KEY,
    zp_id INT NOT NULL, 
    office_code VARCHAR(50) NOT NULL UNIQUE,
    office_name VARCHAR(150) NOT NULL,
    office_name_marathi VARCHAR(150),
    description TEXT,
    description_marathi TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_zp
        FOREIGN KEY (zp_id)
        REFERENCES zp(zp_id)
        ON DELETE CASCADE
);

COMMIT;



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