import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

import Select from 'react-select';
import { Form, Button } from "react-bootstrap";

class SubmissionForm extends Component {
  state = {
    pointOfContact: "",
    city: "",
    phoneNumber: "",
    practiceCompany: "",
    address: "",
    purposeForRequest: "",
    startDate: new Date(),
    endDate: new Date(),
    availableEquipment: [],
    arrOptions: [],
    currentlySelectedEquipment: "",
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log('in submit')
    if (!(this.state.currentlySelectedEquipment)) {
      alert("Error: you cannot submit a form without selected equipment.");
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSelect = (arrOfSelectedEquipment) => {
    this.setState({currentlySelectedEquipment: arrOfSelectedEquipment})
  };

  handleDateChange = (dateParam, date) => {
    if (dateParam === "startDate" && date <= this.state.endDate) { // if we are editing the startDate, check that the parameter is less than or equal to the endDate
      this.setState({ startDate: date });
      this.fetchAvailableEquipment(date, this.state.endDate); //due to asynchonous nature of setting state
      this.setState({ currentlySelectedEquipment: "" }); // if the user decides to change the date, we need to remove the currently selected equipment bc it is no longer valid!
    }
    else if (dateParam === "endDate" && date >= this.state.startDate) { // if we are editing the endDate, check that the parameter is greater than the startDate
      this.setState({ endDate: date });
      this.fetchAvailableEquipment(this.state.startDate, date); //due to asynchonous nature of setting state
      this.setState({ currentlySelectedEquipment: "" }); // if the user decides to change the date, we need to remove the currently selected equipment bc it is no longer valid!
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
        const options = res.data.map((equipmentObj) => {
          return { value: equipmentObj.id, label: equipmentObj.equipment_item, ...equipmentObj } //value allows us to select the correct equipment by using its id
        }); //value and label are keys that are required for the react-select dropdown menu
        this.setState({ arrOptions: options}); //arrOptions needed for React-Select's Select tag
      })
      .catch((err) => console.log(err));
  };

  render() {
    console.log(this.state.currentlySelectedEquipment);
    return (
      <>
        <h1>Dental Rental Request</h1>

        <Form onSubmit={this.handleSubmit}>
        Start Date:
        <DatePicker required selected={this.state.startDate} onChange={(date) => this.handleDateChange("startDate", date)} />

        End Date:
        <DatePicker required selected={this.state.endDate} onChange={(date) => this.handleDateChange("endDate", date)} />

        <br />
        
        <Select
          isMulti
          name="available-equipment"
          options={this.state.arrOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={this.handleSelect}
          value={this.state.currentlySelectedEquipment || ""} //this allows for validating date changes
          />

        <input
          type="text"
          name="pointOfContact"
          placeholder="Full name"
          value={this.state.pointOfContact}
          onChange={this.handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={this.state.location}
          onChange={this.handleChange}
          required
        />

        <br />

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone number"
          value={this.state.phoneNumber}
          onChange={this.handleChange}
          required
        />
        <input
          type="text"
          name="practiceCompany"
          placeholder="Practice/Company"
          value={this.state.practiceCompany}
          onChange={this.handleChange}
          required
        />

        <br />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={this.state.address}
          onChange={this.handleChange}
          required
        />
        <input
          type="text"
          name="purposeForRequest"
          placeholder="Purpose for request"
          value={this.state.purposeForRequest}
          onChange={this.handleChange}
          required
          />
          <Button type="submit">Submit Request</Button>
          </Form>
      </>
    );
  }
}

export default SubmissionForm;
