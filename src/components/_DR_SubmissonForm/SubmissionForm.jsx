import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

import Select from 'react-select';

class SubmissionForm extends Component {
  state = {
    pointOfContact: "",
    location: "",
    phoneNumber: "",
    practiceCompany: "",
    address: "",
    purposeForRequest: "",
    startDate: new Date(),
    endDate: new Date(),
    availableEquipment: [],
    arrOptions: [],
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleDateChange = (dateParam, date) => {
    if (dateParam === "startDate" && date <= this.state.endDate) { // if we are editing the startDate, check that the parameter is less than or equal to the endDate
      this.setState({ startDate: date });
      this.fetchAvailableEquipment(date, this.state.endDate); //due to asynchonous nature of setting state
    }
    else if (dateParam === "endDate" && date >= this.state.startDate) { // if we are editing the endDate, check that the parameter is greater than the startDate
      this.setState({ endDate: date });
      this.fetchAvailableEquipment(this.state.startDate, date); //due to asynchonous nature of setting state
    }
    
  };

  fetchAvailableEquipment = (startDate, endDate) => {
    axios
      .post("/api/inventory/all-inventory-by-date-range/", {
        startDate,
        endDate
      })
      .then((res) => {
        this.setState({ availableEquipment: res.data });
        console.log(res.data);
        const options = res.data.map((equipmentObj) => {
          return { value: equipmentObj.id, label: equipmentObj.equipment_item }
        });
        this.setState({ arrOptions: options});
      })
      .catch((err) => console.log(err));
  };

  render() {
    console.log(this.state.arrOptions);
    return (
      <>
        <h1>Dental Rental Request</h1>

        Start Date:
        <DatePicker selected={this.state.startDate} onChange={(date) => this.handleDateChange("startDate", date)} />

        End Date:
        <DatePicker selected={this.state.endDate} onChange={(date) => this.handleDateChange("endDate", date)} />

        <br />
        
        <Select
            isMulti
            name="available-equipment"
            options={this.state.arrOptions}
            className="basic-multi-select"
            classNamePrefix="select"
          />

        <input
          type="text"
          name="pointOfContact"
          placeholder="Full name"
          value={this.state.pointOfContact}
          onChange={this.handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
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
