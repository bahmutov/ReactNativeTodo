/// <reference types="cypress" />
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as Api from '../../api';
import * as Actions from '../../actions';

const mockStore = configureMockStore([thunk]);

describe('Async actions', () => {
  it('Handles successful fetch', () => {
    const store = mockStore();
    const todos = [{text: 'Text', id: 123, done: false}];
    // Mock async API method success
    cy.stub(Api, 'fetchTodos').resolves(todos).as('fetchTodos');

    const expectedActions = [
      Actions.fetchTodos(),
      Actions.fetchTodosSuccess(todos),
    ];

    cy.wrap(store).invoke('dispatch', Actions.fetchTodosAsync());
    cy.get('@fetchTodos').should('have.been.called');
    cy.wrap(store).invoke('getActions').should('deep.equal', expectedActions);
  });

  it('Handles unsuccessful fetch', () => {
    const store = mockStore();
    // Mock async API method error
    cy.stub(Api, 'fetchTodos').rejects('Error');

    const expectedActions = [
      Actions.fetchTodos(),
      Actions.fetchTodosError('Error'),
    ];

    // If a test returns nothing it will pass by default
    return (
      store
        // Dispatch async action
        .dispatch(Actions.fetchTodosAsync())
        // Wait for async action to complete
        .then(() => {
          // Mocked method is called
          // expect(fetchTodosMock).toHaveBeenCalled();
          expect(Api.fetchTodos).to.have.been.called;
          // Expected actions are dispatched
          // expect(store.getActions()).to.deep.equal(expectedActions);
        })
    );
  });
});

describe('Action creators', () => {
  it('Creates CREATE_TODO action', () => {
    const action = {type: Actions.CREATE_TODO, text: 'Todo'};
    expect(Actions.createTodo('Todo')).to.deep.equal(action);
  });

  it('Creates CREATE_TODO_ERROR action', () => {
    const action = {type: Actions.CREATE_TODO_ERROR, error: 'Error'};
    expect(Actions.createTodoError('Error')).to.deep.equal(action);
  });

  it('Creates CREATE_TODO_SUCCESS action', () => {
    const todo = {text: 'Text', id: 123, done: false};
    const action = {type: Actions.CREATE_TODO_SUCCESS, todo};
    expect(Actions.createTodoSuccess(todo)).to.deep.equal(action);
  });

  it('Creates DELETE_TODO action', () => {
    const action = {type: Actions.DELETE_TODO, id: 123};
    expect(Actions.deleteTodo(123)).to.deep.equal(action);
  });

  it('Creates DELETE_TODO_ERROR action', () => {
    const action = {type: Actions.DELETE_TODO_ERROR, id: 123, error: 'Error'};
    expect(Actions.deleteTodoError(123, 'Error')).to.deep.equal(action);
  });

  it('Creates DELETE_TODO_SUCCESS action', () => {
    const action = {type: Actions.DELETE_TODO_SUCCESS, id: 123};
    expect(Actions.deleteTodoSuccess(123)).to.deep.equal(action);
  });

  it('Creates FETCH_TODOS action', () => {
    const action = {type: Actions.FETCH_TODOS};
    expect(Actions.fetchTodos()).to.deep.equal(action);
  });

  it('Creates FETCH_TODOS_ERROR action', () => {
    const action = {type: Actions.FETCH_TODOS_ERROR, error: 'Error'};
    expect(Actions.fetchTodosError('Error')).to.deep.equal(action);
  });

  it('Creates FETCH_TODOS_SUCCESS action', () => {
    const todos = [{text: 'Text', id: 123, done: false}];
    const action = {type: Actions.FETCH_TODOS_SUCCESS, todos};
    expect(Actions.fetchTodosSuccess(todos)).to.deep.equal(action);
  });

  it('Creates FILTER_TODOS action', () => {
    const action = {type: Actions.FILTER_TODOS, filter: 'All'};
    expect(Actions.filterTodos('All')).to.deep.equal(action);
  });

  it('Creates TOGGLE_TODO action', () => {
    const action = {type: Actions.TOGGLE_TODO, id: 123, done: true};
    expect(Actions.toggleTodo(123, true)).to.deep.equal(action);
  });

  it('Creates TOGGLE_TODO_CANCEL action', () => {
    const action = {type: Actions.TOGGLE_TODO_CANCEL};
    expect(Actions.toggleTodoCancel()).to.deep.equal(action);
  });

  it('Creates TOGGLE_TODO_ERROR action', () => {
    const action = {type: Actions.TOGGLE_TODO_ERROR, id: 123, error: 'Error'};
    expect(Actions.toggleTodoError(123, 'Error')).to.deep.equal(action);
  });

  it('Creates TOGGLE_TODO_SUCCESS action', () => {
    const action = {type: Actions.TOGGLE_TODO_SUCCESS, id: 123, done: true};
    expect(Actions.toggleTodoSuccess(123, true)).to.deep.equal(action);
  });
});
