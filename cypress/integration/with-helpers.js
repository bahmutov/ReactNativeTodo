/// <reference types="cypress" />

/**
 * Returns data attribute selector for the given test id
 */
const tid = testId => `[data-testid="${testId}"]`;

/**
 * Selects elements using cy.get or cy.contains
 * using the provided test ID attribute.
 */
const byTestId = (testId, text) => {
  if (text) {
    return cy.contains(tid(testId), text);
  }

  return cy.get(tid(testId));
};

describe('RN Todos with helpers', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3000/delete-all');
  });

  it('adds todos', () => {
    cy.visit('/');
    // using Enter works on the web
    byTestId('add-todo').should('have.focus').type('code RN app{enter}');
    byTestId('todo').should('have.length', 1);
    // clicking "Add" button works too
    byTestId('add-todo').type('add Expo');
    byTestId('add').click();
    byTestId('todo').should('have.length', 2);

    // visual snapshot
    cy.percySnapshot('two items');

    // a11y check
    cy.injectAxe();
    cy.checkA11y();

    cy.log('**complete item**');
    byTestId('todo', 'code RN').find(tid('toggle')).click();
    byTestId('todo', 'code RN').should('have.attr', 'aria-label', 'completed');
    // the other todo should still be incomplete
    byTestId('todo', 'add Expo').should(
      'have.attr',
      'aria-label',
      'incomplete',
    );

    cy.percySnapshot('completed first item');

    cy.log('**filters**');
    byTestId('filter', 'Active').click();
    byTestId('todo').should('have.length', 1);
    byTestId('todo', 'add Expo').should('be.visible');
    byTestId('filter', 'Done').click();
    byTestId('todo').should('have.length', 1);
    byTestId('todo', 'code RN').should('be.visible');

    cy.log('**removing**');
    byTestId('todo', 'code RN').find(tid('delete')).click();
    byTestId('todo').should('not.exist');
    byTestId('filter', 'All').click();
    byTestId('todo').should('have.length', 1);
    byTestId('todo', 'add Expo').should('be.visible');
  });

  it('shows error on load', () => {
    cy.intercept('http://localhost:3000/', {
      statusCode: 500,
      body: {
        error: 'Load failed',
      },
    });
    cy.visit('/');
    byTestId('error', 'Load failed').should('be.visible');
  });

  it('shows error on create', () => {
    const error = 'Create todo failed';
    cy.intercept('POST', 'http://localhost:3000/create', {
      statusCode: 500,
      body: {
        error,
      },
    });
    cy.visit('/');
    byTestId('add-todo').type('add Expo');
    byTestId('add').click();
    byTestId('error', error).should('be.visible');
  });

  it('does not allow adding empty items', () => {
    // spy on the network call to create an item
    cy.intercept('POST', 'http://localhost:3000/create').as('create');
    cy.visit('/')
      // note: this delay should not be necessary
      // but the application has a logical error
      // if the error happens quickly, the quickly disappears
      .wait(500);
    byTestId('add-todo').should('have.value', '');
    byTestId('add').click();
    // from the network spy, get the response object
    // and extract the error message
    cy.wait('@create')
      .its('response.body.error')
      .then(error => {
        expect(error).to.be.a('string');
        byTestId('error', error).should('be.visible');
      });
  });

  it('does not allow duplicates', () => {
    // spy on the network call to create an item
    cy.intercept('POST', 'http://localhost:3000/create').as('create');
    cy.visit('/');
    byTestId('add-todo').type('duplicate{enter}');
    cy.wait('@create'); // first call is successful
    byTestId('todo').should('have.length', 1);

    byTestId('add-todo').type('duplicate{enter}');
    // second call should fail
    cy.wait('@create')
      .its('response.body.error')
      .then(error => {
        expect(error).to.be.a('string');
        byTestId('error', error).should('be.visible');
      });
  });

  it('shows error on delete', () => {
    // intercept the network call and change the item's id
    // to cause the delete to fail
    cy.intercept('POST', 'http://localhost:3000/delete', req => {
      // set invalid id
      req.body.id = 10;
    }).as('delete');
    cy.visit('/');
    byTestId('add-todo').type('write tests{enter}');
    byTestId('todo').should('have.length', 1);
    byTestId('todo').first().find(tid('delete')).click();

    // the delete call should fail
    cy.wait('@delete')
      .its('response.body.error')
      .then(error => {
        expect(error).to.be.a('string');
        byTestId('error', error).should('be.visible');
      });
    // the original todo is still there
    byTestId('todo', 'write tests').should('be.visible');

    cy.percySnapshot('server error on delete');
  });

  it('shows error on toggle', () => {
    // intercept the network call and change the item's id
    // to cause the toggle to fail
    cy.intercept('POST', 'http://localhost:3000/toggle', req => {
      // set invalid id
      req.body.id = 10;
    }).as('toggle');
    cy.visit('/');
    byTestId('add-todo').type('write tests{enter}');
    byTestId('todo').should('have.length', 1);
    byTestId('todo', 'write tests')
      .should('have.attr', 'aria-label', 'incomplete')
      .find(tid('toggle'))
      .click();

    // the toggle call should fail
    cy.wait('@toggle')
      .its('response.body.error')
      .then(error => {
        expect(error).to.be.a('string');
        byTestId('error', error).should('be.visible');
      });
    // the original todo is still incomplete
    byTestId('todo', 'write tests').should(
      'have.attr',
      'aria-label',
      'incomplete',
    );
  });
});
