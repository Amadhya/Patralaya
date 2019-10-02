import React, {PureComponent} from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Typography} from '@material-ui/core';
import styled from 'styled-components';

import {Row} from "../../components/layout";
import fetchProfileFeed , {getSuccess, getError, getStatus, getProfileFeed} from "../../container/personal-feed/saga";
import Details from "./detail";
import PostCard from "../feed/post-card";

const RowWrapper = styled(Row)`
  padding: 1rem 18rem;
  @media(max-width: 1024px){
    padding: 0px 5px;
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
  }

  componentDidMount() {
    const {actions, loggedIn} = this.props;
    const userId = localStorage.getItem('token');

    if(!loggedIn){
      Router.pushRoute('login');
    }

    actions.fetchProfileFeed();
  }

  render() {
    const {pending, success, feed} = this.props;

    return(
        <Container>
          {!pending && success ?
              <RowWrapper>
                  <Details />
                  {feed.map(obj => (
                      <PostCard postObj={obj} key={obj.post.post_text}/>
                  ))}
              </RowWrapper>
              :
              <Typography variant="body1" >Loading........................................................................</Typography>
          }
        </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  feed: getProfileFeed(state),
  error: getError(state),
  pending: getStatus(state),
  success: getSuccess(state),
});

export default connect(
    mapStateToProps,
    dispatch => ({
      actions: bindActionCreators({fetchProfileFeed}, dispatch)
    }),
)(Feed);