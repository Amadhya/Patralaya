import React, {PureComponent} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Avatar, Card, CardContent, Typography} from "@material-ui/core";
import styled from "styled-components";
import {Row, Col} from "../../components/layout";

import fetchUserDetails , {getUserDetails, getSuccess, getStatus, getError} from "../../container/current-user/saga";

const AvatarWrapper = styled(Avatar)`
  background-color: #f44336 !important;
  width: 70px !important;
  height: 70px !important;
  font-size: 35px !important;
  margin-bottom: 10px;
`;
const CardWrapper = styled(Card)`
  padding: 20px;
  @media(max-width: 767px){
    background: url(https://www.thedailydesigns.com/wp-content/uploads/2019/01/color-splash-1024x514.png);
    background-size: 100% 50%;
    background-repeat: no-repeat;
  }
`;
const Wrapper = styled.div`
  padding: 20px;
`;
const ColWrapper = styled(Col)`
  margin-right: 2rem;
`;

class Details extends PureComponent {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    const {actions, user_id} = this.props;

    actions.fetchUserDetails(user_id);
  }

  render() {
    const {currUser, pending, success} = this.props;

    return(
        <Wrapper>
          {!pending && success && (
              <CardWrapper>
                <Row>
                  <ColWrapper xs={12} sm={1}>
                    <AvatarWrapper aria-label="name" sizes="large">
                      {currUser.first_name[0]}
                    </AvatarWrapper>
                  </ColWrapper>
                  <Col sm={10}>
                    <Typography variant="h5" color="textPrimary" gutterBottom>
                      {currUser.first_name}
                      &nbsp;
                      {currUser.last_name}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      date joined:&nbsp;{new Date(currUser.date_joined).toDateString()}
                    </Typography>
                  </Col>
                </Row>
              </CardWrapper>
          )}
        </Wrapper>
    )
  }
}

const mapStateToProps = (state) => ({
  error: getError(state),
  pending: getStatus(state),
  success: getSuccess(state),
  currUser: getUserDetails(state),
});

export default connect(
    mapStateToProps,
    dispatch => ({
      actions: bindActionCreators({fetchUserDetails}, dispatch)
    }),
)(Details);