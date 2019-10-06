const ACTIONS = {
  DELETE: 'POST_DELETE',
  DELETE_SUCCESS: 'POST_DELETE_SUCCESS',
  DELETE_FAILURE: 'POST_DELETE_FAILURE',
};

//ACTIONS
const postDeletePending = () => {
  return {
    type: ACTIONS.DELETE,
  }
};

const postDeleteSuccess = () => {
  return{
    type: ACTIONS.DELETE_SUCCESS,
  }
};

const postDeleteFailure = (error) => {
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

export function postDeleteReducer(state=initialState, action) {
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
export const getDeleteStatus = state => state.postDeleteReducer.pending;
export const getDeleteError = state => state.postDeleteReducer.error;
export const getDeleteSuccess = state => state.postDeleteReducer.success;

//SAGA
export default function fetchPostDeleteDetails(post_id) {
  return dispatch => {
    dispatch(postDeletePending());
    return fetch(`http://127.0.0.1:8000/api/delete_post`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({post_id: post_id})
    })
        .then(res => res.json())
        .then(res => {
          if(res.status === 400)
            throw res.message;

          dispatch(postDeleteSuccess());
        })
        .catch(error => {
          dispatch(postDeleteFailure(error))
        })
  };
};
