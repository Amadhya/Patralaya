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
export default function fetchUserDetails(user_id) {
  return dispatch => {
    dispatch(userPending());
    return fetch(`http://127.0.0.1:8000/api/profile/${user_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => res.json())
      .then(res => {
        if(res.status === 400)
          throw res.message;

        dispatch(userSuccess(res.user));
      })
      .catch(error => {
        dispatch(userFailure(error))
      })
  };
};
