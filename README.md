<div id="badges">
  <a href="https://www.linkedin.com/in/sara-nagy-elzahry/">
    <img src="https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge"/>
  </a>
</div>
<div id="header" align="center">
  <img src="https://media.giphy.com/media/M9gbBd9nbDrOTu1Mqx/giphy.gif" width="100"/>
</div>

# Overview
I selected the BIM model to do some happy E2E test cases using Cypress with Javascript. I selected Cypress, especially because it supports not only UI tests but also API checks.
I tried to do as much dynamic testing as I could, using faker and moment libraries to make tests not dependent on specific data.
Also, I think that the Page Object Model pattern is the best pattern in my case, so I chose to separate elements and functions. The page object model is more common than Selenium, but I think it's a very good option also in Cypress.

## Setup

##### Install Node & npm .
##### Install Visual Studio Code .
##### Install Cypress.
##### Install Faker Check [here](https://www.npmjs.com/package/@faker-js/faker).
##### Install cypress xpath Check [here](https://www.npmjs.com/package/@cypress/xpath).
##### Install cypress file upload Check [here](https://www.npmjs.com/package/cypress-file-upload).
##### Install Moment [here](https://www.npmjs.com/package/moment).

## Structure:
<img width="246" alt="image" src="https://user-images.githubusercontent.com/78497060/223422679-822b22d7-edb8-4317-8714-115df73d98c8.png">

### `LoginPage`
###### contains elements and login page functions.
### `PIMPage`
###### contains AddEmployeeTab File which contais all function related to Adding Employees.
###### contains EmployeeListTab File which contais all function related to EmployeeListing.
###### contains ReportsTab File which contais all function related to Reports.
###### contains elements File.
###### contains messages File.
### `Tests`
###### contains AddingEmployeeTest File which contais all Tests related to Adding Employees.
###### contains EmployeeListTest File which contais all Tests related to EmployeeListing.
###### contains ReportTest File which contais all Tests related to Reports.

## how to deal with cookies 
To deal with cookies issues i added in `Index` and after each test case we clear all cookies.
```
afterEach(() => {
    //Code to Handle the Sesssions in cypress.
    //Keep the Session alive when you jump to another test
    let str = [];
    cy.getCookies().then((cook) => {
        cy.log(cook);
        for (let l = 0; l < cook.length; l++) {
            if (cook.length > 0 && l == 0) {
                str[l] = cook[l].name;
                Cypress.Cookies.preserveOnce(str[l]);
            } else if (cook.length > 1 && l > 1) {
                str[l] = cook[l].name;
                Cypress.Cookies.preserveOnce(str[l]);
            }
        }
    })
})
```

### how to deal with Login data 
I added like email and password also base URL in `cypress.json`.

``` 
"env": {
      "EMAIL": "Admin",
      "PASSWORD": "admin123",
      "baseUrl": "https://opensource-demo.orangehrmlive.com/web/index.php"
   },`
```
### Testcase Example
To test adding Employee Name , I added data using faker and while adding i use cy.intercept method to check also Api , This make me test both Frontend and backend side in same test aslo same time.

```
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
```
 


https://user-images.githubusercontent.com/78497060/223458664-f98e8e0d-febe-476a-a221-7255e67d2642.mp4


## Notes :

###### `Faker and Moment libaries  used for creation random test data.`
###### `Cypress-Xpath used for adding strong selectors.`



