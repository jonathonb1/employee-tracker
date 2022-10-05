const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
require ('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'rootpassword',
    database:  'employeeDB',
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`You are connected as ${connection.threadId} \n`);
    startApp();
});

startApp = () => {
    inquirer.prompt([
        {
            name: 'initialInquiry',
            type: 'rawlist',
            message: 'Welcome to your Employee Managmeent Applicaiton!  How can I help you?',
            choices: ['View departments', 'View roles', 'View employees', 'View employees by manager', 'Add a department', 'Add a role', 'Add employee', 'Update employee role', 'Update employee manager', 'Remove department', 'Remove employee', 'Remove role', 'View salary by department', 'Exit']
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
                addADepartment();
            break;
            case 'Add a role':
                addARole();
            break;
            case 'Add employee':
                addEmployee();
            break;
            case 'Update employee role':
                updateEmployeeRole();
            break;
            case 'Update employee manager':
                updateEmployeeManager();
            break;
            case 'Remove department':
                removeDepartment();
            break;
            case 'Remove employee':
                removeEmployee();
            break;
            case 'Remove role':
                removeRole();
            break;
            case 'View salary by department':
                viewSalaryByDepartment();
            break;
            case 'Exit':
                connection.end();
                console.log('\n You have exited your Employee Management Application. Thanks for using! \n');
                return;
            default:
                break;
        }
}