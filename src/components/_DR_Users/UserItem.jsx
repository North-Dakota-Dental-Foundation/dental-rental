import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from "react-bootstrap";

class UserItem extends Component {

    state = {
        deleteSuperAdmin: false,
    };

    handleDeleteUser = () => {
        console.log(`Deleting user with ID ${this.props.user.id}`);
        this.props.dispatch({ type: 'DELETE_USER', payload: this.props.user.id, });
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
                    {this.props.user.username !== 'SuperAdmin' &&
                        <>

                            <td>{this.props.user.firstname} {this.props.user.lastname}</td>
                            <td>{this.props.user.username}</td>
                            <td>{this.props.user.phonenumber}</td>
                            <td><Button onClick={this.handleDeleteUser} variant='danger'>Delete</Button></td>

                        </>}
                </tr>

            </>
        )
    }
}

export default connect()(UserItem);