import { faker } from "@faker-js/faker";
var elements = require("./elements");
var messages = require("./Messages");
var ReportName;
var Deleted_Report_Name;
export default class Reports {
  /* this function for adding report */
  addReport() {
    ReportName = faker.random.word();
    cy.get(elements.Report.Reports_Tab).click();
    cy.get(elements.Report.Add).click();
    cy.wait(100).then(() => {
      cy.get(elements.Report.ReportName).type(ReportName);
      cy.get(elements.Report.Field1).click();
      cy.get(elements.EmployeeList.List.replace("ID", 3)).click({
        force: true,
      });
      cy.get(elements.Report.Field2).click();
      cy.get(elements.EmployeeList.List.replace("ID", 3)).click({
        force: true,
      });
      cy.get(elements.Report.Field3).click();
      cy.get(elements.Report.Save_Button).click();
      cy.get(elements.addEmployee.Toast_title).then(($el) => {
        expect(messages.Title).to.equal($el.text());
      });
      cy.get(elements.addEmployee.Toast_body).then(($el) => {
        expect(messages.Message_Saving).to.equal($el.text());
      });
    });
  }
  /*this function for check new reports */
  checkNewReport(Name = ReportName) {
    cy.wait(5000).then(() => {
      cy.get(elements.Report.Report_Name).then(($el) => {
        expect(Name).to.equal($el.text());
      });
    });
    cy.get(elements.Report.Reports_Tab).click();
    cy.wait(50).then(() => {
      this.searchReports(Name);
    });
  }
  /* this function for deletion report */
  deleteReport() {
    cy.get(elements.Report.Reports_Tab).click();
    cy.get(
      elements.EmployeeList.RowColumntable.replace("Row", 1).replace(
        "Column",
        2
      )
    ).then(($el) => {
      Deleted_Report_Name = $el.text();
    });
    cy.get(
      elements.Report.Action_Button.replace("Row", 1).replace("ID", 1)
    ).click({ force: true });
    /*check that data is correctly added from Api side */

    cy.intercept(
      "DELETE",
      `${Cypress.config("baseUrl")}/api/v2/pim/reports/defined`
    ).as("deleteEmployee");
    cy.get(elements.Report.DeleteConfirmation).click({ force: true });
    cy.wait("@deleteEmployee").then((intercept) => {
      expect(intercept.response.statusCode).to.be.equal(200);
      cy.get(elements.addEmployee.Toast_title).then(($el) => {
        expect(messages.Title).to.equal($el.text());
      });
      cy.get(elements.addEmployee.Toast_body).then(($el) => {
        expect(messages.Message_Deleting).to.equal($el.text());
      });
      cy.get(
        elements.EmployeeList.RowColumntable.replace("Row", 1).replace(
          "Column",
          2
        )
      ).then(($el) => {
        expect(Deleted_Report_Name).to.not.equal($el.text());
      });
    });
  }
  /* this function for edit report */

  editReport() {
    let Edited_ReportName = faker.random.word();
    cy.get(elements.Report.Reports_Tab).click();
    cy.get(
      elements.Report.Action_Button.replace("Row", 1).replace("ID", 2)
    ).click({ force: true });
    cy.get(elements.Report.ReportName).clear();
    cy.get(elements.Report.ReportName).type(Edited_ReportName);
    /*check that data is correctly added from Api side */

    cy.intercept(
      "put",
      `${Cypress.config("baseUrl")}/api/v2/pim/reports/defined/**`
    ).as("deleteEmployee");
    cy.get(elements.Report.Save_Button).click();
    cy.wait("@deleteEmployee").then((intercept) => {
      expect(intercept.response.statusCode).to.be.equal(200);
      cy.get(elements.addEmployee.Toast_title).then(($el) => {
        expect(messages.Title).to.equal($el.text());
      });
      cy.get(elements.addEmployee.Toast_body).then(($el) => {
        expect(messages.Message_Updating).to.equal($el.text());
      });
    });
    this.checkNewReport(Edited_ReportName);
  }
  /* this function for searching for report */

  searchReports(Name) {
    cy.get(elements.Report.Search_Field).type(Name);
    cy.wait(1000).then(() => {
      cy.get(elements.Report.Search_list).click({ force: true });
      cy.get(elements.Report.Search_Button).click({ force: true });
      cy.get(
        elements.EmployeeList.RowColumntable.replace("Row", 1).replace(
          "Column",
          2
        )
      ).then(($el) => {
        expect(Name).to.equal($el.text());
      });
    });
  }
  /* this function to check if reports list are displyed correctly comparing to Api */
  viewReports() {
    cy.intercept(
      `${Cypress.config(
        "baseUrl"
      )}/api/v2/pim/reports/defined?limit=50&offset=0&sortField=report.name&sortOrder=ASC`
    ).as("ReportsList");
    cy.get(elements.Report.Reports_Tab).click();
    cy.wait("@ReportsList").then((intercept) => {
      expect(intercept.response.statusCode).to.be.equal(200);
      let ArrayLength = intercept.response.body.data.length;
      for (let counter = 1; counter <= ArrayLength; counter++) {
        cy.get(
          elements.EmployeeList.RowColumntable.replace("Row", counter).replace(
            "Column",
            2
          )
        ).then(($el) => {
          expect(intercept.response.body.data[counter - 1].name).to.equal(
            $el.text()
          );
        });
      }
    });
  }
}
