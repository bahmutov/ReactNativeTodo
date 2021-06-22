/// <reference types="cypress" />
import * as Api from '../../api';

const {GET, POST} = Api;

describe('network', () => {
  // use cy.intercept command to spy on the
  // actual network calls made by the code
  it('creates todos', () => {
    const apiUrl = 'http://localhost:3000';

    cy.intercept(`${apiUrl}/`, req => {
      // make sure the call is not cached by the browser
      delete req.headers['if-none-match'];
    })
      .as('todos')
      .then(() => {
        // once we prepared the intercept
        // make the call using the app code
        Api.asyncRequest();
      });
    cy.wait('@todos').its('response.body').should('be.an', 'array');

    // delete all items
    cy.request('POST', `${apiUrl}/delete-all`).then(() => {
      return Api.asyncRequest();
    });
    cy.wait('@todos').its('response.body').should('deep.equal', []);

    // let's add a new item
    const todo = {text: 'Todo'};
    cy.then(() => {
      return Api.asyncRequest(POST, 'create', todo);
    });
    // we can also add new async commands by wrapping
    // the object and using cy.invoke method
    cy.wrap(Api).invoke('fetchTodos');
    // 1 todo item
    cy.wait('@todos')
      .its('response.body')
      .should('have.length', 1)
      .its(0)
      // each new todo item gets a random ID
      // and property "done: false" at start
      .should('deep.include', todo)
      .and(todo => {
        expect(todo).to.have.property('id');
        expect(todo).to.have.property('done', false);
      });
  });
});

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
