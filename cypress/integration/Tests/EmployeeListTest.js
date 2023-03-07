import LoginPage from "../Pages/LoginPage/login";
import EmployeeList from "../Pages/PIMPage/EmployeeListTab";

const loginPage = new LoginPage();
const employeeList = new EmployeeList();

describe("Employees List Tests", () => {
  before("", () => {
    loginPage.login(Cypress.env("EMAIL"), Cypress.env("PASSWORD"));
    cy.saveLocalStorage();
  });
  it("Verify that Employees Listing displyed correctly.", () => {
    employeeList.visitPIM();
    employeeList.viewEmployeeList();
  });
  it("Verify that Admin can delete employee.", () => {
    employeeList.deleteEmployee();
  });
  it("Verify that Admin can edit employee.", () => {
    employeeList.visitPIM();
    employeeList.editeEmployee();
  });
  it("Verify that Admin can search with name. ", () => {
    employeeList.visitPIM();
    employeeList.searchEmployeeName();
  });
  it("Verify that Admin can search with ID. ", () => {
    employeeList.visitPIM();
    employeeList.searchEmployeeId();
  });
  after("", () => {
    cy.clearCookies();
  });
});
