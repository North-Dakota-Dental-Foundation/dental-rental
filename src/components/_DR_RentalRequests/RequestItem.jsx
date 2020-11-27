import React, { Component } from 'react';
import { connect } from 'react-redux';

class RequestItem extends Component {

    state = {
        requestStatus: '',
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    render() {
        console.log(this.props);
        console.log(this.state.requestStatus);
        return (
            <>

                <tr>
                    <td>{this.props.request.point_of_contact}</td>
                    <td>{this.props.request.company}</td>
                    <td>{this.props.request.address}</td>
                    <td>{this.props.request.phone_number}</td>
                    <td>[MISSING: EQUIPMENT]</td>
                    <td>{this.props.request.purpose}</td>
                    <td>[MISSING: APPLIED DATE]</td>
                    <td>{this.props.request.start_date} thru {this.props.request.end_date}</td>
                    <td>
                        <select name='requestStatus' onChange={this.handleChange}>
                            <option name='pending' value='pending'>Pending...</option>
                            <option name='approved' value='approved'>Approved</option>
                            <option name='rejected' value='rejected'>Rejected</option>
                        </select>
                    </td>
                </tr>

            </>
        )
    }
}

export default connect()(RequestItem);