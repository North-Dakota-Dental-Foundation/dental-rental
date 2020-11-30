import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import axios from 'axios';
import swal from "sweetalert";

class RequestItem extends Component {

    state = {
        requestStatusSubmitted: false,
        selectOptions: [{ value: 'APPROVED', label: 'APPROVED' },
        { value: 'REJECTED', label: 'REJECTED' }],
        currentEquipmentItemStatus: [{ label: `${this.props.request.status}`, value: `${this.props.request.status}` }] //This will be an array of objects [{value: x, label: "y"}]. This is necessary for react-select
    };

    handleChange = (event) => {
        // event is an OBJECT with keys, value and label. eg event = {value: "APPROVED", label: "APPROVED"}
        //PUT request to update the specific request's status
        const changeStatusTo = event.value;
        swal({
            title: `Are you sure you want to update this request?`,
            icon: "warning",
            buttons: true,
        }).then((willUpdate) => {
            if (willUpdate) {
                axios
                    .put(`/api/requests/${this.props.request.id}`, {
                        status: changeStatusTo
                    })
                    .then(() => {
                        this.setState({ currentEquipmentItemStatus: [event] });
                        swal({
                            title: "Update Successful",
                            text: `The request was successfully updated.`,
                            icon: "success",
                            buttons: true,
                        });
                    })
                    .catch((err) => console.log(err));
            } else {
                swal(
                    `The request was NOT updated.`
                );
            }
        });

    };

    render() {
        // console.log('this props!', this.props);
        // n.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
        console.log(typeof this.props.request.phone_number);
        return (
            <>
                <tr>
                    <td>{this.props.request.point_of_contact}</td>
                    <td>{this.props.request.company}</td>
                    <td>{`${this.props.request.address}, ${this.props.request.city}, ${this.props.request.state} ${this.props.request.zip}`}</td>
                    <td>{this.props.request.phone_number.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}</td> {/*format number of type String with hyphens using regex*/}
                    <td>{this.props.request.equipment_in_request}</td>
                    <td>{this.props.request.purpose}</td>
                    <td>{this.props.request.applied_date}</td>
                    <td>{this.props.request.start_date} to {this.props.request.end_date}</td>
                    <td>
                        {/* <select name='requestStatus' onChange={this.handleChange}>
                            <option name='pending' value='PENDING' disabled selected>Pending</option>
                            <option name='approved' value='APPROVED'>Approved</option>
                            <option name='rejected' value='REJECTED'>Rejected</option>
                        </select> */}
                        <Select
                            onChange={this.handleChange}
                            className="basic-single"
                            classNamePrefix="select"
                            value={this.state.currentEquipmentItemStatus}
                            name="requestStatus"
                            options={this.state.selectOptions}
                        />
                    </td>
                </tr>

            </>
        )
    }
}

export default connect()(RequestItem);

