import cookie from 'js-cookie';
import {DOMAIN_URL, BASE_URL} from "../../constants/api";

const ACTIONS = {
  POST: 'SIGNUP_POST',
  POST_SUCCESS: 'SIGNUP_POST_SUCCESS',
  POST_FAILURE: 'SIGNUP_POST_FAILURE',
};

//ACTIONS
const signupPending = () => {
  return {
    type: ACTIONS.POST,
  }
};

const signupSuccess = () => {
  return{
    type: ACTIONS.POST_SUCCESS,
  }
};

const signupFailure = (error) => {
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

export function signupReducer(state=initialState, action) {
  switch (action.type) {
    case ACTIONS.POST:
      return {
        ...state,
        pending: true,
      };
    case ACTIONS.POST_SUCCESS:
      return {
        ...state,
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
export const getStatus = state => state.signupReducer.pending;
export const getSuccess = state => state.signupReducer.success;
export const getError = state => state.loginReducer.error;

//SAGA
export default function fetchSignUpDetails(form) {
  return dispatch => {
    dispatch(signupPending());
    return fetch(`${DOMAIN_URL}${BASE_URL}signup`, {
      method: 'POST',
      body: JSON.stringify({...form})
    })
    .then(res => res.json())
    .then(res => {
      if(res.status === 200){
        cookie.set('token',res.token);
        cookie.set('user_id', res.user_id);
        dispatch(signupSuccess());
      }else
        throw res.message;
    })
    .catch(error => {
      dispatch(signupFailure(error))
    })
  };
};
