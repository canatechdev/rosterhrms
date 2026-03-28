CREATE TABLE zp (
    zp_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    district VARCHAR(100),
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    zp_id INT,
    name VARCHAR(150),
    status INT DEFAULT 1
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

cadre_id | zp_id | department_id | cadre_name
--------------------------------------------
1        | 1     | 3             | Teaching
2        | 1     | 4             | Medical

CREATE TABLE cadre_posts (
    cadre_post_id SERIAL PRIMARY KEY,
    cadre_id INT NOT NULL,
    post_name VARCHAR(100),
    level_order INT,
    total_posts INT
);


cadre_post_id | cadre_id | post_name        | level_order | total_posts
----------------------------------------------------------------------
1             | 1        | Teacher          | 1           | 50
2             | 1        | Senior Teacher   | 2           | 20
3             | 1        | Head Master      | 3           | 5


CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    password TEXT,
    caste_id INT,
    role_id INT,
    zp_id INT,
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);

user_id | name    | caste_id | role_id | zp_id
----------------------------------------------
1       | Amit    | 8 (GEN)  | 5       | 1
2       | Suresh  | 3 (OBC)  | 5       | 1
3       | Ramesh  | 1 (SC)   | 5       | 1


CREATE TABLE employee_cadre (
    employee_cadre_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    cadre_id INT NOT NULL,
    cadre_post_id INT NOT NULL,
    joining_date DATE,
    seniority_rank INT
);

employee_cadre_id | user_id | cadre_id | cadre_post_id | joining_date | seniority_rank
--------------------------------------------------------------------------------------
1                 | 1       | 1        | 1             | 2015-01-01   | 1
2                 | 2       | 1        | 1             | 2017-01-01   | 2
3                 | 3       | 1        | 1             | 2018-01-01   | 3
