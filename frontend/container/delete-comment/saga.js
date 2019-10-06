const ACTIONS = {
  DELETE: 'COMMENT_DELETE',
  DELETE_SUCCESS: 'COMMENT_DELETE_SUCCESS',
  DELETE_FAILURE: 'COMMENT_DELETE_FAILURE',
};

//ACTIONS
const commentDeletePending = () => {
  return {
    type: ACTIONS.DELETE,
  }
};

const commentDeleteSuccess = () => {
  return{
    type: ACTIONS.DELETE_SUCCESS,
  }
};

const commentDeleteFailure = (error) => {
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

export function commentDeleteReducer(state=initialState, action) {
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
export const getDeleteStatus = state => state.commentDeleteReducer.pending;
export const getDeleteError = state => state.commentDeleteReducer.error;
export const getDeleteSuccess = state => state.commentDeleteReducer.success;

//SAGA
export default function fetchCommentDeleteDetails(comment_id) {
  return dispatch => {
    dispatch(commentDeletePending());
    return fetch(`http://127.0.0.1:8000/api/delete_comment`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({comment_id: comment_id})
    })
        .then(res => res.json())
        .then(res => {
          if(res.status === 400)
            throw res.message;

          dispatch(commentDeleteSuccess());
        })
        .catch(error => {
          dispatch(commentDeleteFailure(error))
        })
  };
};
