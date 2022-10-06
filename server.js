const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'rootpassword',
    database: 'employeeDB',
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`You are connected as ${connection.threadId} \n`);
    connectionMessage();
    
});

connectionMessage = () => {
    console.log("*************************************")
    console.log("**** EMPLOYEE MANAGEMENT PROGRAM ****")
    console.log("*************************************")
    startApp();
};



startApp = () => {
    inquirer.prompt([
        {
            name: 'initialInquiry',
            type: 'rawlist',
            message: 'Welcome to the employee management program. What would you like to do?',
            choices: ['View departments', 
            'View roles',
            'View employees', 
            'View employees by manager', 
            'Add a department', 
            'Add a role', 
            'Add an employee', 
            'Update employee role', 
            'Update employee manager', 
            'Remove department', 
            'Remove role', 
            'Remove employee', 
            'View salary by department', 
            'Exit']
        }
    ]).then((response) => {
        switch (response.initialInquiry) {
            case 'View departments':
                viewDepartments();    
                break;
            case 'View roles':
                viewRoles();
                break;
            case 'View employees':
                viewEmployees();
                break;
            case 'View employees by manager':
                viewEmployeesByManager();
            break;
            case 'Add a department':
                addDepartment();
            break;
            case 'Add a role':
                addRole();
            break;
            case 'Add an employee':
                addEmployee();
            break;
            case 'Update employee role':
                updateEmployeeRole();
            break;
            case 'Update employee manager':
                updateEmployeesManager();
            break;
            case 'Remove department':
                removeDepartment();
            break;
            case 'Remove role':
                removeRole();
            break;
            case 'Remove employee':
                removeEmployee();
            break;
            case 'View salary by department':
                viewDepartmentSalary();
            break;
            case 'Exit':
                connection.end();
                console.log('\n Thank you for using your Employee Tracker application.  HAVE A GREAT DAY! \n');
                return;
            default:
                break;
        }
    })
}

viewDepartments = () => {
    connection.query(`SELECT * FROM department ORDER BY department_id ASC;`, (err, res) => {
        if (err) throw err;
        console.table('\n', res, '\n');
        startApp();
    })
};

viewRoles = () => {
    connection.query(`SELECT role.role_id, role.title, role.salary, department.department_name, department.department_id FROM role JOIN department ON role.department_id = department.department_id ORDER BY role.role_id ASC;`, (err, res) => {
        if (err) throw err;
        console.table('\n', res, '\n');
        startApp();
    })
};

viewEmployees = () => {
    connection.query(`SELECT e.employee_id, e.first_name, e.last_name, role.title, department.department_name, role.salary, CONCAT(m.first_name, ' ', m.last_name) manager FROM employee m RIGHT JOIN employee e ON e.manager_id = m.employee_id JOIN role ON e.role_id = role.role_id JOIN department ON department.department_id = role.department_id ORDER BY e.employee_id ASC;`, (err, res) => {
        if (err) throw err;
        console.table('\n', res, '\n');
        startApp();
    })
};

viewEmployeesByManager = () => {
    connection.query(`SELECT employee_id, first_name, last_name FROM employee ORDER BY employee_id ASC;`, (err, res) => {
        if (err) throw err;
        let managers = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id }));
        inquirer.prompt([
            {
            name: 'manager',
            type: 'rawlist',
            message: 'Which manager would you like to see the employee\'s of?',
            choices: managers   
            },
        ]).then((response) => {
            connection.query(`SELECT e.employee_id, e.first_name, e.last_name, role.title, department.department_name, role.salary, CONCAT(m.first_name, ' ', m.last_name) manager FROM employee m RIGHT JOIN employee e ON e.manager_id = m.employee_id JOIN role ON e.role_id = role.role_id JOIN department ON department.department_id = role.department_id WHERE e.manager_id = ${response.manager} ORDER BY e.employee_id ASC`, 
            (err, res) => {
                if (err) throw err;
                console.table('\n', res, '\n');
                startApp();
            })
        })
    })
}

addDepartment = () => {
    inquirer.prompt([
        {
        name: 'newDept',
        type: 'input',
        message: 'What is the name of the department?'   
        }
    ]).then((response) => {
        connection.query(`INSERT INTO department SET ?`, 
        {
            department_name: response.newDept,
        },
        (err, res) => {
            if (err) throw err;
            console.log(`\n ${response.newDept} successfully added to database! \n`);
            startApp();
        })
    })
};

addRole = () => {
    connection.query(`SELECT * FROM department;`, (err, res) => {
        if (err) throw err;
        let departments = res.map(department => ({name: department.department_name, value: department.department_id }));
        inquirer.prompt([
            {
            name: 'title',
            type: 'input',
            message: 'What is the new role name?'   
            },
            {
            name: 'salary',
            type: 'input',
            message: 'Please add a salary for the new role.'   
            },
            {
            name: 'deptName',
            type: 'rawlist',
            message: 'Which department will the new role be added to?',
            choices: departments
            },
        ]).then((response) => {
            connection.query(`INSERT INTO role SET ?`, 
            {
                title: response.title,
                salary: response.salary,
                department_id: response.deptName,
            },
            (err, res) => {
                if (err) throw err;
                console.log(`\n ${response.title} successfully added to database! \n`);
                startApp();
            })
        })
    })
};

addEmployee = () => {
    connection.query(`SELECT * FROM role;`, (err, res) => {
        if (err) throw err;
        let roles = res.map(role => ({name: role.title, value: role.role_id }));
        connection.query(`SELECT * FROM employee;`, (err, res) => {
            if (err) throw err;
            let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id}));
            inquirer.prompt([
                {
                    name: 'firstName',
                    type: 'input',
                    message: 'Please enter the first name.'
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: 'Please enter the last name.'
                },
                {
                    name: 'role',
                    type: 'rawlist',
                    message: 'Please enter a title.',
                    choices: roles
                },
                {
                    name: 'manager',
                    type: 'rawlist',
                    message: 'Who is their manager?',
                    choices: employees
                }
            ]).then((response) => {
                connection.query(`INSERT INTO employee SET ?`, 
                {
                    first_name: response.firstName,
                    last_name: response.lastName,
                    role_id: response.role,
                    manager_id: response.manager,
                }, 
                (err, res) => {
                    if (err) throw err;
                })
                connection.query(`INSERT INTO role SET ?`, 
                {
                    department_id: response.dept,
                }, 
                (err, res) => {
                    if (err) throw err;
                    console.log(`\n ${response.firstName} ${response.lastName} successfully added to database! \n`);
                    startApp();
                })
            })
        })
    })
};

updateEmployeeRole = () => {
    connection.query(`SELECT * FROM role;`, (err, res) => {
        if (err) throw err;
        let roles = res.map(role => ({name: role.title, value: role.role_id }));
        connection.query(`SELECT * FROM employee;`, (err, res) => {
            if (err) throw err;
            let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id }));
            inquirer.prompt([
                {
                    name: 'employee',
                    type: 'rawlist',
                    message: 'Which employee would you like to update?',
                    choices: employees
                },
                {
                    name: 'newRole',
                    type: 'rawlist',
                    message: 'What is their new role?',
                    choices: roles
                },
            ]).then((response) => {
                connection.query(`UPDATE employee SET ? WHERE ?`, 
                [
                    {
                        role_id: response.newRole,
                    },
                    {
                        employee_id: response.employee,
                    },
                ], 
                (err, res) => {
                    if (err) throw err;
                    console.log(`\n Successfully updated employee's role in the database! \n`);
                    startApp();
                })
            })
        })
    })
}

updateEmployeesManager = () => {
    connection.query(`SELECT * FROM employee;`, (err, res) => {
        if (err) throw err;
        let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id }));
        inquirer.prompt([
            {
                name: 'employee',
                type: 'rawlist',
                message: 'Which employee are you updating?',
                choices: employees
            },
            {
                name: 'newManager',
                type: 'rawlist',
                message: 'Who is their new manager?',
                choices: employees
            },
        ]).then((response) => {
            connection.query(`UPDATE employee SET ? WHERE ?`, 
            [
                {
                    manager_id: response.newManager,
                },
                {
                    employee_id: response.employee,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n Successfully updated in the database! \n`);
                startApp();
            })
        })
    })
};

removeDepartment = () => {
    connection.query(`SELECT * FROM department ORDER BY department_id ASC;`, (err, res) => {
        if (err) throw err;
        let departments = res.map(department => ({name: department.department_name, value: department.department_id }));
        inquirer.prompt([
            {
            name: 'deptName',
            type: 'rawlist',
            message: 'Select a department to remove.',
            choices: departments
            },
        ]).then((response) => {
            connection.query(`DELETE FROM department WHERE ?`, 
            [
                {
                    department_id: response.deptName,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n Successfully removed the department from the database! \n`);
                startApp();
            })
        })
    })
}

removeRole = () => {
    connection.query(`SELECT * FROM role ORDER BY role_id ASC;`, (err, res) => {
        if (err) throw err;
        let roles = res.map(role => ({name: role.title, value: role.role_id }));
        inquirer.prompt([
            {
            name: 'title',
            type: 'rawlist',
            message: 'Select a role to remove.',
            choices: roles
            },
        ]).then((response) => {
            connection.query(`DELETE FROM role WHERE ?`, 
            [
                {
                    role_id: response.title,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n Successfully removed the role from the database! \n`);
                startApp();
            })
        })
    })
}

removeEmployee = () => {
    connection.query(`SELECT * FROM employee ORDER BY employee_id ASC;`, (err, res) => {
        if (err) throw err;
        let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id }));
        inquirer.prompt([
            {
                name: 'employee',
                type: 'rawlist',
                message: 'Which employee are you removing?',
                choices: employees
            },
        ]).then((response) => {
            connection.query(`DELETE FROM employee WHERE ?`, 
            [
                {
                    employee_id: response.employee,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n Successfully removed the employee from the database! \n`);
                startApp();
            })
        })
    })
}

viewDepartmentSalary = () => {
    connection.query(`SELECT * FROM department ORDER BY department_id ASC;`, (err, res) => {
        if (err) throw err;
        let departments = res.map(department => ({name: department.department_name, value: department.department_id }));
        inquirer.prompt([
            {
            name: 'deptName',
            type: 'rawlist',
            message: 'Which department salaries would you like to view?',
            choices: departments
            },
        ]).then((response) => {
            connection.query(`SELECT department_id, SUM(role.salary) AS total_salary FROM role WHERE ?`, 
            [
                {
                    department_id: response.deptName,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n The total salary used of ${response.deptName} department is $ \n`);
                console.table('\n', res, '\n');
                startApp();
            })
        })
    })
}

