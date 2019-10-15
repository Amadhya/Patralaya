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
  padding: 0rem 18rem;
  display: block;
  @media(max-width: 1024px){
    padding: 0px 5px;
  }
`;
const Container = styled.div`
  padding-top: 5rem;
  min-height: 80vh;
  width: 99%;
`;

class Profile extends PureComponent {
  constructor(props){
    super(props);
  }

  static async getInitialProps(context){
    const {query} = context;
    return {
      query
    };
  }

  componentDidMount() {
    const {actions, loggedIn, query: {id}} = this.props;

    if(!loggedIn){
      Router.pushRoute('login');
    }

    actions.fetchProfileFeed(id);
  }

  render() {
    const {pending, success, feed, query: {id}} = this.props;

    return(
        <Container>
          {!pending && success ?
              <RowWrapper>
                  <Details user_id={id}/>
                  {feed.map(obj => (
                      <PostCard postObj={obj} key={obj.post.post_text}/>
                  ))}
                  {feed.length === 0 &&
                    <Typography variant="body1" color="textSecondary" align="center">No post by you yet...</Typography>
                  }
              </RowWrapper>
              :
              <Typography variant="body1"  align="center">Loading...</Typography>
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
)(Profile);