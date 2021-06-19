/// <reference types="cypress" />

describe('RN Todos', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3000/delete-all');
  });

  it('adds todos', () => {
    cy.visit('/');
    // using Enter works on the web
    cy.get('[data-testid=add-todo]')
      .should('have.focus')
      .type('code RN app{enter}');
    cy.get('[data-testid=todo]').should('have.length', 1);
    // clicking "Add" button works too
    cy.get('[data-testid=add-todo]').type('add Expo');
    cy.get('[data-testid=add]').click();
    cy.get('[data-testid=todo]').should('have.length', 2);
    cy.log('**complete item**');
    cy.contains('[data-testid=todo]', 'code RN')
      .find('[data-testid=toggle]')
      .click();
    cy.contains('[data-testid=todo]', 'code RN').should(
      'have.attr',
      'aria-label',
      'completed',
    );
    // the other todo should still be incomplete
    cy.contains('[data-testid=todo]', 'add Expo').should(
      'have.attr',
      'aria-label',
      'incomplete',
    );
    cy.log('**filters**');
    cy.contains('[data-testid=filter]', 'Active').click();
    cy.get('[data-testid=todo]').should('have.length', 1);
    cy.contains('[data-testid=todo]', 'add Expo').should('be.visible');
    cy.contains('[data-testid=filter]', 'Done').click();
    cy.get('[data-testid=todo]').should('have.length', 1);
    cy.contains('[data-testid=todo]', 'code RN').should('be.visible');

    cy.log('**removing**');
    cy.contains('[data-testid=todo]', 'code RN')
      .find('[data-testid=delete]')
      .click();
    cy.get('[data-testid=todo]').should('not.exist');
    cy.contains('[data-testid=filter]', 'All').click();
    cy.get('[data-testid=todo]').should('have.length', 1);
    cy.contains('[data-testid=todo]', 'add Expo').should('be.visible');
  });
});
