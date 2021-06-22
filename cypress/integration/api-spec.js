/// <reference types="cypress" />
import * as Api from '../../api';

const {GET, POST} = Api;

describe('asyncRequest()', () => {
  // Cypress stubs are reset before each test
  beforeEach(() => {
    cy.spy(window, 'fetch').as('fetch');
  });

  it('Handles GET requests', () => {
    const url = 'http://localhost:3000/';
    const params = {
      method: GET,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    Api.asyncRequest();
    cy.get('@fetch').should('have.been.calledWith', url, params);
  });

  it('Handles POST requests', () => {
    const todo = {text: 'Todo'};
    const url = 'http://localhost:3000/create';
    const params = {
      method: POST,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    };
    Api.asyncRequest(POST, 'create', todo);
    cy.get('@fetch').should('have.been.calledWith', url, params);
  });
});

describe('Api methods', () => {
  beforeEach(() => {
    cy.spy(Api, 'asyncRequest').as('asyncRequest');
  });

  it('fetchTodos()', () => {
    Api.fetchTodos();
    // Called with no arguments
    cy.get('@asyncRequest').should('have.been.calledWithExactly');
  });

  it('createTodo()', () => {
    Api.createTodo('Todo');
    cy.get('@asyncRequest').should('have.been.calledWith', POST, 'create', {
      text: 'Todo',
    });
  });

  it('deleteTodo()', () => {
    Api.deleteTodo(123);
    cy.get('@asyncRequest').should('have.been.calledWith', POST, 'delete', {
      id: 123,
    });
  });

  it('toggleTodo()', () => {
    Api.toggleTodo(123, true);
    cy.get('@asyncRequest').should('have.been.calledWith', POST, 'toggle', {
      id: 123,
      done: true,
    });
  });
});
