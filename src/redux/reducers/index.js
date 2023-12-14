import {combineReducers} from 'redux';
import authReducer from './authReducer';

export default function allReducers() {
  return combineReducers({
    auth: authReducer,

  });
}
