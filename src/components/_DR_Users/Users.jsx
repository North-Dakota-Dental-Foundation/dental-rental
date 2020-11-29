import React, { Component } from "react";
import { connect } from 'react-redux';
import { Modal, Button } from "react-bootstrap";

import "./Users.css";

import UserItem from './UserItem';

class Users extends Component {
  state = {
    firstname: '',
    lastname: '',
    username: '',
    phonenumber: 'N/A',
    password: '',
    super_admin: false,
    addUser: false,
  };

  componentDidMount() {
    this.getUsers();
  };

  getUsers = () => {
    this.props.dispatch({
      type: 'FETCH_USERS',
    });
  };

  resetState = () => this.setState({
    firstname: '',
    lastname: '',
    username: '',
    phonenumber: 'N/A',
    password: '',
    super_admin: false,
    addUser: false,
  });

  onSubmit = () => {
    this.props.dispatch({
      type: 'REGISTER',
      payload: {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        username: this.state.username,
        phonenumber: this.state.phonenumber,
        password: this.state.password,
      },
    })
    this.resetState();
    this.getUsers();
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
      <div id='users'>

        <h1 id="welcome">Logged in as: {this.props.user.username}</h1>
        <p>Your ID is: {this.props.user.id}</p>

        <h3>All Users</h3>

        <Button onClick={this.openAddUserModal}>Add User</Button>

        <br /> <br />

        <table id='userTable'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Delete User</th>
            </tr>
          </thead>

          <tbody>

            {this.props.users !== undefined && this.props.users.map((user) => {
              return (
                <UserItem user={user} key={user.id} />
              )
            })}

          </tbody>
        </table>

        <Modal show={this.state.addUser} onHide={this.closeAddUserModal}>
          <Modal.Header>
            <Modal.Title>Add User</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div id='addUserInputs'>
              <input type='text' onChange={this.handleChange} name='firstname' placeholder='First Name' className='addUserInput' />
              <input type='text' onChange={this.handleChange} name='lastname' placeholder='Last Name' className='addUserInput' />
              <input type='text' onChange={this.handleChange} name='username' placeholder='Email' className='addUserInput' />
              <input type='text' onChange={this.handleChange} name='phonenumber' placeholder='Phone Number' className='addUserInput' />
              <input type='password' onChange={this.handleChange} name='password' placeholder='Password' className='addUserInput' />
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.resetState} variant='secondary'>Cancel</Button>
            <Button onClick={this.onSubmit}>Submit</Button>
          </Modal.Footer>
        </Modal>

      </div>
    );
  }
}

const mapStoreToProps = (reduxState) => ({
  users: reduxState.userPageReducer,
  user: reduxState.user
});

export default connect(mapStoreToProps)(Users);