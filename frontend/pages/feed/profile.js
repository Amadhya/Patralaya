import React, {PureComponent} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Avatar, Card, CardContent, Typography} from "@material-ui/core";
import styled from "styled-components";

import fetchUserDetails , {getUserDetails, getSuccess, getStatus, getError} from "../../container/current-user/saga";

const AvatarWrapper = styled(Avatar)`
  margin: auto;
  background-color: #f44336 !important;
`;
const CardWrapper = styled(Card)`
  padding: 10px;
`;

class Profile extends PureComponent {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    const {actions} = this.props;

    actions.fetchUserDetails(localStorage.getItem('user_id'));
  }

  render() {
    const {currUser, pending, success} = this.props;
    console.log(this.props);
    return(
      <div>
        {!pending && success && (
            <CardWrapper>
              <AvatarWrapper aria-label="name" sizes="large">
                {currUser.first_name[0]}
              </AvatarWrapper>
              <CardContent>
                <Typography variant="h5" color="textPrimary" align="center" gutterBottom>
                  {currUser.first_name}
                  &nbsp;
                  {currUser.last_name}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary" align="center">
                  date joined:&nbsp;{new Date(currUser.date_joined).toDateString()}
                </Typography>
              </CardContent>
            </CardWrapper>
        )}
      </div>
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
)(Profile);