import React, { Component } from "react";
import { connect } from 'react-redux';

import RequestItem from './RequestItem';

class RentalRequests extends Component {
  state = {
    requestStatus: "",
  };

  componentDidMount() {
    this.getRequests();
  };

  getRequests = () => {
    this.props.dispatch({
      type: 'FETCH_REQUESTS',
    });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {

    console.log(this.props.requests);

    return (
      <>
        <h1>Rental Requests</h1>

        <br />

        <table>
          <thead>
            <tr>
              <th>Contact</th>
              <th>Company</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Equipment</th>
              <th>Purpose</th>
              <th>Applied Date</th>
              <th>Requested Dates</th>
              <th>Application Status</th>
            </tr>
          </thead>

          <tbody>

            {this.props.requests !== undefined && this.props.requests.map((request) => {
              return (
                <RequestItem request={request} key={request.id} />
              )
            })}

          </tbody>

        </table>
      </>
    );
  }
}

const mapStoreToProps = (reduxState) => ({
  requests: reduxState.rentalRequestsReducer,
});

export default connect(mapStoreToProps)(RentalRequests);