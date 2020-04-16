import React, {PureComponent} from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'next/router';
import {Typography} from "@material-ui/core";

import {Col, Container} from "../../../components/layout";
import Content from "./content";
import CommentsSection from "./comments_section";
import fetchBlog , {getSuccess, getError, getStatus, getBlog, getBlogComments, getBlogLikes, getTags} from "../../../container/blog/saga";

class Blog extends PureComponent {

  static async getInitialProps(context){
    const {query} = context;
    return {
      query
    }
  }

  componentDidMount() {
    const {actions, query: {id}} = this.props;
    
    actions.fetchBlog(id);
  }

  render() {
    const {blog=null, blogComments, likes, tags, loggedIn} = this.props;

    if(!blog)
      return <Typography variant="body1" >Loading...</Typography>

    return(
        <Container>
          <Col smOffset={2} sm={8} xs={12}>
            {blog && <Content blog={blog} likes={likes} tags={tags} loggedIn={loggedIn}/>}
            {blog && <CommentsSection blogId={blog.id} blogComments={blogComments} loggedIn={loggedIn}/>}
          </Col>
        </Container>
    )
  }
}


const mapStateToProps = (state) => ({
  blog: getBlog(state),
  tags: getTags(state),
  blogComments: getBlogComments(state),
  likes: getBlogLikes(state),
  error: getError(state),
  pending: getStatus(state),
  success: getSuccess(state),
});

export default withRouter(connect(
    mapStateToProps,
    dispatch => ({
      actions: bindActionCreators({fetchBlog}, dispatch)
    }),
)(Blog));