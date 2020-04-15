import {DOMAIN_URL, BASE_URL} from "../../constants/api";

const ACTIONS = {
    GET: 'BLOG_GET',
    GET_SUCCESS: 'BLOG_GET_SUCCESS',
    GET_FAILURE: 'BLOG_GET_FAILURE',
  };
  
  //ACTIONS
  const blogPending = () => {
    return {
      type: ACTIONS.GET,
    }
  };
  
  const blogSuccess = (blog,comments,likes) => {
    return{
      type: ACTIONS.GET_SUCCESS,
      blog,
      comments,
      likes,
    }
  };
  
  const blogFailure = (error) => {
    return{
      type: ACTIONS.GET_FAILURE,
      error,
    }
  };
  
  //REDUCER
  const initialState = {
    pending: false,
    error: null,
    blog: null,
    comments: null,
    likes: null,
    success: false,
  };
  
  export function blogReducer(state=initialState, action) {
    switch (action.type) {
      case ACTIONS.GET:
        return {
          ...state,
          pending: true,
        };
      case ACTIONS.GET_SUCCESS:
        return {
          ...state,
          pending: false,
          blog: action.blog,
          comments: action.comments,
          likes: action.likes,
          success: true,
        };
      case ACTIONS.GET_FAILURE:
        return {
          ...state,
          error: action.error,
        };
      default:
        return state;
    }
  }
  
  //SELECTORS
  export const getStatus = state => state.blogReducer.pending;
  export const getBlog = state => state.blogReducer.blog;
  export const getBlogComments = state => state.blogReducer.comments;
  export const getBlogLikes = state => state.blogReducer.likes;
  export const getSuccess = state => state.blogReducer.success;
  export const getError = state => state.blogReducer.error;
  
  //SAGA
  export default function fetchBlog(blogId) {
    return dispatch => {
      dispatch(blogPending());
       return fetch(`${DOMAIN_URL}${BASE_URL}blog/${blogId}`)
      .then(res => res.json())
      .then(res => {
        if(res.status === 200)
          dispatch(blogSuccess(res.blog,res.comments,res.likes));
        else
          throw res.message
      })
      .catch(error => {
        dispatch(blogFailure(error))
      })
    };
  };
  