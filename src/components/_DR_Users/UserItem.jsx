import React, { Component } from 'react';
import { connect } from 'react-redux';

class UserItem extends Component {

    handleDeleteUser = () => {
        console.log(`Deleting user with ID ${this.props.user.id}`);
        this.props.dispatch({ type: 'DELETE_USER', payload: this.props.user.id, });
    };

    render() {

        console.log(this.props);

        const super_admin = String(this.props.user.super_admin) // Convert "super_admin" boolean to a string

        return (
            <>

                <tr>
                    <td>{this.props.user.firstname} {this.props.user.lastname}</td>
                    <td>{this.props.user.username}</td>
                    <td>{this.props.user.phonenumber}</td>
                    <td>{super_admin}</td>
                    <td><button onClick={this.handleDeleteUser}>Delete</button></td>
                </tr>

            </>
        )
    }
}

export default connect() (UserItem);