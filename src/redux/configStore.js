import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

export default configureStore = (initialState = {}) => {
  const initialStore = createStore(reducer, initialState, applyMiddleware(thunk));
  console.log(initialStore);
  return initialStore
};
