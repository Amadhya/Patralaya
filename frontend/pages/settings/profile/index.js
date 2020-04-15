import React, {PureComponent, Fragment} from "react";
import {Typography} from "@material-ui/core";
import styled from "styled-components";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import {FlexView, Separator, Col} from "../../../components/layout";
import TextFieldInput from "../../../components/textfield";
import {ButtonLayout} from "../../../components/button";
import fetchUserDetails, {getError, getStatus, getSuccess, getUserDetails} from "../../../container/current-user/saga";
import fetchProfileEdit, {getError as getEditError, getStatus as getEditStatus, getSuccess as getEditSuccess} from "../../../container/edit_profile/saga";

const SubTitleWrapper = styled(Typography)`
  color: #1488CC !important;
`;
const TypographySuccess = styled(Typography)`
  color: #19ce19;
`;
const Wrapper = styled.div`
  width: 100%;
`;

const Form = [
  {
    id: 'first_name',
    label: 'First Name',
    type: 'text',
    name: 'first name',
    autoFocus: false,
  },
  {
    id: 'last_name',
    label: 'Last Name',
    type: 'text',
    name: 'last name',
    autoFocus: false,
  },
  {
    id: 'email',
    label: 'Email',
    type: 'email',
    name: 'email',
    autoFocus: false,
  },
];

class General extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      form: {},
      isClicked: false,
    };
  }

  componentDidMount(){
    const {actions} = this.props;
    actions.fetchUserDetails();
  }

  componentDidUpdate(){
    const {success, pending} = this.props;
    const {isClicked} = this.state;

    if(isClicked && typeof pending !== "undefined" && typeof success !== "undefined" && !pending && success){
      this.setState({
        isClicked: false,
      });
    }
  }

  static getDerivedStateFromProps(props, state){
    const {userDetails} = props;
    const {form} = state;
    
    if(typeof userDetails!=="undefined" && Object.entries(form).length === 0 && form.constructor === Object){
      return {
        form: {
          ...userDetails,
        }
      }
    }

    return {...state}
  }

  handleChange = (id,val) => {
    const {form} = this.state;
    
    let temp = {};

    temp[id]=val;
    this.setState({
      form: {
        ...form,
        ...temp,
      }
    });
  };

  onUpdate = () => {
    const {form} = this.state;
    const {actions} = this.props;

    actions.fetchProfileEdit(form);

    this.setState({
      isClicked: true,
    });
  };

  renderDetails = () => {
    const {editError, editPending, editSuccess} = this.props;
    const {form, isClicked} = this.state;

    return (
      <Fragment>
        {Form.map(obj => (
          <div key={obj.id}>
            <SubTitleWrapper variant="body1">{obj.label}</SubTitleWrapper>
            <TextFieldInput
              id={obj.id}
              label={obj.label}
              type={obj.type}
              name={obj.name}
              value={form[obj.id]}
              autoComplete={obj.autoComplete}
              autoFocus={obj.autoFocus}
              onChange={(id,v) => this.handleChange(id,v)}
              fullWidth
            />
            <Separator height={2}/>
          </div>
        ))}
        {isClicked && typeof editPending !== undefined && typeof editSuccess !== undefined && !editPending && editSuccess && editError === null && (
          <Fragment>
            <TypographySuccess variant="caption">Successfully updated!</TypographySuccess>
            <Separator height={2}/>
          </Fragment>
        )}
        {isClicked && editError !== null && (
          <Fragment>
            <Typography color="error" variant="caption">{editError}</Typography>
            <Separator height={2}/>
          </Fragment>
        )}
        <ButtonLayout variant="contained" color="primary" onClick={() => this.onUpdate()}>Update Profile</ButtonLayout>
        <Separator height={2}/>
      </Fragment>
    )
  }

  renderLoading = () => (
    <FlexView alignItcoems="center" justify="center">
      <Typography variant="body1">Loading...</Typography>
    </FlexView>
  )

  render(){
    const {pending, success} = this.props;

    return (
      <Wrapper>
        {typeof pending !== undefined && typeof success !== undefined && !pending && success ? this.renderDetails() : this.renderLoading()}
      </Wrapper>
    )
  }
}

const mapStateToProps = (state) => ({
  error: getError(state),
  pending: getStatus(state),
  success: getSuccess(state),
  userDetails: getUserDetails(state),
  editError: getEditError(state),
  editSuccess: getEditSuccess(state),
  editPending: getEditStatus(state),
});

export default connect(
    mapStateToProps,
    dispatch => ({
      actions: bindActionCreators({fetchUserDetails, fetchProfileEdit}, dispatch)
    })
)(General);