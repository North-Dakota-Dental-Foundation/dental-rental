import React, { Component } from 'react';

class Users extends Component {

    state = {
        addUser: false,
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        return (

            <>

                <h1>All Users</h1>

                <br />

                <button>Add User</button>

                <br />

                <table>

                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Delete User</th>
                    </tr>

                    <tr>
                        <td>Sonic T. Hedgehog</td>
                        <td>GottaGoFast@hotmail.com</td>
                        <td>1-218-SPEED</td>
                        <td><button>Delete User</button></td>
                    </tr>

                </table>

            </>

        );
    };
};

export default Users;