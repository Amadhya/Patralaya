import React from "react";
import {TextField} from '@material-ui/core';

class TextFieldInput extends React.PureComponent{

  handleChange = (e) => {
    const { onChange } = this.props;

    if(onChange){
      onChange(e.target.value);
    }
  };

  render() {
    const {id, label, type, name, autoComplete, value, autoFocus} = this.props;

    return(
      <TextField
        id={id}
        label={label}
        type={type}
        value={value}
        name={name}
        autoComplete={autoComplete}
        margin="normal"
        variant="standard"
        autoFocus={autoFocus}
        required
        onChange={this.handleChange}
      />
    )
  }
}

export default TextFieldInput;