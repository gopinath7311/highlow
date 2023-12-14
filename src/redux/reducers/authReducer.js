import {UPDATE_AUTH} from '../actions/authAction';

const authReducer = (state = {}, {type, payload}) => {
  switch (type) {
    case UPDATE_AUTH:
      return payload;
    default:
      return state;
  }
};
export default authReducer;
