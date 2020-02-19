import {AUTHENTICATE, DEAUTHENTICATE, USER} from '../types';

const initialState = {
  token: null,
  user: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.id,
      };
    case USER:
      return {
        ...state,
        user: action.payload,
      };
    case DEAUTHENTICATE:
      return {token: null, user: null};
    default:
      return state;
  }
};
