import React, { Component } from 'react';

class UserItem extends Component {

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
                    <td><button>Delete</button></td>
                </tr>

            </>
        )
    }
}

export default UserItem;