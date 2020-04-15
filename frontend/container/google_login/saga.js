import cookie from 'js-cookie';
import {DOMAIN_URL, BASE_URL} from "../../constants/api";

const ACTIONS = {
    POST: 'GOOGLE_LOGIN_POST',
    POST_SUCCESS: 'GOOGLE_LOGIN_POST_SUCCESS',
    POST_FAILURE: 'GOOGLE_LOGIN_POST_FAILURE',
  };
  
  //ACTIONS
  const googleLoginPending = () => {
    return {
      type: ACTIONS.POST,
    }
  };
  
  const googleLoginSuccess = () => {
    return{
      type: ACTIONS.POST_SUCCESS,
    }
  };
  
  const googleLoginFailure = (error) => {
    return{
      type: ACTIONS.POST_FAILURE,
      error,
    }
  };
  
  //REDUCER
  const initialState = {
    pending: false,
    error: null,
    success: false,
  };
  
  export function googleLoginReducer(state=initialState, action) {
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
  export const getStatus = state => state.googleLoginReducer.pending;
  export const getError = state => state.googleLoginReducer.error;
  export const getSuccess = state => state.googleLoginReducer.success;
  
  //SAGA
  export default function fetchGoogleLoginDetails(token) {
    return dispatch => {
      dispatch(googleLoginPending());
      return fetch(`${DOMAIN_URL}${BASE_URL}google_login_access_token`, {
        method: 'POST',
        body: JSON.stringify({'access_token':token})
      })
          .then(res => res.json())
          .then(res => {
            if(res.status === '400')
              throw res.message;
  
            cookie.set('token',res.token);
            dispatch(googleLoginSuccess());
          })
          .catch(error => {
            dispatch(googleLoginFailure(error))
          })
    };
  };