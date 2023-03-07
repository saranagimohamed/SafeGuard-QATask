var elements = require("./elements");
export default class LoginPage {
  login(email, password) {
    cy.xpath(elements.Email_Field).type(email);
    cy.xpath(elements.Password_Field).type(password);
    cy.xpath(elements.Login_button).click();
  }
}
