import cookie from 'js-cookie';

import {DOMAIN_URL, BASE_URL} from "../../constants/api";

const ACTIONS = {
  PATCH: 'PATCH_VERFIFICATION',
  PATCH_SUCCESS: 'PATCH_PASSWORD_SUCCESS',
  PATCH_FAILURE: 'PATCH_PASSWORD_FAILURE',
};

//ACTIONS
const passwordChangePending = () => {
  return {
    type: ACTIONS.PATCH,
  }
};

const passwordChangeSuccess = () => {
  return{
    type: ACTIONS.PATCH_SUCCESS,
  }
};

const passwordChangeFailure = (error) => {
  return{
    type: ACTIONS.PATCH_FAILURE,
    error,
  }
};

//REDUCER
const initialState = {
  pending: false,
  error: null,
  success: false,
};

export function passwordChangeReducer(state=initialState, action) {
  switch (action.type) {
    case ACTIONS.PATCH:
      return {
        ...state,
        pending: true,
      };
    case ACTIONS.PATCH_SUCCESS:
      return {
        ...state,
        error: null,
        pending: false,
        success: true,
      };
    case ACTIONS.PATCH_FAILURE:
      return {
        ...state,
        error: action.error,
        pending: false,
      };
    default:
      return state;
  }
}

//SELECTORS
export const getStatus = state => state.passwordChangeReducer.pending;
export const getError = state => state.passwordChangeReducer.error;
export const getSuccess = state => state.passwordChangeReducer.success;

//SAGA
export default function fetchPasswordChange(current, newPassword) {
  return dispatch => {
    dispatch(passwordChangePending());
    return fetch(`${DOMAIN_URL}${BASE_URL}user/password/edit`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({'current_password': current, 'new_password': newPassword})
    })
      .then(res => res.json())
      .then(res => {
        if(res.status === 400)
          throw res.message;
        
        cookie.set('token',res.token);
        dispatch(passwordChangeSuccess());
      })
      .catch(error => {
        dispatch(passwordChangeFailure(error))
      })
  };
};
