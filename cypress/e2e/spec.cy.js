Cypress.Commands.add('cachedLogin', () => {
  const user = Cypress.env('user')
  cy.session(
      user,
      () => {
          cy.visit('https://edc6.iomedico.de/');
          // cy.origin('https://edc6.iomedico.de/', { args: user }, (user) => {
              cy.get('#username').type(user.username);
              cy.get('#password').type(user.password);
              cy.get('#kc-login').click();
          // });
          cy.url().should('contain', 'https://edc6.iomedico.de/');
      },
      {
          validate() {
              cy.request('/').its('status').should('eq', 200);
          },
      }
  );
});

describe('issue 22751 reproducer', () => {
  beforeEach(() => {
      cy.cachedLogin();
  });

  it.only('starts', () => {
      cy.visit('https://edc6.iomedico.de/');
      cy.contains('Start');
  });

  it('starts again', () => {
      cy.visit('/');
      // cy.wait(1000); // add line to see that browser is at login screen
      cy.contains('Start'); // fails on Cypress 10.3; "Timed out after waiting 60000ms for your remote page to load on origin(s):"
  });
});
