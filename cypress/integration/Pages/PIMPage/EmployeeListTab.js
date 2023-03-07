import { faker } from "@faker-js/faker";
var elements = require("./elements");
var messages = require("./Messages");
var Deleted_Employee_ID;
export default class EmployeeList {
  visitPIM() {
    cy.visit(`/pim/viewEmployeeList`);
    cy.intercept(
      `${Cypress.config(
        "baseUrl"
      )}/api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC`
    ).as("EmployeesListing");
  }
  /*This Function for comparing data From API with data displyed in Frontend side */
  viewEmployeeList() {
    cy.wait("@EmployeesListing").then((intercept) => {
      expect(intercept.response.statusCode).to.be.equal(200);
      let ArrayLength = intercept.response.body.data.length;
      for (let counter = 1; counter <= ArrayLength; counter++) {
        /* Verify that ID is dispalyed Correctly and comparing it with result from endpoint */

        cy.get(
          elements.EmployeeList.RowColumntable.replace("Row", counter).replace(
            "Column",
            2
          )
        ).then(($el) => {
          if (intercept.response.body.data[counter - 1].employeeId == null) {
            expect("").to.equal($el.text());
          } else {
            expect(
              intercept.response.body.data[counter - 1].employeeId
            ).to.equal($el.text());
          }
        });

        /* Verify that First name and Middle name Correctly are dispalyed and comparing it with result from endpoint */
        cy.get(
          elements.EmployeeList.RowColumntable.replace("Row", counter).replace(
            "Column",
            3
          )
        ).then(($el) => {
          expect(
            intercept.response.body.data[counter - 1].firstName.concat(
              " ",
              intercept.response.body.data[counter - 1].middleName
            )
          ).to.equal($el.text());
        });
        /* Verify that Last name Correctly are dispalyed and comparing it with result from endpoint */

        cy.get(
          elements.EmployeeList.RowColumntable.replace("Row", counter).replace(
            "Column",
            4
          )
        ).then(($el) => {
          expect(intercept.response.body.data[counter - 1].lastName).to.equal(
            $el.text()
          );
        });
        /* Verify that Job Title Correctly is dispalyed and comparing it with result from endpoint */

        cy.get(
          elements.EmployeeList.RowColumntable.replace("Row", counter).replace(
            "Column",
            5
          )
        ).then(($el) => {
          if (
            intercept.response.body.data[counter - 1].jobTitle.title == null
          ) {
            expect("").to.equal($el.text());
          } else {
            expect(
              intercept.response.body.data[counter - 1].jobTitle.title
            ).to.equal($el.text());
          }
        });
        /* Verify that Employee Status Correctly is dispalyed and comparing it with result from endpoint */

        cy.get(
          elements.EmployeeList.RowColumntable.replace("Row", counter).replace(
            "Column",
            6
          )
        ).then(($el) => {
          if (
            intercept.response.body.data[counter - 1].empStatus.name == null
          ) {
            expect("").to.equal($el.text());
          } else {
            expect(
              intercept.response.body.data[counter - 1].empStatus.name
            ).to.equal($el.text());
          }
        });
        /* Verify that Job Sub Unit is dispalyed and comparing it with result from endpoint */

        cy.get(
          elements.EmployeeList.RowColumntable.replace("Row", counter).replace(
            "Column",
            7
          )
        ).then(($el) => {
          if (intercept.response.body.data[counter - 1].subunit.name == null) {
            expect("").to.equal($el.text());
          } else {
            expect(
              intercept.response.body.data[counter - 1].subunit.name
            ).to.equal($el.text());
          }
        });
        /* Verify that Supervisors Correctly is dispalyed and comparing it with result from endpoint */

        cy.get(
          elements.EmployeeList.RowColumntable.replace("Row", counter).replace(
            "Column",
            8
          )
        ).then(($el) => {
          if (
            intercept.response.body.data[counter - 1].supervisors[0] == null
          ) {
            expect("").to.equal($el.text());
          } else {
            expect(
              intercept.response.body.data[
                counter - 1
              ].supervisors[0].firstName.concat(
                " ",
                intercept.response.body.data[counter - 1].supervisors[0]
                  .lastName
              )
            ).to.equal($el.text());
          }
        });
      }
    });
  }
  /* Verify that Admin can delete employee */

  deleteEmployee() {
    cy.get(
      elements.EmployeeList.RowColumntable.replace("Row", 2).replace(
        "Column",
        2
      )
    ).then(($el) => {
      Deleted_Employee_ID = $el.text();
    });
    cy.get(
      elements.EmployeeList.Actions_Button.replace("Row", 2).replace("ID", 1)
    ).click({ force: true });
    /* Verify that deletion is done from Api side */

    cy.intercept(
      "DELETE",
      `${Cypress.config("baseUrl")}/api/v2/pim/employees`
    ).as("deleteEmployee");

    cy.xpath(elements.EmployeeList.Delete_Confirmation).click({ force: true });
    cy.wait("@deleteEmployee").then((intercept) => {
      expect(intercept.response.statusCode).to.be.equal(200);
      cy.get(elements.addEmployee.Toast_title).then(($el) => {
        expect(messages.Title).to.equal($el.text());
      });
      cy.get(elements.addEmployee.Toast_body).then(($el) => {
        expect(messages.Message_Deleting).to.equal($el.text());
      });
      /* Verify that deletion is done from Frontend side */

      cy.get(
        elements.EmployeeList.RowColumntable.replace("Row", 1).replace(
          "Column",
          2
        )
      ).then(($el) => {
        expect(Deleted_Employee_ID).to.not.equal($el.text());
      });
    });
  }
  /* Verify that Admin can edit employee */

  editeEmployee() {
    let lastName = faker.name.lastName();
    cy.get(
      elements.EmployeeList.Actions_Button.replace("Row", 1).replace("ID", 2)
    ).click({ force: true });
    /* Verify that edit is done from Api side */

    cy.intercept(
      "put",
      `${Cypress.config("baseUrl")}/api/v2/pim/employees/**/personal-details`
    ).as("editEmployee");
    cy.xpath(elements.addEmployee.LastName_Field).clear();
    cy.xpath(elements.addEmployee.LastName_Field).type(lastName);
    cy.get(elements.EmployeeList.Edit_Save_Button).click({ force: true });

    cy.wait("@editEmployee").then((intercept) => {
      expect(intercept.response.statusCode).to.be.equal(200);
      cy.get(elements.EmployeeList.PIM_Icon).click({ force: true });
      /* Verify that deletion is done from Frontend side */

      cy.get(
        elements.EmployeeList.RowColumntable.replace("Row", 1).replace(
          "Column",
          4
        )
      ).then(($el) => {
        expect(lastName).to.equal($el.text());
      });
    });
  }
  /*This function is for serach with ID */
  searchEmployeeId() {
    let SearchInput;
    cy.get(
      elements.EmployeeList.RowColumntable.replace("Row", 2).replace(
        "Column",
        2
      )
    ).then(($el) => {
      SearchInput = $el.text();
    });
    cy.wait(10).then(() => {
      cy.get(elements.EmployeeList.Employee_id).type(SearchInput);
      cy.xpath(elements.EmployeeList.Search_button).click({ force: true });
      /*check that search input is correctly displayed */
      cy.get(
        elements.EmployeeList.RowColumntable.replace("Row", 1).replace(
          "Column",
          2
        )
      ).then(($el) => {
        expect(SearchInput).to.equal($el.text());
      });
    });
  }
  /*This function is for serach with name */

  searchEmployeeName() {
    let SearchInput;
    cy.get(
      elements.EmployeeList.RowColumntable.replace("Row", 2).replace(
        "Column",
        3
      )
    ).then(($el) => {
      SearchInput = $el.text();
    });
    cy.wait(10).then(() => {
      cy.get(elements.EmployeeList.Employee_Name).type(SearchInput);
      cy.xpath(elements.EmployeeList.Search_button).click({ force: true });
      /*check that search input is correctly displayed */
      cy.get(
        elements.EmployeeList.RowColumntable.replace("Row", 1).replace(
          "Column",
          3
        )
      ).then(($el) => {
        expect(SearchInput).to.equal($el.text());
      });
    });
  }
}
