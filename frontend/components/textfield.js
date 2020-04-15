import React from "react";
import {TextField} from '@material-ui/core';
import styled from 'styled-components';

const TextFieldWrapper = styled(TextField)`
  @media(min-width: 769px){
    width: 75% !important;
  }
`;
class TextFieldInput extends React.PureComponent{

  handleChange = (e) => {
    const {onChange, id} = this.props;
    if(onChange){
      onChange(id,e.target.value);
    }
  };

  render() {
    const {id, label, type, name, autoComplete, value, autoFocus, error=false} = this.props;

    return(
      <TextFieldWrapper
        id={id}
        label={label}
        type={type}
        value={value}
        name={name}
        autoComplete={autoComplete}
        margin="normal"
        variant="outlined"
        autoFocus={autoFocus}
        required
        fullWidth
        error={error}
        onChange={this.handleChange}
      />
    )
  }
}

export default TextFieldInput;