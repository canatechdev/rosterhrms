-- PREREQUISITES
BEGIN;
    INSERT INTO enum_master(name, master_name, sort_index) VALUES
    ('श्री','salutations'),
    ('कु','salutations'),
    ('सौ','salutations'),
    ('श्रीमती','salutations'),
    ('सरळसेवा','appointment_type'),
    ('पदोन्नती','appointment_type'),
    ('अनुकंपा तत्वावर','appointment_type'),
    ('१०% ग्रा.प्र.','appointment_type'),
    ('लाडपागे शिफारस','appointment_type'),
    ('जि.प.सेस','appointment_type'),
    ('राज्य शासन शिफारस','appointment_type'),
    ('कालेलकर आयोग','appointment_type'),
    ('स्पर्धा परीक्षा','appointment_type'),

    ('PERSONAL_INFO','employee_sections'),
    ('EDUCATION','employee_sections'),
    ('SERVICE_INFO','employee_sections'),
    ('PAYMENT_INFO','employee_sections'),
    ('TRANSFER_INFO','employee_sections'),
    ('DISCUSSION_INFO','employee_sections'),
    ('SERVICE_BOOK_INFO','employee_sections'),
    ('MEDICAL_CONDITIONS','employee_sections'),
    ('PROMOTION_INFO','employee_sections'),
    ('SERVICE_EXTENSION_INFO','employee_sections'),
    ('DISABILITY_INFO','employee_sections'),
    ('GROUP_INSURANCE','employee_sections'),
    ('ADVANCES_INFO','employee_sections'),
    ('CERTIFICATE_INFO','employee_sections'),
    
    ('विवाहित','marital_status'),
    ('अविवाहित','marital_status'),
    ('विधवा','marital_status'),
    ('विधुर','marital_status'),
    ('देवदासी','marital_status'),
    ('शासकीय','service_type'),
    ('निमशासकीय','service_type'),
    ('current','address_type'),
    ('permanent','address_type'),
    ('गट विमा योजना','nominee_type'),
    ('भविष्य निर्वाह निधी नामनिर्देशन','nominee_type'),
    ('निवृत्तीवेतन नामनिर्देशन','nominee_type'),
    ('मृत्य नि सेवा उपदानाची नामनिर्देशन','nominee_type'),
    ('DCPS/NPS नामनिर्देशन','nominee_type'),
    ('अपघात विमा योजना नामनिर्देशन','nominee_type'),
    ('कुटुंब निवृत्तीवेतन नामनिर्देशन','nominee_type'),
    ('बीमा निर्वाह','contingency_events'),
    ('निवृत्तीवेतन','contingency_events'),
    ('मृत्यू','contingency_events'),
    ('सेवा उपदान','contingency_events'),
    ('DCPS/NPS','contingency_events'),
    ('अपघात','contingency_events'),
    ('कुटुंब निवृत्तीवेतन','contingency_events'),
    ('पूर्व प्राथमिक' ,'education_type'),
    ('उच्च प्राथमिक' ,'education_type'),
    ('माध्यमिक' ,'education_type'),
    ('उच्च माध्यमिक' ,'education_type'),
    ('पदवीधर' ,'education_type'),
    ('पदव्युत्तर' ,'education_type'),
    ('निरक्षर' ,'education_type'),
    ('उजळणी', 'training_type'),
    ('पायाभूत', 'training_type'),
    ('सेवा अंतर्गत प्रशिक्षण', 'training_type'),
    ('सरळसेवा नियुक्ती', 'appointment_route'),
    ('पदोन्नती', 'appointment_route'),
    ('अनुकंपा तत्वावर', 'appointment_route'),
    ('महिला', 'parallel_reservation'),
    ('अत्यंत मागासवर्ग', 'parallel_reservation'),
    ('दुर्बल गट', 'parallel_reservation'),
    ('कायमस्वरूपी', 'employment_type'),
    ('कंत्राटी', 'employment_type'),
    ('समायोजन', 'transfer_type'),
    ('प्रशासकीय', 'transfer_type'),
    ('प्रतिनियुक्ती', 'transfer_type'),
    ('विनंती बदली', 'transfer_type')


    ;
-- विवाहित /अविवाहित /विधवा/विधुर/देवदासी
    INSERT INTO districts(name) VALUES ('Pune');
    INSERT INTO zp(name,district_id) values ('pune_zp',1);

    INSERT INTO roles (name, description) VALUES
    ('super_admin', 'Full system control'),
    ('zp_admin', 'Manages ZP level operations'),
    ('dept_head', 'Manages department specific ops'),
    ('employee', 'Basic employee access'),
    ('reporting_officer', 'Reporting officer (Appraisals)'),
    ('reviewing_officer', ' Reviewing officer (Appraisals)'),
    ('establishment_officer', 'Officer responsible for verifying employee details during appraisal initiation');


    INSERT INTO permissions (name) VALUES
    ('add_employee'),('add_zp_admin'),('add_department_head'),('view_reports'),
    ('manage_employees'),('manage_departments'),('process_appraisals'),('reset_password');

    INSERT INTO role_permissions (role_id, permission_id) VALUES
    (1, 2), (1, 4), (1, 6), -- super_admin has all permissions
    (2, 3), (2, 4), (2, 5), -- zp_admin can manage employees and departments
    (3, 1), (3, 4),(3,7), -- dept_head can add employees and view reports
    (4, 4); -- employee can only view reports

    INSERT INTO genders (name) VALUES
    ('Male'), ('Female'), ('Other');

    INSERT INTO castes (name, name_mr, code, priority) VALUES
    ('SC', 'Scheduled Castes','SC1', 1),
    ('ST', 'Scheduled Tribes','ST2', 2),
    ('VJ-A', 'Vimukta Jati','VJ4', 4),
    ('NT-B', 'Nomadic Tribes B','NT5', 5),
    ('NT-C', 'Nomadic Tribes C','NT5', 5),
    ('NT-D', 'Nomadic Tribes D','NT5', 5),
    ('SBC', 'Special Backward Classes','SBC6', 6),
    ('EWS', 'Economically Weaker Sections','EWS7', 7),
    ('OBC', 'Other Backward Classes','OBC3', 3),
    ('Open', 'Open Category (Unreserved)','Open8', 8);

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
    VALUES ('super.admin@gmail.com','7498605559','$2b$10$GcVY0w77WH8tCJezUmNgS.jFn8mGfq/oA/f1EzRfL9vVkkxHR6uF.', 1, null);
    
    INSERT INTO user_roles (user_id, role_id) VALUES
    (1, 1);
COMMIT;