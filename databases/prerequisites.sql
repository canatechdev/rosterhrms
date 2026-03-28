-- PREREQUISITES

INSERT INTO zp(name,district) values ('pune_zp','Pune');

INSERT INTO departments (zp_id, name) VALUES
(1, 'General Administration'),
(1, 'Finance & Accounts'),
(1, 'EducationPrimary)'),
(1, 'Health'),
(1, 'Public Works (PWD)'),
(1, 'Agriculture'),
(1, 'Women & Child Development'),
(1, 'Tribal Development'),
(1, 'Rural Development'),
(1, 'Panchayat'),
(1, 'Forest'),
(1, 'Disaster Management');

 insert into castes (name,full_name,priority) values
 ('SC','Scheduled Castes',1),
 ('ST','Scheduled Tribes',2),
 ('OBC','Other Backward Classes',3),
 ('VJ','Vimukta Jati',4),
 ('NT','Nomadic Tribes',5),
 ('SBC','Special Backward Classes',6),
 ('EWS','Economically Weaker Sections',7),
 ('General','Open Category (Unreserved)',8);

INSERT INTO roles (name, description) VALUES
('Super Admin', 'Full system control'),
('ZP Admin', 'Manages ZP level operations'),
('Department Head', 'Manages specific department'),
('Clerk', 'Handles data entry and operations'),
('User', 'Basic employee access');


insert into posts(department_id, designation, total_positions) values
(1, 'Chief Executive Officer', 1),
(2, 'Chief Financial Officer', 1),
(3, 'Director of Education', 1),
(4, 'Chief Medical Officer', 1),
(5, 'Chief Engineer', 1),
(6, 'Director of Agriculture', 1),
(7, 'Director of Women & Child Development', 1);