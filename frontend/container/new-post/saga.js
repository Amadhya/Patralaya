const ACTIONS = {
  POST: 'NEW_POST',
  POST_SUCCESS: 'NEW_POST_SUCCESS',
  POST_FAILURE: 'NEW_POST_FAILURE',
};

//ACTIONS
const newPostPending = () => {
  return {
    type: ACTIONS.POST,
  }
};

const newPostSuccess = (new_post) => {
  return{
    type: ACTIONS.POST_SUCCESS,
    new_post,
  }
};

const newPostFailure = (error) => {
  return{
    type: ACTIONS.POST_FAILURE,
    error,
  }
};

//REDUCER
const initialState = {
  pending: false,
  error: null,
  new_post: null,
  success: false,
};

export function newPostReducer(state=initialState, action) {
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
        new_post: action.new_post,
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
export const getNewPost = state => state.newPostReducer.new_post;
export const getNewPostStatus = state => state.newPostReducer.pending;
export const getNewPostError = state => state.newPostReducer.error;
export const getNewPostSuccess = state => state.newPostReducer.success;

//SAGA
export default function fetchNewPostDetails(user_id, post_text) {
  return dispatch => {
    dispatch(newPostPending());
    return fetch('http://127.0.0.1:8000/api/post', {
      method: 'POST',
      body: JSON.stringify({user_id: user_id, post_text: post_text})
    })
        .then(res => res.json())
        .then(res => {
          if(res.status === 400)
            throw res.message;

          dispatch(newPostSuccess(res));
        })
        .catch(error => {
          dispatch(newPostFailure(error))
        })
  };
};
