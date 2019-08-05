Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('login to the bayzat page', function () {
    it('click to the login button and log in', function () {
        cy.visit('');
        cy.get('.menu').within(() => {
            cy.contains('Login').should('have.attr', 'href', '/profile/login');
        });
        cy.contains('Login').click();
        cy.get('[name="username"]').type('mridul+180307@bayzat.com');
        cy.get('[name="password"]').type('123456789');
        cy.get('button[type="submit"]').click();
        cy.expect(cy.contains('Dashboard'));
    });
});