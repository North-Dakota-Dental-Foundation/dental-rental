import React, { Component } from "react";
import { connect } from 'react-redux';
import { Modal } from "react-bootstrap";
import { Button, Table } from "react-bootstrap";
import swal from "sweetalert";
import { Row, Col } from "react-bootstrap";

import UserItem from './UserItem';

class Users extends Component {
  state = {
    firstname: '',
    lastname: '',
    username: '',
    phonenumber: '',
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
    phonenumber: '',
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
        super_admin: this.state.super_admin,
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
    console.log(this.state);
  };

  render() {

    console.log(this.props.users)

    return (
      <>
        <h1>All Users</h1>

        <br />

        <button onClick={this.openAddUserModal}>Add User</button>

        <Modal show={this.state.addUser} onHide={this.closeAddUserModal}>
          <Modal.Header>
            <Modal.Title>Add User</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <input type='text' onChange={this.handleChange} name='firstname' placeholder='First Name' />
            <input type='text' onChange={this.handleChange} name='lastname' placeholder='Last Name' />
            <input type='text' onChange={this.handleChange} name='username' placeholder='Email' />
            <input type='text' onChange={this.handleChange} name='phonenumber' placeholder='Phone Number' />
            <input type='text' onChange={this.handleChange} name='password' placeholder='Password' />
            <select onChange={this.handleChange} name='super_admin'>
              <option>False</option>
              <option>True</option>
            </select>
          </Modal.Body>

          <Modal.Footer>
            <button onClick={this.resetState}>Cancel</button>
            <button onClick={this.onSubmit}>Submit</button>
          </Modal.Footer>
        </Modal>





        <br />

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Super Admin</th>
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
      </>
    );
  }
}

const mapStoreToProps = (reduxState) => ({
  users: reduxState.userPageReducer
});

export default connect(mapStoreToProps)(Users);