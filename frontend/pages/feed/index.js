import React, {PureComponent, Fragment} from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Typography, Button, TextField, Box, InputLabel, FormControl, Select} from '@material-ui/core';
import styled from 'styled-components';

import {Row, Col, FlexView} from "../../components/layout";
import {Router} from "../../routes";
import {store} from "../_app";
import fetchFeed , {getSuccess, getError, getStatus, getFeed} from "../../container/feed/saga";
import fetchNewPostDetails, {getNewPost, getNewPostStatus, getNewPostSuccess, getNewPostError} from "../../container/new-post/saga";
import Profile from "./profile";
import PostCard from "./post-card";

const RowWrapper = styled(Row)`
  padding: 0px 12rem;
  @media(max-width: 1024px){
    padding: 0px 5px;
  }
`;
const ColWrapper = styled(Col)`
  @media(max-width: 767px){
    display: none;
  }
`;
const Container = styled.div`
  padding-top: 5rem;
  min-height: 80vh;
  display: flex;
  justify-content: center;
  width: 99%;
`;
const FeedWrapper = styled(Col)`
  width: 100%;
`;
const CategoryWrapper = styled(FormControl)`
  width: 105px;
  margin: 0 1rem !important;
`;
const InputLabelWrapper = styled(InputLabel)`
  color: #f50057 !important;
`;

const Categories = ['Entertainment', 'Fashion', 'Food', 'Literature', 'Politics', 'Science', 'Technology', 'Travel'];

class Feed extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      newPost: '',
      newPostList: [],
      isClicked: false,
      category: '',
      error: false,
      errorMessgae: '',
    }
  }

  componentDidMount() {
    const {actions, loggedIn} = this.props;

    if(!loggedIn){
      Router.pushRoute('login');
    }
    actions.fetchFeed();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {loggedIn, newPostData, newPostSuccess, newPostPending} = this.props;
    const {isClicked, newPostList} = this.state;

    if(typeof loggedIn!== 'undefined' && !loggedIn){
      Router.pushRoute('login');
    }

    if(isClicked && !newPostPending && newPostSuccess && newPostData){
      this.setState({
        newPostList: [
          {
            'post': newPostData,
            'comments': [],
          },
            ...newPostList,
        ],
        isClicked: false,
      })
    }
  }

  handleNewPost = (userId) => {
    const {actions} = this.props;
    const {newPost, category} = this.state;
    if(newPost === ''){
      this.setState({
        error: true,
        errorMessage: 'Please write something',
      });
      return;
    }
    if(category === ''){
      this.setState({
        error: true,
        errorMessage: 'Please select category of your post',
      });
      return;
    }
    actions.fetchNewPostDetails(userId, newPost, category);
    this.setState({
      newPost: '',
      category: '',
      error: false,
      isClicked: true,
    });
  };

  handleCategorySelect = (e) => {
    this.setState({
      category: e.target.value,
    })
  };

  onNewPostChange = (e) => {
    if(e){
      this.setState({
        newPost: e.target.value,
      });
    }
  };

  render() {
    const {pending, success, feed} = this.props;
    const {userReducer: {user: currUser}} = store.getState();
    const {newPost, newPostList, category, error, errorMessage} = this.state;
    const currFeed = [
      ...newPostList,
      ...feed
    ];

    return(
        <Container>
          {!pending && success ?
              <RowWrapper>
                <ColWrapper sm={4}>
                  <Profile />
                </ColWrapper>
                <FeedWrapper sm={8}>
                  <Box ml={2.5} mr={2.5} pb={1} borderBottom={1}>
                    <TextField
                        id="outlined-textarea"
                        label="Create a post...."
                        multiline
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        value={newPost}
                        onChange={e => this.onNewPostChange(e)}
                    />
                    <FlexView justify="space-between" alignItems="flex-end">
                      <Typography variant="subtitle1" color="secondary" gutterBottom>
                        Write on PostBook
                      </Typography>
                      <FlexView>
                        <CategoryWrapper>
                          <InputLabelWrapper margin htmlFor="outlined-age-native-simple">
                            Category
                          </InputLabelWrapper>
                          <Select
                              native
                              value={category}
                              onChange={(e) => this.handleCategorySelect(e)}
                          >
                            <option value="" disabled>

                            </option>
                            {Categories.map((text) => (
                                <option value={text} key={text}>{text}</option>
                            ))}
                          </Select>
                        </CategoryWrapper>
                        <Button variant="outlined" color="secondary" onClick={() => this.handleNewPost(currUser.id)}>
                          Post
                        </Button>
                      </FlexView>
                    </FlexView>
                    {error &&
                      <Fragment>
                        <br/>
                        <Typography variant="caption" color="error">{errorMessage}</Typography>
                      </Fragment>
                    }
                  </Box>
                  {currFeed.map(obj => (
                    <PostCard postObj={obj} key={obj.post.post_text}/>
                  ))}
                </FeedWrapper>
              </RowWrapper>
              :
              <Typography variant="body1" >Loading...</Typography>
          }
        </Container>
    )
  }
}


const mapStateToProps = (state) => ({
  feed: getFeed(state),
  error: getError(state),
  pending: getStatus(state),
  success: getSuccess(state),
  newPostData: getNewPost(state),
  newPostSuccess: getNewPostSuccess(state),
  newPostError: getNewPostError(state),
  newPostPending: getNewPostStatus(state),
});

export default connect(
    mapStateToProps,
    dispatch => ({
      actions: bindActionCreators({fetchFeed, fetchNewPostDetails}, dispatch)
    }),
)(Feed);