import React, { Component } from "react";

class SubmissionForm extends Component {
  state = {
    pointOfContact: "",
    location: "",
    phoneNumber: "",
    practiceCompany: "",
    address: "",
    purposeForRequest: "",
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    return (
      <>
        <h1>Submission Form</h1>

        <br />

        <input
          type="text"
          name="pointOfContact"
          placeholder="Full name"
          value={this.state.pointOfContact}
          onChange={this.handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={this.state.location}
          onChange={this.handleChange}
        />

        <br />

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone number"
          value={this.state.phoneNumber}
          onChange={this.handleChange}
        />
        <input
          type="text"
          name="practiceCompany"
          placeholder="Practice/Company"
          value={this.state.practiceCompany}
          onChange={this.handleChange}
        />

        <br />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={this.state.address}
          onChange={this.handleChange}
        />
        <input
          type="text"
          name="purposeForRequest"
          placeholder="Purpose for request"
          value={this.state.purposeForRequest}
          onChange={this.handleChange}
        />
      </>
    );
  }
}

export default SubmissionForm;
