INSERT INTO department (department_name)
VALUES ('SALES'),
('HUMAN RESOURCES'),
('DEVELOPER'),
('IT/HELPDESK'),
('EXECUTIVE STAFF');

INSERT INTO role (title, salary, department_id)
VALUES ('Account Executive', 80000, 1),
('Sr. Account Executive', 100000, 1),
('Sales Director', 1800000, 1),
('HR Staff', 75000, 2),
('HR Director', 100000, 2),
('Jr Developer', 90000, 3),
('Sr Developer', 150000, 3),
('Development Director', 190000, 3),
('Helpdesk Tecnician', 70000, 4),
('Helpdesk Manager', 100000, 4),
('Helpdesk Director', 180000,4),
('Chief financial Officer', 280000, 5),
('Chief Operational Officer', 280000, 5), 
('Chief Executive Officer', 300000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Jay', 'Dilla', 12, NULL),
('Black', 'Thought', 13, 1),
('Common', 'Sense', 14, 1),
('Aesop', 'Rock', 3, 2),
('Eye', 'Dea', 9, 2),
('Slug', 'O', 11, 2),
('Blue', 'Print', 6, 2),
('Sage', 'Francis', 1, 4),
('Brother', 'Ali', 1, 4);


