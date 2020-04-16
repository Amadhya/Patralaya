import React, {PureComponent} from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'next/router';
import {Typography} from "@material-ui/core";
import styled from "styled-components";

import {Col, Container, Separator, HrWrapper} from "../../../components/layout";
import BlogCard from "../../blog_feed/blog-card";
import fetchTagBlogs , {getSuccess, getError, getStatus, getBlogs} from "../../../container/tag_blog/saga";

const Wrapper = styled.div`
  margin: 2rem;
  @media(max-width: 769px){
    margin: 1rem 0.5rem;
  }
`;
const TagWrapper = styled(Typography)`
    text-transform: capitalize;
`;

class TabBlogs extends PureComponent {

  static async getInitialProps(context){
    const {query} = context;
    return {
      query
    }
  }

  componentDidMount() {
    const {actions, query: {title}} = this.props;
    
    actions.fetchTagBlogs(title);
  }

  render() {
    const {blogs=null, query: {title}} = this.props;

    if(!blogs)
      return <Typography variant="body1" >Loading...</Typography>

    return(
        <Container>
            <Col smOffset={2} sm={8} xs={12}>
                <Wrapper>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Tag
                    </Typography>
                    <TagWrapper variant="h5">
                        {title}
                    </TagWrapper>
                    <Separator/>
                    <HrWrapper/>
                </Wrapper>
                {blogs.map(blogObj => (
                    <BlogCard blogObj={blogObj} key={blogObj.id}/>
                ))}
                {blogs.length === 0 &&
                    <Fragment>
                    <br/>
                    <Typography variant="body1" color="textSecondary" align="center">No blog yet for {title}...</Typography>
                    </Fragment>
                }
            </Col>
        </Container>
    )
  }
}


const mapStateToProps = (state) => ({
  blogs: getBlogs(state),
  error: getError(state),
  pending: getStatus(state),
  success: getSuccess(state),
});

export default withRouter(connect(
    mapStateToProps,
    dispatch => ({
      actions: bindActionCreators({fetchTagBlogs}, dispatch)
    }),
)(TabBlogs));