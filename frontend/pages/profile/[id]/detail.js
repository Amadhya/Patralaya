import React, {PureComponent} from "react";
import {Avatar, Card, Typography} from "@material-ui/core";
import styled from "styled-components";

import {Row, Col} from "../../../components/layout";

const AvatarWrapper = styled(Avatar)`
  background-color: #f44336 !important;
  width: 4rem !important;
  height: 4rem !important;
  font-size: 32px !important;
  @media(max-width: 1024px){
    width: 3rem !important;
    height: 3rem !important;
    font-size: 24px !important;
  }
`;
const CardWrapper = styled(Card)`
  padding: 1rem;
  margin-top: 2rem;
  @media(max-width: 769px){
    margin: 0.5rem;
  }
`;

const Details = ({userProfile}) => (
  <CardWrapper>
    <Row alignItems="center">
      <Col xs={3} sm={2} md={2}>
        <AvatarWrapper aria-label="name" sizes="large">
          {userProfile.first_name[0]}
        </AvatarWrapper>
      </Col>
      <Col xs={9} sm={10} mdOffset={1} md={9}>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          {userProfile.first_name}
          &nbsp;
          {userProfile.last_name}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          Date joined:&nbsp;{new Date(userProfile.date_joined).toDateString()}
        </Typography>
      </Col>
    </Row>
  </CardWrapper>
)

export default Details;