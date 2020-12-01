import React, { Component } from "react";
import { connect } from "react-redux";
import mapStoreToProps from "../../redux/mapStoreToProps";
import LoginForm from "../LoginForm/LoginForm";

class LoginPage extends Component {
  render() {
    return (
      <div>
        <center>
          <LoginForm />
        </center>
      </div>
    );
  }
}

export default connect(mapStoreToProps)(LoginPage);
