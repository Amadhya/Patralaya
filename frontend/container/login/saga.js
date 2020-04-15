import cookie from 'js-cookie';
import {DOMAIN_URL, BASE_URL} from "../../constants/api";

const ACTIONS = {
  POST: 'LOGIN_POST',
  POST_SUCCESS: 'LOGIN_POST_SUCCESS',
  POST_FAILURE: 'LOGIN_POST_FAILURE',
};

//ACTIONS
const loginPending = () => {
  return {
    type: ACTIONS.POST,
  }
};

const loginSuccess = () => {
  return{
    type: ACTIONS.POST_SUCCESS,
  }
};

const loginFailure = (error) => {
  return{
    type: ACTIONS.POST_FAILURE,
    error,
  }
};

//REDUCER
const initialState = {
  pending: false,
  error: null,
  user: null,
  success: false,
};

export function loginReducer(state=initialState, action) {
  switch (action.type) {
    case ACTIONS.POST:
      return {
        ...state,
        pending: true,
      };
    case ACTIONS.POST_SUCCESS:
      return {
        ...state,
        error: null,
        pending: false,
        success: true,
      };
    case ACTIONS.POST_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}

//SELECTORS
export const getStatus = state => state.loginReducer.pending;
export const getError = state => state.loginReducer.error;
export const getSucces = state => state.loginReducer.success;

//SAGA
export default function fetchLoginDetails(form) {
  return dispatch => {
    dispatch(loginPending());
    return fetch(`${DOMAIN_URL}${BASE_URL}login`, {
      method: 'POST',
      body: JSON.stringify({...form})
    })
    .then(res => res.json())
    .then(res => {
      if(res.status === 200){
        cookie.set('token',res.token);
        cookie.set('user_id', res.user_id);
        dispatch(loginSuccess());
      }else
        throw res.message;
    })
    .catch(error => {
      dispatch(loginFailure(error))
    })
  };
};
