Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

describe('add two employees and delete them', function () {
  beforeEach(function () {
    cy.login()
  })

  it('Add Single Employee 2 times ', function () {
    cy.server();
    cy.route({
      url: '**/work-timings',
      status: 200,
      method: 'GET', // Route all GET requests
      response: [],
    });
    // I added this because I found a Get error(403) when I click on add single employee, and the test was not continuing after this error
    cy.contains('View Team').click();
    cy.visit('/enterprise/dashboard/employees/list');
    cy.get('.js-add-employee-trigger').click();
    cy.get('[class="js-add-employee-dropdown dropdown-menu ember-view"] li')
      .contains('Add single employee')
      .click();
    cy.wait(1000);
    cy.get('.js-employee-add-form');
    cy.readFile('cypress/fixtures/employee.json').then(employeeJSON => {
      cy.wrap(employeeJSON).each(employee => {
        cy.get('input[name="preferredName"]').type(employee.preferredName);
        cy.get('input[name="firstName"]').type(employee.firstName);

        cy.get('input[name="lastName"]').type(employee.lastName);
        cy.contains('Please select nationality').click();
        cy.get('.ember-power-select-search-input').type(
          employee.nationality
        );
        cy.contains(employee.nationality).click();
        cy.get('input[name="mobileNumber"]').type(employee.mobileNo);
        cy.get('input[name="workEmail"]').type(
          'test' + Math.random() * 4 + '@example.com'
        );
        cy.get('input[name="officeNumber"]').type(employee.numberOffice);
        cy.get('input[name="position"]').type(employee.position);
        cy.contains('Please select country of residence').click();
        cy.get('.ember-power-select-search-input').type(employee.legalCountryOfResidence);
        cy.contains(employee.legalCountryOfResidence).click();
        cy.contains('Please select health insurance').click();
        cy.contains(employee.healthInsurancePolicy).click();
        cy.contains('Create and add another').click();
        cy.wait(1000);
        cy.get('[class="flash-message alert alert-success--inverted ember-view"]').should('be.visible');
      });
    });
  });

  it('should see the employees list, check if the new users are there,delete the users and logout', function () {
    cy.visit('/enterprise/dashboard/employees/list');
    cy.wait(4000);
    cy.contains('Alex Ady');
    cy.readFile('cypress/fixtures/search.json').then(name => {
      cy.get('input[type="search"]').type(name.searchName).wait(7000).should('have.class', 'search__input');
    });
    cy.visit('/enterprise/dashboard/employees/list');
    cy.get('[class="fa fa-fw fa-square-o"]').first().click()
    cy.get('[class="fa fa-trash-o fa-lg"]').click()
    cy.get('.modal-content').contains("Confirm").click()
    cy.get('[class="flash-message alert alert-success--inverted active ember-view"]', {
      timeout: 4000
    }).should('be.visible')
    cy.contains("Logout").click()
    cy.wait(5000);
    cy.url().should('include', '/enterprise/dashboard/login')
  })
})