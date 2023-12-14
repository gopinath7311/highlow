import allReducers from './reducers/index';
import thunk from 'redux-thunk';
import {legacy_createStore, applyMiddleware, compose} from 'redux';

const myreducers = allReducers();
const middleware = [thunk];
let enhancers = compose(applyMiddleware(thunk));
let store = legacy_createStore(
  myreducers,
  compose(enhancers, applyMiddleware(...middleware)),
);
export default store;
