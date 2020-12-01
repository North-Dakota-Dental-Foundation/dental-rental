import React, { Component } from "react";
import { connect } from "react-redux";
import mapStoreToProps from "../../redux/mapStoreToProps";
import { Button, Row, Col } from "react-bootstrap";

class LoginForm extends Component {
  state = {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    superAdmin: "",
  };

  login = (event) => {
    event.preventDefault();

    if (this.state.username && this.state.password) {
      this.props.dispatch({
        type: "LOGIN",
        payload: {
          username: this.state.username,
          password: this.state.password,
        },
      });
    } else {
      this.props.dispatch({ type: "LOGIN_INPUT_ERROR" });
    }
  }; // end login

  handleInputChangeFor = (propertyName) => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  };

  render() {
    return (
      <form
        className="formPanel"
        style={{
          backgroundColor: "#9DBCD9",
          borderRadius: "10px",
          width: "27%",
          justifyContent: "center",
          margin: "0 auto",
          display: "block",
          opacity: "0.9",
        }}
        onSubmit={this.login}
      >
        <br />
        <h2>Login</h2>
        {this.props.store.errors.loginMessage && (
          <h3 className="alert" role="alert">
            {this.props.store.errors.loginMessage}
          </h3>
        )}
        <div>
          <label htmlFor="username">
            Username:
            <input
              type="text"
              name="username"
              required
              value={this.state.username}
              onChange={this.handleInputChangeFor("username")}
            />
          </label>
        </div>
        <div>
          <label htmlFor="password">
            Password:
            <input
              type="password"
              name="password"
              required
              value={this.state.password}
              onChange={this.handleInputChangeFor("password")}
            />
          </label>
        </div>
        <div>
          <Button className="btn" type="submit" value="Log In">
            Log In
          </Button>
          <br />
          <br />
        </div>
      </form>
    );
  }
}

export default connect(mapStoreToProps)(LoginForm);
