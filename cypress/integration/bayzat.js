Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});
describe('Login to bayzat', function () {
  it('click to the login button', function () {
    cy.visit('');
    cy.get('.menu').within(() => {
      cy.contains('Login').should('have.attr', 'href', '/profile/login');
    });
    cy.contains('Login').click();
  });

  // it('login to the bayzat page', function () {})

  it('Add Single Employee', function () {
    cy.server();
    cy.route({
      url: '**/work-timings',
      status: 200
    });
    cy.get('[name="username"]').type('mridul+180307@bayzat.com');
    cy.get('[name="password"]').type('123456789');
    cy.get('button[type="submit"]').click();
    cy.expect(cy.contains('Dashboard'));
    cy.contains('View Team').click();
    cy.visit('/enterprise/dashboard/employees/list');
    cy.get('.js-add-employee-trigger').click();
    cy.get('[class="js-add-employee-dropdown dropdown-menu ember-view"] li')
      .contains('Add single employee')
      .click();
    // cy.url().should('contain', 'employees/create');
    cy.get('.js-employee-add-form', {
      timeout: 60000
    }).contains('Add mew employee');
    cy.get('form').within($form => {
      cy.readFile('cypress/fixtures/employee.json').then(employeeJSON => {
        cy.wrap(employeeJSON).each(employee => {
          cy.get('input[name="preferredName"]').type(employee.preferredName);
          cy.get('input[name="firstName"]').type(employee.firstName);

          cy.get('input[name="lastName"]').type(employee.lastName);
          cy.contains('Please select nationality').click({});
          cy.get('.ember-power-select-search-input').type(
            employee.nationality, {}
          );
          cy.contains(employee.nationality).click({});
          cy.get('input[name="mobileNumber"]').type(employee.mobileNo, {});

          cy.get('input[name="workEmail"]').type(
            'test' + Math.random() * 4 + '@example.com'
          );

          cy.get('input[name="officeNumber"]').type(employee.numberOffice);

          cy.get('input[name="position"]').type(employee.position, {});

          cy.contains('Please select country of residence').click({});

          cy.get('.ember-power-select-search-input').type(
            employee.legalCountryOfResidence, {}
          );

          cy.contains(employee.legalCountryOfResidence).click({});

          cy.contains('Please select health insurance').click({});

          cy.contains(employee.healthInsurancePolicy).click({});
          cy.contains('Create and add another').click();
       });
      });
    });
  });
});