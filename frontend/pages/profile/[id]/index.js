import React, {PureComponent} from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Typography} from '@material-ui/core';
import styled from 'styled-components';

import {Row, Col, Container} from "../../../components/layout";
import fetchProfileBlogFeed , {getSuccess, getError, getStatus, getProfileBlogFeed, getUserProfile} from "../../../container/personal-blog/saga";
import Details from "./detail";
import BlogCard from "../../blog_feed/blog-card";

class Profile extends PureComponent {

  static async getInitialProps(context){
    const {query} = context;
    return {
      query
    };
  }

  componentDidMount() {
    const {actions, query: {id}} = this.props;

    actions.fetchProfileBlogFeed(id);
  }

  render() {
    const {pending, success, blogFeed, userProfile} = this.props;

    return(
        <Container reverse>
          {!pending && success ?
              <Row>
                <Col lgOffset={1} lg={3} md={4} sm={12} xs={12}>
                  <Details userProfile={userProfile}/>
                </Col>
                <Col lg={7} md={8} sm={12} xs={12}>
                  {blogFeed.map(obj => (
                    <BlogCard blogObj={obj} key={obj.blog.id}/>
                  ))}
                  {blogFeed.length === 0 &&
                    <Typography variant="body1" color="textSecondary" align="center">No blog by you yet...</Typography>
                  }
                </Col>
              </Row>
              :
              <Typography variant="body1"  align="center">Loading...</Typography>
          }
        </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  blogFeed: getProfileBlogFeed(state),
  userProfile: getUserProfile(state),
  error: getError(state),
  pending: getStatus(state),
  success: getSuccess(state),
});

export default connect(
    mapStateToProps,
    dispatch => ({
      actions: bindActionCreators({fetchProfileBlogFeed}, dispatch)
    }),
)(Profile);