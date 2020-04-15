import React, {PureComponent, Fragment} from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'next/router';
import {
  Typography, Button, TextField, Box, InputLabel, FormControl, Select, Avatar, IconButton
} from '@material-ui/core';
import styled from 'styled-components';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import {Row, Col, FlexView, Separator, Container} from "../../../components/layout";
import Content from "./content";
import CommentsSection from "./comments_section";
import fetchBlog , {getSuccess, getError, getStatus, getBlog, getBlogComments, getBlogLikes} from "../../../container/blog/saga";

const AvatarWrapper = styled(Avatar)`
  background-color: #f44336 !important;
  margin-right: 0.5rem;
`;
const ColWrapper = styled(Col)`
  display: flex !important;
  justify-content: flex-end;
`;

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function dateTime (t){
  let newDate=new Date(t);

  let date = newDate.getDate();
  let month = newDate.getMonth();
  let year = newDate.getFullYear();
  let hour = newDate.getHours();
  let min = newDate.getMinutes(); 

  return `${monthNames[month]} ${date}, ${year} at ${hour}:${min} (IST)`
}

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
    const {blog=null, blogComments, likes, loggedIn} = this.props;

    return(
        <Container>
          <Col smOffset={2} sm={8} xs={12}>
            {blog && <Content blog={blog} likes={likes} loggedIn={loggedIn}/>}
            {blog && <CommentsSection blogId={blog.id} blogComments={blogComments} loggedIn={loggedIn}/>}
          </Col>
        </Container>
    )
  }
}


const mapStateToProps = (state) => ({
  blog: getBlog(state),
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