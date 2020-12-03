import React, { Component } from "react";
import { connect } from "react-redux";
import mapStoreToProps from "../../redux/mapStoreToProps";
import {
  Button,
  Row,
  Col,
  Container,
  Table,
  FormGroup,
  Form,
} from "react-bootstrap";

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
      <>
        <Container>
          <br />
          <br />
          <Table style={{ width: "350px" }} id="table-container" bordered hover>
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>
                  <h3>Admin Login</h3>
                  {this.props.store.errors.loginMessage && (
                    <h3 className="alert" role="alert">
                      {this.props.store.errors.loginMessage}
                    </h3>
                  )}
                </th>
              </tr>
            </thead>

            <tbody>
              <td>
                <form className="" onSubmit={this.login}>
                  <div style={{ textAlign: "center" }}>
                    <label htmlFor="username">
                      Username:
                      <Form.Group
                        onChange={this.handleInputChangeFor("username")}
                        controlId="exampleForm.ControlTextarea1a"
                      >
                        <Form.Control
                          type="text"
                          name="username"
                          rows={1}
                          value={this.state.username}
                          required
                        />
                      </Form.Group>
                    </label>
                    <label htmlFor="password">
                      Password:
                      <Form.Group
                        onChange={this.handleInputChangeFor("password")}
                        controlId="exampleForm.ControlTextarea1a"
                      >
                        <Form.Control
                          type="password"
                          name="password"
                          rows={1}
                          value={this.state.password}
                          required
                        />
                      </Form.Group>
                    </label>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <Button
                      onSubmit={this.login}
                      className="btn"
                      type="submit"
                      value="Log In"
                    >
                      Log In
                    </Button>
                  </div>
                </form>
                <br />
              </td>
            </tbody>
          </Table>
        </Container>
      </>
    );
  }
}

export default connect(mapStoreToProps)(LoginForm);
