const ACTIONS = {
  POST: 'NEW_COMMENT_POST',
  POST_SUCCESS: 'NEW_COMMENT_POST_SUCCESS',
  POST_FAILURE: 'NEW_COMMENT_POST_FAILURE',
};

//ACTIONS
const newCommentPending = () => {
  return {
    type: ACTIONS.POST,
  }
};

const newCommentSuccess = (new_comment) => {
  return{
    type: ACTIONS.POST_SUCCESS,
    new_comment,
  }
};

const newCommentFailure = (error) => {
  return{
    type: ACTIONS.POST_FAILURE,
    error,
  }
};

//REDUCER
const initialState = {
  pending: false,
  error: null,
  new_comment: null,
  success: false,
};

export function newCommentReducer(state=initialState, action) {
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
        new_comment: action.new_comment,
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
export const getNewComment = state => state.newCommentReducer.new_comment;
export const getStatus = state => state.newCommentReducer.pending;
export const getError = state => state.newCommentReducer.error;
export const getSuccess = state => state.newCommentReducer.success;

//SAGA
export default function fetchNewCommentDetails(user_id, post_id, comment_text) {
  return dispatch => {
    dispatch(newCommentPending());
    return fetch('http://127.0.0.1:8000/api/comment', {
      method: 'POST',
      body: JSON.stringify({user_id: user_id, post_id: post_id, comment_text: comment_text})
    })
        .then(res => res.json())
        .then(res => {
          if(res.status === 400)
            throw res.message;

          dispatch(newCommentSuccess(res));
        })
        .catch(error => {
          dispatch(newCommentFailure(error))
        })
  };
};
