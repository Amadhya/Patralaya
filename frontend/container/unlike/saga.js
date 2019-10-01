const ACTIONS = {
  DELETE: 'UNLIKE_DELETE',
  DELETE_SUCCESS: 'UNLIKE_DELETE_SUCCESS',
  DELETE_FAILURE: 'UNLIKE_DELETE_FAILURE',
};

//ACTIONS
const unlikePending = () => {
  return {
    type: ACTIONS.DELETE,
  }
};

const unlikeSuccess = () => {
  return{
    type: ACTIONS.DELETE_SUCCESS,
  }
};

const unlikeFailure = (error) => {
  return{
    type: ACTIONS.DELETE_FAILURE,
    error,
  }
};

//REDUCER
const initialState = {
  pending: false,
  error: null,
  success: false,
};

export function unlikeReducer(state=initialState, action) {
  switch (action.type) {
    case ACTIONS.DELETE:
      return {
        ...state,
        pending: true,
      };
    case ACTIONS.DELETE_SUCCESS:
      return {
        ...state,
        error: null,
        pending: false,
        success: true,
      };
    case ACTIONS.DELETE_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}

//SELECTORS
export const getStatus = state => state.unlikeReducer.pending;
export const getError = state => state.unlikeReducer.error;
export const getSuccess = state => state.unlikeReducer.success;

//SAGA
export default function fetchUnlikeDetails(post_id, user_id) {
  return dispatch => {
    dispatch(unlikePending());
    return fetch(`http://127.0.0.1:8000/api/unlike`, {
      method: 'DELETE',
      body: JSON.stringify({post_id: post_id, user_id: user_id})
    })
        .then(res => res.json())
        .then(res => {
          if(res.status === 400)
            throw res.message;

          dispatch(unlikeSuccess());
        })
        .catch(error => {
          dispatch(unlikeFailure(error))
        })
  };
};
