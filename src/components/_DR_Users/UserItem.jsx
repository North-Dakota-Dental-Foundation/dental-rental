import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import swal from "sweetalert";

class UserItem extends Component {
  state = {
    deleteSuperAdmin: false,
  };

  handleDeleteUser = () => {
    swal({
      title: "Are you sure?",
      text:
        "Once this user is deleted, they will have to be added again to the system.",
      icon: "warning",
      buttons: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          swal(`${this.props.user.username} successfully deleted.`, {
            icon: "success",
          });
          this.props.dispatch({
            type: "DELETE_USER",
            payload: this.props.user.id,
          });
          console.log(`Deleting user with ID ${this.props.user.id}`);
        } else {
          swal(`${this.props.user.username} has NOT been deleted.`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // handleDeleteAdmin = () => {
  //     this.setState({
  //         deleteSuperAdmin: true,
  //     })
  // };

  // handleDontDeleteSuperAdmin = () => {
  //     this.setState({
  //         deleteSuperAdmin: false,
  //     })
  // };

  render() {
    return (
      <>
        <tr>
          {!this.props.user.super_admin && (
            <>
              <td>
                {this.props.user.firstname} {this.props.user.lastname}
              </td>
              <td>{this.props.user.username}</td>
              <td>{this.props.user.phonenumber}</td>
              <td>
                <Button onClick={this.handleDeleteUser} variant="danger">
                  Delete
                </Button>
              </td>
            </>
          )}
        </tr>
      </>
    );
  }
}

export default connect()(UserItem);
