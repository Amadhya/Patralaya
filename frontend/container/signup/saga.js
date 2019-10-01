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
export default function fetchSignUpDetails(email, password, firstName, lastName) {
  return dispatch => {
    dispatch(signupPending());
    return fetch('http://127.0.0.1:8000/api/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName
      })
    })
    .then(res => res.json())
    .then(res => {
      if(res.status === 400)
        throw res.message;

      localStorage.setItem('token', res.token);
      localStorage.setItem('user_id', res.user_id);
      dispatch(signupSuccess());

    })
    .catch(error => {
      dispatch(signupFailure(error))
    })
  };
};
