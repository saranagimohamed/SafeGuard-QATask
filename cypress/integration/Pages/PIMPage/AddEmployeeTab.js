import { faker } from "@faker-js/faker";
import moment from "moment";
import "cypress-file-upload";
var messages = require("./Messages");
var elements = require("./elements");
let lastName;
export default class AddingEmployees {
  /* This function for adding Employee Name  */
  addEmployeeName() {
    let firstName = faker.name.firstName();
    let middleName = faker.name.middleName();
    let lastName = faker.name.lastName();
    let emeployeeID = Math.floor(Math.random() * 899999999 + 100000000);
    cy.xpath(elements.addEmployee.Add_Button).click({ force: true });
    cy.xpath(elements.addEmployee.FirstName_Field).type(firstName);
    cy.xpath(elements.addEmployee.MiddleName_Field).type(middleName);
    cy.xpath(elements.addEmployee.LastName_Field).type(lastName);
    cy.get(elements.addEmployee.Employee_id).clear();
    cy.get(elements.addEmployee.Employee_id).type(emeployeeID);

    /*check that data is correctly added from Api side */
    cy.intercept(
      "POST",
      `${Cypress.config("baseUrl")}/api/v2/pim/employees`
    ).as("Employee");
    cy.xpath(elements.addEmployee.Save_Button).click({ force: true });
    cy.wait("@Employee").then((intercept) => {
      expect(intercept.response.statusCode).to.be.equal(200);
      expect(intercept.response.body.data.firstName).to.be.equal(firstName);
      expect(intercept.response.body.data.lastName).to.be.equal(lastName);
      expect(intercept.response.body.data.middleName).to.be.equal(middleName);
      expect(intercept.response.body.data.employeeId).to.be.equal(
        emeployeeID.toString()
      );
    });
    cy.get(elements.addEmployee.Toast_title).then(($el) => {
      expect(messages.Title).to.equal($el.text());
    });
    cy.get(elements.addEmployee.Toast_body).then(($el) => {
      expect(messages.Message_Saving).to.equal($el.text());
    });
  }
  /* This function for Uploading Files  */

  UploadFile() {
    cy.writeFile(
      "cypress/fixtures/task.txt",
      "Hello Team , cypress automation task"
    );
    cy.get(elements.addEmployee.Add_Attachment).click({ force: true });
    cy.get(elements.addEmployee.Upload_Button).click({ force: true });
    cy.get(elements.addEmployee.UploadFile).selectFile(
      "cypress/fixtures/task.txt",
      { force: true }
    );
    cy.xpath(elements.addEmployee.Save_Button).click({ force: true });
    cy.get(elements.addEmployee.Save_Attachment).click({ force: true });
    cy.get(elements.addEmployee.Toast_title).then(($el) => {
      expect(messages.Title).to.equal($el.text());
    });
    cy.get(elements.addEmployee.Toast_body).then(($el) => {
      expect(messages.Message_Saving).to.equal($el.text());
    });
    cy.get(elements.addEmployee.Attachment_Name).then(($el) => {
      expect("task.txt").to.equal($el.text());
    });
  }
  /*this function for adding personal details */
  addPersonalDetails() {
    cy.wait(1000);
    let Birhdate = moment(
      faker.date.between("1970-01-01", "2000-09-01")
    ).format("YYYY-MM-DD");
    let License = Math.floor(Math.random() * 899999999 + 100000000);
    let ExpiryDate = moment(
      faker.date.between("2023-01-01", "2030-09-01")
    ).format("YYYY-MM-DD");
    cy.xpath(elements.addEmployee.BirhDate_Field).type(Birhdate);
    cy.get(elements.addEmployee.License_Field).type(License);
    cy.xpath(elements.addEmployee.Expiry_Date_Field).type(ExpiryDate);
    /*check that data is correctly added from Api side */

    cy.intercept(
      "put",
      `${Cypress.config("baseUrl")}/api/v2/pim/employees/**/personal-details`
    ).as("AddPersonalDetails");
    cy.get(elements.addEmployee.Save_Personal_Data).click({ force: true });
    cy.wait("@AddPersonalDetails").then((intercept) => {
      expect(intercept.response.statusCode).to.be.equal(200);
      expect(intercept.response.body.data.birthday).to.be.equal(Birhdate);
      expect(intercept.response.body.data.drivingLicenseNo).to.be.equal(
        License.toString()
      );
      expect(
        intercept.response.body.data.drivingLicenseExpiredDate
      ).to.be.equal(ExpiryDate);
      cy.get(elements.addEmployee.Toast_title).then(($el) => {
        expect(messages.Title).to.equal($el.text());
      });
      cy.get(elements.addEmployee.Toast_body).then(($el) => {
        expect(messages.Message_Updating).to.equal($el.text());
      });
    });
  }
  /*this function for adding contact details */

  addContactDetails() {
    let Street = faker.address.street();
    let City = faker.address.city();
    let State = faker.address.state();
    let Telephone = Math.floor(Math.random() * 899999999 + 100000000);
    let Email = faker.internet.email();
    cy.get(elements.addEmployee.Tabs.replace("ID", 2)).click({ force: true });
    cy.get(elements.addEmployee.Street_Field).type(Street);
    cy.get(elements.addEmployee.City_Field).type(City);
    cy.get(elements.addEmployee.State_Field).type(State);
    cy.get(elements.addEmployee.Country_Field).click({ force: true });
    cy.get(elements.EmployeeList.List.replace("ID", 8)).click({ force: true });
    cy.get(elements.addEmployee.Telephone_Field).type(Telephone);
    cy.get(elements.addEmployee.Email_Field).type(Email);
    cy.wait(1000).then(() => {
      /*check that data is correctly added from Api side */

      cy.intercept(
        "put",
        `${Cypress.config("baseUrl")}/api/v2/pim/employee/**/contact-details`
      ).as("ContactDetails");
      cy.get(elements.addEmployee.Save_ContactDetails).click({ force: true });
    });
    cy.wait("@ContactDetails", { timeout: 8000 }).then((intercept) => {
      expect(intercept.response.statusCode).to.be.equal(200);
      expect(intercept.response.body.data.homeTelephone).to.be.equal(
        Telephone.toString()
      );
      expect(intercept.response.body.data.workEmail).to.be.equal(Email);
      expect(intercept.response.body.data.city).to.be.equal(City);
      expect(intercept.response.body.data.province).to.be.equal(State);
      expect(intercept.response.body.data.street1).to.be.equal(Street);
      cy.get(elements.addEmployee.Toast_title).then(($el) => {
        expect(messages.Title).to.equal($el.text());
      });
      cy.get(elements.addEmployee.Toast_body).then(($el) => {
        expect(messages.Message_Updating).to.equal($el.text());
      });
    });
  }
  /*this function for adding emergency contacts */

  addEmergencyContacts() {
    let Contact_Name = faker.name.firstName();
    let Contact_Telephone = Math.floor(Math.random() * 899999999 + 100000000);
    let Relation = faker.random.word();
    cy.get(elements.addEmployee.Tabs.replace("ID", 3)).click({ force: true });
    cy.get(elements.addEmployee.AddButton).click({ force: true });
    cy.get(elements.addEmployee.ContactName).type(Contact_Name);
    cy.get(elements.addEmployee.ContactTelephone).type(Contact_Telephone);
    cy.get(elements.addEmployee.Relation).type(Relation);
    /*check that data is correctly added from Api side */

    cy.intercept(
      "POST",
      `${Cypress.config("baseUrl")}/api/v2/pim/employees/**/emergency-contacts`
    ).as("EmergencyContacts");

    cy.get(elements.addEmployee.Save).click({ force: true });
    cy.get(elements.addEmployee.Toast_title).then(($el) => {
      expect(messages.Title).to.equal($el.text());
    });
    cy.get(elements.addEmployee.Toast_body).then(($el) => {
      expect(messages.Message_Saving).to.equal($el.text());
    });
    cy.wait("@EmergencyContacts", { timeout: 6000 }).then((intercept) => {
      expect(intercept.response.statusCode).to.be.equal(200);
      expect(intercept.response.body.data.name).to.be.equal(Contact_Name);
      expect(intercept.response.body.data.homePhone).to.be.equal(
        Contact_Telephone.toString()
      );
      expect(intercept.response.body.data.relationship).to.be.equal(Relation);
    });
    cy.wait(5000).then(() => {
      this.UploadFile();
    });
  }
  /*this function for adding Dependents */

  addDependents() {
    cy.get(elements.addEmployee.Tabs.replace("ID", 4)).click({ force: true });
    cy.wait(10).then(() => {
      this.UploadFile();
    });
  }
  /*this function for adding Immigration */

  addImmigration() {
    let PassportNumber = Math.floor(Math.random() * 899999999 + 100000000);
    cy.get(elements.addEmployee.Tabs.replace("ID", 5)).click({ force: true });
    cy.get(elements.addEmployee.AddButton).click({ force: true });
    cy.get(elements.addEmployee.Passport_number).type(PassportNumber);
    /*check that data is correctly added from Api side */

    cy.intercept(
      "POST",
      `${Cypress.config("baseUrl")}/api/v2/pim/employees/**/immigrations`
    ).as("Immigration");
    cy.get(elements.addEmployee.Save).click({ force: true });
    cy.get(elements.addEmployee.Toast_title).then(($el) => {
      expect(messages.Title).to.equal($el.text());
    });
    cy.get(elements.addEmployee.Toast_body).then(($el) => {
      expect(messages.Message_Saving).to.equal($el.text());
    });
    cy.wait("@Immigration", { timeout: 6000 }).then((intercept) => {
      expect(intercept.response.statusCode).to.be.equal(200);
      expect(intercept.response.body.data.number).to.be.equal(
        PassportNumber.toString()
      );
    });
    cy.wait(5000).then(() => {
      this.UploadFile();
    });
  }
  /*this function for adding Job */

  addJob() {
    cy.get(elements.addEmployee.Tabs.replace("ID", 6)).click({ force: true });
    cy.get(elements.addEmployee.Job).click({ force: true });
    cy.wait(1000).then(() => {
      cy.get(elements.EmployeeList.List.replace("ID", 3)).click({
        force: true,
      });
      cy.wait(1000).then(() => {
        /*check that data is correctly added from Api side */

        cy.intercept(
          "PUT",
          `${Cypress.config("baseUrl")}/api/v2/pim/employees/**/job-details`
        ).as("Job");
        cy.get(elements.addEmployee.Save_ContactDetails).click();
        cy.get(elements.addEmployee.Save).click({ force: true });
        cy.get(elements.addEmployee.Toast_title).then(($el) => {
          expect(messages.Title).to.equal($el.text());
        });
      });
    });
    cy.get(elements.addEmployee.Toast_body).then(($el) => {
      expect(messages.Message_Updating).to.equal($el.text());
    });
    cy.wait("@Job", { timeout: 6000 }).then((intercept) => {
      expect(intercept.response.statusCode).to.be.equal(200);
    });
  }
  /*this function for adding Salary */

  addSalary() {
    let SalaryComponent = faker.random.word();
    let Salary = faker.datatype.number();
    cy.get(elements.addEmployee.Tabs.replace("ID", 7)).click({ force: true });
    cy.get(elements.addEmployee.AddButton).click({ force: true });
    cy.get(elements.addEmployee.Salary_Component).type(SalaryComponent);
    cy.get(elements.addEmployee.Salary).type(Salary);
    cy.get(elements.addEmployee.Currency).click({ force: true });
    cy.get(elements.EmployeeList.List.replace("ID", 8)).click({ force: true });
    /*check that data is correctly added from Api side */

    cy.intercept(
      "POST",
      `${Cypress.config("baseUrl")}/api/v2/pim/employees/**/salary-components`
    ).as("Salary");
    cy.get(elements.addEmployee.Save).click({ force: true });
    cy.get(elements.addEmployee.Toast_title).then(($el) => {
      expect(messages.Title).to.equal($el.text());
    });
    cy.get(elements.addEmployee.Toast_body).then(($el) => {
      expect(messages.Message_Saving).to.equal($el.text());
    });
    cy.wait("@Salary", { timeout: 6000 }).then((intercept) => {
      expect(intercept.response.statusCode).to.be.equal(200);
      expect(intercept.response.body.data.amount).to.be.equal(
        Salary.toString()
      );
      expect(intercept.response.body.data.salaryName).to.be.equal(
        SalaryComponent
      );
    });
    cy.wait(5000).then(() => {
      this.UploadFile();
    });
  }
  /*this function for adding Tax */

  addTaxExemptions() {
    cy.get(elements.addEmployee.Tabs.replace("ID", 8)).click({ force: true });
    cy.get(elements.addEmployee.Status).click({ force: true });
    cy.get(elements.EmployeeList.List.replace("ID", 3)).click({ force: true });
    /*check that data is correctly added from Api side */

    cy.intercept(
      "PUT",
      `${Cypress.config("baseUrl")}/api/v2/pim/employees/**/tax-exemption`
    ).as("Tax");

    cy.get(elements.addEmployee.Save).click({ force: true });
    cy.wait("@Tax", { timeout: 6000 }).then((intercept) => {
      expect(intercept.response.statusCode).to.be.equal(200);
      expect(intercept.response.body.data.federalStatus).to.be.equal("M");
    });
    cy.get(elements.addEmployee.Toast_title).then(($el) => {
      expect(messages.Title).to.equal($el.text());
    });
    cy.get(elements.addEmployee.Toast_body).then(($el) => {
      expect(messages.Message_Updating).to.equal($el.text());
    });
  }
  addReport_To() {
    cy.get(elements.addEmployee.Tabs.replace("ID", 9)).click({ force: true });
    cy.wait(10).then(() => {
      this.UploadFile();
    });
  }
  /*this function for adding Qualifications */

  addQualifications() {
    let Company = faker.random.word();
    let JobTitle = faker.name.jobTitle();
    cy.get(elements.addEmployee.Tabs.replace("ID", 10)).click({ force: true });
    cy.get(elements.addEmployee.Add_work).click({ force: true });
    cy.get(elements.addEmployee.Company).type(Company);
    cy.get(elements.addEmployee.JobTitle).type(JobTitle);
    /*check that data is correctly added from Api side */

    cy.intercept(
      "POST",
      `${Cypress.config("baseUrl")}/api/v2/pim/employees/**/work-experiences`
    ).as("Work");
    cy.get(elements.addEmployee.Save).click({ force: true });
    cy.get(elements.addEmployee.Toast_title).then(($el) => {
      expect(messages.Title).to.equal($el.text());
    });
    cy.get(elements.addEmployee.Toast_body).then(($el) => {
      expect(messages.Message_Saving).to.equal($el.text());
    });
    cy.wait("@Work", { timeout: 6000 }).then((intercept) => {
      expect(intercept.response.statusCode).to.be.equal(200);
      expect(intercept.response.body.data.company).to.be.equal(Company);
      expect(intercept.response.body.data.jobTitle).to.be.equal(JobTitle);
    });
    cy.wait(5000).then(() => {
      this.UploadFile();
    });
  }
  addMemberships() {
    cy.get(elements.addEmployee.Tabs.replace("ID", 11)).click({ force: true });
    cy.wait(10).then(() => {
      this.UploadFile();
    });
  }
}
