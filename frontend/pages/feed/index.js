import React, {PureComponent, Fragment} from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'next/router';
import {Typography, Button, TextField, Box, InputLabel, FormControl, Select} from '@material-ui/core';
import styled from 'styled-components';

import {Row, Col, FlexView} from "../../components/layout";
import {Router} from "../../routes";
import fetchFeed , {getSuccess, getError, getStatus, getFeed} from "../../container/feed/saga";
import fetchNewPostDetails, {getNewPost, getNewPostStatus, getNewPostSuccess, getNewPostError} from "../../container/new-post/saga";
import Profile from "./profile";
import PostCard from "./post-card";

const RowWrapper = styled(Row)`
  padding: 0px 15rem;
  width: 99%;
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
    }
  }

  static async getInitialProps(context){
    const {query} = context;

    return {
      query
    }
  }

  componentDidMount() {
    const {actions, loggedIn, query: {filter = ''}} = this.props;

    if(!loggedIn){
      Router.pushRoute('login');
    }
    actions.fetchFeed(filter);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {loggedIn, newPostData, newPostSuccess, newPostPending, actions} = this.props;
    const {isClicked, newPostList} = this.state;

    if(typeof loggedIn!== 'undefined' && !loggedIn){
      Router.pushRoute('login');
    }

    if(prevProps.query && this.props.query && prevProps.query.filter !== this.props.query.filter){
      actions.fetchFeed(this.props.query.filter);
      this.setState({
        newPostList: [],
      })
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

  handleNewPost = () => {
    const {actions} = this.props;
    const {newPost, category} = this.state;
    actions.fetchNewPostDetails(newPost, category);
    this.setState({
      newPost: '',
      category: '',
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
    const {pending, success, feed, newPostPending, newPostError, query: {filter = ''}} = this.props;
    const {newPost, newPostList, category} = this.state;
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
                          <InputLabelWrapper margin="dense" htmlFor="outlined-age-native-simple">
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
                        <Button disabled={!(category && newPost)} variant="outlined" color="secondary" onClick={() => this.handleNewPost()}>
                          Post
                        </Button>
                      </FlexView>
                    </FlexView>
                    {!newPostPending && newPostError &&
                      <Fragment>
                        <br/>
                        <Typography variant="caption" color="error">{newPostError}</Typography>
                      </Fragment>
                    }
                  </Box>
                  {currFeed.map(obj => (
                    <PostCard postObj={obj} key={obj.post.post_text}/>
                  ))}
                  {currFeed.length === 0 &&
                    <Fragment>
                      <br/>
                      <Typography variant="body1" color="textSecondary" align="center">No post yet {filter && "for "+filter+" category"}...</Typography>
                    </Fragment>
                  }
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

export default withRouter(connect(
    mapStateToProps,
    dispatch => ({
      actions: bindActionCreators({fetchFeed, fetchNewPostDetails}, dispatch)
    }),
)(Feed));