-- PREREQUISITES
BEGIN;
    INSERT INTO enum_master(enum_id, name, master_name, sort_index) VALUES
    (1, 'श्री','salutations',1),
    (2, 'कु','salutations',2),
    (3, 'सौ','salutations',3),
    (4, 'श्रीमती','salutations',4),
    (1, 'सरळसेवा','appointment_type',1),
    (2, 'पदोन्नती','appointment_type',2),
    (3, 'अनुकंपा तत्वावर','appointment_type',3),
    (4, '१०% ग्रा.प्र.','appointment_type',4),
    (5, 'लाडपागे शिफारस','appointment_type',5),
    (6, 'जि.प.सेस','appointment_type',6),
    (7, 'जि.प.सेस','appointment_type',7),
    (8, 'कालेलकर आयोग','appointment_type',8),
    (9, 'स्पर्धा परीक्षा','appointment_type',9),
    (1, 'PERSONAL_INFO','employee_sections',1),
    (2, 'EDUCATION','employee_sections',2),
    (3, 'SERVICE_INFO','employee_sections',3),
    (4, 'PAYMENT_INFO','employee_sections',4),
    (5, 'TRANSFER_INFO','employee_sections',5),
    (6, 'PROMOTION_INFO','employee_sections',6),
    (7, 'SERVICE_EXTENSION_INFO','employee_sections',7),
    (8, 'DISABILITY_INFO','employee_sections',8),
    (9, 'GROUP_INSURANCE','employee_sections',9),
    (10, 'DISCUSSION_INFO','employee_sections',10),
    (11, 'ADVANCES_INFO','employee_sections',11),
    (12, 'MEDICAL_CONDITIONS','employee_sections',12),
    (13, 'SERVICE_BOOK_INFO','employee_sections',13),
    (14, 'CERTIFICATE_INFO','employee_sections',14),
    (1, 'विवाहित','marital_status',1),
    (2, 'अविवाहित','marital_status',2),
    (3, 'विधवा','marital_status',3),
    (4, 'विधुर','marital_status',4),
    (5, 'देवदासी','marital_status',5),
    (1, 'शासकीय','service_type',1),
    (2, 'निमशासकीय','service_type',2),
    (1, 'current','address_type',1),
    (2, 'permanent','address_type',2),
    (1, 'गट विमा योजना','nominee_type',1),
    (2, 'भविष्य निर्वाह निधी नामनिर्देशन','nominee_type',2),
    (3, 'निवृत्तीवेतन नामनिर्देशन','nominee_type',3),
    (4, 'मृत्य नि सेवा उपदानाची नामनिर्देशन','nominee_type',4),
    (5, 'DCPS/NPS नामनिर्देशन','nominee_type',5),
    (6, 'अपघात विमा योजना नामनिर्देशन','nominee_type',6),
    (7, 'कुटुंब निवृत्तीवेतन नामनिर्देशन','nominee_type',7),
    (1, 'बीमा निर्वाह','contingency_events',1),
    (2, 'निवृत्तीवेतन','contingency_events',2),
    (3, 'मृत्यू','contingency_events',3),
    (4, 'सेवा उपदान','contingency_events',4),
    (5, 'DCPS/NPS','contingency_events',5),
    (6, 'अपघात','contingency_events',6),
    (7, 'कुटुंब निवृत्तीवेतन','contingency_events',7),
    (1, 'पूर्व प्राथमिक' ,'education_type',1),
    (2, 'उच्च प्राथमिक' ,'education_type',2),
    (3, 'माध्यमिक' ,'education_type',3),
    (4, 'उच्च माध्यमिक' ,'education_type',4),
    (5, 'पदवीधर' ,'education_type',5),
    (6, 'पदव्युत्तर' ,'education_type',6),
    (7,'निरक्षर' ,'education_type',7),
    (1, 'उजळणी', 'training_type',1),
    (2, 'पायाभूत', 'training_type',2),
    (3, 'सेवा अंतर्गत प्रशिक्षण', 'training_type',3),
    (1, 'सरळसेवा नियुक्ती', 'appointment_route',1),
    (2, 'पदोन्नती', 'appointment_route',2),
    (3, 'अनुकंपा तत्वावर', 'appointment_route',3),
    (1, 'महिला', 'parallel_reservation',1),
    (2, 'अत्यंत मागासवर्ग', 'parallel_reservation',2),
    (3, 'दुर्बल गट', 'parallel_reservation',3),
    (1, 'कायमस्वरूपी', 'employment_type',1),
    (2, 'कंत्राटी', 'employment_type',2),
    (1, 'समायोजन', 'transfer_type',1),
    (2, 'प्रशासकीय', 'transfer_type',2),
    (3, 'प्रतिनियुक्ती', 'transfer_type',3),
    (4, 'विनंती बदली', 'transfer_type',4)


    ;
-- विवाहित /अविवाहित /विधवा/विधुर/देवदासी
    INSERT INTO districts(name) VALUES ('Pune');
    INSERT INTO zp(name,district_id) values ('pune_zp',1);

    INSERT INTO roles (name, description) VALUES
    ('super_admin', 'Full system control'),
    ('zp_admin', 'Manages ZP level operations'),
    ('dept_head', 'Manages department specific ops'),
    ('employee', 'Basic employee access');

    INSERT INTO permissions (name) VALUES
    ('add_employee'), ('add_zp_admin'), ('add_department_head'),
    ('view_reports'), ('manage_employees'), ('manage_departments');

    INSERT INTO role_permissions (role_id, permission_id) VALUES
    (1, 2), (1, 4), (1, 6), -- super_admin has all permissions
    (2, 3), (2, 4), (2, 5), -- zp_admin can manage employees and departments
    (3, 1), (3, 4), -- dept_head can add employees and view reports
    (4, 4); -- employee can only view reports

    INSERT INTO genders (name) VALUES
    ('Male'), ('Female'), ('Other');

    INSERT INTO castes (name, full_name, priority) VALUES
    ('SC', 'Scheduled Castes', 1),
    ('ST', 'Scheduled Tribes', 2),
    ('VJ-A', 'Vimukta Jati', 4),
    ('NT-B', 'Nomadic Tribes B', 5),
    ('NT-C', 'Nomadic Tribes C', 5),
    ('NT-D', 'Nomadic Tribes D', 5),
    ('SBC', 'Special Backward Classes', 6),
    ('EWS', 'Economically Weaker Sections', 7),
    ('OBC', 'Other Backward Classes', 3),
    ('Open', 'Open Category (Unreserved)', 8);

    INSERT INTO departments (zp_id, name, code) VALUES
    (1, 'General Administration', 'GA'),
    (1, 'Finance & Accounts', 'FA'),
    (1, 'Education', 'ED'),
    (1, 'Public Works (PWD)', 'PWD'),
    (1, 'Health', 'HL'),
    (1, 'Agriculture', 'AG'),
    (1, 'Women & Child Development', 'WCD'),
    (1, 'Tribal Development', 'TD'),
    (1, 'Rural Development', 'RD'),
    (1, 'Water Supply & Sanitation', 'WSS'),
    (1, 'Forest', 'FR'),
    (1, 'Disaster Management', 'DM');


    INSERT INTO posts (department_id, designation, total_positions) VALUES
    -- Admin
    (1, 'Junior Clerk', 50),
    (1, 'Senior Clerk', 30),
    (1, 'Accountant', 10),
    (1, 'Office Superintendent', 5),

    -- PWD  
    (4, 'Junior Engineer', 20),
    (4, 'Assistant Engineer', 10),
    (4, 'Executive Engineer', 2),

    -- Education
    (3, 'Primary Teacher', 200),
    (3, 'Headmaster', 50),
    (3, 'Education Officer', 5),

    -- Health
    (5, 'Staff Nurse', 40),
    (5, 'Medical Officer', 15),
    (5, 'District Health Officer', 1);

    INSERT INTO cadres (zp_id, department_id, cadre_name, cadre_group) VALUES
    (1, 1, 'General Administration - Junior Clerk', 'A'),
    (1, 1, 'General Administration - Senior Clerk', 'B'),
    (1, 1, 'General Administration - Accountant', 'C'),
    (1, 1, 'General Administration - Office Superintendent', 'D'),
    (1, 4, 'Public Works - Junior Engineer', 'A'),
    (1, 4, 'Public Works - Assistant Engineer', 'B'),
    (1, 4, 'Public Works - Executive Engineer', 'C'),
    (1, 3, 'Education - Primary Teacher', 'A'),
    (1, 3, 'Education - Headmaster', 'B'),
    (1, 3, 'Education - Education Officer', 'C'),
    (1, 5, 'Health - Staff Nurse', 'A'),
    (1, 5, 'Health - Medical Officer', 'B'),
    (1, 5, 'Health - District Health Officer', 'C');

    INSERT INTO cadre_posts(cadre_id, post_id, level_order, total_posts,zp_id) VALUES
    (1, 1, 1, 50,1),
    (2, 2, 2, 30,1),
    (3, 3, 3, 10,1),
    (4, 4, 4, 5,1),
    (5, 5, 1, 20,1),
    (6, 6, 2, 10,1),
    (7, 7, 3, 2,1),
    (8, 8, 1, 200,1),
    (9, 9, 2, 50,1),
    (10, 10, 3, 5,1),
    (11, 11, 1, 40,1),
    (12, 12, 2, 15,1),
    (13, 13, 3, 1,1);

    INSERT INTO users(email, phone, password, role_id, zp_id) 
    VALUES ('super.admin@gmail.com','7498605559','$2b$10$GcVY0w77WH8tCJezUmNgS.jFn8mGfq/oA/f1EzRfL9vVkkxHR6uF.', 1, 1);
COMMIT;