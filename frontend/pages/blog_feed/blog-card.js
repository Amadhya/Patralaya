import React, {PureComponent} from "react";
import {Avatar, Button, Card, CardContent, CardHeader, Typography} from "@material-ui/core";
import styled from "styled-components";

import {Router} from "../../routes";
import {Row, Col, Separator} from "../../components/layout";
import {ButtonLayout} from "../../components/button";

const CardWrapper = styled(Card)`
  margin: 2rem;
  @media(max-width: 769px){
    margin: 1rem 0.5rem;
  }
`;
const TypographyWrapper = styled(Typography)`
  whiteSpace: pre-line;
`;
const ColWrapper = styled(Col)`
  display: flex !important;
  align-items: flex-end !important;
  @media(min-width: 767px){
    justify-content: flex-end !important;
  }
`;
const ButtonWrapper = styled(ButtonLayout)`
  @media(max-width: 767px){
    padding: 1rem 0 0 0 !important;
  }
`;
const CardContentWrapper = styled(CardContent)`
  padding-top: 0 !important;
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

const handleReadMore = (blog_id) => {
  Router.pushRoute(`/blog/${blog_id}`);
}

const BlogCard = ({blogObj}) => (
    <CardWrapper key={blogObj.blog.blog_text}>
      <CardHeader
          title={
            <Typography variant="h5">
              {blogObj.blog.title}
            </Typography>
          }
          subheader={
            <Typography variant="body1" color="textSecondary">
              {blogObj.blog.category}
            </Typography>
          }
      />
      <CardContentWrapper>
        <TypographyWrapper variant="body1" color="textSecondary" gutterBottom noWrap>
          {blogObj.blog.blog_text}
        </TypographyWrapper>
        <Separator/>
        <Row>
          <Col sm={10} xs={12}>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              By {blogObj.blog.user.first_name+' '+blogObj.blog.user.last_name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {dateTime(blogObj.blog.created_on)}
            </Typography>
          </Col>
          <ColWrapper sm={2} xs={12}>
            <ButtonWrapper color="primary" onClick={() => handleReadMore(blogObj.blog.id)}>
              Read More
            </ButtonWrapper>
          </ColWrapper>
        </Row>
      </CardContentWrapper>
    </CardWrapper>
)

export default BlogCard;