import React, {PureComponent, Fragment} from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'next/router';
import {Typography} from '@material-ui/core';
import styled from 'styled-components';

import {Row, Col, FlexView} from "../../components/layout";
import fetchBlogFeed , {getSuccess, getError, getStatus, getBlogFeed} from "../../container/blog_feed/saga";
import BlogCard from "./blog-card";

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

class BlogFeed extends PureComponent {

  static async getInitialProps(context){
    const {query} = context;
    return {
      query
    }
  }

  componentDidMount() {
    const {actions, query} = this.props;
    const filter = query ? query.filter : '';

    actions.fetchBlogFeed(filter);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    const {actions, query} = this.props;
    const currFilter = query ? query.filter : '';
    const prevFilter = prevProps.query ? prevProps.query.filter : '';

    if(currFilter !== prevFilter){
      actions.fetchBlogFeed(currFilter);
    }
  }

  render() {
    const {pending, success, feed, error, query} = this.props;
    const filter = query ? query.filter : '';

    return(
        <Container>
          {!pending && success ?
            <FeedWrapper sm={8} xs={12}>
              {feed.map(obj => (
                <BlogCard blogObj={obj.blog} key={obj.blog.id}/>
              ))}
              {typeof error !== "undefined" && error && (
                <Typography variant="body1" color="textSecondary" align="center">There was some error loading blogs.</Typography>
              )}
              {feed.length === 0 &&
                <Fragment>
                  <br/>
                  <Typography variant="body1" color="textSecondary" align="center">No blog yet {filter && "for "+filter+" category"}...</Typography>
                </Fragment>
              }
            </FeedWrapper>
            :
            <Typography variant="body1" >Loading...</Typography>
          }
        </Container>
    )
  }
}


const mapStateToProps = (state) => ({
  feed: getBlogFeed(state),
  error: getError(state),
  pending: getStatus(state),
  success: getSuccess(state),
});

export default withRouter(connect(
    mapStateToProps,
    dispatch => ({
      actions: bindActionCreators({fetchBlogFeed}, dispatch)
    }),
)(BlogFeed));