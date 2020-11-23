import React, { Component } from "react";
import { connect } from 'react-redux';

import UserItem from './UserItem';

class Users extends Component {
  state = {
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

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {

    console.log(this.props.users)

    return (
      <>
        <h1>All Users</h1>

        <br />

        <button>Add User</button>

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
                <UserItem user={user} key={user.id}/>
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