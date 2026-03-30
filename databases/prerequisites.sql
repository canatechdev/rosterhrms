-- PREREQUISITES
BEGIN;
INSERT INTO districts(name) VALUES ('Pune');
INSERT INTO zp(name,district_id) values ('pune_zp',1);

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

insert into Permissions (name) values
('Add Department Head'), ('Add ZP Admin'), ('Add Employee');

insert into role_permissions(role_id,permission_id) values
(1,2), (2,1), (3,3);




insert into posts(department_id, designation, total_positions) values
(1, 'Chief Executive Officer', 3),
(2, 'Chief Financial Officer', 5),
(3, 'Director of Education', 2),
(4, 'Chief Medical Officer', 1),
(5, 'Chief Engineer', 7),
(6, 'Director of Agriculture', 2),
(7, 'Director of Women & Child Development', 4),
(8, 'Director of Tribal Development', 3),
(9, 'Director of Rural Development', 6),
(10, 'Director of Panchayat', 4),
(11, 'Chief Forest Officer', 2),
(12, 'Director of Disaster Management', 3);
COMMIT;