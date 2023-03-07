import LoginPage from "../Pages/LoginPage/login";
import EmployeeList from "../Pages/PIMPage/EmployeeListTab";
import Reports from "../Pages/PIMPage/ReportsTab";

const loginPage = new LoginPage();
const employeeList = new EmployeeList();
const reports = new Reports();

describe("Reports Tab Tests", () => {
  before("", () => {
    loginPage.login(Cypress.env("EMAIL"), Cypress.env("PASSWORD"));
  });
  it("Verify That Admin can generate report. ", () => {
    employeeList.visitPIM();
    reports.addReport();
  });
  it("Verify that the generated report in previous test are named corectly and added to reports list using search.", () => {
    reports.checkNewReport();
  });
  it("Verify that Admin can delete report. ", () => {
    reports.deleteReport();
  });
  it("Verify that Admin can edit report.", () => {
    reports.editReport();
  });
  it("Verify that Admin can View all reports.", () => {
    reports.viewReports();
  });
  after("", () => {
    cy.clearCookies();
  });
});
