import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from "react-bootstrap";

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

                <Modal show={this.state.deleteSuperAdmin} onHide={this.handleDontDeleteSuperAdmin}>
                    <Modal.Header>
                        <Modal.Title>You can't delete the Super Admin</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>
                            Who are you, and what do you think you are doing? Trying to destroy the admin above admins?
                            I don't know who you are but that's not very cash money of you.
                        </p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.handleDontDeleteSuperAdmin} variant='danger'>Cancel</Button>
                    </Modal.Footer>
                </Modal>

            </>
        )
    }
}

export default connect()(UserItem);