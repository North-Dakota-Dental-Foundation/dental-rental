import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Modal,
  Button,
  Container,
  Row,
  Col,
  Table,
  OverlayTrigger,
  Tooltip,
  Form,
  Alert,
} from "react-bootstrap";
import swal from "sweetalert";

import "./Users.css";

import UserItem from "./UserItem";

class Users extends Component {
  state = {
    firstname: "",
    lastname: "",
    username: "", // USERNAME IS EMAIL
    phonenumber: "N/A",
    password: "",

    super_admin: false,
    addUser: false,
  };

  componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {
    this.props.dispatch({
      type: "FETCH_USERS",
    });
  };

  resetState = () =>
    this.setState({
      firstname: "",
      lastname: "",
      username: "", // USERNAME IS EMAIL
      phonenumber: "N/A",
      password: "",
      super_admin: false,
      addUser: false,
    });

  onSubmit = (event) => {
    event.preventDefault(); // Prevents page from reloading, which is a default function for when a (type='submit') is used on a form button

    let phonenumber = this.state.phonenumber; // Take phone number from state
    let arrPhoneNumber = phonenumber.split("-"); // Slice it into an array, sliced by "-"
    phonenumber = arrPhoneNumber.join(""); // Join the array back into one variable for DB

    this.props.dispatch({
      type: "REGISTER",

      payload: {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        username: this.state.username, // USERNAME IS EMAIL
        phonenumber: phonenumber,
        password: this.state.password,
      },
    });

    this.resetState();

    swal({
      title: "User Successfully Added",
      text: `${this.state.username} has been successfully added to the system`,
      icon: "success",
    });
  };

  openAddUserModal = () => this.setState({ addUser: true });
  closeAddUserModal = () => this.setState({ addUser: false });

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    return (
      <>
        <br />
        <div id="users">
          <Row>
            <Col className="text-center">
              <h1 id="form-header">User Management</h1>
            </Col>
          </Row>

          <Alert
            style={{ paddingLeft: "80px", paddingRight: "80px" }}
            variant="light"
          >
            <Row>
              <Col className="text-center">
                Browse through all users, and add new users to the system.
                <br />
                All users will have access too all Dental Rental functionality.
              </Col>
            </Row>
          </Alert>

          <Container>
            <Row>
              <Col style={{ paddingTop: "15px", textAlign: "left" }}>
                <h5 id="welcome">
                  Logged in as: <strong>{this.props.user.username}</strong>
                </h5>
              </Col>
              <Col />
              <Col style={{ textAlign: "right" }}>
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 1000 }}
                  overlay={
                    <Tooltip id="button-tooltip-2">
                      Add a new Admin user to your system.
                    </Tooltip>
                  }
                >
                  <Button id="addUserButton" onClick={this.openAddUserModal}>
                    Add User
                  </Button>
                </OverlayTrigger>
              </Col>
            </Row>
            <Table id="table-container" bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th style={{ textAlign: "center" }}>Delete User</th>
                </tr>
              </thead>

              <tbody>
                {this.props.users !== undefined &&
                  this.props.users.map((user) => {
                    return <UserItem user={user} key={user.id} />;
                  })}
              </tbody>
            </Table>
            <Modal
              className="modal"
              show={this.state.addUser}
              onHide={this.closeAddUserModal}
            >
              <Modal.Header className="modalHeader">
                <Modal.Title className="modalTitle">Add User</Modal.Title>
              </Modal.Header>

              <Modal.Body className="modal-body">
                <div id="addUserInputs">
                  <Row>
                    <Col>
                      <Form.Group
                        onChange={this.handleChange}
                        controlId="exampleForm.ControlTextarea1a"
                      >
                        <Form.Label>First Name:</Form.Label>
                        <Form.Control
                          placeholder=""
                          as="textarea"
                          rows={1}
                          name="firstname"
                          className="addUserInput"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group
                        onChange={this.handleChange}
                        controlId="exampleForm.ControlTextarea1a"
                      >
                        <Form.Label>Last Name:</Form.Label>
                        <Form.Control
                          placeholder=""
                          as="textarea"
                          rows={1}
                          name="lastname"
                          className="addUserInput"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group
                        onChange={this.handleChange}
                        controlId="exampleForm.ControlTextarea1a"
                      >
                        <Form.Label>Username (Email):</Form.Label>
                        <Form.Control
                          placeholder=""
                          as="textarea"
                          rows={1}
                          name="username"
                          className="addUserInput"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group
                        onChange={this.handleChange}
                        controlId="exampleForm.ControlTextarea1a"
                      >
                        <Form.Label>Password:</Form.Label>
                        <Form.Control
                          placeholder=""
                          as="textarea"
                          rows={1}
                          name="password"
                          className="addUserInput"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group
                        onChange={this.handleChange}
                        controlId="exampleForm.ControlTextarea1a"
                      >
                        <Form.Label>Phone Number:</Form.Label>
                        <Form.Control
                          placeholder=""
                          as="textarea"
                          rows={1}
                          name="phonenumber"
                          className="addUserInput"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
                <Row>
                  <Col>
                    <Button
                      onClick={this.onSubmit}
                      variant="primary w-100 text-center"
                    >
                      Submit{" "}
                    </Button>
                  </Col>
                </Row>
              </Modal.Body>

              <Modal.Footer className="modalFooter">
                <Button
                  className="footerButton"
                  variant="secondary w-100 text-center"
                  onClick={this.resetState}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Container>
        </div>
      </>
    );
  }
}

const mapStoreToProps = (reduxState) => ({
  users: reduxState.userPageReducer,
  user: reduxState.user,
});

export default connect(mapStoreToProps)(Users);
