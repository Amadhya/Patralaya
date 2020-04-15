import cookie from 'js-cookie';
import {DOMAIN_URL, BASE_URL} from "../../constants/api";

const ACTIONS = {
  POST: 'USER_POST',
  POST_SUCCESS: 'USER_POST_SUCCESS',
  POST_FAILURE: 'USER_POST_FAILURE',
};

//ACTIONS
const userPending = () => {
  return {
    type: ACTIONS.POST,
  }
};

const userSuccess = (user) => {
  return{
    type: ACTIONS.POST_SUCCESS,
    user,
  }
};

const userFailure = (error) => {
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

export function userReducer(state=initialState, action) {
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
        user: action.user,
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
export const getStatus = state => state.userReducer.pending;
export const getUserDetails = state => state.userReducer.user;
export const getError = state => state.userReducer.error;
export const getSuccess = state => state.userReducer.success;

//SAGA
export default function fetchUserDetails() {
  return dispatch => {
    dispatch(userPending());
    return fetch(`${DOMAIN_URL}${BASE_URL}profile`, {
      headers: {
        Authorization: `Bearer ${cookie.get('token')}`,
      }
    })
      .then(res => res.json())
      .then(res => {
        if(res.status === 200)
          dispatch(userSuccess(res.user));
        else
          throw res.message;
      })
      .catch(error => {
        dispatch(userFailure(error))
      })
  };
};
