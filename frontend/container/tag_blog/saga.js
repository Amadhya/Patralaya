import {DOMAIN_URL, BASE_URL} from "../../constants/api";

const ACTIONS = {
    GET: 'TAG_BLOGS_GET',
    GET_SUCCESS: 'TAG_BLOGS_GET_SUCCESS',
    GET_FAILURE: 'TAG_BLOGS_GET_FAILURE',
};

//ACTIONS
const tagBlogsPending = () => {
    return {
        type: ACTIONS.GET,
    }
};

const tagBlogsSuccess = (blogs) => {
    return{
        type: ACTIONS.GET_SUCCESS,
        blogs,
    }
};

const tagBlogsFailure = (error) => {
    return{
        type: ACTIONS.GET_FAILURE,
        error,
    }
};

//REDUCER
const initialState = {
    pending: false,
    error: null,
    blogs: null,
    success: false,
};

export function tagBlogsReducer(state=initialState, action) {
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
        blogs: action.blogs,
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
export const getStatus = state => state.tagBlogsReducer.pending;
export const getBlogs = state => state.tagBlogsReducer.blogs;
export const getSuccess = state => state.tagBlogsReducer.success;
export const getError = state => state.tagBlogsReducer.error;

//SAGA
export default function fetchTagBlogs(tag) {
    return dispatch => {
        dispatch(tagBlogsPending());
        return fetch(`${DOMAIN_URL}${BASE_URL}tag/${tag}`)
        .then(res => res.json())
        .then(res => {
        if(res.status === 200){
            dispatch(tagBlogsSuccess(res.blogs));
        }else
            throw res.message
        })
        .catch(error => {
            dispatch(tagBlogsFailure(error))
        })
    };
};
  