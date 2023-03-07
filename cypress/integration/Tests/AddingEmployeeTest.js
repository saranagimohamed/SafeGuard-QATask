import LoginPage from "../Pages/LoginPage/login";
import EmployeeList from "../Pages/PIMPage/EmployeeListTab";
import AddingEmployees from "../Pages/PIMPage/AddEmployeeTab";

const loginPage = new LoginPage();
const employeeList = new EmployeeList();
const addingEmployees = new AddingEmployees();
describe("Adding New Employees Tests", () => {
  before("", () => {
    loginPage.login(Cypress.env("EMAIL"), Cypress.env("PASSWORD"));
  });
  it("Verify that Admin can create employee and add all data. ", () => {
    employeeList.visitPIM();
    addingEmployees.addEmployeeName();
    addingEmployees.addPersonalDetails();
    addingEmployees.addContactDetails();
    addingEmployees.addEmergencyContacts();
    addingEmployees.addDependents();
    addingEmployees.addImmigration();
    addingEmployees.addJob();
    addingEmployees.addSalary();
    addingEmployees.addTaxExemptions();
    addingEmployees.addReport_To();
    addingEmployees.addQualifications();
    addingEmployees.addMemberships();
  });
  after("", () => {
    cy.clearCookies();
  });
});
