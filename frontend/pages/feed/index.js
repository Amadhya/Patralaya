import React, {PureComponent} from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Typography, Button, TextField, Box} from '@material-ui/core';
import styled from 'styled-components';

import {Row, Col, FlexView} from "../../components/layout";
import {Router} from "../../routes";
import {store} from "../_app";
import fetchFeed , {getSuccess, getError, getStatus, getFeed} from "../../container/feed/saga";
import fetchNewPostDetails, {getNewPost, getNewPostStatus, getNewPostSuccess, getNewPostError} from "../../container/new-post/saga";
import Profile from "./profile";
import PostCard from "./post-card";

const RowWrapper = styled(Row)`
  padding: 0px 15rem;
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
  align-items: center;
  display: flex;
  justify-content: center;
`;

class Feed extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      newPost: '',
      newPostList: [],
      isClicked: false,
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
    const {newPost} = this.state;
    actions.fetchNewPostDetails(userId, newPost);
    this.setState({
      newPost: '',
      isClicked: true,
    });
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
    const {newPost, newPostList} = this.state;
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
                <Col xs={12} sm={8}>
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
                      <Button variant="outlined" color="secondary" onClick={() => this.handleNewPost(currUser.id)}>
                        Post
                      </Button>
                    </FlexView>
                  </Box>
                  {currFeed.map(obj => (
                    <PostCard postObj={obj} key={obj.post.post_text}/>
                  ))}
                </Col>
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