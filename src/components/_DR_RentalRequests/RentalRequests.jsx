import React, { Component } from "react";

class RentalRequests extends Component {
  state = {
    requestStatus: "",
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    return (
      <>
        <h1>Rental Requests</h1>

        <br />

        <table>
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

          <tr>
            <td>Dr. Eggman</td>
            <td>Eggman Enterprises</td>
            <td>Space Colony Ark</td>
            <td>1-123-NOTYOURBUSINESSSONIC</td>
            <td>Complete Chaos Emerald Set</td>
            <td>World Domination</td>
            <td>11/22/2020</td>
            <td>11/23/2020 thru 11/23/2021</td>
            <td>
              <select name="requestStatus">
                <option>Pending...</option>
                <option>Approved</option>
                <option>Rejected</option>
                <option>Archived</option>
              </select>
            </td>
          </tr>
        </table>
      </>
    );
  }
}

export default RentalRequests;
