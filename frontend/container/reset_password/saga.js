import {DOMAIN_URL, BASE_URL} from "../../constants/api";

const ACTIONS = {
    PATCH: 'PASSWORD_PATCH',
    PATCH_SUCCESS: 'PASSWORD_PATCH_SUCCESS',
    PATCH_FAILURE: 'PASSWORD_PATCH_FAILURE',
  };
  
  //ACTIONS
  const passwordResetPending = () => {
    return {
      type: ACTIONS.PATCH,
    }
  };
  
  const passwordResetSuccess = (order) => {
    return{
      type: ACTIONS.PATCH_SUCCESS,
    }
  };
  
  const passwordResetFailure = (error) => {
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
  
  export function passwordResetReducer(state=initialState, action) {
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
          pending: false,
          error: action.error,
        };
      default:
        return state;
    }
  }
  
  //SELECTORS
  export const getStatus = state => state.passwordResetReducer.pending;
  export const getError = state => state.passwordResetReducer.error;
  export const getSuccess = state => state.passwordResetReducer.success;
  
  //SAGA
  export default function fetchPasswordReset(form) {
    return dispatch => {
      dispatch(passwordResetPending());
      return fetch(`${DOMAIN_URL}${BASE_URL}reset_password`, {
        method: 'PATCH',
        body: JSON.stringify({...form})
      })
          .then(res => res.json())
          .then(res => {
            if(res.status === '400')
              throw res.message;
               
            dispatch(passwordResetSuccess());
          })
          .catch(error => {
            dispatch(passwordResetFailure(error))
          })
    };
  };