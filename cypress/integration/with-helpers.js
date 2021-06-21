/// <reference types="cypress" />

/**
 * Returns data attribute selector for the given test id
 */
const tid = testId => `[data-testid="${testId}"]`;

describe('RN Todos with helpers', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3000/delete-all');
  });

  it('adds todos', () => {
    cy.visit('/');
    // using Enter works on the web
    cy.get(tid('add-todo')).should('have.focus').type('code RN app{enter}');
    cy.get(tid('todo')).should('have.length', 1);
    // clicking "Add" button works too
    cy.get(tid('add-todo')).type('add Expo');
    cy.get(tid('add')).click();
    cy.get(tid('todo')).should('have.length', 2);

    cy.log('**complete item**');
    cy.contains(tid('todo'), 'code RN').find(tid('toggle')).click();
    cy.contains(tid('todo'), 'code RN').should(
      'have.attr',
      'aria-label',
      'completed',
    );
    // the other todo should still be incomplete
    cy.contains(tid('todo'), 'add Expo').should(
      'have.attr',
      'aria-label',
      'incomplete',
    );

    cy.log('**filters**');
    cy.contains(tid('filter'), 'Active').click();
    cy.get(tid('todo')).should('have.length', 1);
    cy.contains(tid('todo'), 'add Expo').should('be.visible');
    cy.contains(tid('filter'), 'Done').click();
    cy.get(tid('todo')).should('have.length', 1);
    cy.contains(tid('todo'), 'code RN').should('be.visible');

    cy.log('**removing**');
    cy.contains(tid('todo'), 'code RN').find(tid('delete')).click();
    cy.get(tid('todo')).should('not.exist');
    cy.contains(tid('filter'), 'All').click();
    cy.get(tid('todo')).should('have.length', 1);
    cy.contains(tid('todo'), 'add Expo').should('be.visible');
  });
});
