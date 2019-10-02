import React, {PureComponent} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Avatar, Card, CardContent, Typography} from "@material-ui/core";
import styled from "styled-components";
import {Row, Col} from "../../components/layout";

import fetchUserDetails , {getUserDetails, getSuccess, getStatus, getError} from "../../container/current-user/saga";

const AvatarWrapper = styled(Avatar)`
  margin: auto;
  background-color: #f44336 !important;
  width: 70px !important;
  height: 70px !important;
  font-size: 35px !important;
  margin-bottom: 10px;
`;
const CardWrapper = styled(Card)`
  padding: 20px;
`;
const Wrapper = styled.div`
  width: 100%;
  padding: 20px;
`;

class Details extends PureComponent {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    const {actions} = this.props;

    actions.fetchUserDetails();
  }

  render() {
    const {currUser, pending, success} = this.props;
    console.log(this.props);
    return(
        <Wrapper>
          {!pending && success && (
              <CardWrapper>
                <Row>
                  <Col>
                    <AvatarWrapper aria-label="name" sizes="large">
                      {currUser.first_name[0]}
                    </AvatarWrapper>
                  </Col>
                  <Col>
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